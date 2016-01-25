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
$import("diy/clickAnddbclick.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");
$import("diy/animation.js");
$import("diy/timer.js");
/**
 * miniblog widget
 * @author Liusong liusong@staff.sina.com.cn
 */
$registJob("miniblog_widget", function(){
    var p = {
        submit: $E("publisher_submit"),
        content: $E("publish_editor"),
        limitTip: $E("limitTip"),
        wapper: $E("widget_wapper"),
        contentw: $E("widget_content_wapper"),
        //chibin add
        rolltop: $E("rollup"),
        rollbtm: $E("rolldown")
    };
    p.contentw.scrollTop = 0;
    
    
    var moreUrl = "";
    
    App.more = function(){
        if (moreUrl) {
            window.open(moreUrl, "miniblog_more");
        }
    };
    var compt = ["wgtTop", "writeBox", "wgt_bottom", "wgtMain_top", "wgtMain_bot"];
    var _getHeight = function(cls){
        var c = Core.Dom.getElementsByClass(p.wapper, "DIV", cls);
        if (c.length > 0) {
            return parseInt(c[0].offsetHeight);
        }
        else {
            return 0;
        }
    }
    var minusH = 0;
    for (var k = 0; k < compt.length; k++) {
        minusH += _getHeight(compt[k]);
    }
    if (scope.$widget_width && scope.$widget_height) {
        var wapper = p.wapper;
        var contentw = p.contentw;
        if (wapper && contentw) {
            //wapper.style.width = scope.$widget_width + "px";
			wapper.style.width = "100%";
            wapper.style.height = scope.$widget_height + "px";
            //contentw.style.height = scope.$widget_height - ((p.submit && p.content)?145:90) + "px";
            contentw.style.height = scope.$widget_height - minusH + "px";
        }
    }
    App.showTip = function(value){
        if (!scope.popUpTip) {
            if (scope.$widget_width && scope.$widget_height) {
                scope.popUpTip = $C("div");
                scope.popUpTip.style.position = "absolute";
                scope.popUpTip.style.left = "0px";
                scope.popUpTip.style.top = "0px";
                scope.popUpTip.style.zIndex = 1000;
                //scope.popUpTip.style.width = scope.$widget_width + "px";
				scope.popUpTip.style.width = "100%";
                scope.popUpTip.style.height = "65px";
                document.body.appendChild(scope.popUpTip);
            }
        }
        var html = '<div class="sendOk" style="height:100%;min-height:100%;">\
    	<p class="close"><a href="javascript:;" onclick="scope.popUpTip.tipClose();"><img src="'+scope.$BASEIMG+'style/images/common/close.gif" /></a></p>\
    	' + value + '\
		</div>';
        if (scope.popUpTip) {
            scope.popUpTip.innerHTML = html;
            scope.popUpTip.delay = setTimeout(function(){
                if (scope.popUpTip) {
                    scope.popUpTip.tipClose();
                }
            }, 5000);
            scope.popUpTip.tipClose = function(){
                scope.popUpTip.parentNode.removeChild(scope.popUpTip);
                clearTimeout(scope.popUpTip.delay);
                scope.popUpTip = null;
            };
        }
    };
    
    //------------------------------------------chibin add ------------------------------------------
    if (Core.Dom.getElementsByClass($E("content_all"), "DIV", "wgtCell").length > 0) {
        if ($E("content_all").offsetHeight >= $E("widget_content_wapper").offsetHeight) {
            //获取当前滚动轴所在的哪一条
            var getCurAndNext = function(type){
                var _content_all = $E("content_all").childNodes || $E("content_all").children;
                var _alldiv = [];
                for (var j = 0; j < _content_all.length; j++) {
                    if (_content_all[j].nodeType != 3) {
                        _alldiv.push(_content_all[j]);
                    }
                }
                var _fromto = {};
                var linedoth = 5;
                for (var i = 0; i < _alldiv.length; i++) {
                    if (_alldiv[i].className == "wgtCell") {
                        if (Core.Dom.getXY(_alldiv[i])[1] - Core.Dom.getXY(_alldiv[0])[1] - linedoth <= p.contentw.scrollTop && (Core.Dom.getXY(_alldiv[i])[1] - Core.Dom.getXY(_alldiv[0])[1] + _alldiv[i].offsetHeight) > p.contentw.scrollTop) {
                            if (type == "down") {
                                _fromto["from"] = p.contentw.scrollTop;
                                _fromto["to"] = Core.Dom.getXY(_alldiv[i])[1] - Core.Dom.getXY(_alldiv[0])[1] + _alldiv[i].offsetHeight + linedoth;
                                break;
                            }
                            if (type == "up") {
                                _fromto["from"] = p.contentw.scrollTop;
                                if (Core.Dom.getXY(_alldiv[i])[1] - Core.Dom.getXY(_alldiv[0])[1] == p.contentw.scrollTop) {
                                    if (i > 1) {
                                        _fromto["to"] = Core.Dom.getXY(_alldiv[i - 2])[1] - Core.Dom.getXY(_alldiv[0])[1];
                                    }
                                }
                                else {
                                    _fromto["to"] = Core.Dom.getXY(_alldiv[i])[1] - Core.Dom.getXY(_alldiv[0])[1];
                                }
                                break;
                                
                            }
                        }
                    }
                }
                return _fromto;
            }
            //chibin add 滚动效果
            var roll = function(_from, _to, _type){
                var distance = _to - _from;
                var _divnode = p.contentw;
                var a = 1 //加速度
                var v = 10;//初速度
                var dropOrbit = App.animation.speed(100, distance < 0 ? distance * (-1) : distance, v);
                dropOrbit.push(distance >= 0 ? distance : distance * (-1));
                var current = 0;
                var tk = (function(flytimer, flydistance, node, type){
                    var starttop = _from + "px";
                    App.timer.add(function(){
                        if (current >= dropOrbit.length) {
                            App.timer.remove(tk);
                            return false;
                        };
                        if (type == "up") {
                            node.scrollTop = _from - Math.ceil(dropOrbit[current]);
                        }
                        else {
                            node.scrollTop = _from + Math.ceil(dropOrbit[current]);
                        }
                        current++;
                    })
                })(2, distance, _divnode, _type);
                return false;
            };
            var chkToporBtm = function(){
                //到头了
                if (p.contentw.scrollTop == 0) {
                    //p.rolltop.getElementsByTagName("IMG")[0].className = "";
                    p.rolltop.getElementsByTagName("IMG")[0].style.display = "none";
                    p.rolltop.style.cursor = "auto";
                }
                else {
                    //p.rolltop.getElementsByTagName("IMG")[0].className = "wgt_arrow wgt_up";
                    p.rolltop.getElementsByTagName("IMG")[0].style.display = "";
                    p.rolltop.style.cursor = "pointer";
                }
                //到底了
                if (p.contentw.scrollTop + p.contentw.offsetHeight == p.contentw.scrollHeight) {
                    //p.rollbtm.getElementsByTagName("IMG")[0].className = "";
                    p.rollbtm.getElementsByTagName("IMG")[0].style.display = "none";
                    p.rollbtm.style.cursor = "auto";
                }
                else {
                    //p.rollbtm.getElementsByTagName("IMG")[0].className = "wgt_arrow wgt_down";
                    p.rollbtm.getElementsByTagName("IMG")[0].style.display = "";
                    p.rollbtm.style.cursor = "pointer";
                }
            };
            //   Core.Events.addEvent(p.rolltop, function(){
            //       var fromto = getCurAndNext("up");
            //       roll(fromto["from"], fromto["to"], "up");
            //   }, "click");
            // Core.Events.addEvent(p.rollbtm, function(){
            //       var fromto = getCurAndNext("down");
            //       roll(fromto["from"], fromto["to"], "down");
            //   }, "click");
            //	Core.Events.addEvent(p.rollbtm, function(){
            //		  doMouseDownTimmer = setInterval(function(){
            //		  p.contentw.scrollTop+=10;
            //		  },20);
            //    }, "mousedown");
            //	Core.Events.addEvent(p.rollbtm, function(){
            //		  doMouseDownTimmer = clearInterval(doMouseDownTimmer);
            //    }, "mouseup");
            //	Core.Events.addEvent(p.rolltop, function(){
            //        p.contentw.scrollTop-=10;
            //    }, "mousedown");
            Core.Events.addEvent(p.contentw, function(){
                chkToporBtm();
            }, "scroll");
            var dorollupTimmer, dorollbtmTimmer
            new App.dblclick(p.rollbtm, {
                "dbclickevt": function(){
                    var fromto = getCurAndNext("down");
                    roll(fromto["from"], fromto["to"], "down");
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                },
                "mousedwevt": function(){
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                    dorollbtmTimmer = setInterval(function(){
                        p.contentw.scrollTop += 10;
                    }, 20);
                },
                "mouseupevt": function(){
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                }
            });
            new App.dblclick(p.rolltop, {
                "dbclickevt": function(){
                    var fromto = getCurAndNext("up");
                    roll(fromto["from"], fromto["to"], "up");
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                },
                "mousedwevt": function(){
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                    dorollupTimmer = setInterval(function(){
                        p.contentw.scrollTop -= 10;
                    }, 20);
                },
                "mouseupevt": function(){
                    clearInterval(dorollupTimmer);
                    clearInterval(dorollbtmTimmer);
                }
            });
        }
        else {
            p.rollbtm.getElementsByTagName("IMG")[0].style.display = "none";
            p.rollbtm.style.cursor = "auto";
        }
        var contentls = Core.Dom.getElementsByClass(contentw, "DIV", "wgtCell");
        for (var i = 0; i < contentls.length; i++) {
			var html = contentls[i].innerHTML;
			var a = contentls[i].getElementsByTagName("a");
			var len = a.length;
			var i1 = 0;
			if(len){
				for(i1; i1<len; i1++){
					if(a[i1].innerHTML.indexOf($CLTMSG["CD0023"])>-1){
						contentls[i].mblogUrl = a[i1].href;
					}
				}
			}
			contentls[i].style.cursor="pointer";
            Core.Events.addEvent(contentls[i], (function(el){
                return function(){
                    el.className = "wgtCell wgt_hover";
                    var cmt = Core.Dom.getElementsByClass(el, "SPAN", "wgtCell_cmt");
                    if (cmt.length > 0) {
                        cmt[0].style.display = "";
                    }
                }
            })(contentls[i]), 'mouseover');
            Core.Events.addEvent(contentls[i], (function(el){
                return function(){
                    el.className = "wgtCell";
                    var cpt = Core.Dom.getElementsByClass(el, "SPAN", "wgtCell_cmt");
                    if (cpt.length > 0) {
                        cpt[0].style.display = "none";
                    }
                }
            })(contentls[i]), 'mouseout');
			Core.Events.addEvent(contentls[i], (function(el){
                return function(){
					var url = el.mblogUrl;
                    if(url){
						window.open(url,"mblog");
						Core.Events.stopEvent();
					}
                }
            })(contentls[i]), 'click');
        }
    }
    //------------------------------------------chibin add end ------------------------------------------
    //	var shiftShow = function(list){
    //		var that = {};
    //		var current = 0;
    //		var movingkey = true;
    //		moreUrl = list[0]['title'].getAttribute("res");
    //		for(var i = 0, len = list.length; i < len; i += 1){
    //			(function(k){
    //				Core.Events.addEvent(list[k]['title'],function(){
    //					if(k == current){
    //						return false;
    //					}
    //					list[k]['title'].className = "selected";
    //					list[current]['title'].className = '';
    //					list[k]['content'].style["display"] = "block";
    //					list[current]['content'].style["display"] = 'none';
    //					moreUrl = list[k]['title'].getAttribute("res");
    //					current = k;
    //					list[k]['content'].parentNode.scrollTop = 0;
    //				},'click');
    //			})(i);
    //		}
    //	};
    //	
    //	shiftShow([
    //		{'title' : $E('tag_all'),'content' : $E('content_all')},
    //		{'title' : $E('tag_follow'),'content' : $E('content_follow')}
    //	]);
    var setTimeTag2Url = function(_url){
        var lastUrl = /^(.+&ct=)[0-9]+$/.exec(_url);
        if (lastUrl) {
            return lastUrl[1] + (new Date()).getTime();
        }
        else {
            return _url + '&ct=' + (new Date()).getTime();
        }
    }
    if (p.submit && p.content) {
        p.submit.disabled = "disabled";
        p.submit.className = "wgt_btn_dis";
        Core.Events.addEvent(p.submit, function(){
            if (p.submit.disabled == "disabled") {
                p.submit.className = "wgt_btn_dis";
                return false;
            }
            var content = Core.String.trim(p.content.value);
            if (content) {
                if (!scope.$uid) {
                    App.login();
                    return false;
                }
                else {
                    var tags = scope.$tags;
                    if (tags) {
                        var tagString = "";
                        var i = 0;
                        for (i; i < tags.length; i++) {
                            tagString += "#" + decodeURIComponent(tags[i]) + "#";
                        }
                        content = tagString + content;
                    }
                    p.submit.disabled = "disabled";
                    p.submit.className = "wgt_btn_dis";
                    Utils.Io.Ajax.request('/mblog/publish.php', {
                        'POST': {
                            'content': content,
                            'styleid': 1,
                            'from': scope['$pageid']
                        },
                        'onComplete': function(json){
                            if (json.code == 'A00006') {
                                setTimeout(function(){
                                    window.location.href = setTimeTag2Url(window.location.href);
                                    window.location.reload(true);
                                }, 800);
                                
                            }
                            else {
                                p.content.blur();
                                if (json.code == "M00003") {
                                    App.login();
                                    return false;
                                }
                                else {
                                    //p.limitTip.innerHTML = $SYSMSG[json["code"]];
                                    App.showTip($SYSMSG[json["code"]]);
                                }
                            }
                            p.submit.disabled = "";
                            p.submit.className = "wgt_btn";
                        },
                        'onException': function(){
                            //error();
                        },
                        'returnType': 'json'
                    });
                }
                
            }
            return false;
        }, "click");
        
        var listener = (function(c, b, t){
            c.value = $CLTMSG['CD0019'];
            c.style.color = "#999999";
            var tip = $CLTMSG['CD0019'];
            return function(event){
            	if(event){
            		var sType = event.type;
	                if (sType == "focus") {
	                    c.style.color = "#333333";
	                    if (c.value == tip) {
	                        c.value = "";
	                    }
	                }
	                if (sType == "blur") {
	                    c.style.color = "#999999";
	                    if (Core.String.trim(c.value) == "") {
	                        c.value = tip;
	                        return;
	                    }
	                }
            	}
            	var sLength = 280;
                var value = Core.String.trim(c.value);
                var snapLength = Core.String.byteLength(value.replace(new RegExp($CLTMSG["CD0019"],"g"), ""));
                if (snapLength > sLength || snapLength == 0) {
                    var txt = "";
                    if(snapLength>0){
						txt = $CLTMSG['CD0020'].replace(/#\{len\}/,Math.ceil(( snapLength - sLength )/2));
					}else{
						txt = $CLTMSG['CD0021'].replace(/#\{len\}/,sLength/2);
					}
                    t.innerHTML = txt;
                    b.disabled = "disabled";
                    b.className = "wgt_btn_dis";
                }
                else {
                    t.innerHTML = $CLTMSG['CD0021'].replace(/#\{len\}/,Math.ceil((sLength - snapLength)/2));
                    b.disabled = "";
                    b.className = "wgt_btn";
                }
            };
        })(p.content, p.submit, p.limitTip);
        
        Core.Events.addEvent(p.content, listener, "focus");
        Core.Events.addEvent(p.content, listener, "blur");
        Core.Events.addEvent(p.content, listener, "keyup");
        var interval;
        var limit = function(){
        	interval = setInterval(listener,500);
        };
		Core.Events.addEvent(p.content, limit, "focus");
        Core.Events.addEvent(p.content, function(){
        	clearInterval(interval);
        }, "blur");
        
        Core.Events.addEvent(p.content, function(event){
			if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
                p.submit.blur();
                Core.Events.fireEvent(p.submit, "click");
            }
        }, "keyup");
    }
    
});
