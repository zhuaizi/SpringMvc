/*
combined files : 

gallery/uploader/1.5/themes/daogouUploader/index

*/
/**
 * @fileoverview �Ա�����ƽ̨���ϴ��ļ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/themes/daogouUploader/index',function (S, Node, DefaultTheme) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name Daogou
     * @class �Ա�����ƽ̨���ϴ��ļ�
     * @constructor
     * @author ��ƽ�����ӣ�<minghe36@126.com>
     */
    function Daogou(config) {
        var self = this;
        //���ø��๹�캯��
        Daogou.superclass.constructor.call(self, config);
    }

    S.extend(Daogou, DefaultTheme, /** @lends Daogou.prototype*/{
        /**
         * ѡ���ļ��󴥷�
         * @private
         */
        _selectHandler:function(ev){
            var file = ev.files[0];
            var name = file.name;
            $('.J_FileName').val(name);
        },
        /**
         * �ļ����ڿ�ʼ�ϴ�״̬ʱ����
         */
        _startHandler : function(ev){
             var self = this;
             var file = ev.file;
             self._showMsg(file,'.J_UploadingMsg');
        },
        _successHandler:function(ev){
            var self = this;
            var file = ev.file;
            self._showMsg(file,'.J_SuccessMsg');
        },
        /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function(ev){
            var self = this;
            var file = ev.file;
            if(!file) return false;
            var id = ev.file.id;
            var msg = ev.msg;
            //��ӡ������Ϣ
            $('.J_ErrorMsg_' + id).html(msg);
            self._showMsg(ev.file,'.J_ErrorMsg');
        },
        /**
         * ��ʾ������Ϣ
         * @param hook
         * @private
         */
        _showMsg:function(file,hook){
            var $target = $(file.target);
            $target.all('.status-msg').hide();
            $target.all(hook).show();
        }
    }, {ATTRS:/** @lends Daogou.prototype*/{
        /**
         *  ���������ļ�����
         * @type String
         * @default "daogouUploader"
         */
        name:{value:'daogouUploader'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<div id="queue-file-{id}" class="file-uploading" data-name="{name}">' +
                '<div class="J_UploadingMsg status-msg">' +
                    '<p class="file-name">{name}</p>' +
                    '<p class="tx">���ڲ������Ժ�...</p>' +
                    '<div class="J_ProgressBar_{id} f-l uploader-progress"><img class="loading" src="http://img01.taobaocdn.com/tps/i1/T1F5tVXjRfXXXXXXXX-16-16.gif" alt="loading" /></div>' +
                '</div>' +


                '<div class="J_SuccessMsg status-msg"><i class="i-success"></i><div class="tx"><b>�ϴ��ɹ�!</b></div>' +

                '<div class="J_ErrorMsg status-msg"> <i class="i-tip"></i> <div class="tx"><b>�ϴ�ʧ�ܣ�<i class="dg-light J_ErrorMsg_{id}"></i></b></div></div>' +
            '</div>'
        }
    }});
    return Daogou;
}, {requires:['node', 'gallery/gallery/uploader/1.5/themes/default/index']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �̳���Default����
 */

