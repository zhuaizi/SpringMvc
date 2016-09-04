/*
combined files : 

gallery/pwdstrength/1.0/index

*/
/**
 * @fileoverview 基于Kissy的密码强度提示组件
 * @author 弘树<tiehang.lth@alibaba-inc.com>
 * @module pwdstrength
 **/
KISSY.add('gallery/pwdstrength/1.0/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Pwdstrength
     * @constructor
     * @extends Base
     */
    function Pwdstrength(comConfig) {
        var self = this;
        //调用父类构造函数
        Pwdstrength.superclass.constructor.call(self, comConfig);
        self.init();
    }

    S.extend(Pwdstrength, Base, /** @lends Pwdstrength.prototype*/{

        init: function(){
            var self = this;
            self.password = EMPTY;
            self.renderUI();
            self.bindEvent();
        },

        /**
         * 根据renderType选择对应的dom渲染方法
         */
        renderUI: function(){
            var self = this,
                needRender = self.get('needRender'),
                html = self.get('html');

            if(needRender && html != ''){
                var triggerNode = self.get('triggerNode'),
                    boundingBox = $(html),
                    renderType = self.get('renderType');

                switch(renderType){

                    case 'insert':

                        // 直接插入节点到input节点后
                        triggerNode.after(boundingBox);
                        break;

                    case 'popup':

                        // 插入到body尾部，根据input节点位置进行定位
                        $(document.body).append(boundingBox);
                        self.locatePopup(triggerNode, boundingBox);
                        break;

                    default:
                        break;

                }

                // 挂载boundingBox以备change用
                this.boundingBox = boundingBox;
            }
        },

        /**
         * 定位popup位置
         * @param triggerNode
         * @param boundingBox
         */
        locatePopup: function(triggerNode, boundingBox){

            var offset = triggerNode.offset(),
                width = triggerNode.innerWidth(),
                height = triggerNode.innerHeight(),
                MARGIN = 15;

            boundingBox.css({
                left: offset.left + width + MARGIN,
                top: offset.top + (height - boundingBox.innerHeight()) / 2
            });

            // 保存当前input节点的offset值，便于之后确认是否重新定位
            self.curOffset = triggerNode.offset();
        },

        bindEvent: function(){
            var self = this,
                triggerNode = self.get('triggerNode'),
                needRender = self.get('needRender'),
                boundingBox = self.boundingBox;

            // 响应onchange事件，可自定义
            triggerNode.on('change keypress paste focus textInput input', function(){

                var val = $(this).val();
                self.password = val;

                // 计算当前密码强度级别，输入为空时返回-1，反之返回1+
                var level = (val != EMPTY) ? self.level() : -1;

                // 调用内置/自定义onchange函数响应强度变化
                var onchange = self.get('onchange');
                S.isFunction(onchange) && onchange.call(self, level, boundingBox);
            });

            // 响应onblur事件，可自定义
            triggerNode.on('focusout blur', function(){

                // 调用内置/自定义onblur函数
                var onblur = self.get('onblur');
                S.isFunction(onblur) && onblur.call(self, boundingBox);
            });

        },

        // 需要用到的正则表达式
        regex : {
            illegal : /[^-+=|,0-9a-zA-Z!@#$%^&*?_.~+/\\(){}\[\]<>]/g,
            allNumber : /^\d+$/,
            allLetter : /^[a-zA-Z]+$/,
            allCharacter : /^[-+=|,!@#$%^&*?_.~+/\\(){}\[\]<>]+$/ ,
            allSame : /^([\s\S])\1*$/,
            number : /\d/g,
            letter : /[a-zA-Z]/g,
            lowerAndUpperLetter : /[a-z][^A-Z]*[A-Z]|[A-Z][^a-z]*[a-z]/,
            numberAndLetter : /\d[^a-zA-Z]*[a-zA-Z]|[a-zA-Z][^\d]*\d/,
            character : /[-+=|,!@#$%^&*?_.~+/\\()|{}\[\]<>]/g
        },

        /**
         * 计算强度级别
         * @returns {*} 级别(0, 1, 2, ...)代表(低, 中, 高, ...)
         */
        level : function () {
            var self = this,
                totalScore = 0;

            // 长度：[0, 4]: +5; [5, 7]: +10; [8, ]: +25
            var length = this.size();
            4 >= length ? totalScore += 5 : length > 4 && 8 > length ? totalScore += 10 : length >= 8 && (totalScore += 25);

            // 大小写字母混合: +20; 只有大/小写字母: +10
            var hasLowerAndUpperLetter = this.hasLowerAndUpperLetter(),
                hasLetter = this.hasLetter();
            hasLowerAndUpperLetter ? totalScore += 20 : hasLetter && (totalScore += 10);

            // 数字[3, ]: +20; [1, 2]: +10
            var hasNumber = this.hasNumber();
            hasNumber >= 3 ? totalScore += 20 : hasNumber && (totalScore += 10);

            // 符号[2, ]: +25; [1]: +10
            var hasCharacter = this.hasCharacter();
            hasCharacter >= 3 ? totalScore += 25 : hasCharacter && (totalScore += 10);

            // 大小写字母混合 + 数字 + 字符: +10
            // 字母 + 数字 + 字符: +5
            // 字母、数字、字符中3选2: +2
            if(hasLowerAndUpperLetter && hasNumber && hasCharacter){
                totalScore += 5;
            }else if(hasLetter && hasNumber && hasCharacter){
                totalScore += 3;
            }else if((hasLetter && 1) + (hasNumber && 1) + (hasCharacter && 1) > 1){
                totalScore += 2;
            }

            var rules = self.get('rule');
            S.each(rules, function(val, idx){
                var pos = rules.length - (idx + 1);
                if(totalScore > val){
                    // 返回得分对应所在区间的序号，即level
                    totalScore = pos;
                    return false;
                }else if(pos == 0){
                    // 如果得分低于下限，返回-1
                    totalScore = -1;
                }
            });

            return totalScore;
        },

        size : function () {
            return this.password.length
        },
        isIllegal : function () {
            return !!this.password.match(this.regex.illegal)
        },
        isAllNumber : function () {
            return !!this.password.match(this.regex.allNumber)
        },
        isAllLetter : function () {
            return !!this.password.match(this.regex.allLetter)
        },
        isAllCharacter : function () {
            return !!this.password.match(this.regex.allCharacter)
        },
        isAllSame : function () {
            return !!this.password.match(this.regex.allSame)
        },
        hasNumber : function () {
            return (this.password.match(this.regex.number) || []).length
        },
        hasLetter : function () {
            return (this.password.match(this.regex.letter) || []).length
        },
        hasLowerAndUpperLetter : function () {
            return !!this.password.match(this.regex.lowerAndUpperLetter)
        },
        hasNumberAndLetter : function () {
            return !!this.password.match(this.regex.numberAndLetter)
        },
        hasCharacter : function () {
            return (this.password.match(this.regex.character) || []).length
        },

        /**
         * 转换颜色字符串到颜色数组[RED, GREEN, BLUE]
         */
        _transColorToArr: function(val){
            if(/#[a-fA-F0-9]{6}/.test(val)){

                var result = [];
                for(var i = 1; i < 6; i += 2){
                    result.push(parseInt(val.substring(i, i + 2), 16));
                }
                return result;
            }else{
                S.log('Invalid color set, please check and retry!');
                return false;
            }
        }

    }, {ATTRS : /** @lends Pwdstrength*/{

        triggerNode: {
            value: null,
            setter: function(val){
                if(S.isString(val)){
                    return $(val);
                }
                return val;
            }
        },

        /**
         * 指定强度级别规则
         * @array 从高到低依次指定各个强度级别的得分门槛值
         */
        rule: {
            value: [70, 30, 0]
        },

        /**
         * 指定强度提示信息的html内容
         * 对于popup类型，自动包装popup外层
         */
        html: {
            value: '<div class="pwdstrength-popup"><em class="popup-arrow"></em><em class="popup-arrow-padding"></em><div class="popup-content">' +
                '<div class="pwdstrength-wrap">密码强度：' +
                '<span class="strenth-wrap"><span class="strength-bar"></span></span>' +
                '</div></div></div>',
            setter: function(val){
                var self = this,
                    needRender = self.get('needRender'),
                    renderType = self.get('renderType');

                if(needRender && (renderType == 'popup')){
                    val = '<div class="pwdstrength-popup"><em class="popup-arrow"></em><em class="popup-arrow-padding"></em><div class="popup-content">' +
                        val + '</div></div>';
                }
                return val;
            }
        },

        /**
         * 是否需要渲染dom（如果dom中已有强度提示节点，设为false），为true时必须指定renderType
         */
        needRender: {
            value: true
        },

        /**
         * 指定展示类型：insert/popup 直接紧跟输入框后面：嵌入dom/popup
         */
        renderType: {
            value: 'popup',
            setter: function(val){
                var self = this,
                    needRender = self.get('needRender'),
                    validTypes = ['insert', 'popup'];
                if(!needRender){
                    S.log('If needRender is false, no need for setting renderType!', 'warn');
                }
                if(!S.inArray(val, validTypes)){
                    S.log('The renderType you set is not supported yet, please check and retry!', 'error');
                    return needRender[0];
                }
                return val;
            }
        },

        /**
         * 默认的强度提示条提示强度最弱时的颜色
         */
        beginColor: {
            value: '#bd5151'
        },

        /**
         * 默认的强度提示条提示强度最强时的颜色
         */
        endColor: {
            value: '#1fa542'
        },

        /**
         * 默认的onchange实现，基于popup形式
         */
        onchange: {
            value: function(level, node){

                var self = this,
                    transColorFunc = self._transColorToArr,
                    beginColor = transColorFunc(self.get('beginColor')),
                    endColor = transColorFunc(self.get('endColor')),
                    transColor = [];

                var totalWidth = node.one('.strenth-wrap').width(),
                    grades = self.get('rule').length;

                // onchange方法缓存之前的变量值，加快下次执行效率
                var onchange = function(level, node){

                    // 颜色百分比和长度百分比不一样，需分别计算
                    var colorPercent = level / (grades - 1),
                        widthPercent = (level + 1) / grades;

                    // 根据起始颜色和level计算当前level对应的颜色，根据rgb颜色过渡算法
                    for(var i = 0; i < 3; i++){
                        var value = parseInt(beginColor[i] - (beginColor[i] - endColor[i]) * colorPercent);
                        transColor[i] = value > 16 ? value.toString(16) : ('0' + value.toString(16));
                    }

                    node.one('.strength-bar').css({
                        'width':  totalWidth * widthPercent + 'px',
                        'backgroundColor': '#' + transColor.join('')
                    });

                    // 检测是否input节点位置发生变化，如果发生变化重定位popup
                    var triggerNode = self.get('triggerNode');
                    if(!S.equals(self.curOffset, triggerNode.offset())){
                        self.locatePopup(triggerNode, self.boundingBox);
                    }

                    node.show();
                };

                onchange(level, node);

                // 重设onchange方法
                self.set('onchange', onchange);
            }
        },

        /**
         * 对于popup类型的tip关闭显示
         */
        onblur: {
            value: function(node){
                var self = this;
                if((self.get('renderType') == 'popup') && node){
                    node.hide();
                }
            }
        }

    }});
    return Pwdstrength;
}, {requires:['node', 'base', 'event', './index.css']});

