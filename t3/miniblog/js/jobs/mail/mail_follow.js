/**
 * 邮件联系人关注
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("diy/dialog.js");
$registJob("follow_all", function(){
    function navigateTo(){
        window.location.href = "/mailbox/wizard_finish_mailbox.php?feedback=" + encodeURIComponent(scope.$feedback);
    };
    function follow(){
        var checkboxs = Core.Dom.getElementsByClass(document.body, "input", "ckb");
        var len = checkboxs.length, uid = "";       
        var dialog = null;
        var succ = function(oJson){
            (typeof oJson == "object") && oJson.code == "A00006" && navigateTo();
        };
        var fail = function(oJson){
            var msg = $CLTMSG["CD0036"];
            (typeof oJson == "object") && oJson.code && (msg = $SYSMSG[oJson.code] || msg);
            dialog && dialog.close();
            App.alert(msg);
        };
        len && (function(){
            var i = 0;
            uid = [];
            for (i; i < len; i++) {
                var checkbox = checkboxs[i];
                var id = checkbox.value;
                if (checkbox.checked && id) {
                    uid.push(id);
                }
            }
            uid = uid.join(",");
        })();
        dialog = new App.Dialog.BasicDialog('loading', '<p style="padding: 20px 50px;">' + $CLTMSG["CF0107"] + '</p>', {
            width: 200,
            height: 50,
            hidden: false,
            zIndex: 999
        });
        Utils.Io.Ajax.request("/mailbox/aj_addfollow.php", {
            "POST": {
                "uid": uid,
                "fromuid": scope.$uid
            },
            "onComplete": succ,
            "onException": fail,
            "returnType": "json"
        });
        
    }
    
    Core.Array.foreach(['followBtn1', 'followBtn2'], function(v){
        Core.Events.addEvent($E(v), follow , 'click');
    });
	Core.Events.addEvent($E('cancelBtn'), function(){
		setTimeout(function(){ navigateTo();},0)
	}, 'click');
})
