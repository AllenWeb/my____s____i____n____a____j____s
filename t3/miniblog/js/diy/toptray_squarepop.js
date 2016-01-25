/**
 * @author chibin
 *
 * 顶部导航浮动显示广场
 *
 * 将此文件加入到jobs/miniblog_search.js
 *
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getLeft.js");

App.square_pop = function(){
    if (!$E('square_pop')) 
        return false;
    var _addevent = Core.Events.addEvent;
    var _getEventTag = Core.Events.getEventTarget;
    var _stopevent = Core.Events.stopEvent;
    var _getEleCls = Core.Dom.getElementsByClass;
    var _getLeft = Core.Dom.getLeft;
    var _getXY = Core.Dom.getXY;
    var _hook = null;
    var element = {
        oSquare: $E('gotosquare'),
        oPop: $E('square_pop')
    }
    var arrow = _getEleCls(element['oPop'], 'div', 'arrows')[0];
    var arrowLeft = 0;
    var arrowHeight = 0;
    var _abHeight = 0;
    var setposition = function(squa, obj){
//        _hook = setInterval(function(){
            //            var left = (_getLeft(squa) + (squa.offsetWidth / 2) - arrowLeft) + 'px';
            //            var top = (squa.offsetTop + squa.offsetHeight) + 'px';
            arrowLeft = arrow.offsetLeft;
            arrowHeight = arrow.offsetHeight;
            var topbar = Core.Dom.getElementsByClass(document, 'div', 'MIB_trayMain_txt')[0];
            _abHeight = _getXY(topbar)[1] + topbar.offsetHeight + arrowHeight;
            var left = (_getLeft(squa) + (squa.offsetWidth / 2) - arrowLeft) + 'px';
            var top = _abHeight + 'px';
            obj.style.left = left;
            obj.style.top = top;
//        }, 100);
    };
    var clearposition = function(){
        clearInterval(_hook)
    };
    /*
     * param obj:传入的层oPop
     */
    var mouseover = function(obj){
        obj.style.display = "";
        setposition(element['oSquare'], element['oPop'])
        _addevent(document.body, mouseout, 'mouseover');
    }
    var mouseout = function(){
        var _event = Core.Events.fixEvent(Core.Events.getEvent());
        var oTarget = _getEventTag(Core.Events.getEvent());
        var _pointY = _event.clientY;
        var _pointX = _event.clientX;
        var _oSquareXY = _getXY(element['oSquare']);
        while (oTarget) {
            if ((oTarget == element['oPop'] || oTarget == element['oSquare']) || (_pointX >= _oSquareXY[0] && _pointX <= _oSquareXY[0] + element['oSquare'].offsetWidth && _pointY < _abHeight)) {
                return true;
            }
            if (oTarget != document.body) {
                oTarget = oTarget.parentNode;
            }
            else {
                break;
            }
        }
        clearposition();
		element['oPop'].style.display = 'none';
        Core.Events.removeEvent(document.body, mouseout, 'mouseover');
    }
    _addevent(element['oSquare'], (function(){
        return function(){
            mouseover(element['oPop']);
        }
    })(), 'mouseover');
};
