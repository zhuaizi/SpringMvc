KISSY.add(KISSY.myPackageName+'/util/dateTime/base',function (S, Node, Event, undefined) {
    var EventTarget = Event.Target,
        DOM= S.DOM,
        UA = S.UA,
        $ = Node.all;

    function Calendar(config) {
        this._init(config);
    }

    S.augment(Calendar, EventTarget, {

        /**
         * �������캯��
         * @method     _init
         * @param { string }    selector
         * @param { string }    config
         * @private
         */
        _init: function (config) {
            /*
             self.con  ����������
             self.id   ��������id
             self.C_Id ��Զ��������������ID
             */
            var self = this;
            self._buildParam(config);
            if(self.showTime){
            	self.defaultFormat = "yyyy-mm-dd HH:MM:ss";
            } else {
            	self.defaultFormat = "yyyy-mm-dd";
            }
            var trigger = $(self.trigger);
            self.id = self._stamp( $(self.input));
            if (!self.popup) {
                self.con = trigger;
            } else {
            	self.input = $(self.input);
            	if(self.input){
//            		self.input.attr("readonly","readonly");
            	}
                self.trigger = trigger;
                self.con = new Node('<div>');
                $(document.body).append(self.con);

                self.con.css({
                    'top': '0px',
                    'position': 'absolute',
                    'background': 'white',
                    'visibility': 'hidden',
                    'z-index': 99999999
                });
            }
            self.C_Id = self._stamp(self.con);
            self.render();
            self._buildEvent();
            return this;
        },

        /**
         * ����������Ⱦ,���ӶԶ������������Ĵ���
         * @param { object }    o
         */
        render: function (o) {
            var self = this,
                i = 0,
                _prev, _next, _oym;

            o = o || {};
            self._parseParam(o);

            self.con.addClass('ks-cal-call ks-clearfix ks-cal-call-multi-' + self.pages);

            self.ca = self.ca || [];
            for (var i = 0; i < self.ca.length; i++) {
                self.ca[i].detachEvent();
            }
            if (self.__shimEl) {
                self.__shimEl.remove();
                delete self.__shimEl;
            }
            self.con.empty();

            //���������ĸ���
            self.ca.length = self.pages;
            var _rangeStart = false;
            var _rangeEnd = false;
            if (self.range) {
                if (self.range.start) {
                    _rangeStart = true;
                }
                if (self.range.end) {
                    _rangeEnd = true;
                }
            }
            if (_rangeStart && !self.rangeLinkage) {

                _oym = [self.range.start.getFullYear(), self.range.start.getMonth()];
            }
            else {
                _oym = [self.year, self.month, self.day];
            }

            for (i = 0; i < self.pages; i++) {
                if (i === 0) {
                    if (_rangeStart) {
                        self._time = S.clone(self.range.start);
                    }
                    _prev = true;
                } else if (!self.rangeLinkage) {
                    if (_rangeEnd) {
                        self._time = S.clone(self.range.end);
                    }
                    _prev = true;
                    if (_rangeEnd && (i + 1) == self.pages) {
                        _oym = [self.range.end.getFullYear(), self.range.end.getMonth()];
                    }
                    else {
                        _oym = self._computeNextMonth(_oym);
                    }
                }
                else {
                    if (_rangeEnd) {
                        self._time = S.clone(self.range.end);
                    }
                    _prev = false;
                    _oym = self._computeNextMonth(_oym);
                }
                if (!self.rangeLinkage) {
                    _next = true;
                }
                else {
                    _next = i == (self.pages - 1);
                }

                var cal = self.ca[i];
                if (!self.rangeLinkage && cal && (cal.year != _oym[0] || cal.month != _oym[1])) {
                    _oym = [cal.year, cal.month];
                }

                self.ca[i] = new self.Page({
                    year: _oym[0],
                    month: _oym[1],
                    day:_oym[2],
                    prevArrow: _prev,
                    nextArrow: _next,
                    showTime: self.showTime
                }, self);
                self.ca[i].render();
            }
            if (self.popup && UA['ie'] === 6) {
                self.__shimEl = new Node("<" + "iframe frameBorder='0' style='position: absolute;" +
                    "border: none;" +
                    "width: expression(this.parentNode.offsetWidth-3);" +
                    "top: 0;" +
                    //"filter: alpha(opacity=0);" +
                    "left: 0;" +
                    "z-index: 0;" +
                    "height: expression(this.parentNode.offsetHeight-3);" + "'></iframe>");
                self.con.prepend(self.__shimEl);
            }
            
            return this;

        },
        destroy: function () {
            //�����htmlǰ���Ƴ��󶨵��¼�
            var self = this;
            for (var i = 0; i < self.ca.length; i++) {
                self.ca[i].detachEvent();
            }

            S.each(self.EV, function (tev) {
                if (tev) {
                    tev.target.detach(tev.type, tev.fn);
                }
            });
            self.con.remove();
        },
        /**
         * ���Ը���������id�ı��,������id�򷵻�
         * @method _stamp
         * @param el
         * @return {string}
         * @private
         */
        _stamp: function (el) {
            if (!el.attr('id')) {
                el.attr('id', S.guid('K_Calendar'));
            }
            return el.attr('id');
        },


        /**
         * �������������¼�
         * @method _buildEvent
         * @private
         */
        _buildEvent: function () {
            var self = this, tev, i;
            if (!self.popup) {
                return this;
            }
            //����հ�
            //flush event
            S.each(self.EV, function (tev) {
                if (tev) {
                    tev.target.detach(tev.type, tev.fn);
                }
            });
            self.EV = self.EV || [];
            tev = self.EV[0] = {
                target: $(document),
                type: 'click'
            };
            tev.fn = function (e) {
                var target = $(e.target);
                //�����������
                if (target.attr('id') === self.C_Id) {
                    return;
                }
                if ((target.hasClass('ks-next') || target.hasClass('ks-prev')) &&
                    target[0].tagName === 'A') {
                    return;
                }
                //�����trigger��
                if (target.attr('id') == self.id) {
                    return;
                }

                if (self.con.css('visibility') == 'hidden') {
                    return;
                }

                // bugfix by jayli - popup״̬�£����ѡ���·ݵ�optionʱ������ر�
                if (self.con.contains(target) &&
                    (target[0].nodeName.toLowerCase() === 'option' ||
                        target[0].nodeName.toLowerCase() === 'select')) {
                    return;
                }

                var inRegion = function (dot, r) {
                    return dot[0] > r[0].x
                        && dot[0] < r[1].x
                        && dot[1] > r[0].y
                        && dot[1] < r[1].y;
                };
                if (!inRegion([e.pageX, e.pageY], [
                    {
                        x: self.con.offset().left,
                        y: self.con.offset().top
                    },
                    {
                        x: self.con.offset().left + self.con.width(),
                        y: self.con.offset().top + self.con.height()
                    }
                ])) {
                    self.hide();
                }
            };
            tev.target.on(tev.type, tev.fn);
            //�������
            for (i = 0; i < self.triggerType.length; i++) {
                tev = self.EV[i + 1] = {
                    target: $('#' + self.id),
                    type: self.triggerType[i],
                    fn: function (e) {
                        e.target = $(e.target);
                        e.preventDefault();
                        //���focus��clickͬʱ���ڵ�hack

                        var a = self.triggerType;
                        if (S.inArray('click', a) && S.inArray('focus', a)) {//ͬʱ����
                            if (e.type == 'focus') {
                                self.toggle();
                            }
                        } else if (S.inArray('click', a) && !S.inArray('focus', a)) {//ֻ��click
                            if (e.type == 'click') {
                                self.toggle();
                            }
                        } else if (!S.inArray('click', a) && S.inArray('focus', a)) {//ֻ��focus
                            setTimeout(function () {//Ϊ������document.onclick�¼�
                                self.toggle();
                            }, 170);
                        } else {
                            self.toggle();
                        }

                    }
                };
                tev.target.on(tev.type, tev.fn);
            }
            return this;
        },

        //�������
        __getAlignOffset: function (node, align) {
            var V = align.charAt(0),
                H = align.charAt(1),
                offset, w, h, x, y;

            if (node) {
                node = Node.one(node);
                offset = node.offset();
                w = node.outerWidth();
                h = node.outerHeight();
            } else {
                offset = { left: DOM.scrollLeft(), top: DOM.scrollTop() };
                w = DOM.viewportWidth();
                h = DOM.viewportHeight();
            }

            x = offset.left;
            y = offset.top;

            if (V === 'c') {
                y += h / 2;
            } else if (V === 'b') {
                y += h;
            }

            if (H === 'c') {
                x += w / 2;
            } else if (H === 'r') {
                x += w;
            }

            return { left: x, top: y };

        },
        /**
         * �ı������Ƿ���ʾ��״̬
         * @mathod toggle
         */
        toggle: function () {
            var self = this;
            if (self.con.css('visibility') == 'hidden') {
                self.show();
            } else {
                self.hide();
            }
        },

        /**
         * ��ʾ����
         * @method show
         */
        show: function () {
            var self = this;
            self.con.css('visibility', '');
            self.date = new Date();
            self._handleDate();
            
            if(self.selected){
            	self.render({selected:self.selected});
            }
            
            if(self.ca[0].timmer){
            	self.ca[0].timmer.setTime();
            }
            var points = self.align.points,
                offset = self.align.offset || [0, 0],
                xy = self.con.offset(),
                p1 = self.__getAlignOffset(self.input, points[0]),
                p2 = self.__getAlignOffset(self.con, points[1]),
                diff = [p2.left - p1.left, p2.top - p1.top],
                _x = xy.left - diff[0] + offset[0],
                _y = xy.top - diff[1] + offset[1];

            self.con.css('left', _x.toString() + 'px');
            self.con.css('top', _y.toString() + 'px');
            self.fire("show");
            return this;
        },

        /**
         *��������Ƿ�Ϸ� 
         **/
        checkBeforeAndAfter : function(dateTime){
        	var self = this;
        	if(dateTime){
        		if(self.beforeInput && S.one(self.beforeInput).val()){
        			var beforeDate =  S.one(self.beforeInput).val();
        			var beforeDateTime = S.Calendar.Date.parse(beforeDate,self.defaultFormat);
            		if(!beforeDateTime){
    		 			alert('���ڸ�ʽ��ƥ��');
    		 			return false;
    		 		}
        			if(beforeDateTime > dateTime){
        				alert('ѡ�����ڱ������'+beforeDate);
        				return false;
        			}
            	} else if (self.afterInput && S.one(self.afterInput).val()){
            		var afterDate =  S.one(self.afterInput).val();
        			var afterDateTime = S.Calendar.Date.parse(afterDate,self.defaultFormat);
            		if(!afterDateTime){
    		 			alert('���ڸ�ʽ��ƥ��');
    		 			return false;
    		 		}
        			if(dateTime > afterDateTime){
        				alert('ѡ�����ڱ���С��'+afterDate);
        				return false;
        			}
            	}
        		return true;
        	} else {
        		return true;
        	}
        },
        
        /**
         * ��������
         * @method hide
         */
        hide: function () {
            var self = this;
            self.con.css('visibility', 'hidden');
            self.fire("hide");
            return this;
        },

        /**
         * ���������б�
         * @method _buildParam
         * @private
         */
        _buildParam: function (o) {
            var self = this;
            if (o === undefined || o === null) {
                o = { };
            }

            function setParam(def, key) {
                var v = o[key];
                // null�������ǡ�ռλ�������������������һ������
                self[key] = (v === undefined || v === null) ? def : v;
            }

            //���ִ���ʽ����
            S.each({
            	trigger : '',
            	input : '',
            	defaultFormat : '',
            	afterInput : '',
            	beforeInput : '',
                date: new Date(), //�����������·�, Ĭ��Ϊ����
                selected: null, //��ǰѡ�е�����
                startDay: 0, //������ʾ����xΪ��ʼ����, ȡֵ��ΧΪ0��6, Ĭ��Ϊ0,�������տ�ʼ,��ȡֵΪ1, �������һ��ʼ, ��ȡֵΪ7, ������տ�ʼ
                pages: 1, //������ҳ��, Ĭ��Ϊ1, ����һҳ����
                closable: true, //�ڵ��������, ��ѡ���ں��Ƿ�ر�����, Ĭ��Ϊfalse
                rangeSelect: false, //�Ƿ�֧��ʱ���ѡ��ֻ�п���ʱ��Żᴥ��rangeSelect�¼�
                minDate: false, //������ѡ�����С����
                maxDate: false, //������ѡ����������
                multiSelect: false, //�Ƿ�֧�ֶ�ѡ
                multi: null, //��ѡ����������
                navigator: true, //�Ƿ����ͨ�����������������,Ĭ�Ͽ���
                popup: true, //�����Ƿ�Ϊ����,Ĭ��Ϊtrue
                showTime: false, //�Ƿ���ʾʱ���ѡ��,Ĭ��Ϊfalse
                triggerType: ['click'], //����״̬��, ���������������¼�, ���磺[��click��,��focus��],Ҳ����ֱ�Ӵ��롯focus��, Ĭ��Ϊ[��click��]
                disabled: null, //��ֹ�������������[new Date(),new Date(2011,11,26)]
                range: null, //��ѡ���ʱ���{start:null,end:null}
                rangeLinkage: true, //��������Ƿ�����
                align: {
                    points: ['bl', 'tl'],
                    offset: [0, 0]
                }, //���뷽ʽ
                notLimited: false// �Ƿ���ֲ��޵İ�ť
            }, setParam);


            return this;
        },

        /**
         * ���˲����б�
         * @method _parseParam
         * @private
         */
        _parseParam: function (o) {
            var self = this, i;
            if (o === undefined || o === null) {
                o = {};
            }
            for (i in o) {
                self[i] = o[i];
            }

            // ֧���û�������һ��string
            if (typeof self.triggerType === 'string') {
                self.triggerType = [self.triggerType];
            }

            self.startDay = self.startDay % 7;
            if (self.startDay < 0) {
                self.startDay += 7;
            }

            self.EV = [];
            self._handleDate();


            //��multiSelect�Ĵ���
            if (self.multiSelect) {
                self.rangeSelect = false;
                self.range = null;
                self.selected = null;
                if (self.multi) {
                    //����������������ʽ�����ַ�������,�����ڲ�����
                    for (var i = 0; i < self.multi.length; i++) {
                        if (self.multi[i] instanceof Date) {
                            self.multi[i] = self._handleDate2String(self.multi[i]);
                        }
                    }
                }
            }
            return this;
        },

        /**
         * ģ�庯��
         * @method _templetShow
         * @private
         */
        _templetShow: function (templet, data) {
            var str_in, value_s, i, m, value, par;
            if (data instanceof Array) {
                str_in = '';
                for (i = 0; i < data.length; i++) {
                    str_in += arguments.callee(templet, data[i]);
                }
                templet = str_in;
            } else {
                value_s = templet.match(/{\$(.*?)}/g);
                if (data !== undefined && value_s !== null) {
                    for (i = 0, m = value_s.length; i < m; i++) {
                        par = value_s[i].replace(/({\$)|}/g, '');
                        value = (data[par] !== undefined) ? data[par] : '';
                        templet = templet.replace(value_s[i], value);
                    }
                }
            }
            return templet;
        },

        /**
         * ��������
         * @method _handleDate
         * @private
         */
        _handleDate: function () {
            var self = this,
                date = self.date;
            self.weekday = date.getDay() + 1;//���ڼ� //ָ�����������ڼ�
            self.day = date.getDate();//����
            self.month = date.getMonth();//�·�
            self.year = date.getFullYear();//���
//            self.hours = date.getHours();//Сʱ
//            self.minutes = date.getMinutes();//����
//            self.seconds = date.getSeconds();//��
            return this;
        },
        /**
         * ��������TO�ַ���
         * @method _handleDate2String
         * @private
         */
        _handleDate2String: function (d) {
            var year = d.getFullYear();
            var month = d.getMonth();
            var date = d.getDate();
            return year + '-' + (month > 8 ? (month + 1) : '0' + (month + 1)) + '-' + (date > 9 ? date : '0' + date);
        },
        /**
         * �����ַ���TO����
         * @method _handleString2Date
         * @private
         */
        _handleString2Date: function (str) {
            var arr = str.toString().split('-');
            if (arr.length == 3) {
                var date = new Date(parseInt(arr[0], 10), (parseInt(arr[1], 10) - 1), parseInt(arr[2], 10));
                if (date instanceof Date && (date != "Invalid Date") && !isNaN(date)) {
                    return date;
                }
            }
        },

        //get����
        _getHeadStr: function (year, month) {
            return year.toString() + '��' + (Number(month) + 1).toString() + '��';
        },

        //�¼�
        _monthAdd: function () {
            var self = this;
            if (self.month == 11) {
                self.year++;
                self.month = 0;
            } else {
                self.month++;
            }
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/1');
            return this;
        },

        //�¼�
        _monthMinus: function () {
            var self = this;
            if (self.month === 0) {
                self.year--;
                self.month = 11;
            } else {
                self.month--;
            }
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/1');
            return this;
        },
        //���
        _yearAdd: function () {
            var self = this;
            self.year++;
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/1');
            return this;
        },

        //���
        _yearMinus: function () {
            var self = this;
            self.year--;
            self.date = new Date(self.year.toString() + '/' + (self.month + 1).toString() + '/1');
            return this;
        },

        //������һ���µ�����,[2009,11],��:fullYear����:��0��ʼ����
        _computeNextMonth: function (a) {
            var _year = a[0],
                _month = a[1];
            if (_month == 11) {
                _year++;
                _month = 0;
            } else {
                _month++;
            }
            return [_year, _month];
        },

        //�������ڵ�ƫ����
        _handleOffset: function () {
            var self = this,
                data = ['��', 'һ', '��', '��', '��', '��', '��'],
                temp = '<span>{$day}</span>',
                offset = self.startDay,
                day_html = '',
                a = [];
            for (var i = 0; i < 7; i++) {
                a[i] = {
                    day: data[(i + offset) % 7]
                };
            }
            day_html = self._templetShow(temp, a);

            return {
                day_html: day_html
            };
        },

        //������ʼ����,d:Date����
        _handleRange: function (d) {
            var self = this, t;
            self.range = self.range || {start: null, end: null};
            if ((self.range.start === null && self.range.end === null ) || (self.range.start !== null && self.range.end !== null)) {
                self.range.start = d;
                self.range.end = null;
            } else if (self.range.start !== null && self.range.end === null) {
                self.range.end = d;
                if (self.range.start.getTime() > self.range.end.getTime()) {
                    t = self.range.start;
                    self.range.start = self.range.end;
                    self.range.end = t;
                }
                self.fire('rangeSelect', self.range);
                if (self.popup && self.closable) {
                    self.hide();
                }
            }
            return this;
        },
        //��ʼ��ѡ
        _handleMultiSelectStart: function (d) {
            var self = this;
            self.multiStart = d;

        },
        _handleMultiSelectEnd: function (d) {

            var self = this;
            if (!self.multiStart) {
                return;
            }
            self.multi = self.multi || [];
            if (d < self.multiStart) {
                self.multiEnd = self.multiStart;
                self.multiStart = d;
            }
            else {
                self.multiEnd = d;
            }

            //��min��max�Ĵ���
            if (self.minDate && self.multiStart < self.minDate) {
                self.multiStart = new Date(self.minDate.getFullYear(), self.minDate.getMonth(), self.minDate.getDate());//������Ҫ���´�������
            }
            if (self.maxDate && self.multiEnd > self.maxDate) {
                self.multiEnd = new Date(self.maxDate.getFullYear(), self.maxDate.getMonth(), self.maxDate.getDate());
            }

            while (self.multiStart <= self.multiEnd) {

                var isDisabled = false;
                //��Ҫ����disabled
                if (self.disabled && self.disabled.length > 0) {
                    for (var i = 0; i < self.disabled.length; i++) {
                        var disabled = self.disabled[i];
                        if (disabled.getTime() == self.multiStart.getTime()) {
                            isDisabled = true;
                            break;
                        }
                    }
                }
                if (isDisabled) {
                    continue;
                }
                var str = self._handleDate2String(self.multiStart);
                if (!S.inArray(str, self.multi)) {
                    self.multi.push(str);
                }
                else {
                    self.multi.splice(S.indexOf(str, self.multi), 1);
                }
                self.multiStart.setDate(self.multiStart.getDate() + 1);
            }
            self.multiStart = null;
            self.render();
        },
        _handleMultiSelect: function () {
            var self = this;
            //�����multi��������ʹ�������ڸ�ʽ
            self.multi = self.multi || [];
            self.multi.sort(function (a, b) {
                if (a > b) {
                    return 1;
                }
                return -1;
            });
            for (var i = 0; i < self.multi.length; i++) {
                self.multi[i] = self._handleString2Date(self.multi[i])
            }

            self.fire('multiSelect', {multi: self.multi});
            if (self.popup && self.closable) {
                self.hide();
            }

        }
    });

    return Calendar;
}, { requires: ['node', "event"] });

