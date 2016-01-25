/**
 * @author Pjan
 * @title 实现输入框自适应高度
 */
$import("sina/sina.js");
$import("sina/app.js");

/**
 * textarea自动适应高度
 * @param {Object} dom textarea的id
 * @param {Object} width textarea的宽度
 * @param {Object} height textarea的最小高度
 * @param {Object} lineHeight textarea的行高
 */
App.autoHeightTextarea = function(dom,width,height,lineHeight){
	var initHeight = height?height:40;
	var _height;
	if(scope.$IE){
		_height = Math.max(dom.scrollHeight,initHeight);
		dom.style.posHeight = _height;
	}else{
		var _width = width?width:300;
		var _lineHeight = lineHeight?lineHeight:20;
		var tmp = document.createElement("textarea");
		tmp.style.width = _width + "px";
		tmp.style.height = "0px";
		tmp.style.overflow="hidden";
		tmp.style.lineHeight = _lineHeight + "px";
		tmp.value = dom.value;
		document.body.appendChild(tmp);
		_height = Math.max((tmp.scrollHeight),initHeight);
		dom.style.height = _height + "px";
		tmp.parentNode.removeChild(tmp);
	}
	return _height;
};