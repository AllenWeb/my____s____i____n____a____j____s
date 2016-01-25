/**
 * @fileoverview 世界杯专题
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("diy/dialog.js");
$import("diy/date.js");
$import("sina/core/array/each.js");
$import("sina/core/dom/contains.js");
$import("sina/utils/cookie/cookie.js");
$import("diy/marquee2.js");
$import("sina/core/dom/insertHTML.js");

$registJob("worldcup", function(){
    var _addEvent = Core.Events.addEvent, cache = {}, firstCached = false;
    var Task = {
        /**
         * 处理tab点击事件
         * @param{String}ulID
         * @param{String}containerID
         * @param{String}url
         * @param{Function}callback
         * */
        onTabClick: function(ulID, containerID, url, callback){
            var nodes = $E(ulID).children, me = this;
            for (var i = 0, len = nodes.length; i < len; i++) {
                (function(i){
                    _addEvent(nodes[i], function(){
                        var moduleID = nodes[i].getAttribute('module_id');
                        var keyword = nodes[i].getAttribute('keyword');
                        var uid = nodes[i].getAttribute('uid');
                        var filter = nodes[i].getAttribute('filter');
                        var cacheID = moduleID + (keyword ? keyword : "_") + (uid ? uid : "_");
                        
                        if (moduleID && moduleID.match(/\d/)[0]) {
                            var params = {
                                'module': moduleID.match(/\d/)[0]
                            };
                            if (keyword) {
                                params['keyword'] = keyword;
                            }
                            if (uid) {
                                params['uid'] = uid;
                            }
                            if(filter){
                                params['filter'] = filter;
                            }
                            me.request(url, params, function(result){
                                //显示并缓存应答内容
//                                cache[cacheID] = $E(containerID).innerHTML = result.html;
                                if(result.keyword && scope.$worldCupTopic){
                                    var content;
                                    if(content = $E('publish_editor')){
                                        content.value = content.value.replace(scope.$worldCupTopic,result.keyword);
                                        scope.$worldCupTopic = result.keyword;
                                    }
                                }
                                
                                if(typeof callback === 'function'){
                                    callback($E(containerID),result);
                                }
                                
                                me.current(nodes, nodes[i]);
                            });
                        }
                    }, "click");
                })(i);
            }
            
            return this;
        },
        /**
         * 设置当前tab样式
         * @param{HTMLElement NodeList}nodeList
         * @param{HTMLElement}node
         * */
        current: function(nodeList, node){
            for (var i = 0, len = nodeList.length; i < len; i++) {
                if (nodeList[i].className !== "more") {
                    nodeList[i].className = "";
                }
            }
            node.className = "cur";
        },
        /**
         * 滚筒效果
         * */
        pully: function(){
            var shell = $E("pully_list");
            shell.style.width = '2000px';
            var box = shell.parentNode;
            box.style.width = 235*3 + "px";
            var items = shell.getElementsByTagName('LI');
            App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, 3, 235,{
                endRFun: function(){
                    box.scrollLeft = 235*3;
                }
            });
        },
        /**
         * 向下滑动
         * @param{HTMLElement}marqueeBox:容器(ul)
         * */
        slideDown: function(marqueeBox){
            var marqueeBox = marqueeBox||$E("main_container");
            var list = marqueeBox.getElementsByTagName("li");
            var items = [];
            for (var i = 0, len = list.length; i < len; i++) {
                items.push(list[i]);
                (function(li){
                    li.onclick = function(){
                        //点击缩略图时去掉高度限制
                        li.style.cssText = "";
                        if(Task._updateFeedListTimer){
                            clearInterval(Task._updateFeedListTimer);
                            Task._updateFeedListTimer = null;
                        }
                    };
                })(list[i]);
            }
            try{
                var marquee = Task.marquee = new App.marquee2(marqueeBox, items, {
                    forward: "down",
                    speed: 20
                });
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.pause();
                }, 'mouseover');
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.restart();
                    if(!Task._updateFeedListTimer){
                        Task.updateFeedList();
                    }
                }, 'mouseout');
                Task.marquee.start();
            }catch(e){
                
            }
            
        },
        /**
         * 世界杯倒计时
         * */
        countDown: function(){
            function loop(){
                var time = scope.$countDown;
                if(time){
                    time = time.split("-");
                    var NowTime  = new Date(time[0], time[1]-1,time[2],time[3],time[4],time[5]);//当前日期
                    if(!Task._initTime){
                        Task._initTime = NowTime.getTime();
                    }
                    var EndTime = new Date(2010,5,11,22,0,0); //截止时间:2010年6月11日22时0分0秒
                    var nMS = EndTime.getTime() - Task._initTime;
                    var nD = Math.floor(nMS / (1000 * 60 * 60 * 24));
                    var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
                    var nM = Math.floor(nMS / (1000 * 60)) % 60;
                    var nS = Math.floor(nMS / 1000) % 60;
                    if (nS >= 0) {
                        $E('countdown').innerHTML = 'day<span>天</span>hour<span>时</span>mini<span>分</span>sec<span>秒</span>'
                        .replace('day',nD).replace('hour',nH).replace('mini',nM).replace('sec',nS);
                    }
                }
            }
            setInterval(function(){
                loop();
                Task._initTime = (new Date(Task._initTime + 1000)).getTime();
            }, 1000);
        },
        //微博日报中的世界杯倒计时
        countDown2:function(){
            function loop(){
                var time = scope.$countDown2;
                if(time){
                    time = time.split("-");
                    var NowTime  = new Date(time[0], time[1]-1,time[2],time[3],time[4],time[5]);//当前日期
                    if(!Task._initTime2){
                        Task._initTime2 = NowTime.getTime();
                    }
                    var EndTime = new Date(2010,5,11,22,0,0); //截止时间:2010年6月11日22时0分0秒
                    var nMS = EndTime.getTime() - Task._initTime2;
                    var nD = Math.floor(nMS / (1000 * 60 * 60 * 24));
                    var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
                    var nM = Math.floor(nMS / (1000 * 60)) % 60;
                    var nS = Math.floor(nMS / 1000) % 60;
                    if (nS >= 0) {
                        $E('countdown_day').innerHTML = nD;
                        $E('countdown_hour').innerHTML = nH;
                        $E('countdown_minute').innerHTML = nM;
                        $E('countdown_second').innerHTML = nS;
                    }
                }
            }
            setInterval(function(){
                loop();
                Task._initTime2 = (new Date(Task._initTime2 + 1000)).getTime();
            }, 1000);
        },
        /**
         * 5分钟更新一次(有xxx条微博讨论过世界杯)
         * */
        discuz:function(el){
//            function loop(){
//                Task.request("/public/aj_getsearchtotalsum.php?type=worldcup", {}, function(data){
//                    el.innerHTML = data.total;
//                }, "GET");
//            }
//            loop();
//            setInterval(function(){
//                loop();
//            }, 300000);
        },
        updateFeedList:function(){
//            var children = $E('main_content').children,len = children.length,oTab;
//            Task._updateFeedListTimer = setInterval(function(){
//                for(var i=0;i<len;i++){
//                    if(children[i].className === 'cur'){
//                        oTab = children[i];
//                        break;
//                    }
//                }
//                if(Task.marquee && Task.marquee.stop){
//                    Task.marquee.stop();
//                }
//                Core.Events.fireEvent(oTab,"click");//需要去掉原缓存
//            },10000);
        }
    };
    Task.request = App.request;
    
    //定时(5秒)刷新比分-------------------------------------------------------------------------
    var oScore;
    if((oScore = $E('score')) && (scope.$uid != "")){
//        setInterval(function(){
//            App.request("/zt/worldcup/aj_scores.php", {
//                'matchid':oScore.getAttribute('matchid')
//            }, function(data){
//                if(data.score){
//                   oScore.innerHTML = data.score; 
//                }
//            }, "GET");
//        },5000);
    }
    
    if($E('discuss')){
        Task.discuz($E('discuss'));
    }
    
    if($E('countdown')){
        Task.countDown();
    }
    if($E('countdown_day')){
       Task.countDown2(); 
    }
    
    if($E('main_container')){
        Task.slideDown($E('main_container'));
    }
    if ($E('main_content')) {
        if($E('main_container')){
//            Task.slideDown($E('main_container'));
            
            Task.onTabClick("main_content", "main_container", "/zt/aj_news.php",function(ul,json){
                if(Task.marquee && Task.marquee.stop){
                    Task.marquee.stop();
                }
                //
    			if(ul.children.length>=30){
    			    var feedBox = $E("temp_main_container") || document.createElement('ul');
                    feedBox.id = "temp_main_container";
        			feedBox.style.display = 'none';
        			feedBox.innerHTML = json.html;
        			document.body.appendChild(feedBox);
        			
        			try{
            			var oldChildren = ul.children, newChildren = feedBox.children;
            			while(ul.children.length - newChildren.length){
            			    ul.removeChild(ul.children[ul.children.length-1]);
            			}
            			Core.Dom.insertHTML(ul,json.html,"beforeend");
        			}catch(e){
        			}
    			}else{
                    try{
    			    Core.Dom.insertHTML(ul,json.html,"beforeend");
                    }catch(e){
                    }
    			}
                //
                Task.slideDown(ul);
            });
        }
        if($E('team_pk') && $E('livegirl')){
            Task.onTabClick("team_pk", "livegirl", "/zt/worldcup/aj_account.php");
            
            var children1 = $E('team_pk').children;
            Core.Array.each(children1, function(li){
                _addEvent(li,function(e){
                    Core.Events.fireEvent(li,"click");
                },'mouseover');
            });
            
            var len1 = children1.length,oTab1;
            //每1分钟刷新一次
//            setInterval(function(){
//                for(var i=0;i<len;i++){
//                    if(children1[i].className === 'cur'){
//                        oTab1 = children1[i];
//                        break;
//                    }
//                }
//                Core.Events.fireEvent(oTab1,"click");//需要去掉原缓存
//            },1000*60);
        }
        
        //每10秒钟刷新一次---------------------------------------------------------
        Task.updateFeedList();
        //--------------------------------------------------------------------
        
    }
    if ($E("pully_list")) {
        Task.pully();
    }
    
    //加关注  因为DOM结构不同，所以重载App.followadd函数
    App.followadd = function(uid, el, name,custom){
        var url = "/attention/aj_addfollow.php";
        function cb(json){
            if(custom){
                el.parentNode.innerHTML = $CLTMSG['CX0025'] + name;
                return;
            }
            el.innerHTML = '<span class="add_yet"></span>' + $CLTMSG['CX0025'];
            el.className = "concernBtn_Yet";
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
    };
    /**
     * @param{String}match_id：比赛id
     * @param{String}team_id：球队id
     * @param{HTMLElement}dom
     * */
    scope.supportTeam = function(match_id, team_id, dom){
        return App.alert($CLTMSG['CD0178'],{width:370});//下线
        
        Task.request('/zt/worldcup/aj_support_country.php', {
            'matchid': match_id,
            'teamid': team_id
        }, function(result){
            var oCount = dom.getElementsByTagName("SPAN")[0];
            var count = parseInt(oCount.innerHTML);
            oCount.innerHTML = isNaN(count) ? 1 : count + 1;
            
            //引导用户披国旗
            if(result){
                if((result.msg === 'CD0176') && result.team && result.number){
                    var dialog = App.confirm($CLTMSG['CD0176'].replace(/#\{team\}/,result.team).replace(/#\{number\}/,result.number), {
                        icon: 3,
                        ok:function(){
                            Task.request("/zt/worldcup/aj_myteam.php", {
                                'teamid': team_id,
                                'tag': 0
                            }, function(result){
                                dialog.close();
                                var oAlert = App.alert($SYSMSG[result.code], {
                                    icon: 3
                                });
                                setTimeout(function(){
                					if(!oAlert._distory){
                						oAlert.close();
                					}
                                },1000);
                            },'POST');
                        },
                        cancel:function(){
                            dialog.close();
                        }
                    });
                }
            }
        }, "POST");
    };
    //往日回顾-------------------------------------------------------------------------
    var oReview;
    if (oReview = $E('review')) {
        /**
         * @param{Array}result:有比赛的可点击日期（链接-yyyymmdd）
         * */
        function showReview(result){
            var box = $C('DIV'), dateBox1 = $C('DIV'), dateBox2 = $C('DIV');
            box.className = "pc_caldr";
            box.style.cssText = 'z-index:999;position:absolute;display:none';
            var pos = Core.Dom.getXY(oReview);
            box.style.left = pos[0] + 'px';
            box.style.top = pos[1] + 20 + 'px';
            box.appendChild(dateBox1);
            var gap = $C("div");
            gap.style.height = "10px";
            gap.style.clear = "both";
            box.appendChild(gap);
            box.appendChild(dateBox2);
            document.body.appendChild(box);
            var date1 = new domkey.Date(dateBox1, function(){}, ((new Date()).getFullYear()), //年
             5, //6月
             new Date(2010, 5, 11), //点击范围开始
             -1,//点击范围长度［天］
             ((new Date()).getDate()) //选择日期
            );
            
            var date2 = new domkey.Date(dateBox2, function(){}, ((new Date()).getFullYear()), //年
             6, //7月
             new Date(2010,6, 12), //点击范围开始
             -1,//点击范围长度［天］
             ((new Date()).getDate()) //选择日期
            );
            
            box.style.display = '';
            var html = "2010 y m".replace('y', $CLTMSG['CL0315']);
            date1.oDate.parentNode.children[0].innerHTML = html.replace('m', $CLTMSG['CL0506']);//6月
            date2.oDate.parentNode.children[0].innerHTML = html.replace('m', $CLTMSG['CL0507']);//7月
            //
            var days6 = [],days7 = [];
            Core.Array.each(result, function(item){
                if (item.split('-')[1] === '06') {
                    days6.push(item.split('-')[2]);
                }
                if (item.split('-')[1] === '07') {
                    days7.push(item.split('-')[2]);
                }
            });
            
            var map = {
                11:1,12:2,13:5,14:8,15:11,16:17,17:21,18:20,19:30,20:33,21:36,22:39,23:42,24:46,25:50,26:54,27:57,28:59,29:61,30:63,
                '02':64,'03':65,'04':67,'07':68,'08':69
            };
            
            var dateUrl = window.location.href.indexOf("daily")!==-1 ? "daily_": "";
            if($E('publisher_faces')){
                days7 = days7.concat(['02','03','04']); // MINIBLOGREQ-1515 仅在围观页显示
            }
            
            Core.Array.each(date1.oDate.children, function(item){
                for(var i=0,len = days6.length;i < len;i++){
                    if(parseFloat(item.innerHTML) === parseFloat(days6[i])){
                        item.innerHTML = '<a href="/url"><strong>dd</strong></a>'
                        .replace('url',dateUrl === "" ? map[days6[i]] : dateUrl+'201006' + days6[i])
                        .replace('dd',parseFloat(days6[i]));
                    }
                }
            });
            Core.Array.each(date2.oDate.children, function(item){
                for(var i=0,len = days7.length;i < len;i++){
                    if(parseFloat(item.innerHTML) === parseFloat(days7[i])){
                        item.innerHTML = '<a href="/url"><strong>dd</strong></a>'
                        .replace('url',dateUrl === "" ? map[days7[i]] : dateUrl+'201007' + days7[i])
                        .replace('dd',parseFloat(days7[i]));
                    }
                }
            });
            //
            Core.Events.addEvent(document.body, function(e){
                var t = e.srcElement || e.target;
                if (t != oReview && !Core.Dom.contains(box, t)) {
                    box.style.display = "none";
                }
            }, 'click', false);
            return box;
        }
        oReview.onclick = function(){
            if (!oReview._box) {
//                Task.request("/zt/worldcup/aj_review.php", {}, function(data){
//                    oReview._box = showReview(data.result);
//                }, "GET");
                var result = ["2010-06-11","2010-06-12","2010-06-12","2010-06-12","2010-06-13","2010-06-13","2010-06-13","2010-06-14","2010-06-14","2010-06-14","2010-06-15","2010-06-15","2010-06-15","2010-06-16","2010-06-16","2010-06-16","2010-06-17","2010-06-17","2010-06-17","2010-06-18","2010-06-18","2010-06-18","2010-06-19","2010-06-19","2010-06-19","2010-06-20","2010-06-20","2010-06-20","2010-06-21","2010-06-21","2010-06-21","2010-06-22","2010-06-22","2010-06-22","2010-06-23","2010-06-23","2010-06-23","2010-06-23","2010-06-24","2010-06-24","2010-06-24","2010-06-24","2010-06-25","2010-06-25","2010-06-25","2010-06-25","2010-06-26","2010-06-26","2010-06-26","2010-06-27","2010-06-27","2010-06-28","2010-06-28","2010-06-29","2010-06-29","2010-06-30","2010-07-02","2010-07-03","2010-07-03","2010-07-04","2010-07-07","2010-07-08"];
                oReview._box = showReview(result);
            }
            else {
                oReview._box.style.display = oReview._box.style.display === "none" ? "" : "none";
            }
        };
    }
    //-------------------------------------------------------------------------------
    
    //"我的世界杯"支持球队--------------------------------------------------------------
    var oTeams;
    if (oTeams = $E("teams")) {
        var teamID = "";
        $E('support').onclick = function(){
            return App.alert($CLTMSG['CD0178'],{width:370});//下线
            
            var list = oTeams.getElementsByTagName("input");
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i].checked) {
                    teamID = list[i].getAttribute("teamid");
                    break;
                }
            }
            if(teamID){
                Task.request("/zt/worldcup/aj_myteam.php", {
                    'teamid': teamID,
                    'tag': $E("add_tag").checked ? 1 : 0
                }, function(result){
                    var content = '<div class="commonLayer2">\
                        <div class="layerL spL">\
                            <img width="71" src="'+scope.$BASEIMG+'style/images/common/layer/yili.jpg">\
                        </div>\
                        <div style="width: 240px;" class="layerR">\
                            <p class="txt font_14">\
                                活力宝贝温馨提醒\
                                <br>\
                                您已支持成功，是否发布一条微博？\
                            </p>\
                            <div class="MIB_btn">\
                                <a id="baby_tip_ok" href="javascript:void(0)" class="btn_normal"><em>确定</em></a>\
                                <a id="baby_tip_cancel" href="javascript:void(0)" class="btn_notclick"><em>取消</em></a>\
                            </div>\
                        </div>\
                        <div class="clearit">\
                        </div>\
                    </div>';
                    var confirm = new App.Dialog.BasicDialog('提示',content,{
                        zIndex:1000
                    });
                    confirm.show();
                    $E('baby_tip_ok').onclick = function(){
                        confirm.close();
                        App.publisherDialog.success = function(){
                            App.publisherDialog.close();
                            var dialog = App.alert($SYSMSG[result.code],{icon:3,ok:function(){
                                window.location.href = "http://t.2010.sina.com.cn";
                            }});
                        };
                        var str ='南非世界杯，我选择支持team队！快来披上你支持的球队国旗吧，让大家知道你的世界杯立场！http://2010.t.sina.com.cn/myworldcup';
                        App.publisherDialog.show(str.replace('team',result.result.myteam));
                    };
                    $E('baby_tip_cancel').onclick = function(){
                        window.location.href = "http://t.2010.sina.com.cn";
                    };
                    setTimeout(function(){
                        if(!$E("publish_editor2")){
                            window.location.href = "http://t.2010.sina.com.cn";
                        }
                    },5000);
                }, "POST");
            }else{
                App.alert($CLTMSG['CD0171'], {
                    icon: 1
                });
            }
            
        };
    }
    
    var cancelSupport;
    if(cancelSupport = $E("deleteteam")){
        _addEvent(cancelSupport, function(){
            Task.request("/zt/worldcup/aj_delteam.php",{},function(result){
                var msg = $CLTMSG['CD0174'].replace('team',cancelSupport.getAttribute('team'));
                App.alert(msg, {
                    icon: 3,
                    ok:function(){
                        window.location.reload(true);
                    }
                }); 
                setTimeout(function(){
                    window.location.reload(true);
                },2000);
            });
        },"click");
    }
    //-------------------------------------------------------------------------
    //静态化处理后登录状态显示
    (function(){
        if($E("logout_toptray") && $E("login_toptray")){
            if(Utils.Cookie.getCookie("SUR") === "" && Utils.Cookie.getCookie("SUP") === ""){
                $E("logout_toptray").style.display = "";
                $E("login_toptray").style.display = "none";
            }else{
                $E("logout_toptray").style.display = "none";
                $E("login_toptray").style.display = "";
            }
        }
    })();
    //
    
    var oEditor;
    if ((oEditor = $E('publish_editor')) && scope.$worldCupTopic) {
        oEditor.value = scope.$worldCupTopic;
        
        //如果未登录则发布框要弹出登录框
        if(scope.$uid !== scope.$oid || scope.$uid == ""){
            var oSubmit = $E('publisher_submit');
            if(oSubmit){
                var oNewSubmit = $C("A");
                //cloneNode在IE下会把事件也clone上，nnd！
                oNewSubmit.innerHTML = oSubmit.innerHTML;
                oSubmit.parentNode.replaceChild(oNewSubmit,oSubmit);
                oNewSubmit.onclick = function(){
                    return App.ModLogin(null);
                };
            }
        }else{
            _addEvent($E('publisher_submit'),function(){//发布后把主题再附加上
                setTimeout(function(){
                    oEditor.value = scope.$worldCupTopic;
                    
                },1500);
            },'click');
            
            scope.$publishCallback = function(json,params){
                //feed假写
                if(json.html && (json.html != "")){
                    if(Task._updateFeedListTimer){
                        clearInterval(Task._updateFeedListTimer);
                    }
                    
                    if(Task.marquee && Task.marquee.stop){
                        Task.marquee.stop();
                    }
                    
                    var feedList = $E('main_container');
                    var feedBox = document.createElement('ul');
        			feedBox.style.display = 'none';
        			document.body.appendChild(feedBox);
        			feedBox.innerHTML = json.html;
        			var newFeed = feedBox.getElementsByTagName('li')[0];
        			var tagetFeed = feedList.getElementsByTagName('li')[0];
        			feedList.insertBefore(newFeed, tagetFeed);
        			setTimeout(function(){
        			    Task.slideDown(feedList);
        			    
        			    if(Task.updateFeedList){
        			        Task.updateFeedList();
        			    }
        			},1000);
                }
            };
        }
    }
    //--------------------------------------------------------------------------
    var oLogin;
    if(oLogin = $E('login_submit_btn')){
        _addEvent(oLogin, function(){
            return App.ModLogin(null);
        },'click');
    }
    
    //daily专业榜轮播,页面每次显示不同feed----------------------------------------------------------------
    if($E('cont_col1_11_0')){
        /**
         * 轮流显示3个模块的不同内容 11:专业榜 12：雷人帮 13：红粉帮
         * */
        (function(){
            var num;
            if(num = Utils.Cookie.getCookie('_worldcup_')){
                var arr = num.split("_"),cookie = arr.concat(),num2;
                for(var i=0;i<4;i++){
                    num2 = (parseInt(arr[i]) + 1);
                    if($E('cont_col1_1' + (i + 1) + '_' + num2)){
                        $E('cont_col1_1' + (i + 1) + '_' + num2).style.display = "";
                        cookie[i] = num2;
                    }else{
                        if($E('cont_col1_1' + (i + 1) + '_0')){
                            $E('cont_col1_1' + (i + 1) + '_0').style.display = "";
                        }
                        cookie[i] = '0';
                    }
                }
                
                Utils.Cookie.setCookie('_worldcup_', cookie.join("_"), 1,'/','2010.t.sina.com.cn');
            }else{
                $E('cont_col1_11_0').style.display = "";
                $E('cont_col1_12_0').style.display = "";
                $E('cont_col1_13_0').style.display = "";
                if($E('cont_col1_14_0')){
                    $E('cont_col1_14_0').style.display = "";
                }
                Utils.Cookie.setCookie('_worldcup_', '0_0_0_0', 1,'/','2010.t.sina.com.cn');
            }
        })();
    }
    
    //解决跨域图片上传回调问题（前后台需要 配合）------------------------------------------------------------------
    var oForm;
    if(oForm = $E("publisher_image_form")){
        oForm.action = oForm.action.replace('cb=http://t.sina.com.cn/upimgback.html','cb=http://2010.t.sina.com.cn/upimgback.html');
    }
    //-----------------------------------------------------------------------------------------------------
    var oToggle
    if(oToggle = $E('toggle')){
        var oContainer = $E('toggle_container');
        _addEvent(oToggle, function(){
            if(oToggle.className === "on"){
                oContainer.className = "jh_raceTab1 jh_rT_Disnone";
                oToggle.className = "off";
                oToggle.title = $CLTMSG['CC4001'];//"展开"
            }else{
                oContainer.className = "jh_raceTab1";
                oToggle.className = "on";
                oToggle.title = $CLTMSG['CC4002'];//"收起";
            }
        },"click");
    }
    
    //切换tab---------------------------------------------------------------------------------------------------------
    function currentTab(id,map){
        for(var k in map){
            $E(k).className = "";
            map[k].style.display = "none";
        }
        $E(id).className = "cur";
        map[id].style.display = "";
    }
    (function(){
        if($E('team_title') && $E('leader_title')){
            var map = {
                'team_title':$E('team_info'),
                'leader_title':$E('leader_info')
            };
            for(var id in map){
                (function(id){
                    _addEvent($E(id),function(){
                        currentTab(id,map);
                    },'mouseover');
                })(id);
            }
        }
    })();
    
    (function(){
        if($E('star_title') && $E('coach_title')){
            var map = {
                'star_title':$E('star_info'),
                'coach_title':$E('coach_info')
            };
            for(var id in map){
                (function(id){
                    _addEvent($E(id),function(){
                        currentTab(id,map);
                    },'mouseover');
                })(id);
            }
        }
    })();
    
    //切换转发榜等tab页签
    (function(){
        if($E('tab_list') && $E('tab_content')){
            function showTab(tab,tabList){
                for(var i=0,len=tabList.length;i<len;i++){
                    if(tabList[i].className !== "line"){
                        tabList[i].className = "";
                    }
                }
                tab.className = "cur";
            }
            var tabList = [];
            Core.Array.each($E('tab_list').children,function(li){
                if(li.className !== "line"){
                   tabList.push(li); 
                }
            });
            
            var cache = {};
            Core.Array.each(tabList, function(li){
                _addEvent(li,function(e){
                    var cacheID = "tab_" + li.getAttribute('tab_type');
                    if(cache[cacheID]){
                        showTab(li,tabList);
                        $E('tab_content').innerHTML = cache[cacheID];
                    }else{
                        App.request('/zt/worldcup/aj_worldcupchat.php', {
                            type:li.getAttribute('tab_type')
                        }, function(json){
                            showTab(li,tabList);
                            $E('tab_content').innerHTML = json.html;
                            cache[cacheID] = json.html;
                        }, "GET");
                    }
                },'mouseover');
            });
        }
    })();
});

