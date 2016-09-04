package com.forlink.springMVC.methodAdapter;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.forlink.fkcore.Global;
//import com.forlink.fkcore.bean.BizLogBean;
import com.forlink.fkcore.data.ResultMap;
import com.forlink.fkcore.exception.AppException;
import com.forlink.fkcore.security.Encoder;
import com.forlink.fkcore.security.ticket.TicketCache;
//import com.forlink.fkcore.sso.OnlineUser;
//import com.forlink.fkcore.sso.OnlineUserMgr;
import com.forlink.fkcore.util.ParamUtil;
import com.forlink.fkcore.web.WebActionInter;

public abstract class WebPageAction {

	@Autowired
	@Qualifier("com.forlink.fkcore.security.ticket.vcodeTicket")
	protected TicketCache vtc;
	
	protected String pkg = "com.forlink." + Global.getPropertiesConf().getString("product_code", "etrade") + ".inter.";

	protected String defpkg = "com.forlink.etrade.inter.";

	protected final String Saft_V_C_ID = "ys-SF_VC_ID";

	protected final String Secret_data_key = "shop_for_b2b";

	protected void addCookie(String id, String val, int maxAge, HttpServletResponse response) {
		try {
			Cookie tgc = new Cookie(id, val);
			tgc.setPath("/");
			tgc.setMaxAge(maxAge);
			response.addCookie(tgc);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

//	protected int getCustType(HttpServletRequest request) throws Exception {
//		return Integer.valueOf(OnlineUserMgr.getInstance().getOnlineUser(request).getCustType()).intValue();
//	}

	protected String getPayPwd(HttpServletRequest request) throws Exception {
		return null;
		// return this.sso.getPayPassword(getCustNo(request),
		// getDomainNo(request));
	}

	protected boolean checkPayPwd(String md5Str, String srcPwd, HttpServletRequest request) throws AppException {
		return false;
	}

//	protected String getLoginName(HttpServletRequest request) throws Exception {
//		return getUser(request).getEmpName();
//	}

//	protected String getSesssionId(HttpServletRequest request) throws Exception {
//		return getUser(request).getSessionId();
//	}

//	protected String getLoginAcct(HttpServletRequest request) throws Exception {
//		return getUser(request).getEmpAcct();
//	}

//	protected int getDomainNo(HttpServletRequest request) throws Exception {
//		return Integer.valueOf(getUser(request).getDomainNo()).intValue();
//	}

//	protected long getCustNo(HttpServletRequest request) throws Exception {
//		return getUser(request).getCustNo();
//	}

//	protected String getCustCo(HttpServletRequest request) throws Exception {
//		return getUser(request).getCustCo();
//	}

//	protected String getCustName(HttpServletRequest request) throws Exception {
//		return getUser(request).getCustName();
//	}

//	protected long getSubCustNo(HttpServletRequest request) throws Exception {
//		return getUser(request).getSubCustNo();
//	}
//
//	protected int getEmpNo(HttpServletRequest request) throws Exception {
//		return Integer.valueOf(getUser(request).getEmpNo()).intValue();
//	}

	protected String getLoginIP(HttpServletRequest request) throws AppException {
		return getIpAddr(request);
	}

	@SuppressWarnings("rawtypes")
	protected String encrypt(ResultMap data) throws AppException {
		String ret = data.getJson();
		try {
			ret = Encoder.encrypt_AES_to_HEX(ret, "shop_for_b2b");
		} catch (Exception ex) {
		}
		return ret;
	}

	@SuppressWarnings("rawtypes")
	protected ResultMap decrypt(String data) throws AppException {
		String ret = "";
		try {
			ret = Encoder.decrypt_AES_from_HEX(data, "shop_for_b2b");
		} catch (Exception ex) {
			throw new AppException("数据不符合安全标准");
		}
		return new ResultMap(ret);
	}

	public String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwaded-For");
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0) || ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	@SuppressWarnings({ "unchecked", "deprecation", "rawtypes" })
	protected ResultMap getCookie(HttpServletRequest request) {
		if (request == null)
			return null;
		ResultMap map = new ResultMap();
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				String cookieName = cookie.getName();
				String cookieValue = cookie.getValue();
				cookieValue = URLDecoder.decode(cookieValue);
				map.put(cookieName, cookieValue);
			}
		}

		return map;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected Map<String, Object> getWhereMap(HttpServletRequest request) throws AppException {
		Map map = new HashMap();

		int start = ParamUtil.getParameterInt(request, "start", 0);
		int limit = ParamUtil.getParameterInt(request, "limit", 15);

		String sort = ParamUtil.getParameter(request, "sort", "");
		String dir = ParamUtil.getParameter(request, "dir", "");
		map.put("start", Integer.valueOf(start));
		map.put("limit", Integer.valueOf(limit));
		map.put("sort", sort);
		map.put("dir", dir);
		if (!sort.equals("")) {
			map.put("orderSort", sort + " " + dir);
		}
		return map;
	}

//	protected BizLogBean getBizLogBean(HttpServletRequest request) throws Exception {
//		return new BizLogBean("" + getEmpNo(request), getLoginName(request), getLoginIP(request), "20", "" + getDomainNo(request));
//	}

	@SuppressWarnings("rawtypes" )
	protected ResultMap getUrlParam(String str) throws AppException {
		ResultMap map = new ResultMap();
		try {
			String s = Encoder.decrypt_AES_from_HEX(str, "Yxc%*20)<$23bcx");
			if ((s != null) && (s.length() > 0))
				map = new ResultMap(s);
		} catch (Exception ex) {
		}
		return map;
	}

	@SuppressWarnings("rawtypes" )
	protected void sendSysMsg(String header, ResultMap body) throws Exception {
		sendSysMsg("", header, body);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void sendSysMsg(String topic, String header, ResultMap body) throws Exception {
		try {
			ResultMap msg = new ResultMap();
			msg.put("header", header);
			msg.put("body$m", body);
			System.out.println("send sys msg");
			// this.client.putString(Global.getJmsHead() + topic,
			// msg.getJson());
		} catch (Exception ex) {
		}
	}

	protected WebActionInter getInter(String name) {
		WebActionInter inter = null;
		try {
			inter = (WebActionInter) Global.getAppContext().getBean(this.pkg + name, WebActionInter.class);
		} catch (Exception ex) {
		}
		if (inter == null) {
			inter = (WebActionInter) Global.getAppContext().getBean(this.defpkg + name, WebActionInter.class);
		}
		return inter;
	}

//	protected OnlineUser getUser(HttpServletRequest request) throws Exception {
//		try {
//			if (request.getAttribute("onlineUser") != null) {
//				return (OnlineUser) request.getAttribute("onlineUser");
//			}
//			return OnlineUserMgr.getInstance().getGuestUser(request);
//		} catch (Exception ex) {
//		}
//		throw new AppException("获取登陆用户信息失败!");
//	}
}
