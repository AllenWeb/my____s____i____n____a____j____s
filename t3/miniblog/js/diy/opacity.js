/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("diy/timer.js");
(function(proxy){
	proxy.setOpacity = function(element,value){
		element.style.filter = 'alpha(opacity=' + value + ')';
		element.style.opacity = value/100;
	};
	proxy.opacity = function(element,cfg,/*Function*/callback){
		var _first = cfg['first'];
		var _last = cfg['last'] || 0;
		if(_last == _first){
			proxy.setOpacity(element,_first);
			//callback added
			if(typeof callback === "function"){
				callback(_first,_last);
			}
			return false;
		}
		var _time = Math.floor((cfg['time'] || 5)*100/proxy.timer.delay);
		var _orbit = [];
		for(var i = 0; i < _time; i ++){
			_orbit.push(_first + (_last - _first)*i/_time);
		}
		var _current = 0;
		var _timerhook = proxy.timer.add(function(){
			if(_current >= _orbit.length){
				proxy.timer.remove(_timerhook);
				proxy.setOpacity(element,_last);
				if(typeof callback === "function"){
					callback(_first,_last);
				}
				return false;
			}
			proxy.setOpacity(element,_orbit[_current]);
			_current ++
		});
	};
})(App);