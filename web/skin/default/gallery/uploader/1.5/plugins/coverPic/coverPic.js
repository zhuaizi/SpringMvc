/*
combined files : 

gallery/uploader/1.5/plugins/coverPic/coverPic

*/
/**
 * @fileoverview ?????????????????????????????????
 * @author ??????????<daxingplay@gmail.com>??????<jianping.xwh@taobao.com>

 */
KISSY.add('gallery/uploader/1.5/plugins/coverPic/coverPic',function(S, Node,Base){

    var $ = Node.all;

    /**
     * ???????????????????????????????
     * @param {NodeList | String} $input ??????
     * @param {Uploader} uploader uploader?????
     * @constructor
     */
    function CoverPic($input,uploader){

    }
    S.extend(CoverPic, Base, /** @lends CoverPic.prototype*/{
        /**
         * ?????????
         * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;

        }
    },{
        ATTRS:/** @lends CoverPic.prototype*/{
            /**
             * ????????
             * @type String
             * @default urlsInput
             */
            pluginId:{
                value:'coverPic'
            }
        }
    });

    return CoverPic;

}, {
    requires: [ 'node','base' ]
});

