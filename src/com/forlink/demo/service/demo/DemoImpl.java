package com.forlink.demo.service.demo;

import java.util.List;
import java.util.Map;

import com.forlink.fkcore.exception.DataBaseException;
import com.forlink.fkcore.service.BaseService;

/**
*@author xumy 
*@version 1.0
*@createTime 2015年8月18日 下午1:15:04
*/

public class DemoImpl extends BaseService implements Demo {

	@Override
	public List<Map<String, String>> getData() throws Exception{
		// TODO Auto-generated method stub
		queryForList("", null);
		return null;
	}
	
	
}
