/*
combined files : 

gallery/uploader/1.5/plugins/paste/paste

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

