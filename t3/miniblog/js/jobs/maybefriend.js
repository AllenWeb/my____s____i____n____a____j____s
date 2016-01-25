/**
 * @author haidong
 * 可能认识的人
 */
$import("jobs/base.js");
$import("sina/core/function/bind2.js");
$import("jobs/request.js");
$import("sina/utils/io/ajax.js");
$import("diy/prompttip.js");
$import("sina/core/dom/removeNode.js");
$import("diy/flyDialog.js");
$import("sina/core/dom/getXY.js");
$import("diy/forbidrefresh_dialog.js");
/**
 * 关注用户
 * @param {Object} uid
 */
App.attention = function(uid){
    if (!scope.$uid) {
        App.ModLogin();
        return false;
    }
    function cb(){
        $E("btn_" + uid).innerHTML = '<a class="concernBtn_Yet" href="javascript:void(0);"><span class="add_yet"/>' + $CLTMSG["CC2510"] + '</a>';
        Core.Dom.removeNode($E("cancel_" + uid));
    }
    //chibin add 防止恶意加关注
    //    App.doRequest({}, '/attention/aj_checkdoor.php', function(){
    //        App.doRequest({
    //            uid: uid,
    //            fromuid: scope.$uid
    //        }, "/attention/aj_addfollow.php", cb);
    //    }, function(json){
    //        if (json.code == 'R01441') {
    //            App.forbidrefresh(function(){
    //                App.doRequest({
    //                    uid: uid,
    //                    fromuid: scope.$uid
    //                }, "/attention/aj_addfollow.php", cb);
    //            });
    //        }
    //        else {
    //            App.alert(App.getMsg({
    //				'code': json.code
    //			}));
    //        }
    //    });
	var param = {
        uid: uid,
        fromuid: scope.$uid
    }
	var ecb= function(json){
		if (json&&json.code == 'MR0050') {
            App.forbidrefresh(function(){
                param['retcode']=scope.doorretcode;
                App.doRequest(param, url, cb, ecb);
            },'/attention/aj_addfollow.php')
        }
	}
    App.doRequest(param, "/attention/aj_addfollow.php", cb,ecb);
    
};

$registJob("attention", function(){
    var attbtn = $E("attbtn");
    function click(){
        var els = $E("att_wrap").getElementsByTagName("li");
        var uids = [];
        for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            if (el.className.search(/cur/i) != -1) {
                continue;
            }
            uids.push(els[i].id.replace(/wrap_/, ""));
        }
        if (!uids.length) {
            return false;
        }
        function cb(){
            for (var i = 0, ilen = uids.length; i < ilen; i++) {
                var uid = uids[i];
                $E("btn_" + uid).innerHTML = '<a class="concernBtn_Yet" href="javascript:void(0);"><span class="add_yet"/>' + $CLTMSG["CC2510"] + '</a>';
                Core.Dom.removeNode($E("cancel_" + uid));
            }
            App.promptTip($CLTMSG["CC2601"], null, "system_information");
            if ($IE) {
                location.hash = "top";
            }
            else {
                document.body.scrollIntoView();
            }
        }
        
        function ecb(json){
            App.promptTip(json, null, "system_information", "error");
            if ($IE) {
                location.hash = "top";
            }
            else {
                document.body.scrollIntoView();
            }
        }
        //chibin add 防止恶意加关注
        App.doRequest({}, '/attention/aj_checkdoor.php', function(){
            App.doRequest({
                uid: uids.join(","),
                fromuid: scope.$uid
            }, "/attention/aj_addfollow.php", cb);
        }, function(json){
            if (json.code == 'MR0050') {
                App.doRequest({
                    uid: uids.join(","),
                    fromuid: scope.$uid
                }, "/attention/aj_addfollow.php", cb);
            }
            else {
                App.alert(App.getMsg(json.code));
            }
        });
        
        return false;
    }
    Core.Events.addEvent(attbtn, click, "click");
});


/**
 * 取消可能感兴趣的人的关注,加入黑名单
 * @param {Object} uid 用户id
 * @param {Object} url 关注url
 * @param {Object} el  当前元素 不可为空
 */
App.addtopsfblacklist = function(uid, el){
    var msg = {
        des: ($CLTMSG["CC2602"]),
        html: $CLTMSG["CC2603"]
    };
    App.flyDialog(msg, "confirm", el, {
        ok: function(){
            var url = "/friend/aj_removepsf.php";
            var param = {
                uid: uid
            };
            function cb(json){
                var tmp = el;
                while (tmp.nodeName.toLowerCase() != 'li') {
                    tmp = tmp.parentNode;
                }
                if (tmp.getElementsByTagName('li').length == 0) {
                    location.reload(true);
                }
                else {
                    Core.Dom.removeNode(tmp);
                }
            }
            attentioncancel(param, url, cb);
        }
    });
};

function attentioncancel(data, url, cb){
    if (!scope.$uid) {
        App.ModLogin({
            func: arguments.callee,
            param: [data, url, cb]
        });
        return false;
    }
    if (scope.$uid == "123456") {
        var arg = arguments[0];
        data = arg[0];
        url = arg[1];
        cb = arg[2];
    }
    function ecb(json){
        if (json.code == "M00003") {
            App.ModLogin();
        }
        else {
            App.alert(json, {
                ok: function(){
                    if (scope.$uid == "123456") {
                        location.reload();
                    }
                }
            });
        }
    }
    var sucss = function(json){
        cb(json);
        if (scope.$uid == "123456") {
            location.reload(true);
        }
    }
    Utils.Io.Ajax.request(url, {
        'GET': {
            'uid': data['uid']
        },
        'onComplete': function(json){
            sucss(json)
        },
        'onException': function(json){
            ecb(json)
        },
        'returnType': 'json'
    });
    
}

/**
 * 鼠标效果
 * @param {Object} event
 * @param {Object} el
 */
App.changeBlacklistBackColor = function(event, el){
    event = event || window.event;
    var id = el.id.replace(/wrap_/, "");
    var cancel = $E("cancel_" + id);
    var message = $E("message_" + id);
    
    var pxs = Core.Dom.getXY(el);
    var xy = [event.pageX || event.clientX + document.documentElement.scrollLeft, event.pageY || event.clientY + document.documentElement.scrollTop]
    var bin = (xy[0] > pxs[0]) && xy[1] > pxs[1] && (xy[0] < pxs[0] + el.offsetWidth) && (xy[1] < pxs[1] + el.offsetHeight);
    if (event.type == "mouseover" && bin) {
        el.className = 'MIB_linedot cur';
        if (cancel) {
            cancel.style.display = "";
        }
        if (message) {
            message.style.display = "";
        }
    }
    
    if (event.type == "mouseout" && !bin) {
        el.className = "MIB_linedot";
        if (cancel) {
            cancel.style.display = "none";
        }
        if (message) {
            message.style.display = "none";
        }
    }
};

