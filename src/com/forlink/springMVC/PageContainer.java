package com.forlink.springMVC;
/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月22日 上午9:45:15
*/

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.forlink.fkcore.Global;

public class PageContainer {
	
	public PageContainer() {
		show_login_error = Global.getPropertiesConf().getBoolean("show_login_error", true);
		is_load = Global.getPropertiesConf().getBoolean("is_load", false);
		product_url_pix = Global.getPropertiesConf().getString("product_url_pix", "/");
		login_url = Global.getPropertiesConf().getString("login_url", product_url_pix +"/login.shtml");
		finish_url = Global.getPropertiesConf().getString("finish_url", product_url_pix +"/pub/finish.html");
		msg_url = Global.getPropertiesConf().getString("msg_url", product_url_pix +"/pub/msg.html");
		error_url = Global.getPropertiesConf().getString("error_url", product_url_pix +"/pub/error.html");
		not_auth_url = Global.getPropertiesConf().getString("not_auth_url","");
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	public LayOut getLayOut() {
		return layOut;
	}

	public void setLayOut(LayOut layOut) {
		this.layOut = layOut;
	}

	public Object getResult() {
		return result;
	}

	public void setResult(Object result) {
		this.result = result;
	}

	public boolean isIs_load() {
		return is_load;
	}

	public void setIs_load(boolean is_load) {
		this.is_load = is_load;
	}

	public boolean isShow_login_error() {
		return show_login_error;
	}

	public void setShow_login_error(boolean show_login_error) {
		this.show_login_error = show_login_error;
	}

	public String getProduct_url_pix() {
		return product_url_pix;
	}

	public void setProduct_url_pix(String product_url_pix) {
		this.product_url_pix = product_url_pix;
	}

	public String getLogin_url() {
		return login_url;
	}

	public void setLogin_url(String login_url) {
		this.login_url = login_url;
	}

	public String getFinish_url() {
		return finish_url;
	}

	public void setFinish_url(String finish_url) {
		this.finish_url = finish_url;
	}

	public String getMsg_url() {
		return msg_url;
	}

	public void setMsg_url(String msg_url) {
		this.msg_url = msg_url;
	}

	public String getError_url() {
		return error_url;
	}

	public void setError_url(String error_url) {
		this.error_url = error_url;
	}

	public String getNot_auth_url() {
		return not_auth_url;
	}

	public void setNot_auth_url(String not_auth_url) {
		this.not_auth_url = not_auth_url;
	}
	
	@SuppressWarnings("rawtypes")
	public Map getResultModel(){
		if (this.result == null) 
			return new HashMap<String, Object>();
		
		if (result instanceof Map) {
			return (Map)result;
		}else if(result instanceof ResBean){
			return ((ResBean)result).getModel();
		}else {
			return new HashMap<String, Object>();
		}
	}
	
	public ResBean getResBean(){
		if(result !=null && result instanceof ResBean){
			return (ResBean)result;
		}else {
			return null;
		}
	}
	
	private HttpServletRequest request;
	private HttpServletResponse response;
	private LayOut layOut;
	private Object result;
	private boolean is_load;
	private boolean show_login_error;
	private String product_url_pix;
	private String login_url;
	private String finish_url;
	private String msg_url;
	private String error_url;
	private String not_auth_url;
}
