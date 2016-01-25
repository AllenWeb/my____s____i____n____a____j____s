/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");

App.EncodeUtils = (function(){
	var _hash={"<":"&lt;",">":"&gt;","\"":"&quot;","\\":"&#92;","&":"&amp;","'":"&#039;","\r":"","\n":"<br>"}, fReg = /<|>|\'|\"|&|\\|\r\n|\n| /gi;
	var it={};
	it.regexp = function( value ){
		return value.replace(/\}|\]|\)|\.|\$|\^|\{|\[|\(|\|\|\*|\+|\?|\\/gi,function(k){
			k = k.charCodeAt(0).toString(16);
			return "\\u" + (new Array(5-k.length)).join("0") + k;
		})
	};
	it.html = function( value, hash ){
		hash = hash || _hash;
		return value.replace(fReg,function(k){
				return hash[k]
		});
	}
	return it;
})();
