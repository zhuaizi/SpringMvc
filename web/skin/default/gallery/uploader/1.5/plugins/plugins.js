/*
combined files : 

gallery/uploader/1.5/plugins/auth/auth
gallery/uploader/1.5/plugins/filedrop/filedrop
gallery/uploader/1.5/plugins/imageZoom/imageZoom
gallery/uploader/1.5/plugins/imgcrop/imgcrop
gallery/uploader/1.5/plugins/preview/preview
gallery/uploader/1.5/plugins/proBars/progressBar
gallery/uploader/1.5/plugins/proBars/proBars
gallery/uploader/1.5/plugins/tagConfig/tagConfig
gallery/uploader/1.5/plugins/urlsInput/urlsInput
gallery/uploader/1.5/plugins/paste/paste
gallery/uploader/1.5/token
gallery/uploader/1.5/plugins/miniLogin/miniLogin
gallery/uploader/1.5/plugins/plugins

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
/**
 * @fileoverview  �ļ���ק�ϴ����
 *  @author ����
 */
KISSY.add('gallery/uploader/1.5/plugins/filedrop/filedrop',function (S, Node, Base) {
    var EMPTY = '',
        $ = Node.all,
        UA = S.UA;
    /**
     * @name FileDrop
     * @class �ļ���ק�ϴ����
     * @constructor
     *  @author ����
     * @extends Base
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {Button} config.button *��Button��ť��ʵ��
     */
    var FileDrop = function (config) {
        var self = this;
        FileDrop.superclass.constructor.call(self, config);
        self.set('mode', getMode());
    };

    var getMode = function () {
        if (UA.webkit >= 7 || UA.firefox >= 3.6) {
            return 'supportDrop';
        }
        if (UA.ie) {
            return 'notSupportDropIe';
        }
        if (UA.webkit < 7 || UA.firefox < 3.6) {
            return 'notSupportDrop';
        }
    };

    S.mix(FileDrop, {
        event:{
            'AFTER_DROP':'afterdrop'
        }
    });

    S.extend(FileDrop, Base, /** @lends FileDrop.prototype*/ {
        /**
         * �����ʼ��
         */
        pluginInitializer:function (uploader) {
            var self = this;
            var mode = self.get('mode');
            var $dropArea;
            if(!uploader) return false;
            self.set('uploader',uploader);
            if(uploader.get('type') == 'flash'){
                S.log('flash�ϴ���ʽ��֧����ק��');
                self.set('isSupport',false);
                return false;
            }
            if(mode != 'supportDrop'){
                S.log('���������֧����ק�ϴ���');
                self.set('isSupport',false);
                return false;
            }
            var target = uploader.get('target');
            self.set('target',target);
            $dropArea = self._createDropArea();
            $dropArea.on('click',self._clickHandler,self);
            //��uploader�Ľ���״̬�����ı��������ק����
            uploader.on('afterDisabledChange',function(ev){
                self[ev.newVal && 'hide' || 'show']();
            });
            self.fire('render', {'buttonTarget':self.get('buttonWrap')});
        },
        /**
         * ��ʾ��ק����
         */
        show:function () {
            var self = this,
                dropContainer = self.get('dropContainer');
            dropContainer.show();
        },
        /**
         * ������ק����
         */
        hide:function () {
            var self = this,
                dropContainer = self.get('dropContainer');
            dropContainer.hide();
        },
        /**
         * ������ק����
         */
        _createDropArea:function () {
            var self = this,
                target = $(self.get('target')),
                mode = self.get('mode'),
                html = S.substitute(self.get('tpl')[mode], {name:self.get('name')}),
                dropContainer = $(html),
                buttonWrap = dropContainer.all('.J_ButtonWrap');
            dropContainer.appendTo(target);
            dropContainer.on('dragover', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });
            dropContainer.on('drop', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                self._dropHandler(ev);
            });
            self.set('dropContainer', dropContainer);
            self.set('buttonWrap', buttonWrap);
            self._setStyle();
            return dropContainer;
        },
        /**
         * ������ק����ʽ
         * @author ��������
         */
        _setStyle:function(){
             var self = this,$dropContainer = self.get('dropContainer');
            if(!$dropContainer.length) return false;
            $dropContainer.parent().css('position','relative');
            $dropContainer.css({'position':'absolute','top':'0','left':'0',width:'100%',height:'100%','zIndex':'1000'});
        },
        /**
         * �����ק����󴥷�
         * @author ��������
         * @param ev
         */
        _clickHandler:function(ev){
            var self = this,
                uploader = self.get('uploader'),
                button = uploader.get('button'),
                $input = button.get('fileInput');
            //����input��ѡ���ļ�
            $input.fire('click');
        },
        /**
         * ������קʱ��
         */
        _dropHandler:function (ev) {
            var self = this,
                event = FileDrop.event,
                fileList = ev.originalEvent.dataTransfer.files,
                files = [],
                uploader = self.get('uploader');

            if (!fileList.length || uploader == EMPTY)  return false;
            S.each(fileList, function (f) {
                if (S.isObject(f)) {
                    files.push({'name':f.name, 'type':f.type, 'size':f.size,'data':f});
                }
            });
            self.fire(event.AFTER_DROP, {files:files});
            uploader._select({files:files});
        }
    }, {
        ATTRS:/** @lends FileDrop.prototype*/{
            /**
             * �������
             * @type String
             * @default 'filedrop'
             */
            pluginId:{
                value:'filedrop'
            },
            /**
             * ָ��ģ�ⰴť
             * @type NodeList
             * @default ''
             */
            target:{
                value:EMPTY,
                getter:function(v){
                    return $(v);
                }
            },
            uploader:{value:EMPTY},
            dropContainer:{
                value:EMPTY
            },
            /**
             * �Ƿ�֧����ק
             */
            isSupport:{value:true},
            /**
             * ģ��
             * @type Object
             * @default {}
             */
            tpl:{
                value:{
                    supportDrop:'<div class="drop-wrapper"></div>',
                    notSupportDropIe:'<div class="drop-wrapper">' +
                        '<p>���������ֻ֧�ִ�ͳ��ͼƬ�ϴ���</p>' +
                        '<p class="suggest J_ButtonWrap">�Ƽ�ʹ��chrome�������firefox�����' +
                        '</p>' +
                        '</div>',
                    notSupportDrop:'<div class="drop-wrapper">' +
                        '<p>���������ֻ֧�ִ�ͳ��ͼƬ�ϴ���</p>' +
                        '<p class="suggest J_ButtonWrap">�Ƽ��������������' +
                        '</p>' +
                        '</div>'
                }
            },
            name:{ value:'' }
        }
    });

    return FileDrop;
}, {requires:['node', 'base']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �ع���rich base�Ĳ��
 */
/**
 * @fileoverview ͼƬ�Ŵ���
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/imageZoom/imageZoom',function(S, Node, Base,Albums) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name ImageZoom
     * @class ͼƬ�Ŵ���
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ImageZoom(config) {
        var self = this;
        //���ø��๹�캯��
        ImageZoom.superclass.constructor.call(self, config);
    }
    S.extend(ImageZoom, Base, /** @lends ImageZoom.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            var theme = uploader.get('theme');
            if(!theme) return false;
            var imageHook = self.get('imageHook');
            var albums = new Albums({
                baseEl: theme.get('queueTarget'),
                img: imageHook
            });

            albums.get('baseEl').delegate('click', imageHook, function(e){
                var target = e.target;
                albums.show($(target));
            });
            self.set("albums",albums);
            uploader.on('success',self._successHandler,self);
        },
        /**
         * �ϴ��ɹ������ͼƬ�Ŵ���
         * @param ev
         * @private
         */
        _successHandler:function(ev){
            var file = ev.file;
            var id = file.id;
            //�������˷��ص�����
            var result = file.result;
            var sUrl =  result.url;
            var $img = $('.J_Pic_'+id);
            $img.attr('data-original-url',sUrl);
        }
    }, {ATTRS : /** @lends ImageZoom*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'imageZoom'
        },
        /**
         * ͼƬ�Ŵ���ʵ��
         */
        albums:{
            value:EMPTY
        },
        /**
         * ͼƬԪ�ص�hook
         */
        imageHook:{
            value:'.preview-img'
        }
    }});
    return ImageZoom;
}, {requires : ['node','base','gallery/albums/1.1/']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �������
 */
/**
 * @fileoverview ͼƬ�ü�
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/imgcrop/imgcrop',function(S, Node,Base,ImgCrop) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name ImgCropPlugin
     * @class ͼƬ�ü����
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ImgCropPlugin(config) {
        var self = this;
        //���ø��๹�캯��
        ImgCropPlugin.superclass.constructor.call(self, config);
        self.set('config',config);
    }
    S.extend(ImgCropPlugin, Base, /** @lends ImgCropPlugin.prototype*/{
        /**
         * �����ʼ��
         * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            var config = self.get('config');
            var crop = new ImgCrop(config);
            self.set('crop',crop);
            uploader.on('success',self._successHandler,self);
            uploader.on('select',self._selectHandler,self);
            crop.on('imgload',function(){
                self.set('isRender',true);
            })
        },
        _successHandler:function(ev){
            var self = this;
            var crop = self.get('crop');
            var file = ev.file;
            var id = file.id;
            var url = ev.result.url;
            crop.set('url',url);
            var target = '.J_CropArea_'+id;
            var $target = $(target);
            if(!$target.length) return false;
            crop.set('areaEl',target);
            crop.container = $target;
            crop.set('areaWidth',$target.width());
            crop.set('areaHeight',$target.height());
            crop.render();
        },
        _selectHandler:function(ev){
            var self = this;
            var isRender = self.get('isRender');
            var crop = self.get('crop');
            if(!isRender) return false;
            crop.destroy();
        }
    }, {ATTRS : /** @lends ImgCropPlugin*/{
        /**
         * �������
         * @type String
         * @default imgcrop
         */
        pluginId:{
            value:'imgcrop'
        },
        /**
         * �Ƿ��Ѿ���ʼ��
         * @type Boolean
         * @default false
         */
        isRender:{value:false},
        config:{value:{}}
    }});
    return ImgCropPlugin;
}, {requires : ['node','base','gallery/imgcrop/2.1/index']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �������
 */
/**
 * @fileoverview ����ͼƬԤ�����
 * @author ��Ӣ�����ӣ�<daxingplay@gmail.com>
 * @date 2012-01-10
 * @requires KISSY 1.2+
 */

KISSY.add('gallery/uploader/1.5/plugins/preview/preview',function (S,Node, D, E,Base,ua) {
    var $ = Node.all;
    var doc = document,
        LOG_PRE = '[Plugin: Preview] ',
        _mode = getPreviewMode(),
        _eventList = {
            check:'check',
            success:'success',
            showed:'showed',
            error:'error'
        };

    /**
     * Private ��⵱ǰ�������Ӧ������Ԥ����ʽ
     * @return {String} ������Ԥ����ʽ
     */
    function getPreviewMode() {
        var previewMode = '';
        // prefer to use html5 file api
        if (typeof window.FileReader === "undefined") {
            switch (S.UA.shell) {
                case 'firefox':
                    previewMode = 'domfile';
                    break;
                case 'ie':
                    switch (S.UA.ie) {
                        case 6:
                            previewMode = 'simple';
                            break;
                        default:
                            previewMode = 'filter';
                            break;
                    }
                    break;
            }
        } else {
            previewMode = 'html5';
        }
        return previewMode;
    }

    /**
     * Private ��ͼƬ�ı���·��д��imgԪ�أ�չ�ָ��û�
     * @param {HTMLElement} imgElem imgԪ��
     * @param {String} data  ͼƬ�ı���·��
     * @param {Number} maxWidth �����
     * @param {Number} maxHeight ���߶�
     */
    function showPreviewImage(imgElem, data, width, height) {
        if (!imgElem) {
            return false;
        }
        if (_mode != 'filter') {
            imgElem.src = data || "";
        } else {
            if (data) {
                data = data.replace(/[)'"%]/g, function (s) {
                    return escape(escape(s));
                });
                try{
                    imgElem.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = data;
                }catch (err){

                }
            }
        }
        return true;
    }

    /**
     * Constructor
     * @param {Object} config ����
     */
    function Preview(config) {
        var self = this,
            _config = {
                maxWidth:40,
                maxHeight:40
            };

        self.config = S.mix(_config, config);

        Preview.superclass.constructor.call(self, config);
    }

    S.extend(Preview, Base, {
        /**
         * �����ʼ��
         */
        pluginInitializer:function(uploader){
            if(!uploader) return false;
            var self = this;
            self.set('uploader',uploader);
            uploader.on('add',self._uploaderAddHandler,self);
        },
        /**
         * ��������ļ��󴥷�
         * @private
         */
        _uploaderAddHandler:function(ev){
            var self = this;
            var uploader = self.get('uploader');
            //Ĭ����Ⱦ���ݣ�����ҪͼƬԤ��
            if(uploader.get('hasRestore')) return false;
            var fileInput = uploader.get('fileInput');
            var file = ev.file;
            var fileData = file.data;
            var id = file.id;
            var preHook = self.get('preHook');
            var $img = $(preHook+id);
            if(!$img.length){
                S.log('����Ϊ��'+preHook+id+'���Ҳ���ͼƬԪ�أ��޷�Ԥ��ͼƬ')
                return false;
            }
            if(uploader.get('multiple') && uploader.get('type') == 'ajax'){
               self.show(fileData,$img,function(){
                   $img.show();
               });
            }else{
                self.preview(fileInput,$img);
                $img.show();
            }
        },
        /**
         * ��ʾԤ��ͼƬ����֧��IE
         * @author ����
         * @since 1.3
         */
        show:function(file,$img,callback){
            if(!file || !$img || !$img.length) return false;
            var self = this;
            var reader = new FileReader();
            reader.onload = function(e){
                var data = self.data = e.target.result;
                self.fire(_eventList.getData, {
                    data: data,
                    mode: _mode
                });
                $img.attr('src',data);
                callback && callback.call(self,data);
                self.fire(_eventList.showed, {
                    img: data
                });
            };
            reader.onerror = function(e){
                S.log(LOG_PRE + 'File Reader Error. Your browser may not fully support html5 file api', 'warning');
                self.fire(_eventList.error);
            };
            reader.readAsDataURL(file);
        },
        /**
         * Ԥ������
         * @param {HTMLElement} fileInput �ļ��ϴ���input
         * @param {HTMLElement} imgElem ��Ҫ��ʾԤ��ͼƬ��imgԪ�أ���������õĻ��������򲻻�ִ����ʾ�������û����ԴӸú����ķ���ֵȡ��Ԥ��ͼƬ�ĵ�ַ����д��
         * @return {String} ȡ�õ�ͼƬ��ַ
         */
        preview:function (fileInput, imgElem) {

            fileInput = D.get(fileInput);
            imgElem = D.get(imgElem);
            var self = this,
                onsuccess = function () {
                    self.fire(_eventList.getData, {
                        data:self.data,
                        mode:_mode
                    });
                    if (imgElem) {
                        showPreviewImage(imgElem, self.data);
                        self.fire(_eventList.showed, {
                            img:imgElem
                        });
                    }
                };

            self.data = undefined;
            if (fileInput) {
                //IE10�޷�ʹ��FileReader��ȡ�ļ�������
                if(ua.ie == 10){
                    _mode =  'filter';
                }
                switch (_mode) {
                    case 'domfile':
                        self.data = fileInput.files[0].getAsDataURL();
                        break;
                    case 'filter':
                        fileInput.select();
                        //fileInput.blur();
                        try {
                            self.data = doc.selection.createRange().text;
                        } catch (e) {
                            S.log(LOG_PRE + 'IE����Ϊ��ȫ������׳��ܾ����ʵĴ��󣬲�����Ԥ��: ');
                            S.log(e, 'dir');
                        } finally {
                            doc.selection.empty();
                        }
                        if (!self.data) {
                            self.data = fileInput.value;
                        }
                        break;
                    case 'html5':
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            self.data = e.target.result;
                            onsuccess();
                        };
                        reader.onerror = function (e) {
                            S.log(LOG_PRE + 'File Reader Error. Your browser may not fully support html5 file api', 'warning');
                            self.fire(_eventList.error);
                        };
                        if (fileInput.files && fileInput.files.length) {
                            reader.readAsDataURL(fileInput.files[0]);
                        }
                        break;
                    case 'simple':
                    default:
                        self.data = fileInput.value;
                        break;
                }

                if (self.data) {
                    onsuccess();
                } else if (_mode != 'html5') {
                    showPreviewImage(imgElem);
                    self.fire(_eventList.error);
                }
            } else {
                S.log(LOG_PRE + 'File Input Element does not exists.');
            }

            return self.data;
        }
    },{ATTRS:{
        /**
         * �������
         * @type String
         * @default preview
         */
        pluginId:{
            value:'preview'
        },
        uploader:{ value: '' },
        /**
         * Ŀ��ͼƬԪ�ع��ӵ�ǰ׺
         */
        preHook:{ value: '.J_Pic_'  }
    }});

    return Preview;

}, {
    requires:['node', 'dom', 'event', 'base','ua' ]
});
/**
 * changes:
 * ���ӣ�1.4
 *           - ȥ��show����
 */
