/**
 * ���㼶���б�򹫹�����ģ��
 * 
 * @author ������
 * @since 2013-10-08
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/combo/layercombo", function (S,Base,Event,DOM,IO,Popup,Pager) {

	var LayerCombo = function(config){
		LayerCombo.superclass.constructor.call(this,config);
	};
	var DOC = S.one(document);
	S.extend(LayerCombo,Base);//�̳л���
	
	LayerCombo.ATTRS = {
		/**
		 * �����õ����Ԫ�ص�id����
		 * @type {String[]} Ԫ��id����
		 */
		triggers : {value:[]},
		/**
		 * �������ַ(�����㼶��ͬһ��ַ����opers��������ͬ����)
		 * @type {String} url��ַ
		 */
		url : {value:''},
		/**
		 * �������oper��ȡֵ����ֵͬ��Ӧȡ��ͬ�㼶����(ע�����㼶�Ӵ�С��˳��)
		 * 	<br/>�ò����ĳ���ȷ�����ݵĲ㼶���磺['oper1','oper2']��ʾ2��
		 * @type {String[]} �������
		 */
		opers:{value:[]},
		/**
		 * �������
		 * @type {Object} ������������ܸ���Ƕ�ײ���������ǻ�����Key-Value��ֵ��
		 */
		params:{value:{oper:''}},	
		/**
		 * ��Ҫ������ȷ���㼶��ÿ���㼶�������Ĳ����Ĳ������ƣ�Ĭ�Ϻ�һ�㼶����ǰ�����в㼶��id
		 * �磺refParam : {value:{'getProvince':[],'getCity':['city_no'],'getCounty':['city_no','area_no']}}
		 * ע�⣺��һ�㼶������ǰ�����в㼶��id����Ҫ���θ������������������Ҫ�ò������ͰѲ���������Ϊ�����ݿ��ѯ��һ�µ����Ƽ��ɣ�Ҳ���Ǹ����������ĸ������ܸı�
		 */
		refParam : {value:{}},
		/**
		 * getValue��������ֵ֮��ķָ�����Ĭ��Ϊһ���ո�' '
		 * 
		 * @type {String}
		 */
		separator : {value:' '},
		/**
		 * �����
		 *  �磺{'id1':[{id:1,name:'�Ĵ�'},{id:1,name:'�ɶ�'},{id:1,name:'������'}],'id2':[...]}
		 *  id1��id2��Ӧtriggers�����е�Ԫ��
		 * @type {Object}
		 */
		rs	: {value:{}},
		/**
		 * �Ƿ������ѡ���ֵ����ʼ��link(������ѡ�е���)
		 */
		initLink : {value:true},
		/**
		 * �Ƿ��ʼ����ʾƴ������
		 */
		initPWords : {value:true},
		/**
		 * ��ѡ����Ƿ�������������ֵ������������onblur�¼���Ĭ��true
		 */
		initRawValue:{value:true},
		/**
		 * ��̨����json����б�����֣�ͬExt.data.Store������
		 */
		root          : {value:'resultlist'},
		/**
		 * ��̨����json��������������֣�ͬExt.data.Store������
		 */
		totalProperty : {value:'rows_count'},
		/**
		 * ÿҳ��ʾ����������Ĭ��24��
		 */
		pageSize : {value:24},
		/**
		 * ÿ����ʾ����������
		 */
		rowNum   : {value:6},
		/**
		 * û������ʱ����ʾ��
		 */
		emptText:{value:'û������'},
		/**
		 * ��
		 */
		zIndex :{value:99999}
	};
	
	/* |-->private */
	/**
	 * �������Ƿ�����ʾ״̬
	 * 
	 * @type {Object} �磺{isLayer:false,pre:null}��pre�ǵ�����һ�ε�����λ��Ԫ��
	 */
	var _isLayer = {isLayer:false,pre:null};
	/**
	 * /util/overlay/popup����
	 */
	var _popup = new Popup();
	
	/**
	 * ��ǰ���������Ԫ�ص�id��triggerId
	 */
	var _current = '';
	/**
	 * ��ǰ�ǲ�ѯ����ĵڼ�ҳ��Ĭ��Ϊ��һҳ
	 */
	var _currentPage = 1;
	/**
	 * �Ƿ����ڼ���
	 */
	var _isLoading=false;
	/**
	 * 26��Ӣ�ĵ�������
	 */
	var _pWords = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var _divLinkId = "layer-combo-link";
	var _divPWordsId = "layer-combo-words";
	var _divMainId = 'layer-combo-main';
	var _inputKeyWordsId = 'layer-combo-keyWords';
	/**
	 * ѡ�к������ģ�庯��
	 */
	var _linkTplFn = baidu.template('<a href="javascript:void(0);" level="0" role="link">ȫ��</a><%for(var i = 0; i < link.length; i++){%><span>/</span><a href="javascript:void(0);" level="<%=i+1%>" role="link"><%=link[i].name%></a><%}%>');
	/**
	 * ƴ������ĸ����ģ�溯��
	 */
	var _pWordsTplFn = baidu.template('<div class="col-md-1"><button role="pWords" type="button" class="btn btn-warning btn-xs">ȫ��</button></div><div class="col-md-11 words-area"><%for(var i = 0;i < pWords.length; i++){%><a href="javascript:void(0);" role="pWords"><%=pWords[i]%></a><%}%></div>');
	/**
	 * ��Ҫ��ʾ����ģ�溯��
	 */
	var _mainTplFn = baidu.template('<div class="row txt-area override-row"><%if(rows == 0){%><h4 style="color: gray;margin-left: 15px;"><%=emptText%></h4><%}%>' +
			'<%for(var i = 0; i < rows; i++){%><div class="row override-row"><%for(var j = i*rowNum; j < i*rowNum+rowNumArr[i]; j++){%><a href="javascript:void(0);" class="col-md-2" role="main" pid="<%=list[j].id%>"><%=list[j].name%></a><%}%></div><%}%></div>' +
			'<div class="row page-area override-row"><ul class="pagination pagination-sm col-md-8" style="padding-left:15px;"><%if(pager.firstPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.firstPage%>">&laquo;</a></li><%}%><%if(pager.prePage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.prePage%>">&lsaquo;</a></li><%}%>'+
'<%for(var i = pager.pageStart; i <= pager.pageEnd;i++){%><li><%if(pager.currentPage != i){%><a href="javascript:void(0);" role="page" page="<%=i%>"><%=i%></a><%}else{%><span style="color: red;"><%=i%></span><%}%></li><%}%><%if(pager.nextPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.nextPage%>">&rsaquo;</a></li><%}%>'+
'<%if(pager.lastPage != -1){%><li><a href="javascript:void(0);" role="page" page="<%=pager.lastPage%>">&raquo;</a></li><%}%><li><span>��<%=pager.totalPage%>ҳ</span></li></ul><p class="col-md-4" style="text-align:right; margin-top:23px;">'+
'<button type="button" class="btn btn-warning btn-xs" style="margin-right: 2px;" role="back">&lt; �����ϼ�</button>'+
'<button type="button" class="btn btn-danger btn-xs" role="close">[���ر�]</button></p></div>');

	var _mainHtml = '<div class="row area-me override-row">' +
			'<div class="row override-row" style="border-bottom:#e2e2e2 solid 1px; margin-top:15px; padding-bottom:10px;">' +
			'<div id="layer-combo-link" class="col-md-6 sec-area"></div>' +
			'<div class="col-md-6 input-group input-group-sm">' +
			'<input id="layer-combo-keyWords" type="text" class="form-control" placeholder="������ؼ���">' +
			'<span class="input-group-btn"><button role="keyWords" class="btn btn-default" type="button">����</button></span>' +
			'</div>' +
			'</div>' +
			'<div class="row list-area override-row" style="padding-top:15px;">' +
			'<div id="layer-combo-words" class="row all-area override-row" style="margin-bottom:15px;">' +
			'</div>' +
			'<div id="layer-combo-main" style="margin: 0px 0px;padding: 0px 0px;">' +
			'</div></div></div>';
	


	/**
	 * ע�ᴥ�������Ԫ��
	 * @param {LayerCombo} _self ��ǰ���㱾��
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
	 * ��ʼ������ѡ������
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 * @type {Boolean} isInit �Ƿ��ǳ�ʼ������
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
	 * ��ʼ��ƴ������
	 * @param {LayerCombo} _self ��ǰ���㱾��
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
	 * ��ʼ������
	 * 
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 * @type {Object} ��̨�������ݽ���� �磺{rows_count:5,list:[{....}]}
	 */
	var _initMain = function(_self,dataRs){
		if(!dataRs){
			dataRs={};
			dataRs[_self.get('totalProperty')] = 0;
			dataRs[_self.get('root')] = [];
		}
		
		
		
		/**
		 * ÿ����ʾ����
		 */
		var rowNum = _self.get('rowNum');
		/**
		 * ��ǰҳ������ʾ������
		 */
		var rows = (dataRs[_self.get('root')].length/rowNum).ceil();
		/**
		 * ÿ�������һ�����������������е�λ������
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
		 * ��ҳ����
		 */
		var pager = new Pager({pageSize:_self.get('pageSize'),currentPage:_currentPage,totalSize:dataRs[_self.get('totalProperty')]}).culatePage();
		var data = {rows:rows,rowNum:rowNum,rowNumArr:rowNumArr,len:dataRs[_self.get('root')].length,list:dataRs[_self.get('root')],pager:pager,emptText:_self.get('emptText')};
		DOM.empty('#layer-combo-main');
		DOM.html('#layer-combo-main',_mainTplFn(data));
		
		_operReg('main',_self);
		_operReg('page',_self);
		_operReg('back',_self);
		_operReg('close',_self);
		_currentPage = 1;/*����ҳ��*/
		DOM.val('#'+_inputKeyWordsId,'');/*����������*/
	};
	/**
	 * 
	 * ��������ж�Ӧ�Ĳ���
	 * 
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 * @param {String[]} paramNames ����������
	 */
	var _deleteParam = function(_self,paramNames){
		var param = _self.get('params');
		var len = paramNames.length;
		for(var i = 0; i < len; i++){
			delete param[paramNames[i]];
		}
	};
	
	/**
	 * �޸Ĳ�ѯ����
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 * @param {Number} level ��ǰ��ѯ�Ĳ㼶
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
	 * ���㼶�ı��ʱ���޸���ʾ
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 * @param {Number} level �޸ĵ��Ĳ㼶
 	 */
	var _setChangeLevel = function(_self,level){
		var len = _self.getValues(_current).length;
		if(level < len){
			_self.get('rs')[_current].splice(level,len - level);
		}
		_initLink(_self,false);			
		if(_self.get('initRawValue')){
			_self.setRawValue(_current);//ΪidΪ_current����������õ�ǰѡ���ֵ
			Event.fire('#'+_current,'blur');//����������blur�¼�(������֤���ظ�������blur�¼���)
		}		
		_self.fire('select',{self:_self,level:level,cid:_current});
	};
	/**
	 * ��ȡ����id�����Ĳ���������
	 */
	var _getRefIdNames = function(_self){
		var len = _self.get('opers').length;
		return _self.get('refParam')[_self.get('opers')[len - 1]];
	};
	/**
	 * Ϊ�Ѷ����ɫ��ӵ������
	 * 
	 * @type {String} role ��ɫ��
	 * @param {LayerCombo} _self ��ǰ���㱾��
	 */
	var _operReg = function(role,_self){	
		Event.delegate('[role="'+role+'"]','click','',function(e){	
			
			if(role == 'link'){/*��������*/
				var level = DOM.attr(e.target,'level');
				if(level==_self.get('opers').length){
					_self.hide(_current);
				}else{					
					_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
					_delParam(_self,level);
					_loadData(_self);				
					_setChangeLevel(_self,level);
				}
			}else if(role == 'pWords'){/*ƴ������*/
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				_delParam(_self,_self.getValues(_current).length);		
				_self.get('params').pWords = (DOM.html(e.target) == 'ȫ��'?'':DOM.html(e.target)).toLowerCase();
				_loadData(_self);
			}else if(role == 'main'){/*��������*/
				if(_isLoading)//��������һ��֮ǰ��������  dengbl
					return;
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				var currentRs = _self.getValues(_current);
				var level = currentRs.length;
				var thisObj = {id:DOM.attr(e.target,'pid'),name:DOM.html(e.target)};				
				currentRs[level] = thisObj;/*��ǰѡ�е�ֵ����values*/
				_self.setValues(_current,currentRs);			
				if(level < _self.get('opers').length - 1){
					_delParam(_self,level+1);
					_loadData(_self);
					_setChangeLevel(_self,level+1);
				}else{					
					_self.hide(_current);
					_setChangeLevel(_self,level + 1);
				}		
				
			}else if(role == 'page'){/*��ҳ����������*/
				_deleteParam(_self,['oper'].concat(_getRefIdNames(_self)));
				_currentPage = DOM.attr(e.target,'page');
				_delParam(_self,_self.getValues(_current).length);
				_loadData(_self);
			}else if(role == 'back'){/*������һ������*/
				_deleteParam(_self,['oper','pWords','start','limit','pageSize','keyWords'].concat(_getRefIdNames(_self)));
				var level = _self.getValues(_current).length;				
				if(level == 0){
					/*alert("�Ѿ�����߼��ˣ�");*/
				}else{
					_delParam(_self,level - 1);
					_loadData(_self);
					_setChangeLevel(_self,level - 1);
				}
			}else if(role == 'close'){/*�ر�����*/	
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
	 * ��������
	 * 
	 * @param {LayerCombo} _self ��ǰ���㱾��
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
	 * ��ȡid��Ӧ��Ԫ����ѡ������ݣ������м���separator�ָ���Ĭ��Ϊһ���ո�ָ�
	 * 
	 * @type {String} id ���������Ԫ��id
	 * @type {String} separator �ָ�����Ĭ��Ϊһ���ո�ָ�
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
	 * Ϊ�������Ԫ������value����ֵ��������valueΪ��ʱ������Ϊ��ǰ�����ڸ�Ԫ����ѡ�е�ֵ
	 * 
	 * @type {String} id ���������Ԫ��id
	 * @type {String} value Ҫ���õ�ֵ��Ϊ��ʱ������Ϊ��ǰ�����ڸ�Ԫ����ѡ�е�ֵ
	 */
	LayerCombo.prototype.setRawValue = function(id,value){
		value = value?value:this.getRawValue(id);
		DOM.val('#'+id,value);
	};
	
	/**
	 * ��ȡid��Ӧ��Ԫ����ѡ������ݣ����ݸ�ʽΪ[{id:1,name:'�Ĵ�'},{id:1,name:'�ɶ�'},{id:1,name:'������'}]
	 * �����±��ʾ�㼶��ϵ
	 * 
	 * @type {String} id ���������Ԫ��id
	 * 
	 * @return {Object[]}
	 */
	LayerCombo.prototype.getValues = function(id){
		return this.get('rs')[id]?this.get('rs')[id].slice(0):[];
	};
	/**
	 * ����id��Ӧ��Ԫ����ѡ������ݣ����ݸ�ʽΪ[{id:1,name:'�Ĵ�'},{id:1,name:'�ɶ�'},{id:1,name:'������'}]
	 * �����±��ʾ�㼶��ϵ��Ҫע��˳�򣬸߼�����ǰ
	 * 
	 * @type {String} id ���������Ԫ��id
	 * @type {Object[]} values ��ʽΪ[{id:1,name:'�Ĵ�'},{id:1,name:'�ɶ�'},{id:1,name:'������'}]
	 */
	LayerCombo.prototype.setValues = function(id,values){
		if(!values)values=[];
		this.get('rs')[id] = values;
	};
	/**
	 * ��ʾ����
	 * @type {String} id ��idΪid��Ԫ���ϵ����õ���
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
	 * �رյ���
	 * @type {String} id �ر���idΪid��Ԫ���ϵ����ĵ���
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
