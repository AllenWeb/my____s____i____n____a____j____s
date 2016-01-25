/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");

(function(proxy){
	proxy.parseUrl = function(url){
		var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
		var names = ['url','scheme','slash','host','port','path','query','hash'];
		var results = parse_url.exec(url);
		var that = {};
		for(var i = 0, len = names.length; i < len; i += 1){
			that[names[i]] = results[i];
		}
		return that;
	};
})(App);
	