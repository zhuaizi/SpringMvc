package com.forlink.springMVC.viewResolver.exceptionView;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.fkcore.app.AppGlobal;
import com.forlink.springMVC.PageContainer;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月24日 下午2:39:08
*/

public class JsonExceptionViewResolver {
	
	public ModelAndView resolverExceptionView(Exception e, PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		Map<String,Object> result = new HashMap<String, Object>();
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("msg", "您所请求的地址异常:"+e.getMessage()+"");
		model.put("success", "false");
		model.put("waittime", Integer.valueOf(3));
		model.put("request_pix", AppGlobal.RequestPix);
		model.put("server_time", Long.valueOf(System.currentTimeMillis()));
		result.put("JSON", model);
		return new ModelAndView(pContainer.getFinish_url(), result);
	}
}
