/**
 * @fileoverview 微博广场首页
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/miniblog_follow.js");
$import("sina/core/string/byteLength.js");
$import("diy/opacity.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/dom/contains.js");
$registJob('square_index', function(){
    var shell = $E('star_list');
    var box =  shell.parentNode;
    var items = shell.getElementsByTagName('DD');
    
    App.pulley($E('turn_left'), $E('turn_right'),box,items,shell,3);
    
    var _addEvent = Core.Events.addEvent;
    
    //加关注  因为DOM结构不同，所以重载App.followadd函数
    App.followadd = function(uid, el, url){
        url = "/attention/aj_addfollow.php";
        function cb(json){
            el.innerHTML = '<span class="add_yet"></span>'+$CLTMSG['CX0025'];
            el.className = "concernBtn_Yet";
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
    };
    
    //---------------------------------搜索话题,人物-------------------------------------
    var oInput = $E("keyword"), oTopicBtn = $E("topic_search"), oUserBtn = $E("user_search");
    function search(event){
        var event = event || window.event;
        var target = event.target || event.srcElement;
        var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
        if (value) {
            if (target == oTopicBtn) {
                location.href = "/k/" + encodeURIComponent(encodeURIComponent(value));
            }
            else {
                location.href = "/search/user.php?search=" + encodeURIComponent(encodeURIComponent(value));
            }
        }
        else {
            oInput.focus();
        }
        Core.Events.stopEvent(event);
    }
    _addEvent(oTopicBtn, search, "click");
    _addEvent(oUserBtn, search, "click");
    
    //-------------------------------------热门转发和热门评论--------------------------------
    var oForwardBtn = $E("topre_tab"), oCommentBtn = $E("topcomm_tab");
    var oForwadList = $E("top_re"), oCommentList = $E("top_comm");
    var moreForwards = $E("topre_more"), moreComments = $E("topcomm_more");
    var more_re = $E('more_re'), more_cmt = $E('more_cmt');  
    _addEvent(oForwardBtn, function(){
        oForwadList.style.display = "";
        oCommentList.style.display = "none";
        oForwardBtn.className = "zfMore";
        oCommentBtn.className = "plMore2";
        moreForwards.style.display = "";
        moreComments.style.display = "none";
        more_re.style.display = "";
        more_cmt.style.display = "none";
    //}, "click");
    }, "mouseover");
    _addEvent(oCommentBtn, function(){
        oForwadList.style.display = "none";
        oCommentList.style.display = "";
        oForwardBtn.className = "zfMore2";
        oCommentBtn.className = "plMore";
        moreForwards.style.display = "none";
        moreComments.style.display = "";
        scope.hotcomment_index(oCommentList);
        more_re.style.display = "none";
        more_cmt.style.display = "";
    //}, "click");
    }, "mouseover");
    //-------------------------------------点击热门评论的时候 chibin add---------------------------------
    scope.hotcomment_index = function(list){
        if (scope.hotcomment_open) {
            return false;
        }
		Utils.Io.Ajax.request("/pub/aj_indextopcmt.php", {
            "POST": {},
            "onComplete": function(oResult){
                list.innerHTML = oResult.html;
                scope.hotcomment_open = true;
                App.bindMedia(list);
            },
            "onException": function(){
            },
            returnType: "json"
        });
    };
    
    //---------------------------------------------------------------------------------------
    //重载加评论函数,增加本页特定的评论数量同步功能
    App.Comment._initAddComment = App.Comment.addComment;
    App.Comment.addComment = function(sUrl, oNode, fCallBack, fFail){
        function callBack(arg, oData){
            if (typeof fCallBack === "function") {
                fCallBack(arg, oData);
            }
            //普通列表的评论
            setTimeout(function(){//延时是为了使性能慢的IE6反应正常
                if (oNode.className === "btn_normal") {
                    var oCount = Core.Dom.getElementsByClass(oNode.parentNode.parentNode.parentNode.parentNode.parentNode, "P", "count")[0];
                    if (oCount) {
                        var count = parseInt(oCount.innerHTML);
                        oCount.innerHTML = isNaN(count) ? 1 : count + 1;
                    }
                }
            }, 100);
        }
        
        App.Comment._initAddComment(sUrl, oNode, callBack, fFail);
    }
    
    //重载转发函数,增加本页特定的转发数量同步功能
    App._initModForward = App.ModForward;
    App.ModForward = function(fid, content, uid, el, exid, forwardName, forwardContent, uname, callback){
        var callback = callback ||
        function(){
            var oCount = Core.Dom.getElementsByClass(el.parentNode.parentNode.parentNode, "P", "count")[0];
            if (oCount) {
                var count = parseInt(oCount.innerHTML);
                oCount.innerHTML = isNaN(count) ? 1 : count + 1;
            }
        }
        App._initModForward(fid, content, uid, el, exid, forwardName, forwardContent, uname, callback)
    };
    
    //-------------------------------------今日看点 fade in fade out------------------------------
    var oList = $E('userinfo_list');
    var userInfoList = Core.Dom.getElementsByClass(oList, "DIV", "userInfo");
    /*chibin add 2010-3-8
     增加鼠标浮动和移开
     */
    var parsest;
    var parseend;
    var timerid;
    var st;
    var alltime = 6000;//晃来晃去之后剩下的时间;
    var _moveover = function(el){
        var event = Core.Events.getEvent();
        var relatedTarget = event.relatedTarget || event.fromElement;
        if (el != relatedTarget && relatedTarget && !Core.Dom.contains(el, relatedTarget)) {
            parseend = new Date();//轮回暂停时间
            clearInterval(timerid);
            clearTimeout(st);
        }
        Core.Events.stopEvent();
    }
    var _moveout = function(el){
        var event = Core.Events.getEvent();
        var relatedTarget = event.relatedTarget || event.toElement;
        if (el != relatedTarget && relatedTarget && !Core.Dom.contains(el, relatedTarget)) {
            clearTimeout(st);
            st = setTimeout(function(){
                tweet.loops();
                timerid = setInterval(function(){
                    tweet.loops();
                }, 6000);
                clearTimeout(st);
            }, alltime - parseInt(parseend - parsest));
            alltime = alltime - parseInt(parseend - parsest);
            parsest = new Date();
        }
    }
    _addEvent(oList, function(){
        _moveover(oList)
    }, "mouseover");
    _addEvent(oList, function(el){
        _moveout(oList)
    }, "mouseout");
    parsest = new Date();//一次轮回开始时间
    //限制高度目的是减少切换时页面抖动
    oList.style.height = "81px";
    var tweet = (function(){
        var curr = 0;
        var that = {};
        that.loops = function(){
            App.opacity(userInfoList[curr], {
                'first': 100,
                'last': 0,
                'time': 5
            });
            var stt = setTimeout(function(){
                userInfoList[curr].style.display = 'none';
                curr += 1;
                if (curr >= userInfoList.length) {
                    curr = 0;
                }
                userInfoList[curr].style.display = 'block';
                userInfoList[curr].style.zoom = 1;
                App.setOpacity(userInfoList[curr], 0);
                App.opacity(userInfoList[curr], {
                    'first': 0,
                    'last': 100,
                    'time': 5
                });
                clearTimeout(stt);
            }, 600);
            alltime = 6000;
        };
        return that;
    })();
    
    timerid = setInterval(function(){
        parsest = new Date();//一次轮回开始时间
        tweet.loops()
    }, 6000);
    
});
