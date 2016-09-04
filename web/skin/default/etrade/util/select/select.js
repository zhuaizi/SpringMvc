/**
 * selectģ��
 * 
 * @author ����
 * @since 2013-11-05
 * @version 1.0
 * @see menubutton
 */
KISSY.add(KISSY.myPackageName+"/util/select/select", function (S,MenuButton,DOM,NodeList,Menu) {

	var SelectBu = function(config){
		SelectBu.superclass.constructor.call(this,config);
	};
	
	
	
	S.extend(SelectBu,MenuButton,{/*ʵ�������Ժͷ���(ע��˽�з�����'_'ǰ׺)*/
		render : function(){
			/*���ø��෽��*/
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
			if(S.UA.ie > 9){//fix ie11�������޷����������
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
	            // ���ö��뷽ʽ, ����ͨ�� Align ����һ��
	            // ������ͬ�˵�������
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
                content: 'ȫ��'
            }),0);
        }

	       return _selectObj;
		}
	},{/*��̬���Ժͷ���*/
		ATTRS:{
			/**
			 * ��Ⱦ��select������name
			 * @type {Boolean}
			 */
			name:{value:''},
			nameid:{
                	value :false
                },
			elCls:{value:''},
			/**
			 * select��ʾ�߶�
			 * @type {Boolean}
			 */
			height:{value:150},
			/**
			 * �����߶ȣ�����ʱ��Ĭ�ϸ߶�
			 */
			inputH:{value:undefined},
			hasAll : false
		}
	});
	return SelectBu;
},{
	requires: ['menubutton','dom','node','menu',KISSY.myPackageName+'/css/mode/select.css']
});