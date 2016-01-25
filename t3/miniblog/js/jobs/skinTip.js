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
$import("sina/core/dom/getTop.js")

App.skin_pop = function(){
    if (!$E('skin_tip')) 
        return false;
    var _addevent = Core.Events.addEvent;
    var _getEventTag = Core.Events.getEventTarget;
    var _stopevent = Core.Events.stopEvent;
    var _getEleCls = Core.Dom.getElementsByClass;
    var _getLeft = Core.Dom.getLeft;
	var _getTop = Core.Dom.getTop;
    var _getXY = Core.Dom.getXY;
    var _hook = null;
	var html = '<div id="skin_showtip" style="display:none;z-Index:999" class="pertemplate"><p><a href="/person/myskin.php">'+$CLTMSG['CC5701']+'</a></p><img title="" class="icon_pertemplate" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"></div>'
    Core.Dom.insertHTML(document.body,html,'beforeend');
	var element = {
        oSkin: $E('skin_tip'),
        oPop: $E('skin_showtip')
    }
    /*
     * param obj:传入的层oPop
     */
    var mouseover = function(obj){
        var skinbtnLeft = _getLeft(element['oSkin']);
		var skinbtnTop =  _getTop(element['oSkin']);
		var left = (skinbtnLeft - 38)+'px'
		var top = (skinbtnTop - 36) + 'px'
		obj.style.left=left;
		obj.style.top = top;
		obj.style.display = "";
        _addevent(document.body, mouseout, 'mouseover');
    }
    var mouseout = function(){
        var _event = Core.Events.fixEvent(Core.Events.getEvent());
        var oTarget = _getEventTag(Core.Events.getEvent());
        while (oTarget) {
            if ((oTarget == element['oPop'] || oTarget == element['oSkin'].parentNode)) {
                return true;
            }
            if (oTarget != document.body) {
                oTarget = oTarget.parentNode;
            }
            else {
                break;
            }
        }
        element['oPop'].style.display = 'none';
        Core.Events.removeEvent(document.body, mouseout, 'mouseover');
    }
    _addevent(element['oSkin'], (function(){
        return function(){
            mouseover(element['oPop']);
        }
    })(), 'mouseover');
};