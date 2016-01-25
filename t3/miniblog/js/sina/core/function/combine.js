/**
 * @id Core.Function.combine
 * @fileoverview
 * 链接多个函数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-02
 */
$import("sina/core/function/_function.js");
$import("sina/core/array/each.js");
/**
 * @for Core.Function.combine
 * @author xp
 * Combine this function with other functions
 * 链接多个函数，创建一个将多个函数放在一起执行的函数
 * @param {Functions} fFunc 需要链接起来执行的函数们
 * @return {Function} 包含多个函数执行的函数
 * @example
	function test1(){
		alert("Sina");
	}
	function test2(){
		alert("Ria");
	}
	Core.Function.combine(test1, test2)();
 */
Core.Function.combine = function (fFunc){
	var $A = function(iterable) {
		if (!iterable) {
			return [];
		}
		var results = [];
		for (var i = 0, len = iterable.length; i < len; i ++) {
			results.push(iterable[i]);
		}
		return results;
	};
	/**
	 * @author xp
	 * Combine functions to one
	 *  链接多个函数
	 */
	var $combine = function (){
		var funcArray = $A(arguments);
		return function (){
			var args = arguments;
			Core.Array.foreach(funcArray, function (f){
				f.apply(this,args);
			});
		};
	};
	var param = $A(arguments);
	param.shift();
	return $combine.apply(null, [fFunc].concat(param));
};

