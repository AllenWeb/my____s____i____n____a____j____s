/**
 * @fileoverview 快乐男生专题
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/core/array/each.js");
$import("diy/dialog.js");
$import("diy/marquee2.js");
$import("sina/core/dom/insertHTML.js");

$registJob("happy_boy", function(){
    var _addEvent = Core.Events.addEvent;
    App.followadd = function(uid, el, name){
        var url = "/attention/aj_addfollow.php";
        function cb(json){
            el.innerHTML = '<span class="add_yet"></span>' + $CLTMSG['CX0025'];
            el.className = "concernBtn_Yet";
        }
        App.followOperation({
            uid: uid,
            fromuid: scope.$uid
        }, url, cb);
    };
    
    //如果未登录则发布框要弹出登录框
    if(scope.$uid !== scope.$oid || scope.$uid == ""){
        var oSubmit = $E('publisher_submit');
        if(oSubmit){
            var oNewSubmit = $C("A");
            oNewSubmit.innerHTML = oSubmit.innerHTML;
            oSubmit.parentNode.replaceChild(oNewSubmit,oSubmit);
            oNewSubmit.onclick = function(){
                return App.ModLogin(null);
            };
        }
    }
    
    //自定义提交地址
    App.miniblogPublisher.url = "http://t.sina.com.cn/mblog/publish_kn.php";
    
    function updateSlide(json,marqueeBoxID){
        if(Task.marquee[marqueeBoxID].moveEnded){
            Task.marquee[marqueeBoxID].stop();
            
            var feedList = $E(marqueeBoxID);
            var feedBox = document.createElement('ul');
			feedBox.style.display = 'none';
			document.body.appendChild(feedBox);
			feedBox.innerHTML = json.html;
			var newFeed = feedBox.getElementsByTagName('li')[0];
			var tagetFeed = feedList.getElementsByTagName('li')[0];
			newFeed.style.display = "none";
			feedList.insertBefore(newFeed, tagetFeed);
			App.rollOut(newFeed,function(){
                Task.slideDown(marqueeBoxID);
			});
        }else{
            Task.marquee[marqueeBoxID].onEnd = function(){
                updateSlide(json,marqueeBoxID);
                delete Task.marquee[marqueeBoxID].onEnd;
            };
        }
    }
    //feed假写
    scope.$publishCallback = function(json,params){
        var marqueeBoxID = "feed_list_2";
        if(json.html && (json.html != "")){
            updateSlide(json,marqueeBoxID);
        }
    };
    
    //图片上传，调整预览位置
    scope.$afterImgUploaded = function(elements){
        elements['preBox'].style.left = '70px';
    };
    
    var Task = {
        timer:{},
        marquee:{},
        cache:{},
        request:function(url, oParams, callback, method){
            var method = method || "GET";
            var config = {
                returnType: "json",
                onComplete: function(result){
                    if ((result && result.code)) {
                        if (result.code === "M00003") {
                            return App.ModLogin(null);
                        }
                        if (result.code === "A00006") {
                            callback(result);
                        }else {
                            App.alert($SYSMSG[result.code], {
                                icon: 2
                            });
                        }
                    }
                },
                onException: function(msg){
                    
                }
            };
            config[method] = oParams;
            Utils.Io.Ajax.request(url, config);
        },
        checkLogin:function(){
            var oLogin;
            if(oLogin = $E('login_submit_btn')){
                _addEvent(oLogin, function(){
                    return App.ModLogin(null);
                },'click');
            }
        },
        showRelation:function(){
            this.request("http://t.sina.com.cn/public/get_attrelation.php", {
                'uids':scope.happy_boy_uid
            }, function(json){
                $E('happy_att').innerHTML = json.data[scope.happy_boy_uid];
            }, "GET")
        },
        update:function(marqueeBoxID){
            Task.marquee[marqueeBoxID].stop();
            
            var marqueeBox = $E(marqueeBoxID);
            var tag = marqueeBox.tagName.toUpperCase() === "DL"?'dd':'li';
            var list = marqueeBox.getElementsByTagName(tag),mids=[];
            for (var i = 0, len = list.length; i < len; i++) {
                mids.push(list[i].getAttribute('mid'));
            }
            this.request("http://t.sina.com.cn/huodong/2010kn/aj_get_newfeeds", {
                'type':marqueeBoxID === "feed_content_1" ? '1':'2' ,//type:  接口类型，1代表12强最新微薄，2代表快男最新话题
                'mids':mids.join(",")//mids:feed列表mid，格式，mid1,mid2,mid3...
            }, function(json){
                Task._updateSlide(marqueeBox,json,marqueeBoxID);
            }, "POST");
        },
        _updateSlide:function(marqueeBox,json,marqueeBoxID){
            if(json && json != ""){
                var feedBox = $E("temp_" + marqueeBoxID) || document.createElement(marqueeBox.tagName);
                feedBox.id = "temp_" + marqueeBoxID;
    			feedBox.style.display = 'none';
    			feedBox.innerHTML = json.html;
    			document.body.appendChild(feedBox);
    			try{
    			    //先清除一段老数据，再追加新内容
        			var len = feedBox.children.length;
        			while(len > 0){
        			    marqueeBox.removeChild(marqueeBox.children[marqueeBox.children.length-1]);
        			    len--;
        			}
        			Core.Dom.insertHTML(marqueeBox,json.html,"beforeend");
    			}catch(e){
    			    
    			}
            }
		    
			Task.slideDown(marqueeBoxID);
        },
        slideDown: function(marqueeBoxID){
            var marqueeBox = $E(marqueeBoxID);
            var tag = marqueeBox.tagName.toUpperCase() === "DL"?'dd':'li';
            var list = marqueeBox.getElementsByTagName(tag);
            var items = [];
            for (var i = 0, len = list.length; i < len; i++) {
                items.push(list[i]);
            }
            try{
                var marquee = this.marquee[marqueeBoxID] = new App.marquee2(marqueeBox, items, {
                    forward: "down",
                    speed: 5
                });
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.pause();
                }, 'mouseover');
                Core.Events.addEvent(marqueeBox, function(){
                    marquee.restart();
                }, 'mouseout');
                marquee.start();
                
                //一个滚动循环完毕再请求新数据
                marquee.afterLoop = function(){
                    Task.update(marqueeBoxID);
                };
            }catch(e){
                
            }
        },
        run:function(){
            this.checkLogin();
            this.showRelation();
            
            this.slideDown("feed_content_1");
            this.slideDown("feed_list_2");
        }
    };
    
    Task.run();
});