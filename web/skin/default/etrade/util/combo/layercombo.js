/**
 * 弹层级联列表框公共基础模块
 * 
 * @author 周忠友
 * @since 2013-10-08
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/combo/layercombo", function (S,Base,Event,DOM,IO,Popup,Pager) {

	var LayerCombo = function(config){
		LayerCombo.superclass.constructor.call(this,config);
	};
	var DOC = S.one(document);
	S.extend(LayerCombo,Base);//继承基类
	
	LayerCombo.ATTRS = {
		/**
		 * 触发该弹层的元素的id数组
		 * @type {String[]} 元素id数组
		 */
		triggers : {value:[]},
		/**
		 * 主请求地址(各个层级用同一地址，以opers区分请求不同数据)
		 * @type {String} url地址
		 */
		url : {value:''},
		/**
		 * 请求参数oper的取值，不同值对应取不同层级数据(注：按层级从大到小的顺序)
		 * 	<br/>该参数的长度确定数据的层级，如：['oper1','oper2']表示2层
		 * @type {String[]} 请求参数
		 */
		opers:{value:[]},
		/**
		 * 请求参数
		 * @type {Object} 请求参数不接受复杂嵌套参数，最好是基本的Key-Value键值对
		 */
		params:{value:{oper:''}},	
		/**
		 * 重要：用于确定层级和每个层级所依赖的参数的参数名称，默认后一层级依赖前面所有层级的id
		 * 如：refParam : {value:{'getProvince':[],'getCity':['city_no'],'getCounty':['city_no','area_no']}}
		 * 注意：后一层级会依赖前面所有层级的id，需要依次给出参数名，如果不需要该参数，就把参数名命名为跟数据库查询不一致的名称即可，也就是各级参数名的个数不能改变
		 */
		refParam : {value:{}},
		/**
		 * getValue方法返回值之间的分隔符，默认为一个空格' '
		 * 
		 * @type {String}
		 */
		separator : {value:' '},
		/**
		 * 结果集
		 *  如：{'id1':[{id:1,name:'四川'},{id:1,name:'成都'},{id:1,name:'锦江区'}],'id2':[...]}
		 *  id1、id2对应triggers数组中的元素
		 * @type {Object}
		 */
		rs	: {value:{}},
		/**
		 * 是否根据已选择的值，初始化link(顶部已选中导航)
		 */
		initLink : {value:true},
		/**
		 * 是否初始化显示拼音过滤
		 */
		initPWords : {value:true},
		/**
		 * 当选择后是否给关联输入框设值并触发输入框的onblur事件，默认true
		 */
		initRawValue:{value:true},
		/**
		 * 后台返回json结果列表的名字，同Ext.data.Store的配置
		 */
		root          : {value:'resultlist'},
		/**
		 * 后台返回json结果的总数的名字，同Ext.data.Store的配置
		 */
		totalProperty : {value:'rows_count'},
		/**
		 * 每页显示数据条数，默认24条
		 */
		pageSize : {value:24},
		/**
		 * 每行显示多少条数据
		 */
		rowNum   : {value:6},
		/**
		 * 没有数据时的提示语
		 */
		emptText:{value:'没有数据'},
		/**
		 * 层
		 */
		zIndex :{value:99999}
	};
	
	/* |-->private */
	/**
	 * 弹出层是否是显示状态
	 * 
	 * @type {Object} 如：{isLayer:false,pre:null}，pre是弹层上一次弹出的位置元素
	 */
	var _isLayer = {isLayer:false,pre:null};
	/**
	 * /util/overlay/popup对象
	 */
	var _popup = new Popup();
	
	/**
	 * 当前触发弹层的元素的id，triggerId
	 */
	var _current = '';
	/**
	 * 当前是查询结果的第几页，默认为第一页
	 */
	var _currentPage = 1;
	/**
	 * 是否正在加载
	 */
	var _isLoading=false;
	/**
	 * 26个英文单词数组
	 */
	var _pWords = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var _divLinkId = "layer-combo-link";
	var _divPWordsId = "layer-combo-words";
	var _divMainId = 'layer-combo-main';
	var _inputKeyWordsId = 'layer-combo-keyWords';
	/**
	 * 选中后的链接模板函数
	 */
	var _linkTplFn = baidu.template('<a href="javascript:void(0);" level="0" role="link">全部</a><%for(var i = 0; i < link.length; i++){%><span>/</span><a href="javascript:void(0);" level="<%=i+1%>" role="link"><%=link[i].name%></a><%}%>');
	/**
	 * 拼音首字母过滤模版函数
	 */
	var _pWordsTplFn = baidu.template('<div class="col-md-1"><button role="pWords" type="button" class="btn btn-warning btn-xs">全部</button></div><div class="col-md-11 words-area"><%for(var i = 0;i < pWords.length; i++){%><a href="javascript:void(0);" role="pWords"><%=pWords[i]%></a><%}%></div>');
	/**
	 * 主要显示内容模版函数
	 */
	var _mainTplFn = baidu.template('<div class="row txt-area override-row"><%if(rows == 0){%><h4 style="color: gray;margin-left: 15px;"><%=emptText%></h4><%}%>' +
			'<%for(var i = 0; i < rows; i++){%><div class="row override-row"><%for(var j = i*rowNum; j < i*rowNum+rowNumArr[i]; j++){%><a href="javascript:void(0);" class="col-md-2" role="main" pid="<%=list[j].id%>"><%=list[j].name%></a><%}%></div><%}%></div>' +
			'<div class="row page-area override-row"><ul class="pagination pagination-sm col-md-8" style="padding-left:15px;"><%if(pager.firstPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.firstPage%>">&laquo;</a></li><%}%><%if(pager.prePage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.prePage%>">&lsaquo;</a></li><%}%>'+
'<%for(var i = pager.pageStart; i <= pager.pageEnd;i++){%><li><%if(pager.currentPage != i){%><a href="javascript:void(0);" role="page" page="<%=i%>"><%=i%></a><%}else{%><span style="color: red;"><%=i%></span><%}%></li><%}%><%if(pager.nextPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.nextPage%>">&rsaquo;</a></li><%}%>'+
'<%if(pager.lastPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.lastPage%>">&raquo;</a></li><%}%><li><span>共<%=pager.totalPage%>页</span></li></ul><p class="col-md-4" style="text-align:right; margin-top:23px;">'+
'<button type="button" class="btn btn-warning btn-xs" style="margin-right: 2px;" role="back">&lt; 返回上级</button>'+
'<button type="button" class="btn btn-danger btn-xs" role="close">[×关闭]</button></p></div>');

	var _mainHtml = '<div class="row area-me override-row">' +
			'<div class="row override-row" style="border-bottom:#e2e2e2 solid 1px; margin-top:15px; padding-bottom:10px;">' +
			'<div id="layer-combo-link" class="col-md-6 sec-area"></div>' +
			'<div class="col-md-6 input-group input-group-sm">' +
			'<input id="layer-combo-keyWords" type="text" class="form-control" placeholder="请输入关键字">' +
			'<span class="input-group-btn"><button role="keyWords" class="btn btn-default" type="button">搜索</button></span>' +
			'</div>' +
			'</div>' +
			'<div class="row list-area override-row" style="padding-top:15px;">' +
			'<div id="layer-combo-words" class="row all-area override-row" style="margin-bottom:15px;">' +
			'</div>' +
			'<div id="layer-combo-main" style="margin: 0px 0px;padding: 0px 0px;">' +
			'</div></div></div>';
	


	/**
	 * 注册触发弹层的元素
	 * @param {LayerCombo} _self 当前弹层本身
	 */
	var _triggerReg = function(_self){
		var triggerArr = _self.get('triggers');
		var len = triggerArr.length;
		for(var i = 0; i < len; i++){
			Event.delegate('#'+triggerArr[i],'click','',function(e){
				if(!_isLayer.isLayer || _isLayer.pre != e.target){										
					_initMain(_self,null);
					_isLayer.pre = e.target;
					_current = e.target.id;
					_self.show(e.target.id);
				}else{
					_current ='';
					_self.hide(_isLayer.pre.id);
				}
			});
			
		}
		
	};
	
	
	
	/**
	 * 初始化顶部选中链接
	 * @param {LayerCombo} _self 当前弹层本身
	 * @type {Boolean} isInit 是否是初始化操作
	 */
	var _initLink = function(_self,isInit){
		var data = {};
		data.link = _self.getValues(_current);
		if(isInit)data.link == _self.get('initLink')?_self.getValues(_current):[];
		DOM.empty("#"+_divLinkId);
		DOM.html("#"+_divLinkId,_linkTplFn(data));
		_operReg('link',_self);
	};
	/**
	 * 初始化拼音过滤
	 * @param {LayerCombo} _self 当前弹层本身
	 */
	var _initPWords = function(_self){		
		if(_self.get('initPWords')){
			var data = {pWords:_pWords};
			DOM.empty("#"+_divPWordsId);
			DOM.html("#"+_divPWordsId,_pWordsTplFn(data));
			_operReg("pWords",_self);
		}else{
			DOM.html("#"+_divPWordsId,'');
		}
	};
	/**
	 * 初始化内容
	 * 
	 * @param {LayerCombo} _self 当前弹层本身
	 * @type {Object} 后台返回数据结果集 如：{rows_count:5,list:[{....}]}
	 */
	var _initMain = function(_self,dataRs){
		if(!dataRs){
			dataRs={};
			dataRs[_self.get('totalProperty')] = 0;
			dataRs[_self.get('root')] = [];
		}
		
		
		
		/**
		 * 每行显示条数
		 */
		var rowNum = _self.get('rowNum');
		/**
		 * 当前页数据显示多少行
		 */
		var rows = (dataRs[_self.get('root')].length/rowNum).ceil();
		/**
		 * 每行中最后一个数据在整个数据中的位置数组
		 */
		var rowNumArr = [];

		for(var i = 0; i < rows; i++){
			if(i == rows - 1){
				rowNumArr[i] = dataRs[_self.get('root')].length%rowNum == 0?rowNum:dataRs[_self.get('root')].length%rowNum;
			}else{
				rowNumArr[i] = rowNum;
			}
		}
		
		
		
		/**
		 * 分页数据
		 */
		var pager = new Pager({pageSize:_self.get('pageSize'),currentPage:_currentPage,totalSize:dataRs[_self.get('totalProperty')]}).culatePage();
		var data = {rows:rows,rowNum:rowNum,rowNumArr:rowNumArr,len:dataRs[_self.get('root')].length,list:dataRs[_self.get('root')],pager:pager,emptText:_self.get('emptText')};
		DOM.empty('#layer-combo-main');
		DOM.html('#layer-combo-main',_mainTplFn(data));
		
		_operReg('main',_self);
		_operReg('page',_self);
		_operReg('back',_self);
		_operReg('close',_self);
		_currentPage = 1;/*重置页数*/
		DOM.val('#'+_inputKeyWordsId,'');/*重置搜索框*/
	};
	/**
	 * 
	 * 清除数组中对应的参数
	 * 
	 * @param {LayerCombo} _self 当前弹层本身
	 * @param {String[]} paramNames 参数名数组
	 */
	var _deleteParam = function(_self,paramNames){
		var param = _self.get('params');
		var len = paramNames.length;
		for(var i = 0; i < len; i++){
			delete param[paramNames[i]];
		}
	};
	
	/**
	 * 修改查询参数
	 * @param {LayerCombo} _self 当前弹层本身
	 * @param {Number} level 当前查询的层级
	 */
	var _delParam = function(_self,level){
		var param = _self.get('params');
		if(level == _self.get('opers').length){
			return ;
		}
		param.oper = _self.get('opers')[level];
		var refParam = _self.get('refParam')[param.oper];
		for(var i = 0; i < refParam.length; i++){
			param[refParam[i]] = _self.getValues(_current)[i].id;
		}
	};
	
	/**
	 * 当层级改变的时候修改显示
	 * @param {LayerCombo} _self 当前弹层本身
	 * @param {Number} level 修改到的层级
 	 */
	var _setChangeLevel = function(_self,level){
		var len = _self.getValues(_current).length;
		if(level < len){
			_self.get('rs')[_current].splice(level,len - level);
		}
		_initLink(_self,false);			
		if(_self.get('initRawValue')){
			_self.setRawValue(_current);//为id为_current的输入框设置当前选择的值
			Event.fire('#'+_current,'blur');//触发输入框的blur事件(数据验证加载该输入框的blur事件上)
		}		
		_self.fire('select',{self:_self,level:level,cid:_current});
	};
	/**
	 * 获取关联id参数的参数名数组
	 */
	var _getRefIdNames = function(_self){
		var len = _self.get('opers').length;
		return _self.get('refParam')[_self.get('opers')[len - 1]];
	};
	/**
	 * 为已定义角色添加点击监听
	 * 
	 * @type {String} role 角色名
	 * @param {LayerCombo} _self 当前弹层本身
	 */
	var _operReg = function(role,_self){	
		Event.delegate('[role="'+role+'"]','click','',function(e){	
			
			if(role == 'link'){/*顶部链接*/
				var level = DOM.attr(e.target,'level');
				if(level==_self.get('opers').length){
					_self.hide(_current);
				}else{					
					_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
					_delParam(_self,level);
					_loadData(_self);				
					_setChangeLevel(_self,level);
				}
			}else if(role == 'pWords'){/*拼音链接*/
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				_delParam(_self,_self.getValues(_current).length);		
				_self.get('params').pWords = (DOM.html(e.target) == '全部'?'':DOM.html(e.target)).toLowerCase();
				_loadData(_self);
			}else if(role == 'main'){/*内容链接*/
				if(_isLoading)//加载完下一级之前不做操作  dengbl
					return;
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				var currentRs = _self.getValues(_current);
				var level = currentRs.length;
				var thisObj = {id:DOM.attr(e.target,'pid'),name:DOM.html(e.target)};				
				currentRs[level] = thisObj;/*当前选中的值存入values*/
				_self.setValues(_current,currentRs);			
				if(level < _self.get('opers').length - 1){
					_delParam(_self,level+1);
					_loadData(_self);
					_setChangeLevel(_self,level+1);
				}else{					
					_self.hide(_current);
					_setChangeLevel(_self,level + 1);
				}		
				
			}else if(role == 'page'){/*分页工具条链接*/
				_deleteParam(_self,['oper'].concat(_getRefIdNames(_self)));
				_currentPage = DOM.attr(e.target,'page');
				_delParam(_self,_self.getValues(_current).length);
				_loadData(_self);
			}else if(role == 'back'){/*返回上一级链接*/
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				var level = _self.getValues(_current).length;				
				if(level == 0){
					/*alert("已经是最高级了！");*/
				}else{
					_delParam(_self,level - 1);
					_loadData(_self);
					_setChangeLevel(_self,level - 1);
				}
			}else if(role == 'close'){/*关闭链接*/	
				_self.hide(_current);
			}else if(role == 'keyWords'){
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				_delParam(_self,_self.getValues(_current).length);
				_self.get('params').keyWords = DOM.val('#'+_inputKeyWordsId);
				_loadData(_self);
			}
		});
	};
	/**
	 * 加载数据
	 * 
	 * @param {LayerCombo} _self 当前弹层本身
	 */
	var _loadData = function(_self){
		_isLoading=true;
		var pager = new Pager({pageSize:_self.get('pageSize'),currentPage:_currentPage}).culatePage();
		_self.get('params').start = pager.start;
		_self.get('params').limit = pager.limit;
		_self.get('params').pageSize = pager.pageSize;
		if(_self.get('params').oper != null){
			IO.post(_self.get('url'),_self.get('params'),function(text){
				var rsData = null;
				if(text)rsData = eval("("+text+")");
				_initMain(_self,rsData);
				_isLoading=false;
			});
		}else{
			_initMain(_self,null);
			_isLoading=false;
		}
	};
	
	var _clickoutside = function(e){

		if(e.target =='javascript:void(0);'){return;}
	var target = S.one(e.target);
	var self = this;

	   if (target.hasClass('area-me') || target.parent('div.area-me') || (target.attr("id") && target.attr("id") == _current)) {
	   return;
	}
	if(_current){
   		self.hide(_current);
	}
		};
	
	/* <--|private */
	
	/* |-->public */
	LayerCombo.prototype.init = function(){		
		var _self = this;
		var layer = _popup.layer("",_mainHtml);
		
		layer.set("width",560);
		layer.set('zIndex',_self.get('zIndex'));
		_self.on('show',function(e){ 
			_isLayer.isLayer = true;
			_initLink(_self,true);
			_initPWords(_self);	
			_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
			_delParam(_self,_self.get('initLink')?_self.getValues(_current).length:0);			
			_loadData(_self);
			_operReg('keyWords',_self);
		});
		_self.on('hide',function(e){
			_initMain(_self,null);
			_isLayer.isLayer = false;
		});
		
		
		_triggerReg(_self);
	};
	
	LayerCombo.prototype.render = function(){
		var _self = this;
		
		var refParam = _self.get('refParam');
		var opers = [];
		for(var i in refParam){
			opers.push(i);
		}
		_self.set('opers',opers);
		_self.init();		
	};
	
	/**
	 * 获取id对应的元素已选择的内容，内容中间用separator分隔，默认为一个空格分隔
	 * 
	 * @type {String} id 触发弹层的元素id
	 * @type {String} separator 分隔符，默认为一个空格分隔
	 */
	LayerCombo.prototype.getRawValue = function(id){
		var _self = this;
		var rsArr = _self.getValues(id);
		
		var len = rsArr.length;
		var value = new Array();
		for(var i = 0; i < len;i++){
			if(i < len -1){
				value.push(rsArr[i].name+_self.get('separator'));
			}else{
				value.push(rsArr[i].name);
			}
		}
		return value.join("");
	};
	/**
	 * 为弹层关联元素设置value属性值，当参数value为空时，设置为当前弹层在该元素上选中的值
	 * 
	 * @type {String} id 触发弹层的元素id
	 * @type {String} value 要设置的值，为空时，设置为当前弹层在该元素上选中的值
	 */
	LayerCombo.prototype.setRawValue = function(id,value){
		value = value?value:this.getRawValue(id);
		DOM.val('#'+id,value);
	};
	
	/**
	 * 获取id对应的元素已选择的内容，内容格式为[{id:1,name:'四川'},{id:1,name:'成都'},{id:1,name:'锦江区'}]
	 * 数组下标表示层级关系
	 * 
	 * @type {String} id 触发弹层的元素id
	 * 
	 * @return {Object[]}
	 */
	LayerCombo.prototype.getValues = function(id){
		return this.get('rs')[id]?this.get('rs')[id].slice(0):[];
	};
	/**
	 * 设置id对应的元素已选择的内容，内容格式为[{id:1,name:'四川'},{id:1,name:'成都'},{id:1,name:'锦江区'}]
	 * 数组下标表示层级关系，要注意顺序，高级别在前
	 * 
	 * @type {String} id 触发弹层的元素id
	 * @type {Object[]} values 格式为[{id:1,name:'四川'},{id:1,name:'成都'},{id:1,name:'锦江区'}]
	 */
	LayerCombo.prototype.setValues = function(id,values){
		if(!values)values=[];
		this.get('rs')[id] = values;
	};
	/**
	 * 显示弹层
	 * @type {String} id 在id为id的元素上弹出该弹层
	 */
	LayerCombo.prototype.show = function(id){		
		_popup.layer('#'+id,undefined,undefined,undefined,this.get("zIndex")).show();
		var self = this;
		
		S.later(function() {
				
                DOC.on('click', _clickoutside, self);
            }, 100, false);
		
		this.fire('show',{});
	};
	/**
	 * 关闭弹层
	 * @type {String} id 关闭在id为id的元素上弹出的弹层
	 */
	LayerCombo.prototype.hide = function(id){		
		_popup.layer('#'+id).hide();
		
		this.fire('hide',{});
	};
	
	
	
	LayerCombo.prototype.clear = function(){
		_self = this;
		var triggerArr = _self.get('triggers');
		var len = triggerArr.length;
		for(var i = 0; i < len; i++){
			_current =triggerArr[i];
			_setChangeLevel(_self,0);
		}
		
	}
	
	/* <--|public */
	
	
	return LayerCombo;
},{
	requires: ["base",'event',"dom",'io',KISSY.myPackageName+"/util/overlay/popup",KISSY.myPackageName+"/util/pager",KISSY.myPackageName+'/css/mode/layercombo.css']
});
