/*
combined files : 

gallery/countdown/1.3/timer
gallery/countdown/1.3/effect
gallery/countdown/1.3/index

*/
/**
 * ����ʱ��� - Timer Module
 * @author jide<jide@taobao.com>
 * 
 * ���������õ�ʱ�䴦��ģ�顣��������ȷ�ؼ�ʱ����Ҫʱ��֡��ʱ��
 * Timer��ͳһ����ʱ����º�����ÿ����һ��ʱ���Ӧһ֡�������ṩadd/remove֡�����ķ�����
 * add ʱ��Ҫ ֡����frame, ֡Ƶ��frequency��
 * remove ʱֻ��Ҫ ֡����frame
 *
 *
 * [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [x] 2012-05-02
 *     �Ż���ȷ��ʱ���ԣ��Ż��߼�������л�tabʱ��Ч��
 * [*] 2012-04-26
 *     �ع�Timerģ�飬����ʵʱ����ص��߼�ֻ�����ﴦ��
 * [*] 2011-01-13
 *     ��Ϊʹ�ñ���ʱ���ʱ���������(setInterval�ȵ��µ�)�����ۼ�
 */
KISSY.add('gallery/countdown/1.3/timer',function (S) {
        // fns �е�Ԫ�ض��Ƕ�Ԫ�飬����Ϊ��
        //   frame {function}   ֡����
        //   frequency {number} ������ĩλ����1����֡Ƶ����1000��/s��0����֡Ƶ����100��/s
    var fns = [],
        // ����ָ��
        commands = [];

    /**
     * timer
     * ����Ƶ��Ϊ100msһ�Ρ�Ŭ����ȷ��ʱ������֡����
     */
    function timer() {
        // Ϊ����ѭ��ʱ�ܵ� ��fns������� ��Ӱ��,
        // add/removeָ����ǰͳһ����
        while (commands.length) {
            commands.shift()();
        }

        // ������ʱ�䣬����diff
        var diff = +new Date() - timer.nextTime,
            count = 1 + Math.floor(diff / 100);

        diff = 100 - diff % 100;
        timer.nextTime += 100 * count;

        // ѭ������fns��Ԫ��
        var frequency, step,
            i, len;
        for (i = 0, len = fns.length; i < len; i += 2) {
            frequency = fns[i + 1];

            // 100��/s��
            if (0 === frequency) {
                fns[i](count);
            // 1000��/s��
            } else {
                // �Ȱ�ĩλ��0����ÿ�μ�2
                frequency += 2 * count - 1;

                step = Math.floor(frequency / 20);
                if (step > 0) { fns[i](step); }

                // ��ĩλ��ԭ��1
                fns[i + 1] = frequency % 20 + 1;
            }
        }

        // next
        setTimeout(timer, diff);
    }
    // �״ε���
    timer.nextTime = +new Date();
    timer();

    return {
        add: function (fn, frequency) {
            commands.push(function () {
                fns.push(fn);
                fns.push(frequency === 1000 ? 1 : 0);
            });
        },
        remove: function (fn) {
            commands.push(function () {
                var i = S.indexOf(fn, fns);
                if (i !== -1) {
                    fns.splice(S.indexOf(fn, fns), 2);
                }
            });
        }
    };
});

/**
 * NOTES: 
 * A. Firefox 5+, Chrome 11+, and Internet Explorer 10+ change timer resolution in inactive tabs to 1000 milliseconds. [http://www.nczonline.net/blog/2011/12/14/timer-resolution-in-browsers/, https://developer.mozilla.org/en/DOM/window.setTimeout#Inactive_tabs]
 * B. Уʱ���ԣ�
 *    1. ��������ۼ�
 *    2. ���ڽϴ���󣨱���A��ɵģ�һ������
 */

/**
 * ����ʱ���
 * Effects ģ��
 * @author jide<jide@taobao.com>
 *
 */
/*global KISSY */

