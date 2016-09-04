package com.forlink.springMVC.viewResolver;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.springMVC.PageContainer;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月21日 下午6:51:12
*/
public interface ViewResolver{
	
	public boolean checkViewSupport(int viewPage);
	
	public ModelAndView resolverView(PageContainer pContainer) throws Exception;
	
	public ModelAndView resolverExceptionView(Exception e, PageContainer pContainer) throws Exception;
	
}
