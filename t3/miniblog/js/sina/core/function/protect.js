/**
 * @id Core.Function.protect
 * @fileoverview
 * 执行函数并忽略所有错误
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/core/function/_function.js");
/**
 * @for Core.Function.protect
 * @author xp
 * protect function from exception
 * 创建1个执行时忽略所有错误的函数
 * @param ｛Function} fFunc 执行的函数
 * @return 返回创建的忽略函数执行错误的函数
 * @example
	function test1 () {
		alert("Hello");
	}
	Core.Function.protect(test1)();
 */
Core.Function.protect = function (fFunc){
	var name = fFunc.toString().match(/function[\s\t]+([^\(\s\t]*)/)[1];
	var func = function (){
		try{
			fFunc();
		}
		catch (e) {
			$Debug(name + "occurs an error : " + e);
		}
	};
	return func;
};