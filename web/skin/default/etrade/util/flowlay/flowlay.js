/**
 * �б���⸡����
 * 
 * @author zhangxd
 * @since 2013-10-24
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/flowlay/flowlay",function (S,Base,DOM,Event) {
	
	var FlowLay = function (config){
		FlowLay.superclass.constructor.call(this,config);
	};
	
	S.extend(FlowLay,Base);//�̳л���
	
	FlowLay.ATTRS ={
			  flowclass :{value :'.flowtitle'},/*�������class�����Ψһ*/
			  mainTable:{value:'#mainTable'},/*�б�����id������selector*/
			  bgColor:{value:'rgb(245, 245, 245)'},/*������ɫ*/
			  flowTop:{value:'0'},/*�����㵽������λ��*/
			  flowZIndex:{value:'1040'},/*��������ʾ�㼶��*/
			  mainWidth:{value:'0'},/*���ã�������ϵĻ����򲻻��Զ�ȥ����*/
			  mainToTop:{value:'0'},/*���ã�������ϵĻ����򲻻��Զ�ȥ�㵽�����ĸ߶�*/
			  callback:{value:function(btnObj,btn){}}/*�ص����� btnObjΪ��ǰ��ť����btnΪ��ǰ��ť��ʶ�磺ok��cancel;Ҳ�����Լ������retValue����ֵ*/
			  };
	
	
	FlowLay.prototype.render = function(){
		var _self=this;
		/*�б�������ʵ��*/
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
		            var mainWidth=_self.get('mainWidth')>0?_self.get('mainWidth'):DOM.innerWidth(_self.get('mainTable'));//��ȡ��ǰ�б�Ŀ��
		            var mainToTop=_self.get('mainToTop')>0?_self.get('mainToTop'):DOM.offset(_self.get('mainTable')).top;//��ȡ��ǰ�б������ĸ߶�
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
		    //��ȡ�ɸ�����ͷ�б�
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
