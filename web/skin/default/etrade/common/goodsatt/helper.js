/**
 * ��Ʒ���ࡢ��Ʒ���ࡢ��ƷС�ࡢƷ�����㼶���б�򹫹�����ģ��
 * 
 * @author ������
 * @since 2013-10-21
 * @version 1.0
 * @see ../util/combo/layercombo
 */
KISSY.add(KISSY.myPackageName+"/common/goodsatt/helper", function (S,LayerCombo) {

	var Helper = function(config){
		Helper.superclass.constructor.call(this,config);
	};
	
	S.extend(Helper,LayerCombo);//�̳л���	
	
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