/**
 *
 * 2011-12-27 by keyapril@gmail.com
 1.�������ò�����
 disabled:null, //��ֹ�������������[new Date(),new Date(2011,11,26)]
 range:    null,//��ѡ���ʱ���{start:null,end:null}
 align:{
 points:['bl','tl'],
 offset:[0,0]
 },//���䷽ʽ
 notLimited:    false,// �Ƿ���ֲ��޵İ�ť
 rangLinkage //��������Ƿ�����
 2.�����ӹ���
 -������"��"��ǰ������
 -�����˲��ް�ť���ڵ��֮�󴥷���select���¼�������Ϊnull,
 -Date.parse����������"2011-12-27"�ַ����Ĵ���
 3.bug�޸�
 -�޸���С����������ƺ�31��ʼ�տɵ����BUG
 4.��ʽ�ĵ���
 -�����ˡ�����
 *
 * 2011-12-06 by yiminghe@gmail.com
 *  - ȫ�ְ󶨷� document
 *  - fix ����¼�����
 *
 * 2010-09-09 by lijing00333@163.com - �γ�
 *     - ������YUI2/3��Calendar��Ϊ����KISSY
 *     - ������ʼ���ڣ�����x�����Զ���
 *      - ���������bugfix
 *
 * TODO:
 *   - �������ڵ������ʽ�Ķ���
 *   - ��ѡ���ڵĳ����Ľ������
 */
