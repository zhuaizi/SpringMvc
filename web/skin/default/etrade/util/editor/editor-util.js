/**
 * ���ı��༭��ģ��
 * 
 * ʵ����
 * 	var cfg ={
        //�����е�textarea����,�豣֤html�ж�Ӧid��textarea���롣��render������
        fromTextarea:'#ks-editor-textarea',
        //��Ⱦ�ڶ�Ӧ��λ��
//    	render:'#editorContainer',
 * 		// �Ƿ��ʼ�۽�
        focused: false,
        attachForm: true,
        baseZIndex: 10000,
        height: 200,
        width: 500
        
        // �Զ�����ʽ
        // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
        // �Զ����ⲿ��ʽ
        // customLink:["http://localhost/customLink.css","http://xx.com/y2.css"],

    };
    
  var editor = new EditorUtil();
  editor.render(cfg);
  editor.on("afterRender",function(e){//ֻ��ʹ��afterRender�¼������ܻ�ȡe.editor��e.editorΪkissy��editor����
 
 	e.editor.setData("�ҵĶ������۵�ʱ�䷢�˵�fsdfsdfdsfds");
 	
 });
 * 
 * @author ������
 * @since 2014-05-29
 * @version 1.0
 * @see editor
 */
KISSY.add(KISSY.myPackageName+"/util/editor/editor-util", function (S, Base,Edit) {	
	
	var EditorUtil = function(config){		
		EditorUtil.superclass.constructor.call(this,config);		
	};
	
	S.extend(EditorUtil,Base,{
		render:function(cfg){
			var _self = this;
			var plugins = (
			//    "source-area," +
			//        "code," +
			        "separator," +
			        "bold," +
			        "italic," +
			        "font-family," +
			        "font-size," +
			        "strike-through," +
			        "underline," +
			        "separator," +
			//        "checkbox-source-area," +
			        "image," +
			        "link," +
			        "fore-color," +
			        "back-color," +
			//        "resize," +  //���޸Ĵ�С
			//        "draft," +  //�ݸ���
			        "undo," +
			        "indent," +
			        "outdent," +
			        "unordered-list," +
			        "ordered-list," +
			//        "element-path," +
			        "page-break," +
			//        "preview," +  //Ԥ��
			//        "maximize," + //ȫ��
			//        "remove-format," + //�����ʽ
			        "heading," +
			        "justify-left," +
			        "justify-center," +
			        "justify-right," +
			        "table," +
			//        "smiley," + //����
			//        "flash," +  //flash
			//        "xiami-music," + //����
			//        "video," + //��Ƶ
			        "drag-upload" +
			        "").split(",");
			
			    var fullPlugins = [];
			
			    S.each(plugins, function (p, i) {
			        fullPlugins[i] = "editor/plugin/" + p;
			    });
			
			    var pluginConfig = {
			        link: {
			            target: "_blank"
			        },
			        "image": {
			            defaultMargin: 0,
			            //remote:false,
			            upload: {
			                serverUrl: window.UPLOAD_SINGLE_URL || "upload.jss",
			                serverParams: {
			                    waterMark: function () {
			                        return S.one("#ke_img_up_watermark_1")[0].checked;
			                    }
			                },
			                suffix: "png,jpg,jpeg,gif",
			                fileInput: "Filedata",
			                sizeLimit: 1000, //k
			                extraHTML: "<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> ͼƬ��ˮӡ����ֹ���˵���</p>"
			            }
			        },
			        "flash": {
			            "defaultWidth": "300",
			            "defaultHeight": "300"
			        },
			        "templates": [
			            {
			                demo: "ģ��1Ч����ʾhtml",
			                html: "<div style='border:1px solid red'>ģ��1Ч����ʾhtml</div><p></p>"
			            },
			            {
			                demo: "ģ��2Ч����ʾhtml",
			                html: "<div style='border:1px solid red'>ģ��2Ч����ʾhtml</div>"
			            }
			        ],
			        "font-size": {
			            matchElWidth: false,
			            menu: {
			                children: [
			                    {
			                        value: "14px",
			                        textContent: "��׼",
			                        elAttrs: {
			                            style: 'position: relative; border: 1px solid #DDDDDD; margin: 2px; padding: 2px;'
			                        },
			                        content: " <span style='font-size:14px'>��׼</span>" +
			                            "<span style='position:absolute;top:1px;right:3px;'>14px</span>"
			                    },
			                    {
			                        value: "16px",
			                        textContent: "��",
			                        elAttrs: {
			                            style: 'position: relative; border: 1px solid #DDDDDD; margin: 2px; padding: 2px;'
			                        },
			                        content: "" +
			                            " <span style='font-size:16px'>��</span>" +
			                            "<span style='position:absolute;top:1px;right:3px;'>16px</span>"
			                    },
			                    {
			                        value: "18px",
			                        textContent: "�ش�",
			                        elAttrs: {
			                            style: 'position: relative; border: 1px solid #DDDDDD; margin: 2px; padding: 2px;'
			                        },
			                        content: "" +
			                            " <span style='font-size:18px'>�ش�</span>" +
			                            "<span style='position:absolute;top:1px;right:3px;'>18px</span>"
			                    },
			                    {
			                        value: "20px",
			                        textContent: "����",
			                        elAttrs: {
			                            style: 'position: relative; border: 1px solid #DDDDDD; margin: 2px; padding: 2px;'
			                        },
			                        content: "" +
			                            " <span style='font-size:20px'>����</span>" +
			                            "<span style='position:absolute;top:1px;right:3px;'>20px</span>"
			                    }
			                ],
			                width: "125px"
			            }
			        },
			        "video": {
			            urlCfg: [
			                {
			                    reg: /tudou\.com/i,
			                    url: "http://bangpai.taobao.com/json/getTudouVideo.htm",
			                    paramName: "url"
			                }
			            ],
			            "urlTip": "�������ſ���������������7������Ƶ����ҳ����...",
			            "providers": [
			                {
			                    // ���������
			                    reg: /taohua\.com/i,
			                    //Ĭ�ϸ߿�
			                    width: 480,
			                    height: 400,
			                    detect: function (url) {
			                        return url;
			                    }
			                },
			                {
			                    reg: /youku\.com/i,
			                    width: 480,
			                    height: 400,
			                    detect: function (url) {
			                        var m = url.match(/id_([^.]+)\.html(\?[^?]+)?$/);
			                        if (m) {
			                            return "http://player.youku.com/player.php/sid/" + m[1] + "/v.swf";
			                        }
			                        m = url.match(/v_playlist\/([^.]+)\.html$/);
			                        if (m) {
			                            return;
			                            //return "http://player.youku.com/player.php/sid/" + m[1] + "/v.swf";
			                        }
			                        return url;
			                    }
			                },
			                {
			                    reg: /tudou\.com/i,
			                    width: 480,
			                    height: 400,
			                    detect: function (url) {
			                        return url;
			                    }
			                },
			                {
			                    reg: /ku6\.com/i,
			                    width: 480,
			                    height: 400,
			                    detect: function (url) {
			                        var m = url.match(/show[^\/]*\/([^\/]+)\.html(\?[^?]+)?$/);
			                        if (m) {
			                            return "http://player.ku6.com/refer/" + m[1] + "/v.swf";
			                        }
			                        return url;
			                    }
			                }/*,
			                 {
			                 reg:/taobaocdn\.com/i,
			                 width:480,
			                 height:400,
			                 detect:function(url) {
			                 return url;
			                 }
			                 }*/
			            ]
			        },
			        "draft": {
			            // ��ǰ�༭������ʷ�Ƿ�Ҫ�������浽һ����ֵ�����ǹ���
			            // saveKey:"xxx",
			            interval: 5,
			            limit: 10,
			            "helpHTML": "<div " +
			                "style='width:200px;'>" +
			                "<div style='padding:5px;'>�ݸ����ܹ��Զ����������±༭�����ݣ�" +
			                "����������ݶ�ʧ��" +
			                "��ѡ��ָ��༭��ʷ</div></div>"
			        },
			        "resize": {
			            //direction:["y"]
			        },
			
			        "drag-upload": {
			            suffix: "png,jpg,jpeg,gif",
			            fileInput: "Filedata",
			            sizeLimit: 1000,
			            serverUrl: "upload.jss",
			            serverParams: {
			                waterMark: function () {
			                    return true;
			                }
			            }
			        }
			    };

			    KISSY.use(fullPlugins,function (S) {
			        var args = S.makeArray(arguments);
			
			        args.shift();
			
			        S.each(args, function (arg, i) {
			            var argStr = plugins[i], cfg;
			            if (cfg = pluginConfig[argStr]) {
			                args[i] = new arg(cfg);
			            }
			        });
			
			        cfg.plugins = args;
			        var editor;
			        if (cfg.fromTextarea) {
			            editor = Edit.decorate(cfg.fromTextarea, cfg);
			        } else {
			            editor = new Editor(cfg);
			            editor.render();
			        }
					_self.fire('afterRender',{editor:editor});
			    });
		}
	},{		
		
		ATTRS:{}
		
	});
	
	return EditorUtil;
},{
	requires: ['base','editor','editor/theme/cool/editor.css']
});