/**
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @update 08.06.12
 */
(function () {
	// ------------------------------------------------------------------------------------------------------------------
	var funcName = "trace";
	if(window[funcName] != null) {
		if(window[funcName].isLoad == true) {
			return false;
		}
	}
	else {
		(function () {
			var trace = function () {};
			trace.error = function () {};
			trace.traceList = [];
			window[funcName] = trace;
		})();
	}
	
	// ------------------------------------------------------------------------------------------------------------------
	var ___agent___ = navigator.userAgent.toLowerCase();
	var _ie = /msie/.test(___agent___);
	var _ie6 = /msie 6/.test(___agent___);
	var _moz = /gecko/.test(___agent___);
	var _opera = /opera/.test(___agent___);
	var _safari = /webkit/.test(___agent___);

	/**
	 * 根据元素的id获取对应节点的引用
	 * @param {String} id 节点的id或者节点本身
	 * @author stan | chaoliang@staff.sina.com.cn
	 */
	var $E = function (id){
		return typeof(id) == "string"? document.getElementById(id): id;
	};

	/**
	 * 给指定对象增加HTML[不会破坏这个对象固有节点的事件]
	 * @private
	 * @param {HTMLElement | Document |} oParentNode 节点对象
	 * @param {String} sHTML 代码字符串
	 * @return {Void}
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 07.12.26
	 * @example
	 * 			addHTML(document.body, "<input/>");
	 */
	var addHTML;
	if(_ie) {
		addHTML = function(oParentNode, sHTML){
			oParentNode.insertAdjacentHTML("BeforeEnd", sHTML);
		};
	}
	else {
		addHTML = function(oParentNode, sHTML){
			var oRange = oParentNode.ownerDocument.createRange();
			oRange.setStartBefore(oParentNode);
			var oFrag = oRange.createContextualFragment(sHTML);
			oParentNode.appendChild(oFrag);
		};
	}


	/**
	 * add DOM onload Event
	 * @private
	 */
	var addDOMLoadEvent = function (func){
		if (!window.__load_events) {
			var init = function(){
				// quit if this function has already been called
				if (arguments.callee.done) {
					return;
				}
				// flag this function so we don't do the same thing twice
				arguments.callee.done = true;
				
				// kill the timer
				if (window.__load_timer) {
					clearInterval(window.__load_timer);
					window.__load_timer = null;
				}
				
				// execute each function in the stack in the order they were added
				for (var i = 0; i < window.__load_events.length; i++) {
					window.__load_events[i]();
				}
				window.__load_events = null;
			};
			
			// for Mozilla/Opera9
			if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", init, false);
			}
			
			// for Internet Explorer
			/*@cc_on @*/
			/*@if (@_win32)
			 var rnd_ID = parseInt(Math.random() * 10000);
			 document.write("<scr"+"ipt id=__ie_onload_"+rnd_ID+" defer src=javascript:void(0)><\/scr"+"ipt>");
			 var script = document.getElementById("__ie_onload_"+ rnd_ID);
			 script.onreadystatechange = function() {
				 if (this.readyState == "complete") {
					 init(); // call the onload handler
				 }
			 };
			 /*@end @*/
			// for Safari
			if (/WebKit/i.test(navigator.userAgent)) { // sniff
				window.__load_timer = setInterval(function(){
					if (/loaded|complete/.test(document.readyState)) {
						init(); // call the onload handler
					}
				}, 10);
			}
			
			// for other browsers
			window.onload = init;
			
			// create event function stack
			window.__load_events = [];
		}
		
		// add function to event stack
		window.__load_events.push(func);
	};
	/**
	 * 获取页面的带滚动条的高宽以及显示区域高宽
	 * @private
	 * @return {Array} 分别为窗口带滚动条宽高跟显示区域宽高
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 */
	var getPageSize = function (){
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		}
		else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
		
		var windowWidth, windowHeight;
		if (self.innerHeight) { // all except Explorer
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		}
		else 
			if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			}
			else 
				if (document.body) { // other Explorers
					windowWidth = document.body.clientWidth;
					windowHeight = document.body.clientHeight;
				}
		
		// for small pages with total height less then height of the viewport
		if (yScroll < windowHeight) {
			pageHeight = windowHeight;
		}
		else {
			pageHeight = yScroll;
		}
		
		// for small pages with total width less then width of the viewport
		if (xScroll < windowWidth) {
			pageWidth = windowWidth;
		}
		else {
			pageWidth = xScroll;
		}
		arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
		return arrayPageSize;
	};
	/**
	 * 获取Event对象
	 * @private
	 * @return {Event} event对象
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.06.13
	 * @example
	 * 			getEvent();
	 */
	var getEvent = function(){
		return window.event;
	};
	if (!_ie) {
		getEvent = function(){
			var o = arguments.callee.caller;
			var e;
			var n = 0;
			while (o != null && n < 40) {
				e = o.arguments[0];
				if (e && (e.card == Event || e.card == MouseEvent)) {
					return e;
				}
				n++;
				o = o.caller;
			}
			return e;
		};
	}
	
	/**
	 * 禁止Event事件冒泡
	 * @private
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.23
	 * @example
	 * 			stopEvent();
	 */
	var stopEvent = function(){
		var ev = getEvent();
		ev.cancelBubble = true;
		ev.returnValue = false;
	};
	if (!_ie) {
		stopEvent = function(){
			var ev = getEvent();
			ev.preventDefault();
			ev.stopPropagation();
		};
	}
	/**
	 * 在指定节点上绑定相应的事件
	 * @private
	 * @param {String} elm 需要绑定的节点id
	 * @param {Function} func 事件发生时相应的函数
	 * @param {String} evType 事件的类型如:click, mouseover
	 * @update 08.02.23
	 * @author Stan | chaoliang@staff.sina.com.cn
	 *         FlashSoft | fangchao@staff.sina.com.cn
	 * @example
	 * 		//鼠标点击testEle则alert "clicked"
	 * 		addEvent2("testEle",function () {
	 * 			alert("clicked")
	 * 		},'click');
	 */
	var addEvent2 = function (elm, func, evType, useCapture){
		var elm = $E(elm);
		if (typeof useCapture == 'undefined') 
			useCapture = false;
		if (typeof evType == 'undefined') 
			evType = 'click';
		if (elm.addEventListener) {
			elm.addEventListener(evType, func, useCapture);
			return true;
		}
		else 
			if (elm.attachEvent) {
				var r = elm.attachEvent('on' + evType, func);
				return true;
			}
			else {
				elm['on' + evType] = func;
			}
	};
	/**
	 * 在指定节点上移除绑定的事件
	 * @method removeEvent2
	 * @param {HTMLElement} elm 需要解除绑定的节点id
	 * @param {Function} func 事件发生时相应的函数
	 * @param {String} evType 事件的类型如:click, mouseover
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @global $removeEvent2
	 * @update 08.02.23
	 * @example
	 * 			function go() {};
	 * 			removeEvent2(document.body, go, "click");
	 */
	var removeEvent2 = function (oElement, fHandler, sName) {
		var elm = $E(oElement);
		if ("function" != typeof fHandler) return;
		if (oElement.addEventListener) {
			oElement.removeEventListener(sName, fHandler, false);
		}
		else if (oElement.attachEvent) {
			oElement.detachEvent("on" + sName, fHandler);
		}
		fHandler[sName] = null;
	};
	/**
	 * 取得页面的scrollPos
	 * @private
	 * @return {Array} 滚动条居顶 居左值
	 * @author chaoliang@staff.sina.com.cn
	 *         FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.13
	 */
	var getScrollPos = function(oDocument){
		oDocument = oDocument || document;
		return [
			Math.max(oDocument.documentElement.scrollTop, oDocument.body.scrollTop),
			Math.max(oDocument.documentElement.scrollLeft, oDocument.body.scrollLeft)
		];
	};
	/**
	 * 获取指定节点的样式
	 * @private
	 * @param {HTMLElement | Document} el 节点对象
	 * @param {String} property 样式名
	 * @return {String} 指定样式的值
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.23
	 * @example
	 * 			getStyle(document.body, "left");
	 */
	var getStyle = function(el, property){
		switch (property) {
			// 透明度
			case "opacity":
				var val = 100;
				try {
					val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
				} 
				catch (e) {
					try {
						val = el.filters('alpha').opacity;
					} 
					catch (e) {
					}
				}
				return val;
			// 浮动
			case "float":
				property = "styleFloat";
			default:
				var value = el.currentStyle ? el.currentStyle[property] : null;
				return (el.style[property] || value);
		}
	};
	if (!_ie) {
		getStyle = function(el, property){
			// 浮动
			if (property == "float") {
				property = "cssFloat";
			}
			// 获取集合
			try {
				var computed = document.defaultView.getComputedStyle(el, "");
			} 
			catch (e) {}
			return el.style[property] || computed ? computed[property] : null;
		};
	}
	
	/**
	 * <pre>
	 * 设定指定节点的样式
	 * </pre>
	 * @private
	 * @param {HTMLElement | Document} el 节点对象
	 * @param {String} property 样式名
	 * @param {String} val 样式值
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.23
	 * @example
	 * 			setStyle(document.body, "opacity", "0.2");
	 */
	var setStyle = function(el, property, val){
		switch (property) {
			case "opacity":
				el.style.filter = "alpha(opacity=" + (val * 100) + ")";
				if (!el.currentStyle || !el.currentStyle.hasLayout) {
					el.style.zoom = 1;
				}
				break;
			case "float":
				property = "styleFloat";
			default:
				el.style[property] = val;
		}
	};
	if (!_ie) {
		setStyle = function(el, property, val){
			if (property == "float") {
				property = "cssFloat";
			}
			el.style[property] = val;
		};
	}
	
	/**
	 * 获取节点对象的距文档的XY值
	 * @private
	 * @param {HTMLElement } el 节点对象
	 * @return {Array} x,y的数组对象
	 * @author FlashSoft | fangchao@staff.sina.com.cn
	 * @update 08.02.23
	 * @example
	 * 			getXY($E("input"));
	 */
	var getXY = function(el){
		if ((el.parentNode == null || el.offsetParent == null || getStyle(el, "display") == "none") && el != document.body) {
			return false;
		}
		var parentNode = null;
		var pos = [];
		var box;
		var doc = el.ownerDocument;
		// IE
		box = el.getBoundingClientRect();
		var scrollPos = getScrollPos(el.ownerDocument);
		return [box.left + scrollPos[1], box.top + scrollPos[0]];
		// IE end
		parentNode = el.parentNode;
		while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
			if (getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) {
				pos[0] -= parentNode.scrollLeft;
				pos[1] -= parentNode.scrollTop;
			}
			parentNode = parentNode.parentNode;
		}
		return pos;
	};
	if (!_ie) {
		getXY = function(el){
			if ((el.parentNode == null || el.offsetParent == null || getStyle(el, "display") == "none") && el != document.body) {
				return false;
			}
			var parentNode = null;
			var pos = [];
			var box;
			var doc = el.ownerDocument;
			
			// FF
			pos = [el.offsetLeft, el.offsetTop];
			parentNode = el.offsetParent;
			var hasAbs = getStyle(el, "position") == "absolute";
			
			if (parentNode != el) {
				while (parentNode) {
					pos[0] += parentNode.offsetLeft;
					pos[1] += parentNode.offsetTop;
					if (_safari && !hasAbs && getStyle(parentNode, "position") == "absolute") {
						hasAbs = true;
					}
					parentNode = parentNode.offsetParent;
				}
			}
			
			if (_safari && hasAbs) {
				pos[0] -= el.ownerDocument.body.offsetLeft;
				pos[1] -= el.ownerDocument.body.offsetTop;
			}
			parentNode = el.parentNode;
			// FF End
			while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
				if (getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) {
					pos[0] -= parentNode.scrollLeft;
					pos[1] -= parentNode.scrollTop;
				}
				parentNode = parentNode.parentNode;
			}
			return pos;
		};
	}
	
	var hitTest = function (oElement, oEvent) {
		var _nodeXY = getXY(oElement);
		var _pos = {
			left: _nodeXY[0],
			top: _nodeXY[1],
			right: _nodeXY[0] + oElement.offsetWidth,
			bottom: _nodeXY[1] + oElement.offsetHeight
		};
		var scrollPos = getScrollPos();
		var _x = oEvent.clientX + scrollPos[1];
		var _y = oEvent.clientY + scrollPos[0];
		//$Debug("left: " + _pos.left + ", top: " + _pos.top + ", right: " + _pos.right + ", bottom: " + _pos.bottom + ", x: " + _x + ", y: " + _y);
		if(_x > _pos.right || _x < _pos.left || _y < _pos.top || _y > _pos.bottom) {
			return false;
		}
		return true;
	};
	// ------------------------------------------------------------------------------------------------------------------
	
	var _rndID = parseInt(Math.random() * 10000, 10);

	var _getTraceNode = function (sName) {
		return $E("TraceBox_" + _rndID + "_" + sName);
	};
	/** 缓冲中尚未输出的数据集合 */
	var _bufferLineArr = [];
	/** trace的节点对象集合 */
	var _traceNodes = {};
	/** 输出信息用的定时器 */
	var _outputTimer;

	
	var _startTime = new Date().valueOf();
	var _curTime = new Date().valueOf();
	var _runTime;
	
	var _isInit = false;
	/** trace的样式表 */
	var _traceStyle = '&#00;\
		<style>\
		.trace{}\
		.trace\\.tab{position:absolute;background:#ccc;width:40px;height:40px;left:0;top:0;}\
		.trace\\.tab .trace\\.tab_item{}\
		.trace\\.shadow{position:absolute;left:-3000px;top:-3000px;overflow:hidden;}\
		.trace\\.shadow iframe, .trace\\.shadow div{position:absolute;left:0;top:0;width:100%;height:100%;border:0;opacity:0; filter:alpha(opacity=0);background:#ccc;}\
		.trace\\.box{-moz-user-select:none;z-index:1024;font-family:"Courier New", "宋体";font-size:12px;position:absolute;left:-3000px;top:-3000px;visibility:visible;width:400px;height:400px;overflow:hidden;}\
		.trace\\.mask{position:absolute;top:0;left:0;width: 400px;height:400px;}\
		.trace\\.top{background:#000;color:#333;text-align:right;height:20px;line-height:20px;cursor:move;}\
		.trace\\.top span{margin-right:4px;}\
		.trace\\.middle{height:360px;background:#000;overflow-y:auto;scrollbar-3dlight-color:#fff;scrollbar-arrow-color:#000;scrollbar-base-color:#000;scrollbar-darkshadow-color:#000;scrollbar-face-color:#fff;scrollbar-highlight-color:#fff;scrollbar-shadow-color:#fff;scrollbar-track-color:#000;}\
		.trace\\.middle\\.title{background:#111;border:0;border-bottom:1px solid #333;color:#fff;font-weight:700;padding:4px;}\
		.trace\\.middle\\.body{display:block;}\
		.trace\\.middle\\.line{border:0;border-bottom:1px solid #111;color:#fff;padding:2px;}\
		.trace\\.middle\\.line\\.time{height:12px;line-height:12px;margin-right:10px;}\
		.trace\\.middle\\.line\\.runtime{font-family:"宋体";color:#555;float:right;text-align:right;width:100px;}\
		.trace\\.middle\\.line\\.curtime{font-family:"宋体";color:#6f0;float:right;text-align:right;width:100px;}\
		.trace\\.middle\\.line\\.curtime\\.red{color:#f00;}\
		.trace\\.middle\\.line\\.curtime\\.yellow{color:#ff0;}\
		.trace\\.middle\\.line\\.text{text-align:left;clear:left;word-break:break-all;padding-left:10px;line-height:16px;}\
		.trace\\.bottom{background:#000;color:#ccc;overflow:hidden;width:100%;height:20px;}\
		.trace\\.bottom .input{float:left;clear:none;font-family:"Courier New";background:#FFF;border:1px solid #000;text-indent:4px;width:150px;height:16px;}\
		.trace\\.bottom .button{float:left;clear:none;font-family:"Courier New";background:#000;border:1px solid #000;color:#fff;}\
		</style>\
	';
	var _traceHTML = '\
		<div class="trace">\
			<div id="{TraceTpl}_shadow" class="trace.shadow"><iframe></iframe><div></div></div>\
			<div class="trace.box" id="{TraceTpl}_box">\
				<div class="trace.mask" id="{TraceTpl}_mask">\
					<div class="trace.top" id="{TraceTpl}_title" onselectstart="return false;"><span>TraceBox 0.2</span></div>\
					<div class="trace.middle.body" id="{TraceTpl}_body" style="">\
					<div class="trace.middle" id="{TraceTpl}_content"></div>\
					<!-- 暂时禁用 //-->\
					<div class="trace.bottom">\
					<input class="input" type="text" readonly />\
					<input type="button" value="Find" class="button" disabled hideFocus="true" />\
					<input type="button" value="Clear" class="button" disabled hideFocus="true" /></div>\
					</div>\
				</div>\
			</div>\
			<!--<div class="trace.tab">\
				<div class="trace.tab_item">&nbsp;</div>\
			</div>-->\
		</div>\
	';
	var _getContent = function (sText, oOption) {
		var timeStr = "";
		var lineColor = (oOption.color ? "color: " + oOption.color + ";" : "") + (oOption.bgColor ? "background-color: " + oOption.bgColor + ";" : "");
		if(oOption.time != false) {
			_runTime = new Date().valueOf();
			var curTimeLint = _runTime - _curTime, curClass = "";
			if(curTimeLint >= 16 && curTimeLint < 300) {
				curClass = "color:#FF0;";
			}
			else if(curTimeLint > 300) {
				curClass = "color:#F00;";
			}
			timeStr = '\
				<div class="trace.middle.line.time">\
					<span class="trace.middle.line.curtime" style="' + curClass + '">' + curTimeLint + '</span>\
					<span class="trace.middle.line.runtime">' + (_runTime - _startTime) + '</span>\
				</div>\
			';
		}
		var html = '\
			<div class="trace.middle.line">\
				' + timeStr + '\
				<div class="trace.middle.line.text" style="' + lineColor + '">' + sText + '</div>\
			</div>\
		';
		_curTime = new Date().valueOf();
		return html;
	};
	var _setScroll = function () {
		_traceNodes.content.scrollTop = _traceNodes.content.scrollHeight;
	};
	var _outputContent = function () {
		addHTML(_traceNodes.content, _bufferLineArr.splice(0, 100).join(""));
		_setScroll();
		clearTimeout(_outputTimer);
		if(_bufferLineArr.length > 0) {
			_outputTimer = setTimeout(_outputContent, 100);
		}
		
	};
	var _traceCMD = function (sText){
		var html = '<div class="trace.middle.title">&gt;&gt;&nbsp;' + sText + '</div>';
		addHTML(_traceNodes.content, html);
		_setScroll();
	};
	var _traceError = function (oError) {
		_trace(_getErrorContent(oError), {color: "#F00"});
	};
	var _getErrorContent = function (oError) {
		var err = "<font color='#FF0000'><b>" + oError.name + "</b>:: " + oError.description + "</font>";
		return err;
	};
	if(_moz) {
		_getErrorContent = function (oError) {
			var errFile = oError.fileName;//.substr(oError.filename.lastIndexOf("/") + 1);
			var err = "<font color='#FF0000'><b>" + oError.name + "</b>:: " + oError.message + "<br/>" + "<b>文件</b>: " + errFile + "<br/>" + "<b>出错行</b>: " + oError.lineNumber + "行" + "</font>";
			return err;
		};
	}
	if(_opera) {
		_getErrorContent = function (oError) {
			var err = "<font color='#FF0000'><b>" + oError.name + "</b>:: " + oError.message + "</font>";
			return err;
		};
	}
	var _trace = function (sText, oOption, sBgColor) {
		oOption = oOption || {};
		if(typeof oOption == "string"){
			oOption = { "color" : oOption };
			if(typeof sBgColor != "undefined" && typeof sBgColor == "string"){
				oOption.bgColor = sBgColor;
			}
		}
		_bufferLineArr[_bufferLineArr.length] = _getContent(sText, oOption);
		clearTimeout(_outputTimer);
		_outputTimer = setTimeout(_outputContent, 100);
	};
	
	var _dragTrace = (function () {
		/** 鼠标的坐标集合 */
		var mousePos = {x: 0, y: 0};
		
		/** 新的鼠标坐标集合 */
		var newMousePos = {x: 0, y: 0};
		
		/** 可拖拽的范围 */
		var dragArea = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		};
		var dragNodePos = [];
		
		var dragNodeInfo = {};
		
		/** 被拖拽的对象 */
		var dragNode = null;
		/** 被拖拽对象的内容 */
		var dragMaskNode = null;
		/** 拖拽的句柄 */
		var dragNodeHandle = null;
		
		/** 是否可被拖拽 */
		var dragStatus = false;
		
		/** 吸附误差 */
		var fixWelt = 20;
		
		/**
		 * 是否贴边
		 * 取值范围:
		 *  0: 不贴
		 *  1: 上
		 *  2: 右
		 *  3: 下
		 *  4: 左
		 */
		var isWelt = 0;
		
		var isMiddle = false;

		/** 获取拖拽范围 */
		var _getDragArea = function (nWidth, nHeight) {
			
			nWidth = nWidth == null? 0: nWidth;
			nHeight = nHeight == null? 0: nHeight;
			
			var fixScrollWidth = 0;
			
			var fixScrollHeight = 0;
			
			
			var scrollPos = getScrollPos();
			var pageSize = getPageSize();
			/** 如果是非IE */
			if (pageSize[1] > pageSize[3] && !_ie) {
				if (pageSize[0] != pageSize[2]) {
					fixScrollHeight = 18;
				}
				fixScrollWidth = 18;
			}
			/** 如果是IE6 */
			else if(_ie6 && pageSize[1] < pageSize[3]) {
				fixScrollHeight = 22;
			}
			/** 如果是非IE */
			if (pageSize[0] > pageSize[2] && !_ie) {
				fixScrollWidth = 18;
			}
			/** 如果是IE6 */
			else if(_ie6 && pageSize[0] < pageSize[2]) {
				fixScrollHeight = 22;
			}
			
			return {
				left: scrollPos[1],
				top: scrollPos[0],
				right: pageSize[2] - nWidth - fixScrollWidth,
				bottom: pageSize[3] - nHeight - fixScrollHeight,
				width: nWidth,
				height: nHeight
			};
		};
		var _getDragNodeInfo = function () {
			return {
				width: _traceNodes.box.offsetWidth,
				height: _traceNodes.box.offsetHeight
			}
		};
		var dragDown = function (el){
			
			dragArea = _getDragArea(dragNode.offsetWidth, dragNode.offsetHeight);
			
			dragNodePos = getXY(dragNode);
			
			MousePos = {
				x: el.clientX,
				y: el.clientY
			};
			
			var str = "基本信息<br>---------------------------------------------------";
			str += "<br/>";
			str += "x: " + el.clientX + ", y: " + el.clientY;
			str += "<br/>";
			str += "pageSize: " + getPageSize();
			str += "<br/>";
			str += "scrollTop: " + getScrollPos();
			str += "<br/>";
			str += "dargNodePos: " + dragNodePos;
			str += "<br/>";
			str += "left: " + dragArea.left + ", top: " + dragArea.top + ", right: " + dragArea.right + ", bottom: " + dragArea.bottom + ", width: " + dragArea.width + ", height: " + dragArea.height;
//			$Debug(str, {color: "#FF0"});
//			
//			try{
//				$E("markDiv").style.left = dragArea.left + "px";
//				$E("markDiv").style.top = dragArea.top + "px";
//				$E("markDiv").style.width = dragArea.right + "px";
//				$E("markDiv").style.height = dragArea.bottom + "px";
//				//_traceNodes.box.style.left = (dragArea.left + dragArea.right) + "px";
//				//_traceNodes.box.style.top = (dragArea.top + dragArea.bottom) + "px";
//			}catch(e){
//				trace.error(e, "FF0000");
//			}
			
			addEvent2(document.body, dragMove, "mousemove");
			addEvent2(document.body, dragUp, "mouseup");
			
			var shadowArea = _getDragArea();

			setStyle(_traceNodes.shadow, "left", shadowArea.left + "px");
			setStyle(_traceNodes.shadow, "top", shadowArea.top + "px");
			setStyle(_traceNodes.shadow, "width", shadowArea.right + "px");
			setStyle(_traceNodes.shadow, "height", shadowArea.bottom + "px");
			//onselectstart
			setStyle(_traceNodes.box, "-moz-user-select", "none");
			stopEvent();
			
		};
		
		var dragMove = function (el){
			
			newMousePos = {
				x: dragNodePos[0] + (el.clientX - MousePos.x),
				y: dragNodePos[1] + (el.clientY - MousePos.y)
			};
			
//			$Debug("x: " + newMousePos.x + ", y: "+ newMousePos.y);
			
			if(newMousePos.x < dragArea.left + fixWelt) {
				newMousePos.x = dragArea.left;
				isWelt = 4;
				isMiddle = false;
			}
			else if(newMousePos.x > dragArea.left + dragArea.right - fixWelt) {
				newMousePos.x = dragArea.left + dragArea.right;
				isWelt = 2;
				isMiddle = false;
			}
			else {
				isMiddle = true;
			}
			if(newMousePos.y < dragArea.top + fixWelt) {
				newMousePos.y = dragArea.top;
				isWelt = 1;
			}
			else if(newMousePos.y > dragArea.top + dragArea.bottom - fixWelt) {
				newMousePos.y = dragArea.top + dragArea.bottom;
				isWelt = 3;
			}
			else if(isMiddle == true) {
				isWelt = 0;
			}
			setStyle(dragNode, "left", newMousePos.x + "px");
			setStyle(dragNode, "top", newMousePos.y + "px");
		};
		
		var dragUp = function (el){
			removeEvent2(document.body, dragMove, "mousemove");
			removeEvent2(document.body, dragUp, "mouseup");
			
			if (isWelt !== 0) {
				dragNodeInfo = _getDragNodeInfo();
				addEvent2(_traceNodes.shadow, dragHitTestMove, "mousemove");
//				$Debug("MouseOver");
			}
			else {
				// 为什么要设置成 -3000px ???
				setStyle(_traceNodes.shadow, "left", "-3000px");
				setStyle(_traceNodes.shadow, "top", "-3000px");
			}
			// 记住当前的 DEBUG 窗口相对位置 L.Ming
			var currentScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			var currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var nLeft = parseInt(getStyle(_traceNodes.box, "left")), nTop = parseInt(getStyle(_traceNodes.box, "top"));
			var relativePos = (nLeft - currentScrollLeft) + "," + (nTop - currentScrollTop);
			dragNode.relativePos = relativePos;
		};
		var dragHitTestMove = function (el) {
			try {
				var _dragArea;
				if(hitTest(dragNode, el) == false) {
					
					removeEvent2(_traceNodes.shadow, dragHitTestMove, "mousemove");
					hideTrace();
				}
			}
			catch(e) {trace.error(e);}
			finally {
				_dragArea = null;
			}
		};
		var hideTrace = function () {
					_dragArea = _getDragArea();
					setStyle(_traceNodes.shadow, "left", "-3000px");
					setStyle(_traceNodes.shadow, "top", "-3000px");
//					$Debug("MouseOut");
//					$Debug(isWelt);
/*
					switch (isWelt) {
						case 1:// top
							tween(dragMaskNode, "top", -dragNode.offsetHeight, .5, "strongEaseOut");
							tween(dragNode, ["height"], [0], .5, "strongEaseOut");
							break;
						case 3:// bottom
							tween(dragNode, ["top", "height"], [_dragArea.top + _dragArea.bottom, 0], .5, "strongEaseOut");
							break;
						case 4:// left
							tween(dragMaskNode, "left", -dragNode.offsetWidth, .5, "strongEaseOut");
							tween(dragNode, ["left", "width"], [_dragArea.left, 0], .5, "strongEaseOut");
							break;
						case 2:// right
							tween(dragNode, ["left", "width"], [_dragArea.left + _dragArea.right, 0], .5, "strongEaseOut");
							break;
					}
*/
		};
		var drag = {};
		/** 设定需要拖拽的对象 */
		drag.set = function (oDragNode, oMaskNode, oDragHandle, oDragBody) {
			if(oDragNode == null) return;
			
			dragNode = oDragNode;
			dragMaskNode = oMaskNode;
			dragNodeHandle = oDragHandle;
			dragNodeBody = oDragBody;
			
			addEvent2(dragNodeHandle, dragDown, "mousedown");
			/**
			 * 双击标题时隐藏和显示调试内容，只保留标题栏
			 * Modified by L.Ming | liming1@staff.sina.com.cn @2008-08-31
			 */
			addEvent2(dragNodeHandle, function () {
				var bTraceBodyVisible = (getStyle(dragNodeBody, "display") == "none");
				if(bTraceBodyVisible){
					setStyle(dragNode, "height", "400px");
					var nTop = document.documentElement.scrollTop || document.body.scrollTop;
					var currentTop = parseInt(getStyle(dragNode, "top"));
					var windowHeight = getPageSize()[3];
					// 如果 DEBUG 浮层展开后会被遮盖，则上移到可视位置
					if (nTop + windowHeight < currentTop + 400) {
						nTop += getPageSize()[3] - 400;
						setStyle(dragNode, "top", nTop + "px");
					}
					setStyle(dragMaskNode, "height", "400px");
					setStyle(dragNodeBody, "display", "block");
					
				}
				else{
					setStyle(dragNode, "height", "20px");
					setStyle(dragMaskNode, "height", "20px");
					setStyle(dragNodeBody, "display", "none");
				}
			}, "dblclick");
		};
		/** 释放拖拽的对象 */
		drag.release = function (oDragNode) {
			removeEvent2(dragNodeHandle, dragDown, "mousedown");
		};
		return drag;
	})();

	var outputCacheList = function () {
		var arr = [];
		var item;
		if (_trace.traceList != null) {
			if (_trace.traceList.length > 0) {
				arr[arr.length] = _getContent("┌--------------------------------------------------┐", {
					time: false,
					color: "#333"
				});
			}
			for (var i = 0; i < _trace.traceList.length; i++) {
				item = _trace.traceList[i];
				if (item[1].err == true) {
					arr[arr.length] = _getContent(_getErrorContent(item[0]), {
						color: "#F00"
					});
				}
				else {
					arr[arr.length] = _getContent(item[0], item[1]);
				}
			}
			if (_trace.traceList.length > 0) {
				arr[arr.length] = _getContent("└--------------------------------------------------┘", {
					time: false,
					color: "#333"
				});
			}
		}
		_bufferLineArr.splice(0, 0, arr.join(""));
		_trace.traceList = item = arr = null;
		_outputContent();
	};


	var _init = function () {
		if(_isInit == true) {
			return false;
		}
		_isInit = true;
		_trace.isLoad = true;
		_trace.error = _traceError;
		_trace.toString = function () {return "Trace 调试已开启";};
		_trace.init = _init;
		_trace.getPos = function () {return _trace.pos;};
		_trace.traceList = window.trace.traceList;
		window[funcName] = _trace;
		window.traceError = _traceError;

		// 创建样式表到head中
		addHTML(document.getElementsByTagName("head")[0], _traceStyle);

		// 创建trace窗体
		addHTML(document.body, _traceHTML.replace(/{TraceTpl}/g, "TraceBox_" + _rndID));

		_traceNodes = {
			box: _getTraceNode("box"),
			mask: _getTraceNode("mask"),
			title: _getTraceNode("title"),
			body: _getTraceNode("body"),
			content: _getTraceNode("content"),
			shadow: _getTraceNode("shadow")
		};

		/** trace窗体拖拽事件绑定 */
		_dragTrace.set(_traceNodes.box, _traceNodes.mask, _traceNodes.title, _traceNodes.body);

//		setStyle(_traceNodes.box, "width", "10px");
//		setStyle(_traceNodes.box, "height", "10px");
//		setStyle(_traceNodes.box, "opacity", 0);
//		tween(_traceNodes.box, ["left", "top", "opacity", "width", "height"], [500, 100, 1, 400, 400], 1, "strongEaseOut");

		// 输出缓存中的错误信息
		outputCacheList();
		/**
		 * 增加 trace 窗口的快捷键（Alt+~）打开及关闭
		 */
		function traceControl (bKey) {
			// 打开或者关闭 Debug
			if(typeof _traceNodes.box.relativePos == "undefined"){
				_traceNodes.box.relativePos = "0,0";
			}
			var currentL = parseInt(getStyle(_traceNodes.box, "left")), currentT = parseInt(getStyle(_traceNodes.box, "top"));
			var newPosLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			var newPosTop = document.documentElement.scrollTop || document.body.scrollTop;
			var pos = _traceNodes.box.relativePos.split(",");
			var posX = parseInt(pos[0]), posY = parseInt(pos[1]);
			if(currentL < 0 || currentT < 0 || currentL != (newPosLeft + posX) || currentT != (newPosTop + posY) || typeof bKey == "undefined"){
				newPosLeft = (newPosLeft + posX) + "px"; 
				newPosTop = (newPosTop + posY) + "px";
				setStyle(_traceNodes.box, "left", newPosLeft || "0px");
				setStyle(_traceNodes.box, "top", newPosTop || "0px");
			}
			else{
				setStyle(_traceNodes.box, "left", "-3000px");
				setStyle(_traceNodes.box, "top", "-3000px");
			}
			if (typeof _trace.timeout.isBusy != "undefined") {
				_trace.timeout.isBusy = false;
			}
		}
		addEvent2(document, function (evt){
			try{
				evt = _ie ? event : evt;
				if((_ie && evt.altKey || _moz && evt.altKey) && evt.keyCode == 192){
					traceControl(true);
				}
			}
			catch(e){}

		}, "keydown");
		// 监测页面滚动，如果超过 500 毫秒没有再移动，就重新定位 trace 浮层
		addEvent2(window, function (){
			try{
				var currentL = parseInt(getStyle(_traceNodes.box, "left")), currentT = parseInt(getStyle(_traceNodes.box, "top"));
				if(currentL >= 0 && currentT >= 0){
					var timer = setTimeout(function () {
						if(new Date().getTime() - _trace.timeout.currTime == 500){
							if(typeof _trace.timeout.isBusy == "undefined" || _trace.timeout.isBusy == false){
								traceControl();
								clearTimeout(timer);
								_trace.timeout.isBusy = true;
							}
						}
					}, 500);
					_trace.timeout = { "timer" : timer, "currTime" : new Date().getTime()};
				}
			}
			catch(e){
				$Debug(e.message);
			}

		}, "scroll");
	};
	// ------------------------------------------------------------------------------------------------------------------
	
	window[funcName].init = _init;
	if(_isInit == false) {
		addDOMLoadEvent(_init);
	}
})();