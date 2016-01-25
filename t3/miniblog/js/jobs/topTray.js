/**
 * 顶部托盘，及个，性模板设置
 * @fileoverview
 *  scope.seting   显示设置菜单
 *  scope.msgClose 关闭黄色关注通知~！！~~！！~~哦y!
 *  scope.setSkin  预览个,性模板
 *  scope.postSkin 保存个，性模板
 * @author Liusong liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("diy/mb_dialog.js");
$import("sina/core/events/stopEvent.js");
$import("diy/prompttip.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertAfter.js");
$import("jobs/cardtips.js");
$import("jobs/mod_login.js");
$import("diy/rollOut.js");
$import("diy/check_login.js");

$import("sina/core/dom/getXY.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/contains.js");
$import("jobs/langSelect.js");
$import("diy/swfobject.js");
$import("diy/dom.js");

/**
 * 静态页统计函数
 * @param{Object}oGet, 必选参数，些参数用于汇报统计参数
 * @param{String}sUrl,可选参数，默认"http://hits.sinajs.cn/c.html?"
 * @example
 * scope.statistics({
 *       "type"   : "open_video",
 *       "source" : "toudou.com"
 * });
 * @author liusong@staff.sina.com.cn
 */
scope.statistics = (function(){
    var s, aQuerry = [], i, h = document.getElementsByTagName("head")[0], url;
    return function(oGet, sUrl){
        try {
            if (!oGet) {
                return false
            };
            if (!oGet.uid) {
                oGet.uid = scope.loginKit().uid
            }
            if (s) {
                s.parentNode.removeChild(s)
            }
            for (i in oGet) {
                aQuerry.push("".concat(i, "=", oGet[i]))
            }
            s = document.createElement("script");
            s.charset = "utf-8";
            url = sUrl ? sUrl : "http://hits.sinajs.cn/c.html?";
            s.src = [url, aQuerry.join("&")].join("");
            h.appendChild(s);
        }
        finally {
            i = null;
            aQuerry = [];
        }
    };
})();


/**
 * 显示设置菜单
 */
scope.seting = function(){
    var sp;
    if (sp = $E("top_tray_seting_panel")) {
        var sps = sp.style;
        sps["display"] = (sps["display"] == "none") ? "block" : "none";
        Core.Events.stopEvent();
        if (!sp.bind2body) {
            Core.Events.addEvent(document.body, function(){
                var sp;
                if (sp = $E("top_tray_seting_panel")) {
                    sp.style["display"] = "none";
                }
            }, "click");
            sp.bind2body = true;
        }
    }
};

/**
 * 预览个,性模板
 * @param {String} value 必选参数，模板id
 */
scope.setSkin = function(value){
    var st;
    if (st = $E("skin_transformers")) {
        var url = st.href + "";
        var path = url.substring(0, url.lastIndexOf("n/") + 2);
        st.href = path + value + "/skin.css";
        
        //start 发送模板预览统计信息--------
        scope.statistics({
            'skin': value
        }, "/person/skin_view.php?");
        //end
        
        scope.postSkinId = value;
        var selectedLi = Core.Dom.getElementsByClass($E("skin_ul"), "li", "selected")[0];
        if (selectedLi != null) {
            selectedLi.className = "";
        }
        var selectLi = $E("li_" + value);
        if (selectLi) {
            selectLi.className = "selected";
        }
    }
};

/**
 * 保存个，性模板
 */
scope.postSkin = function(){
    if (scope.postSkinId) {
        Utils.Io.Ajax.request("/person/skin_post.php", {
            "onComplete": function(oResult){
                App.promptTip(oResult, null, "system_information", (oResult.code == "A00006") ? "ok" : "wrong");
                setTimeout(function(){
                    window.location.href = "/" + scope.$uid;
                }, 1000);
            },
            "onException": function(e){
            },
            "returnType": "json",
            "POST": {
                skin: scope.postSkinId
            }
        });
    }
};

/**
 * 关闭黄色关注通知~！！~~！！~~哦y!
 */
scope.msgClose = function(){
    var mp;
    if (mp = $E("top_tray_msg_panel")) {
        mp.style["display"] = "none";
        Utils.Io.Ajax.request("/public/del_unread.php", {
            "onComplete": function(oResult){
                if (oResult.code != "A00006") {
                    App.alert(App.getMsg(oResult.code));
                }
            },
            "onException": function(e){
            },
            "returnType": "json",
            "POST": {}
        });
    }
    
};

/**
 * 加班收藏夹
 */
App.addfavorite = function(url, text){
    if (document.all) {
        window.external.addFavorite(url, text);
    }
    else 
        if (window.sidebar) {
            window.sidebar.addPanel(text, url, "");
        }
    return false;
};

