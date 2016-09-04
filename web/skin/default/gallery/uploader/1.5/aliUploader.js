/*
combined files : 

gallery/uploader/1.5/type/base
gallery/uploader/1.5/type/iframe
gallery/uploader/1.5/type/ajax
gallery/uploader/1.5/type/flash
gallery/uploader/1.5/button/base
gallery/uploader/1.5/plugins/ajbridge/ajbridge
gallery/uploader/1.5/plugins/ajbridge/uploader
gallery/uploader/1.5/button/swfButton
gallery/uploader/1.5/queue
gallery/uploader/1.5/index
gallery/uploader/1.5/token
gallery/uploader/1.5/aliUploader

*/
/**
 * @fileoverview �ϴ���ʽ��Ļ���
 * @author: ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/type/base',function(S, Node, Base) {
    var EMPTY = '',$ = Node.all;

    /**
     * @name UploadType
     * @class �ϴ���ʽ��Ļ��࣬����ͨ�õ��¼��ͷ�����һ�㲻ֱ�Ӽ���������¼�
     * @constructor
     * @extends Base
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {String} config.action *����������·��
     * @param {Object} config.data ���͸��������˵Ĳ������ϣ��ᱻת��hiddenԪ��post���������ˣ�
     *
     */
    function UploadType(config) {
        var self = this;
        //���ø��๹�캯��
        UploadType.superclass.constructor.call(self, config);
    }

    S.mix(UploadType, /** @lends UploadType*/{
        /**
         * �¼��б�
         */
        event : {
            //��ʼ�ϴ��󴥷�
            START : 'start',
            //ֹͣ�ϴ��󴥷�
            STOP : 'stop',
            //�ɹ�����
            SUCCESS : 'success',
            //�ϴ�ʧ�ܺ󴥷�
            ERROR : 'error'
        }
    });

    /**
     * @name UploadType#start
     * @desc  ��ʼ�ϴ��󴥷�
     * @event
     */
    /**
     * @name UploadType#stop
     * @desc  ֹͣ�ϴ��󴥷�
     * @event
     */
    /**
     * @name UploadType#success
     * @desc  �ϴ��ɹ��󴥷�
     * @event
     */
    /**
     * @name UploadType#error
     * @desc  �ϴ�ʧ�ܺ󴥷�
     * @event
     */
    //�̳���Base������getter��setterί����Base����
    S.extend(UploadType, Base, /** @lends UploadType.prototype*/{
        /**
         * �ϴ��ļ�
         */
        upload : function() {

        },
        /** 
         * ֹͣ�ϴ�
         */
        stop : function(){
            
        },
        /**
         * ����������˷��صĽ����
         * @private
         */
        _processResponse:function(responseText){
            var self = this;
            var filter = self.get('filter');
            var result = {};
            if(filter != EMPTY) responseText = filter.call(self,responseText);
            //��ʽ����json����
            if(S.isString(responseText)){
                try{
                    result = S.JSON.parse(responseText);
                    result = self._fromUnicode(result);
                }catch(e){
                    var msg = responseText + '�����ؽ����responseText��ʽ���Ϸ���';
                    S.log(msg);
                    self.fire('error',{status:-1, result:{msg:msg}});
                }
            }else if(S.isObject(responseText)){
                result = self._fromUnicode(responseText);
            }
            S.log('�������������' + S.JSON.stringify(result));
            return result;
        },
        /**
         * ��unicode������ת����������ʾ�����֣���Ϊ���޸�flash�������������⣩
         * @private
         */
        _fromUnicode:function(data){
            if(!S.isObject(data)) return data;
            _each(data);
            function _each(data){
                S.each(data,function(v,k){
                    if(S.isObject(data[k])){
                        _each(data[k]);
                    }else{
                        data[k] = S.isString(v) && S.fromUnicode(v) || v;
                    }
                });
            }
            return data;
        }

    }, {ATTRS : /** @lends UploadType.prototype*/{
        /**
         * ��������·��
         * @type String
         * @default ""
         */
        action : {value : EMPTY},
        /**
         * ���͸��������˵Ĳ������ϣ��ᱻת��hiddenԪ��post���������ˣ�
         * @type Object
         * @default {}
         */
        data : {value : {}},
        /**
         * �������˷��ص����ݵĹ�����
         * @type Function
         * @default ''
         */
        filter:{
            value:EMPTY
        }
    }});

    return UploadType;
}, {requires:['node','base']});
/**
 * @fileoverview iframe�����ϴ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/type/iframe',function(S, Node, UploadType) {
    var EMPTY = '',$ = Node.all,LOG_PREFIX = '[uploader-iframeType]:',ID_PREFIX = 'ks-uploader-iframe-';

    /**
     * @name IframeType
     * @class iframe�����ϴ���ȫ�����֧��
     * @constructor
     * @extends UploadType
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     *
     */
    function IframeType(config) {
        var self = this;
        //���ø��๹�캯��
        IframeType.superclass.constructor.call(self, config);
    }

    S.mix(IframeType, /**@lends IframeType*/ {
        /**
         * ���õ���htmlģ��
         */
        tpl : {
            IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
            FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',
            HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
        },
        /**
         * �¼��б�
         */
        event : S.mix(UploadType.event,{
            //����iframe��form�󴥷�
            CREATE : 'create',
            //ɾ��form�󴥷�
            REMOVE : 'remove'
        })
    });
    //�̳���Base������getter��setterί����Base����
    S.extend(IframeType, UploadType, /** @lends IframeType.prototype*/{
        /**
         * �ϴ��ļ�
         * @param {HTMLElement} fileInput �ļ�input
         */
        upload : function(fileInput) {
            var self = this,$input = $(fileInput),form;
            if (!$input.length) return false;
            self.fire(IframeType.event.START, {input : $input});
            self.set('fileInput', $input);
            //����iframe��form
            self._create();
            form = self.get('form');
            if(!form){
                S.log(LOG_PREFIX + 'form�ڵ㲻���ڣ�');
                return false;
            }
            //�ύ����iframe��
            form.getDOMNode().submit();
        },
        /**
         * ֹͣ�ϴ�
         * @return {IframeType}
         */
        stop : function() {
            var self = this,iframe = self.get('iframe');
            iframe.attr('src', 'javascript:"<html></html>";');
            self._remove();
            self.fire(IframeType.event.STOP);
            self.fire(IframeType.event.ERROR, {status : 'abort',msg : '�ϴ�ʧ�ܣ�ԭ��abort'});
            return self;
        },
        /**
         * ����������ת����hiddenԪ��
         * @param {Object} data ��������
         * @return {String} hiddenInputHtml hiddenԪ��htmlƬ��
         */
        dataToHidden : function(data) {
            if (!S.isObject(data) || S.isEmptyObject(data)) return '';
            var self = this,hiddenInputHtml = EMPTY,
                //hiddenԪ��ģ��
                tpl = self.get('tpl'),hiddenTpl = tpl.HIDDEN_INPUT;
            if (!S.isString(hiddenTpl)) return '';
            for (var k in data) {
                hiddenInputHtml += S.substitute(hiddenTpl, {'name' : k,'value' : data[k]});
            }
            return hiddenInputHtml;
        },
        /**
         * ����һ���յ�iframe�������ļ��ϴ����ύ�󷵻ط�����������
         * @return {NodeList}
         */
        _createIframe : function() {
            var self = this,
                //iframe��id
                id = ID_PREFIX + S.guid(),
                //iframeģ��
                tpl = self.get('tpl'),iframeTpl = tpl.IFRAME,
                existIframe = self.get('iframe'),
                iframe,$iframe;
            //���ж��Ƿ��Ѿ�����iframe������ֱ�ӷ���iframe
            if (!S.isEmptyObject(existIframe)) return existIframe;
            if (!S.isString(iframeTpl)) {
                S.log(LOG_PREFIX + 'iframe��ģ�岻�Ϸ���');
                return false;
            }
            if (!S.isString(id)) {
                S.log(LOG_PREFIX + 'id���������Ϊ�ַ������ͣ�');
                return false;
            }
            //���������ϴ���iframe
            iframe = S.substitute(tpl.IFRAME, { 'id' : id });
            $iframe = $(iframe);
            if(!self.get('domain')){
                //����iframe��load�¼�
                $iframe.on('load', self._iframeLoadHandler, self);
            }
            $('body').append($iframe);
            self.set('id',id);
            self.set('iframe', $iframe);
            $('body').data('UPLOAD_TYPE',self);
            return $iframe;
        },
        handleResult:function(result){
            var self = this;
            result = self._processResponse(result);
            self.fire(IframeType.event.SUCCESS, {result : result});
            self._remove();
        },
        /**
         * iframe������ɺ󴥷����ļ��ϴ�������
         */
        _iframeLoadHandler : function(ev) {
            var self = this,iframe = ev.target;
            var errorEvent = IframeType.event.ERROR;
            try{
                var doc = iframe.contentDocument || window.frames[iframe.id].document;
                if (!doc || !doc.body) {
                    self.fire(errorEvent, {msg : '�������˷������������⣡'});
                    return false;
                }
                var response = doc.body.innerHTML;
                //���Ϊֱ���˳�
                if(response == EMPTY) return false;
                self.handleResult(response);
            }catch (e){
                S.log(e);
            }
        },
        /**
         * �����ļ��ϴ���
         * @return {NodeList}
         */
        _createForm : function() {
            var self = this,
                //iframe��id
                id = self.get('id'),
                //formģ��
                tpl = self.get('tpl'),formTpl = tpl.FORM,
                //��Ҫ���͸��������˵�����
                data = self.get('data'),
                //�������˴����ļ��ϴ���·��
                action = self.get('action'),
                fileInput = self.get('fileInput'),
                hiddens,$form,form;
            if (!S.isString(formTpl)) {
                S.log(LOG_PREFIX + 'formģ�岻�Ϸ���');
                return false;
            }
            if (!S.isString(action)) {
                S.log(LOG_PREFIX + 'action�������Ϸ���');
                return false;
            }
            hiddens = self.dataToHidden(data);
           hiddens += self.dataToHidden({"type":"iframe"});
            form = S.substitute(formTpl, {'action' : action,'target' : id,'hiddenInputs' : hiddens});
            //��¡�ļ��򣬲���ӵ�form��
            $form = $(form).append(fileInput);
            $('body').append($form);
            self.set('form', $form);
            return $form;
        },
        /**
         * ����iframe��form
         */
        _create : function() {
            var self = this,
                iframe = self._createIframe(),
                form = self._createForm();
            self.fire(IframeType.event.CREATE, {iframe : iframe,form : form});
        },
        /**
         * �Ƴ���
         */
        _remove : function() {
            var self = this,form = self.get('form');
            if(!form)return false;
            //�Ƴ���
            form.remove();
            //����form����
            self.reset('form');
            self.fire(IframeType.event.REMOVE, {form : form});
        }
    }, {ATTRS : /** @lends IframeType.prototype*/{
        /**
         * iframe�������õ���htmlģ�壬һ�㲻��Ҫ�޸�
         * @type {}
         * @default
         * {
         IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
         FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',
         HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
         }
         */
        tpl : {value : IframeType.tpl},
        /**
         * ֻ����������iframeid,idΪ����Զ�����
         * @type String
         * @default  'ks-uploader-iframe-' +���id
         */
        id : {value : ID_PREFIX + S.guid()},
        domain:{value:EMPTY},
        /**
         * iframe
         */
        iframe : {value : {}},
        form : {value : EMPTY},
        fileInput : {value : EMPTY}
    }});

    return IframeType;
}, {requires:['node','./base']});
/**
 * @fileoverview ajax�����ϴ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/type/ajax',function(S, Node, UploadType,io) {
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
            debugger;
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
/**
 * @fileoverview flash�ϴ���������������д��ajbridge�ڵ�uploader
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/type/flash',function (S, Node, UploadType) {
    var EMPTY = '', LOG_PREFIX = '[uploader-FlashType]:';
    /**
     * @name FlashType
     * @class flash�ϴ���������������д��ajbridge�ڵ�uploader
     * @constructor
     * @extends UploadType
     * @requires Node
     */
    function FlashType(config) {
        var self = this;
        //���ø��๹�캯��
        FlashType.superclass.constructor.call(self, config);
        self.isHasCrossdomain();
        self._init();
    }

    S.mix(FlashType, /** @lends FlashType.prototype*/{
        /**
         * �¼��б�
         */
        event:S.merge(UploadType.event, {
            //swf�ļ��Ѿ�׼������
            SWF_READY: 'swfReady',
            //�����ϴ�
            PROGRESS:'progress'
        })
    });

    S.extend(FlashType, UploadType, /** @lends FlashType.prototype*/{
        /**
         * ��ʼ��
         */
        _init:function () {
            var self = this, swfUploader = self.get('swfUploader');
            if(!swfUploader){
                S.log(LOG_PREFIX + 'swfUploader����Ϊ�գ�');
                return false;
            }
            //SWF ����׼������
            swfUploader.on('contentReady', function(ev){
                self.fire(FlashType.event.SWF_READY);
            }, self);
            //������ʼ�ϴ��¼�
            swfUploader.on('uploadStart', self._uploadStartHandler, self);
            //�����ļ������ϴ��¼�
            swfUploader.on('uploadProgress', self._uploadProgressHandler, self);
            //�����ļ��ϴ�����¼�
            swfUploader.on('uploadCompleteData',self._uploadCompleteDataHandler,self);
            //�����ļ�ʧ���¼�
            swfUploader.on('uploadError',self._uploadErrorHandler,self);
        },
        /**
         * �ϴ��ļ�
         * @param {String} id �ļ�id
         * @return {FlashType}
         */
        upload:function (id) {
            var self = this, swfUploader = self.get('swfUploader'),
                action = self.get('action'), method = 'POST',
                data = self.get('data'),
                name = self.get('fileDataName');
            if(!name) name = 'Filedata';
            self.set('uploadingId',id);
            S.mix(data,{"type":"flash"});
            swfUploader.upload(id, action, method, data,name);
            return self;
        },
        /**
         * ֹͣ�ϴ��ļ�
         * @return {FlashType}
         */
        stop:function () {
            var self = this, swfUploader = self.get('swfUploader'),
                uploadingId = self.get('uploadingId');
            if(uploadingId != EMPTY){
                swfUploader.cancel(uploadingId);
                self.fire(FlashType.event.STOP, {id : uploadingId});
            }
            return self;
        },
        /**
         * ��ʼ�ϴ��¼�������
         * @param {Object} ev ev.file���ļ�����
         */
        _uploadStartHandler : function(ev){
            var self = this;
            self.fire(FlashType.event.START, {'file' : ev.file });
        },
        /**
         * �ϴ����¼�������
         * @param {Object} ev
         */
        _uploadProgressHandler:function (ev) {
            var self = this;
            S.mix(ev, {
                //�Ѿ���ȡ���ļ��ֽ���
                loaded:ev.bytesLoaded,
                //�ļ��ܹ��ֽ���
                total : ev.bytesTotal
            });
            S.log(LOG_PREFIX + '�Ѿ��ϴ��ֽ���Ϊ��' + ev.bytesLoaded);
            self.fire(FlashType.event.PROGRESS, { 'loaded':ev.loaded, 'total':ev.total });
        },
        /**
         * �ϴ���ɺ��¼�������
         * @param {Object} ev
         */
        _uploadCompleteDataHandler : function(ev){
            var self = this;
            var result = self._processResponse(ev.data);
            self.set('uploadingId',EMPTY);
            self.fire(FlashType.event.SUCCESS, {result : result});
        },
        /**
         *�ļ��ϴ�ʧ�ܺ��¼�������
         */
        _uploadErrorHandler : function(ev){
            var self = this;
            self.set('uploadingId',EMPTY);
            self.fire(FlashType.event.ERROR, {msg : ev.msg});
        },
        /**
         * Ӧ���Ƿ���flash��������ļ�
         */
        isHasCrossdomain:function(){
            var domain = location.hostname;
             S.io({
                 url:'http://' + domain + '/crossdomain.xml',
                 dataType:"xml",
                 error:function(){
                     S.log('ȱ��crossdomain.xml�ļ�����ļ����Ϸ���');
                 }
             })
        }
    }, {ATTRS:/** @lends FlashType*/{
        /**
         * ��������·��������flash�����Ǿ���·��
         */
        action:{
            value:EMPTY,
            getter:function(v){
                var reg = /^http/;
                //���Ǿ���·��ƴ�ӳɾ���·��
                if(!reg.test(v)){
                     var href = location.href,uris = href.split('/'),newUris;
                    newUris  = S.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        /**
         * ajbridge��uploader�����ʵ�����������
         */
        swfUploader:{value:EMPTY},
        /**
         * �����ϴ����ļ�id
         */
        uploadingId : {value : EMPTY}
    }});
    return FlashType;
}, {requires:['node', './base']});
/**
 * @fileoverview �ļ��ϴ���ťbase
 * @author: ��Ӣ(����)<daxingplay@gmail.com>, ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/button/base',function(S, Node, Base) {
    var EMPTY = '',
        LOG_PREFIX = '[Uploader-Button] ',
        $ = Node.all;
    /**
     * @name Button
     * @class �ļ��ϴ���ť��ajax��iframe�ϴ���ʽʹ��
     * @constructor
     * @extends Base
     * @param {String} target *��Ŀ��Ԫ��
     * @param {Object} config ���ö���
     * @param {String} config.name  *�����صı��ϴ����nameֵ
     * @param {Boolean} config.disabled �Ƿ���ð�ť
     * @param {Boolean} config.multiple �Ƿ�����ѡ֧��
     */
    function Button(target, config) {
        var self = this;
        config = S.merge({target:$(target)}, config);
        //�����ʼ��
        Button.superclass.constructor.call(self, config);
    }

    S.mix(Button, {
        //֧�ֵ��¼�
        event : {
            'beforeShow': 'beforeShow',
            'afterShow': 'afterShow',
            'beforeHide': 'beforeHide',
            'afterHide': 'afterHide',
            'beforeRender' : 'beforeRender',
            'afterRender' : 'afterRender',
            'CHANGE' : 'change'
        },
        /**
         * ��ȡ�ļ����ƣ��ӱ����ֵ����ȡ��
         * @param {String} path �ļ�·��
         * @return {String}
         */
        getFileName : function(path) {
            return path.replace(/.*(\/|\\)/, "");
        }
    });

    S.extend(Button, Base, /** @lends Button.prototype*/{
        /**
         * ����
         * @return {Button} Button��ʵ��
         */
        render : function() {
            var self = this;
            var srcFileInput = self.get('srcFileInput');
            if(!srcFileInput || !srcFileInput.length){
                S.log('[Button]fileԪ�ز����ڣ�');
                return self;
            }
            var newSrcFileInput = srcFileInput.clone();
            newSrcFileInput.addClass('file-input');
            srcFileInput.remove();
            self.set('srcFileInput',newSrcFileInput);
            self._createInput();
        },
        /**
         * ��ʾ��ť
         * @return {Button} Button��ʵ��
         */
        show : function() {
            var self = this, target = self.get('target');
            target.show();
            self.fire(Button.event.afterShow);
            return Button;
        },
        /**
         * ���ذ�ť
         * @return {Button} Button��ʵ��
         */
        hide : function() {
            var self = this, target = self.get('target');
            target.hide();
            self.fire(Button.event.afterHide);
            return Button;
        },
        /**
         * ���ð�ť
         * @return {Button} Button��ʵ��
         */
        reset : function() {
            var self = this;
            var inputContainer = self.get('inputContainer');
            //�Ƴ����ϴ�������
            $(inputContainer).remove();
            self.set('inputContainer', EMPTY);
            self.set('fileInput', EMPTY);
            //���´������ϴ���
            self._createInput();
            return self;
        },
        /**
         * �������صı��ϴ���
         * @return {HTMLElement} �ļ��ϴ�������
         */
        _createInput : function() {
            var self = this;
            var target = self.get('target');
            var name = self.get('name');
            var tpl = self.get('tpl');
            var inputContainer;
            if (!S.isString(tpl)) return false;
            var srcFileInput = self.get('srcFileInput');
            if(!srcFileInput.length) return false;
            //��¡����ʾ�ļ��ϴ���
            var fileInput = srcFileInput.clone();
            self.set('fileInput',fileInput);

            var $inputContainer = $(tpl);
            $inputContainer.append(fileInput);
            //��body��ӱ��ļ��ϴ���
            $inputContainer.appendTo(target);
            //TODO:IE6��ֻ��ͨ���ű���������ʽ���ܿ��ư�ť��С
            if(S.UA.ie == 6) fileInput.css('fontSize','400px');
            //TODO:firefox��fontSize��ռ��ȣ������������left
            //if(S.UA.firefox)  fileInput.css('left','-1200px');
            //�ϴ����ֵ�ı�󴥷�
            $(fileInput).on('change', self._changeHandler, self);
            self.set('inputContainer', $inputContainer);
            //���ð�ť
            self._setDisabled(self.get('disabled'));
            //���ƶ�ѡ
            self._setMultiple(self.get('multiple'));
            return $inputContainer;
        },
        /**
         * �ļ��ϴ����ֵ�ı�ʱ����
         * @param {Object} ev �¼�����
         */
        _changeHandler : function(ev) {
            var self = this,
                fileInput = self.get('fileInput'),
                value = $(fileInput).val(),
                //IEȡ����files
                oFiles = ev.target.files,files = [];
            if (value == EMPTY) {
                S.log(LOG_PREFIX + 'No file selected.');
                return false;
            }
            if(oFiles){
                S.each(oFiles,function(v){
                    if(S.isObject(v)){
                        files.push({'name' : v.name,'type' : v.type,'size' : v.size,data:v});
                    }
                });
            }else{
                files.push({'name' : Button.getFileName(value)});
            }
            self.fire(Button.event.CHANGE, {
                files: files,
                input: fileInput.getDOMNode()
            });
            self.reset();
        },
        /**
         * �����ϴ�����Ľ���
         * @param {Boolean} disabled �Ƿ����
         * @return {Boolean}
         */
        _setDisabled : function(disabled){
            var self = this,
                cls = self.get('cls'),disabledCls = cls.disabled,
                $target = self.get('target'),
                input = self.get('fileInput');
            if(!$target.length || !S.isBoolean(disabled)) return false;
            if(!disabled){
                $target.removeClass(disabledCls);
                $(input).show();
            }else{
                $target.addClass(disabledCls);
                $(input).hide();
            }
            return disabled;
        },
        /**
         * �����ϴ�����Ľ���
         * @param {Boolean} multiple �Ƿ����
         * @return {Boolean}
         */
        _setMultiple : function(multiple){
            var self = this,fileInput = self.get('fileInput');
            if(!fileInput.length) return false;
            multiple && fileInput.attr('multiple','multiple') || fileInput.removeAttr('multiple');
            return multiple;
        }
    }, {
        ATTRS : /** @lends Button.prototype */{
            /**
             * ��ťĿ��Ԫ��
             * @type KISSY.Node
             * @default null
             */
            target: {
                value: null
            },
            /**
             * ���ϴ���Ŀ�¡Ԫ��
             */
            fileInput: {
                value: EMPTY
            },
            /**
             * ���ϴ���
             */
            srcFileInput:{
                value:EMPTY
            },
            /**
             * �ļ��ϴ�������
             * @type KISSY.Node
             * @default ""
             */
            inputContainer: {
                value: EMPTY
            },
            /**
             * ���صı��ϴ����ģ��
             * @type String
             */
            tpl : {
                value : '<div class="file-input-wrapper" style="overflow: hidden;"></div>'
            },
            /**
             * ���صı��ϴ����nameֵ
             * @type String
             * @default "fileInput"
             */
            name : {
                value : 'fileInput',
                setter : function(v) {
                    if (this.get('fileInput')) {
                        $(this.get('fileInput')).attr('name', v);
                    }
                    return v;
                }
            },
            /**
             * �Ƿ����,falseΪ����
             * @type Boolean
             * @default false
             */
            disabled : {
                value : false,
                setter : function(v) {
                    this._setDisabled(v);
                    return v;
                }
            },
            /**
             * �Ƿ�����ѡ֧�֣���ѡĿǰ�м��������⣬�������
             * @type Boolean
             * @default true
             */
            multiple : {
                value : true,
                setter : function(v){
                    this._setMultiple(v);
                    return v;
                }
            },
            /**
             * ��ʽ
             * @type Object
             * @default  { disabled : 'uploader-button-disabled' }
             */
            cls : {
                value : {
                    disabled : 'uploader-button-disabled'
                }
            }
        }
    });

    return Button;

}, {
    requires:[
        'node',
        'base'
    ]
});
/**
 * changes:
 * ���ӣ�1.5
 *      - [!]fileInputʹ��clone
 *      - [+]����srcFileInput
 */

