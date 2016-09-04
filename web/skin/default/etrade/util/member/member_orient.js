/**
 * 会员定向组件
 * 
 * @author zhenghq
 * @since 2014-2-26
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/member/member_orient", function (S,Base,DOM,Event,Form,Pager,Dia,Node,Tabs) {
	
	var MemberOrient = function (config){
		MemberOrient.superclass.constructor.call(this,config);
	};


	

	
	S.extend(MemberOrient,Base,{  //继承基类
		isshow : false,
		/**
	 	 * 判断会员是否已经被选择了
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
			MemberOrient._selectedItems = []; //每次弹出选择窗体时都清空之前记录的已选择的会员
			var DiaF=Dia.shows({
					       	 	title:'选择定向会员',
					       	 	bodys:MemberOrient.SHOW_HTML,
					       	 	closeable:false,
					       	 	buttonGroup:[{title:'确认',retValue:'confirm'},{title:'返回',retValue:'cancel'}],
					       	 	width:w,
					       	    minBodyHeight:h,
					       		callback:function(btnObj,btn){
					       			if(btn=="confirm"){  
					       				var arr=MemberOrient._selectedItems;//DOM.query('#member_orient_content input');
					       				var html = ""; //会员生成的html
					       				var j=arr.length;
					       				
					       				if((MemberOrient.selected.length+j)<=20){//只能添加20个定向会员
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
						       				var msg='最多添加20个定向会员，您已经添加'+MemberOrient.selected.length+'个定向会员！';
						       				DiaF.hide();
						       				Dia.show('提示信息',msg,'qm',400,function(btnObj,btn){
						       					DiaF.show();
											});
						       			}
					       			}else if(btn=="cancel"){
					       				DiaF.close();
					       			}
						        }	
					       		
					       				
			               });
		/*为复选框设置点击状态*/
		 	Event.on('.memori_cbAll','click',function(e){
		 		var c=e.target.checked;
		 		var arr=DOM.query('#member_orient_content input');
		 		for(var i=0;i<arr.length;i++){
		 			arr[i].checked=c;
		 			var mem = {cust_no:DOM.attr(arr[i],'cust_no'),cust_name:DOM.attr(arr[i],'cust_name')};
		 			if(c){//如果选中，则记录已选中会员
		 				registSelected(mem);
		 			}else{//如果未选中，则从记录中删除
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
			 * 表单验证及提交
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
			 * TAB实现
			 */
			var tabs=new Tabs({
				callback:function(o){
					var member_type = DOM.attr(o,"data");
					DOM.val("#memori_member_type",member_type);
		 			DOM.val('#memori_start',0);
					pager.reset();
					DOM.html('#member_orient_content','<tr><td colspan="7">数据加载中...</td></tr>');				
					ff.submit();
				}
			});
			tabs.render();
		 	/**
		 	 * 判断会员是否已经被选择了
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
		 	 *  记录已选择的会员信息 
		 	 */
		 	function registSelected(mem){
		 		var isIn = MemberOrient.dl._hasSel(mem);
		 		if(!isIn){
		 			MemberOrient._selectedItems.push(mem);
		 		}
		 	}
		 	/**
		 	 *  删除已选择的会员信息 
		 	 */
		 	function deletSelected(mem){
		 		for(var i=0;i<MemberOrient._selectedItems.length;i++){
		 			if(MemberOrient._selectedItems[i].cust_no == mem.cust_no){
		 				MemberOrient._selectedItems.splice(i,1);
		 			}
		 		}
		 	}
		 	/**
			 * 设置显示列表
			 */ 
		 	function initList(data){
		 		var is_check_all = true; //是否全选
		 		for(var i=0;i<data.resultlist.length;i++){
		 			var d = data.resultlist[i];
		 			var c_mem = {cust_no:d.cust_no,cust_name:d.cust_name};
		 			var is_selected = MemberOrient.dl._hasSel(c_mem);
		 			data.resultlist[i].is_selected = is_selected;
		 			if(!is_selected) is_check_all=false;
		 		}
		 		shouPager(data);
		 		DOM.html('#member_orient_content','<tr><td colspan="7">数据加载中...</td></tr>');
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
		    
				if((MemberOrient.selected.length+1)<=20){//只能添加20个定向会员
		    	var cust_no = DOM.attr(obj,'cust_no');
		    	var cust_name = DOM.attr(obj,'cust_name');
		    	
		    	MemberOrient._selectedItem.cust_no = cust_no;
		    	MemberOrient._selectedItem.cust_name = cust_name;
		    	MemberOrient._selectedItems = []; //先清空已选择的会员信息
		    	MemberOrient._selectedItems.push(MemberOrient._selectedItem); //再添加本行会员信息
		    	
		    	
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
						       				var msg='最多添加20个定向会员，您已经添加'+MemberOrient.selected.length+'个定向会员！';
						       				DiaF.hide();
						       				Dia.show('提示信息',msg,'qm',400,function(btnObj,btn){
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
							       '<button type="button" class="btn btn-danger btn-xs ck_oper" cust_no = "<%- item.cust_no%>" cust_name = "<%- item.cust_name%>" >选择</button>',
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
					  +		                      '<label class="control-label col-md-5" style="text-align:right;">会员名称：</label>'
					  +		                      '<div class="row col-md-7">' 
					  +		                            '<input type="text"class="form-control col-md-12 input-sm" data-rules="{maxLength:100}" name="cust_name" data-msg="{maxLength:\'会员名称最大长度为100个字符，或50个汉字\'}"/>'
					  + 		                        '<input type="hidden" name="start" id="memori_start"/>'
					  +                                 '<input type="hidden" name="member_type" id="memori_member_type" value="vip"/>'
					  +	                          '</div>'
					  +			              '</div>'
					  +		              '</div>'
					  +		              '<div class="col-md-3" style="width:35%;">'
					  +		                   '<div class="form-group">'
					  + 		                   '<label class="control-label col-md-5" style="text-align:right;">所在地：</label>'
					  +			                   '<div class="row col-md-7">'
					  +				                    '<input type="text"class="form-control col-md-12 input-sm" name="addr" data-rules="{maxLength:40}"  data-msg="{maxLength:\'所在地最大长度为40个字符，或20个汉字\'}">' 
					  +				               '</div>'
					  +				           '</div>'
					  +		              '</div>'
					  + 	              '<div class="col-md-3"style="width:30%;margin-top:5px;">' 
					  +                        '<p>'
				      +                            '<button type="button" class="btn btn-success btn-xs" id="mem_orient_query">查询</button>&nbsp;&nbsp;&nbsp;&nbsp;'
				      +                            '<button type="button" class="btn btn-warning btn-xs" id="mem_orient_reset">重置</button>'
			          +                        '</p>'
					  +                   '</div>'
					  +		       '</form>'
					  +       '</div>'
					  +     '</div>'
				      +   '</div>'
				      +   '<div class="tabbable" style="margin-top:8px; margin-bottom:10px;">'
				      +      '<div class="row" style="width:100%;  heigth:auto; overflow:hidden;"><ul class="nav nav-tabs">'
				      +         '<li class="active"><a href="javascript:void(0);" data-toggle="tab"  role="nav" data="vip">VIP</a></li>'
				      +         '<li><a href="javascript:void(0);" data-toggle="tab"  role="nav" data="orinary">普通会员</a></li>'
				      +      '</ul></div>'
					  +	     '<div class=" tab-content-me" style="padding:0px;margin-top:-1px;">'
					  +	        '<div class="tab-pane active">'
					  +	            '<table class="table table-hover" style="margin-bottom:0px;">'
					  +		           '<tr>'
					  +		              '<th style="width:10%;"><div class="checkbox" style="margin:0px;"><label><input type="checkbox" class="memori_cbAll">全选</label></div></th>'
					  + 			      '<th style="width:15%">会员名称</th>'
					  +			          '<th style="width:15%">所在省</th>'
					  +			          '<th style="width:15%">所在市</th>'
					  + 			      '<th style="width:15%">所在县</th>'
					  + 			      '<th style="width:15%">具体地址</th>'
					  + 			      '<th style="width:15%">操作</th>'
					  +		           '</tr>'
					  +                '<tbody id="member_orient_content">'
					  +				      '<tr><td colspan="7">数据加载中...</td></tr>'
					  +			       '</tbody>'
					  +		           '<tr>'
					  +		              '<td style="width:6%;"><div class="checkbox" style="margin-top:5px;"><label><input type="checkbox" class="memori_cbAll">全选</label></div></td>'
					  +			          '<td colspan="6" style="text-align:right;" id="memori_pagerTool"></td>'
					  +	               '</tr>'
					  +	           '</table>'
					  +	        '</div>'
					  +	     '</div>'
				      +   '</div>'
					  +"</div>",   
	   /**
		* 选择的单个会员
		*/
		_selectedItem : {cust_no:'',cust_name:''},
		/**
		* 删除的单个会员
		*/
		_deletedItem : {cust_no:'',cust_name:''},
	   /**
		* 选择的多个会员
	    */
		_selectedItems : [],
		/**
		* 已选择的会员数组
	    */
		selected : [],
		ATTRS:{
			/**
			 * 宽度
			 */
			width:{value:''},
			/**
			 * 最小高度
			 */
			minHeight:{value:800},
			/**
				* 显示会员选择后生成的html的dom id
			    */
			id  :"",
			/**
			 * 排序字段
			 */
			sort:{value:'cust_no'},
			/**
			 * 排序方式
			 */
			dir:{value:'desc'},
			/**
			 * 每页显示条数
			 */
			pageSize:{value:5},
			/**
			 * 回调函数，只在点“确定”和“选择”的时候执行
			 * param : 组件本身
			 */
			callback : {value:function(memOri){}}, 
			/**
			 * 删除函数，只在点删除的时候执行
			 * param : 组件本身
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