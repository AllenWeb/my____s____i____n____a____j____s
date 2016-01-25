$import("sina/core/function/_function.js");

/**
 * @id Core.Function.asCall
 * @author xp
 * Create a delegation to this function.
 * 创建1个指定参数的函数包装，被调用时的第1个参数将作为this指针（prototype.bind必须指定this）
 * @param {Function} fFunc 需要被执行的函数
 * @return {Function} 函数执行包装函数
 * @example
	function test1(sName){
		alert("Hi, " + sName);
	}
	Core.Function.asCall(test1, "Sina")();
 */
Core.Function.asCall = function (fFunc){
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
	var func = fFunc;
	var args = $A(arguments);
	args.shift();
	return function (t){
		return func.apply(t, args);
	};
};