/**
 * @author Pjan
 * 获取事件鼠标位置下的dom
 * o {Event} 鼠标事件
 */

App.getEventDom = function(o){
	if(/msie/.test(navigator.userAgent.toLowerCase())){
		return o.srcElement;
	}else{
		var node=o.target;
		while(node.nodeType!=1){
			node=node.parentNode;
		}
		return node;
	}
};

/**
 * @author Pjan
 * 返回某一个对象是否是另外一个对象的子对象
 * child {DOM} 子对象
 * parent {DOM} 父对象
 */
App.isChildNode = function(child,parent){
	while(child){
		if(child==parent){
			return true;
		}
		if(child==document.body){
			return false;
		}
		child=child.parentNode
	}
};
