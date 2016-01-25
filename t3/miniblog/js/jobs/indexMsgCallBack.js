/**
 * @author Liusong liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/iframeMask.js");
$import("diy/loginAction.js");
$import("sina/core/events/fireEvent.js");
$import("diy/querytojson.js");
$import("diy/forbidrefresh_dialog.js");
$registJob("indexMsgCallBack", function(){
    var follow = '\
		<div class="f_nologin1">\
        	<div class="close"><a href="javascript:void(0);" onclick="scope.cancelFollow();return false;"/></div>\
            <div class="btn"><a href="javascript:void(0);" onclick="scope.followoid(this);return false;"><img src='+scope.$BASEIMG+'style/images/index/nologin_btn.gif"/></a></div>\
		</div>';
    
    var login = '\
		<div id="login_wrap" class="f_nologin2">\
        	<div class="close"><a href="javascript:void(0);" onclick="scope.closeContentHidden();"></a></div>\
            <div class="login">' + $CLTMSG['CC1801'] + '<input id="followLoginUser" type="text" class="txt"/>' + $CLTMSG['CC1802'] + '<input id="followLoginPassword" type="password" class="txt"/><input type="button" onclick="scope.followLogin(this);return false;" class="subBtn" value=""/></div>\
            <div class="ts">' +
    $CLTMSG['CC1803'] +
    '</div>\
			<!-- <div class="errorTs">' +
    $SYSMSG['M01112'] +
    '</div> -->\
          <div class="ts2">' +
    $SYSMSG['CC1804'] +
    '<a target="_blank" href="/reg.php?code=' +
    App.queryToJson(window.location.search.slice(1)).code +
    '">' +
    $SYSMSG['CC1805'] +
    '</a></div>\
        </div>';
    
    var followSuccess = '\
		<div class="f_nologin3">\
        	<div class="ok"/>\
        </div>';
    
    
    var contentPanel = scope.contentPanel = document.getElementsByTagName("body")[0].appendChild($C("div"));
    contentPanel.style["display"] = "none";
    contentPanel.style.position = "absolute";
    contentPanel.style.zIndex = 800;
    if (scope.$actStatus) {
        switch (scope.$actStatus) {
            case 1:
                contentPanel.innerHTML = follow;
                break;
            case 2:
                contentPanel.innerHTML = login;
                passcardOBJ.init($E("followLoginUser"), {
                    overfcolor: "#999",
                    overbgcolor: "#e8f4fc",
                    outfcolor: "#000000",
                    outbgcolor: ""
                }, $E("followLoginPassword"), parent);
                App.enterSubmit({
                    parent: 'login_wrap',
                    action: function(){
                        scope.followLogin();
                    }
                });
                break;
            default:
                break;
        }
        var rePos = function(aPos){
            this.style.left = (aPos[2] - this.offsetWidth) / 2 + "px";
            this.style.top = (aPos[3] - this.offsetHeight) / 2 + "px";
        }
.bind2(contentPanel);
        
        scope.closeContentHidden = function(){
            scope.contentMask.hidden();
            scope.contentPanel.style["display"] = "none";
        }
        
        scope.cancelFollow = function(){
            var url = new Utils.Url(window.location.href + "");
            var uid = url.getParam("uid");
            if (uid != null) {
                window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + "?uid=" + uid;
            }
            else {
                scope.closeContentHidden();
            }
        };
        
        scope.followoid = function(elm){
            //chibin add 防止恶意加关注
            ___followoid(elm,{
                    "uid": scope.$oid,
                    "fromuid": scope.$uid
                });
        };
        function ___followoid(elm,param){
            Utils.Io.Ajax.request("/attention/aj_addfollow.php", {
                "POST": param||{},
                "onComplete": function(oResult){
                    if (oResult.code == "A00006") {
                        this.innerHTML = followSuccess;
                        scope.contentMask.oMaskResize();
                        setTimeout(function(){
                            var url = new Utils.Url(window.location.href + "");
                            var uid = url.getParam("uid");
                            if (uid != null) {
                                window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + "?uid=" + uid;
                            }
                            else {
                                scope.closeContentHidden();
                            }
                        }, 3000);
                    }
                    else if (oResult&&oResult.code == 'MR0050') {
				            App.forbidrefresh(function(){
				                param['retcode']=scope.doorretcode;
				                ___followoid(elm,param);
				            },'/attention/aj_addfollow.php')
				        }
					else{
                        scope.closeContentHidden();
                        App.alert(App.getMsg(oResult.code));
                    }
                }
.bind2(contentPanel)                ,
                returnType: "json"
            });
        }
        
        
        function checkForm(el, errStr){
            if (!Core.String.trim(el.value)) {
                setTimeout(function(){
                    App.alert(errStr)
                }, 20);
                return false;
            }
            return true;
        }
        
        scope.followLogin = function(elm){
            var oUserInput = $E("followLoginUser");
            var oPasswordInput = $E("followLoginPassword");
            if (!checkForm(oUserInput, $SYSMSG["M00901"]) || !checkForm(oPasswordInput, $SYSMSG["M00902"])) {
                return false;
            }
            if (oUserInput && oPasswordInput) {
                var cfg = {
                    "name": oUserInput.value,
                    "pwd": oPasswordInput.value,
                    "remb": false,
                    "succ": function(){
                        if (scope.$actCallBackUrl) {
                            window.location.href = window.location.protocol + "//" + window.location.host + scope.$actCallBackUrl;
                        }
                    },
                    "error": function(err){
                        App.alert(err, {
                            icon: 1
                        });
                    }
                };
                App.LoginAction(cfg);
            }
            return false;
        };
        contentPanel.style["display"] = "block";
        scope.contentMask = App.iframeMask(799, rePos);
        scope.contentMask.show();
    }
    
});