KISSY.add('gallery/countdown/1.3/effect',function (S) {
    /**
     * Static attributes
     */
    var Effect = {
        // ��ͨ������Ч��
        normal: {
            paint: function () {
                var me = this,
                    content;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        content = '';

                        S.each(me._toDigitals(hand.value, hand.bits), function (digital) {
                            content += me._html(digital, '', 'digital');
                        });

                        // ������
                        hand.node.html(content);
                    }
                });
            }
        },
        // ����Ч��
        slide: {
            paint: function () {
                var me = this,
                    content, bits,
                    digitals, oldDigitals;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        content = '';
                        bits = hand.bits;
                        digitals = me._toDigitals(hand.value, bits);
                        if (hand.lastValue === undefined) {
                            oldDigitals = digitals;
                        } else {
                            oldDigitals = me._toDigitals(hand.lastValue, bits);
                        }

                        while (bits--) {
                            if (oldDigitals[bits] !== digitals[bits]) {
                                content = me._html([me._html(digitals[bits], '', 'digital'), me._html(oldDigitals[bits], '', 'digital')], 'slide-wrap') + content;
                            } else {
                                content = me._html(digitals[bits], '', 'digital') + content;
                            }
                        }

                        // ������
                        hand.node.html(content);
                    }
                });
                
                Effect.slide.afterPaint.apply(me);
            },
            afterPaint: function () {
                // �ҵ�ֵ�����ı��hand
                S.each(this.hands, function (hand) {
                    if (hand.lastValue !== hand.value && hand.lastValue !== undefined) {
                        var node = hand.node,
                            height = node.one('.digital').height();

                        node.css('height', height);
                        node.all('.slide-wrap').css('top', -height).animate('top: 0', 0.5, 'easeIn');
                    }
                });
            }
        },
        // ����Ч����
        // ����Ļ���Ҫʵ��DOM�ڵ������Ч�����Լ۱Ȳ���
/*
// ֻ������
<s class="flip-wrap">
    to be update...
</s>
// ��ָ��
<s class="hand">
    <s class="handlet new">
        <s class="digital digital-1"></s>
        <s class="digital digital-9"></s>
    </s>
    <s class="handlet old">
        <s class="digital digital-2"></s>
        <s class="digital digital-0"></s>
    </s>
    <s class="handlet mask">
        <s class="digital digital-2"></s>
        <s class="digital digital-0"></s>
    </s>
</s>
*/
        flip: {
            paint: function () {
                var me = this,
                    m_mask, m_new, m_old;

                // �ҵ�ֵ�����ı��hand
                S.each(me.hands, function (hand) {
                    if (hand.lastValue !== hand.value) {
                        // �����µ�markup
                        m_mask = '';
                        m_new = '';
                        m_old = '';

                        S.each(me._toDigitals(hand.value, hand.bits), function (digital) {
                            m_new += me._html(digital, '', 'digital');
                        });
                        if (hand.lastValue === undefined) {
                            // ����
                            hand.node.html(m_new);
                        } else {
                            m_new = me._html(m_new, 'handlet');
                            S.each(me._toDigitals(hand.lastValue, hand.bits), function (digital) {
                                m_old += me._html(digital, '', 'digital');
                            });
                            m_mask = me._html(m_old, 'handlet mask');
                            m_old = me._html(m_old, 'handlet');

                            // ����
                            hand.node.html(m_new + m_old + m_mask);
                        }
                    }
                });
                
                Effect.flip.afterPaint.apply(me);
            },
            afterPaint: function () {
                // �ҵ�ֵ�����ı��hand
                S.each(this.hands, function (hand) {
                    if (hand.lastValue !== hand.value && hand.lastValue !== undefined) {
                        // Ȼ���������Ӷ���Ч��
                        var node = hand.node,
                            ns = node.all('.handlet'),
                            n_new = ns.item(0),
                            n_old = ns.item(1),
                            n_mask = ns.item(2),
                            width = node.width(),
                            height = node.height(),
                            h_top = Math.floor(height / 2),
                            h_bottom = height - h_top;

                        // prepare
                        n_old.css({
                            clip: 'rect(' + h_top + 'px, ' + width + 'px, ' + height + 'px, 0)'
                        });

                        // ����һ���ϰ벿��
                        n_mask.css({
                            overflow: 'hidden',
                            height: h_top + 'px'
                        });
                        n_mask.animate({
                            top: h_top + 'px',
                            height: 0
                        }, 0.15, 'easeNone', function () {
                            // ���������°벿��
                            n_mask.html(n_new.html());
                            n_mask.css({
                                top: 0,
                                height: h_top + 'px',
                                clip: 'rect(' + h_top + 'px, ' + width + 'px, ' + height + 'px, 0)'
                            });
                            n_mask.animate('height: ' + height + 'px', 0.3, 'bounceOut');
                        });
                    }
                });
            }
        }
    };

    return Effect;
}, {requires: []});

