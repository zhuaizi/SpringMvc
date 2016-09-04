/*
combined files : 

gallery/uploader/1.5/plugins/proBars/progressBar
gallery/uploader/1.5/plugins/proBars/proBars

*/
/**
 * @fileoverview ������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/proBars/progressBar',function(S, Node, Base) {
    var EMPTY = '',$ = Node.all,
        PROGRESS_BAR = 'progressbar',ROLE = 'role',
        ARIA_VALUEMIN = 'aria-valuemin',ARIA_VALUEMAX = 'aria-valuemax',ARIA_VALUENOW = 'aria-valuenow',
        DATA_VALUE = 'data-value';
    /**
     * @name ProgressBar
     * @class ������
     * @constructor
     * @extends Base
     * @requires Node
     */
    function ProgressBar(wrapper, config) {
        var self = this;
        config = S.merge({wrapper:$(wrapper)}, config);
        //���ø��๹�캯��
        ProgressBar.superclass.constructor.call(self, config);
    }
    S.mix(ProgressBar, /** @lends ProgressBar.prototype*/{
        /**
         * ģ��
         */
        tpl : {
            DEFAULT:'<div class="ks-progress-bar-value" data-value="{value}"></div>'
        },
        /**
         * ����õ�����ʽ
         */
        cls : {
            PROGRESS_BAR : 'ks-progress-bar',
            VALUE : 'ks-progress-bar-value'
        },
        /**
         * ���֧�ֵ��¼�
         */
        event : {
            RENDER : 'render',
            CHANGE : 'change',
            SHOW : 'show',
            HIDE : 'hide'
        }
    });
    //�̳���Base������getter��setterί����Base����
    S.extend(ProgressBar, Base, /** @lends ProgressBar.prototype*/{
        /**
         * ����
         */
        render : function() {
            var self = this,$wrapper = self.get('wrapper'),
                width = self.get('width');
            if(!$wrapper.length) return false;
            if(width == 'auto') width = $wrapper.parent().width();
            $wrapper.width(width);
            //���������ks-progress-bar��ʽ��
            $wrapper.addClass(ProgressBar.cls.PROGRESS_BAR);
            self._addAttr();
            !self.get('visible') && self.hide();
            self.set('bar',self._create());
            self.fire(ProgressBar.event.RENDER);
        },
        /**
         * ��ʾ������
         */
        show : function(){
            var self = this,$wrapper = self.get('wrapper');
            $wrapper.fadeIn(self.get('duration'),function(){
                self.set('visible',true);
                self.fire(ProgressBar.event.SHOW,{visible : true});
            });
        },
        /**
         * ���ؽ�����
         */
        hide : function(){
            var self = this,$wrapper = self.get('wrapper');
            $wrapper.fadeOut(self.get('duration'),function(){
                self.set('visible',false);
                self.fire(ProgressBar.event.HIDE,{visible : false});
            });
        },
        /**
         * ����������
         * @return {NodeList}
         */
        _create : function(){
            var self = this,
                $wrapper = self.get('wrapper'),
                value = self.get('value'),tpl = self.get('tpl'),
                html = S.substitute(tpl, {value : value}) ;
            $wrapper.html('');
            return $(html).appendTo($wrapper);

        },
        /**
         * ���������������һЩ����
         * @return {Object} ProgressBar��ʵ��
         */
        _addAttr : function() {
            var self = this,$wrapper = self.get('wrapper'),value = self.get('value');
            $wrapper.attr(ROLE, PROGRESS_BAR);
            $wrapper.attr(ARIA_VALUEMIN, 0);
            $wrapper.attr(ARIA_VALUEMAX, 100);
            $wrapper.attr(ARIA_VALUENOW, value);
            return self;
        }
    }, {ATTRS : /** @lends ProgressBar*/{
        /**
         * ����
         */
        wrapper : {value : EMPTY},
        /**
         * ������Ԫ��
         */
        bar : {value : EMPTY},
        /**
         * ���������
         */
        width : { value:'auto' },
        /**
         * ��ǰ����
         */
        value : {
            value : 0,
            setter : function(v) {
                var self = this,$wrapper = self.get('wrapper'),$bar = self.get('bar'),
                    speed = self.get('speed'),
                    width;
                if (v > 100) v = 100;
                if (v < 0) v = 0;
                //���ٷֱȿ�Ȼ��������ֵ
                width = Math.ceil($wrapper.width() * (v / 100));
                $bar.stop().animate({'width':width + 'px'},speed,'none',function(){
                    $wrapper.attr(ARIA_VALUENOW,v);
                    $bar.attr(DATA_VALUE,v);
                    self.fire(ProgressBar.event.CHANGE,{value : v,width : width});
                });
                return v;
            }
        },
        /**
         * ���ƽ������Ŀɼ���
         */
        visible : { value:true },
        /**
         * �����������ٶ�
         */
        duration : {
          value : 0.3
        },
        /**
         * ģ��
         */
        tpl : {
            value : ProgressBar.tpl.DEFAULT
        },
        speed : {value : 0.2}
    }});
    return ProgressBar;
}, {requires : ['node','base']});
/**
 * changes:
 * ���ӣ�1.5
 *           - animǰ����stop()����ֹ����bug
 */
