/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将querystring拆成一个json输出.
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
App.queryToJson = function(QS,isDecode){
	var _Qlist = (Core.String.trim(QS)).split("&");
	var _json  = {};
	var _fData = function(data){
		if(isDecode){
			return decodeURIComponent(data);
		}else{
			return data;
		}
	};
	for(var i = 0, len = _Qlist.length; i < len; i++){
		if(_Qlist[i]){
			var _hsh = _Qlist[i].split("=");
			if(_hsh[1]){
				if(!_json[_hsh[0]]){
					_json[_hsh[0]] = _fData(_hsh[1]);
				}else{
					_json[_hsh[0]] = [_fData(_hsh[1])].concat(_json[_hsh[0]]);
				}
			}else{
				if(!_json["$nullName"]){
					_json["$nullName"] = _fData(_hsh[0]);
				}else{
					_json["$nullName"] = [_fData(_hsh[0])].concat(_json["$nullName"]);
				}
			}
		}
	}
	return _json;
};