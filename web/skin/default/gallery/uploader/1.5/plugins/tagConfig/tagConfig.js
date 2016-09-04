/*
combined files : 

gallery/uploader/1.5/plugins/tagConfig/tagConfig

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

