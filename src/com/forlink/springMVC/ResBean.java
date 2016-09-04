package com.forlink.springMVC;

import java.io.InputStream;

import com.forlink.fkcore.data.ModelBeanMap;
import com.forlink.fkcore.data.ResultMap;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年7月24日 上午10:56:23
*/

public class ResBean
{

    public ResBean()
    {
        model = new ResultMap();
        core_model = new ResultMap();
        isAjax = false;
        isInfo = false;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        type = "";
        msg = "";
        jumpurl = "back";
        wait = 0;
    }

    public ResBean(ResultMap model)
    {
        this.model = new ResultMap();
        core_model = new ResultMap();
        isAjax = false;
        isInfo = false;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        type = "";
        msg = "";
        jumpurl = "back";
        wait = 0;
        if(model != null)
            this.model = model;
    }

    public ResBean(long domainNo)
    {
        model = new ResultMap();
        core_model = new ResultMap();
        isAjax = false;
        isInfo = false;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        type = "";
        msg = "";
        jumpurl = "back";
        wait = 0;
        model = ModelBeanMap.get(domainNo);
    }

    public ResBean(String type, String msg)
    {
        model = new ResultMap();
        core_model = new ResultMap();
        isAjax = true;
        isInfo = true;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        this.type = "";
        this.msg = "";
        jumpurl = "back";
        wait = 0;
        this.type = type;
        this.msg = msg;
    }

    public ResBean(String type, String msg, String jumpurl, int wait)
    {
        model = new ResultMap();
        core_model = new ResultMap();
        isAjax = true;
        isInfo = true;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        this.type = "";
        this.msg = "";
        this.jumpurl = "back";
        this.wait = 0;
        this.type = type;
        this.msg = msg;
    }

    public ResBean(boolean isAjax, String type, String msg, String jumpurl, int wait)
    {
        model = new ResultMap();
        core_model = new ResultMap();
        isInfo = true;
        filename = "";
        view_project = "Demo";
        view_page = "";
        otherMsg = "";
        this.msg = "";
        this.isAjax = isAjax;
        this.type = type;
        this.msg = msg;
        this.jumpurl = jumpurl;
        this.wait = wait;
    }

    public boolean isInfo()
    {
        return isInfo;
    }

    public ResultMap getModel()
    {
        return model;
    }

    public void setModel(ResultMap model)
    {
        this.model = model;
    }

    public void put(String key, Object obj)
    {
        model.put(key, obj);
    }

    public void setTitle(String str)
    {
        put("meta_title", str);
    }

    public String getMsg()
    {
        return msg;
    }

    public void setMsg(String msg)
    {
        this.msg = msg;
    }

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public boolean isAjax()
    {
        return isAjax;
    }

    public String getJumpurl()
    {
        return jumpurl;
    }

    public void setJumpurl(String jumpurl)
    {
        this.jumpurl = jumpurl;
    }

    public int getWait()
    {
        return wait;
    }

    public void setWait(int wait)
    {
        this.wait = wait;
    }

    public String getFilename()
    {
        return filename;
    }

    public InputStream getInputStream()
    {
        return inputStream;
    }

    public void setFilename(String filename)
    {
        this.filename = filename;
    }

    public void setInputStream(InputStream inputStream)
    {
        this.inputStream = inputStream;
    }

    public ResultMap getCoreModel()
    {
        return core_model;
    }

    /**
     * @deprecated Method setCoreModel is deprecated
     */
    public void setCoreModel(ResultMap core_model)
    {
        this.core_model = core_model;
    }

    public String getOtherMsg()
    {
        return otherMsg;
    }

    public void setOtherMsg(String otherMsg)
    {
        this.otherMsg = otherMsg;
    }

    public String getViewProject()
    {
        return view_project;
    }

    public void setProject(String view_project)
    {
        this.view_project = view_project;
    }

    public void setViewPage(String view_page)
    {
        this.view_page = view_page;
    }

    public String getViewPage()
    {
        return view_page;
    }

    private ResultMap model;
    private ResultMap core_model;
    private boolean isAjax;
    private boolean isInfo;
    private InputStream inputStream;
    private String filename;
    private String view_project;
    private String view_page;
    private String otherMsg;
    private String type;
    private String msg;
    private String jumpurl;
    private int wait;
}
