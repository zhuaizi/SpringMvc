package com.forlink.springMVC.viewResolver.defaultView;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;

import com.forlink.fkcore.Global;
import com.forlink.fkcore.app.AppGlobal;
import com.forlink.springMVC.PageContainer;
import com.forlink.springMVC.viewResolver.ViewResolver;
import com.forlink.springMVC.viewResolver.exceptionView.PageExceptionViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月23日 下午5:13:49
*/

public class PageViewResolver extends PageExceptionViewResolver implements ViewResolver {

	public static final int TYPE = 1;
	private String server_name = "";
	
	@Override
	public boolean checkViewSupport(int viewPage) {
		// TODO Auto-generated method stub
		return (viewPage == PageViewResolver.TYPE);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ModelAndView resolverView(PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		String viewPage = pContainer.getLayOut().viewpage();
		Map model = pContainer.getResultModel();
		server_name = pContainer.getRequest().getServerName().concat(":" + pContainer.getRequest().getServerPort());
		setServerInfo(model, pContainer);
		
		Logger.getLogger(getClass()).info("Product_url_pix ->["+pContainer.getProduct_url_pix()+"]    viewPage  ->["+viewPage+"]");
		return new ModelAndView(pContainer.getProduct_url_pix().concat(viewPage),model);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void setServerInfo(Map model,PageContainer pContainer){
		model.put("request_pix", AppGlobal.RequestPix);
		model.put("server_name", server_name);
		model.put("server_time", Long.valueOf(System.currentTimeMillis()));
		model.put("cur_menu_no", pContainer.getLayOut().menusNo());
		model.put("layouts", "");
		model.put("gsc", AppGlobal.getGSC());
		model.put("langs", Global.getLangMap());
	}

}
