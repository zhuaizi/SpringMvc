/**
 * 收货、发货地址组件
 * 
 * @author zhaodw
 * @since 2014-05-22
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/address/address_edit", 
		function (S,Base,DOM,IO,Event,Form,Pager,Dia,Node,OverLay,CascadeCombox) {
	
	var AddressEdit = function (config){
		AddressEdit.superclass.constructor.call(this,config);
	};


	

	
	S.extend(AddressEdit,Base,{  //继承基类
		isshow : false,
		/**
	 	 * 判断地址是否已经被选择了
	 	 */
		_hasSel:function(mem){
	 		var hasIn = false;
	 		
	 		return hasIn;
	 	},
		_prepare : function(cfg){
			var self=this;
			var cbk = self.get("callback");
			var w = self.get('width');
			AddressEdit._selectedItems = []; //每次弹出选择窗体时都清空之前记录的已选择的地址
			var oper = self.get('oper');
			var title = oper=='add'?'添加新地址':'修改地址';
			var DiaF = new OverLay.Dialog({
				width:w,
		        headerContent: title,
		        bodyContent: AddressEdit.SHOW_HTML,
		        zIndex : {value:99},
		        footerContent:'<div style="text-align:center;margin-top:40px;" class="">'+
		        			'<button class="btn-me06" id="save" type="button">保存</button>'+
		        			'<button class="btn-me06" style="margin-left:10px;" id="cancel" type="button">返回</button>'+
		        			'</div>',
		        closeAction:'destroy',
		        closable:false,/*关闭按钮*/
				escapeToClose:false,/*ESC按键关闭*/
		        mask:{
		            effect:'fade'
		        },
		        align: {
		            points: ['cc', 'cc']
		        }
		    });
			DiaF.show();
			if(oper=='edit'){
	 			editAddr();
	 		}
			/**
			 * 表单验证及提交
			 */
			var addForm = new Form({
				srcNode	: "#addForm",
		 		url		: "/jsrh/address/address_mng_query.shtml",
		 		baseParam:{
		 			num2:self.get('num2'),
		 			oper:self.get('oper')
		 		},
		 		callback	: function(text){
		 			if(cbk && typeof cbk=='function')
		    			self.get("callback").call(self,AddressEdit);
		 			DiaF.close();
		 		}
		 	});	 	
			addForm.render(); 
		 	
		 	/**
		     * 省市县选择弹层
		     */
		    var combox = new CascadeCombox({
				triggers: ['wh_addr_id']			
			});			
			combox.render();
		 	
		 	Event.on('#cancel','click',function(){
		 		 combox.hide('wh_addr_id');
		 		 DiaF.close();
		 	});
		 	Event.on('#save','click',function(){
		 		save(oper);
		 	});
		 	/**
			 * 设为默认
			 */
		 	Event.on('#num1_check','click',function(e){
		 		var c=e.target.checked;
		 		if(c==true){
		 			DOM.val('#num1',1);
		 		}else{
		 			DOM.val('#num1',0);
		 		}
		 	});	
		 	function save(oper){
		 		if(oper=='add'){
		 			if(DOM.val('#rows_count')>=10){
			 			Dia.alert('最多添加十个地址，请至少删除一个才能继续添加！');
			 			return;
			 		}
		 		}
		 		var bParam = addForm.get('baseParam');
		 		bParam.oper=oper;
		 		/**
			 	 * 如果填区号，总机号必填
			 	 */
		 		if(DOM.val('#ss1_q')&&!DOM.val('#ss1_z')){
		 			DOM.attr("#ss1_z","data-rules","{required:true,regexp:/^(\\d{7,8})$/}");
					DOM.attr("#ss1_z","data-msg","{required:'总机号不能为空！',regexp:'不是有效的总机号！'}");
		 		}else{
		 			DOM.attr("#ss1_z","data-rules","{regexp:/^(\\d{7,8})$/}");
					DOM.attr("#ss1_z","data-msg","{regexp:'不是有效的总机号！'}");
		 		}
		 		/**
			 	 * 如果填总机号，则区号必填
			 	 */
		 		if(DOM.val('#ss1_z')&&!DOM.val('#ss1_q')){
		 			DOM.attr("#ss1_q","data-rules","{required:true,regexp:/^(\\d{3,4})$/}");
					DOM.attr("#ss1_q","data-msg","{required:'区号不能为空！',regexp:'不是有效的区号！'}");
		 		}else{
		 			DOM.attr("#ss1_q","data-rules","{regexp:/^(\\d{3,4})$/}");
					DOM.attr("#ss1_q","data-msg","{regexp:'不是有效的区号！'}");
		 		}
		 		var msg = addForm.isValid();
				if(msg){/*msg非空表示验证不通过*/
					Dia.alert(msg);
					return ;
				}
		 		/**
		 		 * 电话号码和手机号可以选择一项填写
		 		 */
		 		if(DOM.val('#ss1_q')||DOM.val('#ss1_z')){
					if(DOM.val('#ss1_f')){
						bParam.ss1 = DOM.val('#ss1_q')+'-'+DOM.val('#ss1_z')+'-'+DOM.val('#ss1_f');
					}else{
						bParam.ss1 = DOM.val('#ss1_q')+'-'+DOM.val('#ss1_z');
					}
					
		 		}else if(DOM.val('#phone').replace(/\s+/g,"").length==0){
		 			//DOM.attr("#phone","data-rules","{required:true,isMobile:true}");
					//DOM.attr("#phone","data-msg","{required:'手机号不能为空！',isMobile:'不是有效的手机号！'}");
		 			Dia.alert('电话号码、手机号必须填一项！');
		 			bParam.ss1 = '';
		 			return;
		 		}
		 		
				
				var addrInfo = combox.getValues('wh_addr_id');
		 		if(addrInfo.length < 3){//判断是否选择到了县
		 			Dia.alert('所在地区请选择到县!');
		 			return;
		 		}
		 		var descrip = addrInfo[0].name+" "+addrInfo[1].name+" "+addrInfo[2].name;//地址名称
		 		bParam.descrip=descrip;
		 		bParam.city_no=addrInfo[0].id;
		 		bParam.area_no=addrInfo[1].id;
		 		bParam.county_no=addrInfo[2].id;
		 		Dia.show('确认信息','确定要保存吗？','q',400,function(btnObj,btn){
		 			if(btn=='ok'){
		 				addForm.submit();
		 			}
				});
		    
		 	}
		 	
		 	function editAddr(){
		 		IO({  
					data : {
						id  : self.get('addr_id')
					},
					dataType : 'json',
					url : '/jsrh/address/address_mng_query_detail.shtml',
					success : function(result){
				 		DOM.val('#linkman',result.data.linkman);
				 		DOM.val('#wh_addr_id',result.data.descrip);
				 		DOM.val('#addr',result.data.addr);
				 		DOM.val('#ss2',result.data.ss2);
				 		DOM.val('#phone',result.data.phone);
				 		DOM.val('#address_id',result.data.id);
				 		var ss1 = result.data.ss1;
				 		if(ss1){
				 			var s1 = ss1.split('-');
					 		if(s1.length==1){
					 			DOM.val('#ss1_q',s1[0]);
					 		}else if(s1.length==2){
					 			DOM.val('#ss1_q',s1[0]);
					 			DOM.val('#ss1_z',s1[1]);
					 		}else if(s1.length==3){
					 			DOM.val('#ss1_q',s1[0]);
					 			DOM.val('#ss1_z',s1[1]);
					 			DOM.val('#ss1_f',s1[2]);
					 		}
				 		}
				 		if(result.data.num1==1){
				 			DOM.get('#num1_check').checked=true;
				 			DOM.val('#num1',1);
				 		}else{
				 			DOM.get('#num1_check').checked=false;
				 			DOM.val('#num1',0);
				 		}
				 		var d = result.data.descrip.split(' ');
				 		combox.setValues("wh_addr_id",[
				 		    {id:result.data.city_no,name:d[0]},
				 		    {id:result.data.area_no,name:d[1]},
				 		    {id:result.data.county_no,name:d[2]}
				 		]);
				 		combox.setRawValue("wh_addr_id");
					}
				});
		 		
		 	}
		    
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
							       '<a href="#" class="ck_oper" addr = "<%- item.addr%>" id = "<%- item.id%>" city_no = "<%- item.city_no%>" area_no = "<%- item.area_no%>" county_no = "<%- item.county_no%>" descrip = "<%- item.descrip%>">选择</a>',
							    '</td>', 
							'<%}%>'
		                  ]).toString()),
		SHOW_HTML : '<form class="form-horizontal" role="form" id="addForm">'
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2"></label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		电话号码、手机号选填一项,其余均为必填项' 
				    +'	</div>' 
				    +'</div>' 
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">收货人<font color="red">*</font>：</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			data-rules="{required:true,maxLength:20}" ' 
				    +'			data-msg="{required:\'收货人不能为空！\',maxLength:\'收货人输入长度不能大于10个汉字或20个字符！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="linkman" name="linkman" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">所在地区<font color="red">*</font>：</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			 id="wh_addr_id" type="text" readOnly="readOnly"' 
				    +'			 placeholder="请选择所在地区"' 
				    +'			 data-rules="{required:true}" ' 
				    +'			 data-msg="{required:\'所在地区不能为空！\'}"  ' 
				    +'			 msg-type="{type:\'right\',part:14}"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">街道地址<font color="red">*</font>：</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			data-rules="{required:true,maxLength:40}" ' 
				    +'			data-msg="{required:\'街道地址不能为空！\',maxLength:\'街道地址输入长度不能大于20个汉字或40个字符！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="addr" name="addr" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">邮政编码<font color="red">*</font>：</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm"  ' 
				    +'			data-rules="{required:true,regexp:/^[0-9][0-9]{5}$/}" ' 
				    +'			data-msg="{required:\'邮政编码不能为空！\',regexp:\'不是有效的邮政编码！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss2" name="ss2" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row" style="margin-left:-12px;">' 
				    +'	<label class="control-label col-md-2">电话号码：</label>' 
				    +'	<div class="form-group col-md-2" style="margin-right:-13px;" id="dateGroup1">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="区号"' 
				    +'			data-rules="{regexp:/^(\\d{3,4})$/}" ' 
				    +'			data-msg="{regexp:\'不是有效的区号！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_q" name="ss1_q" type="text"/>' 
				    +'	</div>' 
				    +'	<div class="form-group col-md-2" style="margin-right:-13px;" id="dateGroup">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="总机号"' 
				    +'			data-rules="{regexp:/^(\\d{7,8})$/}" ' 
				    +'			data-msg="{regexp:\'不是有效的总机号！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_z" name="ss1_z" type="text"/>' 
				    +'	</div>' 
				    +'	<div class="form-group col-md-2">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="分机号"' 
				    +'			data-rules="{regexp:/^(\\d{1,4})$/}" ' 
				    +'			data-msg="{regexp:\'不是有效的分机号！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_f" name="ss1_f" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:5px;">' 
				    +'	<label class="control-label col-md-2">手机号：</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			id="phone" name="phone" type="text"' 
				    +'			placeholder="电话号码、手机号必须填一项"' 
				    +'			data-rules="{isMobile:true}" ' 
				    +'			data-msg="{isMobile:\'不是有效的手机号！\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2"></label>' 
				    +'		<div class="col-md-2" style="padding-left:0px;">' 
				    +'		<div class="checkbox">' 
				    +'			<input type="hidden" name="num1" id="num1" value="0"/>' 
				    +'			<label><input type="checkbox" name="num1_check" id="num1_check"/> 设为默认</label>' 
				    +'		</div>' 
				    +'	</div>' 
				    +'</div>' 
				    +'<input type="hidden" name="address_id" id="address_id" value="-100"/>' 
					
				    +'</form>'   ,   
	   /**
		* 选择的单个地址
		*/
		_selectedItem : {id:'',city_no:'',area_no:'',county_no:'',addr:'',descrip:''},
		/**
		* 删除的单个地址
		*/
		_deletedItem : {id:'',city_no:'',area_no:'',county_no:'',addr:'',descrip:''},
	   /**
		* 选择的多个地址
	    */
		_selectedItems : [],
		/**
		* 已选择的地址数组
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
				* 显示地址选择后生成的html的dom id
			    */
			id  :"",
			/**
			 * 排序字段
			 */
			sort:{value:'id'},
			/**
			 * 排序方式
			 */
			dir:{value:'desc'},
			/**
			 * num2=1：买方 收货地址
			 * num2=2：卖方 发货地址
			 */
			num2:{value:'1'},
			/**
			 * oper:add/edit
			 */
			oper:{value:'add'},
			/**
			 * 每页显示条数
			 */
			pageSize:{value:5},
			/**
			 * 回调函数，只在点“确定”和“选择”的时候执行
			 * param : 组件本身
			 */
			zIndex : {value:99},
			/**
			 * 地址ID
			 */
			addr_id:{value:0},
			callback : {value:function(memOri){}}, 
			/**
			 * 删除函数，只在点删除的时候执行
			 * param : 组件本身
			 */
			deleteLabel : {value:function(memOri){}} 
		}
	});
	AddressEdit.setSelected = function(sel){
		AddressEdit.selected = sel;
	};
	AddressEdit.dl = null;
	AddressEdit.initLabel = function(selNo,selName,id,obj){
		
	};
	
	
	AddressEdit.show=function(obj){
		AddressEdit.dl == null;
		AddressEdit.dl=new AddressEdit(obj);	
		AddressEdit.dl._prepare();
	};
	return AddressEdit;
},{
    requires: ['base','dom','io','event',
               KISSY.myPackageName+'/util/form/form',
               KISSY.myPackageName+'/util/pager',
               KISSY.myPackageName+"/util/dialog/dialog",'node','overlay',
               'overlay/assets/dpl.css',
               KISSY.myPackageName+'/common/goods/cascade-combox']
});