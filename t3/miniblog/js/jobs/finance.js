/**
 * @fileoverview 财经微博
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("diy/dialog.js");
$import("sina/core/dom/trimNode.js");

//start 跨域登录------------------------------------------------------------------
scope.redirect = "/";
window.sinaSSOConfig.feedBackUrl= "http://finance.t.sina.com.cn/ajaxlogin.php";
//need server　rewrite
//end 跨域登录--------------------------------------------------------------------

$registJob("finance",function(){
    var _addEvent = Core.Events.addEvent , _trimNode = Core.Dom.trimNode , cache = {};
    var hash = {
        'module_recommend_1':"http://t.sina.com.cn/pub/i/finance_star",
        'module_recommend_2':"http://t.sina.com.cn/pub/i/finance_star#a_zqtz",
        'module_recommend_3':"http://t.sina.com.cn/pub/i/finance_star#a_sjmr",
        'module_recommend_4':"http://t.sina.com.cn/pub/i/finance_star#a_jjxr",
        'module_recommend_5':"http://t.sina.com.cn/pub/i/finance_star#a_mt",
        'module_recommend_6':"http://t.sina.com.cn/pub/i/finance_star#a_qyjg"
    };
    var Task = {
        /**
         * 处理tab点击事件(新鲜人 转发榜等应答结果有缓存，推荐模块不缓存－－每次均替换新内容)
         * @param{String}ulID
         * @param{String}containerID
         * @param{String}url
         * @param{Function}callback
         * */
        handleTabClick:function(ulID,containerID,url,callback){
            var nodes = _trimNode($E(ulID)).childNodes,me = this;
            for(var i = 0 , len = nodes.length;i < len;i++){
                (function(i){
                    _addEvent(nodes[i],function(){
                        if(nodes[i].id && hash[nodes[i].id] && $E("more")){
                            $E("more").href = hash[nodes[i].id];//切换tab时改变“更多”链接
                        }
                        if(nodes[i].className === "cur"){
                            return;
                        }
                        if(cache[nodes[i].id] && containerID){
                            $E(containerID).innerHTML = cache[nodes[i].id];
                            $E(containerID).removeAttribute("cacheid");//key!必须清除视频加载缓存
                            App.bindMedia($E(containerID));//音视频
                            return me.current(nodes,nodes[i]);
                        }
                        
                        if(nodes[i].id && nodes[i].id.match(/\d/)[0]){
                            me.getTabContent(url,nodes[i].id.match(/\d/)[0],function(result){
                                if(callback){
                                    callback(result);
                                }else{
                                    //显示并缓存应答内容
                                    cache[nodes[i].id] = $E(containerID).innerHTML = result.html;
                                    App.bindMedia($E(containerID));//音视频
                                }
                                me.current(nodes,nodes[i]);
                            });
                        }
                    },"click");
                })(i);
            }
            
            return this;
        },
        /**
         * 动态获取tab页的数据
         * @param{String}url
         * @param{String}module
         * @param{Function}callback
         * */
        getTabContent:function(url,module,callback){
            Utils.Io.Ajax.request(url,{
                GET:{
                   'module':module 
                },
                returnType:"json",
                onComplete : function(result){
                    if((result && result.code)){
                        if(result.code === "A00006"){
                            callback(result);
                        }else{
                            App.alert($SYSMSG[result.code],{icon:2});
                        }
                    }else{
                        App.alert($CLTMSG['CD0092']);
                    }
                },
                onException   :function(msg) {
                    App.alert(msg);
                }
            });
        },
        /**
         * 设置当前tab样式
         * @param{HTMLElement NodeList}nodeList
         * @param{HTMLElement}node
         * */
        current:function(nodeList,node){
            for(var i = 0 , len = nodeList.length;i < len;i++){
                if(nodeList[i].className !== "more"){
                    nodeList[i].className = "";
                }
            }
            node.className = "cur";
        },
        search:function(){
            var oInput = $E("keyword_input");
            scope.doSearch = function doSearch(){
                var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
                if (value){
                    if($E("radio2").checked){
                        location.href = "http://t.sina.com.cn/search/user.php?search=" + encodeURIComponent(encodeURIComponent(value));
                    }else{
                        location.href = "http://t.sina.com.cn/k/" + encodeURIComponent(encodeURIComponent(value));
                    }
                }else{
                    oInput.focus();
                }
            }
            Core.Events.addEvent(oInput,function(e){
                if(e.keyCode == 13){
                    scope.doSearch();
                }
            },'keydown');
        },
        /**
         * 滚筒效果
         * */
        pully:function(){
            var shell = $E("pully_list");
            var box = shell.parentNode;
            box.style.width = 195*3 + "px";
            var items = shell.getElementsByTagName('LI');
            App.pulley($E('turn_left'), $E('turn_right'),box,items,shell,3,195);
        },
        /**
         * 启动本页任务
         * */
        run:function(){
            this.search();
            this.pully();
            
            var me = this;
            this.handleTabClick("news_list","news_container","/zt/aj_news.php")//新鲜人、新鲜事
            .handleTabClick("top_list","topic_container","/zt/aj_top_topic.php")//转发榜、评论榜
            .handleTabClick("recommend_list","recommend_container","/zt/aj_recommend_user.php",function(result){
                if(result.html){//推荐用户
                    $E("recommend_container").innerHTML = result.html;
                    App.clearPulley();//key! 清除定时器
                    me.pully();
                }
            });
        }
    };
    Task.run();
    
    //重载fixPostion，调整登录错误提示的定位--------------------------------------------------
    App.fixElement.fixPostion = function(obj){      
        var offsetX = obj.offsetX||0;
        var offsetY = obj.offsetY||0;
        var ref     = $E(obj.ref);
        var target  = this.element;     
        var aPos    = Core.Dom.getXY(ref);  
        target.style.position = "absolute";     
        target.style.left  = (aPos[0] + offsetX) + "px";
        target.style.top   = (aPos[1] + offsetY - target.offsetHeight) + "px"; 
        target.style.zIndex = obj.zIndex || 10;
        setTimeout(function(){
            if($E("mod_login_content").style.display === "none"){
                target.style.top   = (aPos[1] + offsetY - target.offsetHeight) + "px"; 
            }else{
                target.style.top = aPos[1] + 21 + "px";;
            }
        },0);
        return target; 
    };
});