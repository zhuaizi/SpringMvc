package com.forlink.springMVC;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月21日 上午11:09:38
*/
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD,ElementType.TYPE})
public @interface LayOut{
	
	public abstract int page() default -1;//返回的view类型 编号

    public abstract String viewpage() default "";//页面返回时，制定页面的路径
    
    public abstract String viewProject() default ""; //对应的项目名称

    public abstract String desc() default "";//

    public abstract String menusNo() default "";//菜单编号

    public abstract String menu_url() default "";//该功能，属于哪个菜单的功能（用于菜单权限校验）

    public abstract boolean checklogin() default false;//是否做登陆检查

    public abstract boolean checksafelogin() default false;//是否做安全登陆检查
    
    public abstract boolean checkMenuRight() default false;//是否做安全登陆检查
    
}