/**
 * @fileoverview ����ʱ���
 * @author jide<jide@taobao.com>
 * @module Countdown
 *
 *
 * [+]new feature  [*]improvement  [!]change  [x]bug fix
 *
 * [*] 2013-07-10
 *     bump version to 1.3
 * [*] 2012-04-26
 *     �Ƴ�watchman���Լ�����ʵʱ���йص��߼�������notify��Ч��bug
 * [x] 2011-04-18 16:35
 *     �޸���ʼ֮Ϊ0ʱ���ܳ��ֵ���ʱΪ������bug by xixia.sm
 *     {{{ value = value < 0 ? 0 : value; }}}
 */

KISSY.add('gallery/countdown/1.3/index',function (S, Node, Base, JSON, Timer, Effect) {
    var EVENT_AFTER_PAINT = 'afterPaint';

    /**
     * ���޸��������
     * @class Countdown
     * @constructor
     * @extends Base
     */
    function Countdown(config) {
        // factory or constructor
        if (!(this instanceof Countdown)) {
            return new Countdown(config);
        }

        config.el = S.one(config.el);
        if (!config.el) return;

        var cfg = config.el.attr('data-config');
        if (cfg) {
            cfg = JSON.parse(cfg.replace(/'/g, '"'));
            config = S.merge(cfg, config);
        }

        //���ø��๹�캯��
        Countdown.superclass.constructor.call(this, config);

        this._init();
    }

    S.extend(Countdown, Base,
        /** @lends Countdown.prototype*/{
            /**
             * ��ʼ��
             * @private
             */
            _init: function () {//{{{
                var me = this;
                var el = me.get('el');

                // ��ʼ��ʱ��.
                var hands = [];
                /**
                 * ָ��ṹ
                 * hand: {
                 *   type: string,
                 *   value: number,
                 *   lastValue: number,
                 *   base: number,
                 *   radix: number,
                 *   bits: number,
                 *   node: S.Node
                 * }
                 */
                me.hands = hands;
                me.frequency = 1000;
                me._notify = [];

                // ����markup
                var tmpl = el.html();
                var varRE = me.get('varRegular');
                varRE.lastIndex = 0;
                el.html(tmpl.replace(varRE, function (str, type) {
                    // ʱ��Ƶ��У��.
                    if (type === 'u' || type === 's-ext') {
                        me.frequency = 100;
                    }

                    // ����hand��markup
                    var content = '';
                    if (type === 's-ext') {
                        hands.push({type: 's'});
                        hands.push({type: 'u'});
                        content = me._html('', 's', 'handlet') +
                            me._html('.', '', 'digital') +
                            me._html('', 'u', 'handlet');
                    } else {
                        hands.push({type: type});
                    }

                    return me._html(content, type, 'hand');
                }));

                // ָ��type��������(node, radix, etc.)�ĳ�ʼ��.
                var clock = me.get('clock');
                S.each(hands, function (hand) {
                    var type = hand.type,
                        base = 100, i;

                    hand.node = el.one('.hand-' + type);

                    // radix, bits ��ʼ��.
                    for (i = clock.length - 3; i > -1; i -= 3) {
                        if (type === clock[i]) {
                            break;
                        }

                        base *= clock[i + 1];
                    }
                    hand.base = base;
                    hand.radix = clock[i + 1];
                    hand.bits = clock[i + 2];
                });

                me._getLeft();
                me._reflow();

                // bind reflow to me.
                var _reflow = me._reflow;
                me._reflow = function () {
                    return _reflow.apply(me, arguments);
                };
                Timer.add(me._reflow, me.frequency);

                // ��ʾʱ��.
                el.show();
            },//}}}
            /**
             * ��ȡ����ʱʣ��֡��
             */
            _getLeft: function () {//{{{
                var left = this.get('leftTime') * 1000;
                var end = this.get('stopPoint');        // �����UNIXʱ��������뼶
                if (!left && end) {
                    left = end - S.now();
                }

                this.left = left - left % this.frequency;
            },//}}}
            /**
             * ����ʱ��
             */
            _reflow: function (count) {//{{{
                count = count || 0;

                var me = this;
                me.left = me.left - me.frequency * count;

                // ����hands
                S.each(me.hands, function (hand) {
                    hand.lastValue = hand.value;
                    hand.value = Math.floor(me.left / hand.base) % hand.radix;
                });

                // ����ʱ��.
                me._repaint();

                // notify
                if (me._notify[me.left]) {
                    S.each(me._notify[me.left], function (callback) {
                        callback.call(me);
                    });
                }

                // notify ���ܸ���me.left
                if (me.left < 1) {
                    Timer.remove(me._reflow);
                }

                return me;
            },//}}}
            /**
             * �ػ�ʱ��
             * @private
             */
            _repaint: function () {//{{{
                Effect[this.get('effect')].paint.apply(this);

                this.fire(EVENT_AFTER_PAINT);
            },//}}}
            /**
             * ��ֵת��Ϊ������������ʽ
             * @private
             * @param {number} value
             * @param {number} bits
             */
            _toDigitals: function (value, bits) {//{{{
                value = value < 0 ? 0 : value;

                var digitals = [];

                // ��ʱ���֡���Ȼ��������.
                while (bits--) {
                    digitals[bits] = value % 10;

                    value = Math.floor(value / 10);
                }

                return digitals;
            },//}}}
            /**
             * ������Ҫ��html���룬��������
             * @private
             * @param {string|Array.<string>} content
             * @param {string} className
             * @param {string} type
             */
            _html: function (content, className, type) {//{{{
                if (S.isArray(content)) {
                    content = content.join('');
                }

                switch (type) {
                    case 'hand':
                        className = type + ' hand-' + className;
                        break;
                    case 'handlet':
                        className = type + ' hand-' + className;
                        break;
                    case 'digital':
                        if (content === '.') {
                            className = type + ' ' + type + '-point ' + className;
                        } else {
                            className = type + ' ' + type + '-' + content + ' ' + className;
                        }
                        break;
                }

                return '<s class="' + className + '">' + content + '</s>';
            },//}}}
            /**
             * ����ʱ�¼�
             * @param {number} time unit: second
             * @param {Function} callback
             */
            notify: function (time, callback) {//{{{
                time = time * 1000;
                time = time - time % this.frequency;

                var notifies = this._notify[time] || [];
                notifies.push(callback);
                this._notify[time] = notifies;

                return this;
            }//}}}
        }, {
            ATTRS: /** @lends Countdown*/{
                el: {
                },
                // unixʱ�������λӦ���Ǻ��룡
                stopPoint: {
                },
                leftTime: {
                    value: 0
                },
                template: {
//                    value: '${h}ʱ${m}��${s-ext}��'
                },
                varRegular: {
                    value: /\$\{([\-\w]+)\}/g
                },
                clock: {
                    value: ['d', 100, 2, 'h', 24, 2, 'm', 60, 2, 's', 60, 2, 'u', 10, 1]
                },
                effect: {
                    value: 'normal'
                }
            }
        });

    return Countdown;
}, {requires: ['node', 'base', 'json', './timer', './effect', './index.css']});