/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * AJBridge Class
 * @author kingfo oicuicu@gmail.com
 */
KISSY.add('gallery/uploader/1.5/plugins/ajbridge/ajbridge',function(S,Flash,Event) {

    var ID_PRE = '#',
        VERSION = '1.0.15',
		PREFIX = 'ks-ajb-',
		LAYOUT = 100,
        EVENT_HANDLER = 'KISSY.AJBridge.eventHandler'; // Flash �¼��׳�����ͨ��

    /**
     * @constructor
     * @param {String} id       ע��Ӧ������ id
     * @param {Object} config   ��������ͬ S.Flash �� config
     * @param {Boolean} manual  �ֶ����� init
     */
    function AJBridge(id, config,manual) {
        id = id.replace(ID_PRE, ''); // ��׳�Կ��ǡ����� KISSY ϰ�߲��� id ѡ����
        config = Flash._normalize(config||{}); // ��׼�������ؼ���

        var self = this,
            target = ID_PRE + id, // ֮����Ҫ��ʹ�� id������Ϊ��ʹ�� ajbridge ʱ������Ա�Լ�Ӧ����ȷ��֪���Լ�����ʲô
            callback = function(data) {
                if (data.status < 1) {
                    self.fire('failed', { data: data });
                    return;
                }
				
                S.mix(self, data);

                // ִ�м��� ��̬ģʽ�� flash
                // ����� AJBridge ���� DOMReady ǰִ�� ��ʧЧ
                // ������� S.ready();
                if (!data.dynamic || !config.src) {
						self.activate();
                }
            };
		
		// �Զ����� id	
		config.id = config.id || S.guid(PREFIX);

        // ע��Ӧ��ʵ��
        AJBridge.instances[config.id] = self;

        //	��̬��ʽ
        if (config.src) {
            // ǿ�ƴ� JS ������Ȩ��AJBridge �������Ҫ��
            config.params.allowscriptaccess = 'always';
            config.params.flashvars = S.merge(config.params.flashvars, {
                // ���� JS ���
                jsEntry: EVENT_HANDLER,
                // ��Ȼ Flash ͨ�� ExternalInterface ��� obejctId
                // ������Ȼ���ڼ���������, �����Ҫֱ�Ӹ���
                swfID: config.id
            });
        }

        // ֧�־�̬��ʽ������Ҫ���������������Ѿ�̬д��
        // ���Բο� test.html
		
        // ������ȫ�����¼����ƣ������Ҫͨ������֮����г�ʼ�� Flash
		
        if(manual)self.__args = [target, config, callback];
		else S.later(Flash.add,LAYOUT,false,Flash,[target, config, callback]);
    }

    /**
     * ��̬����
     */
    S.mix(AJBridge, {

        version: VERSION,

        instances: { },

        /**
         * �������� AJBridge �Ѷ�����¼�
         * @param {String} id            swf����������ID
         * @param {Object} event        swf�������¼�
         */
        eventHandler: function(id, event) {
            var instance = AJBridge.instances[id];
            if (instance) {
                instance.__eventHandler(id, event);
            }
        },

        /**
         * ����ע�� SWF �����ķ���
         * @param {Class} C
         * @param {String|Array} methods
         */
        augment: function (C, methods) {
            if (S.isString(methods)) {
                methods = [methods];
            }
            if (!S.isArray(methods)) return;
			
			

            S.each(methods, function(methodName) {
                C.prototype[methodName] = function() {
                    try {
                        return this.callSWF(methodName, S.makeArray(arguments));
                    } catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                        this.fire('error', { message: e });
                    }
                }
            });
        }
    });

    S.augment(AJBridge, Event.Target, {

        init: function() {
			if(!this.__args)return;
            Flash.add.apply(Flash, this.__args);
			this.__args = null;
			delete this.__args; // ��ֹ�ظ����
        },

        __eventHandler: function(id, event) {
            var self = this,
                type = event.type;
			
            event.id = id;   //	�ֲ����� id ʹ��
            switch(type){
				case "log":
					 S.log(event.message);
					break;
				default:
					self.fire(type, event);
			}
			
        },

        /**
         * Calls a specific function exposed by the SWF's ExternalInterface.
         * @param func {String} the name of the function to call
         * @param args {Array} the set of arguments to pass to the function.
         */
        callSWF: function (func, args) {
            var self = this;
            args = args || [];
            try {
                if (self.swf[func]) {
                    return self.swf[func].apply(self.swf, args);
                }
            }
            // some version flash function is odd in ie: property or method not supported by object
            catch(e) {
                var params = '';
                if (args.length !== 0) {
                    params = "'" + args.join("','") + "'";
                }
                //avoid eval for compressiong
                return (new Function('self', 'return self.swf.' + func + '(' + params + ');'))(self);
            }
        }
    });

    // Ϊ��̬������̬ע��
    // ע�⣬ֻ���� S.ready() ����� AJBridge ע�����Ч��
    AJBridge.augment(AJBridge, ['activate', 'getReady','getCoreVersion']);

    window.AJBridge = S.AJBridge = AJBridge;

    return AJBridge;
}, { requires:["gallery/flash/1.0/index",'event'] });
/**
 * NOTES:
 * 20120117 ��ֲ��kissy1.2.0��ģ�飨�����޸ģ�
 */

