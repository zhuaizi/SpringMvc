/**
 * ��ѡ����ѡ����Ĺ�����
 * 
 * @author ������
 * @since 2013-10-30
 * @version 1.0
 * @example	
 * html�������£�
 * 	<label><input name="xxx_id" value="2" type="radio"/>��</label>
 * 	KISSY.use("����/util/form/group",function(S,Group){
			Group.getRadioValue('xxx_id').name;
	});
 */
KISSY.add(KISSY.myPackageName+"/util/form/group", function (S,Base,DOM) {

  var Group = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  S.extend(Group,Base,{/*���ǻ��¼�ʵ��������������*/
  
  },{/*���ǻ��¼Ӿ�̬����������*/
  	/**
  	 * ��ȡ��ǰ��ѡ������ѡ���ֵ
  	 * 
  	 * @param {String} name ��ѡ���name����ֵ
  	 * @return {String} ѡ��ĵ�ѡ���valueֵ
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
  	 * ���õ�ǰ��ѡ������ѡ���ֵ
  	 * 
  	 * @param {String} name ��ѡ���name����ֵ
  	 * @param {String} value ѡ��ĵ�ѡ���valueֵ
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
  	 * ��ȡ��ǰ��ѡ������ѡ���ֵ
  	 * 
  	 * @param {String} name ��ѡ���name����ֵ
  	 * @return {String[]} ѡ��ĸ�ѡ���valueֵ����
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
  	 * ���õ�ǰ��ѡ������ѡ���ֵ
  	 * 
  	 * @param {String} name ��ѡ���name����ֵ
  	 * @param {String[]} values ѡ��ĸ�ѡ���valueֵ����
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
  	 
  });//�̳л���

  return Group;
},{
    requires: ['base',"dom"]
});