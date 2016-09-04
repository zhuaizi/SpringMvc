/**
 * �ջ���������ַ���
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


	

	
	S.extend(AddressEdit,Base,{  //�̳л���
		isshow : false,
		/**
	 	 * �жϵ�ַ�Ƿ��Ѿ���ѡ����
	 	 */
		_hasSel:function(mem){
	 		var hasIn = false;
	 		
	 		return hasIn;
	 	},
		_prepare : function(cfg){
			var self=this;
			var cbk = self.get("callback");
			var w = self.get('width');
			AddressEdit._selectedItems = []; //ÿ�ε���ѡ����ʱ�����֮ǰ��¼����ѡ��ĵ�ַ
			var oper = self.get('oper');
			var title = oper=='add'?'����µ�ַ':'�޸ĵ�ַ';
			var DiaF = new OverLay.Dialog({
				width:w,
		        headerContent: title,
		        bodyContent: AddressEdit.SHOW_HTML,
		        zIndex : {value:99},
		        footerContent:'<div style="text-align:center;margin-top:40px;" class="">'+
		        			'<button class="btn-me06" id="save" type="button">����</button>'+
		        			'<button class="btn-me06" style="margin-left:10px;" id="cancel" type="button">����</button>'+
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
			if(oper=='edit'){
	 			editAddr();
	 		}
			/**
			 * ����֤���ύ
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
		     * ʡ����ѡ�񵯲�
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
			 * ��ΪĬ��
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
			 			Dia.alert('������ʮ����ַ��������ɾ��һ�����ܼ�����ӣ�');
			 			return;
			 		}
		 		}
		 		var bParam = addForm.get('baseParam');
		 		bParam.oper=oper;
		 		/**
			 	 * ��������ţ��ܻ��ű���
			 	 */
		 		if(DOM.val('#ss1_q')&&!DOM.val('#ss1_z')){
		 			DOM.attr("#ss1_z","data-rules","{required:true,regexp:/^(\\d{7,8})$/}");
					DOM.attr("#ss1_z","data-msg","{required:'�ܻ��Ų���Ϊ�գ�',regexp:'������Ч���ܻ��ţ�'}");
		 		}else{
		 			DOM.attr("#ss1_z","data-rules","{regexp:/^(\\d{7,8})$/}");
					DOM.attr("#ss1_z","data-msg","{regexp:'������Ч���ܻ��ţ�'}");
		 		}
		 		/**
			 	 * ������ܻ��ţ������ű���
			 	 */
		 		if(DOM.val('#ss1_z')&&!DOM.val('#ss1_q')){
		 			DOM.attr("#ss1_q","data-rules","{required:true,regexp:/^(\\d{3,4})$/}");
					DOM.attr("#ss1_q","data-msg","{required:'���Ų���Ϊ�գ�',regexp:'������Ч�����ţ�'}");
		 		}else{
		 			DOM.attr("#ss1_q","data-rules","{regexp:/^(\\d{3,4})$/}");
					DOM.attr("#ss1_q","data-msg","{regexp:'������Ч�����ţ�'}");
		 		}
		 		var msg = addForm.isValid();
				if(msg){/*msg�ǿձ�ʾ��֤��ͨ��*/
					Dia.alert(msg);
					return ;
				}
		 		/**
		 		 * �绰������ֻ��ſ���ѡ��һ����д
		 		 */
		 		if(DOM.val('#ss1_q')||DOM.val('#ss1_z')){
					if(DOM.val('#ss1_f')){
						bParam.ss1 = DOM.val('#ss1_q')+'-'+DOM.val('#ss1_z')+'-'+DOM.val('#ss1_f');
					}else{
						bParam.ss1 = DOM.val('#ss1_q')+'-'+DOM.val('#ss1_z');
					}
					
		 		}else if(DOM.val('#phone').replace(/\s+/g,"").length==0){
		 			//DOM.attr("#phone","data-rules","{required:true,isMobile:true}");
					//DOM.attr("#phone","data-msg","{required:'�ֻ��Ų���Ϊ�գ�',isMobile:'������Ч���ֻ��ţ�'}");
		 			Dia.alert('�绰���롢�ֻ��ű�����һ�');
		 			bParam.ss1 = '';
		 			return;
		 		}
		 		
				
				var addrInfo = combox.getValues('wh_addr_id');
		 		if(addrInfo.length < 3){//�ж��Ƿ�ѡ������
		 			Dia.alert('���ڵ�����ѡ����!');
		 			return;
		 		}
		 		var descrip = addrInfo[0].name+" "+addrInfo[1].name+" "+addrInfo[2].name;//��ַ����
		 		bParam.descrip=descrip;
		 		bParam.city_no=addrInfo[0].id;
		 		bParam.area_no=addrInfo[1].id;
		 		bParam.county_no=addrInfo[2].id;
		 		Dia.show('ȷ����Ϣ','ȷ��Ҫ������','q',400,function(btnObj,btn){
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
							       '<a href="#" class="ck_oper" addr = "<%- item.addr%>" id = "<%- item.id%>" city_no = "<%- item.city_no%>" area_no = "<%- item.area_no%>" county_no = "<%- item.county_no%>" descrip = "<%- item.descrip%>">ѡ��</a>',
							    '</td>', 
							'<%}%>'
		                  ]).toString()),
		SHOW_HTML : '<form class="form-horizontal" role="form" id="addForm">'
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2"></label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		�绰���롢�ֻ���ѡ��һ��,�����Ϊ������' 
				    +'	</div>' 
				    +'</div>' 
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">�ջ���<font color="red">*</font>��</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			data-rules="{required:true,maxLength:20}" ' 
				    +'			data-msg="{required:\'�ջ��˲���Ϊ�գ�\',maxLength:\'�ջ������볤�Ȳ��ܴ���10�����ֻ�20���ַ���\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="linkman" name="linkman" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">���ڵ���<font color="red">*</font>��</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			 id="wh_addr_id" type="text" readOnly="readOnly"' 
				    +'			 placeholder="��ѡ�����ڵ���"' 
				    +'			 data-rules="{required:true}" ' 
				    +'			 data-msg="{required:\'���ڵ�������Ϊ�գ�\'}"  ' 
				    +'			 msg-type="{type:\'right\',part:14}"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">�ֵ���ַ<font color="red">*</font>��</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			data-rules="{required:true,maxLength:40}" ' 
				    +'			data-msg="{required:\'�ֵ���ַ����Ϊ�գ�\',maxLength:\'�ֵ���ַ���볤�Ȳ��ܴ���20�����ֻ�40���ַ���\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="addr" name="addr" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2">��������<font color="red">*</font>��</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm"  ' 
				    +'			data-rules="{required:true,regexp:/^[0-9][0-9]{5}$/}" ' 
				    +'			data-msg="{required:\'�������벻��Ϊ�գ�\',regexp:\'������Ч���������룡\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss2" name="ss2" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row" style="margin-left:-12px;">' 
				    +'	<label class="control-label col-md-2">�绰���룺</label>' 
				    +'	<div class="form-group col-md-2" style="margin-right:-13px;" id="dateGroup1">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="����"' 
				    +'			data-rules="{regexp:/^(\\d{3,4})$/}" ' 
				    +'			data-msg="{regexp:\'������Ч�����ţ�\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_q" name="ss1_q" type="text"/>' 
				    +'	</div>' 
				    +'	<div class="form-group col-md-2" style="margin-right:-13px;" id="dateGroup">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="�ܻ���"' 
				    +'			data-rules="{regexp:/^(\\d{7,8})$/}" ' 
				    +'			data-msg="{regexp:\'������Ч���ܻ��ţ�\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_z" name="ss1_z" type="text"/>' 
				    +'	</div>' 
				    +'	<div class="form-group col-md-2">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			placeholder="�ֻ���"' 
				    +'			data-rules="{regexp:/^(\\d{1,4})$/}" ' 
				    +'			data-msg="{regexp:\'������Ч�ķֻ��ţ�\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"' 
				    +'			id="ss1_f" name="ss1_f" type="text"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:5px;">' 
				    +'	<label class="control-label col-md-2">�ֻ��ţ�</label>' 
				    +'	<div class="col-md-5" style="padding-left:0px;">' 
				    +'		<input class="form-control input-sm" ' 
				    +'			id="phone" name="phone" type="text"' 
				    +'			placeholder="�绰���롢�ֻ��ű�����һ��"' 
				    +'			data-rules="{isMobile:true}" ' 
				    +'			data-msg="{isMobile:\'������Ч���ֻ��ţ�\'}"  ' 
				    +'			msg-type="{type:\'right\',part:14}"/>' 
				    +'	</div>' 
				    +'</div>' 
			
				    +'<div class="row form-group" style="margin-bottom:15px;">' 
				    +'	<label class="control-label col-md-2"></label>' 
				    +'		<div class="col-md-2" style="padding-left:0px;">' 
				    +'		<div class="checkbox">' 
				    +'			<input type="hidden" name="num1" id="num1" value="0"/>' 
				    +'			<label><input type="checkbox" name="num1_check" id="num1_check"/> ��ΪĬ��</label>' 
				    +'		</div>' 
				    +'	</div>' 
				    +'</div>' 
				    +'<input type="hidden" name="address_id" id="address_id" value="-100"/>' 
					
				    +'</form>'   ,   
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
			 * oper:add/edit
			 */
			oper:{value:'add'},
			/**
			 * ÿҳ��ʾ����
			 */
			pageSize:{value:5},
			/**
			 * �ص�������ֻ�ڵ㡰ȷ�����͡�ѡ�񡱵�ʱ��ִ��
			 * param : �������
			 */
			zIndex : {value:99},
			/**
			 * ��ַID
			 */
			addr_id:{value:0},
			callback : {value:function(memOri){}}, 
			/**
			 * ɾ��������ֻ�ڵ�ɾ����ʱ��ִ��
			 * param : �������
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