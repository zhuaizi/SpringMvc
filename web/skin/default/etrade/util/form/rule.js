
/**
 * 验证规则模块
 * 
 * @author 周忠友
 * @since 2013-09-01
 * @version 1.0
 * @example	
 * 	KISSY.use("mine/rule",function(S,R){
		var rule = new R({
			name	: "test_name",//规则名称
			msg		: "最大{max}最小{min}",
			validator : function(value,baseValue,formatMsg,group){ //验证函数，验证值、基准值、格式化后的错误信息、goup控件
				//如果验证通过返回null或者不返回，反正返回格式化后的错误信息
				return formatMsg;
			}
		});
		
		alert(rule.vaild(1,{max:100,min:1},null));
		//还可以在调用时替代已定义的msg
		alert(rule.vaild(1,[100,1],"最大{0}最小{1}"));
		
	});
 */
KISSY.add(KISSY.myPackageName+"/util/form/rule", function (S,Base) {

 /** 
 * 验证规则类
 */
  var Rule = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  S.extend(Rule,Base);//继承基类
  
  /**
   * 处理中文
   */
  String.prototype.getBytes = function() {
  	var mat = this.match(/[^\x00-\xff]/ig);
  	return this.length + (mat == null ? 0 : mat.length);
  };

  Rule.ATTRS = {//Rule类的属性
    /**
     * 规则名称
     * @type {String}
     */
    name : {

    },
    /**
     * 验证失败信息(支持模版格式化)
     * @type {String}
     */
    msg : {

    },
    /**
     * 验证函数
     * @type {Function}
     */
    validator : {
      value : function(value,baseValue,formatedMsg,control){

      }
    }
  }
  
  //是否通过验证
  function valid(self,value,baseValue,msg,control){
    var _self = self,
      validator = _self.get('validator'),
      formatedMsg = formatError(self,baseValue,msg),
    value = value == null ? '' : value;
    return validator.call(_self,value,baseValue,formatedMsg,control);
  }
  
   function parseParams(values){

    if(values == null){
      return {};
    }

    if(S.isPlainObject(values)){
      return values;
    }

    var ars = values,
        rst = {};
    if(S.isArray(values)){

      for(var i = 0; i < ars.length; i++){
        rst[i] = ars[i];
      }
      return rst;
    }

    return {'0' : values};
  }

  function formatError(self,values,msg){
    var ars = parseParams(values); 
    msg = msg || self.get('msg');
    return S.substitute(msg,ars);
  }
   /**
	 * 是否通过验证，该函数可以接收多个参数
	 * @param  {*}  [value] 验证的值
	 * @param  {*} [baseValue] 跟传入值相比较的值
	 * @param {String} [msg] 验证失败后的错误信息，显示的错误中可以显示 baseValue中的信息
	 * @param {HTMLElement|Array(HTMLElement)} [control] 发生验证的控件，或分组验证的控件数组
	 * @return {String}   通过验证返回 null ,未通过验证返回错误信息
	 * 
	 *         var msg = '输入数据必须在{0}和{1}之间！',
	 *           rangeRule = new Rule({
	 *             name : 'range',
	 *             msg : msg,
	 *             validator :function(value,range,msg){
	 *               var min = range[0], //此处我们把range定义为数组，也可以定义为{min:0,max:200},那么在传入校验时跟此处一致即可
	 *                 max = range[1];   //在错误信息中，使用用 '输入数据必须在{min}和{max}之间！',验证函数中的字符串已经进行格式化
	 *               if(value < min || value > max){
	 *                 return false;
	 *               }
	 *               return true;
	 *             }
	 *           });
	 *         var range = [0,200],
	 *           val = 100,
	 *           error = rangeRule.valid(val,range);//msg可以在此处重新传入
	 *         
	 */
  Rule.prototype.valid = function(value,baseValue,msg,control){
  	  var _self = this;
  	  var message = undefined;
  	  if(S.isPlainObject(msg)){
  	  	message = msg[_self.get('name')]?msg[_self.get('name')]:undefined;
  	  }
  	  
      return valid(_self,value,baseValue,message,control);
  };
	
	return Rule;
},{
    requires: ['base']
});
