/**
 * 分页下拉框模块
 * 事件：show 参数：e.combo 表示combo本身
 * 事件：hide 参数：e.combo 表示combo本身
 * 事件：select 参数：e.combo 表示combo本身
 * 
 * @author 周忠友
 * @since 2013-11-05
 * @version 1.0
 * @example
 * 	事件： combo.on('select',function(e){
 * 			alert(e.combo);
 * 		 });
 */
KISSY.add(KISSY.myPackageName+"/util/combo/combo-box", function (S,Node,Base,DOM,Event,IO,JSON,Popup,Pager) {
	var DOC = S.one(document);
	var _N = Node.all;
	var ComboBox = function(config){
		ComboBox.superclass.constructor.call(this,config);
	};
	var old_val = {key:'',value:''};
	S.extend(ComboBox,Base,{
		_layer : null,
		_isLayer:false,
		
		_setUniqueTag: function() {
            var self = this;
            var guid = S.guid();
            self._comboId = 'combox-' + guid;
            self._triggerNodeIcon = 'trigger-icon-' + guid;
            self._triggerNodeClassName = 'trigger-node-' + guid;

            return self;
        },
		render:function(){
			
			var _combo = this;
			_combo._setUniqueTag();
			_combo.set('alignNode',_combo.get('alignNode')?_combo.get('alignNode'):_combo.get('input'));
			var initWidth = DOM.outerWidth(_combo.get('alignNode')) > 150?DOM.outerWidth(_combo.get('alignNode')):150;
			
			_combo.set('listWidth',_combo.get('listWidth')?_combo.get('listWidth'):initWidth);
			_combo._layer = new Popup().layer(_combo.get('alignNode'),'<div rid="'+_combo.get('input')+'" style="width:'+_combo.get('listWidth')+'px;"><div>',undefined,undefined,_combo.get('zIndex'));
			DOM.addClass(_combo.get('trigger'),_combo._triggerNodeIcon);
			DOM.addClass(_combo.get('input'),_combo._triggerNodeClassName);
			Event.on(_combo.get('trigger'),'click',function(){				
				_combo.show();			
				if(_combo._isLayer)_combo._loadData(DOM.val(_combo.get('input')),1);
			});
			Event.on(_combo.get('input'),{'valuechange':function(e){
				_combo.show();
				_combo._loadData(e.newVal,1);
			},'click':function(e){
			
			var target = S.one(e.currentTarget); 
			_combo.show();
			_combo._loadData(target.val(),1);
			
			}});
		},
		/**
		 * 根据baseParam和输入框的值加载数据
		 * @param {String} newVal 输入框当前的内容
		 * @param {Number} currentPage 当前加载第几页
		 */
		_loadData:function(newVal,currentPage){
			var _self = this;
			newVal = S.trim(newVal);
			var param = _self.get('baseParam');
			param[_self.get('keyWordsName')] = newVal;
			var page = new Pager({
				pageSize : _self.get('pageSize'),
				currentPage:currentPage
			}).culatePage();
			param.pageSize = page.pageSize;
			param.start = page.start;
			param.limit = page.limit;
			_self._setContent(ComboBox.TPL_LOADING);
			IO.post(_self.get('url'),param,function(dataRs){
				var data = {
					pager:new Pager({
						pageSize : _self.get('pageSize'),
						currentPage:currentPage,
						totalSize:dataRs[_self.get('totalProperty')]
					}).culatePage(),
					total : dataRs[_self.get('totalProperty')],
					list : dataRs[_self.get('root')],
					len : dataRs[_self.get('root')].length,
					fields:_self.get('fields'),
					roleId:_self.get('input'),
					comboxId:_self._comboId,
					listStr:[]
				};
				for(var i = 0; i < data.len;i++){
					data.listStr.push(JSON.stringify(data.list[i]));
				}
				_self._setContent(ComboBox.TPL_MAIN_FN(data));
			},'json');
		},
		clear : function(){
			var _combo = this;
			_combo.set('_selected',{key:'',value:''});
			_combo.setRawValue('');
			_combo.setKeyValue('');
			_combo.fire('select',{combo:_combo,boxData:{}});
				
		},_setContent : function(html){
			var _combo = this;
			DOM.empty('div[rid="'+_combo.get('input')+'"]');
			DOM.html('div[rid="'+_combo.get('input')+'"]',html);
			Event.on('a[role="link-'+_combo.get('input')+'"]','click',function(e){
				_combo.set('_boxData',JSON.parse(DOM.attr(e.target,'box-data')));
				
				_combo.set('_selected',{key:DOM.attr(e.target,'pid'),value:DOM.html(e.target)});
				old_val = _combo.get('_selected');
				_combo.setRawValue(old_val.value);
				_combo.setKeyValue(old_val.key);
				_combo.hide();
				_combo.fire('select',{combo:_combo,boxData:_combo.get('_boxData')});
				Event.fire(_combo.get('alignNode'),'blur');
			});
			Event.on('a[role="page-'+_combo.get('input')+'"]','click',function(e){
				_combo._loadData(DOM.val(_combo.get('input')),DOM.attr(e.target,'page'));
			});
		},
		/**
		 * 为关联输入框设置显示值
		 */
		setRawValue:function(v){
			DOM.val(this.get('input'),v);
			this.get('_selected').value= v;
		},
		setKeyValue:function(v){
			try{
				var nid = this.get('nameid');
			if(nid !=null && nid.length>0){
				DOM.val(nid,v);
			}
			this.get('_selected').key= v;
				
			}catch(e){}
		},
		getRawValue:function(){
			return this.get('_selected').value;
		},
		/**
		 * 为当前下来框设置key值
		 */
		setValue:function(key){
			this.get('_selected').key= key;
		},
		/**
		 * 获取id值
		 */
		getValue:function(){
			return this.get('_selected').key;
		},
		/**
		 * 获取参数盒对象
		 */
		getBoxData:function(){
			return this.get('_boxData');
		},
		/**
		 * 通过给定id选择对应数据
		 * 
		 * @param {Object} KV 形如：{key:'11',value:'显示值'}的对象
		 * @param {Object} boxData 参数盒对象形如：{key:'11',value:'显示值',ref:'fdf',ref2:'dddd'}，注意必须包含key和value(非必填)
		 */
		initData:function(KV,boxData){
			this.get('_selected') = KV;
			this.get('_boxData') = boxData;
			this.setRawValue(KV.value);
			this.setKeyValue(KV.key);
		},
		show:function(){
			 var self = this;
			if(!self._isLayer){
				self.fire('show',{combo:self});
				self._layer.show();
				self._isLayer = true;
				S.later(function() {
				
                DOC.on('click', self._clickoutside, self);
            }, 100, false);
			}
		},
		hide:function(){
			 var self = this;
			if(self._isLayer){
				self.fire('hide',{combo:self});
				self._layer.hide();
				self._isLayer = false;
				DOC.detach('click', self._clickoutside, self);
			}
		},
		_clickoutside:function(e){
			var target = _N(e.target);
			var self = this;
			   if (
                target.hasClass(this._triggerNodeClassName) ||
                target.hasClass(this._triggerNodeIcon) ||
                target.parent('#' + self._comboId)) {
                   return;
                }
               var vl = _N(self.get('input')).val( );
                if(old_val.value != vl){
                	if(self.get('forceselect')==true||self.get('forceselect')=="true"){
                		self.clear();
                	}               	
                }

                self.hide();
		},
		toggle:function(){
			if(this._isLayer){
				this.hide();
			}else{
				this.show();
			}
			return this._isLayer;
		}
	},{
		TPL_MAIN_FN : baidu.template(new StringBuffer([
		'<div class="panel panel-default" id="<%=comboxId%>" style="margin-bottom:0px;">',
		'<div class="panel-body list-group">',
		'<%for(var i = 0; i < len; i++){%>',
		'<a role="link-<%=roleId%>" href="javascript:void(0);" class="list-group-item" style="padding: 2px 5px;border: 0px;" pid="<%=list[i][fields[0]]%>" box-data="<%=listStr[i]%>"><%=list[i][fields[1]]%></a>',
		'<%}%>',
		'</div>',
		'<%if(total>len){%><div class="panel-footer" style="padding: 2px 2px;">',
		'<div align="right">',
		'<ul class="pagination pagination-sm" style="padding:0px;margin:0px;">',
		'<%if(pager.prePageM!=-1){%><li><a role="page-<%=roleId%>" href="javascript:void(0);" page="<%=pager.prePageM%>">&lsaquo;</a></li><%}%>',
		'<%if(pager.nextPageM!=-1){%><li><a role="page-<%=roleId%>" href="javascript:void(0);" page="<%=pager.nextPageM%>">&rsaquo;</a></li><%}%>',
		'<li><span><%=pager.start+1%>-<%=pager.limits%>/共 <%=total%> 条</span></li>',
		'</ul></div></div></div>',
		'<%}%>'
		]).toString()),
		TPL_LOADING:'<div class="panel panel-default"><img src="$!{gsc.context}/skin/default/etrade/images/mode/tao-loading.gif" style="width: 20px; height: 20px; overflow:hidden; margin:5px;"></div>',
		ATTRS:{
		
			_boxData:{value:null},
			/**
			 * 选择好的数据对象，包括Key和Value
			 * @type {Object}
			 */
			_selected:{key:'',value:''},
			/**
			 * 输入框选择器
			 * @type {String}
			 */
			input:{value:''},
			/**
			 * 触发元素选择器
			 * @type {String}
			 */
			trigger:{value:''},
			/**
			 * 弹层显示的位置，相对元素的选择器，不填写是默认为input对应的元素
			 * @type {String}
			 */
			alignNode:{value:null},
			/**
			 * 下来框的宽度(默认为alignNode元素的宽度，如果alignNode不存在则为input的宽度)
			 * @type {Number}
			 */
			listWidth	: {value:null},
			/**
			 * 访问数据地址
			 * @type {String} 
			 */
			url		: {value:''},
			/**向id字段赋值*/
			nameid : {value:''},
			/**
			 * 数据对象的格式，默认：{key:1,value:'aaa'}
			 * @type {Array}			 
			 */
			fields	: {value:['key','value']},
			/**
			 * 基本参数
			 */
			baseParam:{value:{}},
			/**
			 * 输入值查询条件的名称,默认：keyWords
			 * @type {String}
			 */
			keyWordsName:{value:'keyWords'},
			/**
			 * 每次加载多少条数据
			 * @type {Number}
			 */
			pageSize:{value:5},
			/**
			 * 后台返回json结果列表的名字，同Ext.data.Store的配置
			 */
			root          : {value:'resultlist'},
			/**
			 * 后台返回json结果的总数的名字，同Ext.data.Store的配置
			 */
			totalProperty : {value:'rows_count'},
			
			zIndex : {value:99999},
			
			/**
			 * 是否强制选择
			 */
			forceselect : {value:true}
		}
	});
	
	return ComboBox;
},{
	requires: ['node','base','dom','event','io','json',KISSY.myPackageName+"/util/overlay/popup",KISSY.myPackageName+"/util/pager"]
});