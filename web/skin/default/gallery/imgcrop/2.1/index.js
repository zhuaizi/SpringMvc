/*
combined files : 

gallery/imgcrop/2.1/type/html5/preview
gallery/imgcrop/2.1/type/html5/selection
gallery/imgcrop/2.1/type/html5/imgcrop
gallery/imgcrop/2.1/type/normal/resizable
gallery/imgcrop/2.1/type/normal/dragable
gallery/imgcrop/2.1/type/normal/imgcrop
gallery/imgcrop/2.1/index

*/
/**
 * @Preview Ԥ��ģ��
 * @author ԪȪ 2013-5-4
 */
KISSY.add('gallery/imgcrop/2.1/type/html5/preview',function (S) {
    var $ = S.all;
    //Ԥ������
    function Preview() {
        Preview.superclass.constructor.apply(this, arguments);
        this.canvas = $('<canvas>');
        this.ctx = this.canvas[0].getContext('2d');
        this._init();
    }

    Preview.ATTRS = {
        previewEl:{
            value:''
        },
        viewHeight:{
            value:100
        },
        viewWidth:{
            value:100
        },
        image:{
            value:null
        }
    };
    S.extend(Preview, S.Base, {
        _init:function () {
            this.container = $(this.get('previewEl'));
            this._build();
        },
        _build:function () {
            var self = this;
            var viewWidth = self.get('viewWidth');
            var viewHeight = self.get('viewHeight');
            self.container.css({
                position:"relative",
                width:viewWidth || self.container.width(),
                height:viewHeight || self.container.height()
            });
            self.container.html('').append(self.canvas.css({
                position:'absolute'
            }));

            self.canvas[0].width = self.canvasW = viewWidth;
            self.canvas[0].height = self.canvasH = viewHeight;
        },
        _rejustSize:function (imgW, imgH, conW, conH) {
            var new_width, new_height;
            if ((imgW / conW) > (imgH / conH)) {
                new_width = Math.min(conW, imgW);
                new_height = new_width * imgH / imgW;
            } else {
                new_height = Math.min(conH, imgH);
                new_width = new_height * imgW / imgH;
            }
            return {
                w : new_width,
                h : new_height,
                x : (conW - new_width)/2,
                y : (conH - new_height)/2
            };
        },
        draw:function (x, y, w, h, r) {
            var self = this;
            // clear canvas
            self.ctx.clearRect(0, 0, self.canvasW, self.canvasH);
            var oriCoords = {
                x : Math.floor(x * r),
                y : Math.floor(y * r),
                w : Math.floor(w * r),
                h : Math.floor(h * r)
            };
            var newCoords = self._rejustSize(oriCoords.w, oriCoords.h, self.canvasW, self.canvasH);
            self.ctx.drawImage(self.get('image'), oriCoords.x, oriCoords.y, oriCoords.w, oriCoords.h, newCoords.x, newCoords.y, newCoords.w, newCoords.h);
        },
        destroy:function () {
            this.canvas.remove();
        }
    });
    return Preview;
}, {
    attach:false
});

/**
 * @Selection ͼ��ѡ��ģ��
 * @author ԪȪ 2013-8-17
 */
KISSY.add('gallery/imgcrop/2.1/type/html5/selection',function (S) {
	//ѡ�����
	function Selection() {
		Selection.superclass.constructor.apply(this, arguments);
		this.csize = 3; // resize cubes size
		this.bDrag = [false, false, false, false]; // drag statuses
		this.bDragAll = false; // drag whole selection
	}

	Selection.ATTRS = {
		x : {
			value : 0
		},
		y : {
			value : 0
		},
		w : {
			value : 50
		},
		h : {
			value : 50
		},
		ratio : {
			value : false
		},
		minWidth : {
			value : 50
		},
		minHeight : {
			value : 50
		},
		resizable : {
			value : true
		},
		borderColor : {
			value : '#fff'
		},
		cubesColor : {
			value : '#fff'
		},
		maskColor : {
			value : "#000"
		},
		maskOpacity : {
			value : "0.5"
		},
		constraint : {
			value : [10000, 10000]
		}
	};
	S.extend(Selection, S.Base, {
		event : {
			DRAG : "drag",
			START_DRAG : "startdrag",
			END_DRAG : "enddrag",
			RESIZE : "resize",
			START_RESIZE : "startresize",
			END_RESIZE : "endresize"
		},
		/**
		 * �滭
		 * @param ctx
		 * @param image
		 */
		draw : function (ctx, image) {
			var self = this;
			var canvasW = ctx.canvas.width;
			var canvasH = ctx.canvas.height;
			// clear canvas
			ctx.clearRect(0, 0, canvasW, canvasH);
			// draw source image
			ctx.drawImage(image, 0, 0, canvasW, canvasH);

			ctx.strokeStyle = self.get('borderColor');
			ctx.lineWidth = 1;
			var rect = {
				w : Math.min(Math.max(self.get('w'), self.get('minWidth')), canvasW),
				h : Math.min(Math.max(self.get('h'), self.get('minHeight')), canvasH),
				x : Math.min(Math.max(self.get('x'), 0), canvasW - self.get('w')),
				y : Math.min(Math.max(self.get('y'), 0), canvasH - self.get('h'))
			};
			self.set(rect);
			ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

			// and make mask
			ctx.fillStyle = self.get('maskColor');
			ctx.globalAlpha = self.get('maskOpacity');
			ctx.fillRect(0, 0, canvasW, self.get('y'));
			ctx.fillRect(0, self.get('y'), self.get('x'), self.get('h'));
			ctx.fillRect(self.get('x') + self.get('w'), self.get('y'), canvasW - self.get('x') - self.get('w'), self.get('h'));
			ctx.fillRect(0, self.get('y') + self.get('h'), canvasW, canvasH - self.get('y') - self.get('h'));
			ctx.globalAlpha = '1';

			/**
			 * �����״
			 * @type {String}
			 */
			ctx.canvas.style.cursor = self.cursor;
			/**
			 * ���֧������
			 */
			if (self.get('resizable')) {
				// draw resize cubes
				ctx.fillStyle = self.get('cubesColor');
				ctx.fillRect(self.get('x') - self.csize, self.get('y') - self.csize, self.csize * 2, self.csize * 2);
				ctx.fillRect(self.get('x') + self.get('w') - self.csize, self.get('y') - self.csize, self.csize * 2, self.csize * 2);
				ctx.fillRect(self.get('x') + self.get('w') - self.csize, self.get('y') + self.get('h') - self.csize, self.csize * 2, self.csize * 2);
				ctx.fillRect(self.get('x') - self.csize, self.get('y') + self.get('h') - self.csize, self.csize * 2, self.csize * 2);
			}
		},
		getInfo : function () {
			return {
				x : this.get('x'),
				y : this.get('y'),
				w : this.get('w'),
				h : this.get('h')
			};
		},
		resize : function (iMouseX, iMouseY) {
			var self = this;
			var iFW,
			iFH,
			iFX,
			iFY;

			if (self.bDrag[0]) {
				iFX = Math.min(iMouseX, self.get('w') + self.get('x') - self.get('minWidth'));
				iFY = Math.min(iMouseY, self.get('h') + self.get('y') - self.get('minHeight'));
				iFW = self.get('w') + self.get('x') - iFX;
				iFH = self.get('h') + self.get('y') - iFY;
			} else if (self.bDrag[1]) {
				iFX = self.get('x');
				iFY = Math.min(iMouseY, self.get('h') + self.get('y') - self.get('minHeight'));
				iFW = iMouseX - iFX;
				iFH = self.get('h') + self.get('y') - iFY;
			} else if (self.bDrag[2]) {
				iFX = self.get('x');
				iFY = self.get('y');
				iFW = iMouseX - iFX;
				iFH = iMouseY - iFY;
			} else if (self.bDrag[3]) {
				iFX = Math.min(iMouseX, self.get('w') + self.get('x') - self.get('minWidth'));
				iFY = self.get('y');
				iFW = self.get('w') + self.get('x') - iFX;
				iFH = iMouseY - iFY;
			}
			//�̶�����
			if (self.get("ratio")) {
				var r = self.get('pw') / self.get("ph");
				if (iFW / iFH < r) {
					iFH = iFW / r;
				} else {
					iFW = iFH * r;
				}
			}
			self.set({
				w : iFW,
				x : iFX,
				h : iFH,
				y : iFY
			});
			self.fire(self.event.RESIZE);
		},
		move : function (diffX, diffY) {
			var self = this;
			self.set({
				x : Math.min(Math.max(self.get('px') + diffX, 0), self.get('constraint')[0] - self.get('pw')),
				y : Math.min(Math.max(self.get('py') + diffY, 0), self.get('constraint')[1] - self.get('ph'))
			});

			self.fire(self.event.DRAG);
		},
		registerPointPos : function (iMouseX, iMouseY) {
			var self = this;
			var code = -1;
			if (iMouseX > self.get('x') + self.csize &&
				iMouseX < self.get('x') + self.get('w') - self.csize &&
				iMouseY > self.get('y') + self.csize &&
				iMouseY < self.get('y') + self.get('h') - self.csize) {
				code = 0;
			} else if (iMouseX > self.get('x') - self.csize && iMouseX < self.get('x') + self.csize &&
				iMouseY > self.get('y') - self.csize && iMouseY < self.get('y') + self.csize) {
				code = 1;
			} else if (iMouseX > self.get('x') + self.get('w') - self.csize && iMouseX < self.get('x') + self.get('w') + self.csize &&
				iMouseY > self.get('y') - self.csize && iMouseY < self.get('y') + self.csize) {
				code = 2;
			} else if (iMouseX > self.get('x') + self.get('w') - self.csize && iMouseX < self.get('x') + self.get('w') + self.csize &&
				iMouseY > self.get('y') + self.get('h') - self.csize && iMouseY < self.get('y') + self.get('h') + self.csize) {
				code = 3;
			} else if (iMouseX > self.get('x') - self.csize && iMouseX < self.get('x') + self.csize &&
				iMouseY > self.get('y') + self.get('h') - self.csize && iMouseY < self.get('y') + self.get('h') + self.csize) {
				code = 4;
			}
			return code;
		},
		markByCode : function (code) {
			var self = this;
			if (code === -1)
				return;
			if (code === 0) {
				self.bDragAll = true;
				self.fire(self.event.START_DRAG);
			} else {
				self.bDrag[code - 1] = true;
				self.fire(self.event.START_RESIZE);
			}
		},
		hoverByCode : function (code) {
			var self = this;
			switch (code) {
			case 0:
				self.cursor = 'move';
				break;
			case 1:
			case 3:
				self.cursor = self.get('resizable') ? 'nw-resize' : 'default';
				break;
			case 2:
			case 4:
				self.cursor = self.get('resizable') ? 'ne-resize' : 'default';
				break;
			default:
				self.cursor = 'default';
			}
		},
		canMove : function () {
			return this.bDragAll;
		},
		canResize : function () {
			return S.inArray(true, this.bDrag);
		},
		reset : function () {
			this.bDragAll = false;
			for (var i = 0; i < this.bDrag.length; i++) {
				this.bDrag[i] = false;
			}
		}
	});
	return Selection;
}, {
	attach : false
});

