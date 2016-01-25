/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/replaceNode.js");
$import("diy/hover.js");
$import("sina/core/string/toInt.js");
$import("sina/core/dom/next.js");
$import("diy/PopUpDialog.js");
$import("diy/Wipe.js");
$import("sina/core/dom/getXY.js");
$import("diy/check_login.js");
$import("jobs/mod_login.js");
$import("sina/core/events/fireEvent.js");

App.addfavorite_miniblog = function(s_mid){
	var event = Core.Events.getEvent();
	var target = event? (event.srcElement || event.target): null;
	var pos = Core.Dom.getXY(target);
	var x = pos[0]-((200 - target.offsetWidth)/2);
	var y = pos[1]-(target.offsetHeight) - 47;
	var alert = App.PopUpAlert().position(x,y);
    if (s_mid == '' || s_mid == null) {
        return false;
    }
    if (!scope.loginKit().isLogin) {
        App.ModLogin({
            func: function(){
				Core.Events.fireEvent(target, "click");
            }
        });
        return;
    }
    if (scope.$cuser_status === 'nofull') {
        App.finishInformation();
        return false;
    }
    
    
    Utils.Io.Ajax.request('/favorite/aj_add.php', {
        "POST": {
            "mid": s_mid
        },
        "onComplete": function(json){
		var _alert;
            if (json) {
                if (json.code == "A00006" || json.code == "M10001") {
					var rn = $C("strong");
					rn.innerHTML = $CLTMSG["CL0911"];
					document.body.appendChild(rn)
					Core.Dom.replaceNode(rn, target.parentNode);
					setTimeout(function(){
						alert.content($SYSMSG['M10010']).icon(3).wipe("up", true).lateClose(1500);
					},200)
                }
                else {
					setTimeout(function(){
						var fix = 0;
						if(json.code=="M02019"){
							fix = -15;
						}
						alert.content(App.getMsg(json.code)).position(x,y+fix).icon(1).wipe("up", true).lateClose(1500);
					},200)
                }
            }
            else {
				alert.content(App.getMsg(json.code)).icon(2).wipe("up", true).lateClose(1500);
            }
        },
        "onException": function(json){
            if (typeof json=="object" && json.code) {
				alert.content(App.getMsg(json.code)).icon(2).wipe("up", true).lateClose(1500);
            }
            else {
				alert.content($CLTMSG['CC0801']).icon(2).wipe("up", true).lateClose(1500);
            }
        },
        returnType: "json"
    });
};


App.deletefavorite_miniblog = function(s_mid){
	var event = Core.Events.getEvent();
	var target = event? (event.srcElement || event.target): null;
	var pos = Core.Dom.getXY(target);
	var x = pos[0]-((200 - target.offsetWidth)/2);
	var y = pos[1]-(target.offsetHeight) - 70;
	var alert = App.PopUpConfirm().position(x,y);
	var alert1 = App.PopUpAlert().position(x,y);
    if (s_mid == "" || s_mid == null) {
        return false;
    }
    //add by chibin 
    var getTarget = function(){
        var oEvent = Core.Events.getEvent();
        var oTarget = oEvent.srcElement || oEvent.target;
        while (oTarget.nodeType != 1) {
            oTarget = oTarget.parentNode;
        }
        return oTarget;
    };
    var element_li = getTarget();
    while (element_li.tagName.toLowerCase() != "li") {
        element_li = element_li.parentNode;
    }

	alert.content($CLTMSG["CC0802"]).icon(4).yes(function(){
		if(!scope.loginKit().isLogin){
			App.ModLogin({
				func: function(){
					Core.Events.fireEvent(target, "click");
				}
			});
			return;
		}
		deletefav(element_li)
	}).wipe("up",true)
    var deletefav = function(el){
        var o_displaynone, o_dotline;
        //将收藏数减1
        var o_emcount = $E('feed_title').getElementsByTagName('em').length > 0 ? $E('feed_title').getElementsByTagName('em')[0] : null;
        var s_url = "/favorite/aj_delete.php";
        Utils.Io.Ajax.request(s_url, {
            "POST": {
                "mid": s_mid
            },
            "onComplete": function(json){
            
                if (json) {
                    if (json.code == "A00006") {
						App.Wipe(null, el).wipe("down",false,function(){
							el.parentNode.parentNode.removeChild(el.parentNode);
						});
                        o_emcount.innerHTML = (Core.String.toInt(o_emcount.innerHTML) - 1).toString();
                        //判断此页是否删除完，v2直接判断li数量，modify by chibin 2009-12-1
						var len = $E('feed_list').getElementsByTagName('li').length;
                        if (len <= 1) {
                            window.location.reload(true);
                        }

                    }
                    else {
						alert1.content(App.getMsg(json.code)).wipe("up",true).icon(1).lateClose(1500);
                    }
                }
                else {
					alert1.content($CLTMSG['CC0701']).wipe("up",true).icon(1).lateClose(1500);
                }
            },
            "onException": function(json){
                if (json && json.code) {
				   alert1.content(App.getMsg(json.code)).wipe("up",true).icon(1).lateClose(1500);
                }
                else {
					alert1.content($CLTMSG['CC0701']).wipe("up",true).icon(1).lateClose(1500);
                }
            },
            returnType: "json"
        });
    }
};









