/*
combined files : 

gallery/uploader/1.5/theme
gallery/uploader/1.5/themes/imageUploader/index
gallery/uploader/1.5/themes/refundUploader/index

*/
/**
 * @fileoverview �ϴ�����������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/

KISSY.add('gallery/uploader/1.5/theme',function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    //������ʽ��ǰ׺
    var classSuffix = {BUTTON:'-button', QUEUE:'-queue'};
    //html����ȡ����ģ���������type��<script type="text/uploader-theme"></script>
    var HTML_THEME = 'text/uploader-theme';
    /**
     * @name Theme
     * @class �ϴ�����������
     * @constructor
     * @extends Base
     * @requires Queue
     */
    function Theme(config) {
        var self = this;
        //���ø��๹�캯��
        Theme.superclass.constructor.call(self, config);
    }

    S.extend(Theme, Base, /** @lends Theme.prototype*/{
        /**
         * �������⣨��������չʹ�ã�
         */
        render:function(){
            var self = this;
            var uploader = self.get("uploader");
            uploader.set('theme',self);
            self._addThemeCssName();
            self._tplFormHtml();
            self._bind();
        },
        /**
         * ѡ���ļ���ִ�еķ���
         * @private
         */
        _selectHandler:function(){

        },
        /**
         * ���������һ���ļ��󴥷�
         */
        _addHandler:function (ev) {

        },
        /**
         * ɾ�������е��ļ��󴥷��ļ�����
         */
        _removeHandler:function (ev) {

        },
        /**
         * �ļ����ڵȴ��ϴ�״̬ʱ����
         */
        _waitingHandler:function (ev) {

        },
        /**
         * �ļ����ڿ�ʼ�ϴ�״̬ʱ����
         */
        _startHandler:function (ev) {

        },
        /**
         * �ļ����������ϴ�״̬ʱ����
         */
        _progressHandler:function (ev) {

        },
        /**
         * �ļ������ϴ��ɹ�״̬ʱ����
         */
        _successHandler:function (ev) {

        },
        /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function (ev) {

        },
        /**
         * ��ȾĬ������
         * @private
         */
        _restore:function(){
            var self = this;
            var uploader = self.get('uploader');
            var urlsInput = uploader.getPlugin('urlsInput');
            if(!urlsInput) return false;
            var autoRestore = urlsInput.get('autoRestore');
            if(!autoRestore) return false;

            var queue = uploader.get('queue');
            var files = queue.get('files');
            if(!files.length) return false;

            S.each(files,function(file,i){
                //�����ڵ��ļ�������Ⱦ������DOM�У�״̬Ϊsuccess
                file.status = 'success';
                uploader.fire('add',{file:file,index:i});
                self._renderHandler('_successHandler',{file:file,result:file.result});
                self._hideStatusDiv(file);
            });

            return self;
        },
        /**
         * ��������д�뵽���кͰ�ťĿ����������Ϊ����css��ʽ��ʼ
         */
        _addThemeCssName:function () {
            var self = this;
            var name = self.get('name');
            var $queueTarget = self.get('queueTarget');
            var uploader = self.get('uploader');
            var $btn = uploader.get('target');
            if(!$queueTarget.length){
                S.log('����������Ŀ�꣡');
                return false;
            }
            if (name == EMPTY) return false;
            if($queueTarget.length)  $queueTarget.addClass('ks-uploader-queue ' + name + classSuffix.QUEUE);
            $btn.addClass(name + classSuffix.BUTTON);
            return self;
        },
        /**
         * ����uploader���¼�
         * @private
         */
        _bind:function(){
            var self = this;
            var uploader = self.get('uploader');
            var uploaderEvents = ['add','remove','select','start','progress','success','error','complete'];

            uploader.on(uploaderEvents[0],function(ev){
                var $target = self._appendFileDom(ev.file);
                var queue = uploader.get('queue');
                queue.updateFile(ev.index,{target:$target});
            });

            uploader.on(uploaderEvents[1],function(ev){
                self._removeFileDom(ev.file);
            });
            S.each(uploaderEvents,function(e){
                uploader.on(e,function(ev){
                    var handlerName = '_'+ev.type+'Handler';
                    self._renderHandler(handlerName,ev);
                });
            })
        },
        /**
         * ���м���������
         * @private
         */
        _renderHandler:function(handlerName,ev){
            var self = this;
            var handler = self[handlerName];
            self._setStatusVisibility(ev.file);
            handler && handler.call(self,ev);
        },
        /**
         * ���ø���״̬�µ���Ϣ�ɼ���
         * @param {Object} file �ļ�
         */
        _setStatusVisibility:function (file) {
            var self = this;
            if(!S.isObject(file) || S.isEmptyObject(file)) return self;
            self._hideStatusDiv(file);
            //������Ϣ�����Ӱ
            var status = file.status;
            var $target = file.target;
            if(!$target.length) return false;
            var $status = $target.all('.'+status+'-status');
            if($status.length){
                $status.show();
            }
            //�������Ԫ�ص�״̬��ʽ
            var statuses = ['waiting','start','uploading','progress','error','success'];
            S.each(statuses,function(status){
                $target.removeClass(status);
            });
            $target.addClass(status);
            return self;
        },
        /**
         * ������Ϣ��
         * @private
         */
        _hideStatusDiv:function(file){
            if(!S.isObject(file)) return false;
            var $target = file.target;
            $target && $target.length && $target.all('.status').hide();
        },
        /**
         * ������������ļ����ݺ���������������ļ���ϢDOM�ṹ
         * @param {Object} fileData �ļ�����
         * @return {KISSY.NodeList}
         */
        _appendFileDom:function (fileData) {
            var self = this;
            var tpl = self.get('fileTpl');
            var $target = $(self.get('queueTarget'));
            var hFile;
            if (!$target.length) return false;
            hFile = S.substitute(tpl, fileData);
            return $(hFile).hide().appendTo($target).fadeIn(0.4).data('data-file', fileData);
        },
        /**
         *  �Ƴ��ļ�DOM
         * @private
         */
        _removeFileDom:function(file){
            if(!S.isObject(file)) return false;
            var $target = file.target;
            if(!$target || !$target.length) return false;
            $target.fadeOut(0.4,function(){
                $target.remove();
            })
        },
        /**
         * ��html����ȡģ��
         * @private
         * @return {String}
         */
        _tplFormHtml:function(){
            var self = this;
            var tpl = self.get('fileTpl');
            var $target = $(self.get('queueTarget'));
            var hasHtmlTpl = false;
            if(!$target.length) return false;

            var $tpl = $target.all('script');
            $tpl.each(function(el){
                if(el.attr('type') == HTML_THEME){
                    hasHtmlTpl = true;
                    tpl = el.html();
                    self.set('fileTpl',tpl);
                }
            });

            return tpl;
        }

    }, {ATTRS:/** @lends Theme.prototype*/{
        /**
         *  ������
         * @type String
         * @default ""
         */
        name:{value:EMPTY},
        /**
         * ��Ҫ���ص�uploader���
         * @type String
         * @default ''
         */
        use:{value:EMPTY},
        /**
         * ����ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:EMPTY },
        /**
         * ��֤��Ϣ
         * @since 1.4
         * @type Object
         */
        authMsg:{
            value:{}
        },
        /**
         * ����Ŀ��Ԫ�أ�һ����ul�������е�ʵ����������Theme��
         * @type NodeList
         * @default ""
         */
        queueTarget:{
            value:EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        /**
         * Queue���ϴ����У�ʵ��
         * @type Queue
         * @default ""
         */
        queue:{value:EMPTY},
        /**
         * Uploader �ϴ����ʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{value:EMPTY}
    }});
    return Theme;
}, {requires:['node', 'base']});
/**
 * changes:
 * ���ӣ�1.5
 *      - ����ioError�¼��ļ���
 * ���ӣ�1.4
 *           - ȥ��״̬������log��Ϣ
 *           - ����Ĭ����Ⱦ���ݲ���
 *           - ȥ���������
 *           - ���Ӵ�html��ȡģ��Ĺ���
 *           - ���Ӵ��ⲿ���ٸ�������������Ĺ���
 *           - ��������������֤��Ϣ�Ĺ���
 *           - queueTarget�Ż�
 *           - ȥ��extend����
 *           - ȥ��cssUrl����
 *           - ����authMsgʧЧ������ʧЧ������
 */
/**
 * @fileoverview ͼƬ�ϴ����⣨��ͼƬԤ��������һ������Ӣͬѧ��ɣ��պ�ͬѧ���˴����Ż������������Ż�
 * @author �պӡ���Ӣ������
 **/
KISSY.add('gallery/uploader/1.5/themes/imageUploader/index',function (S, Node, Theme) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name ImageUploader
     * @class ͼƬ�ϴ����⣨��ͼƬԤ��������һ������Ӣͬѧ��ɣ��պ�ͬѧ���˴����Ż������������Ż�
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author �պӡ���Ӣ������
     */
    function ImageUploader(config) {
        var self = this;
        //���ø��๹�캯��
        ImageUploader.superclass.constructor.call(self, config);
    }

    S.extend(ImageUploader, Theme, /** @lends ImageUploader.prototype*/{
        /**
         * ������ļ�dom�����ִ�еķ���
         * @param {Object} ev ����{index:0,file:{},target:$target}
         */
        _addHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            var $target = file.target;
            var $delBtn = $('.J_Del_'+id) ;
            //��ʾ/����ɾ����ť
            $target.on('mouseover mouseout',function(ev){
                if(ev.type == 'mouseover'){
                    $delBtn.show();
                    self._setDisplayMsg(true,file);
                }else{
                    $delBtn.hide();
                    self._setDisplayMsg(false,file);
                }
            });
            $delBtn.data('data-file',file);
            //���ɾ����ť
            $delBtn.on('click',self._delHandler,self);
        },
        /**
         * ɾ���ļ������¼������ϴ���
         * @private
         */
        _removeHandler:function(){
            this._setCount();
        },
        /**
         * �ļ����ڿ�ʼ�ϴ�״̬ʱ����
         */
        _startHandler:function (ev) {

        },
        /**
         * �ļ����������ϴ�״̬ʱ����
         */
        _progressHandler:function (ev) {

        },
        /**
         * �ļ������ϴ��ɹ�״̬ʱ����
         */
        _successHandler:function (ev) {
            var self = this;
            var file = ev.file;
            var id = file.id;
            //�������˷��ص�����
            var result = file.result;
            self._setCount();
            //��ȡ���������ص�ͼƬ·��д�뵽src��
            if(result) self._changeImageSrc(ev);
            $('.J_Mask_'+id).hide();

            //��������ڽ�������������ؽ���������
            var uploader = self.get('uploader');
            var proBars = uploader.getPlugin('proBars');
            if(!proBars){
                var target = file.target;
                if(!target) return false;
                target.all('.J_ProgressBar_'+id).hide();
            }
        },
         /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function (ev) {
             var self = this;
             var msg = ev.msg || ev.result.msg || ev.result.message;
             var file = ev.file;
             if(!file) return false;
             var id = ev.file.id;
             //��ӡ������Ϣ
             $('.J_ErrorMsg_' + id).html(msg);
             self._setDisplayMsg(true,ev.file);
             //�����̨��ӡ������Ϣ
             S.log(msg);
        },
        /**
         * ��ʾ���㻹�����ϴ�����ͼƬ��
         */
        _setCount:function(){
            var self = this;
            //������ʾ�ϴ���������
            var elCount = self.get('elCount');
            if(!elCount.length) return false;
            var uploader = self.get('uploader');
            var auth = uploader.getPlugin('auth') ;
            if(!auth) return false;

            var max = auth.get('max');
            if(!max) return false;

            var len = self.getFilesLen();
            elCount.text(Number(max)-len);
        },
        /**
         * ��ʾ/�������ֲ㣨���ֲ��ڳ���״̬��Ϣ��ʱ����֣�
          * @param isShow
         * @param data
         * @return {Boolean}
         * @private
         */
        _setDisplayMsg:function(isShow,data){
            if(!data) return false;
            var $mask = $('.J_Mask_' + data.id);
            //���������������������ֲ�
            if($mask.parent('li') && $mask.parent('li').hasClass('error')) return false;
            $mask[isShow && 'show' || 'hide']();
        },
        /**
         * ɾ��ͼƬ�󴥷�
         */
        _delHandler:function(ev){
            ev.preventDefault();
            var self = this;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var file = $(ev.currentTarget).data('data-file');
            if(file){
                var index = queue.getFileIndex(file.id);
                var status = file.status;
                //����ļ������ϴ���ȡ���ϴ�
                if(status == 'start' || status == 'progress'){
                    uploader.cancel(index);
                }
                queue.remove(index);
            }
        },
        /**
         * ��ȡ�ɹ��ϴ���ͼƬ�����������ε������ȡ�ɹ��ϴ�������
         * @param {String} status ״̬
         * @return {Number} ͼƬ����
         */
        getFilesLen:function(status){
            if(!status) status = 'success';
            var self = this,
            queue = self.get('queue'),
            //�ɹ��ϴ����ļ���
            successFiles = queue.getFiles(status);
            return successFiles.length;
        },
        /**
         * �����������ص�ͼƬ·��д��Ԥ��ͼƬ���򣬲����������֧��ͼƬԤ��
          */
        _changeImageSrc:function(ev){
            var file = ev.file;
            var id = file.id;
            var result = ev.result;
            var url = result.url;
            var $img = $('.J_Pic_' + id);
            if($img.attr('src') == EMPTY || S.UA.safari){
                $img.show();
                $img.attr('src',url);
            }
        }
    }, {ATTRS:/** @lends ImageUploader.prototype*/{
        /**
         *  ���������ļ������������Ƹ���ʽϢϢ���
         * @type String
         * @default "imageUploader"
         */
        name:{value:'imageUploader'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<li id="queue-file-{id}" class="g-u" data-name="{name}">' +
                '<div class="pic">' +
                    '<a href="javascript:void(0);"><img class="J_Pic_{id} preview-img" src="" /></a>' +
                '</div>' +
                '<div class=" J_Mask_{id} pic-mask"></div>' +
                '<div class="status-wrapper">' +
                    '<div class="status waiting-status"><p>�ȴ��ϴ������Ժ�</p></div>' +
                    '<div class="status start-status progress-status success-status">' +
                        '<div class="J_ProgressBar_{id}"><s class="loading-icon"></s>�ϴ���...</div>' +
                    '</div>' +
                    '<div class="status error-status">' +
                        '<p class="J_ErrorMsg_{id}">���������ϣ����Ժ����ԣ�</p></div>' +
                '</div>' +
                '<a class="J_Del_{id} del-pic" href="#">ɾ��</a>' +
            '</li>'
        },
        /**
         * �����ϴ����ļ�����
         * @since 1.4
         * @type String
         * @default jpg,png,gif,jpeg
         */
        allowExts:{
            value:'jpg,png,gif,jpeg'
        },
        /**
         * ��֤��Ϣ
         * @type Object
         * @since 1.4
         * @default {}
         */
        authMsg:{
            value:{
                max:'ÿ������ϴ�{max}��ͼƬ��',
                maxSize:'ͼƬ����{maxSize}��',
                required:'�����ϴ�һ��ͼƬ��',
                allowExts:'��֧��{ext}��ʽ��',
                allowRepeat:'��ͼƬ�Ѿ����ڣ�',
                widthHeight:'ͼƬ�ߴ粻����Ҫ��'
            }
        },
        /**
         * ͳ���ϴ�����������
         * @type KISSY.NodeList
         * @default '#J_UploadCount'
         */
        elCount:{
            value:'#J_UploadCount',
            getter:function(v){
                return $(v);
            }
        }
    }});
    return ImageUploader;
}, {requires:['node', '../../theme']});
/**
 * @fileoverview �˿�ƾ֤�ϴ����⣬�̳���imageUploader����
 * @author ����
 **/
KISSY.add('gallery/uploader/1.5/themes/refundUploader/index',function (S, Node, ImageUploader) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name RefundUploader
     * @class �˿�ƾ֤�ϴ����⣬�̳���imageUploader����
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author ����
     */
    function RefundUploader(config) {
        var self = this;
        //���ø��๹�캯��
        RefundUploader.superclass.constructor.call(self, config);
    }

    S.extend(RefundUploader, ImageUploader, /** @lends RefundUploader.prototype*/{
        /**
         * ���ϴ����������Ϻ�ִ�еķ��������ϴ�������еĿ��ƶ�Ӧ������������ڣ�
         * @param {Uploader} uploader
         */
        render:function () {
            var self = this;
            RefundUploader.superclass.render.call(self);
            var uploader = self.get('uploader');
            //���Ƴ��ļ���ı䰴ť�ϵ��İ�
            uploader.on('remove',function(){
                self._changeText();
            });
            uploader.on('success',function(){
                self._changeText();
            });
            //��ȡ�°�ť�ϵ��İ�
            var $btn = uploader.get('target');
            var text = $btn.text();
            self.set('defaultText',text);
        },
        /**
         * ������ļ�dom�����ִ�еķ���
         * @param {Object} ev ����{index:0,file:{},target:$target}
         */
        _addHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            var $delBtn = $('.J_Del_'+id) ;
            $delBtn.data('data-file',file);
            //���ɾ����ť
            $delBtn.on('click',self._delHandler,self);

            //��ʾͼƬԤ��
            var $img = $('.J_Pic_' + id);
            $img.show();
        },
         /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function (ev) {
            var self = this;
             var msg = ev.msg;
             var file = ev.file;
             //�����̨��ӡ������Ϣ
             S.log(msg);
             if(!file) return false;
             var id = file.id;
            //��ӡ������Ϣ
            $('.J_ErrorMsg_' + id).html('�ϴ�ʧ��');

             S.later(function(){
                 alert(msg);
                 var uploader = self.get('uploader');
                 var queue = uploader.get('queue');
                 queue.remove(id);
             },1000);
        },
        /**
         * �ı䰴ť�ϵ��İ�
         * @private
         */
        _changeText:function(){
            var self = this;
            var uploader = self.get('uploader');
            var len = self.getFilesLen();
            var $btnTarget = uploader.get('target');
            var $text = $btnTarget.children('span');
            //demo:'�����ϴ���{max}��ͼƬ'
            var maxText = self.get('maxText');
            //demo:�ϴ�ͼƬ
            var defaultText = self.get('defaultText');
            var max = uploader.get('max');
            if(Number(max) <= len){
                //�ı䰴ť�İ�
                $text.text(S.substitute(maxText,{max:max}));
            }else{
                $text.text(defaultText);
            }
        }
    }, {ATTRS:/** @lends RefundUploader.prototype*/{
        /**
         *  ���������ļ������������Ƹ���ʽϢϢ���
         * @type String
         * @default "refundUploader"
         */
        name:{value:'refundUploader'},
        /**
         * ����Ĳ��
         * @type String
         * @default 'proBars,filedrop,preview,imageZoom'
         */
        use:{value:'proBars,filedrop,preview,imageZoom'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<li id="queue-file-{id}" class="g-u" data-name="{name}">' +
                '<div class="pic-wrapper">' +
                    '<div class="pic">' +
                        '<span><img class="J_Pic_{id} preview-img" src="" /></span>' +
                    '</div>' +
                    '<div class=" J_Mask_{id} pic-mask"></div>' +
                    '<div class="status-wrapper J_FileStatus">' +
                        '<div class="status waiting-status"><p>�ȴ��ϴ�</p></div>' +
                        '<div class="status start-status progress-status success-status">' +
                            '<div class="J_ProgressBar_{id}">�ϴ���...</div>' +
                        '</div>' +
                        '<div class="status error-status">' +
                            '<p class="J_ErrorMsg_{id}">�ϴ�ʧ�ܣ������ԣ�</p></div>' +
                    '</div>' +
                '</div>'+
                '<div>' +
                    '<a class="J_Del_{id} del-pic" href="#">ɾ��</a>' +
                '</div>' +
            '</li>'
        },
        /**
         * ��ť�ϵ�Ĭ���İ���ֻ����
         * @type String
         * @default ''
         */
        defaultText:{value:EMPTY},
        /**
         * ���ﵽ����ϴ���ʱ��ť�ϸı���İ�
         * @type String
         * @default '�����ϴ���{max}��ͼƬ'
         */
        maxText:{value:'�����ϴ���{max}��ͼƬ'}
    }});
    return RefundUploader;
}, {requires:['node', '../imageUploader/']});

