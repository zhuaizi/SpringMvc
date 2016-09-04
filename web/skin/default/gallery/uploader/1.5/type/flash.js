/**
 * @fileoverview flash�ϴ���������������д��ajbridge�ڵ�uploader
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add(function (S, Node, UploadType) {
    var EMPTY = '', LOG_PREFIX = '[uploader-FlashType]:';
    /**
     * @name FlashType
     * @class flash�ϴ���������������д��ajbridge�ڵ�uploader
     * @constructor
     * @extends UploadType
     * @requires Node
     */
    function FlashType(config) {
        var self = this;
        //���ø��๹�캯��
        FlashType.superclass.constructor.call(self, config);
        self.isHasCrossdomain();
        self._init();
    }

    S.mix(FlashType, /** @lends FlashType.prototype*/{
        /**
         * �¼��б�
         */
        event:S.merge(UploadType.event, {
            //swf�ļ��Ѿ�׼������
            SWF_READY: 'swfReady',
            //�����ϴ�
            PROGRESS:'progress'
        })
    });

    S.extend(FlashType, UploadType, /** @lends FlashType.prototype*/{
        /**
         * ��ʼ��
         */
        _init:function () {
            var self = this, swfUploader = self.get('swfUploader');
            if(!swfUploader){
                S.log(LOG_PREFIX + 'swfUploader����Ϊ�գ�');
                return false;
            }
            //SWF ����׼������
            swfUploader.on('contentReady', function(ev){
                self.fire(FlashType.event.SWF_READY);
            }, self);
            //������ʼ�ϴ��¼�
            swfUploader.on('uploadStart', self._uploadStartHandler, self);
            //�����ļ������ϴ��¼�
            swfUploader.on('uploadProgress', self._uploadProgressHandler, self);
            //�����ļ��ϴ�����¼�
            swfUploader.on('uploadCompleteData',self._uploadCompleteDataHandler,self);
            //�����ļ�ʧ���¼�
            swfUploader.on('uploadError',self._uploadErrorHandler,self);
        },
        /**
         * �ϴ��ļ�
         * @param {String} id �ļ�id
         * @return {FlashType}
         */
        upload:function (id) {
            var self = this, swfUploader = self.get('swfUploader'),
                action = self.get('action'), method = 'POST',
                data = self.get('data'),
                name = self.get('fileDataName');
            if(!name) name = 'Filedata';
            self.set('uploadingId',id);
            S.mix(data,{"type":"flash"});
            swfUploader.upload(id, action, method, data,name);
            return self;
        },
        /**
         * ֹͣ�ϴ��ļ�
         * @return {FlashType}
         */
        stop:function () {
            var self = this, swfUploader = self.get('swfUploader'),
                uploadingId = self.get('uploadingId');
            if(uploadingId != EMPTY){
                swfUploader.cancel(uploadingId);
                self.fire(FlashType.event.STOP, {id : uploadingId});
            }
            return self;
        },
        /**
         * ��ʼ�ϴ��¼�������
         * @param {Object} ev ev.file���ļ�����
         */
        _uploadStartHandler : function(ev){
            var self = this;
            self.fire(FlashType.event.START, {'file' : ev.file });
        },
        /**
         * �ϴ����¼�������
         * @param {Object} ev
         */
        _uploadProgressHandler:function (ev) {
            var self = this;
            S.mix(ev, {
                //�Ѿ���ȡ���ļ��ֽ���
                loaded:ev.bytesLoaded,
                //�ļ��ܹ��ֽ���
                total : ev.bytesTotal
            });
            S.log(LOG_PREFIX + '�Ѿ��ϴ��ֽ���Ϊ��' + ev.bytesLoaded);
            self.fire(FlashType.event.PROGRESS, { 'loaded':ev.loaded, 'total':ev.total });
        },
        /**
         * �ϴ���ɺ��¼�������
         * @param {Object} ev
         */
        _uploadCompleteDataHandler : function(ev){
            var self = this;
            var result = self._processResponse(ev.data);
            self.set('uploadingId',EMPTY);
            self.fire(FlashType.event.SUCCESS, {result : result});
        },
        /**
         *�ļ��ϴ�ʧ�ܺ��¼�������
         */
        _uploadErrorHandler : function(ev){
            var self = this;
            self.set('uploadingId',EMPTY);
            self.fire(FlashType.event.ERROR, {msg : ev.msg});
        },
        /**
         * Ӧ���Ƿ���flash��������ļ�
         */
        isHasCrossdomain:function(){
            var domain = location.hostname;
             S.io({
                 url:'http://' + domain + '/crossdomain.xml',
                 dataType:"xml",
                 error:function(){
                     S.log('ȱ��crossdomain.xml�ļ�����ļ����Ϸ���');
                 }
             })
        }
    }, {ATTRS:/** @lends FlashType*/{
        /**
         * ��������·��������flash�����Ǿ���·��
         */
        action:{
            value:EMPTY,
            getter:function(v){
                var reg = /^http/;
                //���Ǿ���·��ƴ�ӳɾ���·��
                if(!reg.test(v)){
                     var href = location.href,uris = href.split('/'),newUris;
                    newUris  = S.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        /**
         * ajbridge��uploader�����ʵ�����������
         */
        swfUploader:{value:EMPTY},
        /**
         * �����ϴ����ļ�id
         */
        uploadingId : {value : EMPTY}
    }});
    return FlashType;
}, {requires:['node', './base']});
