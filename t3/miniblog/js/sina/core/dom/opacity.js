$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * 改变一个元素的透明度
 * @id Core.Dom.opacity
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Object} elm 元素id或引用
 * @param {Object} value 透明度值(0～100)
 * @global $opacity
 */
Core.Dom.opacity = function(elm, value){
	elm = $E(elm);
	elm.style.filter = 'alpha(opacity=' + value + ')';
	elm.style.opacity = value/100;
};