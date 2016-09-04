/**
 * 单选、复选框组的工具类
 * 
 * @author 周忠友
 * @since 2013-10-30
 * @version 1.0
 * @example	
 * html代码如下：
 * 	<label><input name="xxx_id" value="2" type="radio"/>否</label>
 * 	KISSY.use("包名/util/form/group",function(S,Group){
			Group.getRadioValue('xxx_id').name;
	});
 */
KISSY.add(KISSY.myPackageName+"/util/form/group", function (S,Base,DOM) {

  var Group = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  S.extend(Group,Base,{/*覆盖或新加实例化方法或属性*/
  
  },{/*覆盖或新加静态方法或属性*/
  	/**
  	 * 获取当前单选框组所选择的值
  	 * 
  	 * @param {String} name 单选框的name属性值
  	 * @return {String} 选择的单选框的value值
  	 */
  	 getRadioValue : function(name){
  	 	var boxes = DOM.query('input[name="'+name+'"][type="radio"]');
  	 	 var len = boxes.length;
  	 	 for(var i = 0; i < len; i++){
  	 	 	if(boxes[i].checked){
  	 	 		return {value:boxes[i].value,name:DOM.text(DOM.parent(boxes[i],'label'))};
  	 	 	}
  	 	 }
  	 	 return {value:'',name:''};
  	 },
  	 /**
  	 * 设置当前单选框组所选择的值
  	 * 
  	 * @param {String} name 单选框的name属性值
  	 * @param {String} value 选择的单选框的value值
  	 */
  	 setRadioValue : function(name,value){
  	 	var boxes = DOM.query('input[name="'+name+'"][type="radio"]');
  	 	 var len = boxes.length;
  	 	 for(var i = 0; i < len; i++){
  	 	 	if(boxes[i].value == value){  	 	 		
  	 	 		boxes[i].checked = true;
  	 	 	}else{
  	 	 		boxes[i].checked = false;
  	 	 	}
  	 	 }
  	 },
  	 /**
  	 * 获取当前复选框组所选择的值
  	 * 
  	 * @param {String} name 复选框的name属性值
  	 * @return {String[]} 选择的复选框的value值数组
  	 */
  	 getCheckboxValue : function(name){
  	 	 var boxes = DOM.query('input[name="'+name+'"][type="checkbox"]');
  	 	 var len = boxes.length;
  	 	 var rs = [];
  	 	 for(var i = 0; i < len; i++){
  	 	 	if(boxes[i].checked){
  	 	 		rs.push({value:boxes[i].value,name:DOM.text(DOM.parent(boxes[i],'label'))});
  	 	 	}
  	 	 }
  	 	 return rs;
  	 },
  	 /**
  	 * 设置当前复选框组所选择的值
  	 * 
  	 * @param {String} name 复选框的name属性值
  	 * @param {String[]} values 选择的复选框的value值数组
  	 */
  	 getCheckboxValue : function(name,values){
  	 	 var boxes = DOM.query('input[name="'+name+'"][type="checkbox"]');
  	 	 var len = boxes.length;
  	 	 for(var i = 0; i < len; i++){
  	 	 	if(S.inArray(boxes[i].value,values)){
  	 	 		boxes[i].checked = true;
  	 	 	}else{
  	 	 		boxes[i].checked = false;
  	 	 	}
  	 	 }
  	 	 return rs;
  	 }
  	 
  });//继承基类

  return Group;
},{
    requires: ['base',"dom"]
});