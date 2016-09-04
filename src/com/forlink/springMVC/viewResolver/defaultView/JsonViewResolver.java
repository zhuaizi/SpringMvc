package com.forlink.springMVC.viewResolver.defaultView;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.forlink.fkcore.app.AppGlobal;
import com.forlink.springMVC.PageContainer;
import com.forlink.springMVC.viewResolver.ViewResolver;
import com.forlink.springMVC.viewResolver.exceptionView.JsonExceptionViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月23日 下午5:46:07
*/

public class JsonViewResolver extends JsonExceptionViewResolver implements ViewResolver {

	public static final int TYPE = 3;
	private String server_name = "";
	
	@Override
	public boolean checkViewSupport(int viewPage) {
		// TODO Auto-generated method stub
		return (viewPage == JsonViewResolver.TYPE);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ModelAndView resolverView(PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		Map model = pContainer.getResultModel();
		server_name = pContainer.getRequest().getServerName().concat(":" + pContainer.getRequest().getServerPort());
		setServerInfo(model, pContainer);
		
		Map<String, String> result = new HashMap<String, String>();
		result.put("JSON", JSONObject.toJSONString(model));
		return new ModelAndView(pContainer.getFinish_url(),result);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void setServerInfo(Map model,PageContainer pContainer){
		model.put("request_pix", AppGlobal.RequestPix);
		model.put("server_name", server_name);
		model.put("server_time", Long.valueOf(System.currentTimeMillis()));
		model.put("cur_menu_no", pContainer.getLayOut().menusNo());
		model.put("layouts", pContainer.getLayOut());
	}

}
