//滑动出现新微博
App.rollOut = function(dom, callback){
	if(dom.style["display"] === ""){
		return;
	}
	dom.style.cssText = 'position:relative;overflow:hidden;';
	dom.style.display = '';
	var _height = dom.offsetHeight;
	var _start = 0;
	dom.style["height"]  = _start + "px";
	
	var glide = function(){
		_start =  Math.min(_height, (_start + 10));
		dom.style["height"]  = _start + "px";
		if(_start == _height){
			dom.style.cssText = '';
			if(callback){
				callback();
			};
		} else {
			setTimeout(arguments.callee, 20);
		}
	};
	glide();
}
