/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import("diy/check.js");
/**
  
 * @param {string} mailStr	: the string of mails
 * @param {array} splitKey : the split keys
 */
(function(proxy){
	proxy.splitMail = function(mailStr,splitKey){
		var k = splitKey || [' ', ';', ','];
		var m = mailStr.replace('/\r|\n/ig', ' ');
		for(var i = 0, len = k.length; i < len; i++){
			var r = new RegExp(k[i],'ig');
			m = m.replace(r, ' ');
		}
		m = Core.String.trim(m);
		if(m.length){
			return m.split(/\s+/);
		}else{
			return [];
		}
	};
})(App);