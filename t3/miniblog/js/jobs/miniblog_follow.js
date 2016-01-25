/**
 * @author haidong|haidong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("jobs/request.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("diy/copy.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/events/stopEvent.js");
$import("diy/prompttip.js");
$import("sina/core/dom/removeNode.js");
$import("diy/flyDialog.js");
$import("sina/core/dom/getXY.js");
$import("jobs/mousemove.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/string/encodeHTML.js");
$import("diy/admin_uid_list.js");
$import("sina/core/array/findit.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/replaceNode.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/PopUpDialog.js");
$import("diy/Wipe.js");
$import("diy/check_login.js");
$import("jobs/mod_login.js");
$import("diy/jsontoquery.js");
/**
 * 加关注
 * @param {Object} uid 用户id
 * @param {Object} url 关注url
 * @param {Object} el  当前元素 不可为空
 */
App.followadd = function(uid, el, url, name, conf){
    url = "/attention/aj_addfollow.php";
    if(conf){
      url += ('?' + App.jsonToQuery(conf));
    }
    while (el.nodeName.toLowerCase(0) != "p") {
        el = el.parentNode;
    }
    function cb(json){
        if (scope.$pageid == 'follow' && scope.$oid == scope.$uid) {
            var imgURI = scope.$BASECSS + "style/images/common/transparent.gif";
            el.innerHTML = '<img class="small_icon sicon_atteo" title="' + $CLTMSG['CC3001'] + '" src="' + imgURI + '">';
        }
        else {
            el.innerHTML = '<a class="concernBtn_Yet" href="javascript:void(0);"><span class="add_yet"></span>' + $CLTMSG['CC2510'] + '</a>';
        }
    }
    if (el.ask_following) {
        return false;
    }
    App.followOperation({
        uid: uid,
        fromuid: scope.$uid
    }, url, cb, el);
    //el.ask_following = true;//chibin comment
};

/**
 * 取消关注
 * @param {Object} uid 用户id
 * @param {Object} url 关注url
 * @param {Object} el  当前元素 不可为空
 */
App.followcancel = (function(){
	var current;
	return function(uid, el, act, name, sex){
	    sex = sex || "TA";
		var fix = act==1?-40:0;
		var pos = Core.Dom.getXY(el);
	    var x = pos[0]-(((act==1?250:200) - el.offsetWidth)/2);
		var y = pos[1]-(el.offsetHeight) - 70 + fix;
	    var str = $CLTMSG['CC3101'];
	    var tmp1 = new Utils.Template(str);
	    var stxt = tmp1.evaluate({
	        sex: sex
	    });
	    //var stxt = "移除之后将取消" + sex + "对你的关注"; chibin modify 
	    if (Core.Array.findit(App.admin_uid_list, uid) === -1) {
	        stxt += '<div class="block">' +
	        '<input type="checkbox" id="del_block_user"><label for="del_block_user">' +
	        $CLTMSG['CC2701'] +
	        '</label></div>'
	    }
//	    var msg = act == 1 ? {
//	        des: stxt,
//	        html: $CLTMSG['CC3102'] + name + "?"
//	    } : ($CLTMSG["CC3103"] + name + "?");
		
		var msg = act == 1? [stxt,$CLTMSG['CC3102'] + name + "?"].join(""):[$CLTMSG["CC3103"],name,"?"].join("");
		
		var ok = function(){
			var url = "/attention/aj_delfollow.php";
			var param = {
				touid: uid,
				fromuid: scope.$uid
			};
			if (act && act == 1) {
				param.action = 1;
			}
			
			//同时将用户加入黑名单，updated by yuwei 2009-11-27
			if ($E("del_block_user") && $E("del_block_user").checked) {
				param.isblack = "OK";
			}
			function cb(json){
				var reload = function(){
					setTimeout(function(){
						window.location.reload(true);
					}, 500)
				}
				var li = $E(uid);
				if (!li) {
					reload();
					return
				}
				li.onmouseover = null;
				li.onmouseout = null;
				App.Wipe(null, li).wipe("down", false, function(){
					li.parentNode.parentNode.removeChild(li.parentNode)
					if ($E('att_wrap')) {
						if (!$E('att_wrap').getElementsByTagName('LI').length) {
							reload()
							return false;
						}
					}
					if (scope.$pageid == 'profile') {
						reload()
						return false;
					}
				})
			}
			App.followOperation(param, url, cb, null, 'del');
		}
		
//		var msg = [$CLTMSG["CD0007"],name,"?"].join("");
		var cf = App.PopUpConfirm().position(x,y).content(msg).width(act==1?250:200).icon(4).yes(function(){
			if (!scope.loginKit().isLogin) {
				App.ModLogin({
					func: function(){
						setTimeout(function(){
							Core.Events.fireEvent(el, "click");
						}, 200);
					}
				});
				return false;
			}
			ok();
			return false;
		}).no(function(){return false});
		setTimeout(function(){cf.wipe("up",true)},100)
	};
})();


