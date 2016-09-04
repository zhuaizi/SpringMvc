/*
combined files : 

gallery/uploader/1.5/theme
gallery/uploader/1.5/themes/default/index

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
 * @fileoverview Ĭ������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/themes/default/index',function (S, Node, Theme) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name DefaultTheme
     * @class Ĭ������
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author ��ƽ�����ӣ�<minghe36@126.com>
     */
    function DefaultTheme(config) {
        var self = this;
        //���ø��๹�캯��
        DefaultTheme.superclass.constructor.call(self, config);
    }

    S.extend(DefaultTheme, Theme, /** @lends DefaultTheme.prototype*/{
        /**
         * ����������һ���ļ��󴥷�
         */
        _addHandler : function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            //ɾ������
            var $del = $(".J_Del_" + id);
            //ȡ������
            var $cancel = $(".J_Cancel_" + id);
            //�ϴ�����
            var $upload = $('.J_Upload_' + id);

            //���ȡ��
            $cancel.on('click', function (ev) {
                ev.preventDefault();
                var index = queue.getFileIndex(file.id);
                uploader.cancel(index);
            });
            //���ɾ��
            $del.on('click', function (ev) {
                ev.preventDefault();
                var index = queue.getFileIndex(file.id);
                //ɾ�������е��ļ�
                queue.remove(index);
            });

            //����ϴ�
            $upload.on('click', function (ev) {
                ev.preventDefault();
                var index = queue.getFileIndex(file.id);
                uploader.upload(index);
            });
        },
        /**
         * �ļ����������ϴ�״̬ʱ����
         */
        _progressHandler:function(ev){

        },
        /**
         * �ļ������ϴ��ɹ�״̬ʱ����
         */
        _successHandler:function(ev){
            var file = ev.file;
            var id = file.id;
            var $del = $(".J_Del_" + id);
            var $cancel = $(".J_Cancel_" + id);
            $del.show();
            $cancel.hide();
        },
        /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function(ev){
            var file = ev.file;
            if(!file) return false;
            var id = ev.file.id;
            var msg = ev.msg || ev.result.msg;
            //��ӡ������Ϣ
            $('.J_ErrorMsg_' + id).html(msg);
        }
    }, {ATTRS:/** @lends DefaultTheme.prototype*/{
        /**
         *  ���������ļ�����
         * @type String
         * @default "defaultTheme"
         */
        name:{value:'defaultTheme'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<li id="queue-file-{id}" class="grid" data-name="{name}">' +
                '<div class="g-u sprite file-icon"></div>' +
                '<div class="g-u">{name}</div>' +
                '<div class="g-u status-wrapper grid">' +
                '<div class="status waiting-status">�ȴ��ϴ���<a class="J_Upload_{id}" href="#Upload">����ϴ�</a> </div>' +
                '<div class="status start-status progress-status success-status clearfix">' +
                '<div class="J_ProgressBar_{id} g-u uploader-progress"><img class="loading" src="http://img01.taobaocdn.com/tps/i1/T1F5tVXjRfXXXXXXXX-16-16.gif" alt="loading" /></div>' +
                ' <a  class="J_Cancel_{id} g-u upload-cancel" href="#uploadCancel">ȡ��</a>' +
                '<a href="#fileDel" class=" g-u J_Del_{id}" style="display:none;">ɾ��</a>' +
                '</div> ' +
                '<div class="status cancel-status">�Ѿ�ȡ���ϴ���<a href="#reUpload" id="J_ReUpload_{id}" class="J_Upload_{id}">��������ϴ�</a> </div>' +
                '<div class="status error-status upload-error"><span class="J_ErrorMsg_{id}"></span><a href="#fileDel" class="J_Del_{id}">ɾ��</a></div>' +
                '</div>' +
                '</li>'
        },
        /**
         * ����Ĳ��
         * @type String
         * @default 'proBars' ������
         */
        use:{
            value:'proBars'
        },
        /**
         * ��֤��Ϣ
         * @since 1.4
         * @type Object
         * @default {max:'ÿ������ϴ�{max}���ļ���',
                    maxSize:'�ļ���СΪ{size}������{maxSize}��',
                    required:'�����ϴ�һ���ļ���',
                    require:'�����ϴ�һ���ļ���',
                    allowExts:'��֧��{ext}��ʽ��',
                    allowRepeat:'���ļ��Ѿ����ڣ�'}
         */
        authMsg:{
            value:{
                max:'ÿ������ϴ�{max}���ļ���',
                maxSize:'�ļ���СΪ{size}������{maxSize}��',
                required:'�����ϴ�һ���ļ���',
                allowExts:'��֧��{ext}��ʽ��',
                allowRepeat:'���ļ��Ѿ����ڣ�'
            }
        }
    }});
    return DefaultTheme;
}, {requires:['node', '../../theme']});