/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * @author kingfo  oicuicu@gmail.com
 */
KISSY.add('gallery/uploader/1.5/plugins/ajbridge/uploader',function(S,flash,A) {

    /**
     * @constructor
     * @param {String} id                                    ��Ҫע���SWFӦ��ID
     * @param {Object} config                                ������
     * @param {String} config.ds                             default server ����д
     * @param {String} config.dsp                            default server parameters ����д
     * @param {Boolean} config.btn                           ���ð�ťģʽ��Ĭ�� false
     * @param {Boolean} config.hand                          ��ʾ���ͣ�Ĭ�� false
     */
    function Uploader(id, config) {
        config = config || { };
        var flashvars = { };
		
		
		
		S.each(['ds', 'dsp', 'btn', 'hand'], function(key) {
			if(key in config) flashvars[key] = config[key];
		});
		

        config.params = config.params || { };
        config.params.flashvars = S.merge(config.params.flashvars, flashvars);

		Uploader.superclass.constructor.call(this, id, config);
    }

    S.extend(Uploader, A);

    A.augment(Uploader,
        [
            'setFileFilters',
            'filter',
            'setAllowMultipleFiles',
            'multifile',
            'browse',
            'upload',
            'uploadAll',
            'cancel',
            'getFile',
            'removeFile',
            'lock',
            'unlock',
            'setBtnMode',
            'useHand',
            'clear'
        ]
        );

    Uploader.version = '1.0.1';
    A.Uploader = Uploader;
    return A.Uploader;
},{ requires:["gallery/flash/1.0/index","./ajbridge"] });
/**
 * changes:
 * ���ӣ�1.4
 *           - flashģ��ĳ�gallery/flash/1.0/��flashģ��1.3���ٴ���
 */

