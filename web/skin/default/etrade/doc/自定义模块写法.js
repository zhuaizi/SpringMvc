/**
 * ����ѡ���ֶ�ģ��
 * 
 * @author ������
 * @since 2013-11-05
 * @version 1.0
 * @see date/popup-picker
 */
 /*KISSY.myPackageName�ǵ�ǰ���úõ������·��*/
 /*'/util/date/date-field'���Զ������·����date-field���ļ�����һ�£�����ȫ��Сд��������ʼ���'-'����*/
KISSY.add(KISSY.myPackageName+"/util/date/date-field", function (S,DatePicker) {

	var DateField = function(config){
		DateField.superclass.constructor.call(this,config);
	};
	
	S.extend(DateField,DatePicker,{/*ʵ�������Ժͷ���(ע��˽�з�����'_'ǰ׺)*/
		render:function(){
			/*ʹ��render��Ϊ��ں���*/
			/*�ڵ�һ�е��ø���render����(�������ֱ�Ӽ̳�base�÷�������)���������÷����в��������õ�ʱ��Ӧ�ô�����Ӧ����*/
			DateField.superclass.render.call(this);
		}
	},{/*��̬���Ժͷ���*/
		ATTRS:{/*ATTRS���ھ�̬����*/
			a : null  //a��ʾ˽�����ԣ��ö���.get('a')ȡֵ������.set('a',null)��ֵ
		}
	});/*�̳�date/popup-picker*/
	/*���һ��Ҫ���ض���õ�ģ��*/
	return DateField;
},{
	/*��ǰ�����������ģ���css��ע��css���������ģ����������ģ���˳��Ҫ�������function�Ĳ�����Ӧ*/
	requires: ['date/popup-picker','date/picker/assets/dpl.css']
});