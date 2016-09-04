
(function(S){

	/**
	 * 自定义组件的包名
	 */
	S.myPackageName = "etrade";
	S.tag =encodeURIComponent(new Date().getTime());
	
	var charset = "GBK";
	
	/**
	 * 总配置
	 */
	S.config({
	    // 是否开启自动 combo 模式，为true的话，可能要用到module compiler 
	    combine	: false,
	    // kissy 库内置模块的时间戳
	    tag		: '20131031183955',
	    debug:false,
	    // kissy 的基准路径，注意后面没有'/'
	    base	:"/Demo/skin/default/kissy"
	});
	
	var packages = {};
	packages[S.myPackageName] = {
		// mine 包的基准路径，注意后面有'/'
        base	: "/Demo/skin/default/",
        // mine 包的时间戳，如果不设定，则使用kissy默认的时间戳
        //debug模式下建议使用动态内容清除缓存，组件开发完毕后用最后修改时间
        tag		: new Date().getTime(),//'20130901',
        charset	: charset, 
        // 开启 x 包 debug 模式
        debug	: true
	};
	
	packages['gallery'] = {
		// mine 包的基准路径，注意后面有'/'
        base	: "/Demo/skin/default/",
        // mine 包的时间戳，如果不设定，则使用kissy默认的时间戳
        //debug模式下建议使用动态内容清除缓存，组件开发完毕后用最后修改时间
        tag		: '20140702',//'20130901',
        charset	: charset, 
        // 开启 x 包 debug 模式
        debug	: false
	};

	
	S.config("packages",packages);
	//if(KISSY.UA.ie < 9){
	//	KISSY.getScript("/skin/default/pie_ie678.js");
	//}else if(KISSY.UA.ie >= 9){
	//	KISSY.getScript("/skin/default/pie_ie9.js");
	//}
	
})(KISSY);

