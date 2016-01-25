$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/function/bind3.js");

/**
 * 动画类
 * @author FlashSoft | fangchao@staff.sina.com.cn
 *		   liusong | liusong@staff.sina.com.cn
 * @update 2009.03.25
 */

(function(){

	var transitions = {
		simple: function(time, startValue, changeValue, duration){
			return changeValue * time / duration + startValue;
			
		},
		backEaseIn: function(t, b, c, d){
			var s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
			
		},
		backEaseOut: function(t, b, c, d, a, p){
			var s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backEaseInOut: function(t, b, c, d, a, p){
			var s = 1.70158;
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		bounceEaseOut: function(t, b, c, d){
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			}
			else 
				if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				}
				else 
					if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
					}
					else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
					}
		},
		bounceEaseIn: function(t, b, c, d){
			return c - transitions.bounceEaseOut(d - t, 0, c, d) + b;
		},
		bounceEaseInOut: function(t, b, c, d){
			if (t < d / 2) {
				return transitions.bounceEaseIn(t * 2, 0, c, d) * .5 + b;
			}
			else {
				return transitions.bounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
			}
			
		},
		strongEaseInOut: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		regularEaseIn: function(t, b, c, d){
			return c * (t /= d) * t + b;
		},
		regularEaseOut: function(t, b, c, d){
			return -c * (t /= d) * (t - 2) + b;
		},
		regularEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		strongEaseIn: function(t, b, c, d){
			return c * (t /= d) * t * t * t * t + b;
		},
		strongEaseOut: function(t, b, c, d){
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		strongEaseInOut: function(t, b, c, d){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		elasticEaseIn: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * .3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		elasticEaseOut: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * .3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			
		},
		elasticEaseInOut: function(t, b, c, d, a, p){
			if (t == 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				var p = d * (.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				var a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		}
		
	};
	/**
	 * 返回一个随机ID
	 * @param {HTMLNode} oNode
	 * @return {String}
	 */
	var getUniqueID = function (oNode) {
		return oNode.uniqueID;
	};
	if(!$IE) {
		getUniqueID = function (oNode) {
			try {
				var rnd_ID;
				if(oNode.getAttribute("uniqueID") == null) {
					rnd_ID = "moz__id" + parseInt(Math.random() * 100) + "_" + new Date().getTime();
					oNode.setAttribute("uniqueID", rnd_ID);
					return rnd_ID;
				}
				return oNode.getAttribute("uniqueID");
			}
			finally {
				rnd_ID = null;
			}
		};
	}
	/**
	 * 返回对象的真正类型
	 * @param {Object} oObject
	 * @return {String}
	 */
	function getType (oObject) {
		try {
			var s = oObject.constructor.toString().toLowerCase();
			return s.slice(s.indexOf("function") + 9, s.indexOf("()"));
		}
		finally {
			s = null;
		}
	}
	/**
	 * 获取动画对象的起始值
	 * @param {Object} oNode 动画对象
	 * @param {Array} aProperty 要取的参数数组
	 * @return {Array} 对象初始值的数组
	 */
	function getStartValue (oNode, aProperty) {
		var i, _len, _arr = [];
		_len = aProperty.length;
		for(i = 0; i < _len; i ++ ) {
			_arr[_arr.length] = parseFloat(Core.Dom.getStyle(oNode, aProperty[i]));
		}
		return _arr;
	}
	/**
	 * 格式化传入参数
	 * @param {Array | String} oProperty 格式化前的参数
	 * @return {Array} 格式化后的参数
	 */
	function formatProperty (oProperty) {
		return getType(oProperty) != "array"? [oProperty]: oProperty;
	}
	/**
	 * 格式化目标值的数组
	 * @param {Array | String} oEndingValue 目标值
	 * @param {Array} aProperty 动画对象的参数数组
	 */
	function formatValue (oEndingValue, aProperty) {
		try {
			var _type = getType(oEndingValue);
			var _valuearray = [], _suffixarray = [], i, _len, _suffix;
			if(_type != "array") {
				_suffix = getSuffix(oEndingValue);
				_suffix[1] = aProperty == "opacity"? "": _suffix[1];
				_valuearray = [_suffix[0]];
				_suffixarray = [_suffix[1]];
			}
			else {
				_len = oEndingValue.length;
				for(i = 0; i < _len; i ++ ) {
					_suffix = getSuffix(oEndingValue[i]);
					_suffix[1] = aProperty[i] == "opacity"? "": _suffix[1];
					_valuearray[_valuearray.length] = _suffix[0];
					_suffixarray[_suffixarray.length] = _suffix[1];
				}
			}
			return [_valuearray, _suffixarray];
		}
		finally {
			_type = _valuearray = _suffixarray = i = _len = _suffix = null;
		}
	}
	/**
	 * 分析执行的单位并返回
	 * @param {String} sValue
	 * @return {Array} 数值跟单位
	 */
	function getSuffix (sValue) {
		try {
			var charCase = /(-?\d.?\d*)([a-z%]*)/i.exec(sValue);
			return [charCase[1], charCase[2]? charCase[2]: "px"];
		}
		finally {
			charCase = null;
		}
	}
	
	var runList = {};
	var saveList = {};
	
	function getInstance (oNode) {
		try {
			var uID = getUniqueID(oNode);
			var runFunc;
			if(runList[uID] != true) {
				runFunc = new ancestor();
				saveList[uID] = {
					node: oNode,
					func: runFunc
				};
				runList[uID] = true;
				return runFunc
			}
			else {
				return saveList[uID].func;
			}
		}
		finally {
			uID = runFunc = null;
		}
	}
	/**
	 * Tween类的类
	 */
	function ancestor () {
		this._timer = null;
	}
	/**
	 * Tween类的Start方法
	 * @param {Object} oNode 需要动画的对象
	 * @param {Array | String} oProperty 要操作的参数
	 * @param {Array | String} oEndingValue 目标值
	 * @param {Number} nSeconds 耗时
	 * @param {String} sAnimation 动画类型
	 * @param {Object} oFunc 回调函数
	 */
	ancestor.prototype.start = function (oNode, oProperty, oEndingValue, nSeconds, sAnimation , oFunc) {
		this.reset();
		oFunc = oFunc || {};
		if(oFunc.end) {
			this._func.end = oFunc.end;
		}
		
		if(oFunc.tween) {
			this._func.tween = oFunc.tween;
		}
	
		var _propertyArr = formatProperty(oProperty);
		var _startValueArr = getStartValue(oNode, _propertyArr);
		var _endValueArr = formatValue(oEndingValue, _propertyArr);

		this._node = oNode;
		this._property = _propertyArr;
		this._endingvalue = _endValueArr[0];
		this._suffixvalue = _endValueArr[1];
		this._startvalue = _startValueArr;

		this._end = false;

		this._fps = 0;

		if(nSeconds != null) {
			this._seconds = nSeconds;
		}
		if(transitions[sAnimation] != null) {
			this._animation = transitions[sAnimation];
		}

		this._starttime = new Date().getTime();
		this._timer = setInterval(Core.Function.bind3(this.play, this), 10);

	};
	/**
	 * Tween类的paly方法
	 */
	ancestor.prototype.play = function () {
		var nTime = (new Date().getTime() - this._starttime) / 1000;
		var i, ani, _len = this._property.length;
		if(nTime > this._seconds) {
			nTime = this._seconds;
		}
		for(i = 0; i < _len; i ++ ) {
			ani = this._animation(nTime, this._startvalue[i], this._endingvalue[i] - this._startvalue[i], this._seconds);
			Core.Dom.setStyle(this._node, this._property[i], ani + this._suffixvalue[i]);
		}
		this._fps ++;
		this._func.tween();
		if(nTime == this._seconds) {
			this.stop();
		}
	};
	/**
	 * Tween类的stop方法
	 */
	ancestor.prototype.stop = function () {
		clearInterval(this._timer);
		this._end = true;
		this._func.end();
	};
	/**
	 * Tween类的复位方法
	 */
	ancestor.prototype.reset = function () {
		
		clearInterval(this._timer);

		this._end = false;

		/** 必选参数 */
		this._node = null;
		this._property = [];
		this._startvalue = [];
		this._endingvalue = [];
		this._suffixvalue = [];

		this._fps = 0;

		/** 非必选参数 */
		this._seconds = .5;
		this._animation = transitions.simple;

		this._func = {
			end: function () {},
			tween: function () {}
		};
	};
	/**
	 * 对Tween类的静态封装,方便调用
	 * @param {Object} oNode 需要动画的对象
	 * @param {Array | String} oProperty 要操作的参数
	 * @param {Array | String} oEndingValue 目标值
	 * @param {Number} nSeconds 耗时
	 * @param {String} sAnimation 动画类型
	 * @param {Object} oFunc 回调函数
	 */
	function tween (oNode, oProperty, oEndingValue, nSeconds, sAnimation , oFunc) {
		var instance = getInstance(oNode);
		instance.start.apply(instance, arguments);
	}
	/**
	 * 静态封装的stop方法
	 * @param {Object} oNode
	 */
	tween.stop = function (oNode) {
		getInstance(oNode).stop();
	};
	/**
	 * 静态封装的isTween方法,判断动画是否结束
	 * @param {Object} oNode
	 */
	tween.isTween = function (oNode) {
		return !getInstance(oNode)._end;
	};
	
	App.tween = tween;

})();