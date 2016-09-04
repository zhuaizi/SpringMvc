package com.forlink.springMVC;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
*@author xumy 
*@version 1.0
*@createTime 2015��7��21�� ����11:09:38
*/
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD,ElementType.TYPE})
public @interface LayOut{
	
	public abstract int page() default -1;//���ص�view���� ���

    public abstract String viewpage() default "";//ҳ�淵��ʱ���ƶ�ҳ���·��
    
    public abstract String viewProject() default ""; //��Ӧ����Ŀ����

    public abstract String desc() default "";//

    public abstract String menusNo() default "";//�˵����

    public abstract String menu_url() default "";//�ù��ܣ������ĸ��˵��Ĺ��ܣ����ڲ˵�Ȩ��У�飩

    public abstract boolean checklogin() default false;//�Ƿ�����½���

    public abstract boolean checksafelogin() default false;//�Ƿ�����ȫ��½���
    
    public abstract boolean checkMenuRight() default false;//�Ƿ�����ȫ��½���
    
}
