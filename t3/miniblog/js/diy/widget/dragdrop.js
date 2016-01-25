/**
 * @author wangliang3@staff.sina.com.cn
 * @desc 拖拽，对dom绑定拖拽操作
 */
$import('diy/dom.js');
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/removeEvent.js");

(function(){
    /**
     * @method App.DragDrop
     * @param id{String or Object} 拖拽的dom对象
     * @param triger{String or Object} 出发拖拽的dom对象，也可不指定，默认为id触发
     * @param config{Json} 
     * @param config.driect{String} 拖拽方向，默认随意，“x”为沿X轴拖拽，“y”为沿Y轴拖动
     * @param config.index{Int} 设定浮动的z-index值
     * @param config.range{Int} 拖拽页面溢出scroll响应，默认Y轴上下50px范围触发，可指定0为禁用
     * @param config.size{Int} 拖拽页面溢出scroll滑动范围，默认依赖config.range值，为 config.range/5，也可单独指定滑动大小
     * 例：对obj绑定沿X轴拖拽事件
     * var dd = new App.DragDrop(obj,'',{driect:'x'})
     */
    App.DragDrop = function(id,triger,config){
		//初始化参数
		config = config || {};
		config.driect = config.driect || '';
		config.index = config.index || 100;
		config.range = config.range || 50;
		config.size = config.size || Math.floor(config.range/5);
		
		var ua=navigator.userAgent.toLowerCase();
		var de = document.documentElement,db = document.body;
		
        var event = Core.Events;
		var __DRAG_ITEM_CSS = 'dragdrop';
		
        this.dragDom = null;
        this.curPos = null;
		
        //声明外部引用函数
        var _dragStart = function(){};
        var _dragEnd = function(){};
        var _onDrag = function(){};
		
        var that = this;
		
		//绑定扩展函数
		var bind = function(fFunc, object, args) { 
			args = args == null? []: args;
			var __method = fFunc; 
			return function() { 
			 return __method.apply(object, args); 
			};
		};
        
        var handler = {
			initEvent : function(){
				event.addEvent(triger, handler.onmouseDown, 'mousedown');
			},
			fireEvent : function(){
				event.removeEvent(triger, handler.onmouseDown, 'mousedown');
			},
            init: function(){
                this.dragDom = (typeof id === 'string') ? $E(id) : id;
                App.Dom.addClass(this.dragDom, __DRAG_ITEM_CSS);
                if (triger) {
                    triger = (typeof triger === 'string') ? $E(triger) : triger;
                }
                else {
                    triger = this.dragDom;
                }
				//bind event
				handler.initEvent();
            },
            onmouseDown: function(e){
				event.stopEvent();
				
				var obj = triger;
                while (obj.tagName) {
                    if (App.Dom.hasClass(obj, __DRAG_ITEM_CSS)) {
                        that.dragDom = obj;
                        break;
                    }
                    obj = obj.parentNode;
                }
                
                that._oPos = App.Dom.getXY(that.dragDom,{abs:true});
                that._cPos = handler.getCurPos(e);
                event.addEvent(document, handler.onmouseUp, 'mouseup');
                event.addEvent(document, handler.onmouseMove, 'mousemove');
                
				if ($IE) {
					triger.setCapture();
                }
				obj.style.left = that._oPos.x + 'px';
                obj.style.top = that._oPos.y + 'px';
                obj.style.zIndex = config.index;
                obj.style.position = 'absolute';
				
                bind(_dragStart, that)();
				return false;
            },
            onmouseMove: function(e){
				event.stopEvent();
				var Pos = handler.getCurPos(e);
				
				//start change scroll
				if(config.range > 0){
					
					var _scroll = App.Dom.getScroll();
					var _screen = App.Dom.getScreen();
					var _sizeY = 0,_sizeX = 0;
					if(Pos.y > _screen.h+_scroll.t-config.range){
						_sizeY +=config.size;
						if(ua.match(/chrome\/([\d\.]+)/)){
							db.scrollTop += config.size;
						}else{
							de.scrollTop += config.size;
						}
					}else if(Pos.y < _scroll.t+config.range){
						_sizeY -=config.size;
						if(ua.match(/chrome\/([\d\.]+)/)){
							db.scrollTop -= config.size;
						}else{
							de.scrollTop -= config.size;
						}
					}
				}
				//end change scroll
				
                that.curPos = Pos;					
				if(config.driect == 'x'){
					that.dragDom.style.left =Pos.x - that._cPos.x + that._oPos.x + 'px';
				}else if(config.driect == 'y'){
					that.dragDom.style.top =_sizeY + Pos.y - that._cPos.y + that._oPos.y + 'px';
				}else{
					that.dragDom.style.left =Pos.x - that._cPos.x + that._oPos.x + 'px';
                	that.dragDom.style.top =_sizeY + Pos.y - that._cPos.y + that._oPos.y + 'px';
				}
				
                bind(_onDrag, that)();
				return false;
            },
            onmouseUp: function(e){
				if ($IE) {
					triger.releaseCapture();
                }
				event.removeEvent(document, handler.onmouseUp, 'mouseup');
                event.removeEvent(document, handler.onmouseMove, 'mousemove');
				bind(_dragEnd, that)();
            },
            getCurPos: function(e){
                e = e || window.event;
                var D = document.documentElement;
                if (e.pageX) {
                    return {
                        x: e.pageX,
                        y: e.pageY
                    };
                }
                return {
                    x: e.clientX + D.scrollLeft - D.clientLeft,
                    y: e.clientY + D.scrollTop - D.clientTop
                };
            }
        };
		//init
        handler.init();
        
        return {
            dragStart: function(fun){
                _dragStart = fun;
            },
            onDrag: function(fun){
                _onDrag = fun;
            },
            dragEnd: function(fun){
                _dragEnd = fun;
            },
			init : function(){
				handler.initEvent();
			},
			fire : function(){
				handler.fireEvent();
			}
        };
    };
})();
