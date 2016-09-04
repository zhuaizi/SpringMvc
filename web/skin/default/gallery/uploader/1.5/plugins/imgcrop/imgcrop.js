/*
combined files : 

gallery/uploader/1.5/plugins/imgcrop/imgcrop

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

