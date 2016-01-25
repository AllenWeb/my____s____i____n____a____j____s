/*
 * @author pjan | peijian@staff.sina.com.cn
 * @title 用于显示隐藏内容的函数及集合
 */


App.toggleFriends = function(_id, _self){
	var _dom = $E(_id)?$E(_id):false;
	var _arrow = _self.getElementsByTagName("SPAN")[0];
	if(_dom){
		if(_dom.style['display'] == "none"){
			_dom.style['display'] = "";
			_arrow.className = "arrowup";
		}else{
			_dom.style['display'] = "none";
			_arrow.className = "arrowdown";
		}
	}
	return;
};