/**
 * @fileoverview flash�ϴ���ť
 * @author: ��Ӣ(����)<daxingplay@gmail.com>, ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/button/swfButton',function (S, Node, Base, SwfUploader) {
    var EMPTY = '', $ = Node.all,
        SWF_WRAPPER_ID_PREVFIX = 'swf-uploader-wrapper-';

    /**
     * @name SwfButton
     * @class flash�ϴ���ť���������ص�AJBrige��ֻ��ʹ��flash�ϴ���ʽʱ��Ż�ʵ���������
     * @constructor
     * @extends Base
     */
    function SwfButton(target, config) {
        var self = this;
        config = S.merge({target:$(target)}, config);
        //���ø��๹�캯��
        SwfButton.superclass.constructor.call(self, config);
    }

    S.mix(SwfButton, /** @lends SwfButton*/{
        /**
         * ֧�ֵ��¼�
         */
        event:{
            //������к��¼�
            RENDER : 'render',
            //ѡ���ļ����¼�
            CHANGE:'change',
            //�����swf�л����¼�
            MOUSE_OVER:'mouseOver',
            //�����swf�а����¼�
            MOUSE_DOWN:'mouseDown',
            //�����swf�е����¼�
            MOUSE_UP:'mouseUp',
            //�����swf���ƿ��¼�
            MOUSE_OUT:'mouseOut',
            //��굥���¼�
            CLICK:'click'
        }
    });
    S.extend(SwfButton, Base, /** @lends SwfButton.prototype*/{
        /**
         *  ���У���ʵ����AJBrige��Uploader���洢ΪswfUploader����
         */
        render:function () {
            var self = this,
                $target = self.get('target'),
                swfUploader,
                multiple = self.get('multiple'),
                fileFilters = self.get('fileFilters') ;
            $target.css('position', 'relative');
            self.set('swfWrapper',self._createSwfWrapper());
            self._setFlashSizeConfig();
            swfUploader = self._initSwfUploader();
            //SWF ����׼������
            swfUploader.on('contentReady', function(ev){
                //��ֹ��δ���
                if(swfUploader.isContent) return;
                swfUploader.isContent = true;
                //��ѡ���ļ����˿���
                swfUploader.browse(multiple, fileFilters);
                //��������¼�
                self._bindBtnEvent();
                //����ѡ���ļ����¼�
                swfUploader.on('fileSelect', self._changeHandler, self);
                self._setDisabled(self.get('disabled'));
                self.fire(SwfButton.event.RENDER);
            }, self);
            var srcFileInput = self.get('srcFileInput');
            if(srcFileInput && srcFileInput.length){
                srcFileInput.remove();
            }
            return self;
        },
        /**
         * ����flash����
         */
        _createSwfWrapper:function () {
            var self = this,
                target = self.get('target'),
                tpl = self.get('tpl'),
                //����id
                id = self.get('swfWrapperId') != EMPTY && self.get('swfWrapperId') || SWF_WRAPPER_ID_PREVFIX + S.guid(),
                //����html
                html = S.substitute(tpl, {id:id});
            self.set('swfWrapperId', id);
            return $(html).appendTo(target);
        },
        /**
         * ��ʼ��ajbridge��uploader
         * @return {SwfUploader}
         */
        _initSwfUploader:function () {
            var self = this, flash = self.get('flash'),
                id = self.get('swfWrapperId'),
                swfUploader;
            S.mix(flash,{id:'swfUploader'+S.guid()});
            try {
                //ʵ����AJBridge.Uploader
                swfUploader = new SwfUploader(id, flash);
                self.set('swfUploader', swfUploader);
            } catch (err) {

            }
            return swfUploader;
        },
        /**
         * ����swf�ĸ�������¼�
         * @return {SwfButton}
         */
        _bindBtnEvent:function () {
            var self = this, event = SwfButton.event,
                swfUploader = self.get('swfUploader');
            if (!swfUploader) return false;
            S.each(event, function (ev) {
                swfUploader.on(ev, function (e) {
                    self.fire(ev);
                }, self);
            });
            return self;
        },
        /**
         * ����flash���ò���
         */
        _setFlashSizeConfig:function () {
            var self = this, flash = self.get('flash'),
                target = self.get('target'),
                size = self.get('size');
            if(!S.isEmptyObject(size)){
                S.mix(flash.attrs, size);
            }
            self.set('flash', flash);
        },
        /**
         * flash��ѡ�����ļ��󴥷����¼�
         */
        _changeHandler:function (ev) {
            var self = this
            if(self.get('swfUploader').id != ev.id) return;
            var files = ev.fileList;
            self.fire(SwfButton.event.CHANGE, {files:files});
        },
        /**
         * �����ϴ�����Ľ���
         * @param {Boolean} disabled �Ƿ����
         * @return {Boolean}
         */
        _setDisabled : function(disabled){
            var self = this,
                swfUploader = self.get('swfUploader'),
                cls = self.get('cls'),disabledCls = cls.disabled,
                $target = self.get('target'),
                $swfWrapper = self.get('swfWrapper');
            if(!swfUploader || !S.isBoolean(disabled)) return false;
            if(!disabled){
                $target.removeClass(disabledCls);
                //��ʾswf����
                $swfWrapper.css('top',0);
                //TODO:֮���Բ�ʹ�ø��򵥵�unlock()��������Ϊ�������Ӧ����Ч���п�����bug
                //swfUploader.unlock();
            }else{
                $target.addClass(disabledCls);
                //����swf����
                $swfWrapper.css('top','-3000px');
                //swfUploader.lock();
            }
            return disabled;
        },
        /**
         * ��ʾ��ť
         */
        show:function(){
             var self = this,
                 $target = self.get('target');
             $target.show();
        },
        /**
         * ���ذ�ť
         */
        hide:function(){
            var self = this,
                $target = self.get('target');
            $target.hide();
        }
    }, {ATTRS:/** @lends SwfButton.prototype*/{
        /**
         * ��ťĿ��Ԫ��
         * @type KISSY.Node
         * @default ""
         */
        target:{value:EMPTY},
        /**
         * swf����
         * @type KISSY.Node
         * @default ""
         */
        swfWrapper : {value : EMPTY},
        /**
         * swf������id�������ָ����ʹ�����id
         * @type Number
         * @default ""
         */
        swfWrapperId:{value:EMPTY},
        /**
         * flash����ģ��
         * @type String
         */
        tpl:{
            value:'<div id="{id}" class="uploader-button-swf" style="position: absolute;top:0;left:0;z-index:2000;"></div>'
        },
        /**
         * �Ƿ�����ѡ֧��
         * @type Boolean
         * @default true
         */
        multiple:{
            value:true,
            setter:function (v) {
                var self = this, swfUploader = self.get('swfUploader');
                if (swfUploader) {
                    swfUploader.multifile(v);
                }
                return v;
            }
        },
        /**
         * �ļ����ˣ���ʽ����[{desc:"JPG,JPEG,PNG,GIF,BMP",ext:"*.jpg;*.jpeg;*.png;*.gif;*.bmp"}]
         * @type Array
         * @default []
         */
        fileFilters:{
            value:[],
            setter:function (v) {
                var self = this, swfUploader = self.get('swfUploader');
                if(S.isObject(v)) v = [v];
                if (swfUploader && S.isArray(v)) {
                    S.later(function(){
                        swfUploader.filter(v);
                    },800);
                }
                return v;
            }
        },
        /**
         * ���ð�ť
         * @type Boolean
         * @default false
         */
        disabled : {
            value : false,
            setter : function(v){
                var self = this, swfUploader = self.get('swfUploader');
                if (swfUploader) {
                    self._setDisabled(v);
                }
                return v;
            }
        },
        /**
         * ��ʽ
         * @type Object
         * @default  { disabled:'uploader-button-disabled' }
         */
        cls : {
            value : { disabled:'uploader-button-disabled' }
        },
        /**
         * ǿ������flash�ĳߴ磬����{width:100,height:100}��Ĭ��Ϊ����Ӧ��ť�����ߴ�
         * @type Object
         * @default {}
         */
        size : {value:{} },
        /**
         * flash���ã�����swf�ļ���·�����÷ǳ��ؼ���ʹ��Ĭ��cdn�ϵ�·���ͺ�
         * @type Object
         * @default { src:'http://a.tbcdn.cn/s/kissy/gallery/uploader/1.5/plugins/ajbridge/uploader.swf', id:'swfUploader', params:{ bgcolor:"#fff", wmode:"transparent" }, attrs:{ }, hand:true, btn:true }
             }
         */
        flash:{
            value:{
                src:'http://a.tbcdn.cn/s/kissy/gallery/uploader/1.5/plugins/ajbridge/uploader.swf',
                id:'swfUploader',
                params:{
                    bgcolor:"#fff",
                    wmode:"transparent"
                },
                //����
                attrs:{
                    width:400,
                    height:400
                },
                //����
                hand:true,
                //���ð�ťģʽ,��������¼�
                btn:true
            }
        },
        /**
         *  ajbridge��uploader��ʵ��
         *  @type SwfUploader
         *  @default ""
         */
        swfUploader:{value:EMPTY},
        srcFileInput:{value:EMPTY}
    }});
    return SwfButton;
}, {requires:['node', 'base', '../plugins/ajbridge/uploader']});
/**
 * changes:
 * ���ӣ�1.5
 *      - [+]����srcFileInput
 */
