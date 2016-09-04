/**
 * 商品大类、商品中类、商品小类、品名弹层级联列表框公共基础模块
 * 
 * @author 周忠友
 * @since 2013-10-21
 * @version 1.0
 * @see ../util/combo/layercombo
 */
KISSY.add(KISSY.myPackageName+"/common/goodsatt/helper", function (S,LayerCombo) {

	var Helper = function(config){
		Helper.superclass.constructor.call(this,config);
	};
	
	S.extend(Helper,LayerCombo);//继承基类	
	
	Helper.ATTRS = {	
		url		: {value:"/dict/goodsatt/helper.shtml?status=1"},
		initLink:{value:true},
		initPWords:{value:false},
		refParam : {value:{'getSubstance':[],'getGoodsType':['substance_id'],'getGoodsClass':['substance_id','goods_type_id'],'getGoods':['substance_id','goods_type_id','goods_class_id']}}
	};	
	
	return Helper;	
},{
	requires: [KISSY.myPackageName+"/util/combo/layercombo"]
});