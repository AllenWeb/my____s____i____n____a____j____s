/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @返回一个标签的name和value的对应.
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
App.nameValue = function(item,isClear){
	var _name = item.getAttribute("name");
	var _type = item.getAttribute("type");
	var _el = item.tagName;
	var _value = {"name":_name,"value":""};
	var _setVl = function(vl){
		if(vl === false){
			_value = false;return false;
		}
		if(!_value["value"]){
			_value["value"] = Core.String.trim(vl||"");
		}else{
			_value["value"] = [Core.String.trim(vl||"")].concat(_value["value"]);
		}
	};
	if(!item.disabled && _name){
		switch(_el){
			case "INPUT" :
				if(_type == "radio" || _type == "checkbox"){
					if(item.checked){
						_setVl(item.value);
					}else{
						_setVl(false);
					}
				}else if(_type == "reset" || _type == "submit" || _type == "image"){
					_setVl(false);
				}else {
					_setVl(isClear ? (item.value || false) : item.value);
				}
				break;
			case "SELECT" :
				if(item.multiple){
					var _ops = item.options;
					for(var i = 0, len = _ops.length; i < len; i ++){
						if(_ops[i].selected){
							_setVl(_ops[i].value);
						}
					}
				}else{
					_setVl(item.value);
				}	
				break;
			case "TEXTAREA" :
				_setVl(isClear ? (item.value || item.getAttribute("value") || false) : (item.value|| item.getAttribute("value")));
//				_setVl(item.value || item.getAttribute("value") || false);
				break;
			case "BUTTON" :
			default :
				_setVl(item.value || item.getAttribute("value") || item.innerHTML || false);
		}
	}else{
		_setVl(false);
	}
	return _value;
};