/**
 * @fileoverview �ļ��ϴ������б���ʾ�ʹ���
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/queue',function (S, Node, Base) {
    var EMPTY = '', $ = Node.all, LOG_PREFIX = '[uploader-queue]:';

    /**
     * ת���ļ���С�ֽ���
     * @param {Number} bytes �ļ���С�ֽ���
     * @return {String} �ļ���С
     */
    function convertByteSize(bytes) {
        var i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
    }

    /**
     * @name Queue
     * @class �ļ��ϴ����У����ڴ洢�ļ�����
     * @constructor
     * @extends Base
     * @param {Object} config Queueû�б�д������
     * @param {Uploader} config.uploader Uploader��ʵ��
     * @example
     * S.use('gallery/uploader/1.5/queue/base,gallery/uploader/1.5/themes/default/style.css', function (S, Queue) {
     *    var queue = new Queue();
     *    queue.render();
     * })
     */
    function Queue(config) {
        var self = this;
        //���ø��๹�캯��
        Queue.superclass.constructor.call(self, config);
    }

    S.mix(Queue, /**@lends Queue*/ {
        /**
         * ֧�ֵ��¼�
         */
        event:{
            //������ļ��󴥷�
            ADD:'add',
            //��������ļ��󴥷�
            ADD_FILES:'addFiles',
            //ɾ���ļ��󴥷�
            REMOVE:'remove',
            //����������е��ļ��󴥷�
            CLEAR:'clear',
            //���ı��ļ�״̬�󴥷�
            FILE_STATUS : 'statusChange',
            //�����ļ����ݺ󴥷�
            UPDATE_FILE : 'updateFile'
        },
        /**
         * �ļ���״̬
         */
        status:{
            WAITING : 'waiting',
            START : 'start',
            PROGRESS : 'progress',
            SUCCESS : 'success',
            CANCEL : 'cancel',
            ERROR : 'error',
            RESTORE: 'restore'
        },
        //�ļ�Ψһidǰ׺
        FILE_ID_PREFIX:'file-'
    });
    /**
     * @name Queue#add
     * @desc  ������ļ��󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    /**
     * @name Queue#addFiles
     * @desc  ��������ļ��󴥷�
     * @event
     * @param {Array} ev.files ��Ӻ���ļ����ݼ���
     */
    /**
     * @name Queue#remove
     * @desc  ɾ���ļ��󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    /**
     * @name Queue#clear
     * @desc  ����������е��ļ��󴥷�
     * @event
     */
    /**
     * @name Queue#statusChange
     * @desc  ���ı��ļ�״̬�󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {String} ev.status �ļ�״̬
     */
    /**
     * @name Queue#updateFile
     * @desc  �����ļ����ݺ󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    //�̳���Base������getter��setterί����Base����
    S.extend(Queue, Base, /** @lends Queue.prototype*/{
        /**
         * ���ϴ���������ļ�
         * @param {Object | Array} files �ļ����ݣ���������ʱΪ�������
         * @example
         * //�����ļ�����
 var testFile = {'name':'test.jpg',
     'size':2000,
     'input':{},
     'file':{'name':'test.jpg', 'type':'image/jpeg', 'size':2000}
 };
 //���������ļ�
 queue.add(testFile);
         */
        add:function (files, callback) {
            var self = this,fileData={};
            //������ڶ���ļ�����Ҫ��������ļ�
            if (files.length > 0) {
                fileData=[];
                var uploader =self.get('uploader');
                var len = self.get('files').length;
                var hasMax = uploader.get('max') > 0;
                S.each(files,function(file, index){
                    if(!hasMax){
                        fileData.push(self._addFile(file));
                    }else{
                        //�����Ƿ񳬹��ж�
                        //#128 https://github.com/kissyteam/kissy-gallery/issues/128 by ����
                        var max = uploader.get('max');
                        if (max >= len + index + 1) {
                            fileData.push(self._addFile(file));
                        }
                    }
                });
            } else {
                fileData = self._addFile(files);
            }
            callback && callback.call(self);
            return fileData;
        },
        /**
         * �������ӵ����ļ�
         * @param {Object} file �ļ�����
         * @param {Function} callback �����ɺ�ִ�еĻص�����
         * @return {Object} �ļ����ݶ���
         */
        _addFile:function (file,callback) {
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_addFile()����file���Ϸ���');
                return false;
            }
            var self = this,
                //�����ļ�����
                fileData = self._setAddFileData(file),
                //�ļ�����
                index = self.getFileIndex(fileData.id),
                fnAdd = self.get('fnAdd');
            //ִ���û��Զ���Ļص�����
            if(S.isFunction(fnAdd)){
                fileData = fnAdd(index,fileData);
            }
            self.fire(Queue.event.ADD, {index:index, file:fileData,uploader:self.get('uploader')});
            callback && callback.call(self, index, fileData);
            return fileData;
        },
        /**
         * ɾ��������ָ��id���ļ�
         * @param {Number} indexOrFileId �ļ������������ļ�id
         * @param {Function} callback ɾ��Ԫ�غ�ִ�еĻص�����
         * @example
         * queue.remove(0);
         */
        remove:function (indexOrFileId, callback) {
            var self = this, files = self.get('files'), file;
            //�������ַ�����˵�����ļ�id���Ȼ�ȡ��Ӧ�ļ����������
            if (S.isString(indexOrFileId)) {
                indexOrFileId = self.getFileIndex(indexOrFileId);
            }
            //�ļ����ݶ���
            file = files[indexOrFileId];
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + 'remove()������indexΪ' + indexOrFileId + '���ļ�����');
                return false;
            }
            //����id���ļ����˵�
            files = S.filter(files, function (file, i) {
                return i !== indexOrFileId;
            });
            self.set('files', files);
            self.fire(Queue.event.REMOVE, {index:indexOrFileId, file:file});
            callback && callback.call(self,indexOrFileId, file);
            return file;
        },
        /**
         * �������
         */
        clear:function () {
            var self = this, files;
            _remove();
            //�Ƴ�Ԫ��
            function _remove() {
                files = self.get('files');
                if (!files.length) {
                    self.fire(Queue.event.CLEAR);
                    return false;
                }
                self.remove(0, function () {
                    _remove();
                });
            }
        },
        /**
         * ��ȡ�������ļ�״̬��Ĭ�ϵ����⹲�������ļ�״̬��'waiting'��'start'��'progress'��'success'��'cancel'��'error' ,ÿ��״̬��dom�������ͬ��ˢ���ļ�״̬ʱ��ͬʱˢ��״̬�������µ�DOM�ڵ����ݡ�
         * @param {Number} index �ļ����������ֵ
         * @param {String} status �ļ�״̬
         * @return {Object}
         * @example
         * queue.fileStatus(0, 'success');
         */
        fileStatus:function (index, status, args) {
            if (!S.isNumber(index)) return false;
            var self = this, file = self.getFile(index),
                theme = self.get('theme'),
                curStatus,statusMethod;
            if (!file) return false;
            //״̬
            curStatus = file['status'];
            if(!status){
                return curStatus;
            }
            //״̬һֱֱ�ӷ���
            if(curStatus == status) return self;
            //����״̬
            self.updateFile(index,{status:status});
            self.fire(Queue.event.FILE_STATUS,{index : index,status : status,args:args,file:file});
            return  self;
        },
        /**
         * ��ȡָ������ֵ�Ķ����е��ļ�
         * @param  {Number} indexOrId �ļ��ڶ����е�������id
         * @return {Object}
         */
        getFile:function (indexOrId) {
            var self = this;
            var file;
            var files = self.get('files');
            if(S.isNumber(indexOrId)){
                file = files[indexOrId];
            }else{
                S.each(files, function (f) {
                    if (f.id == indexOrId) {
                        file = f;
                        return true;
                    }
                });
            }
            return file;
        },
        /**
         * �����ļ�id�������ļ��ڶ����е�����
         * @param {String} fileId �ļ�id
         * @return {Number} index
         */
        getFileIndex:function (fileId) {
            var self = this, files = self.get('files'), index = -1;
            S.each(files, function (file, i) {
                if (file.id == fileId) {
                    index = i;
                    return true;
                }
            });
            return index;
        },
        /**
         * �����ļ����ݶ��������׷������
         * @param {Number} index �ļ������ڵ�����ֵ
         * @param {Object} data ����
         * @return {Object}
         */
        updateFile:function (index, data) {
            if (!S.isNumber(index)) return false;
            if (!S.isObject(data)) {
                S.log(LOG_PREFIX + 'updateFile()��data��������');
                return false;
            }
            var self = this, files = self.get('files'),
                file = self.getFile(index);
            if (!file) return false;
            S.mix(file, data);
            files[index] = file;
            self.set('files', files);
            self.fire(Queue.event.UPDATE_FILE,{index : index, file : file});
            return file;
        },
        /**
         * ��ȡ��ָ��״̬���ļ���Ӧ���ļ�����index������
         * @param {String} type ״̬����
         * @return {Array}
         * @example
         * //getFiles()��getFileIds()�������ǲ�ͬ�ģ�getFiles()���ƹ������飬��ȡ����ָ��״̬���ļ����ݣ���getFileIds()ֻ�ǻ�ȡָ��״̬�µ��ļ���Ӧ�����ļ������ڵ�����ֵ��
         * var indexs = queue.getFileIds('waiting');
         */
        getIndexs:function (type) {
            var self = this, files = self.get('files'),
                status, indexs = [];
            if (!files.length) return indexs;
            S.each(files, function (file, index) {
                if (S.isObject(file)) {
                    status = file.status;
                    //�ļ�״̬
                    if (status == type) {
                        indexs.push(index);
                    }
                }
            });
            return indexs;
        },
        /**
         * ��ȡָ��״̬�µ��ļ�
         * @param {String} status ״̬����
         * @return {Array}
         * @example
         * //��ȡ�ȴ��е������ļ�
         * var files = queue.getFiles('waiting');
         */
        getFiles:function (status) {
            var self = this, files = self.get('files'), statusFiles = [];
            if (!files.length) return [];
            S.each(files, function (file) {
                if (file && file.status == status) statusFiles.push(file);
            });
            return statusFiles;
        },
        /**
         * ����ļ�ʱ�����ļ����ݶ���׷��id��size������
         * @param {Object} file �ļ����ݶ���
         * @return {Object} �µ��ļ����ݶ���
         */
        _setAddFileData:function (file) {
            var self = this,
                files = self.get('files');
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_updateFileData()����file���Ϸ���');
                return false;
            }
            //�����ļ�Ψһid
            if (!file.id) file.id = S.guid(Queue.FILE_ID_PREFIX);
            //ת���ļ���С��λΪ��kb��mb��
            if (file.size) file.textSize = convertByteSize(file.size);
            //״̬
            if(!file.status) file.status = 'waiting';
            files.push(file);
            return file;
        }
    }, {ATTRS:/** @lends Queue.prototype*/{
        /**
         * ������ļ����ݺ�ִ�еĻص�����������add�¼�ǰ����
         * @type Function
         * @default  ''
         */
        fnAdd:{value:EMPTY},
        /**
         * �����������ļ����ݼ���
         * @type Array
         * @default []
         * @example
         * var ids = [],
         files = queue.get('files');
         S.each(files, function (file) {
         ids.push(file.id);
         });
         alert('�����ļ�id��' + ids);
         */
        files:{value:[]},
        /**
         * �ö��ж�Ӧ��Uploaderʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{value:EMPTY}
    }});

    return Queue;
}, {requires:['node', 'base']});
/**
 * changes:
 * ���ӣ�1.5
 *      - [!] #72 getFile()�����Ż�
 * ���ӣ�1.4
 *           - ȥ����Theme�����
 *           - ȥ��restore
 */
/**
 * @fileoverview �첽�ļ��ϴ����
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/index',function (S, Node, RichBase,JSON,UA,IframeType, AjaxType, FlashType, HtmlButton, SwfButton, Queue) {
    var LOG_PREFIX = '[uploader]:';
    var EMPTY = '';
    var $ = Node.all;
    var UPLOADER_FILES = 'text/uploader-files';
    /**
     * @name Uploader
     * @class �첽�ļ��ϴ������֧��ajax��flash��iframe���ַ���
     * @constructor
     */
    /**
     * @name Uploader#select
     * @desc  ѡ�����ļ��󴥷�
     * @event
     * @param {Array} ev.files �ļ����ļ��󷵻ص��ļ�����
     */

    /**
     * @name Uploader#add
     * @desc  ���������ļ��󴥷�
     * @since 1.4
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */

    /**
     * @name Uploader#start
     * @desc  ��ʼ�ϴ��󴥷�
     * @event
     * @param {Number} ev.index Ҫ�ϴ����ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */

    /**
     * @name Uploader#progress
     * @desc  �����ϴ���ʱ����������¼���iframe�ϴ���ʽ�в�����
     * @event
     * @param {Object} ev.file �ļ�����
     * @param {Number} ev.loaded  �Ѿ�������ɵ��ֽ���
     * @param {Number} ev.total  �ļ����ֽ���
     */

    /**
     * @name Uploader#complete
     * @desc  �ϴ���ɣ����ϴ��ɹ����ϴ�ʧ�ܺ󶼻ᴥ����
     * @event
     * @param {Number} ev.index �ϴ��е��ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     * @param {Object} ev.result �������˷��ص�����
     */

    /**
     * @name Uploader#success
     * @desc  �ϴ��ɹ��󴥷�
     * @event
     * @param {Number} ev.index �ϴ��е��ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     * @param {Object} ev.result �������˷��ص�����
     */

    /**
     * @name Uploader#error
     * @desc  �ϴ�ʧ�ܺ󴥷�
     * @event
     * @param {Number} ev.index �ϴ��е��ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     * @param {Object} ev.result �������˷��ص�����
     * @param {Object} ev.status �������˷��ص�״̬�룬status�����-1��˵����ǰ����֤���ص�ʧ��
     */

    /**
     * @name Uploader#cancel
     * @desc  ȡ���ϴ��󴥷�
     * @event
     * @param {Number} ev.index �ϴ��е��ļ��ڶ����е�����ֵ
     */

    /**
     * @name Uploader#uploadFiles
     * @desc  �����ϴ������󴥷�
     * @event
     */

    /**
     * @name Uploader#remove
     * @desc  �Ӷ�����ɾ���ļ��󴥷�
     * @since 1.4
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */

    /**
     * @name Uploader#themeLoad
     * @since 1.4
     * @desc ������غ󴥷�
     * @event
     */

    var Uploader = RichBase.extend(/** @lends Uploader.prototype*/{
        constructor:function (target, config) {
            var self = this;
            Uploader.superclass.constructor.call(self, config);
            self.set('target', target);
            self._init();
        },
        /**
         * @return {Uploader}
         */
        _init:function () {
            var self = this;

            var $target = self.get('target');
            if (!$target.length) {
                S.log('Ŀ��Ԫ�ز����ڣ�');
                return false;
            }
            //�ϴ�����ѡ��
            var type = self.get('type');
            var UploaderType = self.getUploadType(type);
            //����ģ�ⰴť����ʵ������ť��
            self._replaceBtn();
            self._renderButton();
            self._renderQueue();
            self._renderUploaderCore(UploaderType);
            return self;
        },
        /**
         * ��input�滻���ϴ���ť
         * @return {NodeList}
         * @private
         */
        _replaceBtn:function () {
            var self = this;
            var $btn = self.get('target');
            if (!$btn.length) return false;
            //��Ⱦģ�ⰴť
            var text = $btn[0].defaultValue || '�ϴ��ļ�';
            var btnHtml = S.substitute(self.get('btnTpl'), {text:text});
            var $aBtn = $(btnHtml).insertAfter($btn);
            //����ť��name���õ������ϣ�Buttonʵ�������õ���
            if(!self.get('name') && $btn.attr('name')){
                  self.set('name',$btn.attr('name'));
            }
            //����tagConfig���������ť�ϵ��������
            self.set('_oldInput',$btn.clone());
            self.set('fileInput',$btn);
            self.set('target', $aBtn);
            return $aBtn;
        },
        /**
         * �ϴ�ָ�������������ļ�
         * @param {Number} index �ļ���Ӧ�����ϴ����������ڵ�����ֵ
         * @example
         * //�ϴ������еĵ�һ���ļ���uploaderΪUploader��ʵ��
         * uploader.upload(0)
         */
        upload:function (index) {
            if (!S.isNumber(index)) return false;
            var self = this, uploadType = self.get('uploadType'),
                type = self.get('type'),
                queue = self.get('queue'),
                file = queue.get('files')[index],
                uploadParam;
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '����������ֵΪ' + index + '���ļ�');
                return false;
            }
            //������ļ������ϴ���������ֹ�ϴ�
            if (self.get('curUploadIndex') != EMPTY) {
                alert('��' + self.get('curUploadIndex') + '�ļ������ϴ������ϴ�����ٲ�����');
                return false;
            }
            //iframe���ϴ�����ʹ��inputԪ��
            uploadParam = file.input;
            //�����flash�ϴ���ʹ��id����
            if(type == 'flash') uploadParam = file.input.id;
            //�����ajax�ϴ�ֱ�Ӵ��ļ�����
            if (type == 'ajax') uploadParam = file.data;
            if (file['status'] === 'error') {
                return false;
            }
            //��ֹ�ļ��ϴ�
            if (!self.get('isAllowUpload')) return false;
            //���õ�ǰ�ϴ����ļ�id
            self.set('curUploadIndex', index);
            //�����ļ��ϴ�ǰ�¼�
            self.fire(Uploader.event.START, {index:index, file:file});
            //�ı��ļ��ϴ�״̬Ϊstart
            queue.fileStatus(index, Uploader.status.START);
            //��ʼ�ϴ�
            uploadType.upload(uploadParam);
        },
        /**
         * ȡ���ļ��ϴ�����index����������ʱȡ����ǰ�����ϴ����ļ����ϴ���cancel������ֹͣ�����ļ����ϴ�����Ӧ������stop��
         * @param {Number} index ������������
         * @return {Uploader}
         */
        cancel:function (index) {
            var self = this, uploadType = self.get('uploadType'),
                queue = self.get('queue'),
                statuses = Uploader.status,
                status = queue.fileStatus(index);
            if (S.isNumber(index) && status != statuses.SUCCESS) {
                uploadType.stop();
                queue.fileStatus(index, statuses.CANCEL);
            } else {
                //ȡ���ϴ���ˢ��״̬������·���Ȳ����뿴_uploadStopHanlder()
                uploadType.stop();
                //���������ϴ������������ϴ������ļ�
                self._continueUpload();
            }
            return self;
        },
        /**
         * ֹͣ�ϴ�����
         * @return {Uploader}
         */
        stop:function () {
            var self = this;
            self.set('uploadFilesStatus', EMPTY);
            self.cancel();
            return self;
        },
        /**
         * �����ϴ������е�ָ��״̬�µ��ļ�
         * @param {String} status �ļ��ϴ�״̬��
         * @return {Uploader}
         * @example
         * //�ϴ����������еȴ����ļ�
         * uploader.uploadFiles("waiting")
         */
        uploadFiles:function (status) {
            var self = this;
            if (!S.isString(status)) status = Uploader.status.WAITING;
            self.set('uploadFilesStatus', status);
            self._uploaderStatusFile(status);
            return self;
        },
        /**
         * �ϴ������е�ָ��״̬�µ��ļ�
         * @param {String} status �ļ��ϴ�״̬��
         * @return {Uploader}
         */
        _uploaderStatusFile:function (status) {
            var self = this, queue = self.get('queue'),
                fileIndexs = queue.getIndexs(status);
            //û�д�����Ҫ�ϴ����ļ����˳��ϴ�
            if (!fileIndexs.length) {
                self.set('uploadFilesStatus', EMPTY);
                self.fire(Uploader.event.UPLOAD_FILES);
                return false;
            }
            //��ʼ�ϴ��ȴ��е��ļ�
            self.upload(fileIndexs[0]);
            return self;
        },
        /**
         * �Ƿ�֧��ajax�����ϴ�
         * @return {Boolean}
         */
        isSupportAjax:function () {
            var isSupport = false;
            try {
                if (FormData) isSupport = true;
            } catch (e) {
                isSupport = false;
            }
            return isSupport;
        },
        /**
         * �Ƿ�֧��flash�����ϴ�
         * @return {Boolean}
         */
        isSupportFlash:function () {
            var fpv = S.UA.fpv();
            return S.isArray(fpv) && fpv.length > 0;
        },
        /**
         *  �����ϴ������ࣨ���ݲ�ͬ���ϴ���ʽ���������죩
         * @private
         */
        _renderUploaderCore:function(UploadType){
            var self = this;
            var type = self.get('type');
            if (!UploadType) return false;

            var serverConfig = {action:self.get('action'),data:self.get('data'),dataType:'json'};
            var button = self.get('button');
            //�����flash�첽�ϴ�����������swfUploader��ʵ����Ϊ����
            if (self.get('type') == Uploader.type.FLASH) {
                S.mix(serverConfig, {swfUploader:button.get('swfUploader')});
            }
            serverConfig.fileDataName = self.get('name');
            serverConfig.CORS = self.get('CORS');
            var uploadType = new UploadType(serverConfig);
            var uploaderTypeEvent = UploadType.event;
            //�����ϴ����ϴ�����¼�
            uploadType.on(uploaderTypeEvent.SUCCESS, self._uploadCompleteHanlder, self);
            uploadType.on(uploaderTypeEvent.ERROR, self._uploadCompleteHanlder, self);
            //�����ϴ����ϴ������¼�
            if (uploaderTypeEvent.PROGRESS) uploadType.on(uploaderTypeEvent.PROGRESS, self._uploadProgressHandler, self);
            //�����ϴ����ϴ�ֹͣ�¼�
            uploadType.on(uploaderTypeEvent.STOP, self._uploadStopHanlder, self);
            self.set('uploadType', uploadType);
            return uploadType;
        },
        /**
         * ��ȡ�ϴ���ʽ�ࣨ����iframe��ajax��flash���ַ�ʽ��
         * @type {String} type �ϴ���ʽ
         * @return {IframeType|AjaxType|FlashType}
         */
        getUploadType:function (type) {
            var self = this, types = Uploader.type,
                UploadType;
            //���type����Ϊauto����ôtype=['ajax','flash','iframe']
            if (type == types.AUTO) type = [types.AJAX,types.IFRAME];
            //��������飬������ȡ�����֧�ֵ��ϴ���ʽ
            if (S.isArray(type) && type.length > 0) {
                S.each(type, function (t) {
                    UploadType = self._getType(t);
                    if (UploadType) return false;
                });
            } else {
                UploadType = self._getType(type);
            }
            return UploadType;
        },
        /**
         * ��ȡ�ϴ���ʽ
         * @param {String} type �ϴ���ʽ������type���ض�Ӧ���ϴ��࣬����iframe����IframeType��
         */
        _getType:function (type) {
            var self = this, types = Uploader.type, UploadType,
                isSupportAjax = self.isSupportAjax(),
                isSupportFlash = self.isSupportFlash();
            switch (type) {
                case types.IFRAME :
                    UploadType = IframeType;
                    break;
                case types.AJAX :
                    UploadType = isSupportAjax && AjaxType || false;
                    break;
                case types.FLASH :
                    UploadType = isSupportFlash && FlashType || false;
                    break;
                default :
                    S.log(LOG_PREFIX + 'type�������Ϸ�');
                    return false;
            }
            if (UploadType) S.log(LOG_PREFIX + 'ʹ��' + type + '�ϴ���ʽ');
            self.set('type', type);
            return UploadType;
        },
        /**
         * ����Button�ϴ���ť���
         * @return {Button}
         */
        _renderButton:function () {
            var self = this, button, Button,
                type = self.get('type'),
                buttonTarget = self.get('target'),
                multiple = self.get('multiple'),
                disabled = self.get('disabled'),
                name = self.get('name');
            var config = {name:name, multiple:multiple, disabled:disabled,srcFileInput:self.get("fileInput")};
            if (type == Uploader.type.FLASH) {
                Button = SwfButton;
                S.mix(config, {size:self.get('swfSize')});
            } else {
                Button = HtmlButton;
            }
            button = new Button(buttonTarget, config);
            //������ť�ı��¼�
            button.on('change', self._select, self);
            //���а�ťʵ��
            button.render();
            self.set('button', button);
            //since v1.4.1 #25
            //IE10�£�����ѡ���õ�
            if(type == Uploader.type.IFRAME && UA.ie<10){
                self.set('multiple',false);
            }
            return button;
        },
        /**
         * ����Queue�������
         * @return {Queue} ����ʵ��
         */
        _renderQueue:function () {
            var self = this, queue = new Queue();
            //���ϴ����ʵ���������У���������ڲ�ִ��ȡ���������ϴ��Ĳ���
            queue.set('uploader', self);
            queue.on('add',function(ev){
                self.fire(Uploader.event.ADD,ev);
            });
            //�������е�ɾ���¼�
            queue.on('remove', function (ev) {
                self.fire(Uploader.event.REMOVE,ev);
            });
            self.set('queue', queue);
            return queue;
        },
        /**
         * ѡ�����ļ���
         * @param {Object} ev �¼�����
         */
        _select:function (ev) {
            var self = this,
                queue = self.get('queue'),
                curId = self.get('curUploadIndex'),
                files = ev.files;
            S.each(files, function (file) {
                //�ļ���С��IE������²�����
                if (!file.size) file.size = 0;
                //chrome�ļ���������ΪfileName����firefoxΪname
                if (!file.name) file.name = file.fileName || EMPTY;
                //�����flash�ϴ������������ļ��ϴ���input
                file.input = ev.input || file;
            });
            files = self._processExceedMultiple(files);
            self.fire(Uploader.event.SELECT, {files:files});
            //��ֹ�ļ��ϴ�
            if (!self.get('isAllowUpload')) return false;
            queue.add(files, function () {
                //��������������ϴ����ļ����������Զ��ϴ����ϴ����ļ�
                if (curId == EMPTY && self.get('autoUpload')) {
                    self.uploadFiles();
                }
            });
        },
        /**
         * ��������ѡ�����Խض�
         */
        _processExceedMultiple:function (files) {
            var self = this, multipleLen = self.get('multipleLen');
            if (multipleLen < 0 || !S.isArray(files) || !files.length) return files;
            return S.filter(files, function (file, index) {
                return index < multipleLen;
            });
        },
        /**
         * ���ϴ���Ϻ󷵻ؽ�����Ĵ���
         */
        _uploadCompleteHanlder:function (ev) {
            var self = this, result = ev.result, status, event = Uploader.event,
                queue = self.get('queue'), index = self.get('curUploadIndex');
            if (!S.isObject(result)) return false;
            //���������˵����ݱ��浽�����е����ݼ���
            queue.updateFile(index, {result:result});
            //�ļ��ϴ�״̬
            status = Number(result.status);
            // ֻ���ϴ�״̬Ϊ1ʱ���ǳɹ���
            if (status === 1) {
                //�޸Ķ������ļ���״̬Ϊsuccess���ϴ���ɣ�
                queue.fileStatus(index, Uploader.status.SUCCESS);
                self._success(result.data);
                self.fire(event.SUCCESS, {index:index, file:queue.getFile(index), result:result});
            } else {
                var msg = result.msg || result.message || EMPTY;
                result.msg = msg;
                //�޸Ķ������ļ���״̬Ϊerror���ϴ�ʧ�ܣ�
                queue.fileStatus(index, Uploader.status.ERROR, {msg:msg, result:result});
                self.fire(event.ERROR, {msg:msg,status:status, result:result, index:index, file:queue.getFile(index)});
            }
            //�ÿյ�ǰ�ϴ����ļ��ڶ����е�����ֵ
            self.set('curUploadIndex', EMPTY);
            self.fire(event.COMPLETE, {index:index, file:queue.getFile(index), result:result});
            //���������ϴ������������ϴ�
            self._continueUpload();
        },
        /**
         * ȡ���ϴ�����õķ���
         */
        _uploadStopHanlder:function () {
            var self = this, queue = self.get('queue'),
                index = self.get('curUploadIndex');
            //����ȡ���ϴ����״̬
            queue.fileStatus(index, Uploader.status.CANCEL);
            //���õ�ǰ�ϴ��ļ�id
            self.set('curUploadIndex', EMPTY);
            self.fire(Uploader.event.CANCEL, {index:index});
        },
        /**
         * ������������ϴ���������ϴ�
         */
        _continueUpload:function () {
            var self = this,
                uploadFilesStatus = self.get('uploadFilesStatus');
            if (uploadFilesStatus != EMPTY) {
                self._uploaderStatusFile(uploadFilesStatus);
            }
        },
        /**
         * �ϴ����ȼ�����
         */
        _uploadProgressHandler:function (ev) {
            var self = this, queue = self.get('queue'),
                index = self.get('curUploadIndex'),
                file = queue.getFile(index);
            S.mix(ev, {file:file});
            queue.fileStatus(index, Uploader.status.PROGRESS, ev);
            self.fire(Uploader.event.PROGRESS, ev);
        },
        /**
         * �ϴ��ɹ���ִ�еĻص�����
         * @param {Object} data �������˷��ص�����
         */
        _success:function (data) {
            if (!S.isObject(data)) return false;
            var self = this, url = data.url,
                fileIndex = self.get('curUploadIndex'),
                queue = self.get('queue');
            if (!S.isString(url)) return false;
            //׷�ӷ������˷��ص��ļ�url
            queue.updateFile(fileIndex, {'sUrl':url});
        },
        /**
         * ʹ��ָ������
         * @param {Theme} oTheme ������
         * @return  {Uploader|Boolean}
         */
        theme:function (oTheme) {
            var self = this;
            var theme = self.get('theme');
            if(!oTheme)return false;
            if (theme) {
                S.log('��֧��������Ⱦ���⣡');
                return self;
            }
            oTheme.set('uploader',self);
            oTheme.set('queue',self.get('queue'));
            oTheme.render && oTheme.render();
            self.fire('themeRender', {theme:theme, uploader:self});
            self.set('theme', oTheme);
            return self;
        },
        /**
         * ��ȾĬ������
         * @param target
         */
        restore:function(target){
            var self = this;
            var fileResults;
            self.set('hasRestore',true);
            if(!target){
                var theme = self.get('theme');
                if(!theme) return false;
                var $queueTarget = theme.get('queueTarget');
                if(!$queueTarget || !$queueTarget.length) return false;
                /**
                 * demo:
                 *<script type="text/uploader-files">
                    [{
                    "name":"icon_evil.gif",
                    "url": "http://tp4.sinaimg.cn/1653905027/50/5601547226/1",
                    "desc":"Ĭ�����ݵ�ͼƬ����"
                    }]
                  </script>
                 */
                var $script = $queueTarget.all('script');
                $script.each(function(el){
                    if(el.attr('type') == UPLOADER_FILES){
                        fileResults = el.html();
                    }
                });
            }else{
                var $target = $(target);
                if(!$target.length) {
                    S.log('restore()��������target��');
                    return false;
                }
                fileResults = $target.text();
            }
            fileResults = JSON.parse(fileResults);
            if(!fileResults.length) return false;
            var queue = self.get('queue');
            var file;
            S.each(fileResults, function (fileResult) {
                fileResult.status = 1;
                file = {
                    type:'restore',
                    name:fileResult.name || '',
                    url:fileResult.url || '',
                    result:fileResult
                };
                //���������ļ�
                var queueFile = queue.add(file);
                var id = queueFile.id;
                var index = queue.getFileIndex(id);
                //�ı��ļ�״̬Ϊ�ɹ�
                queue.fileStatus(index, 'success', {index:index, id:id, file:queueFile});
                //����uploader�ļ���������
                self.fire('success',{file:queueFile,result:queueFile.result});
            });
        }
    }, {ATTRS:/** @lends Uploader.prototype*/{
        /**
         * �ϴ������Ŀ��Ԫ�أ�һ��Ϊfile����
         * @type NodeList
         * @since 1.4
         * @default ""
         */
        target:{
            value:EMPTY,
            getter:function (v) {
                return $(v);
            }
        },
        /**
         * �ļ���
         * @type NodeList
         * @since 1.4
         * @default ""
         */
        fileInput:{
            value:EMPTY
        },
        /**
         * ����ʵ��
         * @type Theme
         * @since 1.4
         * @default ""
         */
        theme:{ value:EMPTY },
        /**
         * ģ���ϴ���ťģ�棬���Ƽ��滻
         * @type String
         * @since 1.4
         */
        btnTpl:{
            value:'<a href="javascript:void(0)" class="g-u ks-uploader-button"><span class="btn-text">{text}</span></a>'
        },
        /**
         * Button��ť��ʵ��
         * @type Button
         * @default {}
         */
        button:{value:{}},
        /**
         * Queue���е�ʵ��
         * @type Queue
         * @default {}
         */
        queue:{value:{}},
        /**
         * ���õ��ϴ���������ֵ������ʱ�����硰type�� : ["flash","ajax","iframe"]����˳���ȡ�����֧�ֵķ�ʽ�������û�����ʹ��flash�ϴ���ʽ������������֧��flash���ή��Ϊajax���������֧��ajax���ή��Ϊiframe����ֵ���ַ���ʱ�����硰type�� : ��ajax������ʾֻʹ��ajax�ϴ���ʽ�����ַ�ʽ�Ƚϼ��ˣ��ڲ�֧��ajax�ϴ���ʽ��������᲻���ã�����type�� : ��auto����auto��һ���������ȼ���["ajax","flash","iframe"]��
         * @type String|Array
         * @default "auto"
         * @since V1.2 ������type�� : ��auto�����ȼ���["ajax","flash","iframe"]��
         */
        type:{value:'auto'},
        /**
         * �Ƿ�����ѡ֧�֣�������������ڼ���������
         * @type Boolean
         * @default false
         * @since V1.2
         */
        multiple:{
            value:false,
            setter:function (v) {
                var self = this, button = self.get('button');
                if (!S.isEmptyObject(button) && S.isBoolean(v)) {
                    button.set('multiple', v);
                }
                return v;
            }
        },
        /**
         * �������ƶ�ѡ�ļ�������ֵΪ��ʱ�����ö�ѡ����
         * @type Number
         * @default -1
         * @since V1.2.6
         */
        multipleLen:{ value:-1 },
        /**
         * �Ƿ����,falseΪ����
         * @type Boolean
         * @default false
         * @since V1.2
         */
        disabled:{
            value:false,
            setter:function (v) {
                var self = this, button = self.get('button');
                if (!S.isEmptyObject(button) && S.isBoolean(v)) {
                    button.set('disabled', v);
                }
                return v;
            }
        },
        /**
         * �����������ϴ���·��
         * @type String
         * @default ''
         */
        action:{
            value:EMPTY,
            setter:function (v) {
                var self = this, uploadType = self.get('uploadType');
                if(uploadType && !S.isEmptyObject(uploadType)) uploadType.set('action', v);
                return v;
            }
        },
        /**
         * ���������ڶ�̬�޸�post�������������ݣ��Ḳ��serverConfig��data����
         * @type Object
         * @default {}
         * @since V1.2.6
         */
        data:{
            value:{},
            setter:function (v) {
                if (S.isObject(v)) {
                    var self = this, uploadType = self.get('uploadType');
                    if(uploadType && !S.isEmptyObject(uploadType)) uploadType.set('data', v);
                }
                return v;
            }
        },
        /**
         * �Ƿ������ϴ��ļ�
         * @type Boolean
         * @default true
         */
        isAllowUpload:{value:true},
        /**
         * �Ƿ��Զ��ϴ�
         * @type Boolean
         * @default true
         */
        autoUpload:{value:true},
        /**
         * �������˷��ص����ݵĹ�����
         * @type Function
         * @default function(){}
         */
        filter:{
            value:EMPTY,
            setter:function (v) {
                var self = this;
                var uploadType = self.get('uploadType');
                if (uploadType && !S.isEmptyObject(uploadType))uploadType.set('filter', v);
                return v;
            }
        },
        /**
         *  ��ǰ�ϴ����ļ���Ӧ���������ڵ�����ֵ�����û���ļ������ϴ���ֵΪ��
         *  @type Number
         *  @default ""
         */
        curUploadIndex:{value:EMPTY},
        /**
         * �ϴ���ʽʵ��
         * @type UploaderType
         * @default ''
         */
        uploadType:{value:EMPTY},
        /**
         * ǿ������flash�ĳߴ磬ֻ����flash�ϴ���ʽ����Ч������{width:100,height:100}��Ĭ��Ϊ����Ӧ��ť�����ߴ�
         * @type Object
         * @default {}
         */
        swfSize:{value:{}},
        /**
         * �Ƿ������restore����
         * @type Boolean
         * @default false
         */
        hasRestore:{value:false},
        /**
         * Button��ť��ʵ��
         * @type Button
         * @default {}
         */
        button:{value:{}},
        /**
         * Queue���е�ʵ��
         * @type Queue
         * @default {}
         */
        queue:{value:{}},
        /**
         *  ��ǰ�ϴ����ļ���Ӧ���������ڵ�����ֵ�����û���ļ������ϴ���ֵΪ��
         *  @type Number
         *  @default ""
         */
        curUploadIndex:{value:EMPTY},
        /**
         *  ��ǰ�ϴ����ļ�
         *  @type Object
         *  @default ""
         */
        curFile:{
            value:EMPTY,
            getter:function(){
                var self = this;
                var file = EMPTY;
                var curUploadIndex = self.get('curUploadIndex');
                if(S.isNumber(curUploadIndex)){
                    var queue = self.get('queue');
                    file = queue.getFile(curUploadIndex);
                }
                return file;
            }
        },
        /**
         * �ϴ���ʽʵ��
         * @type UploaderType
         * @default {}
         */
        uploadType:{value:{}},
        /**
         * �ļ���Ԫ��
         * @type NodeList
         * @default ""
         */
        fileInput:{value:EMPTY},
        /**
         * ���������ϴ��ļ�ʱ��ָ�����ļ�״̬
         * @type String
         * @default ""
         */
        uploadFilesStatus:{value:EMPTY},
        /**
         * ǿ������flash�ĳߴ磬ֻ����flash�ϴ���ʽ����Ч������{width:100,height:100}��Ĭ��Ϊ����Ӧ��ť�����ߴ�
         * @type Object
         * @default {}
         */
        swfSize:{value:{}},
        /**
         * �Ƿ����
         */
        CORS:{value:false}
    }}, 'Uploader');
    S.mix(Uploader, /** @lends Uploader*/{
        /**
         * �ϴ���ʽ��{AUTO:'auto', IFRAME:'iframe', AJAX:'ajax', FLASH:'flash'}
         */
        type:{AUTO:'auto', IFRAME:'iframe', AJAX:'ajax', FLASH:'flash'},
        /**
         * ���֧�ֵ��¼��б�{ RENDER:'render', SELECT:'select', START:'start', PROGRESS : 'progress', COMPLETE:'complete', SUCCESS:'success', UPLOAD_FILES:'uploadFiles', CANCEL:'cancel', ERROR:'error' }
         *
         */
        event:{
            //ѡ�����ļ��󴥷�
            SELECT:'select',
            //��������һ���ļ��󴥷�
            ADD:'add',
            //��ʼ�ϴ��󴥷�
            START:'start',
            //�����ϴ���ʱ����
            PROGRESS:'progress',
            //�ϴ���ɣ����ϴ��ɹ����ϴ�ʧ�ܺ󶼻ᴥ����
            COMPLETE:'complete',
            //�ϴ��ɹ��󴥷�
            SUCCESS:'success',
            //�����ϴ������󴥷�
            UPLOAD_FILES:'uploadFiles',
            //ȡ���ϴ��󴥷�
            CANCEL:'cancel',
            //�ϴ�ʧ�ܺ󴥷�
            ERROR:'error',
            //�Ƴ������е�һ���ļ��󴥷�
            REMOVE:'remove',
            //��ʼ��Ĭ���ļ�����ʱ����
            RESTORE:'restore'
        },
        /**
         * �ļ��ϴ����е�״̬��{ WAITING : 'waiting', START : 'start', PROGRESS : 'progress', SUCCESS : 'success', CANCEL : 'cancel', ERROR : 'error', RESTORE: 'restore' }
         */
        status:{
            WAITING:'waiting',
            START:'start',
            PROGRESS:'progress',
            SUCCESS:'success',
            CANCEL:'cancel',
            ERROR:'error'
        }
    });
    return Uploader;
}, {requires:['node', 'rich-base','json', 'ua','./type/iframe', './type/ajax', './type/flash', './button/base', './button/swfButton', './queue']});
/**
 * changes:
 * ���ӣ�1.5
 *          - [-] ɾ��_oldInput
 *          - [!] ��input append�����������������´���һ��
 * ���ӣ�1.4
 *           - �ع�ģ��
 *           - ȥ��urlsInputName����
 *           - ����add��remove�¼�
 *           - ȥ��������Զ��첽����
 */
