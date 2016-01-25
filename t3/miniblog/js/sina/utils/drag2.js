$import("sina/utils/utils.js");
Utils.Drag2 = {
	init : function (_root, _handle) {
		var o = this;
		var blk = _root;
		blk.hdl = _handle;
		if(typeof blk.hdl == 'undefined' ||  typeof _handle == undefined) blk.hdl = blk;
		blk.hdl.onmousedown = start;
		blk.onDragStart = new Function();
		blk.onDrag = new Function();
		blk.onDragEnd = new Function();
		function start (e) {
			e = e || event;
			var src = e.target || e.srcElement;
			if (src.tagName.toUpperCase() == "A" || src.parentNode.tagName.toUpperCase() == "A") return;
			var o = Utils.Drag2;
			v = blk;
			v.onDragStart();
			v.oX = o.getX(e);
			v.oY = o.getY(e);
			v.depth = v.style.zIndex;
			v.style.zIndex = 1000000;
			v.rL = parseInt(v.style.left ? v.style.left : 0);
			v.rT = parseInt(v.style.top ? v.style.top : 0);
			document.onmousemove = drag;
			document.onmouseup = end;
			return false;
		};
		function drag (e) {
			var o = Utils.Drag2; 
			var v = blk;
			var nX = o.getX(e);
			var nY = o.getY(e);
			var ll = v.rL + nX - v.oX;
			var tt = v.rT + nY - v.oY;
			v.style.left = ll + 'px';
			v.style.top  = tt + 'px';
			v.onDrag(ll, tt);
			return false;
		};
		function end () {
			v.style.zIndex = v.depth ;
			document.onmousemove	= null;
			document.onmouseup	= null;
			v.onDragEnd();
		};
	},
	fixE : function (e) {
		if (typeof e == 'undefined') e = window.event;
		if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
		return e;
	},
	getX : function (e){ 
		return this.fixE(e).clientX; 
	},
	getY : function (e){ 
		return this.fixE(e).clientY; 
	}	
};