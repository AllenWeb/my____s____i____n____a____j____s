/*
 * Copyright (c) 2007, Sina Inc. All rights reserved.
 * @fileoverview 随便逛逛
 */

$import("sina/app.js");
$import("sina/core/class/create.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/utils/io/jsload.js");
/**
 * 随便逛逛
 * @author stan | chaoliang@staff.sina.com.cn
 * 
 * @modified L.Ming | liming1@staff.sina.com.cn
 */
App.RandomStroll = Core.Class.create();
App.RandomStroll.prototype = {
    swf_url: "http://simg.sinajs.cn/common/swf/rndView.swf",
    initialize: function(){
        var div = $C("div");
        div.id = "ramdomVisitDiv";
        div.style.position = "absolute";
        div.style.top = "43px";
        //div.style.border = "1px solid #FF0000";
        div.style.width = "100px";
        document.body.appendChild(div);
        this.div = div;
        this.lock();
        Core.Events.addEvent(window, function(){
            this.lock();
        }.bind2(this), "resize");
        Core.Events.addEvent(window, function(){
            this.lock();
        }.bind2(this), "scroll");
    },
    load: function(option){
        //option
        //{xmlURL: "xml/demo.xml", URL: "http://www.sina.com.cn"}
        Utils.Flash.swfView.Add(this.swf_url, "ramdomVisitDiv", "map", "100", "120", "8.0.0.0", "#000", option, {
            scale: "noscale",
            allowScriptAccess: "always",
            wmode: "transparent"
        });
       // Utils.Flash.swfView.Init();
    },
    lock: function(){
        var w = Core.System.pageSize()[2];
	this.div.style.right = "0px";
    },
    show: function(){
        $E("ramdomVisitDiv").style.display = "";
    },
    hide: function(){
        $E("ramdomVisitDiv").style.display = "none";
    }
};

App.RandomStroll.getRandomURL = function (url,link_url,rand,isSendLog) {
    var id = Math.floor(Math.random() * 992);
    Utils.Io.JsLoad.request(url, {
		onComplete: function(){
			var tm = Math.floor(Math.random() * uidlist.length);
			var uid = uidlist[tm];
			window.location.href = link_url+"/u/" + uid;
		},
		noreturn : true
	});
	if(isSendLog)
	   v5SendLog("ffk", "index");
};
App.RandomStroll.GoUrlByConfig={
	go:function(cnf){
		if(cnf && cnf.length){
			var length=cnf.length;
			for(var i=0;i<length;i++){
				this.randomByProbability(cnf[i].probability,cnf[i].url);
			}
		}
	},
	randomByProbability:function(probability,url){
		var num=Boot.getRandomNum(1,probability);
		if(num==1){
			window.location.href = url;
		}
	}
}
