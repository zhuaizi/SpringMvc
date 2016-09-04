/**
 * @fileoverview �ϴ���ʽ��Ļ���
 * @author: ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add(function(S, Node, Base) {
    var EMPTY = '',$ = Node.all;

    /**
     * @name UploadType
     * @class �ϴ���ʽ��Ļ��࣬����ͨ�õ��¼��ͷ�����һ�㲻ֱ�Ӽ���������¼�
     * @constructor
     * @extends Base
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {String} config.action *����������·��
     * @param {Object} config.data ���͸��������˵Ĳ������ϣ��ᱻת��hiddenԪ��post���������ˣ�
     *
     */
    function UploadType(config) {
        var self = this;
        //���ø��๹�캯��
        UploadType.superclass.constructor.call(self, config);
    }

    S.mix(UploadType, /** @lends UploadType*/{
        /**
         * �¼��б�
         */
        event : {
            //��ʼ�ϴ��󴥷�
            START : 'start',
            //ֹͣ�ϴ��󴥷�
            STOP : 'stop',
            //�ɹ�����
            SUCCESS : 'success',
            //�ϴ�ʧ�ܺ󴥷�
            ERROR : 'error'
        }
    });

    /**
     * @name UploadType#start
     * @desc  ��ʼ�ϴ��󴥷�
     * @event
     */
    /**
     * @name UploadType#stop
     * @desc  ֹͣ�ϴ��󴥷�
     * @event
     */
    /**
     * @name UploadType#success
     * @desc  �ϴ��ɹ��󴥷�
     * @event
     */
    /**
     * @name UploadType#error
     * @desc  �ϴ�ʧ�ܺ󴥷�
     * @event
     */
    //�̳���Base������getter��setterί����Base����
    S.extend(UploadType, Base, /** @lends UploadType.prototype*/{
        /**
         * �ϴ��ļ�
         */
        upload : function() {

        },
        /** 
         * ֹͣ�ϴ�
         */
        stop : function(){
            
        },
        /**
         * ����������˷��صĽ����
         * @private
         */
        _processResponse:function(responseText){
            var self = this;
            var filter = self.get('filter');
            var result = {};
            if(filter != EMPTY) responseText = filter.call(self,responseText);
            //��ʽ����json����
            if(S.isString(responseText)){
                try{
                    result = S.JSON.parse(responseText);
                    result = self._fromUnicode(result);
                }catch(e){
                    var msg = responseText + '�����ؽ����responseText��ʽ���Ϸ���';
                    S.log(msg);
                    self.fire('error',{status:-1, result:{msg:msg}});
                }
            }else if(S.isObject(responseText)){
                result = self._fromUnicode(responseText);
            }
            S.log('�������������' + S.JSON.stringify(result));
            return result;
        },
        /**
         * ��unicode������ת����������ʾ�����֣���Ϊ���޸�flash�������������⣩
         * @private
         */
        _fromUnicode:function(data){
            if(!S.isObject(data)) return data;
            _each(data);
            function _each(data){
                S.each(data,function(v,k){
                    if(S.isObject(data[k])){
                        _each(data[k]);
                    }else{
                        data[k] = S.isString(v) && S.fromUnicode(v) || v;
                    }
                });
            }
            return data;
        }

    }, {ATTRS : /** @lends UploadType.prototype*/{
        /**
         * ��������·��
         * @type String
         * @default ""
         */
        action : {value : EMPTY},
        /**
         * ���͸��������˵Ĳ������ϣ��ᱻת��hiddenԪ��post���������ˣ�
         * @type Object
         * @default {}
         */
        data : {value : {}},
        /**
         * �������˷��ص����ݵĹ�����
         * @type Function
         * @default ''
         */
        filter:{
            value:EMPTY
        }
    }});

    return UploadType;
}, {requires:['node','base']});
