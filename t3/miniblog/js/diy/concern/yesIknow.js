/**
 * @author chibin
 *
 * 关注列表 我知道了
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
$import("sina/core/class/extend.js")
App.concern = {
    YesIknow: function(){
        App.concern.close();
        App.doRequest({}, '/attention/aj_deltips.php')
    },
    close: function(){
        this.element['container'].style.display = 'none'
    },
    init: function(){
        this.element = {
            container: $E('atttips'),
            close: $E('atttips_x'),
            btn_yesIKnow: $E('atttips_ok')
        }
        Core.Events.addEvent(this.element['close'], this.close.bind2(this), 'click');
        Core.Events.addEvent(this.element['btn_yesIKnow'], this.YesIknow.bind2(this), 'click');
    }
};
/*
 * 未登录VIP首页关注TIP
 */


App.concern.showTip = function(){
    if (!scope.att_names){
		return false;
	}
    var _addevent = Core.Events.addEvent;
    var _getEventTag = Core.Events.getEventTarget;
    var _stopevent = Core.Events.stopEvent;
    var _getEleCls = Core.Dom.getElementsByClass;
    var _getLeft = Core.Dom.getLeft;
    var _getTop = Core.Dom.getTop;
    var _getXY = Core.Dom.getXY;
    var _hook = null;
    var html = '<div class="layer_tips_outer" style="display:none" id="concern_showtip">\
<div class="layer_tips">\
	<span class="min_w"></span>\
	#attnames#\
</div>\
<div class="layer_arrow"></div>\
</div>'											//builder切的html，由于PHP没法加到body下，需要RIA渲染。里面需要有个“我”，其他用#attnames#
	var attNames = (Core.Array.each(scope.att_names, function(str){
				return decodeURIComponent(str);
			})).join('、');				//关注的一堆人名称，但是不含“我”
	html = html.replace(/#attnames#/,$CLTMSG['CC4308'] + attNames);				
    Core.Dom.insertHTML(document.body, html, 'beforeend');
    var element = {
        oWe: $E('we_tip'),									//“我们”的ID
        oPop: $E('concern_showtip')							//"关注pop的ID"
    }
    /*
     * param obj:传入的层oPop
     */
    var mouseover = function(obj){
        var skinbtnLeft = _getLeft(element['oWe']);
        var skinbtnTop = _getTop(element['oWe']);
		obj.style.display = "";
        var left = (skinbtnLeft - 128) + 'px'	//算浮层左顶点 ，减去的值可能需要处理一下，不知道是不是一半的宽度，但是builder没切出来，还不知道会如何
        var top = (skinbtnTop - obj.offsetHeight) + 'px'		//减去的浮层高度得算一下
        obj.style.left = left;
        obj.style.top = top;
        _addevent(document.body, mouseout, 'mouseover');
    }
    var mouseout = function(){
        var _event = Core.Events.fixEvent(Core.Events.getEvent());
        var oTarget = _getEventTag(Core.Events.getEvent());
        while (oTarget) {
            if ((oTarget == element['oPop'] || oTarget == element['oWe'].parentNode)) {
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
    _addevent(element['oWe'], (function(){
        return function(){
            mouseover(element['oPop']);
        }
    })(), 'mouseover');
};
