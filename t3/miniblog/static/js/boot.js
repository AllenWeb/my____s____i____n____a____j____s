/**
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
(function() {
	/**
	 * 开关调试模式, 调试工具使用 (ctrl + ~) 调出
	 */
	var __debug_mode = true;
	/**
	 * 线上模式和开发模式的切换开关
	 */
	var __online_mode = false;
	
	/**
	 * JS发布的基础路径, 包括开发模式下的bind工具
	 */
	var __base_url = 'http://js.wcdn.cn/t3';
	
	var __product = $CONFIG.$product;
	
	var __pageid = $CONFIG.$pageid;
	
	
	if ($CONFIG) {
		//默认中文
		$CONFIG.$lang = $CONFIG.$lang || 'zh';
		// 线上模式
		if (__online_mode) {
			document.write('<script charset="utf-8" type="text/javascript" src="' + __base_url + '/' + __product + '/js/lang_' + $CONFIG.$lang + '.js"><' + '/script>');
			__pageid = __pageid.replace('.', '/');
			document.write('<script charset="utf-8" type="text/javascript" src="' + __base_url + '/' + __product + '/js/' + __pageid + '.js"><' + '/script>');
		}
		// 开发模式
		else {
			document.write('<script charset="utf-8" type="text/javascript" src="' + __base_url + '/bind/pack.php?pro=' + __product + '&page=lang_' + $CONFIG.$lang + '.dev.js"><' + '/script>');
			document.write('<script charset="utf-8" type="text/javascript" src="' + __base_url + '/bind/pack.php?pro=' + __product + '&page=' + __pageid + '.dev.js"><' + '/script>');
		}
	}
	// 调试模式
	if (__debug_mode) {
		// document.write('<script charset="utf-8" type="text/javascript" src="' + __base_url + '/bind/pack.php?pro=' + __product + '/js&dev_path=lib/debug.js"><' + '/script>');
	}
})();
