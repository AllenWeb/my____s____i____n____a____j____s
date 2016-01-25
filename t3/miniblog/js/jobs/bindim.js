$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/dialog.js");
$import("diy/check.js");
$import("diy/htmltojson.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js")
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("diy/prompttip.js");
 

/**
 * ==================================================================
 *                            IM机器人绑定
 * 基本功能描述
 *   跟据 scope.$bindimstatus 中的当前状态初始化当前绑定界面
 *   用户点击需要绑定的聊天工具，打开当前状态界面，并跟据状态初始化动作
 * ================================================================== 
 *  @fileoverview
 *  此文件定义了与用户直接交互的三个函数
 * ==================================================================
 *   App.bindim       绑定im
 *   App.cancelbind   取消绑定
 *   App.setoption    设置im参数
 * ==================================================================
 *  该程序会依赖网页中的 scope.$bindimstatus {Object}
 *  该对象用于描述{msn,gtalk,uc,qq}的绑定状态
 *  状态分3种，0为未绑定, 1为已设置但未验证, 2为已绑定
 *  @example
 *   scope.$bindimstatus = {
 *      msn   : "1",
 *      gtalk : "0",
 *      uc    : "0",
 *      qq    : "0"
 *   }
 * ==================================================================
 *  在初始化im绑定时，会传配置参数 oConf {Array}
 *  该数组用于初始化绑定不同的聊天工具
 *   [{
 *          type         : "msn",                      //绑定类型
 *          btn          : $E("msn"),                  //绑定按钮
 *          panel        : $E("msnoption"),            //选项容器
 *          api          : "/plugins/imbot/aj_im.php",         //绑定接口
 *          cancelApi    : "/plugins/imbot/aj_delim.php",      //取消绑定接口
 *          loopApi      : "/plugins/imbot/aj_statusim.php",   //轮循接口
 *          normClass    : "m2",                       //默认样式
 *          selectClass  : "m1",                       //选中样式
 *          setingClass  : "m2",                       //设置样式
 *          enabledClass : "m4",                       //不可用样式
 *          errorNum     : "M01126",                   //报错提示
 *          checkFunc    : App.checkEml                //内容验证方法
 *    },...]
 * ==================================================================
 * @author liusong liusong@staff.sina.com.cn
 * @version v1.0
 */


App.bindim     = function(){ return false };
App.cancelbind = function(){ return false };
App.setoption  = function(){ return false };