/**
 * @fileoverview ������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/proBars/progressBar',function(S, Node, Base) {
    var EMPTY = '',$ = Node.all,
        PROGRESS_BAR = 'progressbar',ROLE = 'role',
        ARIA_VALUEMIN = 'aria-valuemin',ARIA_VALUEMAX = 'aria-valuemax',ARIA_VALUENOW = 'aria-valuenow',
        DATA_VALUE = 'data-value';
    /**
     * @name ProgressBar
     * @class ������
     * @constructor
     * @extends Base
     * @requires Node
     */
    function ProgressBar(wrapper, config) {
        var self = this;
        config = S.merge({wrapper:$(wrapper)}, config);
        //���ø��๹�캯��
        ProgressBar.superclass.constructor.call(self, config);
    }
    S.mix(ProgressBar, /** @lends ProgressBar.prototype*/{
        /**
         * ģ��
         */
        tpl : {
            DEFAULT:'<div class="ks-progress-bar-value" data-value="{value}"></div>'
        },
        /**
         * ����õ�����ʽ
         */
        cls : {
            PROGRESS_BAR : 'ks-progress-bar',
            VALUE : 'ks-progress-bar-value'
        },
        /**
         * ���֧�ֵ��¼�
         */
        event : {
            RENDER : 'render',
            CHANGE : 'change',
            SHOW : 'show',
            HIDE : 'hide'
        }
    });
    //�̳���Base������getter��setterί����Base����
    S.extend(ProgressBar, Base, /** @lends ProgressBar.prototype*/{
        /**
         * ����
         */
        render : function() {
            var self = this,$wrapper = self.get('wrapper'),
                width = self.get('width');
            if(!$wrapper.length) return false;
            if(width == 'auto') width = $wrapper.parent().width();
            $wrapper.width(width);
            //���������ks-progress-bar��ʽ��
            $wrapper.addClass(ProgressBar.cls.PROGRESS_BAR);
            self._addAttr();
            !self.get('visible') && self.hide();
            self.set('bar',self._create());
            self.fire(ProgressBar.event.RENDER);
        },
        /**
         * ��ʾ������
         */
        show : function(){
            var self = this,$wrapper = self.get('wrapper');
            $wrapper.fadeIn(self.get('duration'),function(){
                self.set('visible',true);
                self.fire(ProgressBar.event.SHOW,{visible : true});
            });
        },
        /**
         * ���ؽ�����
         */
        hide : function(){
            var self = this,$wrapper = self.get('wrapper');
            $wrapper.fadeOut(self.get('duration'),function(){
                self.set('visible',false);
                self.fire(ProgressBar.event.HIDE,{visible : false});
            });
        },
        /**
         * ����������
         * @return {NodeList}
         */
        _create : function(){
            var self = this,
                $wrapper = self.get('wrapper'),
                value = self.get('value'),tpl = self.get('tpl'),
                html = S.substitute(tpl, {value : value}) ;
            $wrapper.html('');
            return $(html).appendTo($wrapper);

        },
        /**
         * ���������������һЩ����
         * @return {Object} ProgressBar��ʵ��
         */
        _addAttr : function() {
            var self = this,$wrapper = self.get('wrapper'),value = self.get('value');
            $wrapper.attr(ROLE, PROGRESS_BAR);
            $wrapper.attr(ARIA_VALUEMIN, 0);
            $wrapper.attr(ARIA_VALUEMAX, 100);
            $wrapper.attr(ARIA_VALUENOW, value);
            return self;
        }
    }, {ATTRS : /** @lends ProgressBar*/{
        /**
         * ����
         */
        wrapper : {value : EMPTY},
        /**
         * ������Ԫ��
         */
        bar : {value : EMPTY},
        /**
         * ���������
         */
        width : { value:'auto' },
        /**
         * ��ǰ����
         */
        value : {
            value : 0,
            setter : function(v) {
                var self = this,$wrapper = self.get('wrapper'),$bar = self.get('bar'),
                    speed = self.get('speed'),
                    width;
                if (v > 100) v = 100;
                if (v < 0) v = 0;
                //���ٷֱȿ�Ȼ��������ֵ
                width = Math.ceil($wrapper.width() * (v / 100));
                $bar.stop().animate({'width':width + 'px'},speed,'none',function(){
                    $wrapper.attr(ARIA_VALUENOW,v);
                    $bar.attr(DATA_VALUE,v);
                    self.fire(ProgressBar.event.CHANGE,{value : v,width : width});
                });
                return v;
            }
        },
        /**
         * ���ƽ������Ŀɼ���
         */
        visible : { value:true },
        /**
         * �����������ٶ�
         */
        duration : {
          value : 0.3
        },
        /**
         * ģ��
         */
        tpl : {
            value : ProgressBar.tpl.DEFAULT
        },
        speed : {value : 0.2}
    }});
    return ProgressBar;
}, {requires : ['node','base']});
/**
 * changes:
 * ���ӣ�1.5
 *           - animǰ����stop()����ֹ����bug
 */
