/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @将一个组html标签中的name和value的对应转成json.
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/array/uniq.js");
$import("diy/namevalue.js");
App.htmlToJson = function(mainBox,tagNameList,isClear){
	var _retObj  = {};
	tagNameList = Core.Array.uniq(tagNameList || ["INPUT","TEXTAREA","BUTTON","SELECT"]);
	if(!mainBox || !tagNameList){
		return false;
	}
	var _opInput = App.nameValue;
	for(var i = 0,len = tagNameList.length; i < len ; i++){
		var _tags = mainBox.getElementsByTagName(tagNameList[i]);
		for(var j = 0,lenTag = _tags.length; j < lenTag; j++){
			var _info = _opInput(_tags[j],isClear);
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
	}
	return _retObj;
};