package com.forlink.springMVC.viewResolver.defaultView;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.servlet.ModelAndView;

import com.forlink.fkcore.app.AppGlobal;
import com.forlink.fkcore.util.JsonUtil;
import com.forlink.springMVC.PageContainer;
import com.forlink.springMVC.ResBean;
import com.forlink.springMVC.viewResolver.ViewResolver;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月23日 下午6:02:17
*/

public class MsgViewResolver implements ViewResolver {
	
	public static final int TYPE = 7;
	
	@Override
	public boolean checkViewSupport(int viewPage) {
		// TODO Auto-generated method stub
		return (viewPage == MsgViewResolver.TYPE);
	}

	@Override
	public ModelAndView resolverView(PageContainer pContainer) throws Exception {
		// TODO Auto-generated method stub
		String server_name = pContainer.getRequest().getServerName().concat(":" + pContainer.getRequest().getServerPort()).concat(AppGlobal.RequestPix);
		ResBean resBean = pContainer.getResBean();
		if (resBean==null)
			return null;
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("msg", resBean.getMsg());
		data.put("jumpurl", resBean.getJumpurl());
		data.put("waittime", Integer.valueOf(resBean.getWait()));
		data.put("server_time", Long.valueOf(System.currentTimeMillis()));
		if (resBean.isAjax()) {
			data.put("success", "success".equals(resBean.getType()));
			Map<String,Object> vdata = new HashMap<String,Object>();
			vdata.put("JSON", JsonUtil.getJsonStr(data));
			return new ModelAndView(pContainer.getFinish_url(), vdata);
		}else if ("success".equals(resBean.getType()) || (!pContainer.isShow_login_error())) {
			if ((resBean.getJumpurl().startsWith("http:")) || (resBean.getJumpurl().startsWith("https:"))) {
				pContainer.getResponse().sendRedirect(resBean.getJumpurl());
			} else {
				pContainer.getResponse().sendRedirect(toUrl(server_name, resBean.getJumpurl()));
			}
			return null;
		}else {
			data.put("tip", "success".equals(resBean.getType())?"ok":"error");
			data.put("other_msg", resBean.getOtherMsg());
			data.put("request_pix", AppGlobal.RequestPix);
			data.put("server_time", Long.valueOf(System.currentTimeMillis()));
			return new ModelAndView(pContainer.getMsg_url(), data);
		}
	}
	
	private String toUrl(String serverName, String url) {
		if ((serverName != null) && (serverName.length() > 0)) {
			if ((!serverName.startsWith("http:")) && (!serverName.startsWith("https:"))) {
				serverName = "http://".concat(serverName);
			}
		} else {
			serverName = "";
		}
		if (url.indexOf("/") == 0){
			serverName = serverName.concat(url);
		} else {
			serverName = serverName.concat("/").concat(url);
		}
		return serverName;
	}

	@Override
	public ModelAndView resolverExceptionView(Exception e, PageContainer pContainer) throws Exception{
		// TODO Auto-generated method stub
		return null;
	}

}
