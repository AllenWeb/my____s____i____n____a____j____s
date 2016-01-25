$import("sina/core/dom/_dom.js");
/**
 * @id Core.Dom.execInNodes 
 * 根据节点类型取出所有节点，依次执行fun1
 * @param {String} nodeType
 * @param {Function} fun1
 * @author dongguang
 */
Core.Dom.execInNodes = function(nodeType, fun1){
	var eles = document.getElementsByTagName(nodeType);
	for(var i = 0; i < eles.length ; i ++){
		fun1(eles[i]);
	}
};