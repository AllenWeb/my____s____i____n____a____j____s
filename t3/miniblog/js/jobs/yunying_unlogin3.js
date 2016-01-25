/**
 * @fileoverview 微博新推广页
 * @author yuwei@staff.sina.com.cn
 */
$import('sina/core/events/addEvent.js');
$import("diy/insMarquee.js");
$import("diy/marquee.js");
$import("sina/core/array/findit.js");
$import("diy/setPassword.js");
//微博向上缓动显示
$registJob("marquee", function(){
    var marqueeBox = $E("txtBoxCon").parentNode;
    var divs = marqueeBox.getElementsByTagName("div");
    var items = [];
    for (var i = 0, len = divs.length; i < len; i += 1) {
        if (divs[i].className === "itemt") {
            items.push(divs[i]);
        }
    }
		App.bindMedia($E("txtBoxCon"))
    var ss = setTimeout(function(){
		
        var doMarquee = new App.insmarquee(marqueeBox, items, {
            forward: "down",
            speed: 5
        });
        Core.Events.addEvent(marqueeBox, function(){
            doMarquee.pause()
        }, 'mouseover');
        Core.Events.addEvent(marqueeBox, function(){
            doMarquee.restart()
        }, 'mouseout');
        doMarquee.start();
		clearTimeout(ss);
    }, 500)
    
});
$registJob("set_password", function(){
    App.setPassword('password', 'password_text');
});
$registJob("topicmarquee", function(){
    var topicmarqueeBox = $E('topicBoxCon');
    var lis = $E('acticle_list').getElementsByTagName('li');
    var li_items = [];
    for (var j = 0, lent = lis.length; j < lent; j += 1) {
        li_items.push(lis[j]);
    }
    var marquee = new App.marquee(topicmarqueeBox, li_items, {
        forward: "left",
        speed: 2
    })
    Core.Events.addEvent(topicmarqueeBox, function(){
        marquee.pause()
    }, 'mouseover');
    Core.Events.addEvent(topicmarqueeBox, function(){
        marquee.restart()
    }, 'mouseout');
    marquee.start();
});

//输入用户名字时提示邮箱
//$registJob("loginMailTips", function(){
//    passcardOBJ.init(document.getElementById("loginname"), {
//        overfcolor: "#999",
//        overbgcolor: "#e8f4fc",
//        outfcolor: "#000000",
//        outbgcolor: ""
//    }, document.getElementById("password_text"), parent);
//});

//特殊需求，需要给password设置默认文案

//高亮显示鼠标停留的博主图片
$registJob("highLightLi", function(){
	if(!$E("imgList")) return false;
    var imgs = $E("imgList").getElementsByTagName("img");
    //随机取12个图片不重复的显示
    var randomIMGs = [];
    while (randomIMGs.length < 12) {
        var randomIndex = Math.floor(Math.random() * imgs.length);
        if (Core.Array.findit(randomIMGs, imgs[randomIndex]) === -1) {
            randomIMGs.push(imgs[randomIndex]);
        }
    }
    var len = randomIMGs.length;
    for (var i = 0; i < len; i++) {
        randomIMGs[i].parentNode.parentNode.style.display = "list-item";
    }
});
$registJob("login3", function(){
    var submit = $E("login_submit_btn");
    var loginname = $E("loginname");
    var password_text = $E("password_text");
    var remusrname = $E("remusrname");
    var login_form = $E("login_form");
    if (!remusrname) {
        remusrname = {
            'checked': true
        };
    }
    //初始化用户名输入
    App.initLoginInput(loginname);
    
    var options = {
        zIndex: 1010,
        ref: loginname,
        offsetY: 1,
        offsetX: 1
    };
    function checkForm(el, errStr){
        if (!Core.String.trim(el.value) || (el.value == el.title && el.title)) {
            password_text.focus();
            App.fixElement.setHTML(errStr, "", options);
            return false;
        }
        else {
            App.fixElement.hidden();
        }
        return true;
    }
    
    Core.Events.addEvent(submit, function(event){
        if (!checkForm(loginname, App.getMsg({
            code: "M00901"
        }))) {
            return false;
        }
        if (!checkForm($E('password'), App.getMsg({
            code: "M00902"
        }))) {
            return false;
        }
        else {
            App.LoginAction({
                name: loginname.value,
                pwd: $E('password').value,
                remb: remusrname.checked,
                error: function(reason, errno){
                    var msg = "";
                    if (errno == "4010") {
                        reason = App.getMsg({
                            code: 'R01011'
                        });
                        msg = App.getMsg("R01010", {
                            mail: loginname.value
                        });
                    }
                    else {
                        if (errno == "101" || errno == "5") {
                            msg = App.getMsg({
                                code: "R11111"
                            });
                        }
                    }
                    App.fixElement.setHTML(reason, msg, options);
                },
                succ: function(){
                    var redirect = scope.redirect ? Core.String.trim(scope.redirect) : "http://t.sina.com.cn/";
                    location.replace(redirect);
                }
            });
        }
        Core.Events.stopEvent(event);
    }, "click");
    
    //给form绑定键盘回车提交
    if (login_form) {
        App.enterSubmit({
            parent: $E("password").parentNode,
            action: function(){
                Core.Events.fireEvent("login_submit_btn", 'click');
            }
        });
    }
    passcardOBJ.init(loginname, {
        overfcolor: "#999",
        overbgcolor: "#e8f4fc",
        outfcolor: "#000000",
        outbgcolor: ""
    }, password_text, parent);
    //chibin add for 360
    if (Core.String.trim(loginname.value) != '' && Core.String.trim($E('password').value) != '') {
        setTimeout(function(){
            Core.Events.fireEvent(submit, 'click');
        }, 100);
    }
});
