$import("sina/sina.js");
$import("sina/core/dom/_dom.js");
$import("sina/core/dom/descByIds.js");
/**
 * 取得iframe的window引用
 * @id Core.Dom.getWin
 * @param {Object} iframeElement iframe元素
 * @return {Element} 返回iframeElement的contentWindow
 */
Core.Dom.getWin = function (iframeElement) {
	iframeElement = $E(iframeElement);
	if (iframeElement.contentWindow){
		return iframeElement.contentWindow;
	}
	else {
		var ifm = Core.Dom.descByIds(iframeElement, "#iframe");
		if (ifm) {
			return ifm.contentWindow;
		}
		else {
			return null;
		}
			
	}
};