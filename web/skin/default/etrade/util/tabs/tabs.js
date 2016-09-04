/**
 * TAB切换工具
 */
KISSY.add( KISSY.myPackageName+"/util/tabs/tabs",function (S,Base,DOM,Event) {

	var Tabs = function (config){
		Tabs.superclass.constructor.call(this,config);
	};
	
	S.extend(Tabs,Base);//继承基类
	
	Tabs.ATTRS = {
		/**
		 * TAB的root层样式，最好能识别是当前页的唯一样式
		 */
		rootCls: {value:'nav-tabs'},
		/**
		 * 事件标签
		 */
		tags: {value:'a'},
		/**
		 * {String} 角色名
		 */
		roleName : {value:'nav'},
		/**
		 * {String} 激活样式
		 */
		activeCls:{value:'active'},
		/**
		 * {Function} 回调函数
		 * o为当前激活对象
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
				/*判断当前tab点击是否已经是激活状态*/
				if(pce&&String(DOM.attr(pce,"class")).indexOf(activeCls)!=-1)return;
				
				/*清除非点击tab激活状态样式*/
//				var rootCls=_self.get("rootCls");
//				var arr=DOM.children('.'+rootCls,'.'+activeCls);
				
				S.each(DOM.children(DOM.parent(pce,'ul'),'.'+activeCls),function(o,n){
					DOM.removeClass(o,activeCls);
				});
				
				/*为选中tab加上激活样式*/
				DOM.addClass(pce,activeCls);
				if(!DOM.test(ce,'[role="'+_self.get("roleName")+'"]')){
					ce=DOM.parent(ce,'a');
				}
				/*执行回调函数 第二个参数为当前选择tab对象*/
				_self.get("callback").call(_self.get("callback"),ce);
			}
		});
	};

	return Tabs;
},{
    requires: ['base','dom','event']
});
