/**
 * 移除所有子节点
 * @author liusong@staff.sina.com.cn
 */

$import("sina/app.js");

App.removeChildren = function(parent){
	var n;
	while(n = parent.firstChild){
		parent.removeChild(n);
	}
};
