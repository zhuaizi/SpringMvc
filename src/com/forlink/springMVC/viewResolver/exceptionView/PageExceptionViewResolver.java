package com.forlink.springMVC.viewResolver.exceptionView;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.fkcore.app.AppGlobal;
import com.forlink.springMVC.PageContainer;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月24日 下午2:37:41
*/

public class PageExceptionViewResolver {
	
	public ModelAndView resolverExceptionView(Exception e, PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		Map<String,Object> vdata = new HashMap<String, Object>();
		vdata.put("msg", "您所请求的地址异常:"+e.getMessage()+";请做相应的处理后再访问！");
		vdata.put("jumpurl", "back");
		vdata.put("waittime", Integer.valueOf(3));
		vdata.put("tip", "error");
		vdata.put("other_msg", "");
		vdata.put("request_pix", AppGlobal.RequestPix);
		return new ModelAndView(pContainer.getMsg_url(), vdata);
	}
}
