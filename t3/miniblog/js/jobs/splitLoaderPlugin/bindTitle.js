/**
 * @author liusong@staff.sina.com.cn
 */
(function(ns){
	ns.bindTitle = function(_dom, _key, _value){
		if(!_value.url){return}
		_dom.setAttribute("title", _value.url);
	};
})(App);