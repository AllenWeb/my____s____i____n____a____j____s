/**
 * @fileoverview 隐私设置
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/curtain.js");
$import("diy/htmltojson.js");

$registJob('privacy', function(el){
    var sUrl = "http://t.sina.com.cn/person/privacy_post.php";
    Core.Events.addEvent($E("submit"), function(){
        var oData = App.htmlToJson($E("setup_main"));
        App.doRequest(oData, sUrl, function(data, result){
            handleTip($E("tip"), result);
        }, function(result){
            handleTip($E("tip_fail"), result);
        });
    }, "click", false);
    App.clearmap = function(id){
        Utils.Io.Ajax.request('/person/aj_clearmapmsg.php', {
            GET: {
                type: 'check'
            },
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    var con = App.confirm({
                        code: 'CC3924'
                    }, {
                        ok: function(){
                            Utils.Io.Ajax.request('/person/aj_clearmapmsg.php', {
                                GET: {
                                    type: 'clear'
                                },
                                'onComplete': function(json){
                                    if (json.code == 'A00006') {
                                        $E(id).style.display='none';
                                        con.close();
										var tip = App.alert($CLTMSG['CC3926'],{icon:3,hasBtn: false});
										setTimeout(function(){
											tip.close();
										},600)
                                    }
                                    else {
                                        handleTip($E("tip_fail"), {
                                            code: json.code
                                        });
                                        con.close();
										location.href="#";
                                    }
                                },
                                'onException': function(){
                                    error();
                                },
                                'returnType': 'json'
                            })
                        }
                    });
                }
                else {
                    location.href="#";
					handleTip($E("tip_fail"), {
                        code: json.code
                    });
                }
            },
            'onException': function(){
                error();
            },
            'returnType': 'json'
        })
    };
    
    
    Utils.Io.Ajax.request('/mblog/publish.php', {
        'POST': parameters,
        'onComplete': function(json){
            if (json.code == 'A00006') {
                success(json.data, parameters);
            }
            else 
                if (json.code == 'M00008') {
                    window.location.replace(json.data);
                }
                else {
                    error(json);
                }
        },
        'onException': function(){
            error();
        },
        'returnType': 'json'
    });
    function handleTip(oTip, oResult){
        if (oResult.code === "M00003") {
            App.ModLogin(null, $CLTMSG["CD0058"]);
            return;
        }
//        if (oResult && oResult.code) {
//            oTip.style.display = "block";
//            App.curtain.droop(oTip);
//            setTimeout(function(){
//                App.curtain.raise(oTip);
//                oTip.style.cssText = "display:none;";//key!
//            }, 1500);
//        }
        App.promptTip({code:oResult.code},'',oTip,'ok')
    }
});
