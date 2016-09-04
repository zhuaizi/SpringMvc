/*
combined files : 

gallery/uploader/1.5/themes/ershouUploader/index

*/
/**
 * @fileoverview �����г�ͼƬ�ϴ�����
 * @author ��Ӣ(����)<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/themes/ershouUploader/index', function (S, Node, ImageUploader) {
    var EMPTY = '';
    var $ = Node.all;

    /**
     * @name ErshouUploader
     * @class �����г�ͼƬ�ϴ�����
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author ��Ӣ�����ӣ�<daxingplay@gmail.com>
     */
    function ErshouUploader(config) {
        var self = this;
        //���ø��๹�캯��
        ErshouUploader.superclass.constructor.call(self, config);
    }
    
    S.extend(ErshouUploader, ImageUploader, /** @lends ErshouUploader.prototype*/ {
        render:function(){
            var self = this;
            var uploader = self.get('uploader');
		}
    }, {
    	ATTRS: /** @lends ErshouUploader.prototype*/ {
    		/**
	         *  ������
	         * @type String
	         * @default "ershouUploader"
	         */
	        name: {
	        	value: 'ershouUploader'
        	},
	        /**
	         * cssģ��·��
	         * @type String
	         * @default "gallery/uploader/1.5/themes/ershouUploader/style.css"
	         */
	        cssUrl: { 
	        	value: 'gallery/uploader/1.5/themes/ershouUploader/style.css'
			},
	        /**
	         * ����ʹ�õ�ģ��
	         * @type String
	         */
	        fileTpl:{
	        	value: '<li id="J_LineQueue-{id}" data-file-id="{id}" data-url="{sUrl}" data-name="{name}" data-size="{textSize}">'+
							'<div class="J_Wrapper wrapper">' +
								'<div class="tb-pic120">'+
									'<a href="javascript:void(0);"><img class="J_ItemPic" src="{sUrl}" /></a>'+
								'</div>'+
								'<div class="pic-mask"></div>'+
                                '<div class="status-wrapper">' +
                                    '<div class="status waiting-status tips-upload-waiting"><p>�ȴ��ϴ������Ժ�</p></div>' +
                                    '<div class="status start-status progress-status success-status tips-upload-success">' +
                                    '<div class="J_ProgressBar_{id}"><s class="loading-icon"></s>�ϴ���...</div>' +
                                    '</div>' +
                                    '<div class="status error-status">' +
                                    '<p class="J_ErrorMsg_{id} tips-upload-error">�ϴ�ʧ�ܣ������ԣ�</p></div>' +
                                '</div>' +
								'<div class="upload-op-mask"></div>'+
								'<div class="upload-operations">'+
									'<a class="J_SetMainPic set-as-main" data-file-id="{id}" href="#">��Ϊ��ͼ</a>'+
									'<a class="J_DeleltePic del-pic" data-file-id="{id}" href="#">ɾ��</a>'+
								'</div>'+
							'</div>'+
						'</li>'
	        },
            use:{
                value:'proBars,filedrop,preview,coverPic'
            },
			/**
			 * Ĭ�ϵ���ʾ��Ϣ
			 * @type String
			 */
			'defaultMsg': {
				value: '����ϴ�{max}����Ƭ��ÿ��ͼƬС��5M'
			},
			/**
			 * ʣ������ŵ���Ϣ
			 * @type String
			 */
			'leftMsg': {
				value: '�������ϴ�{left}��ͼƬ��ÿ��С��5M����ͼ�������������չʾ�����������á�'
			}
    	}
    });

    return ErshouUploader;
}, {
	requires:[ 'node', 'gallery/gallery/uploader/1.5/themes/imageUploader/index' ]
});
/**
 * changes:
 * ���ӣ�1.4
 *           - �ع�����
 */

