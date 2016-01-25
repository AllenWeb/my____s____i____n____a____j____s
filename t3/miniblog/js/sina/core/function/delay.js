/**
 * @id Core.Function.delay
 * @fileoverview
 * 延迟函数执行
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-02
 */
$import("sina/core/function/_function.js");
/**
 * @for Core.Function.delay
 * @author xp
 * Delay a function's execution.
 * 延迟函数执行
 * @param {Function} fFunc 被延时的函数
 * @param {Number} time time to delay in ms.
 * @example
	function test1(){
		alert("Sina");
	}
	Core.Function.delayed(test1, 1000);
 */
Core.Function.delay = function (fFunc, time){
  time = time || 10;
  window.setTimeout(fFunc, time);
};