/**
 * 通过节点的属性查找节点
 * @id Core.Dom.getElementsByAttr 
 * @param {Element} node 查找的最上层元素
 * @param {String} attname 属性名
 * @param {String} attvalue 属性值
 * @param {Array} 符合查找规范的所有元素的数组
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 
 * get the node with attribute = value
 * @ example
 * Core.Dom.getElementsByAttr($E("aa"),"title","missyou");
 *
 */
$import("sina/core/dom/_dom.js");

Core.Dom.getElementsByAttr = function(node, attname, attvalue){
		var nodes = [];
		for(var i = 0, l = node.childNodes.length; i < l; i ++){
			if(node.childNodes[i].nodeType == 1){
				if(node.childNodes[i].getAttribute(attname) == attvalue){
					nodes.push(node.childNodes[i]);
				}
				if(node.childNodes[i].childNodes.length > 0){
					nodes = nodes.concat(arguments.callee.call(null, node.childNodes[i], attname, attvalue));
				}
			}
		}
		return nodes;
	};