//------------------------------------------------------------------------------------------

$registJob("initSearch2", function(){
    Core.Events.addEvent($E('m_keyword'),App.focusblur,'blur');
    Core.Events.addEvent($E('m_keyword'),App.focusblur,'focus');
    
    App.search("m_keyword", "m_submit", "m_search", 30, $CLTMSG['CD0001']);
});
/**
 * @param {Object} options
 * maxlen 输入框的长度，默认为30
 * input  输入框
 * form   搜索框form
 */
App.search = function(input, subbtn, form, maxlen, txt, cindex){
    var maxlen = maxlen || 30;
    var textnode = $E(input);
    var subbtn = $E(subbtn);
    var form = $E(form);
    Utils.Sinput.limitMaxLen(textnode, maxlen);
    var auto = new App.autoSelect({
        input: textnode,
        id: textnode.id + "_tip_",
        subbtn: subbtn
    });
    var urls = {
        0: "http://t.sina.com.cn/k/",
        1: "http://t.sina.com.cn/search/user.php?search="
    };
    if (cindex !== undefined) {
        auto.curIndex = cindex;
    }
    function formget(event){
        var value = Core.String.trim(textnode.value);
        value = Core.String.leftB(value, maxlen);
        if(value == textnode.getAttribute('keywords')){
            return;
        }
        if (value && value != txt) {
            location.href = urls[auto.curIndex] + encodeURIComponent(encodeURIComponent(value));
        }
        else {
            textnode.focus();
        }
        Core.Events.stopEvent(event);
    }
    Core.Events.addEvent(subbtn, formget, "click");
    
    App.enterSubmit({
        parent: form,
        action: function(event){
            Core.Events.fireEvent(subbtn, "click");
        }
    });
};