/*
 * note:
 * 8-17 �޸��̶���������resize����Ե����bug
*/

/**
 * @ImgCrop ͼ��������������canvas
 * @author ԪȪ 2013-5-8
 */
KISSY.add('gallery/imgcrop/2.1/type/html5/imgcrop',function (S, Preview, Selection) {
	var $ = S.all;

	/**
	 * ���ö���
	 * @constructor
	 */
	function ImgCrop() {
		ImgCrop.superclass.constructor.apply(this, arguments);
		this.canvas = $('<canvas>');
		this.ctx = this.canvas[0].getContext('2d');
		this.image = new Image();
	}

	/**
	 * �����õ�����
	 * @type {Object}
	 */
	ImgCrop.ATTRS = {
		/**
		 * ͼ�������{HTMLElement | NodeList | Selector}
		 */
		areaEl : {
			value : ''
		},
		/**
		 * ������ȣ�Ĭ�ϴ���������ʽ�л��
		 */
		areaWidth : {
			value : 0
		},
		/**
		 * �����߶ȣ�Ĭ�ϴ���������ʽ�л��
		 */
		areaHeight : {
			value : 0
		},
		/**
		 * ͼƬ�ĵ�ַ
		 */
		url : {
			value : ''
		},
		/**
		 * �Ӵ���Ĭ�Ͽ��
		 */
		initWidth : {
			value : 100
		},
		/**
		 * �Ӵ���Ĭ�ϸ߶�
		 */
		initHeight : {
			value : 100
		},
		/**
		 * �Ƿ��������
		 */
		resizable : {
			value : true
		},
		/**
		 * �Ƿ�̶�����
		 */
		ratio : {
			value : false
		},
		/**
		 * �Ӵ�����С�߶�
		 */
		minHeight : {
			value : 10
		},
		/**
		 * �Ӵ�����С���
		 */
		minWidth : {
			value : 10
		},
		/**
		 * ��ʼ����
		 */
		initialXY : {
			value : [50, 50]
		},
		/**
		 * �߿���ɫ
		 */
		borderColor : {
			value : '#fff'
		},
		/**
		 * С������ɫ
		 */
		cubesColor : {
			value : '#fff'
		},
		/**
		 *  ������ɫ
		 */
		maskColor : {
			value : '#000'
		},
		/**
		 * ����͸����
		 */
		maskOpacity : {
			value : '0.5'
		},
		/**
		 * Ԥ�����ڣ�����Ҫ���Բ�����{HTMLElement|NodeList}
		 */
		previewEl : {
			value : ''
		},
		/**
		 * Ԥ�����ڸ߶�
		 */
		viewHeight : {
			value : 100
		},
		/**
		 * Ԥ�����ڿ��
		 */
		viewWidth : {
			value : 100
		},
		/**
		 * �Ƿ�֧��touch��pinch
		 */
		touchable : {
			value : true
		}
	};
	S.extend(ImgCrop, S.Base);
	S.augment(ImgCrop, S.EventTarget, {
		/**
		 * ֧�ֵ��¼��б�
		 */
		event : {
			DRAG : "drag",
			START_DRAG : "startdrag",
			END_DRAG : "enddrag",
			RESIZE : "resize",
			START_RESIZE : "startresize",
			END_RESIZE : "endresize",
			TOUCH : "touch",
			START_TOUCH : "starttouch",
			END_TOUCH : "endtouch",
			PINCH : "pinch",
			START_PINCH : "startpinch",
			END_PINCH : "endpinch",
			IMGLOAD : "imgload"
		},
		/**
		 * ��ʼ��
		 * @private
		 */
		_init : function () {
			var self = this;
			// �ò����ӹ��캯��Ǩ�Ƶ�init�У��ڹ��캯���еĻ������areaEl�¸�ֵ�������
			self.container = $(self.get('areaEl'));
			var image = self.image;
			image.onload = function () {
				self._build();
				self._rejustSize(image.width, image.height, self.container.width(), self.container.height());
				self._createSelection();
				self._drawScene();
				self._bind();
				self._createPreview();
				self.fire(self.event.IMGLOAD, self.getOriginalSize());
			};
			image.src = self.get('url');
		},
		/**
		 * �¼���
		 * @private
		 */
		_bind : function () {
			var self = this;
			self._unBind();
			self.canvas.on('mousemove', self._handleHover, self);
			self.canvas.on('mousedown', self._handleMouseDown, self);
			$(document).on('mouseup', self._handleMouseUp, self);
			self.on("*Change", self._doAttrChange, self);
			//���Ӵ����¼�
			if (self.get('touchable')) {
				self._bindTouch();
			}
		},
		/**
		 * �¼����
		 * @private
		 */
		_unBind : function () {
			var self = this;
			$(document).detach('mousemove', self._handleMouseMove, self);
			self.canvas.detach('mousedown', self._handleMouseDown, self);
			$(document).detach('mouseup', self._handleMouseUp, self);
			self.detach("*Change", self._doAttrChange, self);
		},
		/**
		 * ����change�ص�
		 * @param e
		 * @private
		 */
		_doAttrChange : function (e) {
			var self = this;
			S.each(e.attrName, function (attr, index) {
				var value = e.newVal[index];
				switch (attr) {
				case 'initWidth':
					self.theSelection.set('w', value);
					break;
				case 'initHeight':
					self.theSelection.set('h', value);
					break;
				case 'initialXY':
					self.theSelection.set('x', value[0]);
					self.theSelection.set('y', value[1]);
					break;
				case 'borderColor':
				case 'maskColor':
				case 'maskOpacity':
				case 'cubesColor':
				case 'resizable':
				case 'minWidth':
				case 'minHeight':
				case 'ratio':
					self.theSelection.set(attr, value);
					break;
				}
			});
		},
		/**
		 * ����Ԥ�����ڶ���
		 * @private
		 */
		_createPreview : function () {
			var self = this;
			//����Ԥ��
			if (!S.one(self.get('previewEl')))
				return;
			self.preview = new Preview({
					image : self.image,
					previewEl : self.get('previewEl'),
					viewHeight : self.get('viewHeight'),
					viewWidth : self.get('viewWidth')
				});
			self.on("imgload resize drag", function () {
				var Coords = self.getCropCoords();
				self.preview.draw(Coords.x, Coords.y, Coords.w, Coords.h, Coords.r);
			});
		},
		/**
		 * �����ϷŴ��ڶ���
		 * @private
		 */
		_createSelection : function () {
			var self = this;
			self.theSelection = new Selection({
					x : self.get('initialXY')[0],
					y : self.get('initialXY')[1],
					w : self.get('initWidth'),
					h : self.get('initHeight'),
					minWidth : self.get('minWidth'),
					minHeight : self.get('minHeight'),
					resizable : self.get('resizable'),
					borderColor : self.get('borderColor'),
					cubesColor : self.get('cubesColor'),
					maskColor : self.get('maskColor'),
					maskOpacity : self.get('maskOpacity'),
					constraint : [self.canvasW, self.canvasH],
					ratio : self.get("ratio")
				});
			self.theSelection.on("*Change", function () {
				self._drawScene();
			});
			self.theSelection.on("resize", function (e) {
				self.fire(self.event.RESIZE, e);
			});
			self.theSelection.on("startresize", function (e) {
				self.fire(self.event.START_RESIZE, e);
			});
			self.theSelection.on("endresize", function (e) {
				self.fire(self.event.END_RESIZE, e);
			});
			self.theSelection.on("drag", function (e) {
				self.fire(self.event.DRAG, e);
			});
			self.theSelection.on("startdrag", function (e) {
				self.fire(self.event.START_DRAG, e);
			});
			self.theSelection.on("enddrag", function (e) {
				self.fire(self.event.END_DRAG, e);
			});
		},
		/**
		 * ��ʽ��ʼ��
		 * @private
		 */
		_build : function () {
			var self = this;
			var areaWidth = self.get('areaWidth');
			var areaHeight = self.get('areaHeight');
			self.container.css({
				position : "relative",
				width : areaWidth || self.container.width(),
				height : areaHeight || self.container.height()
			});
			/**
			 * �����קʱ�����״����
			 */
			self.canvas.on("selectstart mousedown", _doPreventDefault);
			function _doPreventDefault(e) {
				e.preventDefault();
				return false;
			}

			self.container.html('').append(self.canvas.css({
					position : 'absolute'
				}));
		},
		/**
		 * ���ƻ���
		 * @private
		 */
		_drawScene : function () {
			this.theSelection.draw(this.ctx, this.image);
		},
		/**
		 * ���hover�ص�
		 * @param e
		 * @private
		 */
		_handleHover : function (e) {
			var self = this;
			var canvasOffset = self.canvas.offset();
			var iMouseX = e.pageX - canvasOffset.left;
			var iMouseY = e.pageY - canvasOffset.top;
			var code = self.theSelection.registerPointPos(iMouseX, iMouseY);
			self.theSelection.hoverByCode(code);
			self._drawScene();
		},
		/**
		 * ����ƶ��ص�
		 * @param e
		 * @private
		 */
		_handleMouseMove : function (e) {
			var self = this;
			//���ѡ��
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var canvasOffset = self.canvas.offset();
			var iMouseX = Math.min(Math.max(e.pageX - canvasOffset.left, 0), self.canvasW);
			var iMouseY = Math.min(Math.max(e.pageY - canvasOffset.top, 0), self.canvasH);
			// in case of drag of whole selector
			if (self.theSelection.canMove()) {
				self.theSelection.move(iMouseX - self.iMouseX, iMouseY - self.iMouseY);
			}
			// in case of dragging of resize cubes
			if (self.get('resizable') && self.theSelection.canResize()) {
				self.theSelection.resize(iMouseX, iMouseY);
			}
			self._drawScene();
		},
		/**
		 * ���mousedown�ص�
		 * @param e
		 * @private
		 */
		_handleMouseDown : function (e) {
			var self = this;
			var theSelection = self.theSelection;
			var canvasOffset = self.canvas.offset();
			var iMouseX = self.iMouseX = e.pageX - canvasOffset.left;
			var iMouseY = self.iMouseY = e.pageY - canvasOffset.top;
			//�������꣬moveʱ��Ҫ
			theSelection.set({
				px : theSelection.get('x'),
				py : theSelection.get('y'),
				pw : theSelection.get('w'),
				ph : theSelection.get('h')
			}, {
				silent : true
			});

			var code = theSelection.registerPointPos(iMouseX, iMouseY);
			theSelection.markByCode(code);
			$(document).on('mousemove', self._handleMouseMove, self);
		},
		/**
		 * ���̧��ص�
		 * @param e
		 * @private
		 */
		_handleMouseUp : function (e) {
			var self = this;
			self.theSelection.reset();
			$(document).detach('mousemove', self._handleMouseMove, self);
			self.fire(self.event.END_DRAG, e);
			self.fire(self.event.END_RESIZE, e);
		},
		/*******************************�ƶ��豸֧�� START*********************************/
		/**
		 * ��touch and pinch�¼�
		 * @private
		 */
		_bindTouch : function () {
			var self = this;
			self._unBindTouch();
			self.canvas.on('touchstart', self._handleTouchStart, self);
			self.canvas.on('touchmove', self._handleTouchMove, self);
			self.canvas.on('touchend', self._handleTouchEnd, self);
			self.canvas.on('pinchStart', self._handlePinchStart, self);
			self.canvas.on('pinch', self._handlePinch, self);
			self.canvas.on('pinchEnd', self._handlePinchEnd, self);
		},
		/**
		 * ��touch and pinch�¼�
		 * @private
		 */
		_unBindTouch : function () {
			var self = this;
			self.canvas.detach('touchstart', self._handleTouchStart, self);
			self.canvas.detach('touchmove', self._handleTouchMove, self);
			self.canvas.detach('touchend', self._handleTouchEnd, self);
			self.canvas.detach('pinchStart', self._handlePinchStart, self);
			self.canvas.detach('pinch', self._handlePinch, self);
			self.canvas.detach('pinchEnd', self._handlePinchEnd, self);
		},
		/**
		 * TouchStart�ص�
		 * @param e
		 * @private
		 */
		_handleTouchStart : function (e) {
			var self = this;
			var touch = e.targetTouches[0];
			var theSelection = self.theSelection;
			var canvasOffset = self.canvas.offset();
			var iMouseX = self.iMouseX = touch.pageX - canvasOffset.left;
			var iMouseY = self.iMouseY = touch.pageY - canvasOffset.top;
			//�������꣬moveʱ��Ҫ
			theSelection.set({
				px : theSelection.get('x'),
				py : theSelection.get('y'),
				pw : theSelection.get('w'),
				ph : theSelection.get('h')
			});
			var code = theSelection.registerPointPos(iMouseX, iMouseY);
			theSelection.markByCode(code);
			self.fire(self.event.START_TOUCH, e);
		},
		/**
		 * TouchMove�ص�
		 * @param e
		 * @private
		 */
		_handleTouchMove : function (e) {
			var self = this;
			if (e.targetTouches.length == 1) {
				e.preventDefault(); // ��ֹ�����Ĭ���¼�����Ҫ
				var touch = e.targetTouches[0];
				var canvasOffset = self.canvas.offset();
				var iMouseX = Math.min(Math.max(touch.pageX - canvasOffset.left, 0), self.canvasW);
				var iMouseY = Math.min(Math.max(touch.pageY - canvasOffset.top, 0), self.canvasH);
				// in case of drag of whole selector
				if (self.theSelection.canMove()) {
					self.theSelection.move(iMouseX - self.iMouseX, iMouseY - self.iMouseY);
				}
				// in case of dragging of resize cubes
				if (self.get('resizable') && self.theSelection.canResize()) {
					self.theSelection.resize(iMouseX, iMouseY);
				}
				self._drawScene();
				self.fire(self.event.TOUCH, e);
			}
		},
		/**
		 * TouchEnd�ص�
		 * @param e
		 * @private
		 */
		_handleTouchEnd : function (e) {
			this._handleMouseUp(e);
			this.fire(self.event.END_TOUCH, e);
		},
		/**
		 * PinchStart�ص�
		 * @param e
		 * @private
		 */
		_handlePinchStart : function (e) {
			this.pinchScale = e.scale;
			this.cropCoords = this.getCropCoords();
			this.fire(self.event.START_PINCH, e);
		},
		/**
		 * Pinch�ص�
		 * @param e
		 * @private
		 */
		_handlePinch : function (e) {
			var self = this;
			var scale = e.scale;
			//�̶�����
			var maxW = self.canvasW;
			var maxH = self.canvasH;
			if (self.get("ratio")) {
				var r = self.cropCoords.w / self.cropCoords.h;
				if (maxW / maxH < r) {
					maxH = maxW / r;
				} else {
					maxW = maxH * r;
				}
			}
			if (self.cropCoords.w * scale >= self.get('minWidth') &&
				self.cropCoords.h * scale >= self.get('minHeight')) {
				self.setCropCoords(
					Math.max(self.cropCoords.x - (self.cropCoords.w * (scale - 1) / 2), 0),
					Math.max(self.cropCoords.y - (self.cropCoords.h * (scale - 1) / 2), 0),
					Math.min(self.cropCoords.w * scale, maxW),
					Math.min(self.cropCoords.h * scale, maxH));
			}
			self.fire(self.event.PINCH, e);
		},
		/**
		 * PinchEnd�ص�
		 * @param e
		 * @private
		 */
		_handlePinchEnd : function (e) {
			this.pinchScale = null;
			this.cropCoords = null;
			this.fire(self.event.END_TOUCH, e);
		},
		/*******************************�ƶ��豸֧�� END*********************************/
		/**
		 * ����ͼƬ�ߴ�
		 * @param imgW ͼƬԭʼ���
		 * @param imgH ͼƬԭʼ�߶�
		 * @param conW �������
		 * @param conH �����߶�
		 * @private
		 */
		_rejustSize : function (imgW, imgH, conW, conH) {
			var self = this,
			new_width,
			new_height;
			if ((imgW / conW) > (imgH / conH)) {
				new_width = Math.min(conW, imgW);
				new_height = new_width * imgH / imgW;
			} else {
				new_height = Math.min(conH, imgH);
				new_width = new_height * imgW / imgH;
			}
			self.canvas[0].width = self.canvasW = Math.floor(new_width);
			self.canvas[0].height = self.canvasH = Math.floor(new_height);
			self.canvas.css({
				top : (self.container.height() - self.canvasH) / 2,
				left : (self.container.width() - self.canvasW) / 2
			});
		},
		/**
		 * ��Ⱦ
		 */
		render : function () {
			this._init();
		},
		/**
		 * ���³�ʼ��
		 */
		reset : function () {
			this._init();
		},
		/**
		 * ����
		 */
		destroy : function () {
			this._unBind();
			this.canvas.remove();
			this.theSelection = null;
			if (this.preview) {
				this.preview.destroy();
			}
		},
		/**
		 * ��������ѡȡ��λ�ô�С
		 * @param x
		 * @param y
		 * @param w
		 * @param h
		 */
		setCropCoords : function (x, y, w, h) {
			this.set({
				initialXY : [x, y],
				initWidth : w,
				initHeight : h
			});
		},
		/**
		 * The top, left, height, width and image url of the image being cropped
		 * @return {*}
		 */
		getCropCoords : function () {
			return S.merge(this.theSelection.getInfo(), {
				url : this.get('url'),
				r : this.image.width / this.canvasW
			});
		},
		/**
		 * ͼƬ��ԭʼ�ߴ�
		 * @return {Object}
		 */
		getOriginalSize : function () {
			return {
				width : this.image.width,
				height : this.image.height
			};
		},
		/**
		 * ͼƬ������ʾ�ĳߴ�
		 * @return {Object}
		 */
		getDisplaySize : function () {
			return {
				width : this.canvasW,
				height : this.canvasH
			};
		},
		/**
		 * ��ȡ��Ϣ���ַ�����ʽ
		 * @param space
		 * @return {*}
		 */
		toString : function (space) {
			return S.JSON.stringify(this.getCropCoords(), null, space || 0);
		}
	});
	return ImgCrop;
}, {
	attach : false,
	requires : ['./preview', './selection']
});

