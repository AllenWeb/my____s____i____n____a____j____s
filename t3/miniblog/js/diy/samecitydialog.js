/**
 * @author chibin | chibin@staff.sina.com.cn
 * 注： 此类并没有继承sina下的dialog，无需引入sina包中的dialog
 *
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/winSize.js");
$import("diy/provinceandcity.js");
App.AreaDialog = {};
/**
 * 基础弹出层
 * @param {HTML String} title
 * @param {HTML String} content
 * @param {Object} cfg
 * cfg{
 * 		submit:function(){}
 * }
 */
App.AreaDialog = function(element, cfg){
    if (!element) {
        return false;
    }
    else {
        var elXY = Core.Dom.getXY(element);
        this.init(element, elXY);
		this._node = $E("arealayer");
		this._elsubmit = $E("citysubmit");
        this.bindcity();
        Core.Events.addEvent(this._node, function(){
            Core.Events.stopEvent();
            return false;
        }, "click");
        this._submit = $E("citysubmit");
        if (this._dialog) {
            this.show();
        }
    }
};

App.AreaDialog.prototype = {
    init: function(element, elXY){
        var _html = '<div id="arealayer" class="arealayer" style="position:absolute;">';
        var content = '<ul class="areaName">';
        if (scope.areaname) {
            for (var i = 0; i < scope.areaname.length; i++) {
				content += '<li><a href="javascript:void(0);" onclick = "javascript:{window.location.replace(\'/pub/city?p=' + scope.areaname[i]['pid'] + '&c='+scope.areaname[i]['cid']+'\');};">'+scope.areaname[i].name+'</a></li>';
            }
        }
        content += '</ul>';
        _html += content + (scope.areaname ? '<div class="MIB_linedot1"></div>' : '') + '\
					<div>\
				    <select id="area_province" class="areaSel1" name="province" truevalue="0"><option>'+$CLTMSG['CX0129']+'</option></select>\
					<select id="area_city" class="areaSel2" name="city" truevalue="0"><option>'+$CLTMSG['CX0130']+'</option></select>\
					<span class="MIB_btn"><a id="citysubmit" href="javascript:void(0);" class="btn_normal btnxs"><em>'+$CLTMSG['CX0131']+'</em></a></span>\
					</div>';
        this._dialog = Core.Dom.insertHTML(document.body, _html, "AfterBegin");
        this._dialog.style["left"] = elXY[0] + "px";
        this._dialog.style["top"] = elXY[1] + parseInt(element.offsetHeight) + "px";
        this._dialog.style["zIndex"] = 1200;
        this._city = $E("area_city");
        this._province = $E("area_province");
    },
    bindcity: function(){
        new App.ProvinceAndCity(this._province, this._city, (this._province.getAttribute('truevalue') || this._province.value), (this._city.getAttribute('truevalue') || this._city.value));
    },
    distory: function(){
        if (this._distory) 
            return;
        this._dialog.parentNode.removeChild(this._dialog);
        if (scope.$IE) {
            this._dialog.outerHTML = null;
        }
        this._dialog = null;
        this._distory = true;
    },
    close: function(){
        this.distory();
    },
    show: function(){
        this._dialog.style.visibility = "visible";
    }
};
