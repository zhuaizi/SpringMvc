/*
combined files : 

gallery/uploader/1.5/plugins/filedrop/filedrop

*/
/**
 * @fileoverview  �ļ���ק�ϴ����
 *  @author ����
 */
KISSY.add('gallery/uploader/1.5/plugins/filedrop/filedrop',function (S, Node, Base) {
    var EMPTY = '',
        $ = Node.all,
        UA = S.UA;
    /**
     * @name FileDrop
     * @class �ļ���ק�ϴ����
     * @constructor
     *  @author ����
     * @extends Base
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {Button} config.button *��Button��ť��ʵ��
     */
    var FileDrop = function (config) {
        var self = this;
        FileDrop.superclass.constructor.call(self, config);
        self.set('mode', getMode());
    };

    var getMode = function () {
        if (UA.webkit >= 7 || UA.firefox >= 3.6) {
            return 'supportDrop';
        }
        if (UA.ie) {
            return 'notSupportDropIe';
        }
        if (UA.webkit < 7 || UA.firefox < 3.6) {
            return 'notSupportDrop';
        }
    };

    S.mix(FileDrop, {
        event:{
            'AFTER_DROP':'afterdrop'
        }
    });

    S.extend(FileDrop, Base, /** @lends FileDrop.prototype*/ {
        /**
         * �����ʼ��
         */
        pluginInitializer:function (uploader) {
            var self = this;
            var mode = self.get('mode');
            var $dropArea;
            if(!uploader) return false;
            self.set('uploader',uploader);
            if(uploader.get('type') == 'flash'){
                S.log('flash�ϴ���ʽ��֧����ק��');
                self.set('isSupport',false);
                return false;
            }
            if(mode != 'supportDrop'){
                S.log('���������֧����ק�ϴ���');
                self.set('isSupport',false);
                return false;
            }
            var target = uploader.get('target');
            self.set('target',target);
            $dropArea = self._createDropArea();
            $dropArea.on('click',self._clickHandler,self);
            //��uploader�Ľ���״̬�����ı��������ק����
            uploader.on('afterDisabledChange',function(ev){
                self[ev.newVal && 'hide' || 'show']();
            });
            self.fire('render', {'buttonTarget':self.get('buttonWrap')});
        },
        /**
         * ��ʾ��ק����
         */
        show:function () {
            var self = this,
                dropContainer = self.get('dropContainer');
            dropContainer.show();
        },
        /**
         * ������ק����
         */
        hide:function () {
            var self = this,
                dropContainer = self.get('dropContainer');
            dropContainer.hide();
        },
        /**
         * ������ק����
         */
        _createDropArea:function () {
            var self = this,
                target = $(self.get('target')),
                mode = self.get('mode'),
                html = S.substitute(self.get('tpl')[mode], {name:self.get('name')}),
                dropContainer = $(html),
                buttonWrap = dropContainer.all('.J_ButtonWrap');
            dropContainer.appendTo(target);
            dropContainer.on('dragover', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
            });
            dropContainer.on('drop', function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                self._dropHandler(ev);
            });
            self.set('dropContainer', dropContainer);
            self.set('buttonWrap', buttonWrap);
            self._setStyle();
            return dropContainer;
        },
        /**
         * ������ק����ʽ
         * @author ��������
         */
        _setStyle:function(){
             var self = this,$dropContainer = self.get('dropContainer');
            if(!$dropContainer.length) return false;
            $dropContainer.parent().css('position','relative');
            $dropContainer.css({'position':'absolute','top':'0','left':'0',width:'100%',height:'100%','zIndex':'1000'});
        },
        /**
         * �����ק����󴥷�
         * @author ��������
         * @param ev
         */
        _clickHandler:function(ev){
            var self = this,
                uploader = self.get('uploader'),
                button = uploader.get('button'),
                $input = button.get('fileInput');
            //����input��ѡ���ļ�
            $input.fire('click');
        },
        /**
         * ������קʱ��
         */
        _dropHandler:function (ev) {
            var self = this,
                event = FileDrop.event,
                fileList = ev.originalEvent.dataTransfer.files,
                files = [],
                uploader = self.get('uploader');

            if (!fileList.length || uploader == EMPTY)  return false;
            S.each(fileList, function (f) {
                if (S.isObject(f)) {
                    files.push({'name':f.name, 'type':f.type, 'size':f.size,'data':f});
                }
            });
            self.fire(event.AFTER_DROP, {files:files});
            uploader._select({files:files});
        }
    }, {
        ATTRS:/** @lends FileDrop.prototype*/{
            /**
             * �������
             * @type String
             * @default 'filedrop'
             */
            pluginId:{
                value:'filedrop'
            },
            /**
             * ָ��ģ�ⰴť
             * @type NodeList
             * @default ''
             */
            target:{
                value:EMPTY,
                getter:function(v){
                    return $(v);
                }
            },
            uploader:{value:EMPTY},
            dropContainer:{
                value:EMPTY
            },
            /**
             * �Ƿ�֧����ק
             */
            isSupport:{value:true},
            /**
             * ģ��
             * @type Object
             * @default {}
             */
            tpl:{
                value:{
                    supportDrop:'<div class="drop-wrapper"></div>',
                    notSupportDropIe:'<div class="drop-wrapper">' +
                        '<p>���������ֻ֧�ִ�ͳ��ͼƬ�ϴ���</p>' +
                        '<p class="suggest J_ButtonWrap">�Ƽ�ʹ��chrome�������firefox�����' +
                        '</p>' +
                        '</div>',
                    notSupportDrop:'<div class="drop-wrapper">' +
                        '<p>���������ֻ֧�ִ�ͳ��ͼƬ�ϴ���</p>' +
                        '<p class="suggest J_ButtonWrap">�Ƽ��������������' +
                        '</p>' +
                        '</div>'
                }
            },
            name:{ value:'' }
        }
    });

    return FileDrop;
}, {requires:['node', 'base']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �ع���rich base�Ĳ��
 */