/**
 * @fileoverview ����������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/proBars/proBars',function(S, Node, Base,ProgressBar) {
    var EMPTY = '';
    var $ = Node.all;
    var PRE = 'J_ProgressBar_';
    /**
     * @name ProBars
     * @class ����������
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ProBars(config) {
        var self = this;
        //���ø��๹�캯��
        ProBars.superclass.constructor.call(self, config);
    }
    S.mix(ProBars, /** @lends ProBars.prototype*/{
        /**
         * ���֧�ֵ��¼�
         */
        event : {
            RENDER : 'render'
        }
    });
    S.extend(ProBars, Base, /** @lends ProBars.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            uploader.on('start',function(ev){
                self.add(ev.file.id);
            });

            uploader.on('progress',self._uploaderProgressHandler,self);
            uploader.on('success',self._uploaderSuccessHandler,self);

            self.fire(ProBars.event.RENDER);
        },
        /**
         * �ϴ��иı��������ֵ
         * @param ev
         * @private
         */
        _uploaderProgressHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            //�Ѽ����ֽ���
            var loaded = ev.loaded;
            //���ֽ���
            var total = ev.total;
            var val = Math.ceil((loaded/total) * 100);
            var bar = self.get('bars')[id];
            //�������
            if(bar) bar.set('value',val);
        },
        /**
         * �ϴ��ɹ����ý��ȴﵽ100%
         * @param ev
         * @private
         */
        _uploaderSuccessHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            var bar = self.get('bars')[id];
            var isHide = self.get('isHide');
            //�������
            if(bar) bar.set('value',100);
            if(isHide){
                S.later(function(){
                    var $target = $('.'+PRE+ev.file.id);
                    $target.hide();
                },500);
            }
        },
        /**
         * �򼯺����һ��������
         * @return ProgressBar
         */
        add:function(fileId){
            if(!S.isString(fileId)) return false;
            var self = this;
            var $target = $('.'+PRE+fileId);
            var $count = $('.J_ProgressCount_'+fileId);
            var speed = self.get('speed');
            var progressBar = new ProgressBar($target,{width:self.get('width'),speed:speed});
            if($count.length){
                progressBar.on('change',function(ev){
                    $count.text(ev.value+'%');
                })
            }
            progressBar.render();
            var bars = self.get('bars');
            return bars[fileId] = progressBar;
        }
    }, {ATTRS : /** @lends ProBars*/{
        /**
         * �������
         * @type String
         * @default proBars
         */
        pluginId:{
            value:'proBars'
        },
        /**
        * ������ʵ������
        * @type Object
        * @default {}
        */
        bars:{value:{}},
        /**
         * ���������
         * @type Number
         * @default 'auto'
         */
        width : { value:'auto' },
        /**
         * �����ߵ�100%ʱ�Ƿ�����
         * @type Boolean
         * @default true
         */
        isHide : { value:true },
        /**
         * �������ܶ��ٶȿ���
         * @type Number
         * @default 0.2
         */
        speed : {value : 0.2}
    }});
    return ProBars;
}, {requires : ['node','base','./progressBar']});
/**
 * changes:
 * ���ӣ�1.4
 *           - ����ģ�飬���rich base�Ĳ������ʹ��
 *           - ����iframeʱ���ؽ�����
 */
