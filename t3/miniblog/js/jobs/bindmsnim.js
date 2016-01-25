/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/diy/dialog.js");
$import("sina/diy/check.js");
$import("sina/diy/formtojson.js");

//scope.$bindmsnimstatus 有三个状态：未绑定为0，未绑定已设置（没验证）为1，已绑定为2
//显示绑定设置的:msnoption
//显示验证的:msnauthentication

$registJob('bindmsnim', function(){
    //未验证则轮询
    if (scope.$bindmsnimstatus != null && scope.$bindmsnimstatus == 1) {
        window.setInterval(App.msnauthentication, 5000);
    }
});

//点击绑定msn，显示设置栏，
App.bindmsn = function(){

    //未绑定状态
    if (scope.$bindmsnimstatus == 0) {
        //将设置div显示
        var o_msnoption = $E('msnoption');
        $E("havebind").innerHTML = "";
        o_msnoption.style.display = '';
    }
    
    //已绑定状态
    if (scope.$bindmsnimstatus == 2) {
        var o_msnoption = $E('msnoptionselect');
        $E("havebind").innerHTML = "";
        o_msnoption.style.display = '';
    }
}


//进行绑定设置和修改设置，设置完毕后进行提交，弹出验证码页面
App.setmsnoption = function(){
    //已绑定需要多一步显示
    if (scope.$bindmsnimstatus == 2) {
        $E('msnoption').style.display = "";
    }
    
    var o_form = $E('msnoption');
    
    //未绑定才能设置msnmail
    if ($E('msnmail') && scope.$bindmsnimstatus == 0) {
        var s_msnmail = $E('msnmail').value;
        if (!App.checkEml(s_msnmail)) {
            App.alert({
                code: "M01126"
            }, {
                icon: 2
            });
            return false;
        }
    }
    
    var s_url = "";
    var o_arg = App.formToJson(o_form);
    //将json中true和false改为1和0
    for (var i in o_arg) {
        if (typeof o_arg[i] == "boolean") {
            o_arg[i] = o_arg[i] == true ? 1 : 0;
        }
    }
    
    Utils.Io.Ajax.request(s_url, {
        "POST": {
            "uid": scope.$uid,
            "settings": o_arg
        },
        "onComplete": function(json){
            if (json) {
                if (json.code == "A00006") {
                    //未绑定刚设置好，进行验证码轮询
                    if (scope.$bindmsnimstatus == 0) {
                        $E('msnoption').style.display = "none";
                        //显示验证码，5秒轮询
                        $E('msnauthentication').style.display = "";
                        //未绑定已设置（没验证）
                        scope.$bindmsnimstatus = 1;
                        window.setInterval(App.msnauthentication, 5000);
                    }
                    else {
                        App.alert(App.getMsg(json.code), {
                            icon: 3
                        });
                    }
                }
                else {
                    App.alert(App.getMsg(json.code), {
                        icon: 2
                    });
                }
            }
            else {
                App.alert("设置微博机器人失败，请重试！", {
                    icon: 2
                });
            }
        },
        "onException": function(json){
            if (json) {
                App.alert(App.getMsg(json.code), {
                    icon: 2
                });
            }
            else {
                App.alert("设置微博机器人失败，请重试！");
            }
        },
        returnType: "json"
    });
    return false;
}

//轮询验证
App.msnauthentication = function(){
    var s_url = "";
    //参数
    var arg = "";
    Utils.Io.Ajax.request(s_url, {
        "POST": {
            "mid": arg
        },
        "onComplete": function(json){
            if (json) {
                //已通过验证，显示已绑定
                if (json.code == "A00006") {
                    window.clearInterval();
                    $E("havebind").innerHTML = "<p>已绑定</p>";
                    $E("msnauthentication").style.display = "none";
                }
            }
            else {
                App.alert("绑定微博机器人失败，请重试！", {
                    icon: 2
                });
            }
        },
        "onException": function(json){
            if (json) {
                App.alert(App.getMsg(json.code), {
                    icon: 2
                });
            }
            else {
                App.alert("绑定微博机器人失败，请重试！");
            }
        },
        returnType: "json"
    });
    return false;
}

//取消绑定
App.msncancelbind = function(){
    var s_url = "";
    App.confirm("真的要删除绑定么？", {
        ok: function(){
            Utils.Io.Ajax.request(s_url, {
                "POST": {
                    "uid": scope.$uid
                },
                "onComplete": function(json){
                    if (json) {
                        //取消绑定成功
                        if (json.code == "A00006") {
                            window.location.reload = true;
                            scope.$bindmsnimstatus = 0;
                        }
                    }
                    else {
                        App.alert("取消绑定微博机器人失败，请重试！", {
                            icon: 2
                        });
                    }
                },
                "onException": function(json){
                    if (json) {
                        App.alert(App.getMsg(json.code), {
                            icon: 2
                        });
                    }
                    else {
                        App.alert("取消绑定微博机器人失败，请重试！");
                    }
                },
                returnType: "json"
            });
        }
    })
}
