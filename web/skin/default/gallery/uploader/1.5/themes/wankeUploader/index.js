/*
combined files : 

gallery/uploader/1.5/themes/wankeUploader/index

*/
/**
 * @fileoverview ͼƬ�ϴ�����
 * @author ����
 **/
KISSY.add('gallery/uploader/1.5/themes/wankeUploader/index',function (S, Node, Theme) {
    var EMPTY = '', $ = Node.all;

    /**
     * @name WankeUploader
     * @class ͼƬ�ϴ�����
     * @constructor
     * @extends Theme
     * @requires Theme
     * @requires  ProgressBar
     * @author ����
     */
    function WankeUploader(config) {
        var self = this;
        //���ø��๹�캯��
        WankeUploader.superclass.constructor.call(self, config);
    }

    S.extend(WankeUploader, Theme, /** @lends WankeUploader.prototype*/{
        /**
         * �ļ������ϴ��ɹ�״̬ʱ����
         */
        _successHandler:function (e) {
            var d = e.result,
                htmlStr = '',
                uploadList = $('#J_UploadGoodsPicList'),
                lastUpload = $('.J_LastUpload', uploadList);

            htmlStr = '<li class="dib J_LastUpload">' +
                '<div class="img">' +
                '<img src="'+ d.url +'" />' +
                '</div>' +
                '</li>';

            // ���֮ǰ���ύͼƬ���滻
            if (lastUpload.length) {
                lastUpload.replaceWith(htmlStr);
            // ����ǵ�һ���ύ�����뵽��һ
            } else {
                uploadList.prepend(htmlStr);
            }

            // �ɹ�����
            this.showTip('succ', '�ɹ���', 2000);
        },
         /**
         * �ļ������ϴ�����״̬ʱ����
         */
        _errorHandler:function (e) {
             this.showTip('error', e.msg || e.result.msg || 'ϵͳ�������Ժ�����', 2000);
        },
        showTip: function (status, text, time, callback, align) {
            if (!align) {
                align = {
                    node: null,
                    points: ['cc', 'cc'],
                    offset: [0, 0]
                };
            }
            var self = this;
            if (self.t) {
                clearTimeout(self.t);
            }
            var cls = '';
            var icon = '';
            if (status == 'succ') {
                cls = 'succ';
                icon = '&#379;';
            }
            var _time = time || 3000;
            var tmpl = '<p><span>' + text + '</span></p>';
            if (!self.dialog) {
                S.use('overlay', function () {
                    self.dialog = new S.Overlay({
                        prefixCls: 'wanke-',
                        align: align,
                        effect: {
                            effect: 'fade',
                            easing: '',
                            duration: .3
                        },
                        closable: false,
                        //mask:true,
                        zIndex: 10002,
                        content: tmpl
                    });

                    self.dialog.render();
                    self.dialog.show();

                    self.t = setTimeout(function () {
                        self.dialog.hide();
                        if (callback && S.isFunction(callback)) {
                            callback();
                        }
                    }, _time);
                });
            } else {
                self.dialog.hide();
                //var align = data.align;
                self.dialog.align(align.node, align.points, align.offset);
                self.dialog.get('contentEl')[0].innerHTML = tmpl;
                self.dialog.show();
                self.t = setTimeout(function () {
                    self.dialog.hide();
                    if (callback && S.isFunction(callback)) {
                        callback();
                    }
                }, _time);
            }
        }
    }, {ATTRS:/** @lends WankeUploader.prototype*/{
        /**
         *  ���������ļ������������Ƹ���ʽϢϢ���
         * @type String
         * @default "wankeUploader"
         */
        name:{value:'wankeUploader'},
        /**
         * ����ʹ�õ�ģ��
         * @type String
         * @default ""
         */
        fileTpl:{value:
            '<li id="queue-file-{id}" class="g-u" data-name="{name}">' +
                '<div class="pic">' +
                    '<a href="javascript:void(0);"><img class="J_Pic_{id} preview-img" src="" /></a>' +
                '</div>' +
                '<div class=" J_Mask_{id} pic-mask"></div>' +
                '<div class="status-wrapper">' +
                    '<div class="status waiting-status"><p>�ȴ��ϴ������Ժ�</p></div>' +
                    '<div class="status start-status progress-status success-status">' +
                        '<div class="J_ProgressBar_{id}"><s class="loading-icon"></s>�ϴ���...</div>' +
                    '</div>' +
                    '<div class="status error-status">' +
                        '<p class="J_ErrorMsg_{id}">���������ϣ����Ժ����ԣ�</p></div>' +
                '</div>' +
                '<a class="J_Del_{id} del-pic" href="#">ɾ��</a>' +
            '</li>'
        },
        /**
         * �����ϴ����ļ�����
         * @since 1.4
         * @type String
         * @default jpg,png,gif,jpeg
         */
        allowExts:{
            value:'jpg,png,gif,jpeg,bmp'
        },
        maxSize:{
            value:10000
        },
        widthHeight:{
            value: function (width, height) {
                return width > 170 && height > 170;
            }
        },
        /**
         * ��֤��Ϣ
         * @type Object
         * @since 1.4
         * @default {}
         */
        authMsg:{
            value:{
                maxSize:'ͼƬ����10M',
                allowExts:'��֧��{ext}��ʽ��',
                widthHeight:'���ϴ�����170*170��С��ͼƬ'
            }
        }
    }});
    return WankeUploader;
}, {requires:['node', 'gallery/gallery/uploader/1.5/theme']});

