/**
 * ��Ա�������
 * 
 * @author zhenghq
 * @since 2014-2-26
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/member/member_orient", function (S,Base,DOM,Event,Form,Pager,Dia,Node,Tabs) {
	
	var MemberOrient = function (config){
		MemberOrient.superclass.constructor.call(this,config);
	};


	

	
	S.extend(MemberOrient,Base,{  //�̳л���
		isshow : false,
		/**
	 	 * �жϻ�Ա�Ƿ��Ѿ���ѡ����
	 	 */
		_hasSel:function(mem){
	 		var hasIn = false;
	 		for(var i=0;i<MemberOrient._selectedItems.length;i++){
	 			if(MemberOrient._selectedItems[i].cust_no == mem.cust_no)
	 				hasIn = true;
	 		}
	 		return hasIn;
	 	},
		_prepare : function(cfg){
			var self=this;
			var cbk = self.get("callback");
			var w = self.get('width')?self.get('width'):Number(document.body.clientWidth)*0.85;
			var h = self.get('minHeight')?self.get('minHeight'):Number(document.body.clientHeight)*0.85;
			MemberOrient._selectedItems = []; //ÿ�ε���ѡ����ʱ�����֮ǰ��¼����ѡ��Ļ�Ա
			var DiaF=Dia.shows({
					       	 	title:'ѡ�����Ա',
					       	 	bodys:MemberOrient.SHOW_HTML,
					       	 	closeable:false,
					       	 	buttonGroup:[{title:'ȷ��',retValue:'confirm'},{title:'����',retValue:'cancel'}],
					       	 	width:w,
					       	    minBodyHeight:h,
					       		callback:function(btnObj,btn){
					       			if(btn=="confirm"){  
					       				var arr=MemberOrient._selectedItems;//DOM.query('#member_orient_content input');
					       				var html = ""; //��Ա���ɵ�html
					       				var j=arr.length;
					       				
					       				if((MemberOrient.selected.length+j)<=20){//ֻ�����20�������Ա
						       		 		for(var i=0;i<j;i++){
						       		 				var cust_no = arr[i].cust_no; // DOM.attr(arr[i],'cust_no');
						       		 			    var cust_name = arr[i].cust_name; // DOM.attr(arr[i],'cust_name');
						       		 			    html+="<div class='col-md-3' id="+cust_no+" title='"+cust_name+"' style ='height:65px;overflow:hidden;padding:0px;padding-right:5px;margin-bottom:5px;'>";
						       		 			    html+="<div class='alert alert-warning  alert-dismissable' style='height:65px;overflow:hidden;margin-bottom:10px;'>";
						       		 			    html+="<button type='button' class='close' cust_no="+cust_no+" cust_name="+cust_name+" data-dismiss='alert' aria-hidden='true'>&times;</button>";
						       		 			    html+=cust_name+"</div></div>";
//						       		 			}
						       		 		}
						       		 		Node.all(html).appendTo("#"+self.get('id'));
						       		 		if(!self.isshow ) {
						       		 		Event.delegate(DOM.get("#"+self.get('id')),'click' ,'button.close',function(e){
						       		 		 	 var el=S.all(e.target);
										    	 var closeID="#"+el.attr("cust_no");
										    	 DOM.remove(closeID);
										         var cust_no=el.attr("cust_no");
										         var cust_name=el.attr("cust_name");
										         MemberOrient._deletedItem = []; 
										         MemberOrient._deletedItem.push({cust_no:cust_no,cust_name:cust_name});
										         
										         self.get("deleteLabel").call(self,MemberOrient);
						       		 		});
						       		 		self.isshow =true;
						       		 		}
						       		 		
							       				DiaF.close();
							       				if(cbk && typeof cbk=='function'){
							       				
							       				   self.get("callback").call(self,MemberOrient);
							       				    
							       				 }
						       			}else{
						       				var msg='������20�������Ա�����Ѿ����'+MemberOrient.selected.length+'�������Ա��';
						       				DiaF.hide();
						       				Dia.show('��ʾ��Ϣ',msg,'qm',400,function(btnObj,btn){
						       					DiaF.show();
											});
						       			}
					       			}else if(btn=="cancel"){
					       				DiaF.close();
					       			}
						        }	
					       		
					       				
			               });
		/*Ϊ��ѡ�����õ��״̬*/
		 	Event.on('.memori_cbAll','click',function(e){
		 		var c=e.target.checked;
		 		var arr=DOM.query('#member_orient_content input');
		 		for(var i=0;i<arr.length;i++){
		 			arr[i].checked=c;
		 			var mem = {cust_no:DOM.attr(arr[i],'cust_no'),cust_name:DOM.attr(arr[i],'cust_name')};
		 			if(c){//���ѡ�У����¼��ѡ�л�Ա
		 				registSelected(mem);
		 			}else{//���δѡ�У���Ӽ�¼��ɾ��
		 				deletSelected(mem);
		 			}
		 		}
		 		S.each(DOM.query('.memori_cbAll'),function(o,i){
		 			o.checked=c;
		 		});
		 	});	
		 	var notIn = MemberOrient.selected;
		 	var selectedCusts = '';
		 	for(var i=0;i<notIn.length;i++){
		 		selectedCusts += notIn[i];
		 		if(i!=(notIn.length-1)){
		 			selectedCusts +=','
		 		}
		 	}
			/**
			 * ����֤���ύ
			 */
			var ff = new Form({
		 		srcNode	: "#member_orient_form",
		 		url		: "/etrade/gzql/member/memberorientation/query.shtml",
		 		baseParam:{
		 			sort:self.get('sort'),
		 			dir:self.get('dir'),
		 			limit:self.get('limit')?self.get('limit'):5,
		 			selected : selectedCusts
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
			 * TABʵ��
			 */
			var tabs=new Tabs({
				callback:function(o){
					var member_type = DOM.attr(o,"data");
					DOM.val("#memori_member_type",member_type);
		 			DOM.val('#memori_start',0);
					pager.reset();
					DOM.html('#member_orient_content','<tr><td colspan="7">���ݼ�����...</td></tr>');				
					ff.submit();
				}
			});
			tabs.render();
		 	/**
		 	 * �жϻ�Ա�Ƿ��Ѿ���ѡ����
		 	 */
//		 	function hasSel(mem){
//		 		var hasIn = false;
//		 		for(var i=0;i<MemberOrient._selectedItems.length;i++){
//		 			if(MemberOrient._selectedItems[i].cust_no == mem.cust_no)
//		 				hasIn = true;
//		 		}
//		 		return hasIn;
//		 	}
		 	/**
		 	 *  ��¼��ѡ��Ļ�Ա��Ϣ 
		 	 */
		 	function registSelected(mem){
		 		var isIn = MemberOrient.dl._hasSel(mem);
		 		if(!isIn){
		 			MemberOrient._selectedItems.push(mem);
		 		}
		 	}
		 	/**
		 	 *  ɾ����ѡ��Ļ�Ա��Ϣ 
		 	 */
		 	function deletSelected(mem){
		 		for(var i=0;i<MemberOrient._selectedItems.length;i++){
		 			if(MemberOrient._selectedItems[i].cust_no == mem.cust_no){
		 				MemberOrient._selectedItems.splice(i,1);
		 			}
		 		}
		 	}
		 	/**
			 * ������ʾ�б�
			 */ 
		 	function initList(data){
		 		var is_check_all = true; //�Ƿ�ȫѡ
		 		for(var i=0;i<data.resultlist.length;i++){
		 			var d = data.resultlist[i];
		 			var c_mem = {cust_no:d.cust_no,cust_name:d.cust_name};
		 			var is_selected = MemberOrient.dl._hasSel(c_mem);
		 			data.resultlist[i].is_selected = is_selected;
		 			if(!is_selected) is_check_all=false;
		 		}
		 		shouPager(data);
		 		DOM.html('#member_orient_content','<tr><td colspan="7">���ݼ�����...</td></tr>');
		 		var html=MemberOrient.TPL_CONTENT(data);
		 		DOM.html('#member_orient_content',html);
		 		S.each(DOM.query('.memori_cbAll'),function(o,i){
			 			o.checked=is_check_all;
			 	});
		 		S.all('button.ck_oper').on('click',function(){
			 		oper(this);
				});
		 		S.all('#member_orient_content input').on('click',function(e){
			 		var tag = e.target;
			 		var mem = {cust_no:DOM.attr(tag,'cust_no'),cust_name:DOM.attr(tag,'cust_name')};
			 		if(tag.checked){
			 			registSelected(mem);
			 		}else{
			 			deletSelected(mem);
			 		}
				});
			}
		 	Event.on('#mem_orient_reset','click',function(e){
		    	DOM.get('#member_orient_form').reset();
		 		DOM.val('#memori_start','0');
		 		pager.set('currentPage',1);
		    });
		    Event.on('#mem_orient_query','click',function(e){
		    	var msg = ff.isValid();
		    	if(msg){
		    		alert(msg);
					return ;
				} 	
		    	ff.submit();
		    });
		    function oper(obj){
		    
				if((MemberOrient.selected.length+1)<=20){//ֻ�����20�������Ա
		    	var cust_no = DOM.attr(obj,'cust_no');
		    	var cust_name = DOM.attr(obj,'cust_name');
		    	
		    	MemberOrient._selectedItem.cust_no = cust_no;
		    	MemberOrient._selectedItem.cust_name = cust_name;
		    	MemberOrient._selectedItems = []; //�������ѡ��Ļ�Ա��Ϣ
		    	MemberOrient._selectedItems.push(MemberOrient._selectedItem); //����ӱ��л�Ա��Ϣ
		    	
		    	
		    	var html="";
				html+="<div class='col-md-3' id="+cust_no+" title='"+cust_name+"' style ='height:65px;overflow:hidden;padding:0px;padding-right:5px;margin-bottom:5px;'>";
				html+="<div class='alert alert-warning  alert-dismissable' style='height:65px;overflow:hidden;margin-bottom:10px;'>";
				html+="<button type='button' class='close' cust_no="+cust_no+" cust_name="+cust_name+" data-dismiss='alert' aria-hidden='true'>&times;</button>";
				html+=cust_name+"</div></div>";
				Node.all(html).appendTo("#"+self.get('id'));
		    	
		    	
		    	
		    	Event.delegate(DOM.get("#"+self.get('id')),'click' ,'button.close',function(e){
						       		 		 	 var el=S.all(e.target);
										    	 var closeID="#"+el.attr("cust_no");
										    	 DOM.remove(closeID);
										         var cust_no_d=el.attr("cust_no");
										         var cust_name_d=el.attr("cust_name");
										         MemberOrient._deletedItem = []; 
										         MemberOrient._deletedItem.push({cust_no:cust_no_d,cust_name:cust_name_d});
										         
										         self.get("deleteLabel").call(self,MemberOrient);
						       		 		});
		    	DiaF.close();
		    	
		    		if(cbk && typeof cbk=='function')
    				   self.get("callback").call(self,MemberOrient);
    			}else{
						       				var msg='������20�������Ա�����Ѿ����'+MemberOrient.selected.length+'�������Ա��';
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
							  '<td ><div class="checkbox "><label><input type="checkbox" name="cb" cust_no="<%-item.cust_no%>" cust_name="<%-item.cust_name%>" <% if(is_sel){ %>checked <%}%> /></label></div></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.cust_name%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.province_value%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.city_value%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.county_value%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;"><%= item.address%></td>',
							    '<td style="vertical-align:middle;word-break:break-all;">',
							       '<button type="button" class="btn btn-danger btn-xs ck_oper" cust_no = "<%- item.cust_no%>" cust_name = "<%- item.cust_name%>" >ѡ��</button>',
							    '</td>', 
							'<%}%>'
		                  ]).toString()),
		SHOW_HTML :    "<div class='container'>" 
					  +  "<div class='row'>" 
					  +      '<div class="form-group">' 
					  +	       '<div class="row">' 
					  +	          '<form id="member_orient_form" class="form-horizontal">'
					  +  	              '<div class="col-md-3" style="width:35%;">' 
					  +		                  '<div class="form-group">'
					  +		                      '<label class="control-label col-md-5" style="text-align:right;">��Ա���ƣ�</label>'
					  +		                      '<div class="row col-md-7">' 
					  +		                            '<input type="text"class="form-control col-md-12 input-sm" data-rules="{maxLength:100}" name="cust_name" data-msg="{maxLength:\'��Ա������󳤶�Ϊ100���ַ�����50������\'}"/>'
					  + 		                        '<input type="hidden" name="start" id="memori_start"/>'
					  +                                 '<input type="hidden" name="member_type" id="memori_member_type" value="vip"/>'
					  +	                          '</div>'
					  +			              '</div>'
					  +		              '</div>'
					  +		              '<div class="col-md-3" style="width:35%;">'
					  +		                   '<div class="form-group">'
					  + 		                   '<label class="control-label col-md-5" style="text-align:right;">���ڵأ�</label>'
					  +			                   '<div class="row col-md-7">'
					  +				                    '<input type="text"class="form-control col-md-12 input-sm" name="addr" data-rules="{maxLength:40}"  data-msg="{maxLength:\'���ڵ���󳤶�Ϊ40���ַ�����20������\'}">' 
					  +				               '</div>'
					  +				           '</div>'
					  +		              '</div>'
					  + 	              '<div class="col-md-3"style="width:30%;margin-top:5px;">' 
					  +                        '<p>'
				      +                            '<button type="button" class="btn btn-success btn-xs" id="mem_orient_query">��ѯ</button>&nbsp;&nbsp;&nbsp;&nbsp;'
				      +                            '<button type="button" class="btn btn-warning btn-xs" id="mem_orient_reset">����</button>'
			          +                        '</p>'
					  +                   '</div>'
					  +		       '</form>'
					  +       '</div>'
					  +     '</div>'
				      +   '</div>'
				      +   '<div class="tabbable" style="margin-top:8px; margin-bottom:10px;">'
				      +      '<div class="row" style="width:100%;  heigth:auto; overflow:hidden;"><ul class="nav nav-tabs">'
				      +         '<li class="active"><a href="javascript:void(0);" data-toggle="tab"  role="nav" data="vip">VIP</a></li>'
				      +         '<li><a href="javascript:void(0);" data-toggle="tab"  role="nav" data="orinary">��ͨ��Ա</a></li>'
				      +      '</ul></div>'
					  +	     '<div class=" tab-content-me" style="padding:0px;margin-top:-1px;">'
					  +	        '<div class="tab-pane active">'
					  +	            '<table class="table table-hover" style="margin-bottom:0px;">'
					  +		           '<tr>'
					  +		              '<th style="width:10%;"><div class="checkbox" style="margin:0px;"><label><input type="checkbox" class="memori_cbAll">ȫѡ</label></div></th>'
					  + 			      '<th style="width:15%">��Ա����</th>'
					  +			          '<th style="width:15%">����ʡ</th>'
					  +			          '<th style="width:15%">������</th>'
					  + 			      '<th style="width:15%">������</th>'
					  + 			      '<th style="width:15%">�����ַ</th>'
					  + 			      '<th style="width:15%">����</th>'
					  +		           '</tr>'
					  +                '<tbody id="member_orient_content">'
					  +				      '<tr><td colspan="7">���ݼ�����...</td></tr>'
					  +			       '</tbody>'
					  +		           '<tr>'
					  +		              '<td style="width:6%;"><div class="checkbox" style="margin-top:5px;"><label><input type="checkbox" class="memori_cbAll">ȫѡ</label></div></td>'
					  +			          '<td colspan="6" style="text-align:right;" id="memori_pagerTool"></td>'
					  +	               '</tr>'
					  +	           '</table>'
					  +	        '</div>'
					  +	     '</div>'
				      +   '</div>'
					  +"</div>",   
	   /**
		* ѡ��ĵ�����Ա
		*/
		_selectedItem : {cust_no:'',cust_name:''},
		/**
		* ɾ���ĵ�����Ա
		*/
		_deletedItem : {cust_no:'',cust_name:''},
	   /**
		* ѡ��Ķ����Ա
	    */
		_selectedItems : [],
		/**
		* ��ѡ��Ļ�Ա����
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
				* ��ʾ��Աѡ������ɵ�html��dom id
			    */
			id  :"",
			/**
			 * �����ֶ�
			 */
			sort:{value:'cust_no'},
			/**
			 * ����ʽ
			 */
			dir:{value:'desc'},
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
	MemberOrient.setSelected = function(sel){
		MemberOrient.selected = sel;
	}
	MemberOrient.dl = null;
	MemberOrient.initLabel = function(selNo,selName,id,obj){
		
				if(MemberOrient.dl == null)
					MemberOrient.dl=new MemberOrient(obj);	
		
				var html="";
				for(var i=0;i<selNo.length;i++){
					if(selNo[i]!=""){
						var cust_no = selNo[i];
						var cust_name = selName[i];
						html+="<div class='col-md-3' id="+cust_no+" title='"+cust_name+"' style ='height:65px;overflow:hidden;padding:0px;padding-right:5px;margin-bottom:5px;'>";
						html+="<div class='alert alert-warning  alert-dismissable' style='height:65px;overflow:hidden;margin-bottom:10px;'>";
						html+="<button type='button' class='close' cust_no="+cust_no+" cust_name="+cust_name+" data-dismiss='alert' aria-hidden='true'>&times;</button>";
						html+=cust_name+"</div></div>";
					}
					
				}
				Node.all(html).appendTo("#"+id);
				Event.delegate(DOM.get("#"+id),'click' ,'button.close',function(e){
					    var el=S.all(e.target);
						var closeID="#"+el.attr("cust_no");
						DOM.remove(closeID);
						var cust_no=el.attr("cust_no");
						var cust_name=el.attr("cust_name");
						MemberOrient.dl._deletedItem = []; 
						MemberOrient.dl._deletedItem.push({cust_no:cust_no,cust_name:cust_name});
						MemberOrient.dl.get("deleteLabel").call(MemberOrient.dl,MemberOrient.dl);
				});
	}
	
	
	MemberOrient.show=function(obj){
		if(MemberOrient.dl == null)
			MemberOrient.dl=new MemberOrient(obj);	
		MemberOrient.dl._prepare();
	}
	return MemberOrient;
},{
    requires: ['base','dom','event',KISSY.myPackageName+'/util/form/form',KISSY.myPackageName+'/util/pager',
               KISSY.myPackageName+"/util/dialog/dialog",'node', KISSY.myPackageName+'/util/tabs/tabs']
});