/**
 * 省市县弹层级联列表框公共基础模块
 * 
 * @author 周忠友
 * @since 2013-10-21
 * @version 1.0
 * @see ../util/combo/layercombo
 */
KISSY.add(KISSY.myPackageName+"/common/goods/cascade-combox", function (S,LayerCombo) {

	var CascadeCombox = function(config){
		CascadeCombox.superclass.constructor.call(this,config);
	};
	
	S.extend(CascadeCombox,LayerCombo);//继承基类	
	
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