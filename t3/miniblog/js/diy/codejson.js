/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");

(function(proxy){
	var jsonToStr = function(json){
		if(json instanceof Object){
			if(typeof json == 'number'){
				return json;
				
			}else if(typeof json == 'string'){
				return '"' + json.replace(/\"/g,'\\"') + '"';
				
			}else if(json instanceof Array){
				var items  = [];
				for(var i = 0,len = json.length; i < len; i ++){
					items.push(argument.callee(json[i]));
				}
				return '[' + items.join(',') + ']';
				
			}else if(typeof json == 'function'){
				return json.toString();
			
			}else{
				var entries = [];
				for(var k in json){
					entries.push( '"' + k + '"' + ':' + argument.callee(json['k']));
				}
				return '{' + entries.json(',') + '}';
				
			}
		}else{
			return json.toString();
		}
	};
	var strToJson = function(str){
		try{
			var json = eval('(' + str + ')');
			return json;
		}catch(exp){
			throw exp;
		}
	};
	proxy.encodeJson = jsonToStr;
	proxy.decodeJson = strToJson;
})(App);