/**
 * _��ȡtoken?
 */
KISSY.add('gallery/uploader/1.5/token',function (S ,io) {
    var DAILY_TOKEN_API = 'http://aop.widgets.daily.taobao.net/block/getReqParam.htm';
    var LINE_TOKEN_API = 'http://aop.widgets.taobao.com/block/getReqParam.htm';
    /**
     * $��ȡdomain
     * @return {String}
     */
    function getDomain(){
        var host = arguments[1] || location.hostname;
        var da = host.split('.'), len = da.length;
        var deep = arguments[0]|| (len<3?0:1);
        if (deep>=len || len-deep<2)
            deep = len-2;
        return da.slice(deep).join('.');
    }

    /**
     * $�Ƿ���daily
     * @return {boolean}
     */
    function isDaily(){
        var domain = getDomain(-1);
        return domain == 'net';
    }

    /**
     * $����token
     */
    function setToken(uploader,callback){
        if(!uploader) return false;
        var url = isDaily() && DAILY_TOKEN_API || LINE_TOKEN_API;
        io.jsonp(url,function(data){
            var token = data.value;
            if(token){
                var data = uploader.get('data');
                data['_tb_token_'] = token;
            }
            callback && callback(data);
        })
    }

    return setToken;
},{requires:['ajax']});
/**
 * �����ϴ�ͨ�ýӿ�
 */
