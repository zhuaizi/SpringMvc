KISSY.add(KISSY.myPackageName+"/util/loadpage", function (S,Base,DOM,Event,IO) {
	
	var Loadpage = function(config){
		Loadpage.superclass.constructor.call(this,config);
	};
	
	S.extend(Loadpage,Base,{
		render : function(){
			/*调用父类方法*/
			var _self = this;
			var uid = S.guid('load');
			var def = {
				goback : uid,
				layout		: 't'
			};

			_self.set('data', S.merge(_self.get('data'),def));
			var vp = _self.get('view_panel');
			DOM.attr(vp,'uid',uid);
			Event.on(vp,'load',function(){
				
				_self.loading();
			});
		
			_self = _self.loading();
			return _self;
		},
		loading : function(){
			var _self = this;
			
			DOM.hide(_self.get('list_panel'));
			DOM.empty(_self.get('view_panel'));
			DOM.html(_self.get('view_panel'),'<img src="$!{gsc.context}/skin/default/etrade/images/mode/tao-loading.gif">');
			
			 IO({
				data 	: _self.get('data'),
				headers	: {'Client-Type':'kiss'},
				url 	: _self.get('url'),
				type :'GET',
				success : function(result){
					if(S.UA['ie']){
						var t='t='+S.tag;
						result = result.replace('"></script>','?'+t+'"></script>');
					}
					_self.get("onsuccess").call(_self.get("onsuccess"),result,_self);
				},
				error	: function(){
					DOM.empty(_self.get('view_panel'));
					DOM.show(_self.get('list_panel'));
					_self.get("onerror").call(_self.get("onerror"),_self);
		 		}
			});
			
			return _self;
		}
	},{/*静态属性和方法*/
		ATTRS:{
			list_panel:{value:null},
			view_panel:{value:null},
			headers:{value:{}},
			data:{value:{}},
			url:{value:''},
			onsuccess:{value:function(o){}},
			onerror:{value:function(o){}}
		}
	});
	
	return Loadpage;
},{
    requires: ['base','dom','event','io']
});