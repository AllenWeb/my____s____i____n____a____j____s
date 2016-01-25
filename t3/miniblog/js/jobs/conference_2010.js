/**
 * @fileoverview 2010两会专题活动页
 * @author yuwei
 */
$import("jobs/miniblog_follow.js");
$import("diy/opacity.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/marquee.js");

$registJob('conference_2010', function(){
	var _addEvent = Core.Events.addEvent;
    
    //加关注  因为DOM结构不同，所以重载App.followadd函数
    App.followadd = function(uid, el, url){
        var url = "/attention/aj_addfollow.php";
        function cb(json){
            if(scope.media){
        		el.parentNode.innerHTML = '已关注';
        		el.className = "linkB";
        	}else{
        		el.innerHTML = '<span class="add_yet"></span>已关注';
           		el.className = "concernBtn_Yet";
        	}
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
    };
    
    //-----------两会今日热话题 fade in fade out------------------------------
    (function(){
    	var oList = $E('hot_box');
    	if(oList){
    		var userInfoList  = [],nodes = oList.childNodes;
		    for(var i=0,len=nodes.length;i<len;i++){
		    	if(nodes[i].tagName && nodes[i].tagName.toUpperCase() === "DIV"){
		    		userInfoList.push(nodes[i]);
		    	}
		    }
		    var tweet = (function(){
		        var curr = 0;
		        var that = {};
		        that.loops = function(){
		            App.opacity(userInfoList[curr], {
		                'first': 100,
		                'last': 0,
		                'time': 10
		            });
		            setTimeout(function(){
		                userInfoList[curr].style.display = 'none';
		                curr += 1;
		                if (curr >= userInfoList.length) {
		                    curr = 0;
		                }
		                userInfoList[curr].style.display = 'block';
		                userInfoList[curr].style.zoom = 1;
		                App.opacity(userInfoList[curr], {
		                    'first': 0,
		                    'last': 100,
		                    'time': 10
		                });
		            }, 1000);
		        };
		        return that;
		    })();
		    setInterval(function(){
		        tweet.loops()
		    }, 5000);
    	}
    })();
    
    //----------------我来说两会----------------------------------
    scope.talkAboutPolitics = function(/*HTML elment's id*/topicID){
    	if(!scope.$uid){
    		return App.ModLogin(null);
    	}
    	var topic = ($E(topicID) && $E(topicID).value)||"";
    	App.publisherDialog.show("#" + topic + "#");
    };
    
    //----------------一键关注-------------------------------------
    scope.followChecked = function(/*UL element id*/id){
    	if(!scope.$uid){
    		return App.ModLogin(null);
    	}
    	var uids = [];
    	var oUL = $E(id);
    	var list = oUL.getElementsByTagName("input");
    	for(var i=0,len=list.length;i<len;i++){
    		if(list[i].type ==="checkbox" && list[i].checked){
    			if(list[i].getAttribute("uid")){
    				uids.push(list[i].getAttribute("uid"));
    			}
    		}
    	}
    	if(uids.length > 0){
    		App.doRequest({
				'uid': uids.join(","),
				'fromuid': scope.$uid
			}, "/attention/aj_addfollow.php", function(data,json){
				App.alert($SYSMSG[json.code],{icon:3});
			}, function(json){
				App.alert($SYSMSG[json.code],{icon:2});
			});
    	}else{
    		App.alert("请选择用户",{icon:5});
    	}
    };
    
    //------------切换转发榜、热图、昨日热点---------------------------
    (function(){
    	var btn_fwd = $E("btn_fwd"),btn_picfwd = $E("btn_picfwd"),btn_fwd_old = $E("btn_fwd_old");
    	var top_fwd = $E("top_fwd"),top_picfwd = $E("top_picfwd"),top_fwd_old = $E("top_fwd_old");
    	_addEvent($E("btn_fwd"),function(){
    		btn_fwd.parentNode.className = "cur";
    		btn_picfwd.parentNode.className = "";
    		btn_fwd_old.parentNode.className = "";
    		
    		top_fwd.style.display = ""; 
    		top_picfwd.style.display = "none"; 
    		top_fwd_old.style.display = "none"; 
    	},"click");
    	_addEvent($E("btn_picfwd"),function(){
    		btn_fwd.parentNode.className = "";
    		btn_picfwd.parentNode.className = "cur";
    		btn_fwd_old.parentNode.className = "";
    		
    		top_fwd.style.display = "none"; 
    		top_picfwd.style.display = ""; 
    		top_fwd_old.style.display = "none"; 
    	},"click");
    	_addEvent($E("btn_fwd_old"),function(){
    		btn_fwd.parentNode.className = "";
    		btn_picfwd.parentNode.className = "";
    		btn_fwd_old.parentNode.className = "cur";
    		
    		top_fwd.style.display = "none"; 
    		top_picfwd.style.display = "none"; 
    		top_fwd_old.style.display = ""; 
    	},"click");
    })();
    
    //重载转发函数,增加本页特定的转发数量同步功能-----------------------------------------------------------
    App._initModForward = App.ModForward;
    App.ModForward = function(fid, content, uid, el, exid, forwardName, forwardContent, uname, callback){
        var callback = function(){
            var oCount = Core.Dom.getElementsByClass(el.parentNode.parentNode.parentNode.parentNode, "P", "count")[0];
            if (oCount) {
                var count = parseFloat(oCount.innerHTML);
                oCount.innerHTML = isNaN(count) ? 1 : count + 1;
            }
        }
        App._initModForward(fid, content, uid, el, exid, forwardName, forwardContent, uname, callback)
    }
    
    //------------------异步获取话题总数----------------------------------
    if($E("topic_word")){
    	Utils.Io.Ajax.request("/pub/aj_gettopicnum.php", {
		    "POST": {'maybeatt':$E("topic_word").value},
		    "onComplete": function(oResult){
		        if (oResult.code == "A00006") {
		           $E("topic_word_num").innerHTML = oResult.data['maybeatt'][0];
		        }
		    },
		    "onException": function(){
		    	
		    },
		    returnType: "json"
		});
    }
    
    //-------------向上缓动显示微博小秘书播报内容-------------------------------------------
    (function(){//关键是定高小于总高，ovflow为hidden.fade透明效果则需要png图片
    	var marqueeBox = $E("txt_list");
    	if(marqueeBox){
    		var ddList = marqueeBox.getElementsByTagName("dd");
			var items = [];
			for(var i = 0, len = ddList.length;i < len; i += 1){
				if(ddList[i].className != "more"){
					items.push(ddList[i]);
				}
			}
			var doMarquee = new App.marquee(marqueeBox,items,{forward:"up",speed:1});
			Core.Events.addEvent(marqueeBox,function(){doMarquee.pause()},'mouseover');
			Core.Events.addEvent(marqueeBox,function(){doMarquee.restart()},'mouseout');
			doMarquee.start();
    	}
    })();
});