/**
 * resize���
 */
KISSY.add('gallery/imgcrop/2.1/type/normal/resizable',function (S) {
    var Event = S.Event,
        DOM = S.DOM;
    //���ų���
    function Resize() {
        this.initialize.apply(this, arguments);
    }

    S.augment(Resize, {
        //���Ŷ���
        initialize:function (obj, options) {
            var self = this;
            this._obj = DOM.get(obj); //���Ŷ���
            this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0; //��ʽ����
            this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0; //�������
            this._fixLeft = this._fixTop = 0; //��λ����
            this._scaleLeft = this._scaleTop = 0; //��λ����
            this._mxSet = function () {
            }; //��Χ���ó���
            this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0; //��Χ����
            this._mxScaleWidth = this._mxScaleHeight = 0; //������Χ����
            this._fun = function () {
            }; //����ִ�г���
            //��ȡ�߿���
            this._borderX = parseInt(DOM.css(this._obj, "border-left-width"), 10) + parseInt(DOM.css(this._obj, "border-right-width"), 10);
            this._borderY = parseInt(DOM.css(this._obj, "border-top-width"), 10) + parseInt(DOM.css(this._obj, "border-bottom-width"), 10);
            this.setOptions(options);
            //��Χ����
            this.Max = !!this.options.Max;
            this._mxContainer = DOM.get(this.options.mxContainer) || null;
            this.mxLeft = Math.round(this.options.mxLeft);
            this.mxRight = Math.round(this.options.mxRight);
            this.mxTop = Math.round(this.options.mxTop);
            this.mxBottom = Math.round(this.options.mxBottom);
            //�������
            this.Min = !!this.options.Min;
            this.minWidth = Math.round(this.options.minWidth);
            this.minHeight = Math.round(this.options.minHeight);
            //����������
            this.Scale = !!this.options.Scale;
            this.Ratio = Math.max(this.options.Ratio, 0);
            this._obj.style.position = "absolute";
            if (this._mxContainer) {
                DOM.css(this._mxContainer, 'position', 'relative');
            }
            // ������ע���¼�
            S.each(this.options.Points, function (point, dir) {
                (function (point, dir) {
                    Event.on(point, "mousedown", function (e) {
                        e.funName = dir;
                        self.start(e);
                    });
                })(point, dir);
            });
        },
        //����Ĭ������
        setOptions:function (options) {
            this.options = { //Ĭ��ֵ
                Max:false, //�Ƿ����÷�Χ����(Ϊtrueʱ����mx��������)
                mxContainer:"", //ָ��������������
                mxLeft:0, //�������
                mxRight:9999, //�ұ�����
                mxTop:0, //�ϱ�����
                mxBottom:9999, //�±�����
                Min:false, //�Ƿ���С�������(Ϊtrueʱ����min��������)
                minWidth:50, //��С���
                minHeight:50, //��С�߶�
                Scale:false, //�Ƿ񰴱�������
                Ratio:0, //���ű���(��/��)
                Points:{
                    Right:".cubes-t",
                    Left:".cubes-t",
                    Up:".cubes-t",
                    Down:".cubes-t",
                    RightDown:".cubes-rb",
                    LeftDown:".cubes-lb",
                    RightUp:".cubes-rt",
                    LeftUp:".cubes-lt"
                },
                onResize:function () {
                },
                onResizeStart:function () {
                },
                onResizeEnd:function () {
                }
                //����ʱִ��
            };
            S.mix(this.options, options);
        },
        //׼������
        start:function (e) {
            //��ֹð��(���Ϸ����ʱ����)
            e.halt();
            //����ִ�г���
            this._fun = this[e.funName];
            //��ʽ����ֵ
            this._styleWidth = this._obj.clientWidth;
            this._styleHeight = this._obj.clientHeight;
            this._styleLeft = this._obj.offsetLeft;
            this._styleTop = this._obj.offsetTop;
            //�����߶�λ����
            this._sideLeft = e.clientX - this._styleWidth;
            this._sideRight = e.clientX + this._styleWidth;
            this._sideUp = e.clientY - this._styleHeight;
            this._sideDown = e.clientY + this._styleHeight;
            //top��left��λ����
            this._fixLeft = this._styleLeft + this._styleWidth;
            this._fixTop = this._styleTop + this._styleHeight;
            //���ű���
            if (this.Scale) {
                //���ñ���
                this.Ratio = this._styleWidth / this._styleHeight;
                //left��top�Ķ�λ����
                this._scaleLeft = this._styleLeft + this._styleWidth / 2;
                this._scaleTop = this._styleTop + this._styleHeight / 2;
            }
            //��Χ����
            if (this.Max) {
                //���÷�Χ����
                var mxLeft = this.mxLeft,
                    mxRight = this.mxRight,
                    mxTop = this.mxTop,
                    mxBottom = this.mxBottom;
                //�����������������������Χ����
                if (!!this._mxContainer) {
                    mxLeft = Math.max(mxLeft, 0);
                    mxTop = Math.max(mxTop, 0);
                    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                    mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                }
                //������Сֵ������
                mxRight = Math.max(mxRight, mxLeft + (this.Min ? this.minWidth : 0) + this._borderX);
                mxBottom = Math.max(mxBottom, mxTop + (this.Min ? this.minHeight : 0) + this._borderY);
                //����ת��ʱҪ������������д��function��ʽ
                this._mxSet = function () {
                    this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
                    this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
                    this._mxUpHeight = Math.max(this._fixTop - mxTop, this.Min ? this.minHeight : 0);
                    this._mxLeftWidth = Math.max(this._fixLeft - mxLeft, this.Min ? this.minWidth : 0);
                };
                this._mxSet();
                //�����ű����µķ�Χ����
                if (this.Scale) {
                    this._mxScaleWidth = Math.min(this._scaleLeft - mxLeft, mxRight - this._scaleLeft - this._borderX) * 2;
                    this._mxScaleHeight = Math.min(this._scaleTop - mxTop, mxBottom - this._scaleTop - this._borderY) * 2;
                }
            }
            //mousemoveʱ���� mouseupʱֹͣ
            Event.on(document, "mousemove", this.resize, this);
            Event.on(document, "mouseup", this.stop, this);
            this.options.onResizeStart(e);
        },
        //ֹͣ����
        stop:function (e) {
            Event.detach(document, "mousemove", this.resize, this);
            Event.detach(document, "mouseup", this.stop, this);
            this.options.onResizeEnd(e);
        },
        //����
        resize:function (e) {
            //���ѡ��
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //ִ�����ų���
            this._fun(e);
            //������ʽ������������ڵ���0����ie����
            this._obj.style.width = this._styleWidth + "px";
            this._obj.style.height = this._styleHeight + "px";
            this._obj.style.top = this._styleTop + "px";
            this._obj.style.left = this._styleLeft + "px";
            //���ӳ���
            this.options.onResize(e);
        },
        //���ų���
        //��
        Up:function (e) {
            this.RepairY(this._sideDown - e.clientY, this._mxUpHeight);
            this.RepairTop();
            this.TurnDown(this.Down);
        },
        //��
        Down:function (e) {
            this.RepairY(e.clientY - this._sideUp, this._mxDownHeight);
            this.TurnUp(this.Up);
        },
        //��
        Right:function (e) {
            this.RepairX(e.clientX - this._sideLeft, this._mxRightWidth);
            this.TurnLeft(this.Left);
        },
        //��
        Left:function (e) {
            this.RepairX(this._sideRight - e.clientX, this._mxLeftWidth);
            this.RepairLeft();
            this.TurnRight(this.Right);
        },
        //����
        RightDown:function (e) {
            this.RepairAngle(e.clientX - this._sideLeft, this._mxRightWidth, e.clientY - this._sideUp, this._mxDownHeight);
            this.TurnLeft(this.LeftDown) || this.TurnUp(this.RightUp);
        },
        //����
        RightUp:function (e) {
            this.RepairAngle(e.clientX - this._sideLeft, this._mxRightWidth, this._sideDown - e.clientY, this._mxUpHeight);
            this.RepairTop();
            this.TurnLeft(this.LeftUp) || this.TurnDown(this.RightDown);
        },
        //����
        LeftDown:function (e) {
            this.RepairAngle(this._sideRight - e.clientX, this._mxLeftWidth, e.clientY - this._sideUp, this._mxDownHeight);
            this.RepairLeft();
            this.TurnRight(this.RightDown) || this.TurnUp(this.LeftUp);
        },
        //����
        LeftUp:function (e) {
            this.RepairAngle(this._sideRight - e.clientX, this._mxLeftWidth, this._sideDown - e.clientY, this._mxUpHeight);
            this.RepairTop();
            this.RepairLeft();
            this.TurnRight(this.RightUp) || this.TurnDown(this.LeftDown);
        },
        //��������
        //ˮƽ����
        RepairX:function (iWidth, mxWidth) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                var iHeight = Math.round(iWidth / this.Ratio);
                if (this.Max && iHeight > this._mxScaleHeight) {
                    iWidth = Math.round((iHeight = this._mxScaleHeight) * this.Ratio);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = Math.round(this.minHeight * this.Ratio);
                    if (tWidth < mxWidth) {
                        iHeight = this.minHeight;
                        iWidth = tWidth;
                    }
                }
                this._styleHeight = iHeight;
                this._styleTop = this._scaleTop - iHeight / 2;
            }
            this._styleWidth = iWidth;
        },
        //��ֱ����
        RepairY:function (iHeight, mxHeight) {
            iHeight = this.RepairHeight(iHeight, mxHeight);
            if (this.Scale) {
                var iWidth = Math.round(iHeight * this.Ratio);
                if (this.Max && iWidth > this._mxScaleWidth) {
                    iHeight = Math.round((iWidth = this._mxScaleWidth) / this.Ratio);
                } else if (this.Min && iWidth < this.minWidth) {
                    var tHeight = Math.round(this.minWidth / this.Ratio);
                    if (tHeight < mxHeight) {
                        iWidth = this.minWidth;
                        iHeight = tHeight;
                    }
                }
                this._styleWidth = iWidth;
                this._styleLeft = this._scaleLeft - iWidth / 2;
            }
            this._styleHeight = iHeight;
        },
        //�ԽǷ���
        RepairAngle:function (iWidth, mxWidth, iHeight, mxHeight) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                iHeight = Math.round(iWidth / this.Ratio);
                if (this.Max && iHeight > mxHeight) {
                    iWidth = Math.round((iHeight = mxHeight) * this.Ratio);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = Math.round(this.minHeight * this.Ratio);
                    if (tWidth < mxWidth) {
                        iHeight = this.minHeight;
                        iWidth = tWidth;
                    }
                }
            } else {
                iHeight = this.RepairHeight(iHeight, mxHeight);
            }
            this._styleWidth = iWidth;
            this._styleHeight = iHeight;
        },
        //top
        RepairTop:function () {
            this._styleTop = this._fixTop - this._styleHeight;
        },
        //left
        RepairLeft:function () {
            this._styleLeft = this._fixLeft - this._styleWidth;
        },
        //height
        RepairHeight:function (iHeight, mxHeight) {
            iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
            iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
            return iHeight;
        },
        //width
        RepairWidth:function (iWidth, mxWidth) {
            iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
            iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
            return iWidth;
        },
        //ת�����
        //ת��
        TurnRight:function (fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideLeft = this._sideRight;
                this.Max && this._mxSet();
                return true;
            }
        },
        //ת��
        TurnLeft:function (fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideRight = this._sideLeft;
                this._fixLeft = this._styleLeft;
                this.Max && this._mxSet();
                return true;
            }
        },
        //ת��
        TurnUp:function (fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideDown = this._sideUp;
                this._fixTop = this._styleTop;
                this.Max && this._mxSet();
                return true;
            }
        },
        //ת��
        TurnDown:function (fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideUp = this._sideDown;
                this.Max && this._mxSet();
                return true;
            }
        }
    });
    return Resize;
}, {
    attach:false
});