/**
 * @fileoverview ��input����ȡ���ø����������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/tagConfig/tagConfig',function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    var UPLOADER_OPTIONS = ['autoUpload','postData','action','multiple','multipleLen','uploadType','disabled'];
    var AUTH_OPTIONS = ['max','maxSize','allowRepeat','allowExts','required','widthHeight'];
    /**
     * @name TagConfig
     * @class ��input����ȡ���ø����������
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function TagConfig(config) {
        var self = this;
        //���ø��๹�캯��
        TagConfig.superclass.constructor.call(self, config);
    }
    S.extend(TagConfig, Base, /** @lends TagConfig.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            var input = uploader.get('_oldInput');
            if(!input) return false;
            self.set('uploader',uploader);
            self.set('input',input);
            self.cover();
        },
        /**
         * �����������
         */
        cover:function(){
            var self = this;
            self._setUploaderConfig();
            self._setAuthConfig();
            return self;
        },
        /**
         * �����ϴ�����
         * @private
         */
        _setUploaderConfig:function(){
            var self = this;
            var $input = self.get('input');
            var value;
            var uploader = self.get('uploader');
            S.each(UPLOADER_OPTIONS,function(option){
                value = $input.attr(option);
                if(value){
                    switch (option){
                        case 'postData' :
                            option = 'data';
                            value = S.JSON.parse(value);
                            if(!S.isEmptyObject(value)){
                                value = S.merge(uploader.get('data'),value);
                            }
                            break;
                        case 'uploadType':
                            option = 'type';
                            break;
                        case 'autoUpload' || 'disabled' || 'multiple':
                            value = value == 'true';
                            break;
                    }
                    uploader.set(option,value);
                }
            })
        },
        /**
         * ������֤����
         * @private
         */
        _setAuthConfig:function(){
            var self = this;
            var $input = self.get('input');
            var uploader = self.get('uploader');
            var auth = uploader.getPlugin('auth');
            if(!auth) return false;
            var value;
            var msg;
            S.each(AUTH_OPTIONS,function(option){
                value = $input.attr(option);
                if(value){
                    //demo:max="3"
                    switch (option){
                        case 'allowRepeat' || 'required':
                            value = value == 'true';
                            break;
                        case 'maxSize' || 'max':
                            value = Number(value);
                            break;
                    }
                    auth.set(option,value);
                }
                //������֤��Ϣ
                //demo:max-msg="ÿ������ϴ�{max}���ļ���"
                msg = $input.attr(option + '-msg');
                if(msg){
                    auth.msg(option,msg);
                }
            })
        }
    }, {ATTRS : /** @lends TagConfig*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'tagConfig'
        },
        /**
         * ԭ���ļ��ϴ���
         * @type NodeList
         * @default ''
         */
        input:{
            value:EMPTY
        }
    }});
    return TagConfig;
}, {requires : ['node','base']});
/**
 * changes:
 * ���ӣ�1.4
 *           - ����ģ�飬���ڽ�����ť��ǩ�ϵ�����
 *           - ����auth��msg�����⸲�ǵ����⣬����������ڼ������ʱ�Ŵ���
 */
