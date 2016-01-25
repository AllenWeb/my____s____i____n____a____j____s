/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * wangliang rebuild
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/comm/crc32.js");

(function(proxy){
	proxy.imgURL = function(id, size){
		size = size || 'middle';
		//comm func
		function hexdec(hex_string) {
			hex_string = (hex_string+'').replace(/[^a-f0-9]/gi, '');
			return parseInt(hex_string, 16);
		}
		//json to img types
		var types = {
			ss: {
				middle : '&690',
				bmiddle : '&690',
				small : '&690',
				thumbnail : '&690',
				square : '&690',
				orignal : '&690'
			},
			ww: {
				large : '',
				bmiddle : '',
				small : '',
				thumbnail : '',
				square : ''
			}
		};
		//check 'w'
		var isW = id.charAt(9) == 'w';
		var ext = id.charAt(21)=='g'?'.gif':'.jpg';
		//count domain
		var domainNum = isW?((Math.abs(App.crc32(id))%4) + 1):(hexdec(id.substr(19,2))%16 + 1);
		//build url
		var url = 'http://'+(isW?'ww':'ss')+domainNum+'.sinaimg.cn/'+size+'/'+id+(isW?ext:'')+types[isW?'ww':'ss'][size];
		return url;
	};
})(App);