/**
 * @fileoverview ����������
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/proBars/proBars',function(S, Node, Base,ProgressBar) {
    var EMPTY = '';
    var $ = Node.all;
    var PRE = 'J_ProgressBar_';
    /**
     * @name ProBars
     * @class ����������
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ProBars(config) {
        var self = this;
        //���ø��๹�캯��
        ProBars.superclass.constructor.call(self, config);
    }
    S.mix(ProBars, /** @lends ProBars.prototype*/{
        /**
         * ���֧�ֵ��¼�
         */
        event : {
            RENDER : 'render'
        }
    });
    S.extend(ProBars, Base, /** @lends ProBars.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            var self = this;
            uploader.on('start',function(ev){
                self.add(ev.file.id);
            });

            uploader.on('progress',self._uploaderProgressHandler,self);
            uploader.on('success',self._uploaderSuccessHandler,self);

            self.fire(ProBars.event.RENDER);
        },
        /**
         * �ϴ��иı��������ֵ
         * @param ev
         * @private
         */
        _uploaderProgressHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            //�Ѽ����ֽ���
            var loaded = ev.loaded;
            //���ֽ���
            var total = ev.total;
            var val = Math.ceil((loaded/total) * 100);
            var bar = self.get('bars')[id];
            //�������
            if(bar) bar.set('value',val);
        },
        /**
         * �ϴ��ɹ����ý��ȴﵽ100%
         * @param ev
         * @private
         */
        _uploaderSuccessHandler:function(ev){
            var self = this;
            var file = ev.file;
            var id = file.id;
            var bar = self.get('bars')[id];
            var isHide = self.get('isHide');
            //�������
            if(bar) bar.set('value',100);
            if(isHide){
                S.later(function(){
                    var $target = $('.'+PRE+ev.file.id);
                    $target.hide();
                },500);
            }
        },
        /**
         * �򼯺����һ��������
         * @return ProgressBar
         */
        add:function(fileId){
            if(!S.isString(fileId)) return false;
            var self = this;
            var $target = $('.'+PRE+fileId);
            var $count = $('.J_ProgressCount_'+fileId);
            var speed = self.get('speed');
            var progressBar = new ProgressBar($target,{width:self.get('width'),speed:speed});
            if($count.length){
                progressBar.on('change',function(ev){
                    $count.text(ev.value+'%');
                })
            }
            progressBar.render();
            var bars = self.get('bars');
            return bars[fileId] = progressBar;
        }
    }, {ATTRS : /** @lends ProBars*/{
        /**
         * �������
         * @type String
         * @default proBars
         */
        pluginId:{
            value:'proBars'
        },
        /**
        * ������ʵ������
        * @type Object
        * @default {}
        */
        bars:{value:{}},
        /**
         * ���������
         * @type Number
         * @default 'auto'
         */
        width : { value:'auto' },
        /**
         * �����ߵ�100%ʱ�Ƿ�����
         * @type Boolean
         * @default true
         */
        isHide : { value:true },
        /**
         * �������ܶ��ٶȿ���
         * @type Number
         * @default 0.2
         */
        speed : {value : 0.2}
    }});
    return ProBars;
}, {requires : ['node','base','./progressBar']});
/**
 * changes:
 * ���ӣ�1.4
 *           - ����ģ�飬���rich base�Ĳ������ʹ��
 *           - ����iframeʱ���ؽ�����
 */

