/**
 * 专题页功能
 * @author liusong@staff.sina.com.cn
 */
$import("sina/core/dom/getElementsByClass.js")
$import("jobs/widget/widget_method.js");
$import("jobs/widget/widget_pulish.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/previous.js");
$import("sina/core/dom/contains.js");

$registJob("topic_widget_fatter",function(){
	//初始化配置
	var cfg = {
		wrapper        : $E("widget_wrapper"),
		feedList       : $E("widget_feed_list"),
		rightWapper    : $E("widget_right_wrapper"),
		rightList      : $E("widget_right_list"),
		publishWrapper : $E("widget_publish_wrapper"),
		moreWrapper    : $E("widget_feed_more"),
		sanpH          : 196,
		feedH      : 0
	};
	//初始化地址参数
	var param = App.urlParam()||{};
	var topic = param.tags||"";
	//初始化widget外层宽度
	if (scope.$pageid === "widget_topic_newwidth") {
		if (param.width) {
			param.width = param.width > 620 ? param.width : 620;
		}
		else {
			param.width = 620;
		}
	}
	if((param.width = param.width||950) && cfg.wrapper){
		cfg.wrapper.style.width = param.width + "px";
		document.body.style.overflow = "hidden";
		if (scope.$pageid === "widget_topic_newwidth") {
			cfg.feedList.style.width = param.width - 20 + "px";
			$E("left_cont").style.width = param.width - 20 + "px";
		}
	}
	//初始化widget外层高度
	if (scope.$pageid === "widget_topic_newwidth") {
		if (param.height) {
			param.height = param.height > 620 ? param.width : 620;
		}
		else {
			param.height = 620;
		}
	}
	if((param.height = param.height||600) && cfg.wrapper){
		cfg.wrapper.style.height = param.height + "px";
		cfg.wrapper.style.overflow = "hidden";
		cfg.wrapper.style.position = "relative";
	}
	
	//初始化widget右边栏容器
	if((param.rightwidth = Math.max(Math.min(param.rightwidth||250,340),150)) && cfg.rightWapper){
		cfg.rightWapper.style.width = param.rightwidth + "px";
	}
	
	//初始化feed区外高度
	if(scope.$uid && scope.$uid != ""){   //已经登录的
		if(cfg.publishWrapper && cfg.moreWrapper){
			cfg.snapH = cfg.publishWrapper.offsetHeight + cfg.moreWrapper.offsetHeight;
		}
	}else{  //未登录的
		if(cfg.publishWrapper && cfg.moreWrapper){ //未登录但有发布器，同时发布器被隐藏
			cfg.snapH = cfg.publishWrapper.offsetHeight + cfg.moreWrapper.offsetHeight;
		}
		else if($E("div_top")){
			cfg.snapH = $E("div_top").offsetHeight + cfg.moreWrapper.offsetHeight;
		}
	}
	
	//初始化feed列表容器高度
	if(cfg.feedList && (cfg.feedH = param.height - cfg.snapH - 46)){
		cfg.feedList.style.height = cfg.feedH + "px";
	}
	//初始化feed列表
	if(cfg.feedList && cfg.feedH){
		var li = Core.Dom.getElementsByClass(cfg.feedList,"div","line");
		var len = li.length;
		var countH = 0;
		var loopList = [];
		!len && (function(){
			var div,panel;
			panel = Core.Dom.getElementsByClass(cfg.feedList,"div","MIB_feed");
			panel = panel[0]||null;
			div = document.createElement("div");
			if(panel){
				with(div.style){
					width = "0px";
					height = "0px";		
				}
				panel.appendChild(div);
				li[0] = div;
				len = 1;
			}
		})();
		if(len){
			var last = {};
			for(var i=--len;i>=0;i--){
				li[i].style.visibility = "visible";
				li[i].style.display = "";
				var h = li[i].offsetHeight;
				if((countH = countH + h)<cfg.feedH){
					li[i].style.display = "";
					last.wrap = li[i];
				}else{
					li[i].style.display = "none";
					loopList.push(li[i]);
				}
			}
			var loop = (function(loopList){
				var clock,_={};
				_.list = loopList;
				_.last = last;
				_.stop = function(){
					clearTimeout(clock);
				}
				_.start = function(){
					_.stop();
					if (loopList.length) {
						_.last = App.wipeDown(_.list.shift(), function(){
							clock = setTimeout(loop.start, 3000);
						});
					}
				};
				return _;
			})(loopList);
			var startLoop = function(){
				Core.Events.removeEvent(document.body,startLoop,"mouseover");
				var loopLock;
				var outLoop = function(event){
					var target = event.relatedTarget || event.fromElement;
					if (target && cfg.feedList!=target && !Core.Dom.contains(cfg.feedList, target)) {
						clearTimeout(loopLock);
						loopLock = setTimeout(loop.start, 1500);
						Core.Events.removeEvent(document.body,outLoop,"mouseover");
					}
				}
				Core.Events.addEvent(cfg.feedList,function(event){
					var target = event.relatedTarget || event.fromElement;
					if(target && target!=cfg.feedList && !Core.Dom.contains(cfg.feedList,target)){
						clearTimeout(loopLock);
						loop.stop();
						Core.Events.stopEvent();
						Core.Events.addEvent(document.body,outLoop,"mouseover");
					}
				},"mouseover");
//				Core.Events.addEvent(cfg.feedList,(function(){
//					var timer;
//					var speed;
//					var flus = function(){
//						if (speed > 0){
//			                speed -= speed/20;
//			            }else if (speed < 0){
//			                speed += -speed/20;
//			            }
//						cfg.feedList.scrollTop -= speed;
//						if(Math.abs(speed*10)==0){
//							clearInterval(timer);
//							timer==null;
//						}
//					}
//					return function(event){
//						alert(1);
//						speed = 50*($IE?event.wheelDelta/40:event.deltail)/10;
//						if(timer == null){
//							timer = setInterval(flus,20);		
//						}
//						Core.Events.stopEvent();
//					};
//				})(),$MOZ?"DOMMouseScroll":"mousewheel");
				loop.start();
			};
			Core.Events.addEvent(document.body,startLoop,"mouseover")
		}
	}
	
	var publish;
	var enabled = function(b){
		if(b){
			publish.submit.className = "release";
		}else{
			publish.submit.className = "release unable";
		}
	};
	var success = App.sss = function(json,oParam){
		if(json.code=="A00006" && json.data && json.data.html){
			var html = json.data.html;
			var currentItem = loop.last.wrap;
			if (currentItem) {
				loop.stop();
				Core.Dom.insertHTML(currentItem, html, "beforebegin");
				var target = Core.Dom.previous(currentItem, "line");
				if (target) {
					loop.list.unshift(target);
				}
				loop.start();
				publish.onClear();
			}
			
		}
	};
	var error = function(json,oParam){
		
	};
	var limit = function(len){
		var h = "还可以输入";
		var c = 140 - len;
		if(c<0){
			h = "已超出";
			c = Math.abs(c);
		}
		publish.limit.innerHTML = [h,"<span class=\"pipsLim\">",c,"</span>字"].join("");
	};
	
	publish = App.widgetPublish({
		"textarea"   : "publish_textarea",
		"submit"     : "publish_submit",
		"limit"      : "publish_limit",
		"id"         : "publish",
		"topic"      : topic,
		"onError"    : error,
		"onLimit"    : limit,
		"success"    : success,
		"enabled"    : enabled
	});
	
	publish.onClear();
	
});