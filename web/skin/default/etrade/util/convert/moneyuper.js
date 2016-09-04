/**
 * ���ת����д
 */
KISSY.add(KISSY.myPackageName + "/util/convert/moneyuper", function(S, Base,
				DOM, Event) {

			var MoneyUper = function(config) {
				MoneyUper.superclass.constructor.call(this, config);
			};

			S.extend(MoneyUper, Base);// �̳л���

			MoneyUper.ATTRS = {
				/**
				 * ��� ����� input ���� amountNum="amountNum"
				 */
				amountNum : {
					value : 'amountNum'
				},
				/**
				 * ����д ��ʾ Lable id
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
								//ͨ�������Զ����¼�  moneyuper , event.valChn �ɻ�ȡ��дֵ
								_self.fire("moneyuper",{valChn:valChn});
//							}else{
//								DOM.html('#'+_self.get("amountChnId"), "<font color='red'>��������ȷ�ĳ�����</font");
							}
						});
			};
			var _numToChinese = function(strNum) {
				strNum += '';
				var str;
				var result = "";
				var s1 = new Array('��', 'Ҽ', '��', '��', '��', '��', '½', '��', '��',
						'��');
				var s4 = new Array('��', '��', 'Բ', 'ʰ', '��', 'Ǫ', '��', 'ʰ', '��',
						'Ǫ', '��', 'ʰ', '��', 'Ǫ', '��');
				// �ַ�����ʽ��Ϊ�Է�Ϊ��λ���ַ���
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
				// �ַ�����Сд�滻
				for (i = 0; i < str.length; i++) {
					var n = str.charAt(str.length - 1 - i);
					result = s1[n] + "" + s4[i] + result;
				}

				result = result.replace(/��Ǫ/g, "��");
				result = result.replace(/���/g, "��");
				result = result.replace(/��ʰ/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/��Բ/g, "Բ");
				result = result.replace(/���/g, "��");
				result = result.replace(/���/g, "��");

				result = result.replace(/����/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/����/g, "��");
				result = result.replace(/��Բ/g, "Բ");
				result = result.replace(/����/g, "��");

				result = result.replace(/��$/, "");
				result = result.replace(/Բ$/, "Բ��");
				result = result.replace(/��Բ$/, "��Բ��");

				result = result.replace(/^Բ/, "��Բ");
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
