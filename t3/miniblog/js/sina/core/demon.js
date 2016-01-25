$import("sina/core/core.js");
// 定时执行队列任务类 //
Core.Daemon = {
	"_queues": [],// 任务队列
	"_interval": 20,// 任务执行间隔
	"_handler": null,// 定时器句柄
	"_run": function Daemon__run() {// 执行队列中的任务
		for (var i = 0; i < Core.Daemon._queues.length; i++ ) {
			Core.Daemon._queues[i].Update();
		}
	},
	"Drive": function(obj) {// 添加任务到队列
		if (!obj.Update) {
			return this;
		}
		for (var i = 0; i < this._queues.length; i++) {
			if (obj == this._queues[i]) {
				return this;
			}
		}
		this._queues.push(obj);
		return this;
	},
	"SetDuration": function(time) {// 设定任务执行间隔
		time = window.parseInt(time);
		if (10 > time) {
			return this;
		}
		this._interval = time;
		return this;
	},
	"GetDuration": function() {// 获取任务执行间隔
		return this._interval;
	},
	"Start": function() {// 开始执行任务队列
		if (this._handler) {
			return this;
		}
		this._handler = window.setInterval(this._run, this._interval);
		return this;
	},
	"Stop": function() {// 停止队列任务的执行,但是不参数队列中的任务
		if (!this._handler) {
			return this;
		}
		window.clearInterval(this._handler);
		this._handler = null;
		return this;
	},
	"Clear": function () {// 停止队列任务的执行,并移除任务
		this._queues = [];
		this.Stop();
	}
};
// 实现Animation的逻辑类 //
Core.AnimationServer = {
	"_index": [],// 以数字为Key的数组, 便于以后减少使用For in的操作
	"_animations": {},// 以对象ID为Key的哈希数组,便于用ID定位移除
	"_animationItem": null,// 执行操作的对象,临时用
	"_clear": function () {// 清洁_index索引
		for(i = this._index.length; i > -1; i -- ) {
			if(this._index[i] == null) {
				this._index.splice(i, 1);
			}
		}
	},
	"Animate": function(obj, target, value, time, callback) {// 添加Animation行为
		if (this.IsInAnimation(obj)) {// 排重
			return;
		}
		var obj2 = new AnimationObject(obj, target, value, time, callback);
		this._animations[obj.getAttribute("id")] = obj2;
		this._index.push(obj.getAttribute("id"));
	},
	"StopAnimate": function(obj) {// 停止执行Animation行为
		for(var i = 0; i < this._index.length; i ++ ) {
			if (this._index[i] == obj.getAttribute("id")) {
				delete this._animations[this._index[i]];
				this._index[i] = null;
				break;
			}
		}
		this._clear();
	},
	"IsInAnimation": function(obj) {// 返回Animation行为是否在持续
		var sID = obj.getAttribute("id");
		if (!sID) {
			obj.setAttribute("id", "ani_" + Math.random().toString().substr(2, 8));
			return false;
		}
		return !!this._animations[sID];
	},
	"Update": function() {// 对Daemon类的专用方法, 使用Daemon类的都必须实现Update方法
		for(var i = 0; i < this._index.length; i++ ) {
			this._animationItem = this._animations[this._index[i]];
			if (this._animationItem.TransformationEnd()) {// 判断Animation行为是否全部结束
				delete this._animations[this._index[i]];
				this._index[i] = null;
				this._animationItem.CallBack();// Animation行为结束后回调
				this._animationItem = null;
			}
		}
		this._clear();
	},
	"Clear": function () {
		this._animations = {};
		this._index = [];
		this._animationItem = null;
	}
};
// 渲染Animation操作的具体执行类 //
function AnimationObject(obj, target, value, time, callback) {
	this._obj = obj;

	this._time = time;
	this._callback = callback;

	this._cfg = [];

	// type:    需要执行的css的属性值
	// target:  传递进来的需要达到的目标参数
	// current: 获取对象初始值
	// render:  更新对象的方法
	// speed:   单位步长

	this._special = {// 不遵循标准的
		"opacity": {"current": obj.filters ? _getOpacityIE : _getOpacityMOZ, "render": obj.filters ? _setOpacityIE : _setOpacityMOZ},
		"padding-left": {"current": _getStyle, "render": _setStyle, "fix": "paddingLeft"},
		"padding-top": {"current": _getStyle, "render": _setStyle, "fix": "paddingTop"}
	};

	this._createCFG = function (target) {// 产生配置
		var cfg = null;
		var cfgArr = [];
		for(var i = 0; i < target.length; i ++ ) {
			cfg = {"target": value[i]};
			if(this._special[target[i]]) {// 需特殊处理的
				cfg["current"] = this._special[target[i]]["current"](this._special[target[i]]["fix"]);
				cfg["render"] = this._special[target[i]]["render"];
				cfg["speed"] = _getSpeed(cfg["target"], cfg["current"], time);
				cfg["type"] = this._special[target[i]]["fix"];
			}
			else {
				cfg["current"] = _getStyle(target[i]);
				cfg["render"] = _setStyle;
				cfg["speed"] = _getSpeed(cfg["target"], cfg["current"], time);
				cfg["type"] = target[i];
			}
			cfgArr.push(cfg);
		}
		return cfgArr;
	};
	this._cfg = this._createCFG(target);

	this.TransformationEnd = function () {// 执行操作并返回是否结束
		var bDone = true;
		var cfg = this._cfg;

		for(var i = 0; i < this._cfg.length; i ++ ) {
			cfg[i]["current"] += cfg[i]["speed"];
			if (this._GetDirection(cfg[i]["current"], cfg[i]["target"], cfg[i]["speed"])) {// 如果结束
				cfg[i]["current"] = cfg[i]["target"];
			}
			else {
				bDone = false;
			}
			cfg[i]["render"](cfg[i]["type"], cfg[i]["current"]);
		}
		
		return bDone;
	};
	this.CallBack = function () {// 动画结束后的回调
		if(this._callback) {
			this._callback();
			this._callback = null;
		}
	};
	this._GetDirection = function (_current, _target, _speed) {// 判断正向运动还是反向运动
		return _speed > 0 ? _current >= _target : _current <= _target;
	};
	function _getStyle (type) {// 获取Style
		return parseInt(obj.style[type]);
	}
	function _setStyle (type, val) {// 更新Style
		obj.style[type] = parseInt(val) + "px";
	}

	function _getOpacityIE() {// 获取Alpha值
		return parseFloat(parseInt(obj.filters.alpha.opacity) / 100);
	}
	function _getOpacityMOZ() {
		return parseFloat(obj.style.opacity);
	}

	function _setOpacityIE(type, val) {// 设定Alpha值
		obj.filters.alpha.opacity = parseInt(val*100);
	}
	function _setOpacityMOZ(type, val) {
		obj.style.opacity = parseFloat(val);
	}

	function _getSpeed(nTarget, nCurrent, nTime) {// 返回步长
		return (nTarget - nCurrent) * Core.Daemon.GetDuration() / nTime;
	}

}