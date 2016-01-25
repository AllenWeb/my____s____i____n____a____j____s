/**
 * @id Core.Dom.trimNode
 * 去除空节点，只处理一级，并不递归处理
 * @param {Element} node 操作的节点
 * @return {Element} 去除空节点的node节点
 * @author xinlin 
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");

Core.Dom.trimNode = function(node){
	var cn = node.childNodes;
	for(var i = 0;i<cn.length;i++){
		if(cn[i].nodeType == 3)
			node.removeChild(cn[i]);
	}
	return node;
};
