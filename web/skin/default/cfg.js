
(function(S){

	/**
	 * �Զ�������İ���
	 */
	S.myPackageName = "etrade";
	S.tag =encodeURIComponent(new Date().getTime());
	
	var charset = "GBK";
	
	/**
	 * ������
	 */
	S.config({
	    // �Ƿ����Զ� combo ģʽ��Ϊtrue�Ļ�������Ҫ�õ�module compiler 
	    combine	: false,
	    // kissy ������ģ���ʱ���
	    tag		: '20131031183955',
	    debug:false,
	    // kissy �Ļ�׼·����ע�����û��'/'
	    base	:"/Demo/skin/default/kissy"
	});
	
	var packages = {};
	packages[S.myPackageName] = {
		// mine ���Ļ�׼·����ע�������'/'
        base	: "/Demo/skin/default/",
        // mine ����ʱ�����������趨����ʹ��kissyĬ�ϵ�ʱ���
        //debugģʽ�½���ʹ�ö�̬����������棬���������Ϻ�������޸�ʱ��
        tag		: new Date().getTime(),//'20130901',
        charset	: charset, 
        // ���� x �� debug ģʽ
        debug	: true
	};
	
	packages['gallery'] = {
		// mine ���Ļ�׼·����ע�������'/'
        base	: "/Demo/skin/default/",
        // mine ����ʱ�����������趨����ʹ��kissyĬ�ϵ�ʱ���
        //debugģʽ�½���ʹ�ö�̬����������棬���������Ϻ�������޸�ʱ��
        tag		: '20140702',//'20130901',
        charset	: charset, 
        // ���� x �� debug ģʽ
        debug	: false
	};

	
	S.config("packages",packages);
	//if(KISSY.UA.ie < 9){
	//	KISSY.getScript("/skin/default/pie_ie678.js");
	//}else if(KISSY.UA.ie >= 9){
	//	KISSY.getScript("/skin/default/pie_ie9.js");
	//}
	
})(KISSY);

