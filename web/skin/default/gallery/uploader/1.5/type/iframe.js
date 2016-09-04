/**
 * @fileoverview iframe�����ϴ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add(function(S, Node, UploadType) {
    var EMPTY = '',$ = Node.all,LOG_PREFIX = '[uploader-iframeType]:',ID_PREFIX = 'ks-uploader-iframe-';

    /**
     * @name IframeType
     * @class iframe�����ϴ���ȫ�����֧��
     * @constructor
     * @extends UploadType
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     *
     */
    function IframeType(config) {
        var self = this;
        //���ø��๹�캯��
        IframeType.superclass.constructor.call(self, config);
    }

    S.mix(IframeType, /**@lends IframeType*/ {
        /**
         * ���õ���htmlģ��
         */
        tpl : {
            IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
            FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',
            HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
        },
        /**
         * �¼��б�
         */
        event : S.mix(UploadType.event,{
            //����iframe��form�󴥷�
            CREATE : 'create',
            //ɾ��form�󴥷�
            REMOVE : 'remove'
        })
    });
    //�̳���Base������getter��setterί����Base����
    S.extend(IframeType, UploadType, /** @lends IframeType.prototype*/{
        /**
         * �ϴ��ļ�
         * @param {HTMLElement} fileInput �ļ�input
         */
        upload : function(fileInput) {
            var self = this,$input = $(fileInput),form;
            if (!$input.length) return false;
            self.fire(IframeType.event.START, {input : $input});
            self.set('fileInput', $input);
            //����iframe��form
            self._create();
            form = self.get('form');
            if(!form){
                S.log(LOG_PREFIX + 'form�ڵ㲻���ڣ�');
                return false;
            }
            //�ύ����iframe��
            form.getDOMNode().submit();
        },
        /**
         * ֹͣ�ϴ�
         * @return {IframeType}
         */
        stop : function() {
            var self = this,iframe = self.get('iframe');
            iframe.attr('src', 'javascript:"<html></html>";');
            self._remove();
            self.fire(IframeType.event.STOP);
            self.fire(IframeType.event.ERROR, {status : 'abort',msg : '�ϴ�ʧ�ܣ�ԭ��abort'});
            return self;
        },
        /**
         * ����������ת����hiddenԪ��
         * @param {Object} data ��������
         * @return {String} hiddenInputHtml hiddenԪ��htmlƬ��
         */
        dataToHidden : function(data) {
            if (!S.isObject(data) || S.isEmptyObject(data)) return '';
            var self = this,hiddenInputHtml = EMPTY,
                //hiddenԪ��ģ��
                tpl = self.get('tpl'),hiddenTpl = tpl.HIDDEN_INPUT;
            if (!S.isString(hiddenTpl)) return '';
            for (var k in data) {
                hiddenInputHtml += S.substitute(hiddenTpl, {'name' : k,'value' : data[k]});
            }
            return hiddenInputHtml;
        },
        /**
         * ����һ���յ�iframe�������ļ��ϴ����ύ�󷵻ط�����������
         * @return {NodeList}
         */
        _createIframe : function() {
            var self = this,
                //iframe��id
                id = ID_PREFIX + S.guid(),
                //iframeģ��
                tpl = self.get('tpl'),iframeTpl = tpl.IFRAME,
                existIframe = self.get('iframe'),
                iframe,$iframe;
            //���ж��Ƿ��Ѿ�����iframe������ֱ�ӷ���iframe
            if (!S.isEmptyObject(existIframe)) return existIframe;
            if (!S.isString(iframeTpl)) {
                S.log(LOG_PREFIX + 'iframe��ģ�岻�Ϸ���');
                return false;
            }
            if (!S.isString(id)) {
                S.log(LOG_PREFIX + 'id���������Ϊ�ַ������ͣ�');
                return false;
            }
            //���������ϴ���iframe
            iframe = S.substitute(tpl.IFRAME, { 'id' : id });
            $iframe = $(iframe);
            if(!self.get('domain')){
                //����iframe��load�¼�
                $iframe.on('load', self._iframeLoadHandler, self);
            }
            $('body').append($iframe);
            self.set('id',id);
            self.set('iframe', $iframe);
            $('body').data('UPLOAD_TYPE',self);
            return $iframe;
        },
        handleResult:function(result){
            var self = this;
            result = self._processResponse(result);
            self.fire(IframeType.event.SUCCESS, {result : result});
            self._remove();
        },
        /**
         * iframe������ɺ󴥷����ļ��ϴ�������
         */
        _iframeLoadHandler : function(ev) {
            var self = this,iframe = ev.target;
            var errorEvent = IframeType.event.ERROR;
            try{
                var doc = iframe.contentDocument || window.frames[iframe.id].document;
                if (!doc || !doc.body) {
                    self.fire(errorEvent, {msg : '�������˷������������⣡'});
                    return false;
                }
                var response = doc.body.innerHTML;
                //���Ϊֱ���˳�
                if(response == EMPTY) return false;
                self.handleResult(response);
            }catch (e){
                S.log(e);
            }
        },
        /**
         * �����ļ��ϴ���
         * @return {NodeList}
         */
        _createForm : function() {
            var self = this,
                //iframe��id
                id = self.get('id'),
                //formģ��
                tpl = self.get('tpl'),formTpl = tpl.FORM,
                //��Ҫ���͸��������˵�����
                data = self.get('data'),
                //�������˴����ļ��ϴ���·��
                action = self.get('action'),
                fileInput = self.get('fileInput'),
                hiddens,$form,form;
            if (!S.isString(formTpl)) {
                S.log(LOG_PREFIX + 'formģ�岻�Ϸ���');
                return false;
            }
            if (!S.isString(action)) {
                S.log(LOG_PREFIX + 'action�������Ϸ���');
                return false;
            }
            hiddens = self.dataToHidden(data);
           hiddens += self.dataToHidden({"type":"iframe"});
            form = S.substitute(formTpl, {'action' : action,'target' : id,'hiddenInputs' : hiddens});
            //��¡�ļ��򣬲���ӵ�form��
            $form = $(form).append(fileInput);
            $('body').append($form);
            self.set('form', $form);
            return $form;
        },
        /**
         * ����iframe��form
         */
        _create : function() {
            var self = this,
                iframe = self._createIframe(),
                form = self._createForm();
            self.fire(IframeType.event.CREATE, {iframe : iframe,form : form});
        },
        /**
         * �Ƴ���
         */
        _remove : function() {
            var self = this,form = self.get('form');
            if(!form)return false;
            //�Ƴ���
            form.remove();
            //����form����
            self.reset('form');
            self.fire(IframeType.event.REMOVE, {form : form});
        }
    }, {ATTRS : /** @lends IframeType.prototype*/{
        /**
         * iframe�������õ���htmlģ�壬һ�㲻��Ҫ�޸�
         * @type {}
         * @default
         * {
         IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
         FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',
         HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
         }
         */
        tpl : {value : IframeType.tpl},
        /**
         * ֻ����������iframeid,idΪ����Զ�����
         * @type String
         * @default  'ks-uploader-iframe-' +���id
         */
        id : {value : ID_PREFIX + S.guid()},
        domain:{value:EMPTY},
        /**
         * iframe
         */
        iframe : {value : {}},
        form : {value : EMPTY},
        fileInput : {value : EMPTY}
    }});

    return IframeType;
}, {requires:['node','./base']});
