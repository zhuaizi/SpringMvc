/**
 * ��������ʾģ��
 * 
 * @author ������
 * @since 2013-10-08
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/overlay/popup", function (S,Base,Node,O) {

	var Popup = function (config){
	    Popup.superclass.constructor.call(this,config);
	    /**
		 * ��ʾ�㹫����������
		 */
		this.layerRoot = new O({
			elCls : 'ks-overlay-layer-default-style',
	        effect:{
	            effect:"slide", //popup����ʾ����Ч����slide��չ����Ҳ����"fade"����
	            duration:0.1
	        }
	    });
	};
	
	S.extend(Popup,Base);//�̳л���
	
	/**
	 * �����ɰ�����maskedѡ�������<br/>
	 * 	var mask = Popup.mask("#id");<br/>
	 *	mask.show();//��ʾ<br/>
	 *	mask.hide();//����<br/>
	 *	mask.destroy();//����
	 * 	
	 * @param {string.<selector>} masked Ҫ���ֵ�Ԫ�ص�ѡ����
	 * @return {Overlay.Popup} mask����
	 * 
	 */
	Popup.prototype.mask = function(masked){
		var mask = new O.Popup({
	        elCls : 'ks-overlay-mask-default-style',
	        effect:{
	        	effect : 'fade',
	        	duration : 0.1
	        },
	        align : {
	            node : masked,
	            points : ['tl', 'tl']
	        },
	        width : Node.one(masked).width(),
	        height : Node.one(masked).height()
    	});
    	return mask;
	};
	
	/**
	 * ��ʾ��<br/>
	 * 	var layer = Popup.layer("#id",'&lt;p&gt;�ķ��Է�&lt;/p&gt;');<br/>
	 *	layer.show();//��ʾ<br/>
	 *	layer.hide();//����<br/>
	 *	layer.destroy();//����
	 * 	
	 * @param {String} target Ԫ�ص�ѡ����������ʾ����Ԫ����
	 * @param {String} content HTML�����
	 * @param {String[]} loca ��ʾλ�ã���Ĭ��Ϊ��['bl','tl']����ʾ�ڵײ�����ʾ layer �� bl ��ο��ڵ�� tl ����
	 * 	�ַ�������Ԫ�ص�ȡֵ��ΧΪ t,b,c �� l,r,c ���������, �ֱ��ʾ top,bottom,center �� left,right,center ���������, ���Ա�ʾ 9 ��ȡֵ��Χ
	 * @param {Number[]} offset �����һ��Ԫ�ر�ʾ x ��ƫ��, �ڶ���Ԫ�ر�ʾ y ��ƫ��.
	 * @return {Overlay} layer����
	 * 
	 */
    Popup.prototype.layer = function(target,content,loca,offset,zIndex){
    	var _self = this;
    	if(content){
    		_self.layerRoot.set("content", content);
    	}
        _self.layerRoot.set('align', {
            node:target,
            points:loca?loca:["bl", "tl"],
            offset: offset?offset:[0, 0]
        });
        if(zIndex){
        	_self.layerRoot.set('zIndex',zIndex);
        }
        return _self.layerRoot;
    };	
	
	return Popup;
},{
    requires: ['base','node','overlay',KISSY.myPackageName+'/css/mode/overlay.css']
});