/**
 * @     ����
 * @author  �γ�<lijing00333@163.com>
 */
KISSY.add(KISSY.myPackageName+'/util/dateTime/page',function (S, Node, Calendar) {

    S.augment(Calendar, {

        Page:function (config, father) {
            /**
             * ������������
             * @constructor S.Calendar.Page
             * @param {Object} config ,�����б���Ҫָ�����������������
             * @param {Object} father,ָ��Y.Calendarʵ����ָ�룬��Ҫ������Ĳ���
             * @return ��������ʵ��
             */

                //����
            this.father = father;
            this.month = Number(config.month);
            this.year = Number(config.year);
            this.day = Number(config.day);
            this.prevArrow = config.prevArrow;
            this.nextArrow = config.nextArrow;
            this.node = null;
            this.timmer = null;//ʱ��ѡ���ʵ��
            this.id = '';
            this.html = [
                '<div class="ks-cal-box" id="{$id}">',
                '<div class="ks-cal-hd">',
                '<a href="javascript:void(0);" class="ks-prev-year {$prev}"></a>',
                '<a href="javascript:void(0);" class="ks-prev-month {$prev}"></a>',
                '<a href="javascript:void(0);" class="ks-title">{$title}</a>',
                '<a href="javascript:void(0);" class="ks-next-month {$next}"></a>',
                '<a href="javascript:void(0);" class="ks-next-year {$next}"></a>',
                '</div>',
                '<div class="ks-cal-bd">',
                '<div class="ks-whd">',
                father._handleOffset().day_html,
                '</div>',
                '<div class="ks-dbd ks-clearfix">',
                '{$ds}',
                '<div style="clear:both;"></div>',
                '</div>',
                '</div>',
                '<div class="ks-setime hidden">',
                '</div>',
                '<div class="ks-cal-ft {$showtime}">',
                '<div class="ks-cal-time">',
                'ʱ�䣺00:00 &hearts;',
                '</div>',
                '</div>',
                '<div class="ks-selectime hidden">',
                '</div>',
                '<div class="ks-cal-footer">',
                '<a href="javascript:void(0);" class="ks-cal-footer-select-btn {$showtime}">ȷ��</a>',
                '<a href="javascript:void(0);" class="ks-cal-footer-clear-btn">���</a>',
                '</div>',
                '</div>'
            ].join("");
            this.nav_html = [
                '<p>',
                '��',
                '<select' +
                    ' value="{$the_month}">',
                '<option class="m1" value="1">01</option>',
                '<option class="m2" value="2">02</option>',
                '<option class="m3" value="3">03</option>',
                '<option class="m4" value="4">04</option>',
                '<option class="m5" value="5">05</option>',
                '<option class="m6" value="6">06</option>',
                '<option class="m7" value="7">07</option>',
                '<option class="m8" value="8">08</option>',
                '<option class="m9" value="9">09</option>',
                '<option class="m10" value="10">10</option>',
                '<option class="m11" value="11">11</option>',
                '<option class="m12" value="12">12</option>',
                '</select>',
                '</p>',
                '<p>',
                '��',
                '<input type="text" value="{$the_year}" onfocus="this.select()"/>',
                '</p>',
                '<p>',
                '<button class="ok">ȷ��</button><button class="cancel">ȡ��</button>',
                '</p>'
            ].join("");


            //����
            //���õ����ݸ�ʽ����֤
            this.Verify = function () {

                var isDay = function (n) {
                    if (!/^\d+$/i.test(n)) {
                        return false;
                    }
                    n = Number(n);
                    return !(n < 1 || n > 31);

                },
                    isYear = function (n) {
                        if (!/^\d+$/i.test(n)) {
                            return false;
                        }
                        n = Number(n);
                        return !(n < 100 || n > 10000);

                    },
                    isMonth = function (n) {
                        if (!/^\d+$/i.test(n)) {
                            return false;
                        }
                        n = Number(n);
                        return !(n < 1 || n > 12);


                    };

                return {
                    isDay:isDay,
                    isYear:isYear,
                    isMonth:isMonth

                };


            };

            /**
             * ��Ⱦ��������UI
             */
            this._renderUI = function () {
                var cc = this, _o = {}, ft;
                cc.HTML = '';
                _o.prev = '';
                _o.next = '';
                _o.title = '';
                _o.ds = '';
                _o.notlimited = '';
                _o.notlimitedClass = '';
                if (!cc.prevArrow) {
                    _o.prev = 'hidden';
                }
                if (!cc.nextArrow) {
                    _o.next = 'hidden';
                }
                if (!cc.father.showTime) {
                    _o.showtime = 'hidden';
                }
                if (!cc.father.notLimited) {
                    _o.notlimited = 'hidden';
                }
                if (!cc.father.multiSelect) {
                    _o.multiSelect = 'hidden';
                }
                if (cc.father.showTime && cc.father.notLimited) {
                    _o.notlimitedCls = 'ks-cal-notLimited-showTime';
                }
                if (cc.father.notLimited && !cc.father.selected) {
                    _o.notlimitedCls += ' ks-cal-notLimited-selected';
                }
                _o.id = cc.id = 'ks-cal-' + Math.random().toString().replace(/.\./i, '');
                _o.title = cc.father._getHeadStr(cc.year, cc.month);
                cc.createDS();
                _o.ds = cc.ds;
                cc.father.con.append(cc.father._templetShow(cc.html, _o));
                cc.node = Node.one('#' + cc.id);
                if (cc.father.showTime) {
                    ft = cc.node.one('.ks-cal-ft');
                    cc.timmer = new cc.father.TimeSelector(ft, cc.father);
                }
                return this;
            };

            this.detachEvent = function () {
                var cc = this;
                cc.EV = cc.EV || [];
                //flush event
                S.each(cc.EV, function (tev) {
                    if (tev) {
                        tev.target.detach(tev.type, tev.fn);
                    }
                });
            };

            /**
             * �������������¼�
             */
            this._buildEvent = function () {
                var cc = this, i,
                    tev,
                    con = Node.one('#' + cc.id);

                function bindEventTev() {
                    tev.target.on(tev.type, tev.fn);
                }

                cc.EV = [];
                if (!cc.father.multiSelect) {
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('div.ks-dbd'),
                        type:"click",
                        fn:function (e) {
                            e.preventDefault();
                            if (e.target.tagName != 'A') {
                                //������ǵ����A��ǩ�ϣ�ֱ��return;
                                return;
                            }
                            e.target = Node(e.target);

                            if (e.target.hasClass('ks-null')) {
                                return;
                            }
                            if (e.target.hasClass('ks-disabled')) {
                                return;
                            }
                            var d = new Date(cc.year, cc.month, Number(e.target.html()));
                            cc.father.dt_date = d;
                            if (!cc.father.showTime){
                            	if(!cc.father.checkBeforeAndAfter(d)){
                            		return;
                            	}
                            	cc.father.fire('select', {
                                    date:d
                                });
                            }
                            if (cc.father.popup && cc.father.closable && !cc.father.showTime && !cc.father.rangeSelect) {
                                cc.father.hide();
                            }
                            if (cc.father.rangeSelect) {
                                //�������time������ʾ������ʱ��
                                if(cc.timmer){
                                    d.setHours(cc.timmer.get('h'));
                                    d.setMinutes(cc.timmer.get('m'));
                                    d.setSeconds(0);
                                }
                                cc.father._handleRange(d);
                            }
                            cc.father.render({selected:d});
                            if (!cc.father.showTime){
                            	var str_time = Calendar.Date.format(d,cc.father.defaultFormat);
                                if(cc.father.input){
                                	cc.father.input.val(str_time);
                                	cc.father.input.fire('blur');
                                }
                            }
                        }
                    };
                    bindEventTev();
                }

                //��ǰһ��
                tev = cc.EV[cc.EV.length] = {
                    target:con.one('a.ks-prev-month'),
                    type:'click',
                    fn:function (e) {
                        e.preventDefault();
                        if (!cc.father.rangeLinkage) {
                            cc._monthMinus();
                        }
                        cc.father._monthMinus().render();
                        cc.father.fire('monthChange', {
                            date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                        });
                    }
                };
                bindEventTev();
                //���һ��
                tev = cc.EV[cc.EV.length] = {
                    target:con.one('a.ks-next-month'),
                    type:'click',
                    fn:function (e) {
                        e.preventDefault();
                        if (!cc.father.rangeLinkage) {
                            cc._monthAdd();
                        }
                        cc.father._monthAdd().render();
                        cc.father.fire('monthChange', {
                            date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                        });
                    }
                };
                bindEventTev();
                //��ǰһ��
                tev = cc.EV[cc.EV.length] = {
                    target:con.one('a.ks-prev-year'),
                    type:'click',
                    fn:function (e) {
                        e.preventDefault();
                        if (!cc.father.rangeLinkage) {
                            cc._yearMinus();
                        }
                        cc.father._yearMinus().render();
                        cc.father.fire('monthChange', {
                            date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                        });
                    }
                };
                bindEventTev();
                //���һ��
                tev = cc.EV[cc.EV.length] = {
                    target:con.one('a.ks-next-year'),
                    type:'click',
                    fn:function (e) {
                        e.preventDefault();
                        if (!cc.father.rangeLinkage) {
                            cc._yearAdd();
                        }
                        cc.father._yearAdd().render();
                        cc.father.fire('monthChange', {
                            date:new Date(cc.father.year + '/' + (cc.father.month + 1) + '/01')
                        });
                    }
                };
                bindEventTev();
                if (cc.father.navigator) {
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('a.ks-title'),
                        type:'click',
                        fn:function (e) {
                            try {
                                e.preventDefault();
                            } catch (exp) {
                            }
                            e.target = Node(e.target);
                            var setime_node = con.one('.ks-setime');
                            setime_node.html('');
                            var in_str = cc.father._templetShow(cc.nav_html, {
                                the_month:cc.month + 1,
                                the_year:cc.year
                            });
                            setime_node.html(in_str);
                            setime_node.removeClass('hidden');
                            con.one('input').on('keydown', function (e) {
                                e.target = Node(e.target);
                                if (e.keyCode == 38) {//up
                                    e.target.val(Number(e.target.val()) + 1);
                                    e.target[0].select();
                                }
                                if (e.keyCode == 40) {//down
                                    e.target.val(Number(e.target.val()) - 1);
                                    e.target[0].select();
                                }
                                if (e.keyCode == 13) {//enter
                                    var _month = con.one('.ks-setime').one('select').val();
                                    var _year = con.one('.ks-setime').one('input').val();
                                    con.one('.ks-setime').addClass('hidden');
                                    if (!cc.Verify().isYear(_year)) {
                                        return;
                                    }
                                    if (!cc.Verify().isMonth(_month)) {
                                        return;
                                    }
                                    cc.father.render({
                                        date:new Date(_year + '/' + _month + '/01')
                                    });
                                    cc.father.fire('monthChange', {
                                        date:new Date(_year + '/' + _month + '/01')
                                    });
                                }
                            });
                        }
                    };
                    bindEventTev();
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('.ks-setime'),
                        type:'click',
                        fn:function (e) {
                            e.preventDefault();
                            e.target = Node(e.target);
                            if (e.target.hasClass('ok')) {
                                var _month = con.one('.ks-setime').one('select').val(),
                                    _year = con.one('.ks-setime').one('input').val();
                                con.one('.ks-setime').addClass('hidden');
                                if (!cc.Verify().isYear(_year)) {
                                    return;
                                }
                                if (!cc.Verify().isMonth(_month)) {
                                    return;
                                }
                                cc.father.render({
                                    date:new Date(_year + '/' + _month + '/01')
                                });
                                cc.father.fire('monthChange', {
                                    date:new Date(_year + '/' + _month + '/01')
                                });
                            } else if (e.target.hasClass('cancel')) {
                                con.one('.ks-setime').addClass('hidden');
                            }
                        }
                    };
                    bindEventTev();
                }

                if (cc.father.notLimited) {
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('.ks-cal-notLimited'),
                        type:'click',
                        fn:function (e) {
                            e.preventDefault();
                            cc.father.range = {start:null, end:null};
                            cc.father.fire('select', {date:null});
                            if (cc.father.popup && cc.father.closable) {
                                cc.father.hide();
                            }
                            cc.father.render({selected:null});
                        }
                    };
                    bindEventTev();
                }
                if (cc.father.multiSelect) {
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('div.ks-dbd'),
                        type:"mousedown",
                        fn:function (e) {
                            e.preventDefault();
                            if (e.target.tagName != 'A') {
                                return;
                            }
                            e.target = Node(e.target);

                            if (e.target.hasClass('ks-null')) {
                                return;
                            }
                            if (e.target.hasClass('ks-disabled')) {
                                return;
                            }
                            var d = new Date(cc.year, cc.month, Number(e.target.html()));
                            cc.father._handleMultiSelectStart(d)
                        }
                    };
                    bindEventTev();
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('div.ks-dbd'),
                        type:"mouseup",
                        fn:function (e) {
                            e.preventDefault();
                            if (e.target.tagName != 'A') {
                                return;
                            }
                            e.target = Node(e.target);
                            if (e.target.hasClass('ks-null')) {
                                return;
                            }
                            if (e.target.hasClass('ks-disabled')) {
                                return;
                            }
                            var d = new Date(cc.year, cc.month, Number(e.target.html()));
                            cc.father._handleMultiSelectEnd(d);
                            //cc.father.render();
                        }
                    };
                    bindEventTev();
                    tev = cc.EV[cc.EV.length] = {
                        target:con.one('.ks-multi-select-btn'),
                        type:"click",
                        fn:function (e) {
                            e.preventDefault();
                            cc.father._handleMultiSelect();
                            //cc.father.render();
                        }
                    };
                    bindEventTev();
                }

                //��ȷ���¼�,�����ʵʱ���������ȷ��
                if(cc.father.showTime){
                	tev = cc.EV[cc.EV.length] = {
                        target:con.one('a.ks-cal-footer-select-btn'),
                        type:"click",
                        fn:function (e) {
                            e.preventDefault();
                            if(!cc.father.dt_date){
                            	cc.father.dt_date = cc.father.date;
                            }
                            var d = cc.father.dt_date;
                            //�������time������ʾ������ʱ��
                            if(cc.timmer){
                                d.setHours(cc.timmer.get('h'));
                                d.setMinutes(cc.timmer.get('m'));
                                d.setSeconds(0);
                            }
                            if(!cc.father.checkBeforeAndAfter(d)){
                            	return;
                            }
                            cc.father.fire('select', {
                                date:d
                            });
                            cc.father.render({selected:d});
                            var str_time = Calendar.Date.format(d,cc.father.defaultFormat);
                            if(cc.father.input){
                            	cc.father.input.val(str_time);
                            	cc.father.input.fire('blur');
                            }
                            cc.father.hide();
                        }
                    };
                    bindEventTev();
                }
                
                //������¼�
                tev = cc.EV[cc.EV.length] = {
                    target:con.one('a.ks-cal-footer-clear-btn'),
                    type:"click",
                    fn:function (e) {
                        e.preventDefault();
                        var d = new Date();
                        cc.father.dt_date = d;
                        cc.father.fire('select', {
                            date:d
                        });
                        //�������time������ʾ������ʱ��
                        if(cc.timmer){
                            d.setHours(cc.timmer.get('h'));
                            d.setMinutes(cc.timmer.get('m'));
                            d.setSeconds(0);
                        }
                        if(cc.father.input){
                        	cc.father.input.val("");
                        	cc.father.input.fire('blur');
                        }
                        cc.father.hide();
                    }
                };
                bindEventTev();
                
                return this;

            };
            //�¼�
            this._monthAdd = function () {
                var self = this;
                if (self.month == 11) {
                    self.year++;
                    self.month = 0;
                } else {
                    self.month++;
                }
            },

            //�¼�
            this._monthMinus = function () {
                var self = this;
                if (self.month === 0) {
                    self.year--;
                    self.month = 11;
                } else {
                    self.month--;
                }
            },
            //���
            this._yearAdd = function () {
                var self = this;
                self.year++;
            };

            //���
            this._yearMinus = function () {
                var self = this;
                self.year--;
            };

            /**
             * �õ���ǰ��������node����
             */
            this._getNode = function () {
                var cc = this;
                return cc.node;
            };
            /**
             * �õ�ĳ���ж�����,��Ҫ���������ж�����
             */
            this._getNumOfDays = function (year, month) {
                return 32 - new Date(year, month - 1, 32).getDate();
            };

            this._isDisabled = function (arrDisabled, date) {
                if (arrDisabled && arrDisabled.length > 0) {
                    for (var i = 0; i < arrDisabled.length; i++) {
                        var d = arrDisabled[i];
                        if (date.getFullYear() == d.getFullYear() && date.getMonth() == d.getMonth() && date.getDate() == d.getDate()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            this.isInMulit = function (mulit, date) {
                if (mulit && mulit.length > 0) {
                    for (var i = 0; i < mulit.length; i++) {
                        var arr = mulit[i].split('-');
                        if (date.getFullYear() == parseInt(arr[0], 10) && date.getMonth() == (parseInt(arr[1], 10) - 1) && date.getDate() == parseInt(arr[2], 10)) {
                            return true;
                        }
                    }
                }
                return false;
            };


            /**
             * �������ڵ�html
             *
             */
            this.createDS = function () {
                var cc = this,
                    s = '',
                    startOffset = (7 - cc.father.startDay + new Date(cc.year + '/' + (cc.month + 1) + '/01').getDay()) % 7, //���µ�һ�������ڼ�
                    days = cc._getNumOfDays(cc.year, cc.month + 1),
                    selected = cc.father.selected,
                    today = new Date(),
                    i, _td_s;


                for (var i = 0; i < startOffset; i++) {
                    s += '<a href="javascript:void(0);" class="ks-null">0</a>';
                }
                //��Ī�Ż�����������
                for (i = 1; i <= days; i++) {
                    var cls = '';
                    var date = new Date(cc.year, cc.month, i);
                    //minDate �� maxDate����������
                    if ((cc.father.minDate && new Date(cc.year, cc.month, i + 1) <= cc.father.minDate) || (cc.father.maxDate && date > cc.father.maxDate) || cc._isDisabled(cc.father.disabled, date)) {
                        cls = 'ks-disabled';
                    }
                    else if (cc.father.range && date >= cc.father.range.start && date <= cc.father.range.end) {
                        cls = 'ks-range';
                    }
                    else if ((selected && selected.getFullYear() == cc.year && selected.getMonth() == cc.month && selected.getDate() == i) || cc.isInMulit(cc.father.multi, date)) {
                        cls = 'ks-selected';
                    }

                    if (today.getFullYear() == cc.year && today.getMonth() == cc.month && today.getDate() == i) {
                        cls += ' ks-today';
                    }

                    s += '<a ' + (cls ? 'class="' + cls + '"' : '') + ' href="javascript:void(0);">' + i + '</a>';
                }
                cc.ds = s;
                return this;
            };
            /**
             * ��Ⱦ
             */
            this.render = function () {
                var cc = this;
                cc._renderUI();
                cc._buildEvent();
                return this;
            };


        }//Page constructor over
    });
    return Calendar;
}, { requires:["node", "./base"] });
/**
 * 2010-09-14 �γ�
 *        - ��֧��S.Date.format��S.Date.parse��format���Գ��ø�ʽ����֧�֣�������10������Ҳ�����Զ���
 *        - kissy-lang���Ƿ�Ӧ������Lang.type(o)?����isDate(d)?
 *        - ģ������ȡΪdatetype����ֱ����date? �Ҹ���������date
 *        - YUI��datetype���˴���������ȫ�����ֽ���hack���ƺ�KISSY�ǲ���Ҫ�ģ�KISSYֻ��������hack����
 */
