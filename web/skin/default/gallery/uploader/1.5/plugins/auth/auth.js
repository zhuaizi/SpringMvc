/*
combined files : 

gallery/uploader/1.5/plugins/auth/auth

*/
/**
 * @fileoverview �ļ��ϴ���֤
 * @author: ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/auth/auth',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    var ERROR_EVENT = 'error';
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
     * @name Auth
     * @class �ļ��ϴ���֤�����ԴӰ�ť��data-authα����ץȡ��������
     * @constructor
     * @extends Base
     * @param {Uploader} uploader *���ϴ����ʵ��
     * @param {Object} config ����
     */
    function Auth(config) {
        var self = this;
        Auth.superclass.constructor.call(self, config);
    }
    /**
     * @name Auth#error
     * @desc  ����֤����ʱ����
     * @event
     * {rule:'require',msg : rule[1],value : isRequire}
     * @param {String} ev.rule ������
     * @param {String} ev.msg ������Ϣ
     * @param {Boolean|String} ev.value ����ֵ
     */
    S.extend(Auth, Base, /** @lends Auth.prototype*/{
        /**
         * ��ʼ��
         */
        pluginInitializer:function (uploader) {
            if(!uploader) return false;
            var self = this;
            self.set('uploader',uploader);
            self._useThemeConfig();
            var queue = uploader.get('queue');
            self._setSwfButtonExt();
            queue.on('add',function(ev){
                var file = ev.file;
                //Ĭ����Ⱦ�����ݣ�����Ҫ��֤
                if(file.type == 'restore') return true;

                var isPass = self.testAllowExt(file);
                if(isPass) isPass = self.testMaxSize(file);
                if(isPass) self.testRepeat(file);
                if(isPass) self.testWidthHeight(file);
            });
            queue.on('remove',function(ev){
                var file = ev.file,status = file.status;
                //ɾ�������Ѿ��ɹ��ϴ����ļ�����Ҫ���¼�����������ϴ���
                if(status == 'success') self.testMax() && self.testRequired();
            });
            uploader.on('success',function(){
                self.testMax();
            });
            uploader.on('error', function (ev) {
                if(ev.status === -1 && ev.rule == 'max'){
                    self._maxStopUpload();
                }
                //��������ϴ��ļ�
                uploader.set('isAllowUpload', true);
            });
        },
        /**
         * ʹ���������֤��Ϣ
         * @private
         */
        _useThemeConfig:function(){
            var self = this;
            var msg = self.get('msg');
            if(!S.isEmptyObject(msg)) return false;
            var uploader = self.get('uploader');
            var theme = uploader.get('theme');
            if(!theme) return false;
            var msg = theme.get('authMsg');
            if(msg) self.set('msg',msg);
            var allowExts = self.get('allowExts');
            if(!allowExts){
                self.set('allowExts',theme.get('allowExts'));
            }
            return self;
        },
        /**
         * ��������jpg,jpeg,png,gif,bmpת��{desc:"JPG,JPEG,PNG,GIF,BMP", ext:"*.jpg;*.jpeg;*.png;*.gif;*.bmp"}
         * @param exts
         * @return {*}
         */
        setAllowExts:function(exts){
            if(!S.isString(exts)) return false;
            var ext = [];
            var desc = [];
            exts = exts.split(',');
            S.each(exts,function(e){
                ext.push('*.'+e);
                desc.push(e.toUpperCase());
            });
            ext = ext.join(';');
            desc = desc.join(',');
            return {desc:desc,ext:ext};
        },
        /**
         * ��֤�ϴ������Ƿ�����ϴ�
         * @return {Boolean}
         */
        testAll : function(){
            var self = this;
            return self.testRequire() && self.testMax();
        },
        /**
         * �ж��ϴ���ʽ
         * @param type
         * @return {Boolean}
         */
        isUploaderType:function (type) {
            var self = this, uploader = self.get('uploader'),
                uploaderType = uploader.get('type');
            return type == uploaderType;
        },
        /**
         * �����Ƿ��Ѿ��ϴ�������һ���ļ�
         * @return {Boolean}
         */
        testRequired:function(){
            var self = this;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var files = queue.getFiles('success');
            return files.length > 0;
        },
        /**
         * �����Ƿ���������ļ��ϴ�����
         * @param {Object} file �ļ�����
         * @return {Boolean} �Ƿ�ͨ��
         */
        testAllowExt:function (file) {
            if (!S.isObject(file)) return false;
            var self = this;
            var fileName = file.name;
            var allowExts = self.get('allowExts');
            if (!allowExts) return true;

            //��չ������
            var exts = allowExts.split(',');

            var isAllow = _isAllowUpload(exts,fileName);
            //�������֧�ֵ��ļ���ʽ�����ִ���
            if(!isAllow){
                var fileExt = _getFileExt(fileName);
                var msg = self.msg('allowExts');
                msg = S.substitute(msg,{ext : fileExt});
                self._fireUploaderError('allowExts',[allowExts,msg],file);
            }
            /**
             * �Ƿ������ϴ�
             * @param {String} fileName �ļ���
             * @return {Boolean}
             */
            function _isAllowUpload(exts,fileName) {
                var isAllow = false;
                var lowerCaseFileName = fileName.toLowerCase();
                var reg;
                S.each(exts, function (ext) {
                    reg = new RegExp('^.+\.' + ext + '$');
                    //���ڸ���չ��
                    if (reg.test(lowerCaseFileName))  return isAllow = true;
                });
                return isAllow;
            }
            /**
             * ��ȡ�ļ���չ��
             * @param {String} file
             */
            function _getFileExt(file){
                var arr = file.split('.');
                return arr[arr.length -1];
            }
            return isAllow;
        },
        /**
         * �����Ƿ�ﵽ��������ϴ���
         * @return {Boolean}
         */
        testMax:function () {
            var self = this;
            var max = self.get('max');
            if(max == EMPTY) return true;

            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            //��ȡ�Ѿ��ϴ��ɹ����ļ�
            var successFiles = queue.getFiles('success');
            var len = successFiles.length;
            var isPass = len < max;
            //�ﵽ��������ϴ���
            if(!isPass){
                //���ð�ť
                uploader.set('disabled',true);
                uploader.set('isAllowUpload', false);

                var msg = self.msg('max');
                msg = S.substitute(msg,{max : max});
                self._fireUploaderError('max',[max,msg]);
            }else{
                uploader.set('disabled',false);
                uploader.set('isAllowUpload', true);
            }
            return isPass;
        },
        /**
         * �����Ƿ񳬹���������ļ���С������iframe�ϴ���ʽ����֤��Ч
         * @param {Object} file �ļ�����
         * @return Boolean
         */
        testMaxSize : function(file){
            var self = this;
            var size = file.size;
            var maxSize = self.get('maxSize');
            if(maxSize == EMPTY || !size) return true;
            var uploader = self.get('uploader');
            maxSize = maxSize * 1024;
            var isAllow = size <= maxSize;
            if(!isAllow){
                var msg = self.msg('maxSize');
                msg = S.substitute(msg,{maxSize:convertByteSize(maxSize),size : file.textSize});
                self._fireUploaderError('maxSize',[maxSize,msg],file);
            }
            return isAllow;
        },
        /**
         * �����ļ��Ƿ��ظ��������ļ��������п��ܴ��������粻ͬĿ¼�µ���ͬ�ļ����ᱻ�ж�Ϊͬһ�ļ���
         * @param {Object} file �ļ�����
         * @return {Boolean}
         */
        testRepeat : function(file){
            if(!S.isObject(file)) return false;
            var self = this;
            var fileName = file.name;
            var allowRepeat = self.get('allowRepeat');
            if(allowRepeat === EMPTY) return false;

            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var files = queue.getFiles('success');
            var isRepeat = false ;
            //�ļ�����ͬ�����ļ���С��ͬ
            S.each(files,function(f){
                if(f.name == fileName){
                    if(f.size){
                        if(f.size == file.size) self._fireUploaderError('allowRepeat',[allowRepeat,self.msg('allowRepeat')],file);
                    }else{
                        self._fireUploaderError('allowRepeat',[allowRepeat,self.msg('allowRepeat')],file);
                    }
                    return isRepeat = true;
                }
            });
            return isRepeat;
        },
        /**
         * ����ͼƬ�Ŀ�Ⱥ͸߶��Ƿ����Ҫ�󣬷ǳ��������֤��ʽ��������Ǻ������ݣ����磺
         * widthHeight:[function(width){
                return width >= 160;
            },function(height){
                return height >= 160;
            }]
         * @param {Object} file �ļ�����
         * @return {Boolean}
         */
        testWidthHeight:function(file){
            var self = this;
            var fnWidthHeights = self.get('widthHeight');
            if(fnWidthHeights === EMPTY) return true;

            var uploader = self.get('uploader');
            //��ֹͼƬ�ϴ���ͼƬ�ߴ����֤�������첽�ģ�
            uploader.set('isAllowUpload',false);
            //�ļ����ݣ�IE9�²�����
            var fileData = file.data;
            if(!S.isEmptyObject(fileData)){
                //��ȡͼƬ����
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    //����ͼƬ��ȡͼƬ��ʵ��Ⱥ͸߶�
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        _test(width,height);
                    };
                    image.src= data;
                };
                reader.readAsDataURL(fileData);
            }else{
                //IE��ʹ���˾�������ͼƬ�ߴ����
                //�ļ�name��IE����������ͼƬ����·��
                var input = uploader.get('target').all('input').getDOMNode();
                input.select();
                //ȷ��IE9�£����������Ϊ��ȫ���⵼���޷�����
                input.blur();
                var src = document.selection.createRange().text;
                var img = $('<img style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image);width:300px;visibility:hidden;"  />').appendTo('body').getDOMNode();
                img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
                var width = img.offsetWidth;
                var height = img.offsetHeight;
                _test(width,height);
                $(img).remove();
            }
            /**
             * �ȶ�ͼƬ�ߴ�
             * @param width
             * @param height
             * @private
             */
            function _test(width,height){
                var isPass = fnWidthHeights.call(self,width,height);

                if(!isPass){
                    //����������Ϣ
                    var msg = self.msg('widthHeight');
                    self._fireUploaderError('widthHeight',[fnWidthHeights,msg],file);
                }else{
                    //���¿�ʼ�ϴ�ͼƬ
                    uploader.set('isAllowUpload',true);
                    var index = uploader.get('queue').getFileIndex(file.id);
                    uploader.upload(index);
                }
            }
        },
        /**
         * ����flash��ť���ļ���ʽ����
         * @return {Auth}
         */
        _setSwfButtonExt:function () {
            var self = this;
            var uploader = self.get('uploader');
            var allowExts = self.get('allowExts');
            var button = uploader.get('button');
            var isFlashType = self.isUploaderType('flash');
            if (!isFlashType || allowExts ===   EMPTY) return false;
            allowExts = self.setAllowExts(allowExts);
            //�����ļ�����
            if(button) button.set('fileFilters', allowExts[0]);
            return self;
        },
        /**
         * ��ȡ��չ�����������Ӵ�д��չ��
         * @param {String} sExt ��չ���ַ���������*.jpg;*.jpeg;*.png;*.gif;*.bmp
         * @retunr {Array}
         */
        _getExts:function (sExt) {
            if (!S.isString(sExt)) return false;
            var exts = sExt.split(';'),
                uppercaseExts = [],
                reg = /^\*\./;
            S.each(exts, function (ext) {
                ext = ext.replace(reg, '');
                uppercaseExts.push(ext.toUpperCase());
            });
            S.each(uppercaseExts,function(ext){
                exts.push(ext);
            });
            return exts;
        },
        /**
         * ����uploader��error�¼�
         * @param ruleName
         * @param rule
         * @param file
         */
        _fireUploaderError:function(ruleName,rule,file){
            var self = this;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var params = {status:-1,rule:ruleName};
            var index = -1;
            if(file){
                index = queue.getFileIndex(file.id);
                S.mix(params,{file:file,index:index});
            }
            //result��Ϊ����uploader��error�¼�����һ��
            if(rule) S.mix(params,{msg : rule[1],value : rule[0],result:{}});
            queue.fileStatus(index, 'error', params);
            self.fire(ERROR_EVENT,params);
            uploader.fire('error',params);
        },
        /**
         * ����ﵽ����ϴ�������ֹ�����ļ����ϴ����������Ƴ�
         * @private
         */
        _maxStopUpload:function(){
            var self = this;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var max = self.get('max');
            var curFileIndex = uploader.get('curUploadIndex');
            if(curFileIndex == EMPTY || curFileIndex < max) return false;
            var files = queue.get('files');
            //��ѡ�ϴ�������£�����maxֹͣ�����ļ����ϴ�
            var successFiles = queue.getFiles('success');
            if(successFiles.length > max) uploader.stop();

            S.each(files,function(file,index){
                if(index > curFileIndex){
                    queue.remove(file.id);
                }
            })
            uploader.set('curUploadIndex', EMPTY);
        },
        /**
         * ��ȡ/����ָ���������֤��Ϣ
         * @param {String} rule ������
         * @param {String} msg  ��Ϣ
         * @return {String}
         */
        msg:function(rule,msg){
            var self = this;
            if(!S.isString(rule)) return self;
            var msgs = self.get('msg');
            if(!S.isString(msg)){
                return msgs[rule];
            }

            msgs[rule] = msg;
            return msg;
        },
        _processRuleConfig:function(rule,config){
            var self = this;
            if(!S.isString(rule)) return self;
            //demo max:[o,''�ﵽ����ϴ�����]������Ϣ������Ҫ��������Ϣ
            if(S.isArray(config)){
                self.msg(rule,config[1]);
            }
            return self;
        }
    }, {ATTRS:/** @lends Auth.prototype*/{
        /**
         * �������
         * @type String
         * @default auth
         */
        pluginId:{
            value:'auth'
        },
        /**
         * �ϴ����ʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{ value:EMPTY },
        /**
         * �����ϴ�һ���ļ���֤��������
         * @type Boolean
         * @default ''
         */
        required:{value:EMPTY},
        /**
         * ��������ϴ�����֤��������
         * @type Boolean
         * @default ''
         */
        max:{value:EMPTY},
        /**
         *  �ļ���ʽ��֤��������
         * @type Boolean
         * @default ''
         */
        allowExts:{value:EMPTY},
        /**
         * �ļ���С��֤��������
         * @type Boolean
         * @default ''
         */
        maxSize:{value:EMPTY},
        /**
         *  �ļ��ظ�����֤��������
         * @type Boolean
         * @default ''
         */
        allowRepeat:{value:EMPTY},
        /**
         *  �����ļ���ȸ߶���֤�������ã�����['<=160',"<=160"]
         * @type Array
         * @default ''
         */
        widthHeight:{value:EMPTY},
        /**
         * ��֤��Ϣ����
         * @type Object
         * @default { }
         */
        msg:{value:{}
        }
    }});
    return Auth;
}, {requires:['node','base']});

/**
 * changes:
 * ���ӣ�1.4
 *           - ����ģ��·������auth�Ƶ�plugins��
 *           - �ع���֤�࣬��rich base�������ʽ����
 *           - ȥ��testRequire��������ͨ��queue��file������֤
 *           - ��дallowExts
 *           - ȥ��getAllowExts
 *           - ��д_setSwfButtonExt
 *           - ȥ��getRule
 *           - ����widthHeight����
 * ���ӣ�2012.11.22
 *          - ȥ���ظ��Ĵ��룬���Լ��Դ�
 *          - �����������max��bug
 */

