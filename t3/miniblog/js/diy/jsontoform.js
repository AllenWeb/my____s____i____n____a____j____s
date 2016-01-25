/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @a function make json to form
 */
$import("sina/sina.js");
$import("sina/app.js");
(function(){
	App.formToJson = function(json,formDom){
		var box = formDom || document.createElement("DIV");
		var crt = function(name,value){
			var inp = document.createElement("INPUT");
			inp.type  = "hidden";
			inp.value = value;
			inp.name  = name;
			box.appendChild(inp);
		};
		if(typeof json == "object"){
			for(var k in json){
				if(json[k] instanceof Array){
					for(var i = 0, len = json[k].length; i < len; i++){
						crt(k,json[k][i].toString());
					}
				}else{
					crt(k,json[k].toString());
				}
			}
		}
		return box;
	};
})();