///*
// * 轮询查黄色关注通知
// */
//(function(){
//	var clock, count = 0, sync;
//	Boot.addDOMLoadEvent(function(){
//		var toptip = $E("top_tray_msg_panel"), request, ts = (toptip||{}).style, yt = $E("toptray_yellow_tip"), ftip = $E("feed_msg_new"), fs = (ftip||{}).style, r = false;
//		function setTip(data){
//			try {
//				var s = [], d = data.data, c = d.comment, m = d.msg, a = d.atme, t = d.attention.num, f = d.feed;
//				c > 0 && s.push('<div class="l_1">' + c + $CLTMSG['CX0050'] + '<a href="/comments">' + $CLTMSG['CX0051'] + '</a></div>');
//				t > 0 && s.push('<div class="l_1">' + t + $CLTMSG['CX0052'] + '<a href="http://t.sina.com.cn/' + scope.$uid + '/fans">' + $CLTMSG['CX0053'] + '</a></div>');
//				m > 0 && s.push('<div class="l_1">' + m + $CLTMSG['CX0054'] + '<a href="/messages">' + $CLTMSG['CX0055'] + '</a></div>');
//				a > 0 && s.push('<div class="l_1">' + a + $CLTMSG['CX0056'] + '<a href="/atme">' + $CLTMSG['CX0057'] + '</a></div>');
//				ts && (ts.display = "none") && (s = s.join(" ")) && yt && (yt.innerHTML = s) && (ts.display = "");
//				fs && (fs.display=="none") && (f > 0) && ftip && (function(){
//					ftip.onclick = function(){
//						if(!scope.$uid){return}
//						window.location.href = "/" + scope.$uid;
//						return false;
//					};
//					ftip.innerHTML = $CLTMSG['CX0058'];
//					App.rollOut(ftip);
//					r = true;
//				})();
//			}catch(e){}
//		}
//		request = function(){
//			Utils.Io.Ajax.request("/public/aj_count.php",{
//				"onComplete": setTip,
//				"onException": function(e){},
//				"returnType": "json",
//				"GET": {
//					'uid': scope.$uid,
//					'oid': scope.$oid,
//					'firstmid': scope.$firstid,
//					'count': (count++) + ""
//				}
//			});
//		};
//		request();
//		//预设轮循起动
//		clock = setInterval(function(){
//			request();
//		}, 30000);
//		//如果flash同步起动则干掉js轮循
//		App.SyncReady = function(){
//			clearInterval(clock);
//			sync = swfobject.getObjectById("LocalSync");
//			App.syncDeg = function(){
//				sync.style.width = "800px";
//				sync.style.height = "800px";
//				sync.parentNode.style.width = "800px";
//				sync.parentNode.style.height = "600px";
//			};
//			App.sync = function(c){
//				data = eval("(" + c + ")");
//				setTip(data);
//			};
//		};
//		//插入swf
//		var d = document, b = d.body, wrap = $C("div"), swfWrap = $C("div");
//			swfWrap.id = "LocalSync"; 
//			wrap.appendChild(swfWrap);
//			b.appendChild(wrap);
//		with (wrap.style) {
//			position = "absolute";
//			left   = "0px";
//			top    = "0px";
//			width  = "0px";
//			height = "0px";
//			zIndex = "99999";
//			overflow = "hidden";
//		}
//		var flashParams = {	id:"LocalSync",	name:"LocalSync", quality: "high", allowScriptAccess: "always",	allowFullscreen: true},
//			flashVars = { uid: scope.$uid, oid: scope.$oid,	fid: scope.$firstid};
//			swfobject.embedSWF(	[scope.$BASESTATIC+"miniblog/static/swf/Sync.swf",Boot.getJsVersion()].join(""), "LocalSync", "0", "0", "10.0.0", null, flashVars,	flashParams	);
//	});
//})();
(function(){
    Boot.addDOMLoadEvent(function(){
//		var addScrollListener = function(ftip){
//			var w = App.ELSize(ftip, "width", false);
//			var _div = $C("div");
//			ftip.parentNode.insertBefore(_div, ftip);
//			_div.appendChild(ftip);
//			var isInView = true;//是否在视图内
//			var setFixedIE = function(){
//				Core.Dom.setStyle(ftip, "position", "relative");
//				Core.Dom.setStyle(ftip, "width", w+"px");
//				Core.Dom.setStyle(ftip, "zIndex", "500");
//				Core.Dom.setStyle(ftip, "top", Core.System.getScrollPos(document)[0] - Core.Dom.getXY(ftip.parentNode)[1]  + "px");
//				Core.Dom.setStyle(ftip, "visibility", "visible");
//			}
//			var setFixed = function(inView){
//				Core.Dom.setStyle(_div, "overflow", "hidden");
//				Core.Dom.setStyle(ftip, "width", w+"px");
//				Core.Dom.setStyle(ftip, "position", "fixed");
//				Core.Dom.setStyle(ftip, "top", "0px");
//				Core.Dom.setStyle(ftip, "left", Core.Dom.getXY(ftip.parentNode)[0] - Core.System.getScrollPos(document)[1] + "px");
//				Core.Dom.setStyle(ftip, "zIndex", "500");
//				Core.Dom.setStyle(ftip, "visibility", "visible");
//			}
//			//如果第一次出现黄条提醒时，黄条的原始位置在视图外，则调用setFixed重新定位
//			if (Core.System.getScrollPos(document)[0] > Core.Dom.getXY(ftip.parentNode)[1] && Core.Dom.getStyle(ftip, "display") !== "none") {
//					if ($IE6) {
//						Core.Dom.setStyle(_div, "position", "absolute");
//						Core.Dom.setStyle(_div, "zIndex", "500");
//					}
//					$IE6 || Core.Dom.setStyle(_div, "height", "0px");
//					setTimeout(function(){
//						$IE6 && setFixedIE();
//						$IE6 || setFixed();
//					}, 300);
//			}
//			$IE6 || Core.Events.addEvent(window, function(){
//				if(Core.Dom.getStyle(ftip, "display") !== "none"){
//					Core.Dom.setStyle(ftip, "left", Core.Dom.getXY(ftip.parentNode)[0] - Core.System.getScrollPos(document)[1] + "px");
//				}
//			}, "resize");
//			
//			Core.Events.addEvent(window, (function(){
//				var timer = "";
//				return function(){
//					timer && clearTimeout(timer);
//					if(Core.Dom.getStyle(ftip, "display") === "none"){
//						return;
//					}
//					isInView = (Core.System.getScrollPos(document)[0] < Core.Dom.getXY(ftip.parentNode)[1]);
//					if (isInView){
//						Core.Dom.setStyle(_div, "height", "30px");
//						Core.Dom.setStyle(_div, "position", "");
//						Core.Dom.setStyle(ftip, "position", "");
//						Core.Dom.setStyle(ftip, "visibility", "visible");
//					}
//					else {
//						Core.Dom.setStyle(ftip, "visibility", "hidden");
//						timer = setTimeout(function(){
//								$IE6 && setFixedIE();
//								$IE6 || setFixed();
//						}, 500);
//						return;
//					}	
//				}
//			})(),"scroll");
//		}
		
        WBTopTray.addListener('breath', function(data){
            try {
                var toptip = $E("top_tray_msg_panel"), request, ts = (toptip ||
                {}).style, yt = $E("toptray_yellow_tip"), ftip = $E("feed_msg_new"), fs = (ftip ||
                {}).style, r = false;
                var s = [], d = data, c = d.comment, m = d.msg, a = d.atme, t = d.attention.num, f = d.feed;
                c > 0 && s.push('<div class="l_1">' + c + $CLTMSG['CX0050'] + '<a href="/comments">' + $CLTMSG['CX0051'] + '</a></div>');
                t > 0 && s.push('<div class="l_1">' + t + $CLTMSG['CX0052'] + '<a href="http://t.sina.com.cn/' + scope.$uid + '/fans">' + $CLTMSG['CX0053'] + '</a></div>');
                m > 0 && s.push('<div class="l_1">' + m + $CLTMSG['CX0054'] + '<a href="/messages">' + $CLTMSG['CX0055'] + '</a></div>');
                a > 0 && s.push('<div class="l_1">' + a + $CLTMSG['CX0056'] + '<a href="/atme">' + $CLTMSG['CX0057'] + '</a></div>');
                ts && (ts.display = "none") && (s = s.join(" ")) && yt && (yt.innerHTML = s) && (ts.display = "");
                fs && (fs.display == "none") && (f > 0) && ftip &&
                (function(){
                    ftip.onclick = function(){
                        if (!scope.$uid) {
                            return
                        }
						//window.scrollTo(0, 0);//先滚到头，再刷新...
                        window.location.href = "/" + scope.$uid;
                        return false;
                    };
                    ftip.innerHTML = $CLTMSG['CX0058'];
					App.rollOut(ftip);
//					if (scope.$pageid !== "skin") {
//						addScrollListener(ftip);
//					}
                    r = true;
                })();
            } 
            catch (e) {
            }
        })
    })
})()
/**
 * 打开举报窗口
 * @author by chibin 2009-9-4
 */
App.reportOpenWin = function(url){
    if (!scope.$uid) {
        var initErrorTip = $CLTMSG['CX0059'];
        App.ModLogin({
            "func": function(){
                window.open(url, $CLTMSG['CX0060'], 'height=538px,width=450px,toolbar=no, menubar=no,resizable=no,location=no, status=no');
            },
            "initErrorTip": initErrorTip
        });
        return;
    }
    window.open(url, $CLTMSG['CX0060'], 'height=538px,width=450px,toolbar=no, menubar=no,resizable=no,location=no, status=no');
};

/**
 * 关闭是否接收新评论提醒
 * @author by wangliang 2010-07-01
 */
App.closeTips = function(){
    Core.Events.stopEvent();
    var obj = Core.Events.getEventTarget();
    var tip = obj;
    for (; !App.Dom.hasClass(tip, 'Mblog_tips_tl'); tip = obj.parentNode) 
        ;
    if (tip) {
        tip.style.display = 'none';
    }
};