KISSY.add('gallery/uploader/1.5/aliUploader',function (S ,UA,Uploader,token) {
    var DAILY_API = 'http://aop.widgets.daily.taobao.net/block/uploadImg.htm';
    var LINE_API = 'http://aop.widgets.taobao.com/block/uploadImg.htm';
    /**
     * ��ȡdomain
     * @return {String}
     */
    function getDomain(){
        var host = arguments[1] || location.hostname;
        var da = host.split('.'), len = da.length;
        var deep = arguments[0]|| (len<3?0:1);
        if (deep>=len || len-deep<2)
            deep = len-2;
        return da.slice(deep).join('.');
    }

    /**
     * �Ƿ���daily����
     * @return {boolean}
     */
    function isDaily(){
        var domain = getDomain(-1);
        return domain == 'net';
    }

    /**
     * ��ȡAPI
     * @return {string}
     */
    function getUploaderApi(){
        return isDaily() && DAILY_API || LINE_API;
    }

    /**
     * ��Ϊflash��ȱ�ݣ��޷�Я��cookies���ֶ���cookies post��ȥ
     * http://code.google.com/p/swfupload/source/browse/swfupload/trunk/core/plugins/swfupload.cookies.js?r=849
     * @param uploader
     * @return {Object}
     */
    function flashCookiesHack(uploader){
        if(!uploader) return false;
        var type = uploader.get('type');
        if(type != 'flash') return false;
        var cookieArray = document.cookie.split(';');
        var eqIndex, name, value;
        var cookiesData = {};
        S.each(cookieArray,function(c){
            // Left Trim spaces
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            eqIndex = c.indexOf("=");
            if (eqIndex > 0) {
                name = c.substring(0, eqIndex);
                value = c.substring(eqIndex + 1);
                cookiesData[name] = value;
            }
        });
        var data = uploader.get('data');
        S.mix(data,cookiesData);
        return cookiesData;
    }

    /**
     * iframeǿ������domain
     * @param uploader
     */
    function iframeHack(uploader,domain,redirect){
        var type = uploader.get('type');
        var setDomain = type == 'iframe';
        if(!setDomain) return false;
        var data = uploader.get('data');
        if(redirect){

        }else{
            //�������������ã�ǿ�ƽ�ȡ�����������
            if(!domain){
                domain = getDomain(-2);
            }
            document.domain = domain;
            data.domain = domain;
            S.log('[AliUploader]����ǿ������domain��'+domain);
        }
        if(data.type){
            delete data.type;
            S.log('type�ǹؼ��֣��������ó�post����');
        }
        var uploadType = uploader.get('uploadType');
        uploadType.set('domain',domain);
        return data;
    }

    /**
     * ������������ص��ļ�name������url
     * @param uploader
     */
    function urlUseName(uploader){
        var isSet = false;
        uploader.on('add',function(){
            if(!isSet){
                var urlsInput = uploader.getPlugin('urlsInput');
                if(urlsInput){
                    urlsInput.set('useName',true);
                    isSet = true;
                    S.log('[UrlsInput]useName����Ϊtrue������������˷��ص�ͼƬ��');
                }
            }
        })
    }

    function AliUploader(target,config){
        if(!config) config = {};
        config.CORS = true;
        //����Ĭ�Ͻӿ�
        if(!config.action) config.action = getUploaderApi();
        if(!config.data) config.data = {};
        config.data['_input_charset'] = 'utf-8';
        if(UA.ie <= 6){
            config.type = 'flash';
            S.log('�ӵ�IE6��ʹ��flash');
        }
        //ʵ����uploader
        var uploader = new Uploader(target,config);
        flashCookiesHack(uploader);
        iframeHack(uploader,config.domain);
        token(uploader);
        //urlʹ���ļ�������������·��
        if(config.useName) urlUseName(uploader);

        return uploader;
    }
    AliUploader.Uploader = Uploader;
    return AliUploader;
},{requires:['ua','./index','./token']});

