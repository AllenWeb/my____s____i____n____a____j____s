$import("sina/core/dom/_dom.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/system/getScrollPos.js");
/**
 * <pre>
 * 判断鼠标是否在指定对象上
 * </pre>
 * @id Core.Dom.hitTest
 * @param {HTMLElement | Document} oElement 节点对象
 * @param {Event} oEvent event
 * @return {Boolean} 如果鼠标在对象上则为Ture,否则为False
 * @author FlashSoft
 * @update 08.01.10
 */
Core.Dom.hitTest = function (oElement, oEvent) {
	var _nodeXY = Core.Dom.getXY(oElement);
	var _pos = {
		left: _nodeXY[0],
		top: _nodeXY[1],
		right: _nodeXY[0] + oElement.offsetWidth,
		bottom: _nodeXY[1] + oElement.offsetHeight
	};
	mPtmp = Core.System.getScrollPos();
	var _x = oEvent.clientX + mPtmp[1];
	var _y = oEvent.clientY + mPtmp[0];
	return (_x >= _pos.left && _x <= _pos.right) && (_y >= _pos.top && _y <= _pos.bottom)? false: true;
};