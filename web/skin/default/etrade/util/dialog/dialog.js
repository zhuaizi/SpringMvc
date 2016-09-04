/**
 * �Ի���ģ��
 * 
 * @author zhangxd
 * @since 2013-10-24
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/dialog/dialog",function (S,Base,DOM,Event,OL) {
	
	var Dialog = function (config){
		Dialog.superclass.constructor.call(this,config);
	};
	
	S.extend(Dialog,Base);//�̳л���
	
	Dialog.ATTRS ={
			  title :{value :'��ʾ��Ϣ'},/*���⣬Ĭ��Ϊ����ʾ��Ϣ��*/
			  bodys:{value:''},/*���ݣ�Ĭ��Ϊ��*/
			  width:{value:400},/*��ʾ��Ŀ��*/
			  minBodyHeight:{value:50},/*��ʾ��������С�߶�*/
			  btnType:{value:'ok'},/*Ĭ��ֻ��һ��ȷ����ť���ͣ���Ҫʹ��ȷ�ϣ�ȡ���Ի����봫Q����q*/
			  pBtnIndex:{value:0},/*btn-primary��ʽ����ĳһ����ť�ϣ�Ĭ��Ϊ��һ����������Ҫ����ΪС��0��ֵ����*/
			  buttonGroup:{value:[]},/*Ԥ����չ��ť*/
			  btnPosition:{value:'center'},/*��ťλ��*/
			  closable:{value:false},/*�رհ�ť*/
			  closeAction:{value:"destroy"},/*�رհ�ť*/
			  escapeToClose:{value:false},/*ESC�����ر�*/
			  closeable:{value:true},/*Ĭ�ϵ����ť����رյ�ǰ����*/
			  effect:{value:'fade'},/*Ĭ�ϵ��������ɰ���ɫ������ʾ*/
			  dl:{value:{}},/*���浱ǰ����*/
			  headerContent:{value:''},/*��������*/
			  bodyContent:{value:''},/*�в�����*/
			  footerContent:{value:''},/*�ײ�����*/
			  callback:{value:function(btnObj,btn,obj){}}/*�ص����� btnObjΪ��ǰ��ť����btnΪ��ǰ��ť��ʶ�磺ok��cancel;Ҳ�����Լ������retValue����ֵ,obj�Ǹö�����*/
			  };
	
	
	var initButtons = function(btype,buttonGroup) {
		if(buttonGroup&&buttonGroup.length>0){
			return buttonGroup;
		}else if (btype == 'Q'||btype == 'q')
			return [{title:'ȷ��',retValue:'ok'},{title:'ȡ��',retValue:'cancel'}]
		else
			return [{title:'ȷ��',retValue:'ok'}]
	};
	
	
	
	
	
	Dialog.prototype._initButtons=function(o){
    	var btnTpl='';/* '  <button type="button" class="btn btn-default" data-dismiss="modal">�ر�</button>'
	      +'   <button type="button" class="btn btn-primary">ȷ��</button>';*/
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
	        closable:_self.get("closable"),/*�رհ�ť*/
			escapeToClose:_self.get("escapeToClose"),/*ESC�����ر�*/
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
	
	/*�رո�dialog��ʹ��ʱ�������.close();����*/
	Dialog.prototype.close = function(){
		//alert('close');
		this.get("dl")&&this.get("dl").destroy();
	};
	
	
	/*���ظ�dialog��ʹ��ʱ�������.hide();����*/
	Dialog.prototype.hide = function(){
		//alert('hide');
		this.get("dl")&&this.get("dl").hide();
		
	};
	
	/*��ʾ��dialog��ʹ��ʱ�������.show();����*/
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
