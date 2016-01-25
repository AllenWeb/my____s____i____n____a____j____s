/**
 * @fileoverview 微博广场-名人堂
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("diy/opacity.js");

$registJob('square_star', function(){
    var _addEvent = Core.Events.addEvent;
    
    //加关注  因为DOM结构不同，所以重载App.followadd函数------------------------------------------------
    App.followadd = function(uid, el, url){
        url = "/attention/aj_addfollow.php";
        function cb(json){
            el.innerHTML = '<span class="add_yet"></span>'+$CLTMSG['CC2510'];
            el.className = "concernBtn_Yet";
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
    };
    
    //---------------------------------搜索人物-------------------------------------------------------
    var oInput = $E("search_user"), oUserBtn = $E("search_btn");
    oInput.title = oUserBtn.title = $CLTMSG['CX0011'];
    function search(event){
        var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
        if (value) {
            location.href = "/search/user.php?search=" + encodeURIComponent(encodeURIComponent(value));
        }
        else {
            oInput.focus();
        }
        Core.Events.stopEvent(event);
    }
    _addEvent(oUserBtn, search, "click");
    
    //--------------------------------滚动显示名人新鲜事，一次仅显示一个------------------------------------
    var starList = $E('star_news');
    var userInfoList = Core.Dom.getElementsByClass(starList, "DIV", "userInfo");
    //自动切换
    var interval;
    var parsest;
    var parseend = new Date();
    var st;
    var alltime = 6000;//晃来晃去之后剩下的时间;
    var _moveover = function(el){
        var event = Core.Events.getEvent();
        var relatedTarget = event.relatedTarget || event.fromElement;
        if (el != relatedTarget && relatedTarget && !Core.Dom.contains(el, relatedTarget)) {
            parseend = new Date();//轮回暂停时间
            clearInterval(interval);
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
				slideShow();
                interval = startInterVal(scope._index + 1);
                clearTimeout(st);
            }, alltime - parseInt(parseend - parsest));
            alltime = alltime - parseInt(parseend - parsest);
            parsest = new Date();
        }
    }
    
    
    var startInterVal = function(index){
        return interval = setInterval(function(){
            parsest = new Date();//一次轮回开始时间
			slideShow(index++);
            if (index > 5) {
                index = 1;
            }
            scope._index = index;
        }, 6000);//chibin modify 将间隔改为6000
    }
    var index = 2;
    startInterVal(index);
    _addEvent(starList, function(){
        _moveover(starList);
    }, 'mouseover');
    _addEvent(starList, function(){
        _moveout(starList);
    }, 'mouseout');
    parsest = new Date();//一次轮回开始时间
    var curr = 0;
    function slideShow(index){
        //移动步伐
        var step = 1;
        App.opacity(userInfoList[curr], {
            'first': 100,
            'last': 0,
            'time': 5
        });
        var arg = arguments;
       	var stt = setTimeout(function(){
            userInfoList[curr].style.display = 'none';
            curr += step;
            if (curr >= userInfoList.length || curr < 0) {
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
    }
});
