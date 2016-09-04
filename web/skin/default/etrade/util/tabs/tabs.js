/**
 * TAB�л�����
 */
KISSY.add( KISSY.myPackageName+"/util/tabs/tabs",function (S,Base,DOM,Event) {

	var Tabs = function (config){
		Tabs.superclass.constructor.call(this,config);
	};
	
	S.extend(Tabs,Base);//�̳л���
	
	Tabs.ATTRS = {
		/**
		 * TAB��root����ʽ�������ʶ���ǵ�ǰҳ��Ψһ��ʽ
		 */
		rootCls: {value:'nav-tabs'},
		/**
		 * �¼���ǩ
		 */
		tags: {value:'a'},
		/**
		 * {String} ��ɫ��
		 */
		roleName : {value:'nav'},
		/**
		 * {String} ������ʽ
		 */
		activeCls:{value:'active'},
		/**
		 * {Function} �ص�����
		 * oΪ��ǰ�������
		 */
		callback:{value:function(o){}}
	};
	
	
	Tabs.prototype.render = function(){
		var _self=this;
		Event.on(_self.get("tags")+'[role="'+_self.get("roleName")+'"]','click',function(e){	
			var activeCls=_self.get("activeCls");
			var ce=e.target;
			if(ce){
				var pce=DOM.parent(ce,'li');
				/*�жϵ�ǰtab����Ƿ��Ѿ��Ǽ���״̬*/
				if(pce&&String(DOM.attr(pce,"class")).indexOf(activeCls)!=-1)return;
				
				/*����ǵ��tab����״̬��ʽ*/
//				var rootCls=_self.get("rootCls");
//				var arr=DOM.children('.'+rootCls,'.'+activeCls);
				
				S.each(DOM.children(DOM.parent(pce,'ul'),'.'+activeCls),function(o,n){
					DOM.removeClass(o,activeCls);
				});
				
				/*Ϊѡ��tab���ϼ�����ʽ*/
				DOM.addClass(pce,activeCls);
				if(!DOM.test(ce,'[role="'+_self.get("roleName")+'"]')){
					ce=DOM.parent(ce,'a');
				}
				/*ִ�лص����� �ڶ�������Ϊ��ǰѡ��tab����*/
				_self.get("callback").call(_self.get("callback"),ce);
			}
		});
	};

	return Tabs;
},{
    requires: ['base','dom','event']
});
