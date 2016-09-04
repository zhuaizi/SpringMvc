/**
 * 日期选择字段模块
 * 
 * @author 周忠友
 * @since 2013-11-05
 * @version 1.0
 * @see date/popup-picker
 */
 /*KISSY.myPackageName是当前配置好的组件根路径*/
 /*'/util/date/date-field'是自定义组件路径，date-field跟文件名称一致，名称全部小写，多个单词间用'-'隔开*/
KISSY.add(KISSY.myPackageName+"/util/date/date-field", function (S,DatePicker) {

	var DateField = function(config){
		DateField.superclass.constructor.call(this,config);
	};
	
	S.extend(DateField,DatePicker,{/*实例化属性和方法(注意私有方法加'_'前缀)*/
		render:function(){
			/*使用render作为入口函数*/
			/*在第一行调用父类render方法(如果不是直接继承base该方法必须)，如果父类该方法有参数，调用的时候还应该传入相应参数*/
			DateField.superclass.render.call(this);
		}
	},{/*静态属性和方法*/
		ATTRS:{/*ATTRS属于静态属性*/
			a : null  //a表示私有属性，用对象.get('a')取值，对象.set('a',null)设值
		}
	});/*继承date/popup-picker*/
	/*最后一定要返回定义好的模块*/
	return DateField;
},{
	/*当前组件所依赖的模块和css，注意css最好在依赖模块的最后。依赖模块的顺序要与上面的function的参数对应*/
	requires: ['date/popup-picker','date/picker/assets/dpl.css']
});