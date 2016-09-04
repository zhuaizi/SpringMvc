/**
 * 商品中类、商品小类、品名弹层级联列表框公共基础模块
 * 
 * @author linlc
 * @since 2014-05-05
 * @version 1.0
 * @see ../util/combo/layercombo
 */
KISSY.add(KISSY.myPackageName+"/common/goodsatt/goodshelper", function (S,LayerCombo) {

	var Helper = function(config){
		Helper.superclass.constructor.call(this,config);
	};
	
	S.extend(Helper,LayerCombo);//继承基类	
	
	Helper.ATTRS = {	
		url		: {value:"/dict/goodsatt/helper.shtml?status=1"},
		initLink:{value:true},
		initPWords:{value:false},
		refParam : {value:{'getGoodsType':[],'getGoodsClass':['goods_type_id'],'getGoods':['goods_type_id','goods_class_id']}}
	};	
	
	return Helper;	
},{
	requires: [KISSY.myPackageName+"/util/combo/layercombo"]
});