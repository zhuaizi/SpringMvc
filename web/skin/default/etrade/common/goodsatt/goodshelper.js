/**
 * ��Ʒ���ࡢ��ƷС�ࡢƷ�����㼶���б�򹫹�����ģ��
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
	
	S.extend(Helper,LayerCombo);//�̳л���	
	
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