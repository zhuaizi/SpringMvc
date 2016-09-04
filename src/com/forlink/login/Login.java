package com.forlink.login;

import java.awt.image.BufferedImage;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.forlink.fkcore.exception.AppException;
import com.forlink.fkcore.util.ParamUtil;
import com.forlink.fkcore.util.ValidateCodeUtil;
import com.forlink.springMVC.LayOut;
import com.forlink.springMVC.ResBean;
import com.forlink.springMVC.viewResolver.defaultView.NoneViewResolver;
import com.forlink.springMVC.viewResolver.defaultView.PageViewResolver;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月28日 下午5:17:03
*/

@Controller
public class Login {

	@RequestMapping("login.shtml")
	@LayOut(page = PageViewResolver.TYPE, viewpage = "/pub/ucenter/login.html")
	public ResBean login(String ref_url) throws Exception{
		ResBean handler = new ResBean(2300);
		handler.setProject("/");
		handler.put("ref_url", ref_url);
		return handler;
	}
	
	/**
	 * 验证码生成
	 * @param request
	 * @param response
	 * @param handler
	 * @return
	 * @throws AppException
	 */
	@RequestMapping("/vtcode/image.shtml")
	@LayOut(page=NoneViewResolver.TYPE,viewpage="",desc="生成验证码")
	public ResBean show(HttpServletRequest request,HttpServletResponse response,ResBean handler) throws Exception{
		try{
			String type=ParamUtil.getParameter(request, "type","");
            ValidateCodeUtil vc = new ValidateCodeUtil();
            HttpSession session=request.getSession();
            BufferedImage bi = vc.getValidateCode(session, type);
			response.setContentType("image/jpeg");
            ServletOutputStream out = response.getOutputStream();
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
            encoder.encode(bi);
            out.close();
		} catch(Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
		return null;
	}
}
