/**
 * select模块
 * 
 * @author 李龙
 * @since 2013-11-05
 * @version 1.0
 * @see menubutton
 */
KISSY.add(KISSY.myPackageName+"/util/select/select", function (S,MenuButton,DOM,NodeList,Menu) {

	var SelectBu = function(config){
		SelectBu.superclass.constructor.call(this,config);
	};
	
	
	
	S.extend(SelectBu,MenuButton,{/*实例化属性和方法(注意私有方法加'_'前缀)*/
		render : function(){
			/*调用父类方法*/
			SelectBu.superclass.render.call(this);
			
			var _select = this;
			
			var name = "select[name='"+_select.get('name')+"']";
			
			var _elCls = _select.get('elCls');
			if(_elCls.length <= 0){
				var _cl = ""+DOM.attr(name,"class");
				S.each(_cl.split(" "),function(item) {
					if(item.indexOf("col-md-") != -1){
						_elCls = item;
					}
				});
			}
			var ht = _select.get('height')?_select.get('height'):150;
			var est = {overflow:"auto",overflowX:"hidden"};
			if(S.UA.ie > 9){//fix ie11滚动条无法点击的问题
				ht ='auto';
				est = {};
			}
			_selectObj=MenuButton.Select.decorate(name, {
	            prefixCls:"pix-",
	            borderWidth:false,
	            elCls:_elCls,
	            width:_select.get('width')?_select.get('width'):null,
	            nameid : _select.get('nameid'),
	            height : _select.get('inputH')?_select.get('inputH'):DOM.outerHeight(name,false),
	            // 设置对齐方式, 与普通的 Align 大体一致
	            // 该配置同菜单配置项
	            menuCfg:{
	                align:{
	                    offset:[0, -1]
	                },
	                height:ht,
	                
	                elStyle:est
	            }
	        });
        if(_select.get('hasAll') == true){
	        _selectObj.addItem(new Menu.Item({
	        	 prefixCls:"pix-",
	            borderWidth:false,
	            elCls:_elCls,
				value: "",
                content: '全部'
            }),0);
        }

	       return _selectObj;
		}
	},{/*静态属性和方法*/
		ATTRS:{
			/**
			 * 渲染的select的容器name
			 * @type {Boolean}
			 */
			name:{value:''},
			nameid:{
                	value :false
                },
			elCls:{value:''},
			/**
			 * select显示高度
			 * @type {Boolean}
			 */
			height:{value:150},
			/**
			 * 输入框高度，不填时又默认高度
			 */
			inputH:{value:undefined},
			hasAll : false
		}
	});
	return SelectBu;
},{
	requires: ['menubutton','dom','node','menu',KISSY.myPackageName+'/css/mode/select.css']
});