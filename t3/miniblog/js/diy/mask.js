/**
 * @author xinlin
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/dom/opacity.js');

/**
 * 设置mask，使页面可见但不可操作
 * @param {String} id  目标区域的id   ref 节点的id ，要遮罩的对象
 * @param {Dom Element} block  如果页面中存在已有的遮罩层
 * @param {z} zIndex
 */
App.Mask = function(id,block,z){
	if(block){
		this._mask = $E(block);
		this._iframe = this._mask.firstChild;
	}else{
		this._mask = document.getElementsByTagName("BODY")[0].appendChild($C("div"));
		this._iframe = this._mask.appendChild($C("iframe"));
		Core.Dom.opacity(this._iframe,0);
		Core.Dom.opacity(this._mask,30);
	}
	var node = $E(id);
	this._ref = node;
	
	
	with (this._mask.style) {
		position = "absolute";
		zIndex = z?z:1;
		backgroundColor = '#aaa';
		overflow = 'hidden';
	}
	this.resize();
	var self = this;
	this._resizeAction = function(){
		self.resize();
	}
	Core.Events.addEvent(window,this._resizeAction,'resize');
}

App.Mask.prototype = {
	show: function(){},
	close:function(){
		Core.Events.addEvent(window,this._resizeAction,'resize');
		this._resizeAction = null;
		this._mask.parentNode.removeChild(this._mask);
		this._mask =  null;
		this._iframe = null;
		this._ref = null;
	},
	resize:function(){
		//this._mask.style['height'] = '0px';
		var xy = Core.Dom.getXY(this._ref);
		var w = this._ref.offsetWidth;
		var h = this._ref.offsetHeight;
		if(w < 950 && this._ref.tagName == "BODY") w = 950;
		with(this._mask.style){
			left = xy[0] + "px";
			top = xy[1] + "px";
			width = w+"px";
			height = h + "px";
		}
		with(this._iframe.style){
			width = "100%";
			height = "100%";
		}
	}
}
