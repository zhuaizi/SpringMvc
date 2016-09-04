/**
 * �ջ���������ַ���
 * 
 * @author zhaodw
 * @since 2014-05-22
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/address/address_orient", function (S,Base,DOM,Event,Form,Pager,Dia,Node,OverLay) {
	
	var AddressOrient = function (config){
		AddressOrient.superclass.constructor.call(this,config);
	};


	

	
	S.extend(AddressOrient,Base,{  //�̳л���
		isshow : false,
		/**
	 	 * �жϵ�ַ�Ƿ��Ѿ���ѡ����
	 	 */
		_hasSel:function(mem){
	 		var hasIn = false;
	 		for(var i=0;i<AddressOrient._selectedItems.length;i++){
	 			if(AddressOrient._selectedItems[i].cust_no == mem.cust_no)
	 				hasIn = true;
	 		}
	 		return hasIn;
	 	},
		_prepare : function(cfg){
			var self=this;
			var cbk = self.get("callback");
			var w = self.get('width')?self.get('width'):Number(document.body.clientWidth)*0.85;
			var h = self.get('minHeight')?self.get('minHeight'):Number(document.body.clientHeight)*0.85;
			AddressOrient._selectedItems = []; //ÿ�ε���ѡ����ʱ�����֮ǰ��¼����ѡ��ĵ�ַ
			var title = self.get('num2')==1?'ѡ���ջ���ַ':'ѡ�񷢻���ַ';
			var DiaF = new OverLay.Dialog({
				width:w,
				//height:h,
		        headerContent: title,
		        bodyContent: self.get('num2')==1?AddressOrient.SHOW_HTML:AddressOrient.SHOW_HTML_f,
		        footerContent:'<div style="text-align:center" class="">'+
		        			'<button class="btn-me06" id="cancel" type="button">����</button>'+
		        			'</div>',
		        closeAction:'destroy',
		        closable:false,/*�رհ�ť*/
				escapeToClose:false,/*ESC�����ر�*/
		        mask:{
		            effect:'fade'
		        },
		        align: {
		            points: ['cc', 'cc']
		        }
		    });
			DiaF.show();
			/*var DiaF=Dia.shows({
				title:title,
				bodys:self.get('num2')==1?AddressOrient.SHOW_HTML:AddressOrient.SHOW_HTML_f,
				closeable:false,
				buttonGroup:[{title:'<button type="button" class="btn-me06">����</button>',retValue:'cancel'}],
				width:w,
				minBodyHeight:h,
				callback:function(btnObj,btn){
					 if(btn=="cancel"){
					     DiaF.close();
					 }
			    }	
			});*/
		
			/**
			 * ����֤���ύ
			 */
			var ff = new Form({
		 		srcNode	: "#address_orient_form",
		 		url		: "/jsrh/address/address_mng_query.shtml",
		 		baseParam:{
		 			oper:'getaddresslist',
		 			limit:self.get('limit')?self.get('limit'):5,
		 			num2:self.get('num2')
		 		},
		 		callback	: function(text){
		 			initList(text);
		 		}
		 	});	 	
		 	ff.render(); 
		 	ff.submit();
		 	var pager=new Pager({
		 		srcNode:"#memori_pagerTool",
		 		pageSize:self.get('limit')?self.get('limit'):5,
		 		currentPage:1,
		 		totalSize:0,
		 		cls:"pagination pagination-sm",
		 		style:"padding-left:15px; margin:0px;"
		 	});
		 	pager.on('pageChange',function(pObj){
	 			DOM.val('#memori_start',pObj.start); 
	 			ff.submit();
	 		});
		 	function shouPager(data){
		 		pager.set("totalSize",data.rows_count);
		 		pager.render();
		 	}
		 	
		 	/**
			 * ������ʾ�б�
			 */ 
		 	function initList(data){
		 		shouPager(data);
		 		DOM.html('#member_orient_content','<tr><td colspan="4">���ݼ�����...</td></tr>');
		 		var html=AddressOrient.TPL_CONTENT(data);
		 		DOM.html('#member_orient_content',html);
		 		S.all('a.ck_oper').on('click',function(){
			 		oper(this);
				});
			}
		 	Event.on('#cancel','click',function(){
		 		 DiaF.close();
		 	});
		    
		    function oper(obj){
				if((AddressOrient.selected.length+1)<=1){//ֻ�����1����ַ
					var id = DOM.attr(obj,'id');
			    	var city_no = DOM.attr(obj,'city_no');
			    	var area_no = DOM.attr(obj,'area_no');
			    	var county_no = DOM.attr(obj,'county_no');
			    	var addr = DOM.attr(obj,'addr');
			    	var descrip = DOM.attr(obj,'descrip');
			    	
			    	AddressOrient._selectedItem.id = id;
			    	AddressOrient._selectedItem.city_no = city_no;
			    	AddressOrient._selectedItem.area_no = area_no;
			    	AddressOrient._selectedItem.county_no = county_no;
			    	AddressOrient._selectedItem.addr = addr;
			    	AddressOrient._selectedItem.descrip = descrip;
			    	AddressOrient._selectedItems = []; //�������ѡ��ĵ�ַ��Ϣ
			    	AddressOrient._selectedItems.push(AddressOrient._selectedItem); //����ӱ��е�ַ��Ϣ
			    	
			    	DiaF.close();
			    	
			    	if(cbk && typeof cbk=='function')
	    				 self.get("callback").call(self,AddressOrient);
    			}else{
					var msg='������1����ַ�����Ѿ����'+AddressOrient.selected.length+'����ַ��';
					DiaF.hide();
					Dia.show('��ʾ��Ϣ',msg,'qm',400,function(btnObj,btn){
						DiaF.show();
					});
				}
		    };
		    
		}
	},{
		TPL_CONTENT : baidu.template(new StringBuffer([
							'<%',
							'for(var i=0;i<resultlist.length;i++){',
							  'var item=resultlist[i];',
							  'var is_sel = item.is_selected;',
							'%>',
							  '<tr>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.linkman%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.descrip%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.addr%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;">',
							       '<a href="#" class="ck_oper" addr = "<%- item.addr%>" id = "<%- item.id%>" city_no = "<%- item.city_no%>" area_no = "<%- item.area_no%>" county_no = "<%- item.county_no%>" descrip = "<%- item.descrip%>">ѡ��</a>',
							    '</td>', 
							'<%}%>'
		                  ]).toString()),
		SHOW_HTML :    "<div class='container'>" 
					  +  "<div class='row'>" 
					  +      '<div class="form-group">' 
					  +	       '<div class="row">' 
					  +	          '<form id="address_orient_form" class="form-horizontal">'
					  + 		        '<input type="hidden" name="start" id="memori_start"/>'
					  +		       '</form>'
					  +       '</div>'
					  +     '</div>'
				      +   '</div>'
				      +   '<div class="tabbable" style="margin-top:2px; margin-bottom:10px;">'
					  +	     '<div class="tab-content tab-content-me" style="padding:0px;">'
					  +	        '<div class="tab-pane active" id="tab1">'
					  +	            '<table class="table" style="margin-bottom:0px;">'
					  +		           '<tr>'
					  + 			      '<th style="width:15%">�ջ���</th>'
					  +			          '<th style="width:40%">���ڵ���</th>'
					  +			          '<th style="width:30%">�ֵ�</th>'
					  + 			      '<th style="width:15%">����</th>'
					  +		           '</tr>'
					  +                '<tbody id="member_orient_content">'
					  +				      '<tr><td colspan="4">���ݼ�����...</td></tr>'
					  +			       '</tbody>'
					  +		           '<tr>'
					  +			          '<td colspan="4" style="text-align:right;" id="memori_pagerTool"></td>'
					  +	               '</tr>'
					  +	           '</table>'
					  +	        '</div>'
					  +	     '</div>'
				      +   '</div>'
					  +"</div>",   
		SHOW_HTML_f :    "<div class='container'>" 
						  +  "<div class='row'>" 
						  +      '<div class="form-group">' 
						  +	       '<div class="row">' 
						  +	          '<form id="address_orient_form" class="form-horizontal">'
						  + 		        '<input type="hidden" name="start" id="memori_start"/>'
						  +		       '</form>'
						  +       '</div>'
						  +     '</div>'
					      +   '</div>'
					      +   '<div class="tabbable" style="margin-top:2px; margin-bottom:10px;">'
						  +	     '<div class="tab-content tab-content-me" style="padding:0px;">'
						  +	        '<div class="tab-pane active" id="tab1">'
						  +	            '<table class="table" style="margin-bottom:0px;">'
						  +		           '<tr>'
						  + 			      '<th style="width:15%">������</th>'
						  +			          '<th style="width:40%">���ڵ���</th>'
						  +			          '<th style="width:30%">�ֵ�</th>'
						  + 			      '<th style="width:15%">����</th>'
						  +		           '</tr>'
						  +                '<tbody id="member_orient_content">'
						  +				      '<tr><td colspan="4">���ݼ�����...</td></tr>'
						  +			       '</tbody>'
						  +		           '<tr>'
						  +			          '<td colspan="4" style="text-align:right;" id="memori_pagerTool"></td>'
						  +	               '</tr>'
						  +	           '</table>'
						  +	        '</div>'
						  +	     '</div>'
					      +   '</div>'
						  +"</div>",  
	   /**
		* ѡ��ĵ�����ַ
		*/
		_selectedItem : {id:'',city_no:'',area_no:'',county_no:'',addr:'',descrip:''},
		/**
		* ɾ���ĵ�����ַ
		*/
		_deletedItem : {id:'',city_no:'',area_no:'',county_no:'',addr:'',descrip:''},
	   /**
		* ѡ��Ķ����ַ
	    */
		_selectedItems : [],
		/**
		* ��ѡ��ĵ�ַ����
	    */
		selected : [],
		ATTRS:{
			/**
			 * ���
			 */
			width:{value:''},
			/**
			 * ��С�߶�
			 */
			minHeight:{value:800},
			/**
				* ��ʾ��ַѡ������ɵ�html��dom id
			    */
			id  :"",
			/**
			 * �����ֶ�
			 */
			sort:{value:'id'},
			/**
			 * ����ʽ
			 */
			dir:{value:'desc'},
			/**
			 * num2=1���� �ջ���ַ
			 * num2=2������ ������ַ
			 */
			num2:{value:'1'},
			/**
			 * ÿҳ��ʾ����
			 */
			pageSize:{value:5},
			/**
			 * �ص�������ֻ�ڵ㡰ȷ�����͡�ѡ�񡱵�ʱ��ִ��
			 * param : �������
			 */
			callback : {value:function(memOri){}}, 
			/**
			 * ɾ��������ֻ�ڵ�ɾ����ʱ��ִ��
			 * param : �������
			 */
			deleteLabel : {value:function(memOri){}} 
		}
	});
	AddressOrient.setSelected = function(sel){
		AddressOrient.selected = sel;
	};
	AddressOrient.dl = null;
	AddressOrient.initLabel = function(selNo,selName,id,obj){
		
	};
	
	
	AddressOrient.show=function(obj){
		if(AddressOrient.dl == null)
			AddressOrient.dl=new AddressOrient(obj);	
		AddressOrient.dl._prepare();
	};
	return AddressOrient;
},{
    requires: ['base','dom','event',KISSY.myPackageName+'/util/form/form',KISSY.myPackageName+'/util/pager',
               KISSY.myPackageName+"/util/dialog/dialog",'node','overlay','overlay/assets/dpl.css']
});