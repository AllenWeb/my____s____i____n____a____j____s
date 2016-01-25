$import("sina/core/dom/_dom.js");
$import("sina/core/base/detect.js");
/**
 * @id Core.Dom.setStyle
* <pre>
* 设定指定节点的样式
* </pre>
* @method setStyle
* @param {HTMLElement | Document} el 节点对象
* @param {String} property 样式名
* @param {String} val 样式值
* @author FlashSoft | fangchao@staff.sina.com.cn
* @update 08.02.23
* @global $setStyle
* @exception
* 			Core.Dom.setStyle(document.body, "backgroundColor", "red");
* 			$setStyle(document.body, "opacity", "0.2");
*/
Core.Dom.setStyle = function (el, property, val) {
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
if(!Core.Base.detect.$IE) {
	Core.Dom.setStyle = function(el, property, val) {
		if (property == "float") {
			property = "cssFloat";
		}
		el.style[property] = val;
	};
}