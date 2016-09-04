/**
 * 金额转换大写
 */
KISSY.add(KISSY.myPackageName + "/util/convert/moneyuper", function(S, Base,
				DOM, Event) {

			var MoneyUper = function(config) {
				MoneyUper.superclass.constructor.call(this, config);
			};

			S.extend(MoneyUper, Base);// 继承基类

			MoneyUper.ATTRS = {
				/**
				 * 金额 输入框 input 属性 amountNum="amountNum"
				 */
				amountNum : {
					value : 'amountNum'
				},
				/**
				 * 金额大写 显示 Lable id
				 */
				amountChnId : {
					value : 'amountChn'
				}
			};

			MoneyUper.prototype.render = function() {
				var _self = this;
				Event.on('input[amountNum="'+_self.get("amountNum")+'"]', 'valuechange', function(e) {
							var amountNum = DOM.query("input[amountNum='"+_self.get("amountNum")+"']");
							var pattern=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
							var val = amountNum[0].value;
							if (val != "" && pattern.test(val)) {
								var valChn = _numToChinese(val);
								DOM.html('#'+_self.get("amountChnId"), valChn);
								//通过监听自定义事件  moneyuper , event.valChn 可获取大写值
								_self.fire("moneyuper",{valChn:valChn});
//							}else{
//								DOM.html('#'+_self.get("amountChnId"), "<font color='red'>请输入正确的出金金额</font");
							}
						});
			};
			var _numToChinese = function(strNum) {
				strNum += '';
				var str;
				var result = "";
				var s1 = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌',
						'玖');
				var s4 = new Array('分', '角', '圆', '拾', '佰', '仟', '万', '拾', '佰',
						'仟', '亿', '拾', '佰', '仟', '万');
				// 字符串格式化为以分为单位的字符串
				var index = strNum.lastIndexOf(".");
				if (index != -1) {
					var strTemp = strNum.substring(index + 1);
					var len = strTemp.length;
					if (len > 2) {
						len = 2;
						strTemp = strTemp.substring(0, 2);
					}
					for (var i = 0; i < 2 - len; i++) {
						strTemp += "0";
					}
					str = strNum.substring(0, index) + strTemp;
				} else {
					str = strNum + "00";
				}
				// 字符串大小写替换
				for (i = 0; i < str.length; i++) {
					var n = str.charAt(str.length - 1 - i);
					result = s1[n] + "" + s4[i] + result;
				}

				result = result.replace(/零仟/g, "零");
				result = result.replace(/零佰/g, "零");
				result = result.replace(/零拾/g, "零");
				result = result.replace(/零亿/g, "亿");
				result = result.replace(/零万/g, "万");
				result = result.replace(/零圆/g, "圆");
				result = result.replace(/零角/g, "零");
				result = result.replace(/零分/g, "零");

				result = result.replace(/零零/g, "零");
				result = result.replace(/零亿/g, "亿");
				result = result.replace(/零零/g, "零");
				result = result.replace(/零万/g, "万");
				result = result.replace(/零零/g, "零");
				result = result.replace(/零圆/g, "圆");
				result = result.replace(/亿万/g, "亿");

				result = result.replace(/零$/, "");
				result = result.replace(/圆$/, "圆整");
				result = result.replace(/零圆$/, "零圆整");

				result = result.replace(/^圆/, "零圆");
				return result;
			}
			MoneyUper.toUper = function(money){
				var result = _numToChinese(money);
				return result;
			}
			return MoneyUper;
		}, {
			requires : ['base', 'dom', 'event']
		});