/**
 *��ק���
 */
KISSY.add('gallery/imgcrop/2.1/type/normal/dragable',function (S) {
	var Event = S.Event,
	DOM = S.DOM,
	ie = S.UA.ie;
	//�Ϸų���
	function Drag() {
		this.initialize.apply(this, arguments);
	}

	S.augment(Drag, {
		//�ϷŶ���
		initialize : function (drag, options) {
			this.Drag = DOM.get(drag); //�ϷŶ���
			this._x = this._y = 0; //��¼�������ϷŶ����λ��
			this._marginLeft = this._marginTop = 0; //��¼margin
			//�¼�����(���ڰ��Ƴ��¼�)
			this.setOptions(options);
			this.Limit = !!this.options.Limit;
			this.mxLeft = parseInt(this.options.mxLeft);
			this.mxRight = parseInt(this.options.mxRight);
			this.mxTop = parseInt(this.options.mxTop);
			this.mxBottom = parseInt(this.options.mxBottom);
			this.LockX = !!this.options.LockX;
			this.LockY = !!this.options.LockY;
			this.Lock = !!this.options.Lock;
			this._Handle = DOM.get(this.options.Handle) || this.Drag;
			this._mxContainer = DOM.get(this.options.mxContainer) || null;
			this._Handle.style.position = "absolute";
			//������Χ
			this.Repair();
			Event.on(this._Handle, "mousedown", this.start, this);
		},
		//����Ĭ������
		setOptions : function (options) {
			this.options = { //Ĭ��ֵ
				Handle : "", //���ô������󣨲�������ʹ���ϷŶ���
				Limit : true, //�Ƿ����÷�Χ����(Ϊtrueʱ�����������,�����Ǹ���)
				mxLeft : 0, //�������
				mxRight : 9999, //�ұ�����
				mxTop : 0, //�ϱ�����
				mxBottom : 9999, //�±�����
				mxContainer : "", //ָ��������������
				LockX : false, //�Ƿ�����ˮƽ�����Ϸ�
				LockY : false, //�Ƿ�������ֱ�����Ϸ�
				Lock : false, //�Ƿ�����
				Transparent : true, //�Ƿ�͸��
				onstart : function () {}, //��ʼ�ƶ�ʱִ��
				onmove : function () {}, //�ƶ�ʱִ��
				onstop : function () {}
				//�����ƶ�ʱִ��
			};
			S.mix(this.options, options);
		},
		//׼���϶�
		start : function (e) {
			e.preventDefault();
			if (this.Lock) {
				return;
			}
			this.Repair();
			//��¼�������ϷŶ����λ��
			this._x = e.clientX - this.Drag.offsetLeft;
			this._y = e.clientY - this.Drag.offsetTop;
			//��¼margin
			this._marginLeft = parseInt(DOM.css(this.Drag, 'margin-left'), 10) || this._marginLeft;
			this._marginTop = parseInt(DOM.css(this.Drag, 'margin-top'), 10) || this._marginTop;
			//mousemoveʱ�ƶ� mouseupʱֹͣ
			Event.on(document, "mousemove", this.move, this);
			Event.on(document, "mouseup", this.stop, this);
			//���ӳ���
			this.options.onstart(e);
		},
		//ֹͣ�϶�
		stop : function (e) {
			//�Ƴ��¼�
			Event.detach(document, "mousemove", this.move, this);
			Event.detach(document, "mouseup", this.stop, this);
			//���ӳ���
			this.options.onstop(e);
		},
		//������Χ
		Repair : function () {
			if (this.Limit) {
				//��������Χ����
				this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
				this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
				//�����������������positionΪrelative����Զ�λ�����ڻ�ȡoffset֮ǰ����
				if (this._mxContainer) {
					DOM.css(this._mxContainer, 'position', 'relative');
				}
			}
		},
		//�϶�
		move : function (e) {
			//�ж��Ƿ�����
			if (this.Lock) {
				this.stop();
				return;
			}
			//���ѡ��
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			//�����ƶ�����
			var iLeft = e.clientX - this._x,
			iTop = e.clientY - this._y;
			//���÷�Χ����
			if (this.Limit) {
				//���÷�Χ����
				var mxLeft = this.mxLeft,
				mxRight = this.mxRight,
				mxTop = this.mxTop,
				mxBottom = this.mxBottom;
				//�����������������������Χ����
				if (!!this._mxContainer) {
					mxLeft = Math.max(mxLeft, 0);
					mxTop = Math.max(mxTop, 0);
					mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
					mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
				}
				//�����ƶ�����
				iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
				iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
			}
			//����λ�ã�������margin
			if (!this.LockX) {
				this.Drag.style.left = iLeft - this._marginLeft + "px";
			}
			if (!this.LockY) {
				this.Drag.style.top = iTop - this._marginTop + "px";
			}
			//���ӳ���
			this.options.onmove(e);
		}
	});
	return Drag;
}, {
	attach : false
});

