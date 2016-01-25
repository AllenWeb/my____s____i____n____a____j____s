$import('sina/core/system/_system.js');
$import('sina/core/system/winSize.js');
/**
 * @id Core.System.pageSize
 * 页面大小
 * @param {Object} _target 目标窗口对象
 * @return {Array} [pageWidth,pageHeight,windowWidth,windowHeight]
 */
Core.System.pageSize = function(_target){
		if (_target) {
			target = _target.document;
		}
		else {
			target = document;
		}
		var _rootEl = (target.compatMode=="CSS1Compat"?target.documentElement:target.body);
		
		var xScroll, yScroll;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = _rootEl.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else if (_rootEl.scrollHeight > _rootEl.offsetHeight) {
			xScroll = _rootEl.scrollWidth;
			yScroll = _rootEl.scrollHeight;
		}
		else {
			xScroll = _rootEl.offsetWidth;
			yScroll = _rootEl.offsetHeight;
		}
		var win_s = Core.System.winSize(_target);
		//$Debug("win_s : " + win_s.h + win_s.w);
		if(yScroll < win_s.height){
			pageHeight = win_s.height;
		}else { 
			pageHeight = yScroll;
		}
		if(xScroll < win_s.width){
			pageWidth = win_s.width;
		}else {
			pageWidth = xScroll;
		}
		return [pageWidth,pageHeight,win_s.width,win_s.height];
};