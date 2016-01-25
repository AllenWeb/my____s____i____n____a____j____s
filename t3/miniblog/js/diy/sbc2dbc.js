/**
 * @fileoverview 全角转半角
 * @author yuwei@staff.sina.com.cn
 * 
 * console.log(App.sbc2dbcCase("１２３４５６７８９０aaａａ"));//show "1234567890aaaa"
 */
 
$import("sina/app.js");

(function(proxy){
	proxy.sbc2dbcCase = function(str){
    	return str.replace(/[\uff01-\uff5e]/g,function(a){
    		return String.fromCharCode(a.charCodeAt(0)-65248);
    	}).replace(/\u3000/g," ");
    };
})(App);
