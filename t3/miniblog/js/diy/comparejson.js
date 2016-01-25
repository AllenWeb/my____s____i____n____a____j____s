/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/jsontoquery.js");

(function(proxy){
	proxy.includeJson = function(json1,json2){
		for(var k in json1){
			if(typeof json1[k] == Object){
				if(json1[k] instanceof Array){
					if(json2[k] === undefined || json2[k].join("|") != json1[k].join("|")){
						return false;
					}
				}else{
					if(typeof json2[k] == Object){
						return argument.callee(json1[k],json2[k]);
					}else{
						return false;
					}
				}
			}else{
				if(json2[k] === undefined || json2[k] != json1[k]){
					return false;
				}
			}
		}
		return true;
	};
	proxy.compareJson = function(json1,json2){
		if(proxy.includeJson(json1,json2) && proxy.includeJson(json2,json1)){
			return true;
		}else{
			return false;
		}
	};
})(App);