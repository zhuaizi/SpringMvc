/**
 * 弹出层显示模块
 * 
 * @author 周忠友
 * @since 2013-10-08
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/overlay/popup", function (S,Base,Node,O) {

	var Popup = function (config){
	    Popup.superclass.constructor.call(this,config);
	    /**
		 * 显示层公共基础对象
		 */
		this.layerRoot = new O({
			elCls : 'ks-overlay-layer-default-style',
	        effect:{
	            effect:"slide", //popup层显示动画效果，slide是展开，也可以"fade"渐变
	            duration:0.1
	        }
	    });
	};
	
	S.extend(Popup,Base);//继承基类
	
	/**
	 * 启用蒙版遮罩masked选择的内容<br/>
	 * 	var mask = Popup.mask("#id");<br/>
	 *	mask.show();//显示<br/>
	 *	mask.hide();//隐藏<br/>
	 *	mask.destroy();//销毁
	 * 	
	 * @param {string.<selector>} masked 要遮罩的元素的选择器
	 * @return {Overlay.Popup} mask对象
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
	 * 显示层<br/>
	 * 	var layer = Popup.layer("#id",'&lt;p&gt;的反对法&lt;/p&gt;');<br/>
	 *	layer.show();//显示<br/>
	 *	layer.hide();//隐藏<br/>
	 *	layer.destroy();//销毁
	 * 	
	 * @param {String} target 元素的选择器，层显示到该元素上
	 * @param {String} content HTML代码段
	 * @param {String[]} loca 显示位置，如默认为：['bl','tl']，显示在底部，表示 layer 的 bl 与参考节点的 tl 对齐
	 * 	字符串数组元素的取值范围为 t,b,c 与 l,r,c 的两两组合, 分别表示 top,bottom,center 与 left,right,center 的两两组合, 可以表示 9 种取值范围
	 * @param {Number[]} offset 数组第一个元素表示 x 轴偏移, 第二个元素表示 y 轴偏移.
	 * @return {Overlay} layer对象
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