App.followOperation = function(data, url, cb, el, type, errorfunc){
    if (!scope.$uid) {
        App.ModLogin({
            func: arguments.callee,
            param: [data, url, cb]
        });
        return false;
    }
    if (scope.$cuser_status === 'nofull') {
        App.finishInformation();
        return false;
    }
    if (scope.$uid == "123456") {
        var arg = arguments[0];
        data = arg[0];
        url = arg[1];
        cb = arg[2];
    }
    function ecb(json){
        if (el) {
            el.ask_following = false;
        }
        if (json.code == "M00003") {
            App.ModLogin();
        }
        else 
            if (json && json.code == 'MR0050') {
                App.forbidrefresh(function(){
                    data['retcode'] = scope.doorretcode;
                    App.doRequest(data, url, sucss, ecb);
                },'/attention/aj_addfollow.php')
            }
            else {
                App.alert(json, {
                    ok: function(){
                        if (scope.$uid == "123456") {
                            location.reload();
                        }
                    }
                });
				if(typeof errorfunc === "function"){
					errorfunc.call(null,json);
				}
            }
    }
    var sucss = function(json){
        cb(json);
        if (scope.$uid == "123456") {
            location.reload(true);
        }
    }
    if (type === 'del') {
        App.doRequest(data, url, sucss, ecb);
    }
    else {
        App.doRequest(data, url, function(json){
            if (el) {
                el.ask_following = true;
            }
            sucss(json);
        }, ecb);
    }
    
};
/**
 * 复制链接
 * @param {Object} event
 */
App.copyLink = function(event){
    var copytext = $E("copytext");
    var sucStr = $CLTMSG["CC2508"];
    var options = {
        icon: 3
    };
    if (App.copyText(copytext.value) == false) {
        sucStr = $CLTMSG["CC2509"];
        options = {
            icon: 1
        };
    }
    App.flyDialog(sucStr, null, $E("copylink"), options);
    Core.Events.stopEvent(event);
};

$registJob("initPage", function(){
    var copytext = $E("copytext");
    if (copytext) {
        copytext.onfocus = copytext.onclick = function(){
            copytext.select();
        }
        Core.Events.addEvent($E("copylink"), App.copyLink, "click");
    }
});
/**
 * 关注所有的人
 * @param {Object} el
 */
