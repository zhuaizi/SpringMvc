/*
combined files : 

gallery/uploader/1.5/plugins/preview/preview

*/
/**
 * @fileoverview ����ͼƬԤ�����
 * @author ��Ӣ�����ӣ�<daxingplay@gmail.com>
 * @date 2012-01-10
 * @requires KISSY 1.2+
 */

KISSY.add('gallery/uploader/1.5/plugins/preview/preview',function (S,Node, D, E,Base,ua) {
    var $ = Node.all;
    var doc = document,
        LOG_PRE = '[Plugin: Preview] ',
        _mode = getPreviewMode(),
        _eventList = {
            check:'check',
            success:'success',
            showed:'showed',
            error:'error'
        };

    /**
     * Private ��⵱ǰ�������Ӧ������Ԥ����ʽ
     * @return {String} ������Ԥ����ʽ
     */
    function getPreviewMode() {
        var previewMode = '';
        // prefer to use html5 file api
        if (typeof window.FileReader === "undefined") {
            switch (S.UA.shell) {
                case 'firefox':
                    previewMode = 'domfile';
                    break;
                case 'ie':
                    switch (S.UA.ie) {
                        case 6:
                            previewMode = 'simple';
                            break;
                        default:
                            previewMode = 'filter';
                            break;
                    }
                    break;
            }
        } else {
            previewMode = 'html5';
        }
        return previewMode;
    }

    /**
     * Private ��ͼƬ�ı���·��д��imgԪ�أ�չ�ָ��û�
     * @param {HTMLElement} imgElem imgԪ��
     * @param {String} data  ͼƬ�ı���·��
     * @param {Number} maxWidth �����
     * @param {Number} maxHeight ���߶�
     */
    function showPreviewImage(imgElem, data, width, height) {
        if (!imgElem) {
            return false;
        }
        if (_mode != 'filter') {
            imgElem.src = data || "";
        } else {
            if (data) {
                data = data.replace(/[)'"%]/g, function (s) {
                    return escape(escape(s));
                });
                try{
                    imgElem.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = data;
                }catch (err){

                }
            }
        }
        return true;
    }

    /**
     * Constructor
     * @param {Object} config ����
     */
    function Preview(config) {
        var self = this,
            _config = {
                maxWidth:40,
                maxHeight:40
            };

        self.config = S.mix(_config, config);

        Preview.superclass.constructor.call(self, config);
    }

    S.extend(Preview, Base, {
        /**
         * �����ʼ��
         */
        pluginInitializer:function(uploader){
            if(!uploader) return false;
            var self = this;
            self.set('uploader',uploader);
            uploader.on('add',self._uploaderAddHandler,self);
        },
        /**
         * ��������ļ��󴥷�
         * @private
         */
        _uploaderAddHandler:function(ev){
            var self = this;
            var uploader = self.get('uploader');
            //Ĭ����Ⱦ���ݣ�����ҪͼƬԤ��
            if(uploader.get('hasRestore')) return false;
            var fileInput = uploader.get('fileInput');
            var file = ev.file;
            var fileData = file.data;
            var id = file.id;
            var preHook = self.get('preHook');
            var $img = $(preHook+id);
            if(!$img.length){
                S.log('����Ϊ��'+preHook+id+'���Ҳ���ͼƬԪ�أ��޷�Ԥ��ͼƬ')
                return false;
            }
            if(uploader.get('multiple') && uploader.get('type') == 'ajax'){
               self.show(fileData,$img,function(){
                   $img.show();
               });
            }else{
                self.preview(fileInput,$img);
                $img.show();
            }
        },
        /**
         * ��ʾԤ��ͼƬ����֧��IE
         * @author ����
         * @since 1.3
         */
        show:function(file,$img,callback){
            if(!file || !$img || !$img.length) return false;
            var self = this;
            var reader = new FileReader();
            reader.onload = function(e){
                var data = self.data = e.target.result;
                self.fire(_eventList.getData, {
                    data: data,
                    mode: _mode
                });
                $img.attr('src',data);
                callback && callback.call(self,data);
                self.fire(_eventList.showed, {
                    img: data
                });
            };
            reader.onerror = function(e){
                S.log(LOG_PRE + 'File Reader Error. Your browser may not fully support html5 file api', 'warning');
                self.fire(_eventList.error);
            };
            reader.readAsDataURL(file);
        },
        /**
         * Ԥ������
         * @param {HTMLElement} fileInput �ļ��ϴ���input
         * @param {HTMLElement} imgElem ��Ҫ��ʾԤ��ͼƬ��imgԪ�أ���������õĻ��������򲻻�ִ����ʾ�������û����ԴӸú����ķ���ֵȡ��Ԥ��ͼƬ�ĵ�ַ����д��
         * @return {String} ȡ�õ�ͼƬ��ַ
         */
        preview:function (fileInput, imgElem) {

            fileInput = D.get(fileInput);
            imgElem = D.get(imgElem);
            var self = this,
                onsuccess = function () {
                    self.fire(_eventList.getData, {
                        data:self.data,
                        mode:_mode
                    });
                    if (imgElem) {
                        showPreviewImage(imgElem, self.data);
                        self.fire(_eventList.showed, {
                            img:imgElem
                        });
                    }
                };

            self.data = undefined;
            if (fileInput) {
                //IE10�޷�ʹ��FileReader��ȡ�ļ�������
                if(ua.ie == 10){
                    _mode =  'filter';
                }
                switch (_mode) {
                    case 'domfile':
                        self.data = fileInput.files[0].getAsDataURL();
                        break;
                    case 'filter':
                        fileInput.select();
                        //fileInput.blur();
                        try {
                            self.data = doc.selection.createRange().text;
                        } catch (e) {
                            S.log(LOG_PRE + 'IE����Ϊ��ȫ������׳��ܾ����ʵĴ��󣬲�����Ԥ��: ');
                            S.log(e, 'dir');
                        } finally {
                            doc.selection.empty();
                        }
                        if (!self.data) {
                            self.data = fileInput.value;
                        }
                        break;
                    case 'html5':
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            self.data = e.target.result;
                            onsuccess();
                        };
                        reader.onerror = function (e) {
                            S.log(LOG_PRE + 'File Reader Error. Your browser may not fully support html5 file api', 'warning');
                            self.fire(_eventList.error);
                        };
                        if (fileInput.files && fileInput.files.length) {
                            reader.readAsDataURL(fileInput.files[0]);
                        }
                        break;
                    case 'simple':
                    default:
                        self.data = fileInput.value;
                        break;
                }

                if (self.data) {
                    onsuccess();
                } else if (_mode != 'html5') {
                    showPreviewImage(imgElem);
                    self.fire(_eventList.error);
                }
            } else {
                S.log(LOG_PRE + 'File Input Element does not exists.');
            }

            return self.data;
        }
    },{ATTRS:{
        /**
         * �������
         * @type String
         * @default preview
         */
        pluginId:{
            value:'preview'
        },
        uploader:{ value: '' },
        /**
         * Ŀ��ͼƬԪ�ع��ӵ�ǰ׺
         */
        preHook:{ value: '.J_Pic_'  }
    }});

    return Preview;

}, {
    requires:['node', 'dom', 'event', 'base','ua' ]
});
/**
 * changes:
 * ���ӣ�1.4
 *           - ȥ��show����
 */

