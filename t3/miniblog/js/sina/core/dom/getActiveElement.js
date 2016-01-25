$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
/**
 * @id Core.Dom.getActiveElement 
 * @param {Event} oEvent 事件对象
 * @return {Element} 获得当前活动的对象
 * 获得当前活动的对象
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
Core.Dom.getActiveElement = function(oEvent){
	return document.activeElement;
};
if(!$IE) {
	Core.Dom.getActiveElement = function(oEvent){
		return oEvent? oEvent.explicitOriginalTarget: null;
	};
}