$registJob('bindimrobot', function(){
    scope.$bindimstatus = scope.$bindimstatus||{};
    (function(oConf, oGlobal){
        var i = 0,len = (oConf||[]).length,currentBtn,clock;
        //获取指定容器下的id对象
        var getId = function(oParent, sTagName, sId){
            var list = oParent.getElementsByTagName(sTagName);
            var len = list.length;
            var i = 0;
            if(!len){return}
            for(; i<len; i++){
                if(list[i].id == sId){
                    return list[i];
                }
            }
        }
        //全组控制
        var group = (function(){
            var $_ = {},i=0;
            $_.foreach = function( fExecute, oArg ){
                try {
                    for (; i < len; i++) {
                        oConf[i][fExecute].apply(null,[].concat(oArg));
                    }
                }finally{ i=0 }
            };
            return $_;
        })();
        //单组控制管理
        var item = function($_){
            var s = {"imbind":0,"imauth":1,"imset":2};
            //设置当前组绑定状态
            $_.setBindState = function(stateNum){
                $_.valid && (function(){
                    for(var i in s){
                        var p = getId($_.panel,"div",i);
                        if(p){
                            if(s[i]==stateNum){
                                $_.dataPanel = p;
                                $_.clock.stop();
                                p.style.display = "";
                                $_.bindState = stateNum;
                            }else{
                                p.style.display = "none";
                            }
                        }
                    }
                })();
            };
            //设置当前按钮状态，设置按钮样式
            //当 scope.$bindimstatus[type] 值为0时，显示点击绑定
            //当 scope.$bindimstatus[type] 值为1时，显示未验证
            //当 scope.$bindimstatus[type] 值为0时，显示已绑定
            $_.setState = function( sType ){
                if(!$_.btn){return}
                var valid = $_.valid;
                var classValue = $_[sType + "Class"];
				if ($_.msg ) $_.msg.style.display = 'none';
                var stateValue = $_.bindState==2?$CLTMSG['CC0203']:$_.bindState==1?$CLTMSG["CC0202"]:$CLTMSG['CL0820'];
                switch(sType){
                    case "norm":
                        classValue = valid?classValue:$_["enabledClass"];
                        stateValue = valid?stateValue:$CLTMSG["CL0821"];
                    break;
                    case "select":
                    case "seting":
                        classValue = valid?classValue:$_["enabledClass"];
                        stateValue = "";
                    break;
                    case "enabled":
                    break;
                }
                $_.btn.innerHTML = '<a href="javascript:;" class="' + classValue + '">' + (stateValue?["<span>",stateValue,"</span>"].join(""):"") + '</a>';
                $_.currentType = valid?sType:"enabled";
            };
            //单组时间管理
            $_.clock = (function(){
                var c,n = {};
                n.stop  = function(){
                    window.clearInterval(c);
                };
                n.start = function(f,t){
                    n.stop();
                    c = window.setInterval(f,t||2000);
                };
                return n;
            })();
            //单组时间轮循
            $_.loop = (function(){
                var fail = function(){};
                //轮循成功获取返回值时调用
                var succ = (function($_){
                    return function(oResult){
                        if(!oResult||!oResult.code){return;}
                        //当返回值为A00006时，为正常轮循返回，此时用户尚未输入验证码
                        //在oResult.data中为
                        if (oResult.code == "A00006") {
                            var imcode = getId($_.dataPanel, "input", "imcode");
                            if(imcode && oResult.imcode){
                                imcode.value = oResult.imcode;
                            }
                        }
                        //当用户向机器人发送验证码后轮循返回值会获得"M12002"此时绑定已成功
                        else if(oResult.code == "M12002"){
                            $_.setBindState(2);
                            //非二次进入页面，此动作会向当前状态容器假写绑定地址
                            var imaccountPanel = getId($_.dataPanel, "span", "imaccount_panel");
                            if (imaccountPanel && $_.ac) {
                                imaccountPanel.innerHTML = "";
                                var textNode = document.createTextNode("(" + $_.ac + " ");
                                imaccountPanel.appendChild(textNode);
                            }
                            //非二次进入页面,此动作会同步用户之前保存的checkbox选择状态
                            if($_.dataPanel){
                                var inputs = $_.dataPanel.getElementsByTagName("input");
                                var len = inputs.length;
                                len && $_.data && (function(){
                                    var i = 0;
                                    if(!$_.data){return false}
                                    for(; i<len; i++){
                                        var inp = inputs[i];
                                        if(inp.type!="checkbox"){continue}
                                        inp.checked = false;
                                        if(inp.name && inp.name in $_.data){
                                            inp.checked = true;
                                        }
                                    }
                                })();
                                App.promptTip($CLTMSG["CL0822"], "", "bindsuc", "ok");
                            }
                        }else{
                            fail(oResult);
                        }
                    }
                })($_);
                return function(){
                    if($_.bindState!=1){return}
                    $_.clock.start((function($_){
                    //返回失败
                    return function(){
                        Utils.Io.Ajax.request($_.loopApi, {
                            "POST"        : {uid:scope.$uid,type:$_.type},
                            "onComplete"  : succ,
                            "onException" : fail,
                            "returnType"  : "json"
                        });
                    }})($_),5000);
                }
            })();
            //单组解除绑定
            $_.cancelbind = function(){
                App.confirm($CLTMSG["CC0204"], {
                ok: function(){
                    //解除绑定数据发送失败
                    var fail = (function($_){
                        return function(oResult){
                            var value = $SYSMSG["M14111"];
                            if (oResult && oResult.code) {
                                value = $SYSMSG[oResult.code];
                            }
                            App.alert(value);
                        }
                    })($_);
                    //解除绑定数据发送成功
                    var succ = (function($_){
                        return function(oResult){
                            if (oResult && oResult.code == "A00006") {
                                $_.clock.stop();
                                $_.setBindState(0);
                            }else{
                                fail(oResult);
                            }
                        }
                    })($_);
                    Utils.Io.Ajax.request($_.cancelApi, {
                        "POST"        : {uid:scope.$uid||"",type:$_.type},
                        "onComplete"  : succ,
                        "onException" : fail,
                        "returnType"  : "json"
                    });
                }
            })};
            //设置im
            $_.setoption = function(){
                if ($_.dataPanel) {
                    var data = App.htmlToJson($_.dataPanel);
                    data["uid"] = scope.$uid;
                    //返回失败
                    var fail = (function($_){
                        return function(oResult){
                            var value = $SYSMSG["M14110"];
                            if (oResult && oResult.code) {
                                value = $SYSMSG[oResult.code];
                            }
                            App.alert(value);
                        }
                    })($_);
                    //绑定数据发送成功
                    var succ = (function($_){
                        return function(oResult){
                            if (oResult && oResult.code == "A00006") {
                                App.promptTip($CLTMSG["CL0823"], "", "bindsuc", "ok");
                            }else{
                                fail(oResult);
                            }
                        }
                    })($_);
                    Utils.Io.Ajax.request($_.api, {
                        "POST"        : data,
                        "onComplete"  : succ,
                        "onException" : fail,
                        "returnType"  : "json"
                    });
                }
            };
            //绑定im
            $_.bindim = function(){
                if ($_.dataPanel) {
                    var data = App.htmlToJson($_.dataPanel);
                    var ac = Core.String.trim(data["account"]);
                    if (!ac || !$_.checkFunc(ac) || Core.String.byteLength(ac) > 64) {
                        App.alert({
                            code: $_.errorNum
                        });
                        return false;
                    }
                    $_.data = data;
                    $_.ac = ac;
                    data["uid"] = scope.$uid;
                    //返回失败
                    var fail = (function($_){
                        return function(oResult){
                            var value = $SYSMSG["M14110"];
                            if (oResult && oResult.code) {
                                value = $SYSMSG[oResult.code];
                            }
                            App.alert(value);
                        }
                    })($_);
                    //绑定数据发送成功
                    var succ = (function($_){
                        return function(oResult){
                            if (oResult && oResult.code == "A00006") {
                                $_.setBindState(1);
                                $_.loop();
                                //非二次进入页面，此动作会向当前状态容器假写绑定地址
                                var imaccountPanel = getId($_.dataPanel, "span", "imaccount_panel");
                                if (imaccountPanel && $_.ac) {
                                    imaccountPanel.innerHTML = "";
                                    var textNode = document.createTextNode("(" + $_.ac + " ");
                                    imaccountPanel.appendChild(textNode);
                                }
                                //非二次进入页面，此动作会向当前状态容器假写验证码
                                var imcode = getId($_.dataPanel, "input", "imcode");
                                if(imcode && oResult.imcode){
                                    imcode.value = oResult.imcode;
                                }
                                //非二次进入页面，此动作会向当前状态容器假写当前绑定机器人地址
                                var bot = getId($_.dataPanel,"span","bot");
                                if(bot){
                                    if(oResult.data && oResult.data.account){
                                        bot.innerHTML = "";
                                        var textNode = document.createTextNode(oResult.data.account);
                                        bot.appendChild(textNode);
                                    }
                                }
                            }else{
                                fail(oResult);
                            }
                        }
                    })($_);
                    Utils.Io.Ajax.request($_.api, {
                        "POST"        : data,
                        "onComplete"  : succ,
                        "onException" : fail,
                        "returnType"  : "json"
                    });
                }
            };
            return $_;
        };
        //startup
        len && (function(){
            for(var i = 0; i<len; i++){
                (function(){
                    var $_ = item(oConf[i]);
                    //获取绑定状态
                    $_.bindState = scope.$bindimstatus[$_.type]||0;
                    $_.valid = $_.panel?true:false;
                    //初始化显示
                    $_.setState("norm");
                    oGlobal.buttonPanel.className = oGlobal.normPanelClass;
                    $_.valid && (function(){
                        $_.panel.style.display = "none";
                        if($_.bindState=="2"&&!currentBtn){
                            currentBtn = $_;
                        }
                    })();
					
                    //初始化设置面板呈现
                    $_.setBindState($_.bindState);
					if( i == 0 && $_.msg ) $_.msg.style.display = '';
                    //绑定按钮动作
                    Core.Events.addEvent($_.btn, (function($_){
                        return function(){
                            switch($_.currentType){
                                case "norm":
                                    group.foreach("setState","seting");
                                    $_.setState("select");
                                    $_.panel.style.display = "";
                                    oGlobal.buttonPanel.className = oGlobal.setingPanelClass;
                                    $_.loop();
                                break;
                                case "select":
                                    group.foreach("setState","norm");
                                    $_.panel.style.display = "none";
                                    $_.clock.stop();
                                    currentBtn = null;
                                    oGlobal.buttonPanel.className = oGlobal.normPanelClass;
                                break;
                                case "seting":
                                    currentBtn && currentBtn!=$_ && currentBtn.valid && (function(){
                                        currentBtn.panel.style.display = "none";
                                        currentBtn.clock.stop();
                                    })();
                                    $_.loop();
                                    group.foreach("setState","seting");
                                    $_.setState("select");
                                    $_.panel.style.display = "";
                                    oGlobal.buttonPanel.className = oGlobal.setingPanelClass;
                                break;
                                case "enabled":
                                    return false;
                                break;
                            }
							if ($_.msg ) $_.msg.style.display = '';
                            currentBtn = $_;
                            App.bindim = $_.bindim;
                            App.cancelbind = $_.cancelbind;
                            App.setoption = $_.setoption;
                        }
                    })($_), "click");
                })();
            }
        })();
        if(currentBtn){
            Core.Events.fireEvent(currentBtn.btn,"click");
        }
    })([
        {
            type         : "msn",
            btn          : $E("msn"),
            panel        : $E("msnoption"),
			msg          : $E('msn_msg'),
            api          : "/plugins/imbot/aj_im.php",
            cancelApi    : "/plugins/imbot/aj_delim.php",
            loopApi      : "/plugins/imbot/aj_statusim.php",
            normClass    : "m2",
            selectClass  : "m1",
            setingClass  : "m2",
            enabledClass : "m4",
            errorNum     : "M01126",
            checkFunc    : App.checkEml
        },{
            type         : "gtalk",
            btn          : $E("gtalk"),
            panel        : $E("talkoption"),
			msg          : $E('gtalk_msg'),
            api          : "/plugins/imbot/aj_im.php",
            cancelApi    : "/plugins/imbot/aj_delim.php",
            loopApi      : "/plugins/imbot/aj_statusim.php",
            normClass    : "m2",
            selectClass  : "m1",
            setingClass  : "m2",
            enabledClass : "m4",
            errorNum     : "M01153",
            checkFunc    : App.checkEml
        },{
            type         : "uc",
            btn          : $E("uc"),
            panel        : $E("ucoption"),
			msg          : $E('uc_msg'),
            api          : "/plugins/imbot/aj_im.php",
            cancelApi    : "/plugins/imbot/aj_delim.php",
            loopApi      : "/plugins/imbot/aj_statusim.php",
            normClass    : "m2",
            selectClass  : "m1",
            setingClass  : "m2",
            enabledClass : "m4",
            errorNum     : "M01154",
            checkFunc    : App.checkUCNum
        },{
            type         : "qq",
            btn          : $E("qq"),
            panel        : $E("qqoption"),
			msg          : $E('qq_msg'),
            api          : "/plugins/imbot/aj_im.php",
            cancelApi    : "/plugins/imbot/aj_delim.php",
            loopApi      : "/plugins/imbot/aj_statusim.php",
            normClass    : "m2",
            selectClass  : "m1",
            setingClass  : "m2",
            enabledClass : "m4",
            errorNum     : "M01123",
            checkFunc    : App.checkQQNum
        }
    ],{
        buttonPanel      : $E("buttonPanel"),
        setingPanelClass : "rb_obj_mid rb_obj_mid2",
        normPanelClass   : "rb_obj_mid",
        itemTagName      : "li"
    });
});
