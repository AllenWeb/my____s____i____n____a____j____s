/**
 * @author Liusong liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("diy/mb_dialog.js");
$import("jobs/msg_publisher.js");
$import("diy/flyout.js");
$import("diy/PopUpFace.js");
$import("diy/fansfind.js");

App.msgDialog = function(nick, bRefresh){
    var getTarget = function(){
        var oEvent = Core.Events.getEvent();
        var oTarget = oEvent.srcElement || oEvent.target;
        while (oTarget.nodeType != 1) {
            oTarget = oTarget.parentNode;
        }
        return oTarget;
    };
    
    var oFormElement = getTarget();
    
    var html = '<table class="noteTab2"><tbody>\
	<tr>\
	<th>' + $CLTMSG['CD0050'] + '&nbsp;</th><td><input  id="popUpNick" type="text"  class="PY_input" value="' + (nick || "") + '"/>&nbsp;&nbsp;</td></tr>\
	<tr class="tPadding" ><th>' + $CLTMSG['CD0051'] + '&nbsp;</th><td><textarea id="popUpEditor" class="PY_input"></textarea></td>\
	</tr>\
	 <tr class="tPadding1"><th></th><td><a class="faceicon1" id="insert_face_icon" href="javascript:void(0);" title="表情"></a></td></tr>\
	<tr><th/><td><a id="popUpSubmit" href="javascript:void(0);" class="btn_normal" ><em>' + $CLTMSG['CD0052'] + '</em></a>\
	<span id="popUpError" style="display:none" class="errorTs2 error_color">' + $SYSMSG['M01112'] + '</span></td></tr>\
	<tr><td></td><td><p class="inviteLayer_tip gray9">' + $CLTMSG['CD0053'] + '</p></td></tr>\
 	</tbody></table>';
    //dialog配置
    var c = {
        width: 430,
        zIndex: 1000,
        hidden: true
    };
    
    var oDialog = new App.Dialog.BasicDialog($CLTMSG["CD0054"], html, c);
    
   //start 增加表情--------------------------------------------------------------
    Core.Events.addEvent($E("insert_face_icon"), function(e){
    	var target = e.srcElement||e.target;
        App.showFaces(target,$E("popUpEditor"),-30,0,"360px");
    }, 'click');
    
    //关闭私信对话框时也关闭表情层
//    oDialog.onClose = function(){
//    	App.hideFaces();
//    }
    //end 增加表情----------------------------------------------------------------
            
    App.fansfind({
        input: $E("popUpNick"),
        searchtype: 1
    });
    
    if (oFormElement) {
        App.doFlyOut(oFormElement, oDialog._node, {
            resFun: function(){
                try {
                    oDialog.show();
                } 
                catch (e) {
                }
            },
            "style": "border:#000 2px solid;background:#bad;opacity:0.2;filter:alpha(opacity=20);zoom:1",
            time: 0.75
        });
    }
    else {
        oDialog.show();
    }
    
    var oElement = {
        submit: $E("popUpSubmit"),
        editor: $E("popUpEditor"),
        info: $E("popUpError"),
        nick: $E("popUpNick")
    };
    App.msgPublisher(oElement, null, bRefresh, function(){
        oDialog.close();
    });
    return oDialog;
};
