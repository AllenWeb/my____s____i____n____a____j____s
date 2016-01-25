/**
 * @id Core.Function.tryIt
 * @fileoverview
 * 执行函数并忽略所有错误
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/core/function/_function.js");
/**
 * 执行函数并忽略所有错误
 * @for Core.Function.tryIt
 * @author xp
 * @ param ｛Function} fFunc 需要执行的函数
 * Invoke function & ignore all error
 * @example
	function test1 () {
		alert("Hello");
	}
	Core.Function.tryIt(test1);
 */
Core.Function.tryIt = function (fFunc){
	try{
		fFunc();
	}
	catch (e){
		$Debug(e.message);
	}
};