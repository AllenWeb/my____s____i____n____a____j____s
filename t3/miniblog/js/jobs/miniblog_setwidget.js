/**
 * @author chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/fireEvent.js");
//$import("msg/msg.js");
$import("sina/core/dom/getXY.js");
$import("diy/timer.js");
$import("diy/animation.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/copy.js");
$import("diy/swfobject.js");
$import("jobs/insertTextArea.js");
$import("diy/dialog.js");
$registJob('set_widget', function(){
    var element = {
        blog: $E("chooseblog"),//第一步页面
        flashorjs: $E("choosewidget"),//第二步页面
        usebloginfo: $E("blogname"),//适用于“XX博客”的版本
        flashentry: $E(),
        jsentry: $E(),
        jsinfo: $E(),
        flashinfo: $E(),
        skin: $E("skin"),
        width: $E("width"),
        autowidth: $E("ss"),
        height: $E("height"),
        showimg: $E("pic"),
        showlnk: $E("txt_link"),
        scimg: $E("view_pic"),
        sclink: $E("view_txt"),
        preview: $E("preview"),
        jscode: $E("js_code"),
        copyjs: $E("copy_js_code"),
        flashcode: $E("flash_code"),
        copyflash: $E("copy_flash_code"),
        iframe: $E("pre_iframe"),
        divifr: $E("preview_cont"),
        flash: $E("pre_flash"),
        htmlcode: $E("html_code"),
        copyhtml: $E("copy_html_code"),
        flashurl: function(width,height,skin,uid){
			return scope.$BASESTATIC + 'miniblog/static/swf/miniblogwidget.swf?width='+width+'&height='+height+'&uid=' + uid + '&skin=skin'+skin ;
		},
        add_to_blog: $E("add_to_blog")
    };
    
    //第一步
    //点击某一个博客
    App.set_widget = function(blog, type, isopensina, title){
        //blog=0都支持 跳掉第二页
        //1只js
        //2只flash
        //isopensina=1跳到特殊的sina设置页
        var url = "/widget/setting.php?id=" + blog;
        scope.curblog = blog;
        if (type == "0") {
            element["blog"].style.display = "none";
            element["flashorjs"].style.display = "";
            $E("blogname").innerHTML = $CLTMSG['CD0009'].replace(/#\{title\}/,title);
        }
        else {
            if (isopensina == "0" && type == "1") {
                App.alert($CLTMSG['CD0010']);
                return false;
            }
            else {
                window.location.href = url + "&ver=" + type;
                Core.Events.stopEvent();
                return false;
            }
        }
    };
    //返回重选
    App.back_widget = function(){
        element["blog"].style.display = "";
        element["flashorjs"].style.display = "none";
        scope.curblog = "";
    };
    //第二步
    //选择javascript或者flash
    App.set_widgettype = function(type){
        scope.curtype = type;
        window.location.href = "/widget/setting.php?id=" + scope.curblog + "&ver=" + scope.curtype;
    };
    //	var chsflsorjs = function(type){
    //        scope.curtype = type;
    ////        switch (type) {
    ////            case "javascript":
    ////                //element["jsinfo"].style.display = "";
    ////                //element["flashinfo"].style.display = "none";
    ////                break;
    ////            case "flash":
    ////                element["jsinfo"].style.display = "none";
    ////                element["flashinfo"].style.display = "";
    ////                break;
    ////        }
    //		        
    //    }
    
    //第三步，选择乱七八糟的设置
    //清空skin的选择
    var clearskincur = function(){
        var els = element["skin"].getElementsByTagName("A");
        for (var j = 0; j < els.length; j++) {
            if (els[j].className.indexOf(" cur") >= 0) {
                els[j].className = els[j].className.substring(0, els[j].className.indexOf(" cur"));
            }
        }
    }
    
    //设置skin的选择
    for (var i = 0; i < element["skin"].getElementsByTagName("A").length; i++) {
        Core.Events.addEvent(element["skin"].getElementsByTagName("A")[i], (function(el){
            return function(){
                clearskincur();
                el.className = el.className + " cur";
				Core.Events.fireEvent(element["preview"],"click");
            };
        })(element["skin"].getElementsByTagName("A")[i]), "click");
    }
    //获取skin的选择
    var getskinindex = function(){
        for (var q = 0; q < element["skin"].getElementsByTagName("A").length; q++) {
            if (element["skin"].getElementsByTagName("A")[q].className.indexOf(" cur") >= 0) {
                return q + 1;
            }
        }
    }
    
    //设置移出时数字合法性并加上px
    var checkInt = function(el, type){
        var patrn = /^[0-9]*[1-9][0-9]*$/;
        if (type == "width") {
            if (!patrn.exec(el.value)) {
                //输入不是正整数,默认230
                el.value = "230";
            }
            else {
                if (parseInt(el.value) > 1024) {
                    var alt = App.alert($CLTMSG['CD0011']);
                    var itv = setTimeout(function(){
                        try {
                            alt && (alt.close());
                        } 
                        catch (e) {
                        }
                    }, 2000);
                    alt.onClose = function(){
                        clearTimeout(itv);
                        el.value = 1024;
                        itv = null;
                    }
                }else if (parseInt(el.value) < 120) {
                        var tlt = App.alert($CLTMSG["CD0012"]);
                        var ttv = setTimeout(function(){
                            try {
                                tlt && (tlt.close());
                            } 
                            catch (e) {
                            }
                        }, 2000);
                        tlt.onClose = function(){
                            clearTimeout(ttv);
                            el.value = 230;
                            ttv = null;
                        }
                    }
            }
        }
        else {
            if (!patrn.exec(el.value)) {
                //输入不是正整数,默认500
                el.value = "500";
            }
            else {
                if (parseInt(el.value) > 800) {
                    var hlt = App.alert($CLTMSG["CD0013"]);
                    var stv = setTimeout(function(){
                        try {
                            hlt && (hlt.close());
                        } 
                        catch (e) {
                        }
                    }, 2000);
                    hlt.onClose = function(){
                        clearTimeout(stv);
                        el.value = 800;
                        stv = null;
                    }
                }
                else 
                    if (parseInt(el.value) < 230) {
                        var glt = App.alert($CLTMSG["CD0014"]);
                        var gtv = setTimeout(function(){
                            try {
                                glt && (glt.close());
                            } 
                            catch (e) {
                            }
                        }, 2000);
                        glt.onClose = function(){
                            clearTimeout(gtv);
                            el.value = 500;
                            gtv = null;
                        }
                    }
            }
        }
    }
    //设置自动调整宽度
    var setautowidth = function(el, wdt){
        if (el.checked) {
            wdt.value = "230"
            wdt.className = wdt.className + " disabled";
            wdt.disabled = true;
        }
        else {
            wdt.className = wdt.className.substring(0, wdt.className.indexOf(" disabled"));
            wdt.disabled = false;
        }
    }
    //显示缩略图还是文字链接
    var showmdl = function(type, img, link){
        if (type == "img") {
            img.style.display = "";
            link.style.display = "none";
        }
        else {
            img.style.display = "none";
            link.style.display = "";
        }
    }
    
    //预览并更新代码
    var prvAndRef = function(skin, width, height, showtype, autowidth){
        //var scripthtml = '<div id="sina_widget"><script>var sina_uid="'+scope.$uid+'";var sina_w="'+width+'";var sina_h="'+height+'";var sina_s="wd_'+skin+'";var sina_p="'+showtype+'";</script><script src="sina_widget.js"></script></div>'
        //        var autow = autowidth?' onload="document.getElementById(\'sina_widget_'+scope.$uid+'\').style.width=document.getElementById(\'sina_widget_'+scope.$uid+'\').parentNode.offsetWidth+\'px\'"':'';
        if (element["divifr"]) {
            element["divifr"].style.width = (parseInt(width) + 40) + "px";
            element["divifr"].style.height = height + "px";
        }
        if (scope.curtype == "2") {
            var defaultjshtml = '';
            if (autowidth) {
                defaultjshtml = '<iframe id="sina_widget_' + scope.$uid + '" style="width:100%; height:' + height + 'px;" frameborder="0" scrolling="no" src="http://v.t.sina.com.cn/widget/widget_blog.php?uid=' + scope.$uid + '&height=' + height + '&skin=wd_' + skin + '&showpic=' + showtype + '"></iframe>'
            }
            else {
                defaultjshtml = '<iframe id="sina_widget_' + scope.$uid + '" style="width:' + width + 'px; height:' + height + 'px;" frameborder="0" scrolling="no" src="http://v.t.sina.com.cn/widget/widget_blog.php?uid=' + scope.$uid + '&width=' + width + '&height=' + height + '&skin=wd_' + skin + '&showpic=' + showtype + '"></iframe>'
            }
            
            if (element["iframe"]) {
                element["iframe"].style.width = width + "px";
                element["iframe"].style.height = height + "px";
                element["iframe"].style.scrolling = 0;
                element["iframe"].style.frameborder = 0;
                element["iframe"].src = 'http://v.t.sina.com.cn/widget/widget_blog.php?uid=' + scope.$uid + '&width=' + width + '&height=' + height + '&skin=wd_' + skin + '&showpic=' + showtype;
            }
            if (element["jscode"]) {
                element["jscode"].value = defaultjshtml;
            }
            return false;
        }
        else {
            //flash版本无自适应宽度
            var defaultflashhtml = scope.$BASESTATIC + 'miniblog/static/swf/miniblogwidget.swf?width=' + width + '&height=' + height + '&uid=' + scope.$uid + '&skin=skin' + parseInt(skin);
            var defaulthtml = '<EMBED src="'+scope.$BASESTATIC+'miniblog/static/swf/miniblogwidget.swf" wmode="transparent" quality="high" width="' +width +'" height="' +height +'" align="L" scale="noborder" flashvars="width=' +width +'&height=' +height +'&uid=' +scope.$uid +'&skin=skin' +parseInt(skin) +'"\
							allowScriptAccess="sameDomain" type="application/x-shockwave-flash"></EMBED>';
            if (element["flashcode"]) {
                element["flashcode"].value = defaultflashhtml;
            }
            if (element["htmlcode"]) {
                element["htmlcode"].value = defaulthtml;
            }
			setflash(element['flashurl'](width,height,parseInt(skin),scope.$uid), width, height,parseInt(skin));
        }
    };
    Core.Events.addEvent(element["jscode"], function(){
        if (element["jscode"]) {
            if ($IE && element["jscode"].createTextRange) {
                App.setCursor(element["jscode"], -1, element["jscode"].value.length + 2);
            }
            else {
                if (element["jscode"].setSelectionRange) {
                    element["jscode"].setSelectionRange(0, element["jscode"].value.length);
                }
            }
        }
    }, "dblclick");
    Core.Events.addEvent(element["htmlcode"], function(){
        if (element["htmlcode"]) {
            if ($IE && element["htmlcode"].createTextRange) {
                App.setCursor(element["htmlcode"], -1, element["htmlcode"].value.length + 2);
            }
            else {
                if (element["htmlcode"].setSelectionRange) {
                    element["htmlcode"].setSelectionRange(0, element["htmlcode"].value.length);
                }
            }
        }
    }, "dblclick");
    Core.Events.addEvent(element["flashcode"], function(){
        if (element["flashcode"]) {
            if ($IE && element["flashcode"].createTextRange) {
                App.setCursor(element["flashcode"], -1, element["flashcode"].value.length + 2);
            }
            else {
                if (element["flashcode"].setSelectionRange) {
                    element["flashcode"].setSelectionRange(0, element["flashcode"].value.length);
                }
            }
        }
    }, "dblclick");
    
    Core.Events.addEvent(element["width"], function(){
        checkInt(element["width"], "width")
    }, "blur");
    Core.Events.addEvent(element["height"], function(){
        checkInt(element["height"], "height")
    }, "blur");
    Core.Events.addEvent(element["autowidth"], function(){
        setautowidth(element["autowidth"], element["width"]);
    }, "click");
    Core.Events.addEvent(element["showimg"], function(){
        showmdl("img", element["scimg"], element["sclink"]);
    }, "click");
    Core.Events.addEvent(element["showlnk"], function(){
        showmdl("lnk", element["scimg"], element["sclink"]);
    }, "click");
    Core.Events.addEvent(element["preview"], function(){
        prvAndRef("0" + getskinindex(), element["width"].value, element["height"].value, $E("pic") && $E("pic").checked ? "1" : "0", element["autowidth"]?element["autowidth"].checked:'');
    }, "click");
    Core.Events.addEvent(element["copyjs"], function(){
        if (App.copyText(element["jscode"].value || "")) {
            var lt = App.alert($CLTMSG["CD0015"]);
            var itv = setTimeout(function(){
                try {
                    lt && (lt.close());
                } 
                catch (e) {
                }
            }, 2000);
            lt.onClose = function(){
                clearTimeout(itv);
                itv = null;
            };
        }
        else {
            App.alert($CLTMSG["CD0016"]);
        };
            }, "click");
    Core.Events.addEvent(element["copyhtml"], function(){
        if (App.copyText(element["htmlcode"].value || "")) {
            var kt = App.alert($CLTMSG["CD0015"]);
            var ktv = setTimeout(function(){
                try {
                    kt && (kt.close());
                } 
                catch (e) {
                }
            }, 2000);
            kt.onClose = function(){
                clearTimeout(ktv);
                ktv = null;
            };
        }
        else {
            App.alert($CLTMSG["CD0016"]);
        };
            }, "click");
    Core.Events.addEvent(element["copyflash"], function(){
        if (App.copyText(element["flashcode"].value || "")) {
            var lt = App.alert($CLTMSG["CD0015"]);
            var itv = setTimeout(function(){
                try {
                    lt && (lt.close());
                } 
                catch (e) {
                }
            }, 2000);
            lt.onClose = function(){
                clearTimeout(itv);
                itv = null;
            };
        }
        else {
            App.alert($CLTMSG["CD0016"]);
        };
            }, "click");
    Core.Events.addEvent(element["add_to_blog"], function(){
        Utils.Io.Ajax.request('/plugins/aj_widget.php', {
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    App.confirm($SYSMSG["M11001"], {
                        ok: function(){
                            if (json.data) {
                                window.location.href = json.data;
                            }
                        },
                        ok_label: $CLTMSG["CD0017"],
                        cancel_label: $CLTMSG["CD0018"],
                        icon: 3
                    });
                }
                else {
                    App.alert($SYSMSG[json.code], {
                        ok_label: $CLTMSG["CD0018"]
                    });
                }
            },
            'onException': function(){
            },
            'returnType': 'json'
        });
    }, "click");
    
    //初始加载flash
    var setflash = function(url, width, height,skin){
        var flashParams = {
			wmode:"transparent",
            quality: "high",
            bgcolor: "#FFFFFF",
            movie: scope.$BASESTATIC+"miniblog/static/swf/miniblogwidget.swf",
            align: "L",
			scale: "noborder",
			allowScriptAccess: "sameDomain"
        };
        swfobject.embedSWF(url, "pre_flash", width, height, "9.0.0", null, null, flashParams);
    }
    if (scope.curtype == "3") {
        setflash(element['flashurl']('209','550','1',scope.$uid), '209', '550','1');
    }
    
});