/**
 *      ����
 * @author  �γ�<lijing00333@163.com>
 */
KISSY.add(KISSY.myPackageName+'/util/dateTime/time',function(S, Node,Calendar) {

    S.augment(Calendar, {

        /**
         * ʱ��ѡ������

         * @constructor S.Calendar.TimerSelector
         * @param {Object} ft ,timer���ڵ�����
         * @param {Object} father ָ��S.Calendarʵ����ָ�룬��Ҫ������Ĳ���
         */
        TimeSelector:function(ft, father) {
            //����

            this.father = father;
            this.fcon = ft.parent('.ks-cal-box');
            this.popupannel = this.fcon.one('.ks-selectime');//��ѡʱ��ĵ�����
            this.time = father.date;
            this.ctime = Node('<div class="ks-cal-time ks-cal-time-cust">'+
            					'<font class="ks-cal-time-str">ʱ�䣺</font>'+
            					'<input class="ks-cal-time-input-h h" />'+
            					'<div class="ctaH">'+
            						'<button class="u"></button>'+
            						'<button class="d"></button>'+
            					'</div>'+
            					'<font class="ks-cal-time-split">:</font>'+
            					'<input  class="ks-cal-time-input-m m" />'+
            					'<div class="ctaM">'+
            						'<button class="u"></button>'+
            						'<button class="d"></button>'+
            					'</div>'+
            					'</div>');

            /**
             * ������������������ļ��裬��������time��ʾ����
             */
            this.render = function() {
                var self = this;
                var h = self.get('h');
                var m = self.get('m');
                if(m < 10){
                	m = "0"+m;
                }
                if(h < 10){
                	h = "0"+h;
                }
                self.father._time = self.time;
                self.ctime.all('.h').val(h);
                self.ctime.all('.m').val(m);
                return self;
            };
            //�����set��get��ֻ�Ƕ�time�Ĳ��������������������������

            this.setTime = function(){
            	var self = this;
            	var Fdate = father.date;
            	var h = Fdate.getHours();
            	var m = Fdate.getMinutes();
            	if(m < 10){
                	m = "0"+m;
                }
                if(h < 10){
                	h = "0"+h;
                }
                self.father._time = self.time;
                self.ctime.all('.h').val(h);
                self.set('h', h);
                self.ctime.all('.m').val(m);
                self.set('m', m);
                return self;
            };
            
            /**
             * set(status,v)
             * h:2,'2'
             */
            this.set = function(status, v) {
                var self = this;
                v = Number(v);
                switch (status) {
                    case 'h':
                        self.time.setHours(v);
                        break;
                    case 'm':
                        self.time.setMinutes(v);
                        break;
                }
                self.render();
            };
            /**
             * get(status)
             */
            this.get = function(status) {
                var self = this;
                var time = self.time;
                switch (status) {
                    case 'h':
                        return time.getHours();
                    case 'm':
                        return time.getMinutes();
                }
            };

            /**
             * add()
             * ״ֵ̬����ı�����1

             */
            this.add = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v++;
                self.set(status, v);
            };
            /**
             * minus()
             * ״ֵ̬����ı�����1

             */
            this.minus = function() {
                var self = this;
                var status = self.status;
                var v = self.get(status);
                v--;
                self.set(status, v);
            };


            //����

            this._init = function() {
                var self = this;
                ft.html('').append(self.ctime);
                self.render();
                self.popupannel.on('click', function(e) {
                    var el = Node(e.target);
                    if (el.hasClass('x')) {//�ر�
                        self.hidePopup();
                    } else if (el.hasClass('item')) {//��ѡһ��ֵ
                        var v = Number(el.html());
                        self.set(self.status, v);
                        self.hidePopup();
                    }
                });
                //Сʱ�ϵļ�ͷ����
                self.ctime.one('.ctaH').one('.u').on('click', function() {
                	self.status = 'h';
                    self.add();
                });
                //Сʱ�µļ�ͷ����
                self.ctime.one('.ctaH').one('.d').on('click', function() {
                	self.status = 'h';
                    self.minus();
                });
                //Сʱ�ϵļ�ͷ����
                self.ctime.one('.ctaM').one('.u').on('click', function() {
                	self.status = 'm';
                    self.add();
                });
                //Сʱ�µļ�ͷ����
                self.ctime.one('.ctaM').one('.d').on('click', function() {
                	self.status = 'm';
                    self.minus();
                });
                //Сʱ�����,ֵ�ı�
                self.ctime.one('.ks-cal-time-input-h.h').on('valuechange', function(e) {
                	var newVal = e.newVal;//��ֵ
                	if(newVal){
                		if (newVal < 0){
                    		e.currentTarget.value = 0;
                    	} else if(newVal > 23){
                    		e.currentTarget.value = 0;
                    	} else if(newVal < 10){
                    		if(newVal == 0 && newVal.length >= 2){
                        		e.currentTarget.value = "00";
                        	} else {
                        		e.currentTarget.value = newVal;
                        	}
                    	} else {
                    		newVal = Number(e.newVal);
                    		e.currentTarget.value = newVal;
                    	}
                	}
                });
                //Сʱ�����,���㶪ʧ
                self.ctime.one('.ks-cal-time-input-h.h').on('blur', function(e) {
                	var cTarg = S.one(e.currentTarget);
                	var hours = cTarg.val();
                	if(hours){
                		if(hours < 10){
                			hours = "0" + Number(hours);
                		}
                	} else {
                    	hours = new Date().getHours();
                	}
                	self.set('h', hours);
                });
                //���������,ֵ�ı�
                self.ctime.one('.ks-cal-time-input-m.m').on('valuechange', function(e) {
                	var newVal = e.newVal;//��ֵ
                	if(newVal){
                		if (newVal < 0){
                    		e.currentTarget.value = 0;
                    	} else if(newVal > 59){
                    		e.currentTarget.value = 0;
                    	} else if(newVal < 10){
                    		if(newVal == 0 && newVal.length >= 2){
                        		e.currentTarget.value = "00";
                        	} else {
                        		e.currentTarget.value = newVal;
                        	}
                    	} else {
                    		newVal = Number(e.newVal);
                    		e.currentTarget.value = newVal;
                    	}
                	}
                });
                //���������,���㶪ʧ
                self.ctime.one('.ks-cal-time-input-m.m').on('blur', function(e) {
                	var cTarg = S.one(e.currentTarget);
                	var minutes = cTarg.val();
                	if(minutes){
                		if(minutes < 10){
                			hours = "0" + Number(minutes);
                		}
                	} else {
                		minutes = new Date().getMinutes();
                	}
                	self.set('m', minutes);
                });
            };
            this._init();
        }
    });

    return Calendar;

}, { requires:["node","./base"] });

