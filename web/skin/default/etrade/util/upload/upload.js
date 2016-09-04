/**
 * �ϴ�����
 * 
 * @author lilong
 * @since 2013-10-28
 * @version 1.0
 */
KISSY.add(KISSY.myPackageName+"/util/upload/upload", function (S,Base,DOM,Event,io,Dia) {
	
	var Upload = function (config){
		Upload.superclass.constructor.call(this,config);
	};
	UA = S.UA;
	Node = S.NodeList;
	S.extend(Upload,Base);//�̳л���
	var str="<div class='ks-editor-img-tabs-body' " +
            ">"+ 
            "<div class='ks-editor-img-tabs-panel' style='display:block;'>" +
            "<form class='ks-editor-img-upload-form' enctype='multipart/form-data'>" +
            "<p style='zoom:1;'>" +
            "<input class='ks-editor-img-local-url'  " +
            "readonly='readonly' " +
            "style='margin-right: 15px;padding:5px;height:30px; " +
            "vertical-align: middle; " +
            "width: 350px;" +
            "color:#969696;'/>" +
            "<a " +
            "style='padding:3px 11px;" +
            "position:absolute;" +
            "left:360px;" +
            "top:-2px;" +
            "z-index:1;' " +
            "class='ks-editor-image-up ks-editor-button ks-inline-block'>���...</a>" +
            "</p>" +
            "<div class='ks-editor-img-up-extraHtml'>" +
            "</div>" +
            "</form>" +
            "</div>" +
            "</div>";
	
	Upload.ATTRS ={
			  serverUrl:{value:''},
			  type:{value:'art'},
			  loginAcct:{value:'lilong'},
			  custNo:{value:'111'},
			  sessionId:{value:'asdfsaf'},
			  showValueId:{value:""},//��ʾ�ϴ��ļ����·���Ķ���ID
			  sizeLimit:{value:1000},
			  filter:{value:"png,jpg,jpeg,gif"},//�ϴ��ļ�����
			  fileCode:{value:''},
			  showFileName:{value:''},//��ʾ�ļ�����
			  showDiv:{value:''},//��ʾ�ļ�����div
			  attachId:{value:''}, //��ʾ�����б�id
			  showImag:{value:''}, //��ʾͼƬ
			  delable:{value:false},
			  first_chart:{value:false},
			  callback:{value:function(btnObj,btn,obj,rData){}}/*�ص����� btnObjΪ��ǰ��ť����btnΪ��ǰ��ť��ʶ�磺ok��cancel;Ҳ�����Լ������retValue����ֵ,obj�Ǹö�����,rData���ϴ��������ݵ�json��ʽ*/
			  
	};
	
	Upload.prototype._initButtons=function(o){
    	var btnTpl='';
    	var btns=o.buttons;
		for(var i=0;i<btns.length;i++){
			btnTpl+='<button type="button" id="btn'+i+'" datas="'+btns[i].retValue+'" class="btn  btn-default">'+btns[i].title+'</button>'
		}
		var tpl ='  <div class="modal-footer modal-footer-up" style="text-align:'+o.btnPosition+'">'
		      +btnTpl
		      +' </div>';
		
		return tpl;   
	}
	Upload.prototype._prepare = function(){
		var self=this;
		var o={
    		btnPosition:'center',
    		buttons:[{title:'�ϴ�',retValue:'up'},{title:'����',retValue:'cancel'}]
    	};
                    
        
        var DiaF=Dia.shows({
       	 	title:'�ϴ��ļ�(�ļ�����:'+self.get("filter")+')',
       	 	bodys:str,
       	 	closeable:false,
       	 	buttonGroup:[{title:'�ϴ�',retValue:'up'},{title:'����',retValue:'cancel'}],
       	 	width:500,
       		callback:function(btnObj,btn){
       			if(btn=="up"){  
       					btnObj.disabled=true;
	       				if (DOM.val(".ks-editor-img-local-url") == warning) {
		                 Dia.alert("����ѡ���ļ�!");
		                 btnObj.disabled=false;
		                 return;
		             	}
						
	                    if (!self.suffix_reg.test(DOM.val(".ks-editor-img-local-url"))) {
	                        Dia.alert(self.suffix_warning);
	                        DOM.val(".ks-editor-img-local-url","");
	                        btnObj.disabled=false;
	                        return;
	                    }
	
	                    var size = (getFileSize(self.fileInput[0]));	                    
	                    size = (size/1024/1024)*1000;	                    
	                    if (sizeLimit && sizeLimit < size) {
	                        Dia.alert("�ϴ��ļ����" + sizeLimit/1000 + "M");
	                        DOM.val(".ks-editor-img-local-url","");
	                        btnObj.disabled=false;
	                        return;
	                    }
						/**
	                     * ȡ����ǰiframe���ϴ�
	                     */
	                    loadingCancel.on("click", function (ev) {
	                        ev.halt();
	                        uploadIO.abort();
	                        btnObj.disabled=false;
	                    });
						var filter="."+self.suffix.split(/,/).join("|.");
						var clienttype=UA.ie==8 ?'kiss':'nokiss';
	                    var uploadIO =io({
							type: 'post',
							form: DOM.get(".ks-editor-img-upload-form"),
					
	                        url: self.get("serverUrl")+'?clienttype='+clienttype+'&model_no='+self.get("type")+'&filter='+filter+'&sid='+self.get("sessionId")+'&empacct='+self.get("loginAcct")+'&cust_no='+self.get("custNo"),
	                        dataType: 'json',
	                        complete: function (data) {
	                            loadingCancel.css({
	                                left: -9999,
	                                top: -9999
	                            });
	                            DOM.css('.cancle', "top",-9999);
                    			DOM.css('.cancle', "left",-9999);
                    			if(data!=null){
                    				if(data.success==true){
		                            	var DiaS=Dia.show('��ʾ��Ϣ','�ϴ��ɹ�','qm',500,function(btnObj,btn){
		                            		if(self.get("showValueId")){
		                            			
		                            			if (self.get("type") == 'profile')
		                            			{
		                            				DOM.val("#"+self.get("showValueId"),data.urls);
		                            				DOM.val("#"+self.get("showValueId")+"_hidden",data.urls_show);
		                            			}
		                            			else
		                            			{
		                            				DOM.val("#"+self.get("showValueId"),data.urls);
		                            			}
		                            		}
		                            		if(self.get("fileCode")){
		                            			DOM.val("#"+self.get("fileCode"),data.code);
		                            		}
		                            		if(self.get("showFileName")){
		                            			DOM.html("#"+self.get("showFileName"),DOM.val(".ks-editor-img-local-url"));
		                            		}
		                            		if(self.get("showDiv")){
		                            			var new_html = "<div style='width:70px;float:left;'><img class='img-me01 pic_id' src='/filepool" + data.urls+ "' value='"+data.code+ "' style='width:58px; height:58px; border:#ddd solid 1px; margin-right:1px;'/>";
		                            			if(self.get("delable")){
		                            				new_html = new_html + "<a href='javascript:void(0)' class='up_img_del' value='"+data.code+"' title='ɾ��'>X</a>";
		                            			}
		                            			if(self.get("first_chart")){
		                            				new_html = new_html + "<a href='javascript:void(0)' class='first_chart' value='"+data.urls+"' title='��Ϊ��ͼ'>��Ϊ��ͼ</a>"
		                            			}	                            			
		                            			new_html = new_html + "</div>";
		                            			var attachids = DOM.val("#"+self.get("attachId"));
		                            			attachids += ',' + data.code;
		                            			DOM.html("#"+self.get("showDiv"),DOM.html("#"+self.get("showDiv"))+new_html);
		                            			//ɾ��
		                            			Event.delegate('a.up_img_del','click', null ,function(e){
		                 					    	var val = DOM.attr(this,'value');
		                 							var attid = DOM.val("#"+self.get("attachId"));
		                 							var deldiv = DOM.parent(this);
		                 							if(deldiv){
		                 								DOM.remove(deldiv);
		                 							}
		                 							var attids = String(attid).split(",");
		                 						
		                 							var temp = "";
		                 							for(var i=0; i<attids.length; i++){
		                 								if(Number(attids[i]) != Number(val) && attids[i] != ''){
		                 									temp += "," + attids[i];
		                 								}
		                 							}
		                 							DOM.val("#"+self.get("attachId"),temp);
		                         				});
		                            			//��Ϊ��ͼ
		                            			Event.delegate('a.first_chart','click', null ,function(e){
		                 					    	var val = DOM.attr(this,'value');
		                 							if(DOM.get("#image_default_id")){
		                 								DOM.attr("#image_default_id","src","/filepool"+val);
														DOM.val("#image_default",val);
		                 							}
		                         				});
		                            			
		                            			DOM.val("#"+self.get("attachId"),attachids);
		                            		}
		                            		if(self.get("showImag")){
		                            			var attachids = DOM.val("#"+self.get("attachId"))
		                            			attachids = attachids +','+ data.code;
		                            			if(DOM.css("#"+self.get("showImag"),"display") == "none"){
		                            				DOM.css("#"+self.get("showImag"),"display","block");
		                            			}
		                            			
		                            			DOM.attr("#"+self.get("showImag"),'src','/filepool'+data.urls);
		                            			DOM.attr("#"+self.get("showImag"),'value',data.code);
		                            			DOM.val("#"+self.get("attachId"),attachids);
		                            		}
		                            		self.get("callback").call(this,btnObj,btn,Upload.dl,data);
		                            		DiaF.close();
								 		});
								 		btnObj.disabled=false;
								 		
		                            	return;
								 		
		                            	
		                            }else if(data.success==false){
		                            	btnObj.disabled=false;
		                            	if(data.info){
		                            		Dia.alert(data.info);
		                            		return;
		                            	}else if(data.msg){
		                            		Dia.alert(data.msg);
		                            		return;
		                            	}
		                            	
		                            }
                    			}else{
                    				btnObj.disabled=false;
                    				return;
                    			}
	                            
	                            
	                        }
	                    });
	                    
                        var top = DOM.offset(".ks-editor-img-tabs-body").top;
                        var left= DOM.offset(".ks-editor-img-tabs-body").left;
                   		loadingCancel.css({
                       		left: (left + 180),
                        	top: (top-20)
                    	});
                    	
                    	DOM.css('.cancle', "top",(60+top));
                    	DOM.css('.cancle', "left",(left + 180));
                    	
       			}else if(btn=="cancel"){
       				DiaF.close();
       			}
       			
	        }    		
		});
        
		
		
		//var content = Dia.get("el");
		
		
		var loadingCancel = new Node("<div class='ks-editor-ext-loading'"+
		 "style='position: absolute; border: medium none; width: 100px; top:-9999px; left:-9999px; z-index: 12000; height: 100px;'><img src='$!{gsc.context}/skin/default/etrade/images/mode/tao-loading.gif' style='width: 47px; height: 47px; overflow:hidden; margin-top:26px;margin-left:26px;'></div>"+
		 "<a class='ks-editor-button ks-inline-block cancle' " +
                "style='top:-9999px; left:-9999px;position:absolute;width: 100px;height: 28px;z-index: 12000;'>ȡ���ϴ�</a>").appendTo(document.body, undefined);
        self.loadingCancel = loadingCancel;
        self.imgLocalUrl = DOM.get(".ks-editor-img-local-url");
        self.suffix = self.get("filter");
        // ��Ҫ��g��http://yiminghe.javaeye.com/blog/581347
        self.suffix_reg = new RegExp(self.suffix.split(/,/).join("|") + "$", "i");
        
        self.suffix_warning = "ֻ�����׺��Ϊ" + self.suffix + "��ͼƬ";
        self.uploadForm = DOM.get(".ks-editor-img-upload-form");
		self.fileInput = new Node("<input " +
                    "type='file' " +
                    "style='position:absolute;" +
                    "cursor:pointer;" +
                    "left:" +
                    (UA['ie'] ? "360" : (UA["chrome"] ? "362" : "362")) +
                    "px;" +
                    "z-index:2;" +
                    "top:0px;" +
                    "height:28px;width:64px;' " +
                    "size='1' " +
                    "name='Filedata'/>")
                    .insertAfter(self.imgLocalUrl);
        warning = "��������ϴ�ͼƬ";
        sizeLimit=self.get("sizeLimit");      
        if (sizeLimit)
                    warning = "����ͼƬ���������� " + (sizeLimit / 1000) + " M";
        DOM.val(".ks-editor-img-local-url",warning); 
                
        self.fileInput.css("opacity", 0);
        self.fileInput.on("change", function () {
              var file = self.fileInput.val();
              //ȥ��·��
              DOM.val(".ks-editor-img-local-url",file.replace(/.+[\/\\]/, "")); 
        });            
		
			
	function getFileSize(file) {
        if (file['files']) {
                    return file['files'][0].size;
                } else if (1 > 2) {
                    //ie �ᰲȫ����
                    try {
                        var fso = new ActiveXObject("Scripting.FileSystemObject"),
                            file2 = fso['GetFile'](file.value);
                        return file2.size;
                    } catch (e) {
                        S.log(e.message);
                    }
                }
                return 0;
      }
	function delimg(o){
		var val = DOM.attr(o,'value');
		var attid = DOM.val("#"+self.get("attachId"));
		var deldiv = DOM.parent(o);
		if(deldiv){
			DOM.remove(deldiv);
		}
		var attids = String(attid).split(",");
		if(attids.length == 1){
			DOM.val("#"+self.get("attachId"),"");
		}else{
			var temp = ",";
			for(var i=0; i<attids.length; i++){
				if(Number(attids[i]) != Number(val)){
					temp = temp + attids[i];
				}
			}
			DOM.val("#"+self.get("attachId"),temp);
		}
	}
		
	};
	Upload.show=function(obj){
			Upload.dl=new Upload(obj);			
			Upload.dl._prepare();
	};
	
	return Upload;
},{
    requires: ['base','dom','event','io',KISSY.myPackageName+"/util/dialog/dialog",KISSY.myPackageName+'/css/mode/upload.css']
});