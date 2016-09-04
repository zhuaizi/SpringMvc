/**
 * 对话框模块
 * 
 * @author zhangxd
 * @since 2013-10-24
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/dialog/dialog",function (S,Base,DOM,Event,OL) {
	
	var Dialog = function (config){
		Dialog.superclass.constructor.call(this,config);
	};
	
	S.extend(Dialog,Base);//继承基类
	
	Dialog.ATTRS ={
			  title :{value :'提示信息'},/*标题，默认为‘提示信息’*/
			  bodys:{value:''},/*内容，默认为空*/
			  width:{value:400},/*提示框的宽度*/
			  minBodyHeight:{value:50},/*提示框内容最小高度*/
			  btnType:{value:'ok'},/*默认只有一个确定按钮类型，若要使用确认，取消对话框，请传Q或者q*/
			  pBtnIndex:{value:0},/*btn-primary样式加载某一个按钮上，默认为第一个，若不需要设置为小于0的值即可*/
			  buttonGroup:{value:[]},/*预留扩展按钮*/
			  btnPosition:{value:'center'},/*按钮位置*/
			  closable:{value:false},/*关闭按钮*/
			  closeAction:{value:"destroy"},/*关闭按钮*/
			  escapeToClose:{value:false},/*ESC按键关闭*/
			  closeable:{value:true},/*默认点击按钮过后关闭当前窗体*/
			  effect:{value:'fade'},/*默认弹出窗体蒙版颜色渐进显示*/
			  dl:{value:{}},/*保存当前对象*/
			  headerContent:{value:''},/*顶部内容*/
			  bodyContent:{value:''},/*中部内容*/
			  footerContent:{value:''},/*底部内容*/
			  callback:{value:function(btnObj,btn,obj){}}/*回调函数 btnObj为当前按钮对象，btn为当前按钮标识如：ok，cancel;也就是自己定义的retValue属性值,obj是该对象本身*/
			  };
	
	
	var initButtons = function(btype,buttonGroup) {
		if(buttonGroup&&buttonGroup.length>0){
			return buttonGroup;
		}else if (btype == 'Q'||btype == 'q')
			return [{title:'确定',retValue:'ok'},{title:'取消',retValue:'cancel'}]
		else
			return [{title:'确定',retValue:'ok'}]
	};
	
	
	
	
	
	Dialog.prototype._initButtons=function(o){
    	var btnTpl='';/* '  <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
	      +'   <button type="button" class="btn btn-primary">确定</button>';*/
		var btns=o.buttons;
		for(var i=0;i<btns.length;i++){
			btnTpl+='<button style="margin-right:10px;" type="button" roles="btnDialog" datas="'+btns[i].retValue+'" class="btn  btn-default '+(o.pBtnIndex==i?' btn-primary ':'')+'">'+btns[i].title+'</button>'
		}
		var tpl ='  <div class="" style="text-align:'+o.btnPosition+'">'
		      +btnTpl
		      +' </div>';
		
		   return tpl;   
	
	}
	
	Dialog.dl=null;
	
	
	Dialog.prototype.render = function(){
		var _self=this;
		var o={
    		btnPosition:_self.get("btnPosition"),
    		pBtnIndex:_self.get("pBtnIndex"),
    		buttons:new initButtons(_self.get("btnType"),_self.get("buttonGroup"))
    	};
//    	DOM.append (DOM.create(self._inits(o)),"body");
		
		var dl = new OL.Dialog({
			width:_self.get("width"),
	        headerContent:_self.get('headerContent')?_self.get('headerContent'):('<div class=""><h4 class="modal-title" title="'+_self.get("title")+'" style="white-space:nowrap; overflow:hidden;  text-overflow:ellipsis; width:480px;">'+_self.get("title")+'</h4></div>'),
	        bodyContent: _self.get('bodyContent')?_self.get('bodyContent'):(' <div class="" style="min-height:'+_self.get("minBodyHeight")+'px;">'+_self.get("bodys")+'</div>'),
	        footerContent:_self.get('footerContent')?_self.get('footerContent'):_self._initButtons(o),
	        closeAction:_self.get("closeAction"),
	        closable:_self.get("closable"),/*关闭按钮*/
			escapeToClose:_self.get("escapeToClose"),/*ESC按键关闭*/
	        mask:{
	            effect:_self.get("effect")
	        },
	        align: {
	            points: ['cc', 'cc']
	        }
	    });
		//Dialog.dl=dl;
		_self.set("dl",dl);
		
		dl.show();
		S.each(DOM.query('button[roles="btnDialog"]'),function(o,i){
			Event.on(o,'click',function(e){	
				var ce=e.target;
				if(_self.get("closeable"))dl.destroy();
				_self.get("callback").call(this,ce,DOM.attr(ce,"datas"),dl);
			});
		});
	};
	
	/*关闭该dialog；使用时对象变量.close();调用*/
	Dialog.prototype.close = function(){
		//alert('close');
		this.get("dl")&&this.get("dl").destroy();
	};
	
	
	/*隐藏该dialog；使用时对象变量.hide();调用*/
	Dialog.prototype.hide = function(){
		//alert('hide');
		this.get("dl")&&this.get("dl").hide();
		
	};
	
	/*显示该dialog；使用时对象变量.show();调用*/
	Dialog.prototype.show = function(){
		//alert('show');
		this.get("dl")&&this.get("dl").show();
	};
	
	
	
	
	
	Dialog.shows=function(obj){
			var dl=new Dialog(obj);			
			dl.render();
			return dl;
	};
	
	Dialog.show=function(t,b,bt,w,cb){
		var obj={};
		if(''!=t){
			obj.title=t;
		}
		if(''!=b){
			obj.bodys=b;
		}
		if(''!=bt){
			obj.btnType=bt;
		}
		if(''!=w){
			obj.width=w;
		}
		if(cb&&typeof cb=='function'){
			obj.callback=cb;
		}
		var dl=new Dialog(obj);			
		dl.render();
		return dl;
	};
	
	Dialog.alert=function(b){
		if(''!=b){
			var obj={};
			obj.bodys=b;
			var dl=new Dialog(obj);			
			dl.render();
			return dl;
		}
		
	};
	
	Dialog.close=function(d){
		if(!d){
			//alert('close1');
			Dialog.dl&&Dialog.dl.hide();
		}else{
			//alert('close2');
			d.close()
		}
		
	};
	
	
	
	
	return Dialog;
},{
    requires: ['base','dom','event','overlay','overlay/assets/dpl.css',KISSY.myPackageName+'/css/mode/dialog.css']
});
