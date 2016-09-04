/**
 * 项目基类
 * 为javascript基本对象添加一些常用的基本方法 
 */
 (function(window){
 
 	/**
	  * 向下取整
	  * 
	  * @return {Number} 当前数字向下取整后的值
	  */
	 Number.prototype.floor = function(){
	 	return Math.floor(this);
	 };
	
	 /**
	  * 向上取整
	  * 
	  * @return {Number} 当前数字向上取整后的值
	  */
	 Number.prototype.ceil = function(){
	 	return Math.ceil(this);
	 };
	
	 /**
	  * 在字符串拼接
	  * @type {String|Array}
	  */
	 window.StringBuffer = function(str){
	 	this.strArr = str?[].concat(str):[];
	 };
	 /**
	  * 字符串的append方法
	  * 
	  * @param {String} str 要拼接的字符串
	  */
	 StringBuffer.prototype.append = function(str){
	 	this.strArr.push(str);
	 };
	 
	 StringBuffer.prototype.toString = function(){
	 	return this.strArr.join('');
	 };
	 /**
	  * 处理不同浏览器精度差异
	  * @param len
	  * @returns {Number}
	  */
	 Number.prototype.toFixed=function(len){   
		 return Math.round(this*Math.pow(10, len))/Math.pow(10, len);
	 };
	
	 /**
	  * 获取中英文混杂或者中文字符串长度
	  * 注：获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
	  */
	String.prototype.getBytes = function() {
	   	return this.replace(/[^\x00-\xff]/g, 'ci').length;
	};
 
	String.prototype.subByte = function (len, tail) {
	   	if(len < 0 || this.getBytes() <= len){
            return this.valueOf(); // 20121109 mz 去掉tail
        }
        //thanks 加宽提供优化方法
        var source = this.substr(0, len)
            .replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
            .substr(0, len)//截取长度
            .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
            .replace(/([^\x00-\xff]) /g,"\x241");//还原
        return source + (tail || "");
	};
 })(window);
 
 
 
 