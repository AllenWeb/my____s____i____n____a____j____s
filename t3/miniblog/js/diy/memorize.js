/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @能根据参数保存执行结果的函数.
 * @memorize	: 接受两个参数，第一个是函数名，第二个是执行所要绑定的对象，默认在window上。返回一个可以根据参数记忆执行结果的函数。
 * @regMemorize	: 接受两个参数，第一个是函数名，第二个是执行所要绑定的对象，默认在window上。函数将memorize返回的函数直接赋给原函数。
 * @目前只支持参数为数字和字母的函数，参数中可能存在对象的函数请慎用。
 * @现在记忆是永久的，如果需要中间有变化的同学请慎用。后续会加上记忆的过期时间。
 */
$import("sina/sina.js");
$import("sina/app.js");

(function(proxy){
	proxy.memorize = function(k, obj){
		var obj = obj || window;
        var fun = obj[k];
        var cache = {};
		return function(){
			var key = Array.prototype.join.call(arguments, '_');
			if (!(key in cache)){
				cache[key] = fun.apply(obj, arguments);
			}
			return cache[key];
		};
	};
	proxy.regMemorize = function(k,obj){
		obj[key] = proxy.memorize(k,obj);
	};
})(App);