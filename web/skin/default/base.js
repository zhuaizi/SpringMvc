/**
 * ��Ŀ����
 * Ϊjavascript�����������һЩ���õĻ������� 
 */
 (function(window){
 
 	/**
	  * ����ȡ��
	  * 
	  * @return {Number} ��ǰ��������ȡ�����ֵ
	  */
	 Number.prototype.floor = function(){
	 	return Math.floor(this);
	 };
	
	 /**
	  * ����ȡ��
	  * 
	  * @return {Number} ��ǰ��������ȡ�����ֵ
	  */
	 Number.prototype.ceil = function(){
	 	return Math.ceil(this);
	 };
	
	 /**
	  * ���ַ���ƴ��
	  * @type {String|Array}
	  */
	 window.StringBuffer = function(str){
	 	this.strArr = str?[].concat(str):[];
	 };
	 /**
	  * �ַ�����append����
	  * 
	  * @param {String} str Ҫƴ�ӵ��ַ���
	  */
	 StringBuffer.prototype.append = function(str){
	 	this.strArr.push(str);
	 };
	 
	 StringBuffer.prototype.toString = function(){
	 	return this.strArr.join('');
	 };
	 /**
	  * ����ͬ��������Ȳ���
	  * @param len
	  * @returns {Number}
	  */
	 Number.prototype.toFixed=function(len){   
		 return Math.round(this*Math.pow(10, len))/Math.pow(10, len);
	 };
	
	 /**
	  * ��ȡ��Ӣ�Ļ��ӻ��������ַ�������
	  * ע����ȡ�ַ���gbk�����µ��ֽڳ���, ʵ��ԭ������Ϊ����127�ľ�һ����˫�ֽڡ�����ַ�����gbk���뷶Χ, ��������㲻׼ȷ
	  */
	String.prototype.getBytes = function() {
	   	return this.replace(/[^\x00-\xff]/g, 'ci').length;
	};
 
	String.prototype.subByte = function (len, tail) {
	   	if(len < 0 || this.getBytes() <= len){
            return this.valueOf(); // 20121109 mz ȥ��tail
        }
        //thanks �ӿ��ṩ�Ż�����
        var source = this.substr(0, len)
            .replace(/([^\x00-\xff])/g,"\x241 ")//˫�ֽ��ַ��滻������
            .substr(0, len)//��ȡ����
            .replace(/[^\x00-\xff]$/,"")//ȥ���ٽ�˫�ֽ��ַ�
            .replace(/([^\x00-\xff]) /g,"\x241");//��ԭ
        return source + (tail || "");
	};
 })(window);
 
 
 
 