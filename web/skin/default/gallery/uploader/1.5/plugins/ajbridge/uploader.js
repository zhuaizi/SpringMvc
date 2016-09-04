/*
combined files : 

gallery/uploader/1.5/plugins/ajbridge/ajbridge
gallery/uploader/1.5/plugins/ajbridge/uploader

*/
/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * AJBridge Class
 * @author kingfo oicuicu@gmail.com
 */
KISSY.add('gallery/uploader/1.5/plugins/ajbridge/ajbridge',function(S,Flash) {

    var ID_PRE = '#',
        VERSION = '1.0.15',
		PREFIX = 'ks-ajb-',
		LAYOUT = 100,
        EVENT_HANDLER = 'KISSY.AJBridge.eventHandler'; // Flash �¼��׳�����ͨ��

    /**
     * @constructor
     * @param {String} id       ע��Ӧ������ id
     * @param {Object} config   ��������ͬ S.Flash �� config
     * @param {Boolean} manual  �ֶ����� init
     */
    function AJBridge(id, config,manual) {
        id = id.replace(ID_PRE, ''); // ��׳�Կ��ǡ����� KISSY ϰ�߲��� id ѡ����
        config = Flash._normalize(config||{}); // ��׼�������ؼ���

        var self = this,
            target = ID_PRE + id, // ֮����Ҫ��ʹ�� id������Ϊ��ʹ�� ajbridge ʱ������Ա�Լ�Ӧ����ȷ��֪���Լ�����ʲô
            callback = function(data) {
                if (data.status < 1) {
                    self.fire('failed', { data: data });
                    return;
                }
				
                S.mix(self, data);

                // ִ�м��� ��̬ģʽ�� flash
                // ����� AJBridge ���� DOMReady ǰִ�� ��ʧЧ
                // ������� S.ready();
                if (!data.dynamic || !config.src) {
						self.activate();
                }
            };
		
		// �Զ����� id	
		config.id = config.id || S.guid(PREFIX);

        // ע��Ӧ��ʵ��
        AJBridge.instances[config.id] = self;

        //	��̬��ʽ
        if (config.src) {
            // ǿ�ƴ� JS ������Ȩ��AJBridge �������Ҫ��
            config.params.allowscriptaccess = 'always';
            config.params.flashvars = S.merge(config.params.flashvars, {
                // ���� JS ���
                jsEntry: EVENT_HANDLER,
                // ��Ȼ Flash ͨ�� ExternalInterface ��� obejctId
                // ������Ȼ���ڼ���������, �����Ҫֱ�Ӹ���
                swfID: config.id
            });
        }

        // ֧�־�̬��ʽ������Ҫ���������������Ѿ�̬д��
        // ���Բο� test.html
		
        // ������ȫ�����¼����ƣ������Ҫͨ������֮����г�ʼ�� Flash
		
        if(manual)self.__args = [target, config, callback];
		else S.later(Flash.add,LAYOUT,false,Flash,[target, config, callback]);
    }

    /**
     * ��̬����
     */
    S.mix(AJBridge, {

        version: VERSION,

        instances: { },

        /**
         * �������� AJBridge �Ѷ�����¼�
         * @param {String} id            swf����������ID
         * @param {Object} event        swf�������¼�
         */
        eventHandler: function(id, event) {
            var instance = AJBridge.instances[id];
            if (instance) {
                instance.__eventHandler(id, event);
            }
        },

        /**
         * ����ע�� SWF �����ķ���
         * @param {Class} C
         * @param {String|Array} methods
         */
        augment: function (C, methods) {
            if (S.isString(methods)) {
                methods = [methods];
            }
            if (!S.isArray(methods)) return;
			
			

            S.each(methods, function(methodName) {
                C.prototype[methodName] = function() {
                    try {
                        return this.callSWF(methodName, S.makeArray(arguments));
                    } catch(e) { // �� swf �쳣ʱ����һ��������Ϣ
                        this.fire('error', { message: e });
                    }
                }
            });
        }
    });

    S.augment(AJBridge, S.EventTarget, {

        init: function() {
			if(!this.__args)return;
            Flash.add.apply(Flash, this.__args);
			this.__args = null;
			delete this.__args; // ��ֹ�ظ����
        },

        __eventHandler: function(id, event) {
            var self = this,
                type = event.type;
			
            event.id = id;   //	�ֲ����� id ʹ��
            switch(type){
				case "log":
					 S.log(event.message);
					break;
				default:
					self.fire(type, event);
			}
			
        },

        /**
         * Calls a specific function exposed by the SWF's ExternalInterface.
         * @param func {String} the name of the function to call
         * @param args {Array} the set of arguments to pass to the function.
         */
        callSWF: function (func, args) {
            var self = this;
            args = args || [];
            try {
                if (self.swf[func]) {
                    return self.swf[func].apply(self.swf, args);
                }
            }
            // some version flash function is odd in ie: property or method not supported by object
            catch(e) {
                var params = '';
                if (args.length !== 0) {
                    params = "'" + args.join("','") + "'";
                }
                //avoid eval for compressiong
                return (new Function('self', 'return self.swf.' + func + '(' + params + ');'))(self);
            }
        }
    });

    // Ϊ��̬������̬ע��
    // ע�⣬ֻ���� S.ready() ����� AJBridge ע�����Ч��
    AJBridge.augment(AJBridge, ['activate', 'getReady','getCoreVersion']);

    window.AJBridge = S.AJBridge = AJBridge;

    return AJBridge;
}, { requires:["gallery/flash/1.0/index"] });
/**
 * NOTES:
 * 20120117 ��ֲ��kissy1.2.0��ģ�飨�����޸ģ�
 */

/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * @author kingfo  oicuicu@gmail.com
 */
KISSY.add('gallery/uploader/1.5/plugins/ajbridge/uploader',function(S,flash,A) {

    /**
     * @constructor
     * @param {String} id                                    ��Ҫע���SWFӦ��ID
     * @param {Object} config                                ������
     * @param {String} config.ds                             default server ����д
     * @param {String} config.dsp                            default server parameters ����д
     * @param {Boolean} config.btn                           ���ð�ťģʽ��Ĭ�� false
     * @param {Boolean} config.hand                          ��ʾ���ͣ�Ĭ�� false
     */
    function Uploader(id, config) {
        config = config || { };
        var flashvars = { };
		
		
		
		S.each(['ds', 'dsp', 'btn', 'hand'], function(key) {
			if(key in config) flashvars[key] = config[key];
		});
		

        config.params = config.params || { };
        config.params.flashvars = S.merge(config.params.flashvars, flashvars);

		Uploader.superclass.constructor.call(this, id, config);
    }

    S.extend(Uploader, A);

    A.augment(Uploader,
        [
            'setFileFilters',
            'filter',
            'setAllowMultipleFiles',
            'multifile',
            'browse',
            'upload',
            'uploadAll',
            'cancel',
            'getFile',
            'removeFile',
            'lock',
            'unlock',
            'setBtnMode',
            'useHand',
            'clear'
        ]
        );

    Uploader.version = '1.0.1';
    A.Uploader = Uploader;
    return A.Uploader;
},{ requires:["gallery/flash/1.0/index","./ajbridge"] });
/**
 * changes:
 * ���ӣ�1.4
 *           - flashģ��ĳ�gallery/flash/1.0/��flashģ��1.3���ٴ���
 */