/**
 * @fileoverview �洢�ļ�·����Ϣ��������
 * @author: ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/urlsInput/urlsInput',function(S, Node, Base) {
    var EMPTY = '',$ = Node.all,LOG_PREFIX = '[uploader-urlsInput]:';
    /**
     * @name UrlsInput
     * @class �洢�ļ�·����Ϣ��������
     * @constructor
     * @extends Base
     * @param {String} wrapper ��������
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {String} config.name *�����������ƣ�����name�������򲻴���ʱ����ᴴ��һ��
     * @param {String} config.split  ���·����ķָ���
     * @param {String} config.tpl   ������ģ��
     *
     */
    function UrlsInput(config) {
        var self = this;
        //���ø��๹�캯��
        UrlsInput.superclass.constructor.call(self, config);
    }
    //�̳���Base������getter��setterί����Base����
    S.extend(UrlsInput, Base, /** @lends UrlsInput.prototype*/{
        /**
         * ��ʼ�����
         * @param {Uploader} uploader Uploader��ʵ��
         */
        pluginInitializer:function(uploader){
            var self = this;
            if(!uploader) return false;
            self.set('uploader',uploader);
            uploader.on('success',self._uploadSuccessHandler,self);

            var queue = uploader.get('queue');
            queue.on('remove',self._fileRemoveHandler,self);
        },
        /**
         * �ϴ��ɹ�����·�����������·��
         * @private
         */
        _uploadSuccessHandler:function(ev){
            var self = this;
            var result = ev.result;
            if(!S.isObject(result)) return false;
            var url = result.url;
            if(self.get('useName')) url = result.name;
            self.add(url);
            return self;
        },
        /**
         * �Ӷ�����ɾ���ļ���Ҳ���������н�·��ɾ��
         * @private
         */
        _fileRemoveHandler:function(ev){
            var self = this;
            var file = ev.file;
            var result = file.result;
            if(!result) return true;
            var url = result.url;
            if(self.get('useName')) url = result.name;
            self.remove(url);
        },
        /**
         * ��·�����������·��
         * @param {String} url ·��
         * @return {UrlsInput}
         */
        add : function(url){
            if(!S.isString(url)){
                S.log(LOG_PREFIX + 'add()��url�������Ϸ���');
                return false;
            }
            var self = this,urls = self.get('urls'),
            //�ж�·���Ƿ��Ѿ�����
                isExist = self.isExist(url);
            //TODO:��ֹ��һ��·�������Ϊ�յ����
            if(urls[0] == EMPTY) urls = [];
            if(isExist){
                S.log(LOG_PREFIX + 'add()���ļ�·���Ѿ����ڣ�');
                return self;
            }
            urls.push(url);
            self.set('urls',urls);
            self._val();
            return self;
        },
        /**
         * ɾ���������ڵ�ָ��·��
         * @param {String} url ·��
         * @return {Array} urls ɾ�����·��
         */
        remove : function(url){
            //TODO:����ļ����а����Ƿ��ַ��������޷�ƥ�䵽
            if(!url) return false;
            var self = this,urls = self.get('urls'),
                isExist = self.isExist(url) ,
                reg = new RegExp(url);
            if(!isExist){
                S.log(LOG_PREFIX + 'remove()�������ڸ��ļ�·����');
                return false;
            }
            urls = S.filter(urls,function(sUrl){
                return !reg.test(sUrl);
            });
            self.set('urls',urls);
            self._val();
            return urls;
        },
        /**
         * ������ǰinput��ֵ��ȡ���ļ�·��
         * @return {Array}
         */
        parse: function(){
            var self = this,
                input = self.get('target');
            if(input){
                var urls = $(input).val(),
                    split = self.get('split'),
                    files;
                if(urls == EMPTY) return [];
                files = urls.split(split);
                self.set('urls',files);
                return files;
            }else{
                S.log(LOG_PREFIX + 'cannot find urls input.');
                return [];
            }
        },
        /**
         * �����������ֵ
         * @return {String}
         */
        _val : function(){
            var self = this,urls = self.get('urls'),
                $input = self.get('target'),
            //���·����ķָ���
                split = self.get('split'),
                sUrl = urls.join(split);
            $input.val(sUrl);
            return sUrl;
        },
        /**
         * �Ƿ��Ѿ�����ָ��·��
         * @param {String} url ·��
         * @return {Boolean}
         */
        isExist : function(url){
            var self = this,b = false,urls = self.get('urls'),
                reg = new RegExp(url);
            if(!urls.length) return false;
            S.each(urls,function(val){
                if(reg.test(val)){
                    return b = true;
                }
            });
            return b;
        }
    }, {ATTRS : /** @lends UrlsInput.prototype*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'urlsInput'
        },
        /**
         * �ϴ����ʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{ value:EMPTY },
        /**
         * �ļ�·��
         * @type Array
         * @default []
         */
        urls : { value : [] },
        /**
         * ���·����ķָ���
         * @type String
         * @default ","
         */
        split : {value : ',',
            setter : function(v){
                var self = this;
                self._val();
                return v;
            }
        },
        /**
         * �ļ�·������input
         * @type KISSY.Node
         * @default ""
         */
        target : {value : EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        /**
         * urlʹ��name
         * @type KISSY.Node
         * @default ""
         */
        useName:{value:false}
    }});

    return UrlsInput;
}, {requires:['node','base']});
/**
 * changes:
 * ���ӣ�1.5
 *          - [+]UrlsInput����useName����
 * ���ӣ�1.4
 *           - �ع���ȥ��create�����������Զ�����urlsInput
 *           - �ƶ���pluginsĿ¼�£���Ϊ�������
 *           - ȥ��target����������֧��
 *           - rich base�Ĳ����ʽ���֣�����pluginInitializer����
 *           - ����uploader��success�¼���queue��remove�¼�
 */
