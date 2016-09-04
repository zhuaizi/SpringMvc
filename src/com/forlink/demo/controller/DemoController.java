package com.forlink.demo.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.forlink.fkcore.exception.NotAuthException;
import com.forlink.springMVC.LayOut;
import com.forlink.springMVC.ResBean;
import com.forlink.springMVC.viewResolver.defaultView.JsonViewResolver;
import com.forlink.springMVC.viewResolver.defaultView.LayoutViewResolver;
import com.forlink.springMVC.viewResolver.defaultView.PageViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015ƒÍ7‘¬15»’ œ¬ŒÁ4:11:54
*/
@Controller
@RequestMapping("Demo")
public class DemoController {

	@RequestMapping("DemoPage.shtml")
	@LayOut(page = PageViewResolver.TYPE, viewpage = "/page/demoPage.html")
	public ResBean DemoPage(String aa) throws Exception {
		ResBean handler = new ResBean();
		if ("1".equals(aa)) {
			throw new Exception("hahahaha");
		}
		
		handler.setProject("/");
		return handler;
	}
	
	@RequestMapping("DemoPageLayout.shtml")
	@LayOut(page = LayoutViewResolver.TYPE, viewpage = "/page/demoPageLayout.html")
	public ResBean DemoPageLayout(String aa) throws Exception {
		ResBean handler = new ResBean();
		if ("1".equals(aa)) {
			throw new Exception("hahahaha");
		}
		handler.setProject("/");
		return handler;
	}
	
	@RequestMapping("DemoJson.shtml")
	@LayOut(page = JsonViewResolver.TYPE, viewpage = "/page/demoJson.html")
	public ResBean DemoJson(String aa) throws Exception {
		ResBean handler = new ResBean();
		try {
			handler.put("aaaa", "ƒ„√√√√");
			handler.setProject("/");
			if ("1".equals(aa)) {
				throw new Exception("hahahaha");
			}
		} catch (Exception e) {
			// TODO: handle exception
			throw e;
		}
		return handler;
	}
	
	@RequestMapping("DemoJsonNoAuth.shtml")
	@LayOut(page = JsonViewResolver.TYPE, viewpage = "")
	public ResBean DemoJsonNoAuth(String aa) throws Exception {
		ResBean handler = new ResBean();
		try {
			handler.put("aaaa", "ƒ„√√√√");
			handler.setProject("/");
			if ("1".equals(aa)) {
				throw new NotAuthException("hahahaha");
			}
		} catch (Exception e) {
			// TODO: handle exception
			throw e;
		}
		return handler;
	}
	
}
