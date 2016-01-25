/**
 * @author chibin
 */
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/sinput/sinput.js");
$import("sina/core/function/bind2.js");
$import("diy/enter.js");
$import("diy/loginAction.js");
$import("diy/flyout.js");
$import("diy/timer.js");
$import("jobs/refurbishNumber.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/getTextAreaHeight.js");
$import("sina/core/string/byteLength.js");
$import("jobs/mod_login.js");
$import("diy/check_login.js");
$import("diy/forbidrefresh_dialog.js");
/**
 * 推荐层，负责转发消息，提供登陆功能
 * @param {Object} id
 */
App.modrecommended = function(forwardName, recommendedurl, fid, content, uid, el, exid, forwardContent, uname){
	if(!scope.loginKit().isLogin){
    	location.replace("/login.php?url="+ encodeURIComponent(location.href));
		return false;	
    }
	if(scope.$cuser_status === 'nofull' && scope.$uid !== ''){
		App.finishInformation();
		return false;
	}
    var appendurl;
    if (recommendedurl) {
        appendurl = recommendedurl;
    }
    else {
        appendurl = window.location.href;
    }
    var checkAT = function(content, name){
        if ((new RegExp('(@|＠)' + name + '([^a-zA-Z0-9\u4e00-\u9fa5_]|$)')).test(content)) {
            return true;
        }
        else {
            return false;
        }
        
    };
	
    //var regurl     = "/reg.php?inviteCode=" + (scope.$inviteCode?scope.$inviteCode:""); //版本回滚使用
    var forwardContentFinal = '';
    var testForwardName = decodeURIComponent(forwardName);
    var testForwardContent = decodeURIComponent(forwardContent);
    var defaultTxt = $CLTMSG['CD0045'].replace(/#\{name\}/,testForwardName);
    if (forwardContent == '' || forwardContent === undefined) {
        forwardContentFinal = defaultTxt;
    }
    else {
        forwardContentFinal = ' //@' + testForwardName + ':' + testForwardContent;
    }
    var title = $CLTMSG['CD0046'].replace(/#\{name\}/,testForwardName);
    var loginStr = '<div class="shareLogin">\
                    	<div id="loginerror"></div>\
						<em>' + $CLTMSG['CD0039'] + ' </em>\
                        <span class="cInputBorder"><span class="cInputborderR"><input type="text" id="logintitle" class="inputType"  style="width: 100px;"/></span></span>\
                        <em>' + $CLTMSG['CD0041'] + '</em>\
                        <span class="cInputBorder"><span class="cInputborderR"><input type="password" id="loginpwd" class="inputType" style="width: 100px;"/></span></span>\
                    	<div class="clear"></div>\
                    </div>';
					
    loginStr = scope.$uid ? "" : loginStr;
    var html = '\
			   <div class="shareLayer" id="recommendedcontent">\
                    <div class="shareTxt" id="recommendedcontent">' + $CLTMSG['CD0047'] + ':</div>\
					<div id="recommendedInfoBox" style="float:right;margin-right:13px;color:#008800"></div>\
                    <textarea class="PY_textarea" id="mdrecommendedtextarea" >' + forwardContentFinal + '</textarea>' +
    loginStr +
    '<div class="layerBtn">\
                 		<a href="javascript:void(0);" id="mdrecommendedbtn" class="btn_normal"><em>' + $CLTMSG['CD0048'] + '</em></a><a href="javascript:void(0)" id="mdrecommendedcancel" class="btn_normal"><em>' + $CLTMSG['CD0005'] + '</em></a>\
                 </div>\
                </div>';
    var cfg = {
        width: 390,
        zIndex: 1000,
        hidden: true
    };
    var dialog = new App.Dialog.BasicDialog(title, html, cfg);
    var mdforwardtextarea = $E("mdrecommendedtextarea");
    //Utils.Sinput.limitMaxLen(mdforwardtextarea,maxlen);
    var tipStringOK = $CLTMSG['CD0033'];
    var tipStringErr = $CLTMSG['CD0034'];
    var forwardInputLimit = function(){
        var num = Math.ceil(Core.String.byteLength(Core.String.trim(mdforwardtextarea.value)) / 2);
        //if (num > 140) {
        //100个汉字
        if (num > 100) {
            $E('recommendedInfoBox').innerHTML = tipStringErr.replace(/\$\{num\}/, (maxlen / 2 - num) * (-1));
            $E('recommendedInfoBox').style.color = '#880000';
            return false;
        }
        else {
            $E('recommendedInfoBox').innerHTML = tipStringOK.replace(/\$\{num\}/, (maxlen / 2 - num));
            $E('recommendedInfoBox').style.color = '#008800';
            return true;
        }
    };
    if (el) {
        App.doFlyOut(el, dialog._node, {
            resFun: function(){
                try {
                    dialog.show();
                    $E("mdrecommendedtextarea").focus();
                    if ($IE) {
                        //						var oSelector = $E("mdrecommendedtextarea_"+fid).createTextRange();
                        //						oSelector.moveStart('character',$E("mdrecommendedtextarea_"+fid).value.length);
                        //						oSelector.select(); 
                    }
                    else {
                        $E("mdrecommendedtextarea").setSelectionRange(0, 0);
                    }
                    forwardInputLimit();
                } 
                catch (e) {
                }
            },
            "style": "border:#000 2px solid;background:#bad;opacity:0.2;filter:alpha(opacity=20);zoom:1",
            time: 0.5
        });
    }
    else {
        dialog.show();
        $E("mdrecommendedtextarea").focus();
//        if ($IE) {
//            //			var oSelector = $E("mdrecommendedtextarea_"+fid).createTextRange();
//            //			oSelector.moveStart('character',$E("mdrecommendedtextarea_"+fid).value.length);
//            //			oSelector.select(); 
//        }
//        else {
//            //$E("mdrecommendedtextarea").setSelectionRange($E("mdrecommendedtextarea").value.length, $E("mdrecommendedtextarea").value.length);
//        }
        setTimeout(forwardInputLimit, 1);
    }
    var url = "/mblog/publish.php";
    var mdforwardbtn = $E("mdrecommendedbtn");
    var maxlen = 200;
    
    App.autoHeightTextArea(mdforwardtextarea, function(){
        setTimeout(forwardInputLimit, 1);
    }, 145);
    var loginerror = $E("loginerror");
    //var disClass = "mBlogBtn2";
	var disClass = "btn_notclick";
   // var enableClass = "mBlogBtn";
    var enableClass = "btn_normal";
    var name = $E("logintitle");
    var pwd = $E("loginpwd");
    
    var options = {
        zIndex: 1010,
        ref: name,
        wrap: loginerror,
        offsetY: -1,
        offsetX: 30
    };
    
    var mdforwardtextareaonfocus = function(){
        //		if(mdforwardtextarea.value == defaultTxt){
        //			mdforwardtextarea.value = "";
        //		}
//        if (mdforwardtextarea.createTextRange) {
//            var r = mdforwardtextarea.createTextRange();
//            r.moveStart('character', mdforwardtextarea.value.length);
//            r.collapse();
//            r.select();
//        }
    };
    
    mdforwardtextarea.onblur = function(){
        if (mdforwardtextarea.value == "") {
            mdforwardtextarea.value = defaultTxt;
        }
    };
    
    mdforwardtextarea.onkeydown = function(event){
        event = event || window.event;
        if (event.keyCode == 13 && event.ctrlKey) {
            mdforwardbtn.onclick();
        }
    };
    
    $E("mdrecommendedcancel").onclick = function(){
        dialog.close();
        return false;
    };
    
    function forwardSuccess(){
        var reason = mdforwardtextarea.value = Core.String.leftB(mdforwardtextarea.value, maxlen);
        //		if(reason == defaultTxt){
        //			reason = "";
        //		}
        var postdata = {
        
            content: reason.indexOf("@" + testForwardName) != -1 ? reason.replace(/'@'+testForwardName/gi, '@' + testForwardName + ' ').replace(/\uff20/ig, '@') + " " + appendurl : (reason + " @" + testForwardName).replace(/\uff20/ig, '@') + " " + appendurl,
            //mid: fid
            'from': scope['$pageid'],
			'styleid'	: 1,
			'retcode': scope.doorretcode || ''
        };
        if (scope.$pageid == "search") {
            postdata.from = 'search';
        }
        if ((scope.$pageid == "myprofile" || scope.$pageid == "search") && scope.$feedtype != "isori") {
            postdata.isindex = 1;
        }
        var cb = function(data, json){
            dialog.close();
            var cbdia = App.alert($CLTMSG["CX0032"], {
                icon: 3,
                ok: function(){
                    if (!scope.$uid) {
                        location.reload();
                    }
                },
				hasBtn: false
            });
            var itv = setTimeout(function(){
                try {
                    cbdia && (cbdia.close());
                    if (!scope.$uid) {
                        location.reload();
                    }
                } 
                catch (e) {
                
                }
            }, 1000);
            if (scope.$uid == scope.$oid && data && data.html) {
                cbdia.onClose = function(){
                    if (itv) {
                        clearTimeout(itv);
                        itv = null;
                    }
                    var feedlist = $E("feedlistwrap");
                    if (App.refurbishUpdate) {
                        App.refurbishUpdate.add(1);
                    }
                    if (feedlist) {
                        if (scope.$feedtype == 'isat') {
                            if (uname) {
                                //parameters.content = parameters.content.replace(/#[^#]*#/ig,'');
                                if (!checkAT(postdata.reason, uname)) {
                                    return false;
                                }
                            }
                        }
                        Core.Dom.insertHTML(feedlist, data.html, "AfterBegin");
                    }
                }
            }
            var num = $E(exid);
            if (num) {
                var count = num.innerHTML.match(/\d+/) || 0;
                num.innerHTML = '(' + (parseInt(count) + 1) + ")";
                num.style.display = "";
            }
        };
        var ecb = function(json){
            mdforwardbtn.className = enableClass;
			if(json.code === "MR0050"){
                App.forbidrefresh(function(){
                    Core.Events.fireEvent(mdforwardbtn,"click");
                },url);
                return false;
            }
            App.alert(json, {
                ok: function(){
                    if (!scope.loginKit().isLogin) {
                        location.reload();
                    }
                },
				hasBtn: true
            });
        };
        App.doRequest(postdata, url, cb, ecb);
    };
    
    function errortTip(str, el){
        el.focus();
        App.fixElement.setHTML(str, "", options);
        mdforwardbtn.className = enableClass;
        return false;
    };
    
    if (!scope.loginKit().isLogin) {
        /**
         * 登录层下来框
         */
        passcardOBJ.init(name, {
            overfcolor: "#999",
            overbgcolor: "#e8f4fc",
            outfcolor: "#000000",
            outbgcolor: ""
        }, pwd, window);
        App.initLoginInput(name);
    }
    mdforwardbtn.onclick = function(){
        if (!forwardInputLimit()) {
            var orbit = ['#fff', '#fee', '#fdd', '#fcc', '#fdd', '#fee', '#fff', '#fee', '#fdd', '#fcc', '#fdd', '#fee', '#fff'];
            var index = 0;
            var hook = App.timer.add(function(){
                if (index / 2 >= orbit.length) {
                    App.timer.remove(hook);
                    return false;
                }
                mdforwardtextarea.style.backgroundColor = orbit[index / 2];
                index += 1;
            });
            return false;
        }
        if (mdforwardbtn.className == disClass) {
            return false;
        }
        mdforwardbtn.className = disClass;
        if (scope.loginKit().isLogin) { //用户已经登录
            forwardSuccess();
        }
        else {
			App.ModLogin(function(){
				forwardSuccess
			});
        }
        return false;
    };
    App.enterSubmit({
        parent: 'forwardcontent',
        action: function(){
            mdforwardbtn.onclick();
        }
    });
};
