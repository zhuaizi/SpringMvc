/**
 * 日期选择字段模块
 * 
 * @author 周忠友
 * @since 2013-11-05
 * @version 1.0
 * @see date/popup-picker
 */
KISSY.add(KISSY.myPackageName+"/util/date/date-field", function (S,DateFormat,DatePicker) {

	var DateField = function(config){
		DateField.superclass.constructor.call(this,config);
	};
	var picker=null;
	var input=null;
	var dateFormat=null;
	
	S.extend(DateField,DatePicker,{
		
		input:null,
		dateFormat:null,
		render : function(){
			
			var _this = this;
			_this.input = S.all(this.get('input'));
    		_this.dateFormat = new DateFormat(this.get('format'));
    		S.all(this.get('trigger')?this.get('trigger'):this.get('input')).on('click', function(e){
    			input=_this.input;
				dateFormat=_this.dateFormat;
    			_this._showPicker(e);
    		});
			
		},
		initReg : function(){
			
		}
		, 
		_showPicker: function (e) {
		e.preventDefault();
        var _this = this;
        if (!picker) {
            picker = _this._createPicker();
        }
        
        //为picker设置zIndex,解决用于弹出层上被遮盖的问题
        var zIndex =null;
    	try{
    		zIndex = this.get('zIndex');
    	}catch(err){}
    	if(zIndex){
    		picker.set('zIndex',zIndex);
    	}
        
  
        if (_this.input.val()) {
            var val;
            try {
                val = _this.dateFormat.parse(_this.input.val());
               
                picker.set('value', val);
            } catch(err) {}
        }

        picker.set('align', {
            node: _this.input,
            points: ['bl', 'tl']
        });

       picker.show();
       picker.focus();
    }, _createPicker:function () {
    	
       	picker = new DatePicker({
            shim:true
        });

        picker.on('blur', function () {
            picker.hide();
        });

        picker.on('select', function (e) {
        	
            if (e.value) {
                input.val(dateFormat.format(e.value));
            } else {
                input.val('');
            }
            input[0].focus();
        });
        return picker;
    }

	},{/*静态属性和方法*/
		ATTRS:{
			/**
			 * 覆盖父类属性
			 * @type {Boolean}
			 */
			shim:{value:true},
			/**
			 * 输入框元素选择器
			 * @type {String}
			 */
			input:{value:''},
			/**
			 * 触发该弹层的元素选择器
			 * @type {String} 
			 */
			trigger : {value:''},
			/**
			 * 选择的日期格式，默认yyyy-MM-dd
			 * @type {String}
			 */
			format	: {value:'yyyy-MM-dd'}
		}
	});
	
	
	return DateField;
},{
	requires: ['date/format','date/popup-picker','date/picker/assets/dpl.css']
});