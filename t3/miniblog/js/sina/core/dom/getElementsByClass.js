$import("sina/core/dom/_dom.js");
/**
 * get elements Array by tag name & class name
 * 按照 tag name 和 classname 查找指定节点下的节点。
 * prototype替代品
 * @id Core.Dom.getElementsByClass 
 * @param {Element} el  root element from where to find elements
 * @param {String}  tg  tagName
 * @param {String}  clz class name to match elements
 *
 * @return {Array} of Element
 */
Core.Dom.getElementsByClass = function(el, tg, clz){
	el = el || document;
	var rs = [];
	clz = " " + clz +" ";
	var cldr = el.getElementsByTagName(tg), len = cldr.length;
	for (var i = 0; i < len; ++ i){
		var o = cldr[i];
		if (o.nodeType == 1){
			var ecl = " " + o.className + " ";
			if (ecl.indexOf(clz) != -1){
				rs[rs.length] = o;
			}
		}
	}
	return rs;
};

Core.Dom.byClz = Core.Dom.getElementsByClass;