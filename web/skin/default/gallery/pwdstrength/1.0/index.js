/*
combined files : 

gallery/pwdstrength/1.0/index

*/
/**
 * @fileoverview ����Kissy������ǿ����ʾ���
 * @author ����<tiehang.lth@alibaba-inc.com>
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
        //���ø��๹�캯��
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
         * ����renderTypeѡ���Ӧ��dom��Ⱦ����
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

                        // ֱ�Ӳ���ڵ㵽input�ڵ��
                        triggerNode.after(boundingBox);
                        break;

                    case 'popup':

                        // ���뵽bodyβ��������input�ڵ�λ�ý��ж�λ
                        $(document.body).append(boundingBox);
                        self.locatePopup(triggerNode, boundingBox);
                        break;

                    default:
                        break;

                }

                // ����boundingBox�Ա�change��
                this.boundingBox = boundingBox;
            }
        },

        /**
         * ��λpopupλ��
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

            // ���浱ǰinput�ڵ��offsetֵ������֮��ȷ���Ƿ����¶�λ
            self.curOffset = triggerNode.offset();
        },

        bindEvent: function(){
            var self = this,
                triggerNode = self.get('triggerNode'),
                needRender = self.get('needRender'),
                boundingBox = self.boundingBox;

            // ��Ӧonchange�¼������Զ���
            triggerNode.on('change keypress paste focus textInput input', function(){

                var val = $(this).val();
                self.password = val;

                // ���㵱ǰ����ǿ�ȼ�������Ϊ��ʱ����-1����֮����1+
                var level = (val != EMPTY) ? self.level() : -1;

                // ��������/�Զ���onchange������Ӧǿ�ȱ仯
                var onchange = self.get('onchange');
                S.isFunction(onchange) && onchange.call(self, level, boundingBox);
            });

            // ��Ӧonblur�¼������Զ���
            triggerNode.on('focusout blur', function(){

                // ��������/�Զ���onblur����
                var onblur = self.get('onblur');
                S.isFunction(onblur) && onblur.call(self, boundingBox);
            });

        },

        // ��Ҫ�õ���������ʽ
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
         * ����ǿ�ȼ���
         * @returns {*} ����(0, 1, 2, ...)����(��, ��, ��, ...)
         */
        level : function () {
            var self = this,
                totalScore = 0;

            // ���ȣ�[0, 4]: +5; [5, 7]: +10; [8, ]: +25
            var length = this.size();
            4 >= length ? totalScore += 5 : length > 4 && 8 > length ? totalScore += 10 : length >= 8 && (totalScore += 25);

            // ��Сд��ĸ���: +20; ֻ�д�/Сд��ĸ: +10
            var hasLowerAndUpperLetter = this.hasLowerAndUpperLetter(),
                hasLetter = this.hasLetter();
            hasLowerAndUpperLetter ? totalScore += 20 : hasLetter && (totalScore += 10);

            // ����[3, ]: +20; [1, 2]: +10
            var hasNumber = this.hasNumber();
            hasNumber >= 3 ? totalScore += 20 : hasNumber && (totalScore += 10);

            // ����[2, ]: +25; [1]: +10
            var hasCharacter = this.hasCharacter();
            hasCharacter >= 3 ? totalScore += 25 : hasCharacter && (totalScore += 10);

            // ��Сд��ĸ��� + ���� + �ַ�: +10
            // ��ĸ + ���� + �ַ�: +5
            // ��ĸ�����֡��ַ���3ѡ2: +2
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
                    // ���ص÷ֶ�Ӧ�����������ţ���level
                    totalScore = pos;
                    return false;
                }else if(pos == 0){
                    // ����÷ֵ������ޣ�����-1
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
         * ת����ɫ�ַ�������ɫ����[RED, GREEN, BLUE]
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
         * ָ��ǿ�ȼ������
         * @array �Ӹߵ�������ָ������ǿ�ȼ���ĵ÷��ż�ֵ
         */
        rule: {
            value: [70, 30, 0]
        },

        /**
         * ָ��ǿ����ʾ��Ϣ��html����
         * ����popup���ͣ��Զ���װpopup���
         */
        html: {
            value: '<div class="pwdstrength-popup"><em class="popup-arrow"></em><em class="popup-arrow-padding"></em><div class="popup-content">' +
                '<div class="pwdstrength-wrap">����ǿ�ȣ�' +
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
         * �Ƿ���Ҫ��Ⱦdom�����dom������ǿ����ʾ�ڵ㣬��Ϊfalse����Ϊtrueʱ����ָ��renderType
         */
        needRender: {
            value: true
        },

        /**
         * ָ��չʾ���ͣ�insert/popup ֱ�ӽ����������棺Ƕ��dom/popup
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
         * Ĭ�ϵ�ǿ����ʾ����ʾǿ������ʱ����ɫ
         */
        beginColor: {
            value: '#bd5151'
        },

        /**
         * Ĭ�ϵ�ǿ����ʾ����ʾǿ����ǿʱ����ɫ
         */
        endColor: {
            value: '#1fa542'
        },

        /**
         * Ĭ�ϵ�onchangeʵ�֣�����popup��ʽ
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

                // onchange��������֮ǰ�ı���ֵ���ӿ��´�ִ��Ч��
                var onchange = function(level, node){

                    // ��ɫ�ٷֱȺͳ��ȰٷֱȲ�һ������ֱ����
                    var colorPercent = level / (grades - 1),
                        widthPercent = (level + 1) / grades;

                    // ������ʼ��ɫ��level���㵱ǰlevel��Ӧ����ɫ������rgb��ɫ�����㷨
                    for(var i = 0; i < 3; i++){
                        var value = parseInt(beginColor[i] - (beginColor[i] - endColor[i]) * colorPercent);
                        transColor[i] = value > 16 ? value.toString(16) : ('0' + value.toString(16));
                    }

                    node.one('.strength-bar').css({
                        'width':  totalWidth * widthPercent + 'px',
                        'backgroundColor': '#' + transColor.join('')
                    });

                    // ����Ƿ�input�ڵ�λ�÷����仯����������仯�ض�λpopup
                    var triggerNode = self.get('triggerNode');
                    if(!S.equals(self.curOffset, triggerNode.offset())){
                        self.locatePopup(triggerNode, self.boundingBox);
                    }

                    node.show();
                };

                onchange(level, node);

                // ����onchange����
                self.set('onchange', onchange);
            }
        },

        /**
         * ����popup���͵�tip�ر���ʾ
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

