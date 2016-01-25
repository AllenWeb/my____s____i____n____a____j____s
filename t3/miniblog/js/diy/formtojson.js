/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将一个form表单转成json.
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/namevalue.js");
App.formToJson = function(formName){
	var _retObj  = {};
	var _opInput = App.nameValue;
	var _frm = typeof(formName) == "string"? document.forms[formName]:formName;
	var _els = _frm.elements;
	for(var i = 0,len = _els.length; i < len ; i++){
		var _info = _opInput(_els[i]);
		if(!_info){continue;}
		if(_retObj[_info.name]){
			if(_retObj[_info.name] instanceof Array){
				_retObj[_info.name] = _retObj[_info.name].concat(_info.value);
			}else{
				_retObj[_info.name] = [_retObj[_info.name]].concat(_info.value);
			}
		}else{
			_retObj[_info.name] = _info.value;
		}
	}
	return _retObj;
};