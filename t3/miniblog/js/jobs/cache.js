/**
 * @author peijian@staff.sina.com.cn
 * 用于未登录页面缓存登录后的数据
 */
$import("sina.sina");
$import("sina.jobs");
$import("sina.app");


/**
 * 未登录的时候cache数据
*/
$registJob('unlogin_cache',function(){
	//
	// var startCache = function(){
		// var _imgcache = '';
		// var _container = $C('div');
		// var _css = 'height:1px;width:1px;overflow:hidden;line-height:0';
		// _container.style.cssText = _css;
		// _container.innerHTML = _imgcache;
		// document.body.appendChild(_container);
	// };
	
	// setTimeout(startCache, 500);
});