/**
 * @id Core.Function.bind2
 * @fileoverview
 * 简化版的 prototype 的 bind 处理对象绑定的函数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/core/function/_function.js");
/**
 * @for Core.Function.bind2
 * @author prototype1.3
 * 简化版的 prototype 的 bind，名称沿用原来的 bind2
 * @param {Object} 需要被绑定的函数
 * @param {Object} 被绑定的对象
 * @example
	var obj = {
		value : "Sina",
		testFunction : function () {
			setTimeout(Core.Function.bind2(function() {
				alert(this.value);
			}, this), 3000);
		}
	};
	obj.testFunction(); 
 */
Core.Function.bind2 = function(fFunc, object) { 
	var __method = fFunc; 
	return function() { 
		return __method.apply(object, arguments); 
	};
};
/**
 * 保留原型扩展
 * stan | chaoliang@staff.sina.com.cn
 * @param {Object} object
 */
Function.prototype.bind2 = function(object) { 
	var __method = this; 
	return function() { 
	   return __method.apply(object, arguments); 
	};
};