/*
 *  Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 *
 * Last modified by jayli �γ� 2010-09-09
 * - �������ĵ�֧��
 * - �򵥵ı��ػ�����w������x����֧��
 */
KISSY.add(KISSY.myPackageName+'/util/dateTime/date',function (S) {

	
	function getDate(strDate) {
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        return date;
    }
	
    function dateParse(data, s) {

        var date = null;
        s = s || '-';
        //Convert to date
        if (!(date instanceof Date)) {
            date = getDate(data);
        }
        else {
            return date;
        }

        // Validate
        if (date instanceof Date && (date != "Invalid Date") && !isNaN(date)) {
            return date;
        }
        else {
            var arr = data.toString().split(s);
            if (arr.length == 3) {
                date = new Date(arr[0], (parseInt(arr[1], 10) - 1), arr[2]);
                if (date instanceof Date && (date != "Invalid Date") && !isNaN(date)) {
                    return date;
                }
            }
        }
        return null;

    }


    var dateFormat = function () {
        var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = "0" + val;
                }
                return val;
            },
            // Some common format strings
            masks = {
                "default":"ddd mmm dd yyyy HH:MM:ss",
                shortDate:"m/d/yy",
                //mediumDate:     "mmm d, yyyy",
                longDate:"mmmm d, yyyy",
                fullDate:"dddd, mmmm d, yyyy",
                shortTime:"h:MM TT",
                //mediumTime:     "h:MM:ss TT",
                longTime:"h:MM:ss TT Z",
                isoDate:"yyyy-mm-dd",
                isoTime:"HH:MM:ss",
                isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
                isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",

                //added by jayli
                localShortDate:"yy��mm��dd��",
                localShortDateTime:"yy��mm��dd�� hh:MM:ss TT",
                localLongDate:"yyyy��mm��dd��",
                localLongDateTime:"yyyy��mm��dd�� hh:MM:ss TT",
                localFullDate:"yyyy��mm��dd�� w",
                localFullDateTime:"yyyy��mm��dd�� w hh:MM:ss TT"

            },

            // Internationalization strings
            i18n = {
                dayNames:[
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
                    "������", "����һ", "���ڶ�", "������", "������", "������", "������"
                ],
                monthNames:[
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ]
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw SyntaxError("invalid date");
            }

            mask = String(masks[mask] || mask || masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:d,
                    dd:pad(d, undefined),
                    ddd:i18n.dayNames[D],
                    dddd:i18n.dayNames[D + 7],
                    w:i18n.dayNames[D + 14],
                    m:m + 1,
                    mm:pad(m + 1, undefined),
                    mmm:i18n.monthNames[m],
                    mmmm:i18n.monthNames[m + 12],
                    yy:String(y).slice(2),
                    yyyy:y,
                    h:H % 12 || 12,
                    hh:pad(H % 12 || 12, undefined),
                    H:H,
                    HH:pad(H, undefined),
                    M:M,
                    MM:pad(M, undefined),
                    s:s,
                    ss:pad(s, undefined),
                    l:pad(L, 3),
                    L:pad(L > 99 ? Math.round(L / 10) : L, undefined),
                    t:H < 12 ? "a" : "p",
                    tt:H < 12 ? "am" : "pm",
                    T:H < 12 ? "A" : "P",
                    TT:H < 12 ? "AM" : "PM",
                    Z:utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:(o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    return {
        format:function (date, mask, utc) {
            return dateFormat(date, mask, utc);
        },
        parse:function (date, s) {
            return dateParse(date, s);
        }
    };
});
/**
 *  calendar
 */
KISSY.add(KISSY.myPackageName+'/util/dateTime/dateTime',function (S, C, Page, Time, Date) {
    C.Date = Date;
    S.Calendar = C;
    return C;
}, {
    requires:["./base", "./page", "./time", "./date",KISSY.myPackageName+"/util/dateTime/assets/dpl.css"]
});

/**
 ��Ī 2011-12-28��
 1.�������ò�����
 disabled:null, //��ֹ�������������[new Date(),new Date(2011,11,26)]
 range:    null,//��ѡ���ʱ���{start:null,end:null}
 align:{
 points:['bl','tl'],
 offset:[0,0]
 },//���䷽ʽ
 notLimited:    false,// �Ƿ���ֲ��޵İ�ť
 rangLinkage //��������Ƿ�����
 2.�����ӹ���
 -������"��"��ǰ������
 -�����˲��ް�ť���ڵ��֮�󴥷���select���¼�������Ϊnull,
 -Date.parse����������"2011-12-27"�ַ����Ĵ���
 3.bug�޸�
 -�޸���С����������ƺ�31��ʼ�տɵ����BUG
 4.��ʽ�ĵ���
 -������
 **/
