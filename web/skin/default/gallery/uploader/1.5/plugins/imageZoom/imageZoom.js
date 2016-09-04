/*
combined files : 

gallery/uploader/1.5/plugins/imageZoom/imageZoom

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