/**
 * ͼƬ�������
 * author ԪȪ
 * date 2013-3-31
 */
KISSY.add('gallery/imgcrop/2.1/type/normal/imgcrop',function (S, Resize, Drag) {
    var $ = S.all,
        Event = S.Event,
        DOM = S.DOM;

    function ImgCrop(option) {
        ImgCrop.superclass.constructor.apply(this, arguments);
    }

    ImgCrop.ATTRS = {
        areaEl:{
            value:''
        },
        areaWidth:{
            value:0
        },
        areaHeight:{
            value:0
        },
        url:{
            value:''
        },
        initWidth:{
            value:100
        },
        initHeight:{
            value:100
        },
        resizable:{
            value:true
        },
        ratio:{
            value:false
        },
        maskOpacity:{
            value:0.5
        },
        maskColor:{
            value:'#000'
        },
        /**
         * �߿���ɫ
         */
        borderColor:{
            value:'#fff'
        },
        /**
         * С������ɫ
         */
        cubesColor:{
            value:'#fff'
        },
        minHeight:{
            value:100
        },
        minWidth:{
            value:100
        },
        previewEl:{
            value:''
        },
        viewHeight:{
            value:300
        },
        viewWidth:{
            value:300
        },
        initialXY:{
            value:[50, 50]
        }
    };
    S.extend(ImgCrop, S.Base, {
        _init:function () {
            var self = this;
            self._render();
            self._bind();
        },
        _bind:function () {
            var self = this;
            self._unbind();
            self.on('*Change', self._loadImage, self);
            Event.on(self._tempImg, 'load', self._onImgLoad, self);
        },
        _unbind : function(){
            var self = this;
            self.detach('*Change', self._loadImage, self);
            Event.detach(self._tempImg, 'load', self._onImgLoad, self);
        },
        _render:function () {
            var self = this;
            self.area = $(self.get('areaEl')).css('overflow', 'hidden').html('');
            self.preview = $(self.get('previewEl')).html('');
            self.area.css('position', 'relative');
            self.wrap = $('<div class="crop-wrap">');
            self.wrap.append(self._createDragEl()).appendTo(self.area);
            self.get('areaWidth') ? self.area.width(self.get('areaWidth')) : self.set('areaWidth', self.area.width());
            self.get('areaHeight') ? self.area.height(self.get('areaHeight')) : self.set('areaHeight', self.area.height());
            self._layBase = new Image(); //�ײ�
            self._layCropper = new Image(); //�и��
            self._tempImg = new Image(); //ԭͼ
            self.wrap.append(self._layBase).append(self._layCropper);
            self._setPreview();
            self._loadImage();
        },
        _createDragEl:function () {
            var self = this;
            var _el = self.el = $('<div class="crop">');
            if (self.get("resizable")) {
                S.each(['lt', 'rt', 'rb', 'lb', 't'], function (pos) {
                    _el.append($('<div class="cubes cubes-' + pos + '">'));
                });
                _el.all('.cubes').css({
                    'position': 'absolute',
                    'background-color': self.get('cubesColor'),
                    'width': 6,
                    'height': 6,
                    'font-size': 0,
                    'line-height': 0
                });
                _el.all(".cubes-lt").css({
                    left : -4,
                    top  : -4,
                    cursor : 'nw-resize'
                });
                _el.all(".cubes-rt").css({
                    right : -4,
                    top  : -4,
                    cursor : 'ne-resize'
                });
                _el.all(".cubes-lb").css({
                    left : -4,
                    bottom  : -4,
                    cursor : 'ne-resize'
                });
                _el.all(".cubes-rb").css({
                    right : -4,
                    bottom  : -4,
                    cursor : 'nw-resize'
                });
                _el.all(".cubes-t").hide();
            }
            _el.css({
                'position':'absolute',
                'left':self.get('initialXY')[0],
                'top':self.get('initialXY')[1],
                'width':self.get('initWidth'),
                'height':self.get('initHeight'),
                'display':'none',
                'cursor' : 'move',
                'background': "url('#')",
                'border':'1px solid '+self.get('borderColor')
            });

            return _el;
        },
        _loadImage:function () {
            var self = this;
            var imgUrl = self.get("url");
            var token = imgUrl.indexOf('?') > -1 ? '&' : '?';
            self._layBase.style.visibility = self._layCropper.style.visibility = 'hidden';
            //����ͼƬ��Ϊ�˱�֤ÿ�ε��ö��ܴ���load�¼���һ�������
            self._tempImg.src = self._layBase.src = self._layCropper.src = imgUrl + token + "nocache=" + S.guid();
            if (self._view) {
                self._view.src = self._tempImg.src;
            }
        },
        _onImgLoad:function () {
            this._initStyle();
            this._setImgSize();
            this._setPos();
            this._initDrag();
            this._initResize();
        },
        _initDrag:function () {
            var self = this;
            //�����Ϸ�
            self._drag = new Drag(self.el, {
                Max:true,
                mxContainer:self.wrap,
                onstart:function (e) {
                    self.fire("dragstart", e);
                }, //��ʼ�ƶ�ʱִ��
                onmove:function (e) {
                    self._setPos();
                    self.fire("drag", e);
                }, //�ƶ�ʱִ��
                onstop:function (e) {
                    self.fire("dragend", e);
                }
            });
        },
        _initResize:function () {
            var self = this;
            //��������
            if (self.get('resizable')) {
                self._resize = new Resize(self.el, {
                    Max:true,
                    Min:true,
                    Scale:self.get("ratio"),
                    minWidth:self.get("minWidth"),
                    minHeight:self.get("minHeight"),
                    mxContainer:self.wrap,
                    onResize:function (e) {
                        self._setPos();
                        self.fire("resize", e);
                    },
                    onResizeStart:function (e) {
                        self.fire("resizestart", e);
                    },
                    onResizeEnd:function (e) {
                        self.fire("resizeend", e);
                    }
                });
            }
        },
        _initStyle:function () {
            var self = this;
            //������ʽ
            self.wrap.css({
                position:'relative',
                overflow:'hidden',
                background:self.get("maskColor")
            });
            self.el.css('z-index', 200);
            DOM.css(self._layCropper, {
                zIndex:100,
                position:'absolute',
                top:0,
                left:0
            });
            DOM.css(self._layBase, {
                position:'absolute',
                opacity:self.get("maskOpacity"),
                top:0,
                left:0
            });
        },
        _adjustPos:function () {
            var self = this;
            var p = self._getPos();
            var _wrapWidth = self.wrap.width();
            var _wrapHeight = self.wrap.height();
            if (p.x + p.w > _wrapWidth) {
                self.el.width(_wrapWidth - p.x);
            }
            if (p.y + p.h > _wrapHeight) {
                self.el.height(_wrapHeight - p.y);
            }
        },
        //�����и���ʽ
        _setPos:function () {
            var self = this;
            //ie6��Ⱦbug
            self.el.css('zoom', 0.5);
            self.el.css({
                zoom:1,
                display:'block'
            });
            self._adjustPos();
            var p = self._getPos();
            //���ϷŶ���Ĳ��������и�
            self._layCropper.style.clip = "rect(" + p.y + "px " + (p.x + p.w) + "px " + (p.y + p.h) + "px " + p.x + "px)";
            //����Ԥ��
            self._view && self._setPrePos();
        },
        //����Ԥ��Ч��
        _setPreview:function () {
            var self = this;
            //����Ԥ������
            var preWrap = S.one(self.get("previewEl")); //Ԥ������
            if (preWrap) {
                self._view = new Image();
                self._view.style.position = "absolute";
                preWrap.append(self._view);
                preWrap.css({
                    position:'relative',
                    overflow:'hidden'
                });
            }
        },
        _setPrePos:function () {
            var self = this;
            //Ԥ����ʾ�Ŀ�͸�
            var p = self._getPos(),
                s = self._getSize(p.w, p.h, self.get("viewWidth") || DOM.width(preWrap), self.get("viewHeight") || DOM.height(preWrap)),
                scale = s.height / p.h,
                pTop = p.y * scale,
                pLeft = p.x * scale;
            //����Ԥ������
            DOM.css(self._view, {
                width:self._layBase.width * scale,
                height:self._layBase.height * scale,
                top:-pTop,
                left:-pLeft,
                clip:"rect(" + pTop + "px " + (pLeft + s.width) + "px " + (pTop + s.height) + "px " + pLeft + "px)"
            });
        },
        //��ȡ�ߴ�
        _getSize:function (imgW, imgH, conW, conH) {
            var width = imgW * 1.0;
            var height = imgH * 1.0;
            var new_width;
            var new_height;
            if ((width / conW) > (height / conH)) {
                new_width = Math.min(conW, width);
                new_height = new_width * height / width;
            } else {
                new_height = Math.min(conH, height);
                new_width = new_height * width / height;
            }
            return {
                width:new_width,
                height:new_height
            };
        },
        //����ͼƬ��С
        _setImgSize:function () {
            var self = this;
            var s = self._getSize(self._tempImg.width, self._tempImg.height, self.get("areaWidth"), self.get("areaHeight"));
            //���õ�ͼ���и�ͼ
            self._layBase.style.width = self._layCropper.style.width = s.width + "px";
            self._layBase.style.height = self._layCropper.style.height = s.height + "px";
            self.wrap.css({
                'position':'absolute',
                'width':s.width,
                'height':s.height,
                'top':(self.area.height() - s.height) / 2,
                'left':(self.area.width() - s.width) / 2
            });
            self._layBase.style.visibility = self._layCropper.style.visibility = 'visible';
            self.fire("imgload", {
                width:s.width,
                height:s.height
            });
            return s;
        },
        //��ȡ��ǰ��ʽ
        _getPos:function () {
            return {
                y:parseFloat(this.el.css('top')),
                x:parseFloat(this.el.css('left')),
                w:parseFloat(this.el.css('width')),
                h:parseFloat(this.el.css('height'))
            };
        },
        /**
         * ��ǰ��ʾͼƬ�ĳߴ�
         * @return {*}
         */
        getDisplaySize:function () {
            return this._getSize(this._tempImg.width, this._tempImg.height, this.get("areaWidth"), this.get("areaHeight"));
        },
        /**
         * ԭʼͼƬ�ĳߴ�
         * @return {Object}
         */
        getOriginalSize:function () {
            return {
                width:parseInt(this._tempImg.width, 10),
                height:parseInt(this._tempImg.height, 10)
            };
        },
        /**
         * ��������ͼƬ��Ϣ
         * @return {Object}
         */
        getCropCoords:function () {
            var info = this._getPos();
            var r = parseInt(this._tempImg.width, 10) / parseInt(this._layBase.width, 10);
            var result = {
                y:info.y,
                x:info.x,
                w:info.w,
                h:info.h,
                r:r,
                url:this.get("url")
            };
            return result;
        },
        /**
         * �������ü�������λ��
         * @param x
         * @param y
         * @param w
         * @param h
         */
        setCropCoords:function (x, y, w, h) {
            this.el.css({
                width:w,
                height:h,
                top:y,
                left:x
            });
            this._setPos();
        },
        render : function(){
            this._init();
        },
        show:function () {
            this.area.show();
        },
        hide:function () {
            this.area.hide();
        },
        destroy:function () {
            Event.remove(this.area);
            this.area.html("");
            this.preview.html("");
            for (var a in this) {
                if (this.hasOwnProperty(a)) {
                    delete this[a];
                }
            }
        },
        reset:function () {
            this._init();
        },
        toString:function () {
            return S.JSON.stringify(this.getCropCoords());
        }
    });
    return ImgCrop;
}, {
    attach:false,
    requires:[
        './resizable',
        './dragable'
    ]
});

/**
 * ͼƬ�������
 * author ԪȪ
 * date 2013-5-4
 */
KISSY.add('gallery/imgcrop/2.1/index',function (S, ImgCropCanvas, ImgCropNormal) {
    return 'getContext' in document.createElement('canvas') ? ImgCropCanvas : ImgCropNormal;
}, {
    requires: [
        './type/html5/imgcrop',
        './type/normal/imgcrop'
    ]
});