/**
 * @fileoverview ճ���ϴ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/paste/paste',function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name Paste
     * @class ճ���ϴ�
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function Paste(config) {
        var self = this;
        //���ø��๹�캯��
        Paste.superclass.constructor.call(self, config);
    }
    S.extend(Paste, Base, /** @lends Paste.prototype*/{
        /**
         * �����ʼ��
         * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            var $target = self.get('target');
            if(!$target.length) return false;
            $target.on('paste',function(e){
                //��ȡ����������
                var items = e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.items, data = {files: []};
                if (items && items.length) {
                    var queue = uploader.get('queue');
                    S.each(items, function (item) {
                        var file = item.getAsFile && item.getAsFile();
                        if(S.isObject(file)){
                            file.name = 'file-'+ S.guid()+'.png';
                            var file = {'name' : file.name,'type' : file.type,'size' : file.size,data:file};
                            file = queue.add(file);
                            var index = queue.getFileIndex(file.id);
                            uploader.upload(index);
                        }
                    });
                }
            })
        }
    }, {ATTRS : /** @lends Paste*/{
        /**
         * �������
         * @type String
         */
        pluginId:{
            value:'paste'
        },
        /**
         * ��ȡճ�����ݵĽڵ�Ԫ�أ�Ĭ��Ϊdocument
         * @type NodeList
         */
        target:{
            value:$(document)
        }
    }});
    return Paste;
}, {requires : ['node','base']});
/**
 * changes:
 * ���ӣ�1.5
 *           - �������
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
 * @fileoverview mini��½������ͨ�ýӿڣ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/miniLogin/miniLogin',function(S, Node, Base,token,ML) {
    var EMPTY = '';
    var $ = Node.all;

    function MiniLogin(config) {
        var self = this;
        //���ø��๹�캯��
        MiniLogin.superclass.constructor.call(self, config);
    }
    S.extend(MiniLogin, Base, /** @lends MiniLogin.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            uploader.on('select',function(){
                var isLogin = ML.check();
                if(!isLogin){
                    var autoUpload = uploader.get('autoUpload');
                    var isSetUpload = false;
                    if(autoUpload){
                        uploader.set('autoUpload',false);
                        isSetUpload = true;
                    }
                    ML.show({}, function() {
                        token(uploader,function(){
                            uploader.uploadFiles();
                        });
                        if(isSetUpload) uploader.set('autoUpload',true)
                    });
                }
            })
        }
    }, {ATTRS : /** @lends MiniLogin*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'miniLogin'
        }
    }});
    return MiniLogin;
}, {requires : ['node','base','../../token','tbc/mini-login/1.4.0/']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �������
 */
KISSY.add('gallery/uploader/1.5/plugins/plugins',function(S,Auth,Filedrop,ImageZoom,Imgcrop,Preview,ProBars,TagConfig,UrlsInput,Paste,MiniLogin) {
    /**
     * ���еĲ������
     */
    return {
        Auth:Auth,
        Filedrop:Filedrop,
        ImageZoom:ImageZoom,
        Imgcrop:Imgcrop,
        Preview:Preview,
        ProBars:ProBars,
        TagConfig:TagConfig,
        UrlsInput:UrlsInput,
        Paste:Paste,
        MiniLogin:MiniLogin
    }
},{requires:['./auth/auth','./filedrop/filedrop','./imageZoom/imageZoom','./imgcrop/imgcrop','./preview/preview','./proBars/proBars','./tagConfig/tagConfig','./urlsInput/urlsInput','./paste/paste','./miniLogin/miniLogin']})