App.followAll = function(btn){
    try {
        if (scope.$uid != scope.$oid) {
            return;
        }
        var els = $E("att_wrap").getElementsByTagName("li");
        var uids = [];
        for (var i = 0, len = els.length; i < len; i++) {
            var el = els[i];
            if (el.className.search(/cur/i) != -1) {
                continue;
            }
            uids.push(el.id);
        }
        if (!uids.length) {
            return false;
        }
		var pos = Core.Dom.getXY(btn);
		var x = pos[0] - ((200 - btn.offsetWidth) / 2);
		var y = pos[1] - (btn.offsetHeight) - 50;
		var msg = [$CLTMSG["CD0007"], name, "?"].join("");
		var _alert = App.PopUpAlert().position(x, y);
        function changeBGcolor(uids){
            for (var i = 0, ilen = uids.length; i < ilen; i++) {
                var uid = uids[i];
                var add = $E("add_" + uid);
                if (add) {
                    if (scope.$uid == scope.$oid && scope.$pageid == 'follow') {
                        var imgURI = scope.$BASECSS + "style/images/common/transparent.gif";
                        //update liusong@staff.sina.com.cn
                        var _p = $C("p");
                        _p.className = "mutual";
                        
                        _p.innerHTML = '<img class="small_icon sicon_atteo" title="' + $CLTMSG['CC3001'] + '" src="' + imgURI + '">';
                        Core.Dom.replaceNode(_p, add);
                        //下边的代码被干掉的原因是，innerHTML值不允许含有区块标签
                        //add.innerHTML = ' <p class="mutual"><img class="small_icon sicon_atteo" title="互相关注中" src="' + imgURI + '"></p>';
                        //add.parentNode.innerHTML = ' <p class="mutual">   </p>';
                    }
                    else {
                        add.innerHTML = '<a class="concernBtn_Yet" href="javascript:void(0);"><span class="add_yet"/>' + $CLTMSG['CC2510'] + '</a>';
                    }
                }
            }
        }
        
        function cb(){
            changeBGcolor(uids);
			setTimeout(function(){
				_alert.content($CLTMSG['CC2601']).position(x,y+20).icon(3).wipe("up",true).lateClose(1500);
			},500);
			btn.style.visibility = "hidden"
        }
        function ecb(json){
            if (json && json.code == 'MR0050') {
                App.forbidrefresh(function(){
                    var data = {
                        uid: uids.join(","),
                        fromuid: scope.$uid
                    }
                    data['retcode'] = scope.doorretcode;
                    App.doRequest(data, "/attention/aj_addfollow.php", cb, ecb);
                },'/attention/aj_addfollow.php')
            }
            else {
				if (json.code == 'R01440') {
					//只有超人才需要提醒！
					App.alert({code:json.code});
					return false;
				}
                App.promptTip(json, null, "system_information", "error");
                if (json.code == "M05003") {
                    changeBGcolor(json.data.uids);
                }
                if ($IE) {
                    location.hash = "top";
                }
                else {
                    document.body.scrollIntoView();
                }
            }
        }
		App.PopUpConfirm().position(x,y).width(200).content($CLTMSG['CL0803']).icon(4).yes(function(){
            App.doRequest({
                uid: uids.join(","),
                fromuid: scope.$uid
            }, "/attention/aj_addfollow.php", cb, ecb);
        }).wipe("up",true);
        //chibin add 防止恶意加关注
        //        App.doRequest({
        //            uid: uids.join(",")
        //        }, '/attention/aj_checkdoor.php', function(){
//        App.confirm($CLTMSG['CL0803'], {
//            ok: function(){
//                App.doRequest({
//                    uid: uids.join(","),
//                    fromuid: scope.$uid
//                }, "/attention/aj_addfollow.php", cb, ecb);
//            }
//        });
        //        }, function(json){
        //            if (json.code == 'R01441') {
        //                App.forbidrefresh(function(){
        //                    App.confirm($CLTMSG['CL0803'], {
        //                        ok: function(){
        //                            App.doRequest({
        //                                uid: uids.join(","),
        //                                fromuid: scope.$uid
        //                            }, "/attention/aj_addfollow.php", cb, ecb);
        //                        }
        //                    })
        //                });
        //            }
        //            else {
        //                App.alert(App.getMsg({
        //                    'code': json.code
        //                }));
        //            }
        //        });
    
    
    
    } 
    catch (e) {
        throw e
    }
};
/*
 *设置备注
 *@param{Object}:el,HTML DOM
 *@param{String}:fid,欲添加备注的人的微博id
 *@param{String}:oldMark,原备注，可能为空
 * */
