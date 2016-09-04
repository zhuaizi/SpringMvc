/**
 * Ĭ����֤�������ģ��
 * 
 * @author ������
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
   * ����֤����֤���������
   */
	var rules = {
		/**
		 * �����֤����
	     * @param {Object|mine/rule} rule ��֤���������������֤�������
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
	     * ɾ����֤����
	     * @param  {String} name ��������
	     */
	    remove : function(name){
	      delete ruleMap[name];
	    },
	    /**
	     * ��ȡ��֤����
	     * @param  {String} name ��������
	     * @return {Rule}  ��֤����
	     */
	    get : function(name){
	      return ruleMap[name];
	    },
	    /**
	     * ��ָ֤���Ĺ���
	     * @param  {String} name ��������
	     * @param  {*} value ��ֵ֤
	     * @param  {*} [baseValue] ������֤�Ļ���ֵ
	     * @param  {String} [msg] ��ʾ�����ģ��
	     * @param  {HTMLElement|Array(HTMLElement)} [control] ������֤�Ŀؼ����������֤�Ŀؼ�����
	     * @return {String} ͨ����֤���� null,���򷵻ش�����Ϣ
	     */
	    valid : function(name,value,baseValue,msg,control){
	      var rule = rules.get(name);
	      if(rule){
	        return rule.valid(value,baseValue,msg,control);
	      }
	      return null;
	    },
	    /**
	     * ��ָ֤���Ĺ���
	     * @param  {String} name ��������
	     * @param  {*} values ��ֵ֤
	     * @param  {*} [baseValue] ������֤�Ļ���ֵ
	     * @param  {HTMLElement|Array(HTMLElement)} [control] ������֤�Ŀؼ����������֤�Ŀؼ�����
	     * @return {Boolean} �Ƿ�ͨ����֤
	     */
	    isValid : function(name,value,baseValue,control){
	      return rules.valid(name,value,baseValue,control) == null;
	    }
	};//rules����
	
	
	/*************************���Ĭ�Ϲ���-->************************************************/	
	
	/**
   * �ǿ���֤,���ֵȥ���ո�
   * <ol>
   *  <li>name: required</li>
   *  <li>msg: ����Ϊ�գ�</li>
   *  <li>required: boolean ����</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'required',
    msg : '����Ϊ�գ�',
    validator : function(value,required,formatedMsg){
      if(required !== false && /^\s*$/.test(value)){
        return formatedMsg;
      }
    }
  });
  /**
   * ����һ����֤
   * <ol>
   *  <li>name: isZcwan</li>
   *  <li>msg: ����ֵ��������10000</li>
   *  <li>isZcwan:  boolean ����</li>
   * </ol>
   * @type {Rule}
   */
  var zwReg=/^\+?[1-9][0-9]*$/;
  rules.add({
    name : 'isZcwan',
    msg : '���ʽ�������һ�����������',
    validator : function(value,isZcwan,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== ''){
    	  return zwReg.test(Number(value)/Number(10000)) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * �ֻ�������֤
   * <ol>
   *  <li>name: isMobile</li>
   *  <li>msg: ������Ч���ֻ����룡</li>
   * </ol>
   * @type {Rule}
   */
  var mobileReg = /^1[3|4|5|8|7][0-9]\d{8}$/;
  rules.add({
    name : 'isMobile',
    msg : '������Ч���ֻ����룡',
    validator : function(value,isMobile,formatedMsg){
      value = S.trim(value);
      if(value){
        return mobileReg.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * �绰������֤
   * <ol>
   *  <li>name: isPhone</li>
   *  <li>msg: ������Ч�ĵ绰���룡</li>
   * </ol>
   * @type {Rule}
   */
  var phoneReg = /^(\d{3,4}\-?){0,1}\d{7,8}$/;
  rules.add({
    name : 'isPhone',
    msg : '������Ч�ĵ绰���룡',
    validator : function(value,isPhone,formatedMsg){
      value = S.trim(value);
      if(value){
        return (phoneReg.test(value)||mobileReg.test(value)) ? undefined : formatedMsg;
      }
    }
  });
  /**
   * ��ַ��֤
   * <ol>
   *  <li>name: isPhone</li>
   *  <li>msg: ������Ч����ַ��</li>
   * </ol>
   * @type {Rule}
   */
  var httpUrlReg = /^((https?:\/\/)?([\-\u4e00-\u9fa5_a-zA-Z0-9]+\.)+([\u4e00-\u9fa5_a-zA-Z0-9]+){2,3}(\/[%\-\u4e00-\u9fa5_a-zA-Z0-9]+(\.([A-Za-z\u4e00-\u9fa5]){2,4})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.([A-Za-z\u4e00-\u9fa5]){2,4})?)*\/?)/i;
  rules.add({
    name : 'isUrl',
    msg : '������Ч����ַ��',
    validator : function(value,isUrl,formatedMsg){
      value = S.trim(value);
      if(value){
        return httpUrlReg.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  
  
  
  
  
  /**
   * �����֤
   * <ol>
   *  <li>name: equalTo</li>
   *  <li>msg: �������벻һ�£�</li>
   *  <li>equalTo: һ���ַ�����id��#id_name)</li>
   * </ol>
   *         {
   *           equalTo : '#password'
   *         }

   * @type {Rule}
   */
  rules.add({
    name : 'equalTo',
    msg : '�������벻һ�£�',
    validator : function(value,equalTo,formatedMsg){
      equalToValue = DOM.val(equalTo);
      return value === equalToValue ? undefined : formatedMsg;
    }
  });
  
  /**
   * ��С����֤
   * <ol>
   *  <li>name: min</li>
   *  <li>msg: ����ֵ����С��{0}��</li>
   *  <li>min: ���֣��ַ���</li>
   * </ol>
   *         {
   *           min : 5
   *         }
   *         //�ַ���
   * @type {Rule}
   */
  rules.add({
    name : 'min',
    msg : '����ֵ����С��{0}��',
    validator : function(value,min,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== '' && Number(value) < Number(min)){
        return formatedMsg;
      }
    }
  });
  
  /**
   * ��������֤,������ֵ�Ƚ�
   * <ol>
   *  <li>name: max</li>
   *  <li>msg: ����ֵ���ܴ���{0}��</li>
   *  <li>max: ���֡��ַ���</li>
   * </ol>
   *         {
   *           max : 100
   *         }
   *         //�ַ���
   *         {
   *           max : '100'
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'max',
    msg : '����ֵ���ܴ���{0}��',
    validator : function(value,max,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
      if(value !== '' && Number(value) > Number(max)){
        return formatedMsg;
      }
    }
  });
  
  /**
   * ���볤����֤��������ָ���ĳ���
   * <ol>
   *  <li>name: length</li>
   *  <li>msg: ����ֵ����Ϊ{0}��</li>
   *  <li>length: ����</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'length',
    msg : '����ֵ���ȱ���Ϊ{0}��',
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
   * ��̳�����֤,���ֵȥ���ո�
   * <ol>
   *  <li>name: minlength</li>
   *  <li>msg: ����ֵ���Ȳ�С��{0}��</li>
   *  <li>minlength: ����</li>
   * </ol>
   *         {
   *           minlength : 5
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'minLength',
    msg : '����ֵ���Ȳ���С��{0}��',
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
   * ��̳�����֤,���ֵȥ���ո�
   * <ol>
   *  <li>name: maxlength</li>
   *  <li>msg: ����ֵ���Ȳ�����{0}��</li>
   *  <li>maxlength: ����</li>
   * </ol>
   *         {
   *           maxlength : 10
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'maxLength',
    msg : '����ֵ���Ȳ��ܴ���{0}��',
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
   * ������ʽ��֤,���������ʽΪ�գ��򲻽���У��
   * <ol>
   *  <li>name: regexp</li>
   *  <li>msg: ����ֵ������{0}��</li>
   *  <li>regexp: ������ʽ</li>
   * </ol> 
   * @type {Rule}
   */
  rules.add({
    name : 'regexp',
    msg : '����ֵ������{0}��',
    validator : function(value,regexp,formatedMsg){
      if(value){
        return regexp.test(value) ? undefined : formatedMsg;
      }
    }
  });
	
 
  /**
   * ������֤,���ֵȥ���ո������ݲ�����У��
   * <ol>
   *  <li>name: email</li>
   *  <li>msg: ������Ч�������ַ��</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'email',
    msg : '������Ч�������ַ��',
    validator : function(value,baseValue,formatedMsg){
      value = S.trim(value);
      if(value){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? undefined : formatedMsg;
      }
    }
  });
  
  /**
   * ������֤�����ֵȥ���ո������ݲ�����У��
   * <ol>
   *  <li>name: date</li>
   *  <li>msg: ������Ч�����ڣ�</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'date',
    msg : '������Ч�����ڸ�ʽ��',
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
   * ��С����֤
   * <ol>
   *  <li>name: minDate</li>
   *  <li>msg: �������ڲ���С��{0}��</li>
   *  <li>minDate: ���ڣ��ַ���</li>
   * </ol>
   *         {
   *           minDate : '2001-01-01';
   *         }
   *         //�ַ���
   * @type {Rule}
   */
  rules.add({
    name : 'minDate',
    msg : '�������ڲ���С��{0}��',
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
   * ��С����֤,������ֵ�Ƚ�
   * <ol>
   *  <li>name: maxDate</li>
   *  <li>msg: ����ֵ���ܴ���{0}��</li>
   *  <li>maxDate: ���ڡ��ַ���</li>
   * </ol>
   *         {
   *           maxDate : '2001-01-01';
   *         }
   *         //������
   *         {
   *           maxDate : new Date('2001-01-01');
   *         }
   * @type {Rule}
   */
  rules.add({
    name : 'maxDate',
    msg : '�������ڲ��ܴ���{0}��',
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
   * ������֤�����ֵȥ���ո������ݲ�����У��
   * ����ǧ�ַ������磺 12,000,000�ĸ�ʽ
   * <ol>
   *  <li>name: number</li>
   *  <li>msg: ������Ч�����֣�</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'number',
    msg : '������Ч�����֣�',
    validator : function(value,baseValue,formatedMsg,field){
      
      value = value.replace(/\,/g,'').replace(/\s/g,'');
      //�������룬�����������С��λ��
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
   * ��֤�Ƿ������������
   * <ol>
   *  <li>name: allowNegative </li>
   *  <li>msg: ������Ч�����֣�</li>
   * </ol>
   * @type {Rule}
   */
  rules.add({
    name : 'allowNegative',
    msg : '�������븺����',
    validator : function(value,baseValue,formatedMsg,field){
      
      if(!baseValue){
    	  if(Number(value)<0)
    		  return formatedMsg;
      }
      return ;
    }
  });
  
  
  /**************-->������֤********************/
  
   /**
    * ��֤�����ֵ�Ƿ�С��ǰ���ֵ
    * 
    * @param {boolean|Object} baseValue �����Ƿ��������true��false��{equals:true}��{equals:false}
    * @param {Date|Number} curVal �����ֵ
    * @param {Date|Number} prevVal ǰ���ֵ
    * 
    * @return ǰ��<����(����ǰ��<=���棬����������������)
    */
  function testRange (baseValue,curVal,prevVal) {
    var allowEqual = baseValue && (baseValue.equals !== false);

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  
  /**
   * �ж�ֵ�Ƿ�Ϊ���ַ���''��null
   */
  function isEmpty(value){
    return value == '' || value == null;
  }
  
  /**
   * �������(form.js��Ҳ�иú���������ʱע��)
   * 
   * @param {String|Object} baseValue
   * 	'#minDateId'��{ref:'#minDateId',allowEqual:true}��{ref:['#minDateId','#minDateId1'],allowEqual:true}
   * @return {Object} ��ʽΪ��{selectors:['#minDateId','#minDateId1'],allowEqual:true}
   * 
   */
  function getRangeParam(baseValue){
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
	    			return '������Ч�����ڸ�ʽ';
	    		}    		
	    		if(!testRange(param.allowEqual,isMax?curVal:preVal,isMax?preVal:curVal)){
	          		return formatedMsg;
	    		}
	        }else if(!isEmpty(prevVal) && !isDateString(prevVal,param.format)){
	        	return "������Ч�����ڸ�ʽ";
	        }
    	}
  };
  
  /**
   * ��ʼ����������֤��ǰ������ڲ��ܴ��ں��������
   * <ol>
   *  <li>name: dateMaxTo</li>
   *  <li>msg: ��ǰ���ڲ��ܴ���ƥ�����ڣ�</li>
   *  <li>dateMaxTo: ѡ����selector</li>
   * </ol>
   *         {
   *           dateMaxTo : '#minDateId'
   *         }
   *         ��
   *         {
   *         	dateMaxTo : {ref:'#minDateId',allowEqual:true}
   *         }
   *         ��
   *         {
   *         	dateMaxTo : {ref:['#minDateId','#minDateId1'],allowEqual:true}
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'dateMaxTo',
    msg : '�������ڲ���С����ʼ���ڣ�',
    validator : function(value,baseValue,formatedMsg){
    	return dateMaxMinTo(value,baseValue,formatedMsg,true);
    }
  });
  rules.add({
    name : 'dateMinTo',
    msg : '�������ڲ��ܴ�����ʼ���ڣ�',
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
    			return '������Ч������';
    		}
    		if(!testRange(param.allowEqual,isMax?curVal:preVal,isMax?preVal:curVal)){
          		return formatedMsg;
    		}
        }else if(!isEmpty(prevVal)){
        	try{
    			preVal = Number(prevVal);
    		}catch(e){
    			return '������Ч������';
    		}
        }
	}
  };
  
 
  /**
   * ���ַ�Χ
   * <ol>
   *  <li>name: numberMaxTo</li>
   *  <li>msg: ��ʼ���ֲ��ܴ��ڽ������֣�</li>
   *  <li>numberMaxTo: ѡ����selector</li>
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
    msg : '�������ֲ���С�ڿ�ʼ���֣�',
    validator : function(value,baseValue,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
    	return numberMaxMinTo(value,baseValue,formatedMsg,true);
    }
  });  
  rules.add({
    name : 'numberMinTo',
    msg : '�������ֲ��ܴ��ڿ�ʼ���֣�',
    validator : function(value,baseValue,formatedMsg){
    	value = value.replace(/\,/g,'').replace(/\s/g,'');
    	return numberMaxMinTo(value,baseValue,formatedMsg,false);
    }
  });
  
  
  /**
   * ��ѡ�ķ�Χ
   * <ol>
   *  <li>name: checkRange</li>
   *  <li>msg: ����ѡ��{0}�</li>
   *  <li>checkRange: ��ѡ���Χ</li>
   * </ol>
   *         //���ٹ�ѡһ��
   *         {
   *           checkRange : 1
   *         }
   *         //ֻ�ܹ�ѡ����
   *         {
   *           checkRange : [2,2]
   *         }
   *         //���Թ�ѡ2-4��
   *         {
   *           checkRange : [2,4
   *           ]
   *         }
   * @type {Rule}   
   */
  rules.add({
    name : 'checkRange',
    msg : '����ѡ��{0}�',
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
  /************<--������֤*********************/
  
/*************************<---���Ĭ�Ϲ���**************************************************/
  
  return rules;
},{
    requires: ['base','dom',KISSY.myPackageName+'/util/form/rule','date/format','date/gregorian']
});
