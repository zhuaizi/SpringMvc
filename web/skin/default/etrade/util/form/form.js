/**
 * ����֤ģ��
 * 
 * @author ������
 * @since 2013-09-02
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/form/form", function (S,rules,DOM,Event,Base,IO,Node,O) {

	var Form = function(config){
		Form.superclass.constructor.call(this,config);
	};
	
	var FORM_EL =[ 'input','select','textarea'];
	var testArr = ['dateMaxTo','dateMinTo','numberMaxTo','numberMinTo'];
	var _mt = {type:'bottom',part:12};
	
	Form.prototype.isSubmit = false;//���Ƿ����ύ��Ԥ������ύ������
	
	S.extend(Form,Base);//�̳л���
	var AL = Node.all;
	var popup =	new O.Popup({
			        
			        triggerType : 'mouse'
			        
			    });
var _tipTplFn = baidu.template('<span role="form-tip-<%=formId%>" class="col-md-<%=part%> control-label tishi" style="text-align:center;"><%=msg%></span>');
	var TIP_HTML = [
	'<div class="z-tip"><div class="ks-popup-content ">',
		'<span class="z-taper"></span>',
		'<span class="z-close">x</span>',
		'<div class="z-wrapper">',
			'<div class="hd">',
			'</div>',
			'<div class="bd">',
			'</div>',
		'</div>',
	'</div></div>'].join('');
	var bid = S.guid('tib');
	var node = S.Node(TIP_HTML);
			node.css({
				'left':'-9999px',
				'top':'-9999px',
				'position':'absolute'
			}).appendTo(S.one('body'));
			node.css('z-index',100);
			node.attr('id',bid);		    
	 popup.set("srcNode", '#'+bid);
	 
	Form.ATTRS = {
		/**
		 * ��������
		 * �õ���ǰ��ѡ����(�����idƥ��Ψһ)
		 */
		srcNode : {value : ""},//selector
		/**
		 * ���ύ��ַ
		 */
		url		: {value: ""},
		/**
		 * ��������
		 */
		baseParam:{value:{}},
		/**
		 * ���������غ�Ļص�����
		 */
		callback : {value:function(rsText){}},
		/**
		 * ��html�ĵ��ж�����֤�������������
		 */
		rulesName : {value : "data-rules"},
		/**
		 * ��html�ĵ��ж�����֤��Ϣģ�����������
		 */
		msgName : {value : "data-msg"},
		/**
		 * ��html�ĵ��ж�����ʾ��Ϣ��ʾλ�õ���������
		 * �����Ե�typeȡֵΪ��right/bottom/tip/tips��Ĭ��Ϊtip
		 * �����Ե�partȡֵ��ΧΪ1-12���ο�bootstarp�ĸ�դ����
		 * �磺{type:right,part:2}����ʾ��ʾ���ұߣ���ʾվ2����λ�Ŀ�� 
		 */
		msgTypeName	: {value: "msg-type"},
		/**
		 * ��ǰ������ʲô�¼�����������֤��
		 */
		eventName : {value: "blur"},		
		/**
		 * �����ı��ֶ�������
		 */
		plainFormFieldArr : {value : ['input','select','textarea']},
		/**
		 * ������֤֧�ֵĸ�Ԫ������(�ڸ�Ԫ���������֤����)
		 */
		gruopFieldEl : {value : ['fieldset','div']}
	};
	
	
	
	var _addTip = function(style,target){	
		var _parentNode = DOM.parent(target);
		var _pn = DOM.parent(target,".form-group");
		
			if(_pn){
				
				DOM.addClass(_pn,'has-error');
				_pn = DOM.parent(target,".form-group");

			}else{
				_pn = DOM.parent(target,".input-group");
				if(_pn){
				DOM.addClass(DOM.parent(_pn),'has-error');
				}else{
					DOM.addClass(_pn,'has-error');
				}
				
			}
		
		
		
		
		if('right' == style.type){
			DOM.append(DOM.create(_tipTplFn(style)),_parentNode);
		}else if('bottom' == style.type){
			DOM.insertAfter(DOM.create(_tipTplFn(style)),_parentNode);
		}else{
			_ctip(_pn,style,target);
			return;
		}		
	};

	var _ctip = function(pn,style,target){
		if(DOM.hasAttr(pn,'tips')){
			var uid = DOM.attr(pn,'id');
			if(uid != null){
				_btip(uid,pn,style);
			}
			return;
		}
			var uid = S.guid('tip');
			DOM.attr(pn,'id',uid);
			DOM.attr(pn,'tips','t');
			
			_btip(uid,pn,style);
			
	}
	
	var _btip =function(uid,pn,style){
		AL('#'+uid).delegate("mouseenter",function (e) {
			 	if(DOM.hasClass(pn,'has-error')){
			        var ui = DOM.attr(pn,'id');
			       
			        AL('#'+bid).one('.bd').html(style.msg);
			       
			        popup.set('align', {
			            node:'#'+ui,
			            points : ['bl', 'tl'],
					    offset : [0, 0]
			        });
			        popup.render();
			        popup.show();
				 }
		    });
		
		     AL('#'+uid).delegate("mouseleave", function (e) {
		        popup.hide();
		    });
	}
	
	var _removeTip = function(style,target){
		var _parentNode = DOM.parent(target);
		var _pn = DOM.parent(target,".form-group");
		if(_pn){
			
			DOM.removeClass(DOM.parent(target,".form-group"),'has-error');
		}else{
			_pn = DOM.parent(target,".input-group");
			if(_pn){
				DOM.removeClass(DOM.parent(_pn),'has-error');
				}else{
					DOM.removeClass(_pn,'has-error');
				}
			
		}
		
		
		if('right' == style.type){
			DOM.remove(DOM.last(_parentNode,"[role='form-tip-"+style.formId+"']"));
		}else if('bottom' == style.type){
			DOM.remove(DOM.next(_parentNode,"[role='form-tip-"+style.formId+"']"));
		}else{
			var uid = DOM.attr(_pn,'id');
			if(uid != null){
				AL('#'+uid).undelegate("mouseenter mouseleave");
			}
			 
		}	
	};
	
	/**
	 * @param {HTMLElement} field ��ǰԪ�ر�����_plainFormFieldArr�ж���Ļ������ֶ�֮һ(�����ڸ�Ԫ������Ӽ���)
	 * @param {HTMLElement} groupfield ������֤�ĸ�Ԫ�أ�������ڴ�Ԫ���ϡ�������Ƿ�����֤���ò����͵�һ���������
	 * @param {Array(HTMLElement)|HTMLElement} group ��Ԫ�أ�Ҫ������֤������Ԫ�ص����顣������Ƿ�����֤���ò����͵�һ���������
	 *
	 * @return msg ��ʽ�������Ϣ
	 */
	var _valid = function(field,groupfield,group,_self){
		try{
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//����
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*��ʾ��ʾ���*/
		var _value = DOM.val(field);//�ֶ�ֵ		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//��ʾ��Ϣģ��	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//������֤�������
			//�����value�ǻ�׼ֵ,_value��������ֵ
			var msg = rules.valid(name,_value,_data_rule[name],_msg,group);

			_removeTip(_tipStyle,groupfield);
			if(msg!=undefined){
				_tipStyle.msg = msg;				
				_addTip(_tipStyle,groupfield);								
				return msg;
			}else{
				
			}			
		};
		}catch(e){
			//alert(e);
		}
	};
	
	var _valid_base = function(field,groupfield,group,_self,arrys){
		try{
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//����
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*��ʾ��ʾ���*/
		var _value = DOM.val(field);//�ֶ�ֵ		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//��ʾ��Ϣģ��	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//������֤�������
			if(S.inArray(name,testArr)){
				arrys.push(field);
				continue;
			}
			//�����value�ǻ�׼ֵ,_value��������ֵ
			var msg = rules.valid(name,_value,_data_rule[name],_msg,group);
			_removeTip(_tipStyle,groupfield);
			if(msg!=undefined){
				_tipStyle.msg = msg;				
				_addTip(_tipStyle,groupfield);								
				return msg;
			}else{
				
				
			}			
		};
		}catch(e){
			//alert(e);
		}
	};
	
	var _valid_group = function(field,groupfield,group,_self){
		try{
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//����
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*��ʾ��ʾ���*/
		var _value = DOM.val(field);//�ֶ�ֵ		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//��ʾ��Ϣģ��	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//������֤�������
			if(!S.inArray(name,testArr)){
				continue;
			}
			//�����value�ǻ�׼ֵ,_value��������ֵ
			var msg = rules.valid(name,_value,_data_rule[name],_msg,group);
			_removeTip(_tipStyle,groupfield);
			if(msg!=undefined){
				_tipStyle.msg = msg;				
				_addTip(_tipStyle,groupfield);								
				return msg;
			}else{
				
				
			}			
		};
		}catch(e){
			//alert(e);
		}
	};
	
  /**
   * �������(rules.js��Ҳ�иú���������ʱע��)
   * 
   * @param {String|Object} baseValue
   * 	'#minDateId'��{ref:'#minDateId',allowEqual:true}��{ref:['#minDateId','#minDateId1'],allowEqual:true}
   * @return {Object} ��ʽΪ��{selectors:['#minDateId','#minDateId1'],allowEqual:true}
   * 
   */
  function _getRangeParam(baseValue){
  		var rs = {allowEqual : false,selectors : [],format:'yyyy-MM-dd'};
    	if(S.isString(baseValue)){//��ʾֻ��ѡ����
    		rs.selectors.push(baseValue);
    	}else if(S.isNumber(baseValue)){//ֻ������
    		rs.selectors.push(baseValue);
    	}else if(S.isString(baseValue.ref)){//ֱ����ѡ����
    		rs.selectors.push(baseValue.ref);
    		rs.allowEqual = baseValue.allowEqual?baseValue.allowEqual:false;
    	}else if(S.isNumber(baseValue.ref)){//ֱ��������
    		rs.selectors.push(baseValue.ref);
    		rs.allowEqual = baseValue.allowEqual?baseValue.allowEqual:false;
    	}else{
    		for(var i = 0; i < baseValue.ref.length; i++){//ѡ��������
    			rs.selectors.push(baseValue.ref[i]);
    		}
    		if(baseValue.allowEqual){
    			rs.allowEqual = baseValue.allowEqual;
    		}
    		if(baseValue.format){
    			rs.format = baseValue.format;
    		}    		
    	}
    	return rs;
  };
  
    /**
	 * Ϊ����ֶαȽϵ��ֶ����_eventName�¼�����
	 * 	��ҪΪ����������ֶβ�С��ǰ���ֶεıȽ�ʱ(dateMaxTo��numberMaxTo)������������ֶΣ�������ǰ���ֶ�ʱ��û����֤
	 * 
	 * @param {HTMLElement} field ��ǰ�����֤������ֶ�
	 * @param {Object} rule ��ǰ��֤����
	 */
	var _reField = function(field,rule,_self,groupfield,group){   
		
		for(var name in rule){
			if(S.inArray(name,testArr)){
				var param = _getRangeParam(rule[name]);
				for(var i in param.selectors){
					
					Event.on(param.selectors[i],_self.get('eventName'),function(e){
						_valid(field,groupfield,group,_self);//��֤
						//Event.fire(field,_self.get('eventName'));
		    		});
				}
			}	
		}    	
	};
	
	/**
	 * Ϊ��ǰԪ�������֤�¼�����
	 * @param {HTMLElement} field ��ǰԪ�ر�����_plainFormFieldArr�ж���Ļ������ֶ�֮һ(�����ڸ�Ԫ������Ӽ���)
	 * @param {HTMLElement} groupfield ������֤�ĸ�Ԫ�أ�������ڴ�Ԫ���ϡ�������Ƿ�����֤���ò����͵�һ���������
	 * @param {Array(HTMLElement)|HTMLElement} group ��Ԫ�أ�Ҫ������֤������Ԫ�ص����顣������Ƿ�����֤���ò����͵�һ���������
	 */
	function _addRuleEvent(field,groupfield,group,_self){
		
		Event.on(field,_self.get('eventName'),function(e){
			_valid(field,groupfield,group,_self);//��֤
		});	
		_reField(field,eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")"),_self,groupfield,group);
		
	};
	
	Form.prototype.render = function(){
		/**
		 * ��ǰ������
		 */
		var _self = this;
		var _srcNode = S.trim(_self.get('srcNode'));
		/**
		 * ��ȡ��ǰ����У�����֤���������Ԫ��
		 * 
		 */
		var fields = DOM.query("form"+_srcNode+" ["+_self.get('rulesName')+"]");
		
		S.each(fields,function(field){
			var fieldName = DOM.nodeName(field);
			if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//�����ֶ���֤
				_addRuleEvent(field,field,field,_self);
			}else if(S.inArray(fieldName,_self.get('gruopFieldEl'))){//������֤
				//��ȡ��ǰ����������ֶ�
				var group = DOM.children(field,_self.get('plainFormFieldArr').join(","));
				S.each(group,function(sub){
					_addRuleEvent(sub,field,group,_self);
				});			
			}else{
				alert("Ŀǰ����֧��"+fieldName+"��ǩ�����֤����֤��");
			}
		});
	};
	
	/**
	 * ��֤����ֵ�Ƿ���ϱ���֤
	 * 
	 * @return {Boolean} undefinedͨ��������ͨ������ͨ���᷵����ʾ��Ϣ
	 */
	Form.prototype.isValid = function(message){
		var _self = this;
		if(!message)message='����������';
		var _srcNode = S.trim(_self.get('srcNode'));
		/**
		 * ��ȡ��ǰ����У�����֤���������Ԫ��
		 * 
		 */
		var fields = DOM.query("form"+_srcNode+" ["+_self.get('rulesName')+"]");
		var msg = undefined; 
		var fieldg = new Array();
		S.each(fields,function(field){
			var fieldName = DOM.nodeName(field);			
			if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//�����ֶ���֤
				var mmssgg = undefined;
				if((mmssgg = _valid_base(field,field,field,_self,fieldg)) != undefined && msg == undefined){
					msg = mmssgg;
				}
			}else if(S.inArray(fieldName,_self.get('gruopFieldEl'))){//������֤
				//��ȡ��ǰ����������ֶ�
				var group = DOM.children(field,_self.get('plainFormFieldArr').join(","));
				S.each(group,function(sub){
					var mmssgg = undefined;
					if((mmssgg = _valid_base(sub,field,group,_self,fieldg)) != undefined && msg == undefined){
						msg = mmssgg;
					}
				});			
			}else{
				alert("Ŀǰ����֧��"+fieldName+"��ǩ�����֤����֤��");
			}
			
		});
		
		if(msg){
			
			return msg;
		}
		if(fieldg.length > 0){
			fieldg = S.unique(fieldg,true);
			
			S.each(fieldg,function(field){
				var fieldName = DOM.nodeName(field);			
				if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//�����ֶ���֤
					var mmssgg = undefined;
					if((mmssgg = _valid_group(field,field,field,_self)) != undefined && msg == undefined){
						msg = mmssgg;
					}
				}
				
			});
		}
		
		
		return msg?msg:undefined;
	};
	/**
	 * �ύ����
	 */
	Form.prototype.submit = function(){
		if(Form.prototype.isSubmit){
			return;
		}
		Form.prototype.isSubmit = true;
		var my = this;
		IO({
            url: this.get('url'),
            type: 'post',
            dataType: 'json',
            form: this.get('srcNode'),
            data: this.get('baseParam'),
            success: function(rsText){
            	Form.prototype.isSubmit = false;
            	my.get('callback').call(my.get('callback'),rsText);
            },
            error : function(){
            	Form.prototype.isSubmit = false;
            },
            serializeArray:false
        });
				
	};
	
	
	Form.prototype.setFormValue =function(data){
		var _self = this;
		var _srcNode = S.trim(_self.get('srcNode'));
		S.each(FORM_EL,function(el){ 
	  	 	 var field = DOM.query(_srcNode+' '+el);
	  	 	 S.each(field,function(fld){
	  	 	 	
	  	 	 	var nn = fld.nodeName.toLowerCase();;
	  	 	 	var type = fld.getAttribute('type');
	  	 	 	var name = fld.getAttribute('name');
	  	 	 	if(type){type = type.toLowerCase();}
				if(name){name = name.toLowerCase();}
				var dt = data[name];
				if(dt != null){
					if(type == 'text' || type == 'hidden' ||  type == 'file'||  type == 'passwd'){
		  	 	 		DOM.val(fld,dt);
		  	 	 	}else if(type == 'radio' || type == 'checkbox' ){
		  	 	 		try{
			  	 	 		if(fld.value == dt){
			  	 	 			fld.setAttribute('checked',true);
			  	 	 		}
		  	 	 		}catch(e){
		  	 	 			
		  	 	 		}
		  	 	 	}else if(nn == 'select'){//������ֵΪ_id�����ݡ��ݲ�����������֧���ֶ��������Ŀ��
		  	 	 		dt = data[name+'_id'];
		  	 	 		if(dt != null){DOM.val('select[name="'+name+'"]',dt);}
		  	 	 	}else{
		  	 	 		DOM.val(fld,dt);
		  	 	 	}
				}
	  	 	 });
		});
  	 }

	return Form;  
},{
	requires: [KISSY.myPackageName+"/util/form/rules","dom","event","base",'io','node','overlay',KISSY.myPackageName+'/css/mode/tip.css']
});
