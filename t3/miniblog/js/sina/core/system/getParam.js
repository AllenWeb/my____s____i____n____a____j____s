/**
 * @id Core.System.getParam
 * 取得页面中地址栏里的get参数
 * @param {String} name  参数名
 * @return {String} 参数值
 * @global $getParam
 * @example
 * 		//http://blog.sina.com.cn/u/1350167855?test1=111&test2=222&test4=333
 * 		$Debug(Core.System.getParam("test2"))		//222
 */
Core.System.getParam = function(name) {
  var arr = window.location.search.match(new RegExp("(\\?|&)"+name+"=([^&]*)(&|$)"));
  if(arr != null) return unescape(arr[2]); return null;
};