/**
 * @id Core.Function.times
 * @fileoverview
 * 延迟函数执行
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-02
 */
$import("sina/core/function/_function.js");
/**
 * @author xp
 * @for Core.Function.times
 * Invoke this function several time
 * 重复执行1个函数多次
 * @param {Function} fFunc 执行函数
 * @param {Number} n 执行次数
 */
Core.Function.times = function (fFunc, n){
	for (var i = 0;i < n; i ++){
		fFunc();
	}
};