App.followRemarkAdd = function(el, fid, oldMark){
    var initErrorTip = $CLTMSG['CC3104'];
    var html = '<div style="width: 390px;" class="layerBoxCon">\
	    <div class="inviteLayer">\
	        <p class="flName">\
	            ' + $CLTMSG['CC3105'] + '\
	        </p>\
	        <div class="inviteLayerInput">\
	            <input type="text" class="PY_input" id="remark" value="">\
	            <a id="submit" href="javascript:void(0);" class="btn_normal"><em>' +
    $CLTMSG['CC1102'] +
    '</em></a>\
	        </div>\
	        <p class="errorTs yellow2" id="errorTip" style="display:none;">' +
    initErrorTip +
    '</p>\
	    </div>\
	</div>';
    //
    var cfg = {
        width: 390,
        zIndex: 1000,
        hidden: true
    };
    var dialog = new App.Dialog.BasicDialog($CLTMSG["CC3106"], html, cfg);
    dialog.show();
    
    var remark = $E("remark"), errorTip = $E("errorTip"), submit = $E("submit");
    var isChrome = (navigator.userAgent.toLowerCase().indexOf("chrome") != -1);
    if (isChrome) {
        submit.style.top = "-3px";
    }
    remark.focus();
    //连续设置备注时
    remark.value = (App._remarks_ && App._remarks_[fid]) || oldMark || remark.value;
    if (App._remarks_ && App._remarks_[fid] == "") {
        remark.value = "";
    }
    var init = true;
    Core.Events.addEvent(remark, function(){
        if (init && !oldMark && !(App._remarks_ && App._remarks_[fid])) {
            remark.value = "";
            init = false;
        }
    }, "focus");
    Core.Events.addEvent(remark, function(){
        var len = Core.String.byteLength(remark.value);
        if (len > 16) {
            errorTip.innerHTML = initErrorTip;
            errorTip.style.display = "block";
            setTimeout(function(){
                remark.focus();
            }, 100)
        }
        else 
            if (errorTip.innerHTML == initErrorTip) {
                errorTip.style.display = "none";
            }
    }, "blur");
    Core.Events.addEvent(remark, function(){
        var len = Core.String.byteLength(remark.value);
        if (len > 16) {
            //			errorTip.innerHTML = initErrorTip;
            //			errorTip.style.display = "block";
            //			setTimeout(function(){//延时主要是为使chrome下也有错误提示效果
            //				remark.value = Core.String.leftB(remark.value,16);
            //			},200);
            remark.value = Core.String.leftB(remark.value, 16);
        }
        else 
            if (errorTip.innerHTML == initErrorTip) {
                errorTip.style.display = "none";
            }
    }, "keyup");
    
    function setRemark(){
        //超过8则不提交 
        if (Core.String.byteLength(remark.value) > 16) {
            errorTip.innerHTML = initErrorTip;
            errorTip.style.display = "block";
            setTimeout(function(){
                remark.focus();
            }, 200);
            return;
        }
        var name = remark.value;
        App.doRequest({
            fuid: fid,
            remarkname: name
        }, "/attention/aj_remarkname.php", function(){
            App._remarks_ = App._remarks_ ||
            {};
            App._remarks_[fid] = name;//保存以备连续设置备注
            dialog.close();
            //他人首页更多操作 add by chibin
            if (scope.$pageid == "profile") {
                window.location.reload(true);
            }
            var remarkName = Core.Dom.getElementsByClass(el.parentNode.parentNode.parentNode, "span", "remark")[0];
            if (remarkName && Core.String.trim(name).length > 0) {
                remarkName.innerHTML = "&nbsp;(" + Core.String.encodeHTML(Core.String.trim(name)) + ")";
            }
            if (remarkName && Core.String.trim(name).length === 0) {
                remarkName.innerHTML = "";
            }
        }, function(){
            if (arguments[0] && arguments[0].code) {
                //原地显示错误提示
                errorTip.innerHTML = $SYSMSG[arguments[0].code];
                errorTip.style.display = "block";
            }
            else {
                App.alert($CLTMSG['CC3107'], {
                    icon: 2,
                    width: 370,
                    height: 120
                });
            }
        });
    }
    Core.Events.addEvent(submit, setRemark, "click");
    
    //回车亦提交
    App.enterSubmit({
        parent: submit.parentNode,
        action: function(){
            Core.Events.fireEvent(submit, "click");
        }
    });
};
