/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将一个特定格式的json拼成querystring.
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");

App.jsonToQuery = function(JSON,isEncode){
	var _Qstring = [];
	var _fdata   = function(data){
		data = Core.String.trim(data.toString());
		if(isEncode){
			return encodeURIComponent(data);
		}else{
			return data;
		}
	};
	if(typeof JSON == "object"){
		for(var k in JSON){
			if(JSON[k] instanceof Array){
				for(var i = 0, len = JSON[k].length; i < len; i++){
					_Qstring.push(k + "=" + _fdata(JSON[k][i]));
				}
			}else{
				_Qstring.push(k + "=" +_fdata(JSON[k]));
			}
		}
	}
	if(_Qstring.length){
		return _Qstring.join("&");
	}else{
		return "";
	}
};