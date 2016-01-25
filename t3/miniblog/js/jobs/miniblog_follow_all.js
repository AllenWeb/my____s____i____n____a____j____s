/**
 * @fileoverview 关注所有人
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("jobs/request.js");
$import("diy/mb_dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("diy/prompttip.js");
$import("diy/forbidrefresh_dialog.js");
$import("sina/core/array/isArray.js");
$import("sina/core/array/foreach.js");
$import("diy/querytojson.js");

(function(proxy){
    proxy._lock = true;
    proxy._notclick = function(b){
        var cites = document.getElementsByName("addAttention");
        var len = cites.length;
		proxy._lock = b;
        for (var i = 0; i < len; i++) {
            if (cites[i].parentNode.tagName == "STRONG") {
                if (!proxy._lock) {
                    cites[i].parentNode.className = "btn btn_gray";
                }
                else {
                    cites[i].parentNode.className = "btn";
                }
            }
            else {
                if (!proxy._lock) {
                    cites[i].className = "flsl flsl_gray";
                }
                else {
                    cites[i].className = "flsl";
                }
            }
        }
    }
})(App);
$registJob("follow_all", function(){
    var cites = document.getElementsByName("addAttention");
    var len = cites.length;
    for (var i = 0; i < len; i++) {
        (function(dom){
            Core.Events.addEvent(dom, function(){
                if (!App._lock) {
                    return false;
                }
                var container = scope.att_container || document
                var _this = this;
                var els = (function(con){
                    if (Core.Array.isArray(con)) {
                        var arr = [];
                        for (var m = 0; m < con.length; m++) {
                            Core.Array.foreach(($E(con[m]).getElementsByTagName("input")), function(ele){
                                arr.push(ele);
                            })
                        }
                        return arr;
                    }
                    else {
                        //document
                        return con.getElementsByTagName("input");
                    }
                })(container);
                var _tar = Core.Events.getEventTarget(Core.Events.getEvent());
                var uids = [], len = els.length;
                for (var i = 0; i < len; i++) {
                    if (els[i].type == "checkbox" && els[i].value != "" && els[i].checked) {
                        uids.push(els[i].value);
                    }
                }
                var getDispList = function(str, act){
                    if (!str) {
                        return;
                    }
                    var _list = str.split(',');
                    for (var i = 0; i < _list.length; i = i + 1) {
                        if ($E(_list[i])) {
                            $E(_list[i]).style.display = act;
                        }
                    }
                }
                function onSuccess(){
                    //新版提示
                    getDispList(_tar.getAttribute('disp'), '');
                    getDispList(_tar.getAttribute('hidd'), 'none');
					unloadingLook();
                }
                var param = uids.length > 0 ? {
                    uid: uids.join(","),
                    fromuid: scope.$uid
                } : {
                    uid: "1642909335",
                    fromuid: scope.$uid
                };
				if($E('check_all')){
					param['check_all'] = $E('check_all').checked ? 1 : 0;
					param['source'] = App.queryToJson(window.location.search.slice(1)).source_cat || 'default';
				}
                function onError(json){
                    if (json && json.code == 'MR0050') {
                        App.forbidrefresh(function(){
                            param['retcode'] = scope.doorretcode;
                            App.doRequest(param, "/attention/aj_addfollow.php", onSuccess, onError);
                        }, '/attention/aj_addfollow.php')
                    }
                    else {
                        App.alert({
                            code: json.code
                        });
                        if ($IE) {
                            location.hash = "top";
                        }
                        else {
                            document.body.scrollIntoView();
                        }
                    }
					unloadingLook();
                };
                //                if (uids.length === 0) {
                //					App.promptTip(json, null, "system_information", "error");
                //                    return;
                //                }
                var unloadingLook = function(){
					if(_this.className == 'flsl flsl_load'){
						_this.className = 'flsl';
					}
					if(_this.parentNode.className == 'btn btn_load'){
						_this.parentNode.className = 'btn';
					}
				};
                //chibin add 防止恶意加关注
				try{
					if(_this.className == 'flsl'){
						_this.className = 'flsl_gray';
					}
					if(_this.parentNode.className == 'btn'){
						_this.parentNode.className = 'btn btn_load';
					}
				}catch(exp){
					
				}
                setTimeout(function(){
                    App.doRequest(param, "/attention/aj_addfollow.php", onSuccess, onError);
                }, 100)
                
            }, "click");
        })(cites[i]);
    }
    
    Core.Events.addEvent($E('check_all'), (function(ckall, con){
        return function(){
            if (ckall && Core.Array.isArray(con)) {
                var arr = [];
				var count = 0;
                for (var m = 0; m < con.length; m++) {
                    Core.Array.foreach(($E(con[m]).getElementsByTagName("input")), function(ele){
                        if (ele.type == 'checkbox') {
                            ele.checked = ckall.checked;
							count++;
                        }
                    })
                }
				scope.maxatt = count++;
                if ($E("select_num")) {
                    if (ckall.checked) {
                        $E("select_num").innerHTML = scope.maxatt;
                        App._notclick(true);
                        
                    }
                    else {
                        $E("select_num").innerHTML = 0;
                         App._notclick(false);
                    }
                }
                
                
            }
        }
    })($E('check_all'), scope.att_container), 'click')
    var servertime = (new Date()).getTime();
    window.setInterval(function(){
        try {
            var rnd = (new Date()).getTime();
            var js = document.createElement('SCRIPT');
            js.setAttribute('type', 'text/javascript');
            js.setAttribute('src', 'http://hits.sinajs.cn/A1/b.html?uid=' + scope.$uid + '&servertime=' + servertime + '&pageid=recommend&rnd' + rnd);
            js.setAttribute('charset', 'utf-8');
            js[$IE ? 'onreadystatechange' : 'onload'] = function(){
                if (!$IE || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded') {
                    document.getElementsByTagName('HEAD')[0].removeChild(js);
                }
            };
            document.getElementsByTagName('HEAD')[0].appendChild(js);
        } 
        catch (exp) {
        
        }
    }, 5 * 1000);
});
