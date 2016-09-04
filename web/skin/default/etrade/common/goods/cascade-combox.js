/**
 * ʡ���ص��㼶���б�򹫹�����ģ��
 * 
 * @author ������
 * @since 2013-10-21
 * @version 1.0
 * @see ../util/combo/layercombo
 */
KISSY.add(KISSY.myPackageName+"/common/goods/cascade-combox", function (S,LayerCombo) {

	var CascadeCombox = function(config){
		CascadeCombox.superclass.constructor.call(this,config);
	};
	
	S.extend(CascadeCombox,LayerCombo);//�̳л���	
	
	CascadeCombox.ATTRS = {	
		url		: {value:"/dict/goods/cascadeCombox.shtml"},
		initLink:{value:true},
		initPWords:{value:true},
		refParam : {value:{'getProvince':[],'getCity':['city_no'],'getCounty':['city_no','area_no']}}
	};	
	
	return CascadeCombox;	
},{
	requires: [KISSY.myPackageName+"/util/combo/layercombo"]
});