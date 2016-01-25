/**
 * @id Core.Dom.getElementByClassAttr
 * @param {Element} el 查找的顶层元素
 * @param {String} clz  className和节点属性名和值
 * @return {Element} 返回el中节点的属性值及className与clz中对应的节点 
 */
$import("sina/core/dom/_dom.js");
$import("sina/core/dom/getChildrenByClass.js");
//stan
//byid("someNode").getElementByClassAttr("test[name=div]");
Core.Dom.getElementByClassAttr = function(el, clz){
	var clazz, attr, value;
	clz.replace(/(\w+)\[(\w+)\=(\w+)\]/g, function (a0, b1, b2, b3){
		clazz = b1;
		attr  = b2;
		value = b3;
	});
	//$Debug("Element clazz=" + clazz + " && " + attr + "=" + value);  
	var Elements = Core.Dom.getChildrenByClass(el, clazz);
	var len = Elements.length;
	//$Debug(len);
	for(var i = 0; i < len; i ++){
		if(Elements[i].getAttribute(attr) == value){
			return Elements[i];
		}
	}
	return null;
};