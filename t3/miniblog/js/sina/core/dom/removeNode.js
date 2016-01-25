$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @id Core.Dom.removeNode
 * 删除指定节点对象
 * @method Core.Dom.removeNode
 * @param {String | HTMLElement} node 被删除的对象ID或者对象本身
 * @author Stan | chaoliang@staff.sina.com.cn 
 *         FlashSoft | fangchao@staff.sina.com
 * @update 08.02.23
 * @global $removeNode
 * @see Sina.js
 * @exception
 * 			Core.Dom..removeNode("input1");
 * 			Core.Dom..removeNode(inputNode);
 * 			$removeNode("input1");
 */
Core.Dom.removeNode = function(node){
	node = $E(node) || node;
	try{
		node.parentNode.removeChild(node);
	}
	catch(e){}
};