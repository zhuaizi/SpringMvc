/**
 * 表单验证模块
 * 
 * @author 周忠友
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
	
	Form.prototype.isSubmit = false;//表单是否已提交，预防多次提交表单数据
	
	S.extend(Form,Base);//继承基类
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
		 * 必须配置
		 * 得到当前表单选择器(最好用id匹配唯一)
		 */
		srcNode : {value : ""},//selector
		/**
		 * 表单提交地址
		 */
		url		: {value: ""},
		/**
		 * 基本参数
		 */
		baseParam:{value:{}},
		/**
		 * 服务器返回后的回调函数
		 */
		callback : {value:function(rsText){}},
		/**
		 * 在html文档中定义验证规则的属性名称
		 */
		rulesName : {value : "data-rules"},
		/**
		 * 在html文档中定义验证消息模板的属性名称
		 */
		msgName : {value : "data-msg"},
		/**
		 * 在html文档中定义提示信息显示位置的属性名称
		 * 该属性的type取值为：right/bottom/tip/tips，默认为tip
		 * 该属性的part取值范围为1-12，参考bootstarp的格栅布局
		 * 如：{type:right,part:2}，提示显示在右边，提示站2个单位的宽度 
		 */
		msgTypeName	: {value: "msg-type"},
		/**
		 * 当前表单域用什么事件监听触发验证器
		 */
		eventName : {value: "blur"},		
		/**
		 * 基本的表单字段域数组
		 */
		plainFormFieldArr : {value : ['input','select','textarea']},
		/**
		 * 分组验证支持的根元素数组(在根元素上添加验证规则)
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
	 * @param {HTMLElement} field 当前元素必须是_plainFormFieldArr中定义的基本表单字段之一(我们在该元素上添加监听)
	 * @param {HTMLElement} groupfield 分组验证的根元素，规则加在此元素上。如果不是分组验证，该参数和第一个参数相等
	 * @param {Array(HTMLElement)|HTMLElement} group 组元素，要分组验证的所有元素的数组。如果不是分组验证，该参数和第一个参数相等
	 *
	 * @return msg 格式化后的消息
	 */
	var _valid = function(field,groupfield,group,_self){
		try{
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//规则
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*提示显示风格*/
		var _value = DOM.val(field);//字段值		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//提示消息模板	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//遍历验证规则对象
			//这里的value是基准值,_value才是输入值
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
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//规则
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*提示显示风格*/
		var _value = DOM.val(field);//字段值		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//提示消息模板	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//遍历验证规则对象
			if(S.inArray(name,testArr)){
				arrys.push(field);
				continue;
			}
			//这里的value是基准值,_value才是输入值
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
		var _data_rule = eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")");//规则
		var _tipStyle = eval('('+DOM.attr(groupfield,_self.get('msgTypeName'))+")");/*提示显示风格*/
		var _value = DOM.val(field);//字段值		
		var _msg = eval("("+DOM.attr(groupfield,_self.get('msgName'))+")");//提示消息模板	
		if(_tipStyle == null){
			_tipStyle=_mt;
		}
		_tipStyle.formId = _self.get("srcNode");
		_tipStyle.field = field;
		
		for(var name in _data_rule){//遍历验证规则对象
			if(!S.inArray(name,testArr)){
				continue;
			}
			//这里的value是基准值,_value才是输入值
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
   * 重组参数(rules.js中也有该函数，更新时注意)
   * 
   * @param {String|Object} baseValue
   * 	'#minDateId'、{ref:'#minDateId',allowEqual:true}、{ref:['#minDateId','#minDateId1'],allowEqual:true}
   * @return {Object} 形式为：{selectors:['#minDateId','#minDateId1'],allowEqual:true}
   * 
   */
  function _getRangeParam(baseValue){
  		var rs = {allowEqual : false,selectors : [],format:'yyyy-MM-dd'};
    	if(S.isString(baseValue)){//表示只有选择器
    		rs.selectors.push(baseValue);
    	}else if(S.isNumber(baseValue)){//只有数字
    		rs.selectors.push(baseValue);
    	}else if(S.isString(baseValue.ref)){//直接是选择器
    		rs.selectors.push(baseValue.ref);
    		rs.allowEqual = baseValue.allowEqual?baseValue.allowEqual:false;
    	}else if(S.isNumber(baseValue.ref)){//直接是数字
    		rs.selectors.push(baseValue.ref);
    		rs.allowEqual = baseValue.allowEqual?baseValue.allowEqual:false;
    	}else{
    		for(var i = 0; i < baseValue.ref.length; i++){//选择器数组
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
	 * 为与该字段比较的字段添加_eventName事件监听
	 * 	主要为解决：后面字段不小于前面字段的比较时(dateMaxTo、numberMaxTo)，先输入后面字段，再输入前面字段时，没有验证
	 * 
	 * @param {HTMLElement} field 当前添加验证规则的字段
	 * @param {Object} rule 当前验证规则
	 */
	var _reField = function(field,rule,_self,groupfield,group){   
		
		for(var name in rule){
			if(S.inArray(name,testArr)){
				var param = _getRangeParam(rule[name]);
				for(var i in param.selectors){
					
					Event.on(param.selectors[i],_self.get('eventName'),function(e){
						_valid(field,groupfield,group,_self);//验证
						//Event.fire(field,_self.get('eventName'));
		    		});
				}
			}	
		}    	
	};
	
	/**
	 * 为当前元素添加验证事件监听
	 * @param {HTMLElement} field 当前元素必须是_plainFormFieldArr中定义的基本表单字段之一(我们在该元素上添加监听)
	 * @param {HTMLElement} groupfield 分组验证的根元素，规则加在此元素上。如果不是分组验证，该参数和第一个参数相等
	 * @param {Array(HTMLElement)|HTMLElement} group 组元素，要分组验证的所有元素的数组。如果不是分组验证，该参数和第一个参数相等
	 */
	function _addRuleEvent(field,groupfield,group,_self){
		
		Event.on(field,_self.get('eventName'),function(e){
			_valid(field,groupfield,group,_self);//验证
		});	
		_reField(field,eval('('+DOM.attr(groupfield,_self.get('rulesName'))+")"),_self,groupfield,group);
		
	};
	
	Form.prototype.render = function(){
		/**
		 * 当前表单对象
		 */
		var _self = this;
		var _srcNode = S.trim(_self.get('srcNode'));
		/**
		 * 获取当前表表单中，有验证规则的所有元素
		 * 
		 */
		var fields = DOM.query("form"+_srcNode+" ["+_self.get('rulesName')+"]");
		
		S.each(fields,function(field){
			var fieldName = DOM.nodeName(field);
			if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//基本字段验证
				_addRuleEvent(field,field,field,_self);
			}else if(S.inArray(fieldName,_self.get('gruopFieldEl'))){//分组验证
				//获取当前分组的所有字段
				var group = DOM.children(field,_self.get('plainFormFieldArr').join(","));
				S.each(group,function(sub){
					_addRuleEvent(sub,field,group,_self);
				});			
			}else{
				alert("目前还不支持"+fieldName+"标签添加验证器验证！");
			}
		});
	};
	
	/**
	 * 验证输入值是否符合表单验证
	 * 
	 * @return {Boolean} undefined通过、否则不通过，不通过会返回提示信息
	 */
	Form.prototype.isValid = function(message){
		var _self = this;
		if(!message)message='表单数据有误！';
		var _srcNode = S.trim(_self.get('srcNode'));
		/**
		 * 获取当前表表单中，有验证规则的所有元素
		 * 
		 */
		var fields = DOM.query("form"+_srcNode+" ["+_self.get('rulesName')+"]");
		var msg = undefined; 
		var fieldg = new Array();
		S.each(fields,function(field){
			var fieldName = DOM.nodeName(field);			
			if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//基本字段验证
				var mmssgg = undefined;
				if((mmssgg = _valid_base(field,field,field,_self,fieldg)) != undefined && msg == undefined){
					msg = mmssgg;
				}
			}else if(S.inArray(fieldName,_self.get('gruopFieldEl'))){//分组验证
				//获取当前分组的所有字段
				var group = DOM.children(field,_self.get('plainFormFieldArr').join(","));
				S.each(group,function(sub){
					var mmssgg = undefined;
					if((mmssgg = _valid_base(sub,field,group,_self,fieldg)) != undefined && msg == undefined){
						msg = mmssgg;
					}
				});			
			}else{
				alert("目前还不支持"+fieldName+"标签添加验证器验证！");
			}
			
		});
		
		if(msg){
			
			return msg;
		}
		if(fieldg.length > 0){
			fieldg = S.unique(fieldg,true);
			
			S.each(fieldg,function(field){
				var fieldName = DOM.nodeName(field);			
				if(S.inArray(fieldName,_self.get('plainFormFieldArr'))){//基本字段验证
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
	 * 提交参数
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
		  	 	 	}else if(nn == 'select'){//设置其值为_id的数据。暂不考虑下拉框支持手动输入的项目。
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
