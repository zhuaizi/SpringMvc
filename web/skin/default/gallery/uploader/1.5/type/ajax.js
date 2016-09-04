/**
 * @fileoverview ajax�����ϴ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add(function(S, Node, UploadType,io) {
    var EMPTY = '',$ = Node.all,LOG_PREFIX = '[uploader-AjaxType]:';

    /**
     * @name AjaxType
     * @class ajax�����ϴ�
     * @constructor
     * @requires UploadType
     */
    function AjaxType(config) {
        var self = this;
        //���ø��๹�캯��
        AjaxType.superclass.constructor.call(self, config);
        self._setWithCredentials();
    }

    S.mix(AjaxType, /** @lends AjaxType.prototype*/{
        /**
         * �¼��б�
         */
        event : S.merge(UploadType.event,{
            PROGRESS : 'progress'
        })
    });
    //�̳���Base������getter��setterί����Base����
    S.extend(AjaxType, UploadType, /** @lends AjaxType.prototype*/{
        /**
         * �ϴ��ļ�
         * @param {File} fileData �ļ�����
         * @return {AjaxType}
         */
        upload : function(fileData) {
            var self = this;
            //�������ļ���Ϣ����ֱ���˳�
            if (!fileData) {
                S.log(LOG_PREFIX + 'upload()��fileData��������');
                return self;
            }
            var blobSize = self.get('blobSize');
            if(blobSize > 0){
                //�ֶ��ϴ�
                self._chunkedUpload(fileData);
            }else{
                self._fullUpload(fileData);
            }
            return self;
        },
        /**
         * ֹͣ�ϴ�
         * @return {AjaxType}
         */
        stop : function() {
            var self = this,ajax = self.get('ajax');
            if (!S.isObject(ajax)) {
                S.log(LOG_PREFIX + 'stop()��ioֵ����');
                return self;
            }
            //��ֹajax���󣬻ᴥ��error�¼�
            ajax.abort();
            self.fire(AjaxType.event.STOP);
            return self;
        },
        /**
         * ��ȡ������������˵�FormData
         * @param formData
         * @return {*}
         * @private
         */
        _getFormData: function (formData) {
            if ($.isArray(formData)) {
                return formData;
            }
            //window.postMessage �޷�ֱ�ӷ��� FormData
            //���Խ���ת������
            if (S.isObject(formData)) {
                formData = [];
                $.each(formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return formData;
        },
        /**
         * �����ϴ�ʱ����ҪЯ��cookies
         * @private
         */
        _setWithCredentials:function(){
            var self = this;
            var CORS = self.get('CORS');
            var ajaxConfig = self.get('ajaxConfig');
            S.mix(ajaxConfig,{xhrFields: {
                withCredentials: true
            }});
            return ajaxConfig;
        },
        /**
         * ����FormData����
         */
        _setFormData:function(){
            var self = this;
            try{
                self.set('formData', new FormData());
                self._processData();
            }catch(e){
                S.log(LOG_PREFIX + 'something error when reset FormData.');
            }
        },
        /**
         * ����FormData
         * @private
         */
        _resetFormData:function(){
            var self = this;
            self.set('formData', new FormData());
        },
        /**
         * �����ݸ��������˵Ĳ���
         */
        _processData : function() {
            var self = this,data = self.get('data'),
                formData = self.get('formData');
            //��������ӵ�FormData��ʵ����
            S.each(data, function(val, key) {
                formData.append(key, val);
            });
            self.set('formData', formData);
        },
        /**
         * ���ļ���Ϣ��ӵ�FormData��
         * @param {Object} file �ļ���Ϣ
         */
        _addFileData : function(file) {
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_addFileData()��file��������');
                return false;
            }
            var self = this;
            var formData = self.get('formData');
            var fileDataName = self.get('fileDataName');
            var fileName = file.name;
            formData.append(fileDataName, file,fileName);
            self.set('formData', formData);
            return formData;
        },
        /**
         * �ֶ��ϴ�
         * @param file
         * @return {boolean}
         * @private
         */
        _chunkedUpload:function(file){
            if(!S.isObject(file)) return false;
            var self = this;
            var ajaxConfig = self.get('ajaxConfig');
            var action = self.get('action');
            S.mix(ajaxConfig,{
                url:action
            });

            var size = file.size;
            //�Ѿ��ϴ����ֽ���
            var uploadedBytes = 0;
            var maxChunkSize = self.get('blobSize') || size;
            //���ݷֿ�API����ͬ������в�ͬʵ�֣�
            var slice = file.slice || file.webkitSlice || file.mozSlice;
            function upload(){
                //�ļ��п飬ÿ��Ĵ�СΪmaxChunkSize-uploadedBytes
                //http://dev.w3.org/2006/webapi/FileAPI/
                var blob = slice.call(
                    file,
                    uploadedBytes,
                    uploadedBytes + maxChunkSize,
                    file.type
                );
                //�ֿ���ļ���С
                var chunkSize = blob.size;

                //��������ͷ
                self._setContentDisposition(file.name);
                self._setContentRange(uploadedBytes,chunkSize,size);

                //���û��Զ����data��ӵ�FormData��
                self._setFormData();
                //��FormData����ļ�����
                self._addFileData(blob);
                S.mix(ajaxConfig,{
                    data:self.get('formData')
                });
                var ajax = io(ajaxConfig);
                ajax.then(function(data){
                    var result = data[0];
                    //upload success
                    //����Ѿ��ϴ����ļ���С
                    uploadedBytes = self._getUploadedBytes(ajax) || uploadedBytes + chunkSize;
                    //�ɷ������¼�
                    self.fire(AjaxType.event.PROGRESS, { 'loaded': uploadedBytes, 'total': size });
                    //����û���ϴ�����ļ��������ϴ�
                    if(uploadedBytes< size){
                        upload();
                    }else{
                        //�Ѿ��ϴ���ɣ��ɷ�success�¼�
                        self.fire(AjaxType.event.SUCCESS, {result : result});
                    }
                },function(data){
                    self._errorHandler(data,file);
                })
            }

            upload();
        },
        /**
         * �����ļ��ϴ�
         * @param file
         * @return {*}
         * @private
         */
        _fullUpload:function(file){
            var self = this;
            var ajaxConfig = self.get('ajaxConfig');
            //���û��Զ����data��ӵ�FormData��
            self._setFormData();
            //��FormData����ļ�����
            self._addFileData(file);
            S.mix(ajaxConfig,{
                data:self.get('formData'),
                url:self.get('action')
            });
            var ajax = io(ajaxConfig);
            ajax.then(function(data){
                //upload success
                var result = data[0];
                //�ϴ���ɣ��ɷ�success�¼�
                self.fire(AjaxType.event.SUCCESS, {result : result});
            },function(data){
                self._errorHandler(data,file);
            });
            self.set('ajax',ajax);
            return ajax;
        },
        /**
         * ajax�������ʱ�Ĵ���
         * @private
         */
        _errorHandler:function(data,file){
            var self = this;
            var result = {};
            var status = data[1];
            if(status == 'timeout'){
                result.msg = '����ʱ��';
                result.status = 'timeout';
            }
            self.fire(AjaxType.event.ERROR, {status:status,result : result,file:file});
        },
        /**
         * ����ajax���󷵻ص���ӦͷRange����ȡ�Ѿ��ϴ����ļ��ֽ���
         * @param ajax
         * @return {String}
         * @private
         */
        _getUploadedBytes:function(ajax){
            //��ȡ�������˷��ص���Ӧͷ��Range��
            var range = ajax.getResponseHeader('Range');
            var parts = range && range.split('-');
            var upperBytesPos = parts && parts.length > 1 && parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1;
        },
        /**
         * ���ô��䵽�����������ݷ�Χ����Content-Range
         * @param uploadedBytes �Ѿ��ϴ����ֽ���
         * @param chunkSize �ֿ�Ĵ�С
         * @param size �ļ��ܴ�С
         * @return {string}
         * @private
         */
        _setContentRange:function(uploadedBytes,chunkSize,size){
            //����ָ������ʵ���е�һ���ֵĲ���λ�ã���Ҳָʾ������ʵ��ĳ��ȡ��ڷ�������ͻ�����һ��������Ӧ��������������Ӧ���ǵķ�Χ������ʵ�峤�ȡ�һ���ʽ�� Content-Range: bytes (unitSPfirst byte pos) - [last byte pos]/[entity legth]
            //����Content-Range: bytes 123-456/801 //�ļ��Ǵ�0���㣬���Ա���-1
            //http://blog.chinaunix.net/uid-11959329-id-3088466.html
            var contentRange = 'bytes ' + uploadedBytes + '-' + (uploadedBytes + chunkSize - 1) + '/' + size;
            var self = this;
            var ajaxConfig = self.get('ajaxConfig');
            var headers= ajaxConfig.headers;
            headers['Content-Range'] = contentRange;
            return contentRange;
        },
        /**
         * ����Content-Disposition��MIME Э�����չ��MIME Э��ָʾ MIME �û����������ʾ���ӵ��ļ���
         * http://hi.baidu.com/water_qq/item/e257762575a1f70b76272cde
         * @param fileName �ļ���
         * @return {String}
         * @private
         */
        _setContentDisposition:function(fileName){
            return this._setRequestHeader('Content-Disposition','attachment; filename="' + encodeURI(fileName) + '"');
        },
        /**
         * ��������ͷ
         * @param name ͷ��
         * @param value ͷ��ֵ
         * @private
         */
        _setRequestHeader:function(name,value){
            var self = this;
            var ajaxConfig = self.get('ajaxConfig');
            ajaxConfig.headers[name] = value;
            self.set('ajaxConfig',ajaxConfig);
            return value;
        }
    }, {ATTRS : /** @lends AjaxType*/{
        /**
         * �����ݶ���
         */
        formData : {value : EMPTY},
        /**
         * ajax����
         */
        ajaxConfig : {value : {
            type : 'post',
            //�������FormData���������л�������
            processData : false,
            cache : false,
            dataType : 'json',
            contentType: false,
            //Ĭ�ϳ�ʱʱ��10��
            timeout:10,
            headers:{}
        }
        },
        /**
         * IO��ʵ��
         */
        ajax : {value : EMPTY},
        fileDataName : {value : EMPTY},
        form : {value : {}},
        fileInput : {value : EMPTY},
        /**
         * ���ļ����ݵĴ�С
         * @type Number
         * @default 0
         */
        blobSize:{value:0},
        /**
         * �Ƿ��ǿ����ϴ�
         */
        CORS:{value:false},
        /**
         * �Ƿ�ʹ��postMessage���������ļ�����
         */
        isUsePostMessage:{value:false}
    }
    });
    return AjaxType;
}, {requires:['node','./base','ajax']});
/**
 * changes:
 * ���ӣ�1.5
 *           - [+]�ع�ģ��
 *           - [+]���ӷֶ��ϴ�֧��
 *           - [+]����blobSize����
 *           - [+]����isUsePostMessage����
 *           - [+]����uploadedBytes����
 *           - [+]����timeout
 *           - [!]xhr���ñ��ajax
 */
