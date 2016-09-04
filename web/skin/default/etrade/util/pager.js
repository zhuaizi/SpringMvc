/**
 * 分页工具模块
 * 	事件：
 * 		pageChange：当页面改变时触发
 * 
 * 1.只用pageSize、currentPage时，可计算当前页从第几条数据开始到第几条数据结束，多用于查询前计算查询参数的起始、结束
 * 2.只用pageSize、currentPage、totalSize参数就可计算全部分页相关参数参数，多用与计算查询后的分页工具条的显示需要参数
 * 
 * @author 周忠友
 * @since 2013-10-22
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/pager", function (S,Base,DOM,Event) {

	var Pager = function (config){
	    Pager.superclass.constructor.call(this,config);
	};
	
	S.extend(Pager,Base);//继承基类
	
	/*
	 * 1.只用pageSize、currentPage时，可计算当前页从第几条数据开始到第几条数据结束
	 * 2.只用pageSize、currentPage、totalSize参数就可计算全部分页相关参数参数
	 * */
	Pager.ATTRS = {
		/**
		 * 分页工具条渲染到的元素选择器
		 */
		srcNode	: {value:''},
		/**
		 * {Number} 每页显示几条(必须)
		 */
		pageSize : {value:5},
		/**
		 * {Number} 当前第几页(必须)
		 */
		currentPage:{value:0},
		/**
		 * {Number} 数据总条数，仅用于计算总页数，(可为空)
		 */
		totalSize	:{value:0},
		/**
		 * {Number} 分页工具条显示多少个页数，默认5页，用于计算分页工具条显示的页数(可为空)
		 */
		pageNum		: {value:5},
		/**
		 * 首页显示的文字
		 */
		firstText	: {value:null},
		/**
		 * 上一页显示的文字
		 */
		preText		: {value:null},
		/**
		 * 下一页显示的文字
		 */
		nextText	: {value:null},
		/**
		 * 最后一页显示的文字
		 */
		lastText	: {value:null},
		/**
		 * 工具条的样式类，多个样式类中间加空格
		 */
		cls	: {value:'pagination'},
		/**
		 * 工具条的自定义样式
		 */
		style:{value:null}
	};
	
	var _tpl = new StringBuffer(['<ul class="<%=cls%> " id="<%=pager.uid%>" <%if(style){%>style = "<%=style%>"<%}%>>',
		'<li><a href="javascript:void(0);" role="page-refresh" page="<%=pager.currentPage%>"><span class="glyphicon glyphicon-refresh"></span></a></li>',
		'<%if(pager.firstPage != -1){%><li><a href="javascript:void(0);" role="page-tool" page="<%=pager.firstPage%>"><%if(lastText){%><%=firstText%><%}else{%>&laquo;<%}%></a></li><%}%>',
		'<%if(pager.prePage != -1){%><li><a href="javascript:void(0);" role="page-tool" page="<%=pager.prePage%>"><%if(lastText){%><%=preText%><%}else{%>&lsaquo;<%}%></a></li><%}%>',
		'<%for(var i = pager.pageStart; i <= pager.pageEnd;i++){%>',
		'<li <%if(pager.currentPage == i){%>class="active"<%}%>><a href="javascript:void(0);" role="page-tool" page="<%=i%>"><%=i%></a></li>',
		'<%}%>','<%if(pager.nextPage != -1){%><li><a href="javascript:void(0);" role="page-tool" page="<%=pager.nextPage%>"><%if(lastText){%><%=nextText%><%}else{%>&rsaquo;<%}%></a></li><%}%>',
		'<%if(pager.lastPage != -1){%><li><a href="javascript:void(0);" role="page-tool" page="<%=pager.lastPage%>"><%if(lastText){%><%=lastText%><%}else{%>&raquo;<%}%></a></li><%}%>',
		'<li><span>共<%=pager.totalPage%>页</span></li><li><span>共<%=pager.totalSize%>条记录</span></li>','</ul>']).toString();
	var _tplFn = baidu.template(_tpl);
	
	/**
	 * 计算分页相关参数
	 * 
	 * @return {Object} 包含与分页有关的数据的对象
	 */
	Pager.prototype.culatePage = function(){
		var _self = this;
		var pager = {};
		/**
		 * 数据总条数
		 */
		pager.totalSize = parseFloat(_self.get('totalSize')?_self.get('totalSize'):0);
		/**
		 * 每页显示条数
		 */
		pager.pageSize = parseFloat(_self.get('pageSize'));
		/**
		 * 当前第几页
		 */
		pager.currentPage = parseFloat(_self.get('currentPage')?_self.get('currentPage'):0);
		/**
		 * 当前页的开始条数
		 */
		pager.start = pager.pageSize*(pager.currentPage - 1);
		
		pager.limit = pager.pageSize;
		
		/**
		 * 当前页的结束条数
		 */
		pager.limits = pager.pageSize*pager.currentPage;
		/**
		 * 总页数
		 */
		pager.totalPage = (pager.totalSize/pager.pageSize).ceil();
		/**
		 * 分页工具条显示多少个页数，默认5页
		 */
		pager.pageNum = parseFloat(_self.get('pageNum'));
		/**
		 * 前一页，-1表示不显示
		 */
		pager.prePageM = pager.currentPage - 1 <= 0?-1:pager.currentPage - 1;
		/**
		 * 后一页，-1表示不显示
		 */
		pager.nextPageM = pager.currentPage + 1 > pager.totalPage?-1:pager.currentPage + 1;
		/**
		 * 前一页，-1表示不显示(当数字按钮能选择到第一页时，不显示前一页)
		 */
		pager.prePage = pager.currentPage - (pager.pageNum/2).floor() - 1 <= 0?-1:pager.currentPage - 1;
		/**
		 * 后一页，-1表示不显示(当数字按钮能选择到最后一页时，不显示前后一页)
		 */
		pager.nextPage = pager.currentPage + (pager.pageNum/2).floor() + 1 >= pager.totalPage?-1:pager.currentPage + 1;
		
		/**
		 * 第一页
		 */
		pager.firstPageM = pager.currentPage - 1 <= 0?-1:1;
		/**
		 * 最后一页
		 */
		pager.lastPageM = pager.currentPage + 1 >= pager.totalPage?-1:pager.totalPage;
		/**
		 * 第一页(当数字按钮能选择到第一页时，不显示第一页)
		 */
		pager.firstPage = pager.currentPage - (pager.pageNum/2).floor() - 1 <= 0?-1:1;
		/**
		 * 最后一页(当数字按钮能选择到第一页时，不显示末页)
		 */
		pager.lastPage = pager.currentPage + (pager.pageNum/2).floor() + 1 >= pager.totalPage?-1:pager.totalPage;		
		pager.uid = S.guid('pg'); 
		/**
		 * 分页工具条的开始页数和结束页数
		 */
		
		pager.pageStart = pager.currentPage - (pager.pageNum/2).floor();		
		pager.pageEnd = pager.currentPage + (pager.pageNum/2).floor();
		if(pager.pageStart < 1){
			pager.pageStart = 1;
		}
		if(pager.pageEnd > pager.totalPage){
			pager.pageEnd = pager.totalPage;
		}
		if(pager.pageEnd - pager.pageStart + 1 < pager.pageNum && pager.pageNum <= pager.totalPage){
			if(pager.pageEnd == pager.totalPage){
				pager.pageStart = pager.pageEnd - pager.pageNum + 1;
			}
			if(pager.pageStart == 1){
				pager.pageEnd = pager.pageStart + pager.pageNum - 1;
			}
		}
		if(pager.pageNum >= pager.totalPage){
			pager.pageStart = 1;
			pager.pageEnd = pager.totalPage;
		}
		
		return pager;
	};
	
	Pager.prototype.getHtml = function(){
		var data = {firstText:this.get('firstText'),preText:this.get('preText'),nextText:this.get('nextText'),lastText:this.get('lastText'),cls:this.get('cls'),style:this.get('style')};
		data.pager = this.culatePage();
		return _tplFn(data);
	};
	
	Pager.prototype.render = function(){
		var _self = this;
		DOM.empty(_self.get('srcNode'));
		DOM.html(_self.get('srcNode'),_self.getHtml());
		Event.on(_self.get('srcNode')+' a[role="page-tool"]','click',function(e){			
			_self.set('currentPage',parseFloat(DOM.attr(e.target,"page")));
			//DOM.attr('#'+_self.get('uid')+' a[role="page-refresh"]',"page",_self.culatePage());
			_self.fire('pageChange',_self.culatePage());/*注意：不要改变该代码的位置*/
			_self.render();
		});
		
		Event.on(_self.get('srcNode')+' a[role="page-refresh"]','click',function(e){
			if(DOM.hasClass(e.target,'glyphicon-refresh')){
				
					e=DOM.parent(e.target,_self.get('srcNode')+' a[role="page-refresh"]');
					
					_self.set('currentPage',parseFloat(DOM.attr(e,"page")));
			}else{
			_self.set('currentPage',parseFloat(DOM.attr(e.target,"page")));
			}
		
			_self.fire('pageChange',_self.culatePage());/*注意：不要改变该代码的位置*/
			_self.render();
		});
	};

	Pager.prototype.reset = function(){
		this.set('currentPage',1);
	};
	
	return Pager;
},{
    requires: ['base','dom','event']
});
