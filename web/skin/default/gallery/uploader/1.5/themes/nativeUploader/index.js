/*
combined files : 

gallery/uploader/1.5/theme
gallery/uploader/1.5/themes/nativeUploader/index

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
 * @fileoverview nativeͼƬ�ϴ�����
 * @author ����
 **/
KISSY.add('gallery/uploader/1.5/themes/nativeUploader/index',function (S, Node, Theme) {
    var EMPTY = '', $ = Node.all;

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
            var $delBtn = $('.J_Del_'+id) ;
            $delBtn.data('data-file',file);
            //���ɾ����ť
            $delBtn.on('click',self._delHandler,self);
            self.hideBtn();
        },
        _removeHandler:function(){
            var self = this;
            var uploader = self.get('uploader');
            var $btn = uploader.get('target');
            $btn.fadeIn(0.3);
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
            var self = this;
            var file = ev.file;
            var id = file.id;
            var percentage = ev.percentage;
            var $precentage = $('.J_Progress_'+id);
            if($precentage.length){
                self._setDisplayMsg(true,file);
                $precentage.text(percentage+"%");
            }
        },
        /**
         * �ļ������ϴ��ɹ�״̬ʱ����
         */
        _successHandler:function (ev) {
            var self = this;
            var file = ev.file;
            //�������˷��ص�����
            var result = ev.result;
            //��ȡ���������ص�ͼƬ·��д�뵽src��
            if(result) self._changeImageSrc(ev);
            self._setDisplayMsg(false,file);
            $('.J_StatusWrapper_'+file.id).hide();
        },
         /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function (ev) {
             var self = this;
             var msg = ev.msg;
             var file = ev.file;
             var id = ev.file.id;
             //��ӡ������Ϣ
             $('.J_ErrorMsg_' + id).html(msg);
             self._setDisplayMsg(true,file);
             //�����̨��ӡ������Ϣ
             S.log(msg);
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
                queue.remove(index);
                var $btn = uploader.get('target');
                $btn.fadeIn(0.3);
            }
        },
        //���ذ�ť
        hideBtn:function(){
            var self = this;
            var uploader = self.get('uploader');
            var $btn = uploader.get('target');
            if(!$btn.length) return false;
            var auth = uploader.getPlugin('auth') ;
            if(!auth) return false;
            var max = auth.get('max');
            if(!max) return false;
            var queue = self.get('queue');
            //�ɹ��ϴ����ļ���
            var successFiles = queue.get('files');
            var len = successFiles.length;
            if(len >= max) $btn.fadeOut(0.3);
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
            $img.show();
            $img.attr('src',url);
            return url;
        }
    }, {ATTRS:/** @lends ImageUploader.prototype*/{
        /**
         *  ���������ļ������������Ƹ���ʽϢϢ���
         */
        name:{value:'native-uploader'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<li id="queue-file-{id}" class="g-u" data-name="{name}">' +
                '<div class="pic">' +
                    '<img class="J_Pic_{id} preview-img" src="" />' +
                '</div>' +
                '<div class=" J_Mask_{id} pic-mask"></div>' +
                '<div class="status-wrapper J_StatusWrapper_{id}">' +
                    '<div class="status waiting-status">0%</div>' +
                    '<div class="status progress-status success-status J_Progress_{id}"></div > ' +
                    '<div class="status error-status">' +
                        '<p class="J_ErrorMsg_{id}">�ϴ�ʧ��</p></div>' +
                    '</div>' +
                '<a class="J_Del_{id} del-pic" href="#"></a>' +
            '</li>'
        }
    }});
    return ImageUploader;
}, {requires:['node', '../../theme']});

