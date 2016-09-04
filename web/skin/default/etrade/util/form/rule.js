
/**
 * ��֤����ģ��
 * 
 * @author ������
 * @since 2013-09-01
 * @version 1.0
 * @example	
 * 	KISSY.use("mine/rule",function(S,R){
		var rule = new R({
			name	: "test_name",//��������
			msg		: "���{max}��С{min}",
			validator : function(value,baseValue,formatMsg,group){ //��֤��������ֵ֤����׼ֵ����ʽ����Ĵ�����Ϣ��goup�ؼ�
				//�����֤ͨ������null���߲����أ��������ظ�ʽ����Ĵ�����Ϣ
				return formatMsg;
			}
		});
		
		alert(rule.vaild(1,{max:100,min:1},null));
		//�������ڵ���ʱ����Ѷ����msg
		alert(rule.vaild(1,[100,1],"���{0}��С{1}"));
		
	});
 */
KISSY.add(KISSY.myPackageName+"/util/form/rule", function (S,Base) {

 /** 
 * ��֤������
 */
  var Rule = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  S.extend(Rule,Base);//�̳л���
  
  /**
   * ��������
   */
  String.prototype.getBytes = function() {
  	var mat = this.match(/[^\x00-\xff]/ig);
  	return this.length + (mat == null ? 0 : mat.length);
  };

  Rule.ATTRS = {//Rule�������
    /**
     * ��������
     * @type {String}
     */
    name : {

    },
    /**
     * ��֤ʧ����Ϣ(֧��ģ���ʽ��)
     * @type {String}
     */
    msg : {

    },
    /**
     * ��֤����
     * @type {Function}
     */
    validator : {
      value : function(value,baseValue,formatedMsg,control){

      }
    }
  }
  
  //�Ƿ�ͨ����֤
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
	 * �Ƿ�ͨ����֤���ú������Խ��ն������
	 * @param  {*}  [value] ��֤��ֵ
	 * @param  {*} [baseValue] ������ֵ��Ƚϵ�ֵ
	 * @param {String} [msg] ��֤ʧ�ܺ�Ĵ�����Ϣ����ʾ�Ĵ����п�����ʾ baseValue�е���Ϣ
	 * @param {HTMLElement|Array(HTMLElement)} [control] ������֤�Ŀؼ����������֤�Ŀؼ�����
	 * @return {String}   ͨ����֤���� null ,δͨ����֤���ش�����Ϣ
	 * 
	 *         var msg = '�������ݱ�����{0}��{1}֮�䣡',
	 *           rangeRule = new Rule({
	 *             name : 'range',
	 *             msg : msg,
	 *             validator :function(value,range,msg){
	 *               var min = range[0], //�˴����ǰ�range����Ϊ���飬Ҳ���Զ���Ϊ{min:0,max:200},��ô�ڴ���У��ʱ���˴�һ�¼���
	 *                 max = range[1];   //�ڴ�����Ϣ�У�ʹ���� '�������ݱ�����{min}��{max}֮�䣡',��֤�����е��ַ����Ѿ����и�ʽ��
	 *               if(value < min || value > max){
	 *                 return false;
	 *               }
	 *               return true;
	 *             }
	 *           });
	 *         var range = [0,200],
	 *           val = 100,
	 *           error = rangeRule.valid(val,range);//msg�����ڴ˴����´���
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
