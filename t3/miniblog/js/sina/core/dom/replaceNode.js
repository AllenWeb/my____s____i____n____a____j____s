/**
 * @id Core.Dom.replaceNode
 * @fileoverview
 *	取得光标所在位置
 * @param {Object|String} oNewNode 	新节点
 * @param {Object} oOriginal 需要被替换的节点
 * @example
	Core.Dom.replaceNode(node1, node2); 	
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-18
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
Core.Dom.replaceNode = function (oNewNode, oOriginal) {
	if(oNewNode == null || oOriginal == null){
		return false;
	}
	oNewNode = $E(oNewNode);
	oOriginal = $E(oOriginal);
	oOriginal.parentNode.replaceChild(oNewNode, oOriginal); 
};