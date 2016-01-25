$import('sina/core/system/_system.js');
/**
 * 获取滚动条的位置
 * @param {Object} oDocument 目标document对象，比如是当前窗口的document，还是某个iframe的窗口的document
 * @return {Array} oDocument的位置信息，数组中的元素依次是 xPosition,yPosition,width,height
 */
Core.System.getScrollPos = function(oDocument) {
	oDocument = oDocument || document;
	var dd = oDocument.documentElement;
	var db = oDocument.body;
	return [
			Math.max(dd.scrollTop, db.scrollTop), 
			Math.max(dd.scrollLeft, db.scrollLeft),
			Math.max(dd.scrollWidth, db.scrollWidth), 
			Math.max(dd.scrollHeight, db.scrollHeight)
			];
};
