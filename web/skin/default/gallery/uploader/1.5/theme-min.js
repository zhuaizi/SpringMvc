/*!build time : 2013-12-23 5:52:07 PM*/
KISSY.add("gallery/uploader/1.5/theme",function(a,b,c){function d(a){var b=this;d.superclass.constructor.call(b,a)}var e="",f=b.all,g={BUTTON:"-button",QUEUE:"-queue"},h="text/uploader-theme";return a.extend(d,c,{render:function(){var a=this,b=a.get("uploader");b.set("theme",a),a._addThemeCssName(),a._tplFormHtml(),a._bind()},_selectHandler:function(){},_addHandler:function(){},_removeHandler:function(){},_waitingHandler:function(){},_startHandler:function(){},_progressHandler:function(){},_successHandler:function(){},_errorHandler:function(){},_restore:function(){var b=this,c=b.get("uploader"),d=c.getPlugin("urlsInput");if(!d)return!1;var e=d.get("autoRestore");if(!e)return!1;var f=c.get("queue"),g=f.get("files");return g.length?(a.each(g,function(a,d){a.status="success",c.fire("add",{file:a,index:d}),b._renderHandler("_successHandler",{file:a,result:a.result}),b._hideStatusDiv(a)}),b):!1},_addThemeCssName:function(){var b=this,c=b.get("name"),d=b.get("queueTarget"),f=b.get("uploader"),h=f.get("target");return d.length?c==e?!1:(d.length&&d.addClass("ks-uploader-queue "+c+g.QUEUE),h.addClass(c+g.BUTTON),b):(a.log("\u4e0d\u5b58\u5728\u5bb9\u5668\u76ee\u6807\uff01"),!1)},_bind:function(){var b=this,c=b.get("uploader"),d=["add","remove","select","start","progress","success","error","complete"];c.on(d[0],function(a){var d=b._appendFileDom(a.file),e=c.get("queue");e.updateFile(a.index,{target:d})}),c.on(d[1],function(a){b._removeFileDom(a.file)}),a.each(d,function(a){c.on(a,function(a){var c="_"+a.type+"Handler";b._renderHandler(c,a)})})},_renderHandler:function(a,b){var c=this,d=c[a];c._setStatusVisibility(b.file),d&&d.call(c,b)},_setStatusVisibility:function(b){var c=this;if(!a.isObject(b)||a.isEmptyObject(b))return c;c._hideStatusDiv(b);var d=b.status,e=b.target;if(!e.length)return!1;var f=e.all("."+d+"-status");f.length&&f.show();var g=["waiting","start","uploading","progress","error","success"];return a.each(g,function(a){e.removeClass(a)}),e.addClass(d),c},_hideStatusDiv:function(b){if(!a.isObject(b))return!1;var c=b.target;c&&c.length&&c.all(".status").hide()},_appendFileDom:function(b){var c,d=this,e=d.get("fileTpl"),g=f(d.get("queueTarget"));return g.length?(c=a.substitute(e,b),f(c).hide().appendTo(g).fadeIn(.4).data("data-file",b)):!1},_removeFileDom:function(b){if(!a.isObject(b))return!1;var c=b.target;return c&&c.length?(c.fadeOut(.4,function(){c.remove()}),void 0):!1},_tplFormHtml:function(){var a=this,b=a.get("fileTpl"),c=f(a.get("queueTarget")),d=!1;if(!c.length)return!1;var e=c.all("script");return e.each(function(c){c.attr("type")==h&&(d=!0,b=c.html(),a.set("fileTpl",b))}),b}},{ATTRS:{name:{value:e},use:{value:e},fileTpl:{value:e},authMsg:{value:{}},queueTarget:{value:e,getter:function(a){return f(a)}},queue:{value:e},uploader:{value:e}}}),d},{requires:["node","base"]});
