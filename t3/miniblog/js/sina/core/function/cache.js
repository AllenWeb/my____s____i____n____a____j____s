/**
 * @id Core.Function.cache
 * @fileoverview
 * 缓存函数执行的结果
 */
$import("sina/core/function/_function.js");
$import("sina/core/function/bind2.js");
$import("sina/core/array/foreach.js");
/**
 * @for Core.Function.cache
 * 缓存函数执行的结果
 * @author stan | chaoliang@staff.sina.com.cn
 * @param {Function} func 需要被缓存执行结果的函数 
 * @return {Function} 返回一个缓存函数执行结果的函数
 * 暂不可以用作传递参数为Object的函数
   @example
	var cacheFunc = Core.Function.cache(function(t){
		alert("not cache");
		return t+1;
	});
	alert(cacheFunc(5));
	alert(cacheFunc(5));
	alert(cacheFunc(5));
	//返回
	//not cache
	//6
	//6
	//6
 */
Core.Function.cache = function (func){
	return function (){
		var o = func.__cache__ = func.__cache__ ? func.__cache__ : {};
		var key = Core.Array.foreach(arguments, function(v){
			return v;
		}).toString();
		return o[key] ? o[key] : o[key] = func.apply(func, arguments);
	};
};