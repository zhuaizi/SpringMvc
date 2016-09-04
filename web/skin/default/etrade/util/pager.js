/**
 * ��ҳ����ģ��
 * 	�¼���
 * 		pageChange����ҳ��ı�ʱ����
 * 
 * 1.ֻ��pageSize��currentPageʱ���ɼ��㵱ǰҳ�ӵڼ������ݿ�ʼ���ڼ������ݽ����������ڲ�ѯǰ�����ѯ��������ʼ������
 * 2.ֻ��pageSize��currentPage��totalSize�����Ϳɼ���ȫ����ҳ��ز�������������������ѯ��ķ�ҳ����������ʾ��Ҫ����
 * 
 * @author ������
 * @since 2013-10-22
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/pager", function (S,Base,DOM,Event) {

	var Pager = function (config){
	    Pager.superclass.constructor.call(this,config);
	};
	
	S.extend(Pager,Base);//�̳л���
	
	/*
	 * 1.ֻ��pageSize��currentPageʱ���ɼ��㵱ǰҳ�ӵڼ������ݿ�ʼ���ڼ������ݽ���
	 * 2.ֻ��pageSize��currentPage��totalSize�����Ϳɼ���ȫ����ҳ��ز�������
	 * */
	Pager.ATTRS = {
		/**
		 * ��ҳ��������Ⱦ����Ԫ��ѡ����
		 */
		srcNode	: {value:''},
		/**
		 * {Number} ÿҳ��ʾ����(����)
		 */
		pageSize : {value:5},
		/**
		 * {Number} ��ǰ�ڼ�ҳ(����)
		 */
		currentPage:{value:0},
		/**
		 * {Number} �����������������ڼ�����ҳ����(��Ϊ��)
		 */
		totalSize	:{value:0},
		/**
		 * {Number} ��ҳ��������ʾ���ٸ�ҳ����Ĭ��5ҳ�����ڼ����ҳ��������ʾ��ҳ��(��Ϊ��)
		 */
		pageNum		: {value:5},
		/**
		 * ��ҳ��ʾ������
		 */
		firstText	: {value:null},
		/**
		 * ��һҳ��ʾ������
		 */
		preText		: {value:null},
		/**
		 * ��һҳ��ʾ������
		 */
		nextText	: {value:null},
		/**
		 * ���һҳ��ʾ������
		 */
		lastText	: {value:null},
		/**
		 * ����������ʽ�࣬�����ʽ���м�ӿո�
		 */
		cls	: {value:'pagination'},
		/**
		 * ���������Զ�����ʽ
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
		'<li><span>��<%=pager.totalPage%>ҳ</span></li><li><span>��<%=pager.totalSize%>����¼</span></li>','</ul>']).toString();
	var _tplFn = baidu.template(_tpl);
	
	/**
	 * �����ҳ��ز���
	 * 
	 * @return {Object} �������ҳ�йص����ݵĶ���
	 */
	Pager.prototype.culatePage = function(){
		var _self = this;
		var pager = {};
		/**
		 * ����������
		 */
		pager.totalSize = parseFloat(_self.get('totalSize')?_self.get('totalSize'):0);
		/**
		 * ÿҳ��ʾ����
		 */
		pager.pageSize = parseFloat(_self.get('pageSize'));
		/**
		 * ��ǰ�ڼ�ҳ
		 */
		pager.currentPage = parseFloat(_self.get('currentPage')?_self.get('currentPage'):0);
		/**
		 * ��ǰҳ�Ŀ�ʼ����
		 */
		pager.start = pager.pageSize*(pager.currentPage - 1);
		
		pager.limit = pager.pageSize;
		
		/**
		 * ��ǰҳ�Ľ�������
		 */
		pager.limits = pager.pageSize*pager.currentPage;
		/**
		 * ��ҳ��
		 */
		pager.totalPage = (pager.totalSize/pager.pageSize).ceil();
		/**
		 * ��ҳ��������ʾ���ٸ�ҳ����Ĭ��5ҳ
		 */
		pager.pageNum = parseFloat(_self.get('pageNum'));
		/**
		 * ǰһҳ��-1��ʾ����ʾ
		 */
		pager.prePageM = pager.currentPage - 1 <= 0?-1:pager.currentPage - 1;
		/**
		 * ��һҳ��-1��ʾ����ʾ
		 */
		pager.nextPageM = pager.currentPage + 1 > pager.totalPage?-1:pager.currentPage + 1;
		/**
		 * ǰһҳ��-1��ʾ����ʾ(�����ְ�ť��ѡ�񵽵�һҳʱ������ʾǰһҳ)
		 */
		pager.prePage = pager.currentPage - (pager.pageNum/2).floor() - 1 <= 0?-1:pager.currentPage - 1;
		/**
		 * ��һҳ��-1��ʾ����ʾ(�����ְ�ť��ѡ�����һҳʱ������ʾǰ��һҳ)
		 */
		pager.nextPage = pager.currentPage + (pager.pageNum/2).floor() + 1 >= pager.totalPage?-1:pager.currentPage + 1;
		
		/**
		 * ��һҳ
		 */
		pager.firstPageM = pager.currentPage - 1 <= 0?-1:1;
		/**
		 * ���һҳ
		 */
		pager.lastPageM = pager.currentPage + 1 >= pager.totalPage?-1:pager.totalPage;
		/**
		 * ��һҳ(�����ְ�ť��ѡ�񵽵�һҳʱ������ʾ��һҳ)
		 */
		pager.firstPage = pager.currentPage - (pager.pageNum/2).floor() - 1 <= 0?-1:1;
		/**
		 * ���һҳ(�����ְ�ť��ѡ�񵽵�һҳʱ������ʾĩҳ)
		 */
		pager.lastPage = pager.currentPage + (pager.pageNum/2).floor() + 1 >= pager.totalPage?-1:pager.totalPage;		
		pager.uid = S.guid('pg'); 
		/**
		 * ��ҳ�������Ŀ�ʼҳ���ͽ���ҳ��
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
			_self.fire('pageChange',_self.culatePage());/*ע�⣺��Ҫ�ı�ô����λ��*/
			_self.render();
		});
		
		Event.on(_self.get('srcNode')+' a[role="page-refresh"]','click',function(e){
			if(DOM.hasClass(e.target,'glyphicon-refresh')){
				
					e=DOM.parent(e.target,_self.get('srcNode')+' a[role="page-refresh"]');
					
					_self.set('currentPage',parseFloat(DOM.attr(e,"page")));
			}else{
			_self.set('currentPage',parseFloat(DOM.attr(e.target,"page")));
			}
		
			_self.fire('pageChange',_self.culatePage());/*ע�⣺��Ҫ�ı�ô����λ��*/
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
