/**
 * 日期选择字段模块
 * 
 * @author 邓帮林
 * @since 2014-06-13
 * @version 1.0
 * @see calendar/calendar
 */
KISSY.add(KISSY.myPackageName+"/util/calendar/calendar-field", function (S,DateFormat,Calendar) {
	
	var CalendarField = function(config){
		CalendarField.prototype.conf=config;
		CalendarField.superclass.constructor.call(this,config);
	};
	
	CalendarField.prototype.conf = {};
	
	S.extend(CalendarField,Calendar,{
		calendar: null,
		input	: null,
		trigger	: null,
		dateFormat: null,
		render 	: function(){
			var conf = this.conf;
			
			if(!this.calendar){
				
				this.input = S.all(conf.input);
				this.trigger = conf.trigger;
	    		this.dateFormat = new DateFormat(conf.format?conf.format:'yyyy-MM-dd');
				
				var _this=this;
				this.calendar = new Calendar(this.input, conf);
				if(conf.showTime){//日期+时间选择控件
					this.calendar.on('timeSelect', function(e) {
			            if (e.date) {
							_this.input.val(_this.dateFormat.format(e.date));
			            } else {
			                _this.input.val('');
			            }
			            _this.input.fire('blur');
			        });
				}else{//日期选择控件
					this.calendar.on('select', function(e) {
						if (e.date) {
							_this.input.val(_this.dateFormat.format(e.date));
			            } else {
			                _this.input.val('');
			            }
			            _this.input.fire('blur');
			        });
				}
			}
		},
		initReg:function(){}
	});
	
	return CalendarField;
},{
	requires: ['date/format','calendar/calendar','calendar/assets/dpl.css']
});