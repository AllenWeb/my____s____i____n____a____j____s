/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Drag 拖动类，对拖动行为的封装，使得更方便的实现拖动
 * @author xinlin | xinlin@sina.staff.com.cn
 * @version 1.0 | 2008-09-02
 */
$import("sina/utils/utils.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/fixEvent.js');
$import('sina/core/system/getScrollPos.js');

Utils.Drag = {
	dragee:null,
	/**
	 * 初始化一个拖动对象 
	 * @param {HTMLElement} tar 被拖动对象
	 * @param {HTMLElement} trig 触发拖动事件的对象 !!!注意 trig不可为一个A标签对象
	 * @example
		var tar = $E('Drag_target');
		var trig = $E('trigger');
		tar.onDragStart = function(e){}
		tar.onDrag = function(e){
			//参数e为事件对象，此外tar.tmp对象带有所有的位置信息
		}
		tar.onDragEnd = function(e){}
		Utils.Drag.init(tar, trig);
	 * ======================================
	 * 拖动对象在拖动的过程中会给提供以下属性：
	 * 	DragTarget:{
	 * 		trig:触发拖动事件的对象
	 * 		tmp:{
	 * 			x_o: 事件发生点相对与出发对象的X偏移量  	x_offset
	 * 			y_o: 事件发生点相对与出发对象的Y偏移量  	y_offset
	 * 			x_s:拖动事件发生原坐标					x_source
	 * 			y_s:								y_source
	 * 			x_l:拖动中上一次的事件坐标  				x_last
	 * 			y_l:								y_last
	 * 			x_n:拖动中当前的事件坐标				x_now
	 * 			y_n:								y_now
	 * 		}
	 * 	}
	 * 
	 * DragTarget实现拖动的三个方法，都会默认传入标准的事件对象e
	 */
	init:function (tar, trig) {
		tar.trig = trig?trig:tar;
		if(!(tar.onDragStart && tar.onDrag && tar.onDragEnd)){
			$Debug('drag target must impelement onDragStart(),onDrag(),onDragEnd()');
			return false;
		}
		Core.Events.addEvent(tar.trig,start,'mousedown');
		function start (e) {
			Utils.Drag.dragee = tar;
			e = Core.Events.fixEvent(Core.Events.getEvent());
			var src = e.target;
			if (src.tagName.toUpperCase() == "A" || src.parentNode.tagName.toUpperCase() == "A") {
				return;
			}
			
			tar.tmp = {
				x_o : e.layerX,
				y_o : e.layerY,
				x_s : e.pageX,
				y_s : e.pageY
			};
			if($IE){
				var ss = Core.System.getScrollPos();
				tar.tmp.x_s += ss[1];
				tar.tmp.y_s += ss[0];
			}
			tar.onDragStart(e);
			Core.Events.addEvent(document.body, drag, 'mousemove');
			Core.Events.addEvent(document.body, end, 'mouseup');
		}
		function drag (e){
			if (!Utils.Drag.dragee) {
				return;
			}
			e = Core.Events.fixEvent(Core.Events.getEvent());
			tar.tmp.x_l = tar.tmp.x_n;
			tar.tmp.y_l = tar.tmp.y_n;
			
			tar.tmp.x_n = e.pageX;
			tar.tmp.y_n = e.pageY;
			if($IE){
				var ss = Core.System.getScrollPos();
				tar.tmp.x_n += ss[1];
				tar.tmp.y_n += ss[0];
			}
			tar.onDrag(e);
		}
		function end (e) {
			
			e = Core.Events.fixEvent(Core.Events.getEvent());
			tar.tmp.x_n = e.pageX;
			tar.tmp.y_n = e.pageY;
			if($IE){
				var ss = Core.System.getScrollPos();
				tar.tmp.x_n += ss[1];
				tar.tmp.y_n += ss[0];
			}
			tar.onDragEnd(e);
			tar.tmp = null;
			tar.trig = null;
			Utils.Drag.dragee = null;
			Core.Events.removeEvent(document.body, drag, 'mousemove');
			Core.Events.removeEvent(document.body, end, 'mouseup');
		}
	}
};
