/**
 * @fileoverview 关注所有人
 * @author chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/utils/io/ajax.js");
$import("diy/mb_dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("jobs/searchuser.js");
$registJob("follow_all", function(){
    var element = {
        followVlteer: $E('followall'),
        followFirst: $E('followFirst'),
        followSecond: $E('followSecond'),
        changeFirst: $E('changeFirst'),
        changeSecond: $E('changeSecond'),
        nextStep: $E('nextStep'),
        vlteeruids: scope.vlteeruids || new Array(),
        firstuids: scope.firstuids || new Array(),
        seconduids: scope.seconduids || new Array(),
        firstconcern: $E('firstConcern'),
        secondconcern: $E('secondConcern'),
        param: {
            fromuid: scope.$uid
        }
    };
    var _getElByCls = Core.Dom.getElementsByClass;
    var submit = function(url, param, cb, ecb){
        Utils.Io.Ajax.request(url, {
            'POST': param,
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    cb(json);
                }
                else {
                    ecb(json,cb);
                }
            },
            'onException': function(){
                window.location.reload();
            },
            'returnType': 'json'
        });
    };
    var succ = function(el){
        el.className = 'btn_notclick';
        el.askfollow = true;
        App.alert({
            code: 'M00912'
        }, {
            icon: '3'
        });
    };
    var fail = function(json, el , _func){
        if (json && json.code == 'MR0050') {
            App.forbidrefresh(function(){
                element['param']['retcode'] = scope.doorretcode;
                App.doRequest(element['param'], "/attention/aj_addfollow.php", (function(){
                    return function(){
						_func();
                    }
                })(), (function(ele){
                    return function(){
                        fail(ele);
                    }
                })(el));
            }, '/attention/aj_addfollow.php')
        }
        else {
            App.alert({
                code: json.code
            });
        }
    };
    Core.Events.addEvent(element['followVlteer'], function(){
        if (element['followVlteer'].askfollow) {
            return false;
        }
        element['param']['uid'] = element['vlteeruids'].join(",") || '';
        submit('/attention/aj_addfollow.php', element['param'], function(json){
            App.alert({
                code: 'M00912'
            }, {
                icon: 3,
                ok: function(){
                    element['followVlteer'].innerHTML = '<em>' + $CLTMSG['CC2510'] + '</em>';
                    element['followVlteer'].className = 'btn_notclick';
                    element['followVlteer'].askfollow = true;
                }
            });
        }, function(json){
            fail(json, element['followVlteer']);
        });
    }, 'click');
    Core.Events.addEvent(element['followFirst'], function(){
        if (element['followFirst'].askfollow) {
            return false;
        }
        element['param']['uid'] = element['firstuids'].join(",") || '';
        submit('/attention/aj_addfollow.php', element['param'], function(json){
            var af = _getElByCls(element['firstconcern'], 'A', 'addFollow');
            for (var i = 0; i < af.length; i++) {
                af[i].innerHTML = '<span class="add_yet"></span>' + $CLTMSG['CX0025'];
                af[i].href = "javascript:void(0);";
                af[i].className = "concernBtn_Yet";
                if (af[i]) {
                    af[i].ask_following = true;
                }
            }
            succ(element['followFirst']);
        }, function(json){
			var _cb = arguments[1]||function(){};
            fail(json, element['followFirst'],_cb);
        });
    }, 'click');
    Core.Events.addEvent(element['followSecond'], function(){
        if (element['followSecond'].askfollow) {
            return false;
        }
        element['param']['uid'] = element['seconduids'].join(",") || '';
        submit('/attention/aj_addfollow.php', element['param'], function(json){
            var af = _getElByCls(element['secondconcern'], 'A', 'addFollow');
            for (var i = 0; i < af.length; i++) {
                af[i].innerHTML = '<span class="add_yet"></span>' + $CLTMSG['CX0025'];
                af[i].href = "javascript:void(0);";
                af[i].className = "concernBtn_Yet";
                if (af[i]) {
                    af[i].ask_following = true;
                }
            }
            succ(element['followSecond']);
        }, function(json){
			var _cb = arguments[1]||function(){};
            fail(json, element['followSecond'],_cb);
        });
    }, 'click');
    Core.Events.addEvent(element['changeFirst'], function(){
        submit('/aj_attchange.php', {
            type: 0,
            fromuid: scope.$uid
        }, function(json){
            if (json.data.html != '' && json.data.uids.length > 0) {
                var html = json.data.html;
                var uids = json.data.uids;
                element['firstconcern'].innerHTML = html;
                element['firstuids'] = uids;
                scope.firstuids = element['firstuids'];
                element['followFirst'].askfollow = false;
                element['followFirst'].className = 'btn_normal'
            }
        }, function(){
        });
    }, 'click');
    Core.Events.addEvent(element['changeSecond'], function(){
        submit('/aj_attchange.php', {
            type: 1,
            fromuid: scope.$uid
        }, function(json){
            if (json.data.html && json.data.uids.length > 0) {
                var html = json.data.html;
                var uids = json.data.uids
                element['secondconcern'].innerHTML = html;
                element['seconduids'] = uids;
                scope.firstuids = element['seconduids'];
                element['followSecond'].askfollow = false;
                element['followSecond'].className = 'btn_normal'
            }
        }, function(){
        });
    }, 'click');
});
