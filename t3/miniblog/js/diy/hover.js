/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");
$import("sina/app.js");
/*
  hover用于绑定鼠标滑过的方法
  App.hover(el,hoverFun,[outerFun])
  ＠el为被绑定的元素
  ＠hoverFun为鼠标滑过执行的方法，接受el作为参数的
  ＠outerFun为鼠标滑出执行的方法，接受el作为参数的，不填写的时候，el会重置style和class;
 */
(function(proxy){
	proxy.hover = function(el,hoverFun,outerFun){
		var cls = el.className;
		var css = el.style.cssText;
		Core.Events.addEvent(el, function(){hoverFun(el)}, 'mouseover');
		if(!outerFun || typeof outerFun != 'function'){
			Core.Events.addEvent(el, function(){
				el.className = cls;
				el.style.cssText = css;
			}, 'mouseout');
		}else{
			Core.Events.addEvent(el, function(){outerFun(el)}, 'mouseout');
		}
	};
})(App);