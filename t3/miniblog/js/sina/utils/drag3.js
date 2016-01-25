/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview Drag3 对象拖动类(可一次拖动多个对象，要拖动的象通过数组的形式当作第二个参数中传入)
 * @author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-17
 * 
 * Demo:
 * 		//dom1:拖动的作用对象
 * 		//[dom1,dom2,dom3]:需要拖动的动象数组
 * 		var d3=new Utils.Drag3(dom1,[dom1,dom2,dom3]);
 */

$import("sina/utils/utils.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/fixEvent.js');
$import("sina/core/base/detect.js");
/**
 * beDragObj:[Object]
 * moveObjs:[Array]
 * dragMode:[string]("normal"|"border"|"opacity")(目前只有第一种模式，谢谢)
 */
var Drag3=function(beDragObj,movedObjs,dragMode){
	var _this=this;
	this.beDragObj=beDragObj;
	this.movedObjs=movedObjs||this.beDragObj;
	this.dragMode=dragMode||"normal";
	this.canDrag=true;
	this.isLock=false;
	this.lockArea={
		left:0,
		right:0,
		top:0,
		bottom:0
	};
	this.dragSet={
		"normal": function(){
			_this.normalDrag();
		},
		"border": function(){
			_this.borderDrag();
		},
		"opacity": function(){
			_this.opacityDrag();
		}
	};
	this.dragObjsFunc=function(){
		_this.onDrag();
		_this.dragObjs();
	};

	(function initialize(){
		_this.beDragObj.style.MozUserSelect="none";
		Core.Events.addEvent(_this.beDragObj,function(){
			return false;
		},"selectstart");
		
		Core.Events.addEvent(_this.beDragObj,function(){return false;},"drag");
		for(var i=0;i<_this.movedObjs.length;i++){
			if(_this.movedObjs[i]!=_this.beDragObj){
				_this.movedObjs[i].style.position="absolute";
				if(!_this.movedObjs[i].style.left){
					_this.movedObjs[i].style.left=_this.movedObjs[i].offsetLeft+"px";
				}
				if(!_this.movedObjs[i].style.top){
					_this.movedObjs[i].style.top=_this.movedObjs[i].offsetTop+"px";
				}
			}
		}

		Core.Events.addEvent(_this.beDragObj, _this.dragSet[_this.dragMode], "mousedown");
		if (Core.Base.detect.$IE) {
			Core.Events.addEvent(_this.beDragObj, function(){
				Core.Events.removeEvent(_this.beDragObj, _this.dragObjsFunc, "mousemove");
				_this.beDragObj.releaseCapture();
				_this.onDragEnd();
			}, "mouseup");
		}else{
			Core.Events.addEvent(document, function(){
				Core.Events.removeEvent(document, _this.dragObjsFunc, "mousemove");
				_this.onDragEnd();
			}, "mouseup");
		}
	})();
};


Drag3.prototype={
	capture:function(){
		this.canDrag=true;
	},
	release:function(){
		this.canDrag=false;
	},
	onDragStart:function(){

	},
	onDrag:function(){

	},
	onDragEnd:function(){
		
	},
	dragObjs:function(){
		e = Core.Events.getEvent();
		
		for (var i = 0; i < this.movedObjs.length; i++) {
			if (this.isLock) {
				//这些是拖动区域限制的代码，太TM丑了，后期再优化下。。— —！
				if(e.clientX - this.movedObjs[i].deltaX < this.lockArea.left){
					this.movedObjs[i].style.left=this.lockArea.left+"px";
				}else{
					if(e.clientX - this.movedObjs[i].deltaX > this.lockArea.right - this.movedObjs[i].offsetWidth){
						this.movedObjs[i].style.left = this.lockArea.right - this.movedObjs[i].offsetWidth+"px";
					}else{
						this.movedObjs[i].style.left=e.clientX - this.movedObjs[i].deltaX + "px";
					}
				}
				
				if(e.clientY - this.movedObjs[i].deltaY < this.lockArea.top){
					this.movedObjs[i].style.top=this.lockArea.top+"px";
				}else{
					if(e.clientY - this.movedObjs[i].deltaY > this.lockArea.bottom - this.movedObjs[i].offsetHeight){
						this.movedObjs[i].style.top = this.lockArea.bottom - this.movedObjs[i].offsetHeight+"px";
					}else{
						this.movedObjs[i].style.top=e.clientY - this.movedObjs[i].deltaY + "px";
					}
				}

			}else{
				this.movedObjs[i].style.left = e.clientX - this.movedObjs[i].deltaX + "px";
				this.movedObjs[i].style.top = e.clientY - this.movedObjs[i].deltaY + "px";
			}
		}
	},
	normalDrag:function(){
		var _this=this;
		e = Core.Events.getEvent();
		for(var i=0;i<_this.movedObjs.length;i++){
			_this.movedObjs[i].deltaX=e.clientX-parseInt(_this.movedObjs[i].style.left);
			_this.movedObjs[i].deltaY=e.clientY-parseInt(_this.movedObjs[i].style.top);
		}
		if (_this.canDrag) {
			if (Core.Base.detect.$IE) {
				_this.beDragObj.setCapture();
				Core.Events.addEvent(_this.beDragObj, _this.dragObjsFunc, "mousemove");
			}
			else {
				Core.Events.addEvent(document, _this.dragObjsFunc, "mousemove");
			}
		}
		_this.onDragStart();
	},
	borderDrag:function(obj,borderWidth){
		
	},
	opacityDrag:function(obj,opacityValue){
		
	}
};

Utils.Drag3=Drag3;
