/**
 * 默认验证规则管理模块
 * 
 * @author 周忠友
 * @since 2013-09-02
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/form/rules", function (S,Base,DOM,Rule,DateFormat,GregorianCalendar) {
	
	function toDate(value,format){
		return new DateFormat(format).parse(value);
	};
	
	function isDateString(value,format){
		return toDate(value,format) != undefined;
	};
	
	var ruleMap = {
	
	};
	
  /**
   * @class mine/rules
   * @singleton
   * 表单验证的验证规则管理器
   */
	var rules = {
		/**
		 * 添加验证规则
	     * @param {Object|mine/rule} rule 验证规则配置项或者验证规则对象
		 */
		add : function(rule){
	      var name;
	      if(S.isPlainObject(rule)){
	        name = rule.name;
	        ruleMap[name] = new Rule(rule);        
	      }else if(rule.get){
	        name = rule.get('name'); 
	        ruleMap[name] = rule;
	      }
	      return ruleMap[name];
	    },
	    /**
	     * 删除验证规则
	     * @param  {String} name 规则名称
	     */
	    remove : function(name){
	      delete ruleMap[name];
	    },
	    /**
	     * 获取验证规则
	     * @param  {String} name 规则名称
	     * @return {Rule}  验证规则
	     */
	    get : function(name){
	      return ruleMap[name];
	    },
	    /**
	     * 验证指定的规则
	     * @param  {String} name 规则类型
	     * @param  {*} value 验证值
	     * @param  {*} [baseValue] 用于验证的基础值
	     * @param  {String} [msg] 显示错误的模板
	     * @param  {HTMLElement|Array(HTMLElement)} [control] 发生验证的控件，或分组验证的控件数组
	     * @return {String} 通过验证返回 null,否则返回错误信息
	     */
	    valid : function(name,value,baseValue,msg,control){
	      var rule = rules.get(name);
	      if(rule){
	        return rule.valid(value,baseValue,msg,control);
	      }
	      return null;
	    },
	    /**
	     * 验证指定的规则
	     * @param  {String} name 规则类型
	     * @param  {*} values 验证值
	     * @param  {*} [baseValue] 用于验证的基础值
	     * @param  {HTMLElement|Array(HTMLElement)} [control] 发生验证的控件，或分组验证的控件数组
	     * @return {Boolean} 是否通过验证
	     */
	    isValid : function(name,value,baseValue,control){
	      return rules.valid(name,value,baseValue,control) == null;
	    }
	};//rules定义
	
	
	/*************************添加默认规则-->************************************************/	
	
	/**
   * 非空验证,会对值去除空格
   * <ol>
   *  <li>name: required</li>
   *  <li>msg: 不能为空！</li>
   *  <li>required: boolean 类型</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'required',
    msg : '不能为空！',
    validator : function(value,required,formatedMsg){
      if(required !== false && /^\s*$/.test(value)){
        return formatedMsg;
      }
    }
  });
  /**
   * 整除一万验证
   * <ol>
   *  <li>name: isZcwan</li>
   *  <li>msg: 输入值必须整除10000</li>
   *  <li>isZcwan:  boolean 类型</li>
   * </ol>
   * @type {Rule}
   */
  var zwReg=/^\+?[1-9][0-9]*$/;
  rules.add({
    name : 'isZcwan',
    msg : '融资金额必须是一万的整数倍！',
    validator : function(value,isZcwan,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== ''){
    	  return zwReg.test(Number(value)/Number(10000)) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * 手机号码验证
   * <ol>
   *  <li>name: isMobile</li>
   *  <li>msg: 不是有效的手机号码！</li>
   * </ol>
   * @type {Rule}
   */
  var mobileReg = /^1[3|4|5|8|7][0-9]\d{8}$/;
  rules.add({
    name : 'isMobile',
    msg : '不是有效的手机号码！',
    validator : function(value,isMobile,formatedMsg){
      value = S.trim(value);
      if(value){
        return mobileReg.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * 电话号码验证
   * <ol>
   *  <li>name: isPhone</li>
   *  <li>msg: 不是有效的电话号码！</li>
   * </ol>
   * @type {Rule}
   */
  var phoneReg = /^(\d{3,4}\-?){0,1}\d{7,8}$/;
  rules.add({
    name : 'isPhone',
    msg : '不是有效的电话号码！',
    validator : function(value,isPhone,formatedMsg){
      value = S.trim(value);
      if(value){
        return (phoneReg.test(value)||mobileReg.test(value)) ? undefined : formatedMsg;
      }
    }
  });
  /**
   * 网址验证
   * <ol>
   *  <li>name: isPhone</li>
   *  <li>msg: 不是有效的网址！</li>
   * </ol>
   * @type {Rule}
   */
  var httpUrlReg = /^((https?:\/\/)?([\-\u4e00-\u9fa5_a-zA-Z0-9]+\.)+([\u4e00-\u9fa5_a-zA-Z0-9]+){2,3}(\/[%\-\u4e00-\u9fa5_a-zA-Z0-9]+(\.([A-Za-z\u4e00-\u9fa5]){2,4})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.([A-Za-z\u4e00-\u9fa5]){2,4})?)*\/?)/i;
  rules.add({
    name : 'isUrl',
    msg : '不是有效的网址！',
    validator : function(value,isUrl,formatedMsg){
      value = S.trim(value);
      if(value){
        return httpUrlReg.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  
  
  
  
  
  /**
   * 相等验证
   * <ol>
   *  <li>name: equalTo</li>
   *  <li>msg: 两次输入不一致！</li>
   *  <li>equalTo: 一个字符串，id（#id_name)</li>
   * </ol>
   *         {
   *           equalTo : '#password'
   *         }

   * @type {Rule}
   */
  rules.add({
    name : 'equalTo',
    msg : '两次输入不一致！',
    validator : function(value,equalTo,formatedMsg){
      equalToValue = DOM.val(equalTo);
      return value === equalToValue ? undefined : formatedMsg;
    }
  });
  
  /**
   * 不小于验证
   * <ol>
   *  <li>name: min</li>
   *  <li>msg: 输入值不能小于{0}！</li>
   *  <li>min: 数字，字符串</li>
   * </ol>
   *         {
   *           min : 5
   *         }
   *         //字符串
   * @type {Rule}
   */
  rules.add({
    name : 'min',
    msg : '输入值不能小于{0}！',
    validator : function(value,min,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== '' && Number(value) < Number(min)){
        return formatedMsg;
      }
    }
  });
  
  /**
   * 不大于验证,用于数值比较
   * <ol>
   *  <li>name: max</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>max: 数字、字符串</li>
   * </ol>
   *         {
   *           max : 100
   *         }
   *         //字符串
   *         {
   *           max : '100'
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'max',
    msg : '输入值不能大于{0}！',
    validator : function(value,max,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== '' && Number(value) > Number(max)){
        return formatedMsg;
      }
    }
  });
  
  /**
   * 输入长度验证，必须是指定的长度
   * <ol>
   *  <li>name: length</li>
   *  <li>msg: 输入值长度为{0}！</li>
   *  <li>length: 数字</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'length',
    msg : '输入值长度必须为{0}！',
    validator : function(value,len,formatedMsg){
      if(value != null){
        value = S.trim(value.toString());
        if(len != value.getBytes()){
          return formatedMsg;
        }
      }
    }
  });
  
  /**
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: minlength</li>
   *  <li>msg: 输入值长度不小于{0}！</li>
   *  <li>minlength: 数字</li>
   * </ol>
   *         {
   *           minlength : 5
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'minLength',
    msg : '输入值长度不能小于{0}！',
    validator : function(value,min,formatedMsg){
      if(value != null){
        value = S.trim(value.toString());
        var len = value.getBytes();
        if(len < min){
          return formatedMsg;
        }
      }
    }
  });
  
  /**
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: maxlength</li>
   *  <li>msg: 输入值长度不大于{0}！</li>
   *  <li>maxlength: 数字</li>
   * </ol>
   *         {
   *           maxlength : 10
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'maxLength',
    msg : '输入值长度不能大于{0}！',
    validator : function(value,max,formatedMsg){
      if(value){
        value = S.trim(value.toString());
        var len = value.getBytes();
        if(len > max){
          return formatedMsg;
        }
      }
    }
  });
  
  /**
   * 正则表达式验证,如果正则表达式为空，则不进行校验
   * <ol>
   *  <li>name: regexp</li>
   *  <li>msg: 输入值不符合{0}！</li>
   *  <li>regexp: 正则表达式</li>
   * </ol> 
   * @type {Rule}
   */
  rules.add({
    name : 'regexp',
    msg : '输入值不符合{0}！',
    validator : function(value,regexp,formatedMsg){
      if(value){
        return regexp.test(value) ? undefined : formatedMsg;
      }
    }
  });
	
 
  /**
   * 邮箱验证,会对值去除空格，无数据不进行校验
   * <ol>
   *  <li>name: email</li>
   *  <li>msg: 不是有效的邮箱地址！</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'email',
    msg : '不是有效的邮箱地址！',
    validator : function(value,baseValue,formatedMsg){
      value = S.trim(value);
      if(value){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * 日期验证，会对值去除空格，无数据不进行校验
   * <ol>
   *  <li>name: date</li>
   *  <li>msg: 不是有效的日期！</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'date',
    msg : '不是有效的日期格式！',
    validator : function(value,baseValue,formatedMsg,field){
      var dateFormat = 'yyyy-MM-dd';
      if(S.isString(baseValue)){
      	dateFormat = baseValue;      
      }
      value = S.trim(value);
      if(S.isDate(value)){
        return;
      }      
      if(value){
    	  if(isDateString(value,dateFormat)){
    		var formatD =  toDate(value,dateFormat);
    	    DOM.val(field,new DateFormat(dateFormat).format(formatD));
    	    return undefined;
    	  }else{
    		  return formatedMsg;
    	  }
      }
    }
  });
  
  /**
   * 不小于验证
   * <ol>
   *  <li>name: minDate</li>
   *  <li>msg: 输入日期不能小于{0}！</li>
   *  <li>minDate: 日期，字符串</li>
   * </ol>
   *         {
   *           minDate : '2001-01-01';
   *         }
   *         //字符串
   * @type {Rule}
   */
  rules.add({
    name : 'minDate',
    msg : '输入日期不能小于{0}！',
    validator : function(value,minDate,formatedMsg){
      var dateObj = {date:'',format:'yyyy-MM-dd'};
      if(S.isString(minDate)){
      	dateObj.date = minDate;  
      }else if(S.isPlainObject(minDate)){
      	dateObj = minDate;
      }
      
      if(dateObj.date == 'new Date()'){
      	dateObj.date = new DateFormat(dateObj.format).format(new Date());
      }
      
      value = S.trim(value);
      if(value){
        var date = toDate(value,dateObj.format);
        if(date && date.getTime() < toDate(dateObj.date,dateObj.format).getTime()){
           return formatedMsg;
        }
      }
    }
  });
  
  /**
   * 不小于验证,用于数值比较
   * <ol>
   *  <li>name: maxDate</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>maxDate: 日期、字符串</li>
   * </ol>
   *         {
   *           maxDate : '2001-01-01';
   *         }
   *         //或日期
   *         {
   *           maxDate : new Date('2001-01-01');
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'maxDate',
    msg : '输入日期不能大于{0}！',
    validator : function(value,maxDate,formatedMsg){
      var dateObj = {date:'',format:'yyyy-MM-dd'};
      if(S.isString(maxDate)){
      	dateObj.date = maxDate;  
      }else if(S.isPlainObject(maxDate)){
      	dateObj = maxDate;
      }
      
      if(dateObj.date == 'new Date()'){
      	dateObj.date = new DateFormat(dateObj.format).format(new Date());
      }
      
      value = S.trim(value);
      if(value){
        var date = toDate(value,dateObj.format);
        if(date && date.getTime() > toDate(dateObj.date,dateObj.format).getTime()){
           return formatedMsg;
        }
      }
    }
  });
  
  /**
   * 数字验证，会对值去除空格，无数据不进行校验
   * 允许千分符，例如： 12,000,000的格式
   * <ol>
   *  <li>name: number</li>
   *  <li>msg: 不是有效的数字！</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'number',
    msg : '不是有效的数字！',
    validator : function(value,baseValue,formatedMsg,field){
      
      value = value.replace(/\,/g,'').replace(/\s/g,'');
      //四舍五入，保留规则定义的小数位数
      if(S.isNumber(baseValue)&&!isNaN(value)&&!isEmpty(value)){
      		value = Number(value).toFixed(baseValue);
      		DOM.val(field,value);
      }
      if(S.isNumber(value)){
        return;
      }
      
      return !isNaN(value) ? undefined : formatedMsg;
    }
  });
  
  /**
   * 验证是否允许舒服负数
   * <ol>
   *  <li>name: allowNegative </li>
   *  <li>msg: 不是有效的数字！</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'allowNegative',
    msg : '不能输入负数！',
    validator : function(value,baseValue,formatedMsg,field){
      
      if(!baseValue){
    	  if(Number(value)<0)
    		  return formatedMsg;
      }
      return ;
    }
  });
  
  
  /**************-->分组验证********************/
  
   /**
    * 验证后面的值是否小于前面的值
    * 
    * @param {boolean|Object} baseValue 配置是否允许相等true、false或{equals:true}、{equals:false}
    * @param {Date|Number} curVal 后面的值
    * @param {Date|Number} prevVal 前面的值
    * 
    * @return 前面<后面(或者前面<=后面，如果配置了允许相等)
    */
  function testRange (baseValue,curVal,prevVal) {
    var allowEqual = baseValue && (baseValue.equals !== false);

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  
  /**
   * 判断值是否为空字符串''或null
   */
  function isEmpty(value){
    return value == '' || value == null;
  }
  
  /**
   * 重组参数(form.js中也有该函数，更新时注意)
   * 
   * @param {String|Object} baseValue
   * 	'#minDateId'、{ref:'#minDateId',allowEqual:true}、{ref:['#minDateId','#minDateId1'],allowEqual:true}
   * @return {Object} 形式为：{selectors:['#minDateId','#minDateId1'],allowEqual:true}
   * 
   */
  function getRangeParam(baseValue){
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
  
  
  function dateMaxMinTo(value,baseValue,formatedMsg,isMax){
  	var param = getRangeParam(baseValue);
    	var selectors = param.selectors;    	
    	for(var i = 0; i < selectors.length; i++){
	    	var prevVal = isDateString(selectors[i],param.format)?selectors[i]:DOM.val(selectors[i]);
	    	if(!isEmpty(value) && !isEmpty(prevVal) && isDateString(value,param.format)){
	    		var curVal = 0;
    			var preVal = 0;
	    		try{
	    			curVal = toDate(value,param.format).getTime();
	    			preVal = toDate(prevVal,param.format).getTime();
	    		}catch(e){
	    			return '不是有效的日期格式';
	    		}    		
	    		if(!testRange(param.allowEqual,isMax?curVal:preVal,isMax?preVal:curVal)){
	          		return formatedMsg;
	    		}
	        }else if(!isEmpty(prevVal) && !isDateString(prevVal,param.format)){
	        	return "不是有效的日期格式";
	        }
    	}
  };
  
  /**
   * 起始结束日期验证，前面的日期不能大于后面的日期
   * <ol>
   *  <li>name: dateMaxTo</li>
   *  <li>msg: 当前日期不能大于匹配日期！</li>
   *  <li>dateMaxTo: 选择器selector</li>
   * </ol>
   *         {
   *           dateMaxTo : '#minDateId'
   *         }
   *         或
   *         {
   *         	dateMaxTo : {ref:'#minDateId',allowEqual:true}
   *         }
   *         或
   *         {
   *         	dateMaxTo : {ref:['#minDateId','#minDateId1'],allowEqual:true}
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'dateMaxTo',
    msg : '结束日期不能小于起始日期！',
    validator : function(value,baseValue,formatedMsg){
    	return dateMaxMinTo(value,baseValue,formatedMsg,true);
    }
  });
  rules.add({
    name : 'dateMinTo',
    msg : '结束日期不能大于起始日期！',
    validator : function(value,baseValue,formatedMsg){
    	return dateMaxMinTo(value,baseValue,formatedMsg,false);
    }
  });
  
  
  function numberMaxMinTo(value,baseValue,formatedMsg,isMax){
	 
  	var param = getRangeParam(baseValue);   
	for(var i = 0; i < param.selectors.length; i++){    
    	var prevVal = S.isNumber(param.selectors[i])?param.selectors[i]+'':DOM.val(param.selectors[i]);
    	if(!isEmpty(value) && !isEmpty(prevVal)){
    		var curVal = 0;
			var preVal = 0;
    		try{
    			curVal = Number(value);
    			preVal = Number(prevVal);
    		}catch(e){
    			return '不是有效的数字';
    		}
    		if(!testRange(param.allowEqual,isMax?curVal:preVal,isMax?preVal:curVal)){
          		return formatedMsg;
    		}
        }else if(!isEmpty(prevVal)){
        	try{
    			preVal = Number(prevVal);
    		}catch(e){
    			return '不是有效的数字';
    		}
        }
	}
  };
  
 
  /**
   * 数字范围
   * <ol>
   *  <li>name: numberMaxTo</li>
   *  <li>msg: 起始数字不能大于结束数字！</li>
   *  <li>numberMaxTo: 选择器selector</li>
   * </ol>
   *         {
   *           numberMaxTo : #minNumId
   *         }
   *         {
   *           numberMaxTo : {ref:'#minNumId',allowEqual:true}
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'numberMaxTo',
    msg : '结束数字不能小于开始数字！',
    validator : function(value,baseValue,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
    	return numberMaxMinTo(value,baseValue,formatedMsg,true);
    }
  });  
  rules.add({
    name : 'numberMinTo',
    msg : '结束数字不能大于开始数字！',
    validator : function(value,baseValue,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
    	return numberMaxMinTo(value,baseValue,formatedMsg,false);
    }
  });
  
  
  /**
   * 勾选的范围
   * <ol>
   *  <li>name: checkRange</li>
   *  <li>msg: 必须选中{0}项！</li>
   *  <li>checkRange: 勾选的项范围</li>
   * </ol>
   *         //至少勾选一项
   *         {
   *           checkRange : 1
   *         }
   *         //只能勾选两项
   *         {
   *           checkRange : [2,2]
   *         }
   *         //可以勾选2-4项
   *         {
   *           checkRange : [2,4
   *           ]
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'checkRange',
    msg : '必须选中{0}项！',
    validator : function(record,baseValue,formatedMsg,group){
    	var len = 0;
    	var isValid = false;
    	S.each(group,function(sub){
    		if(sub.checked){
    			len ++;
    		}
    	});
     	if(S.isArray(baseValue)){
     		if(baseValue.length > 1){
     			isValid = (len >= baseValue[0]&&len <= baseValue[1]);
     		}else if(baseValue.length == 1){
     			isValid = len == baseValue[0];
     		}
     	}else{
     		isValid = len == baseValue;
     	}
     	
     	if(!isValid){
     		return formatedMsg;
     	}
    }
  });
  /************<--分组验证*********************/
  
/*************************<---添加默认规则**************************************************/
  
  return rules;
},{
    requires: ['base','dom',KISSY.myPackageName+'/util/form/rule','date/format','date/gregorian']
});