Core.Events.fireEvent = function(oElement, sEvent){
    oElement = oElement || $E(oElement);
    if($IE) {  
        oElement.fireEvent('on' + sEvent);  
    }
    else{  
        var evt = document.createEvent('HTMLEvents');  
        evt.initEvent(sEvent,true,true);  
        oElement.dispatchEvent(evt);  
    }  
};

/**
 * @param{String}url
 * @param{Object}oParams
 * @param{Function}callback
 * @param{String}method
 * */
App._locked = false;
App.request = function(url, oParams, callback, method){
    if (!App._locked) {
        method = method || "GET";
        var config = {
            returnType: "json",
            onComplete: function(result){
                App._locked = false;
                if ((result && result.code)) {
                    if (result.code === "M00003") {
                        return App.ModLogin(null);
                    }
                    if (result.code === "MR0122") {
                        return App.alert($SYSMSG["MR0122"]);
                    }
                    if (result.code === "A00006") {
                        callback(result);
                    }
                    else {
                        App.alert($SYSMSG[result.code], {
                            icon: 2
                        });
                    }
                }
            },
            onException: function(msg){
                App._locked = false;
            }
        };
        config[method] = oParams;
        App._locked = false;
        Utils.Io.Ajax.request(url, config);
    }
};
        
/**
 * @param{Object}button
 * @param{String}container id
 * */
App.batchFollow = function(button,container){
    container = $E(container);
    var uids = [] , list = container.getElementsByTagName("input"),len = list.length;
    var binded = false;
    button.onclick = function(){
        for(var i=0;i < len;i++){
            if(list[i].checked != false){
                uids.push(list[i].value);
            }
        }
        App.request('/attention/aj_addfollow.php', {
            'uid': uids.join(","),
            'fromuid': scope.$uid
        }, function(json){
            App.alert($SYSMSG[json.code],{icon:3});
        }, "POST");
    };
    Core.Events.fireEvent(button,'click');
};

/**
 * @param{Object}checkbox
 * @param{String}container id
 * */
App.selectAll = function(checkbox,container){
    container = $E(container);
    var list = container.getElementsByTagName("input");
    Core.Array.each(list, function(item){
        (function(item){
            item.onclick = function(){
                checkbox.checked = item.checked?true:false;
            };
        })(item);
    });
    
    checkbox.onclick = function(){
        for(var i=0,len=list.length;i<len;i++){
            list[i].checked = checkbox.checked;
        }
    };
    Core.Events.fireEvent(checkbox,'click');
};
