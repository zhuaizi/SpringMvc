package com.forlink.springMVC.viewResolver.defaultView;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.springMVC.PageContainer;
import com.forlink.springMVC.viewResolver.ViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月23日 下午5:48:10
*/

public class HtmlViewResolver implements ViewResolver {

	public static final int TYPE = 4;
	
	@Override
	public boolean checkViewSupport(int viewPage) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public ModelAndView resolverView(PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ModelAndView resolverExceptionView(Exception e, PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		return null;
	}

}
