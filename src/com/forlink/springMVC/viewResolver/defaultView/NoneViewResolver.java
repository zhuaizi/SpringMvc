package com.forlink.springMVC.viewResolver.defaultView;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.springMVC.PageContainer;
import com.forlink.springMVC.viewResolver.ViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月23日 下午5:46:59
*/

public class NoneViewResolver implements ViewResolver {

	public static final int TYPE = 8;
	
	@Override
	public boolean checkViewSupport(int viewPage) {
		// TODO Auto-generated method stub
		return (viewPage == NoneViewResolver.TYPE);
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
