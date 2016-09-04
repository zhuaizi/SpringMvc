/**
 * 列表标题浮动层
 * 
 * @author zhangxd
 * @since 2013-10-24
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/flowlay/flowlay",function (S,Base,DOM,Event) {
	
	var FlowLay = function (config){
		FlowLay.superclass.constructor.call(this,config);
	};
	
	S.extend(FlowLay,Base);//继承基类
	
	FlowLay.ATTRS ={
			  flowclass :{value :'.flowtitle'},/*浮动层的class，最好唯一*/
			  mainTable:{value:'#mainTable'},/*列表容器id或者是selector*/
			  bgColor:{value:'rgb(245, 245, 245)'},/*背景颜色*/
			  flowTop:{value:'0'},/*浮动层到顶部的位置*/
			  flowZIndex:{value:'1040'},/*浮动层显示层级别*/
			  mainWidth:{value:'0'},/*慎用，如果加上的话程序不会自动去算宽度*/
			  mainToTop:{value:'0'},/*慎用，如果加上的话程序不会自动去算到顶部的高度*/
			  callback:{value:function(btnObj,btn){}}/*回调函数 btnObj为当前按钮对象，btn为当前按钮标识如：ok，cancel;也就是自己定义的retValue属性值*/
			  };
	
	
	FlowLay.prototype.render = function(){
		var _self=this;
		/*列表标题滚动实现*/
		var trs; 
		var arrTrs = new Array();
		function onScroll()
		{
		    if(arrTrs && arrTrs.length > 0)
		    {
		        for(var i = 0; i < arrTrs.length; i++)
		        {    
		            var arr = arrTrs[i];
		            var arrObj=arr[0]?arr[0]:{};
		            var top = (document.documentElement && document.documentElement.scrollTop) ? 
		                    document.documentElement.scrollTop : document.body.scrollTop;
		            var mainWidth=_self.get('mainWidth')>0?_self.get('mainWidth'):DOM.innerWidth(_self.get('mainTable'));//获取当前列表的宽度
		            var mainToTop=_self.get('mainToTop')>0?_self.get('mainToTop'):DOM.offset(_self.get('mainTable')).top;//获取当前列表到顶部的高度
		            if(top>mainToTop){
		            	arrObj.style.display = "block";
		            	arrObj.style.width = mainWidth+'px';
		            	arrObj.style.backgroundColor =_self.get('bgColor');
		            	arrObj.style.top =  _self.get('flowTop')+"px";
		            	arrObj.style.position = "fixed";
		            	arrObj.style.zIndex=_self.get('flowZIndex');
		            }else{
		            	arrObj.style.display = "none";
		            }
		        }
		    }
		}
		function load ()
		{
		    //获取可浮动表头列表
		    var trs = DOM.query(_self.get("flowclass"));
		    if(trs && trs.length > 0)
		    {
		        for(var i = 0; i < trs.length; i++)
		        {
		            var tr = trs[i];
		            
		            var arr = new Array(2);
		            arr[0] = tr;
		            arr[1] = tr.offsetTop;//alert(tr.offsetTop+"|"+tr.parentNode.offsetHeight);
		            arr[2] = tr.offsetTop + tr.parentNode.offsetHeight;
		            arrTrs[i] = arr;
		        }
		    }
		}
		 window.onscroll= onScroll;
		 load();
		
	};
	
	FlowLay.init=function(obj){
		var fl;
		if(obj&&typeof obj=='object'){
			fl=new FlowLay(obj);
		}else{
			fl=new FlowLay(obj);
		}
		fl.render();
	};
	
	
	
	
	return FlowLay;
},{
    requires: ['base','dom','event']
});
