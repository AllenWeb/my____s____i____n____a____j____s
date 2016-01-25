$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/base/detect.js");
/**
* 获取指定节点的样式
* @id Core.Dom.getStyle
* @method getStyle
* @param {HTMLElement | Document} el 节点对象
* @param {String} property 样式名
* @return {String} 指定样式的值
* @author FlashSoft | fangchao@staff.sina.com.cn
* @update 08.02.23
* @global $getStyle
* @exception
* 			Core.Dom.getStyle(document.body, "left");
* 			$getStyle(document.body, "left");
*/ 
Core.Dom.getStyle = function (el, property) {
	switch (property) {
		// 透明度
		case "opacity":
			var val = 100;
			try {
					val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
			}
			catch(e) {
				try {
					val = el.filters('alpha').opacity;
				}catch(e){}
			}
			return val/100;
		 // 浮动
		 case "float":
			 property = "styleFloat";
		 default:
			 var value = el.currentStyle ? el.currentStyle[property] : null;
			 return ( el.style[property] || value );
	}
};
if(!Core.Base.detect.$IE) {
	Core.Dom.getStyle = function (el, property) {
		// 浮动
		if(property == "float") {
			property = "cssFloat";
		}
		// 获取集合
		try{
			var computed = document.defaultView.getComputedStyle(el, "");
		}
		catch(e) {
			traceError(e);
		}
		return el.style[property] || computed ? computed[property] : null;
	};
}