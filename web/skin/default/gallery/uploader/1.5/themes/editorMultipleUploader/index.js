/*
combined files : 

gallery/uploader/1.5/themes/editorMultipleUploader/index

*/
/**
 * @fileoverview kissy��editor���༭����������ϴ�
 * @author ����
 **/
KISSY.add('gallery/uploader/1.5/themes/editorMultipleUploader/index',function (S, Node, Theme) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name EditorMultipleUploader
     * @class kissy��editor���༭����������ϴ�
     * @constructor
     * @extends Theme
     * @requires Theme
     * @author ����
     */
    function EditorMultipleUploader(config) {
        var self = this;
        //���ø��๹�캯��
        EditorMultipleUploader.superclass.constructor.call(self, config);
    }

    S.extend(EditorMultipleUploader, Theme, /** @lends EditorMultipleUploader.prototype*/{
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
             var msg = ev.msg || ev.result.msg;
             var file = ev.file;
             if(!file) return false;
             var id = ev.file.id;
             //��ӡ������Ϣ
             $('.J_ErrorMsg_' + id).html(msg);
             //�����̨��ӡ������Ϣ
             S.log(msg);
        },
        /**
         * ɾ��ͼƬ�󴥷�
         */
        _delHandler:function(ev){
             var self = this;
            var uploader = self.get('uploader');
            var queue = uploader.get('queue');
            var file = $(ev.target).data('data-file');
            var index = queue.getFileIndex(file.id);
            var status = file.status;
            //����ļ������ϴ���ȡ���ϴ�
             if(status == 'start' || status == 'progress'){
                 uploader.cancel(index);
             }
            queue.remove(index);
        }
    }, {ATTRS:/** @lends EditorMultipleUploader.prototype*/{
        /**
         *  ���������ļ������������Ƹ���ʽϢϢ���
         * @type String
         * @default "editorMultipleUploader"
         */
        name:{value:'editorMultipleUploader'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<tr id="queue-file-{id}" data-name="{name}">'+
                '<td class="ks-editor-upload-filename">{name}</td>'+
                '<td class="ks-editor-upload-filesize">{textSize}</td>'+
                '<td class="ks-editor-upload-progress">'+
                    '<div class="status-wrapper">'+
                        '<div class="status waiting-status start-status progress-status success-status">'+
                            '<div class="J_ProgressBar_{id} ks-editor-progressbar"></div>'+
                            '<span class="ks-editor-progressbar-title J_ProgressCount_{id}">0%</span>' +
                        '</div>'+
                        '<div class="status error-status">' +
                            '<p class="J_ErrorMsg_{id}">���������ϣ����Ժ����ԣ�</p>' +
                        '</div>' +
                    '</div>'+
                '</td>'+
                '<td>'+
                    '<a href="#" class="ks-editor-upload-delete J_Del_{id} del-pic">ɾ��</a>'+
                '</td>'+
            '</tr>'
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
        }
    }});
    return EditorMultipleUploader;
}, {requires:['node', 'gallery/gallery/uploader/1.5/theme']});

