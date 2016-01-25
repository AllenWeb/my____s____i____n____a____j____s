/**
 * 弹出动画播放层
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/swfobject.js");
$import("diy/iframeMask.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/pageSize.js");

App.PopUpSwfPlayer = (function(){
	var popUp, panel, view, clock, ce = Core.Events, add = ce.addEvent, unadd = ce.removeEvent;
	return function(url){
		var id = "view_ani", w = window, d = document, dd = d.documentElement||{}, b = d.body;
		//魔法表情播放统计
		if(scope.statistics){
			scope.statistics({"type":"ani","source":encodeURIComponent(url)});
		}
		//如果用户的flash播放器不达标，则进行提示
		if(!swfobject.hasFlashPlayerVersion("9.0.0")){
			App.alert({"code":"CD0084"});
			return
		}
		//创建包装容器
		if(!panel){
			document.body.appendChild(panel = $C("div"));
			panel.style.position = "absolute";
			panel.style.zIndex = "2012";
		}
		panel.style.display = "";
		//创建动画容器
		if(!view){
			panel.innerHTML = "";
			panel.appendChild(view = $C("div"));
			view.id = id;
			view.innerHTML = ['<div style="padding-left:202px;padding-top:172px;"><center><img src="',[scope.$BASECSS,'style/images/common/loading.gif'].join(""),'"/></center></div>'].join("")
		}
		//重置包装容器位置
		var justify = function(size){
			var top = w.pageYOffset||Math.max(dd.scrollTop, b.scrollTop);
			panel.style.left = (size[2] - 440)/2 + "px";
			panel.style.top  = ((size[3] - 360)/2 + top) + "px";
		}
		//如果没有遮挡容器则进行创建
		if(!popUp){
			popUp = App.iframeMask(2000,justify);
		}
		//如果已有遮挡容器则重置屏幕位置
		else{
			justify(Core.System.pageSize());
		}
		//初始化动画参数，如果不想第三方随意弹广告请严格按此参数进行设置
		var flashParams = {
			id : "view_ani",
            quality: "high",
            allowScriptAccess: "never",
            wmode: "transparent",
            allowFullscreen: true,
			allownetworking:"internal"
        };
		//有没有都可以
        var flashVars = {
            playMovie: "true"
        };
		var clear = function(e){
			//如果用户按esc退出播放
			if(e && e.keyCode!==27 && e.type!=="mouseup"){return}
			//清除所有时钟
			clearInterval(clock);
			//移除动画
			swfobject.removeSWF(id);
			//gc动画容器
			panel.style.display = "none";
			view = null;
			//隐藏遮挡层
			popUp.hidden();
			//事件gc
			unadd(b, clear, "keyup");
			unadd(b, clear, "mouseup");
			if(!e){return}
			Core.Events.stopEvent()
		};
        //向view容器插入动画
		swfobject.embedSWF(url, id, "440", "360", "10.0.0", null, flashVars, flashParams);
		//显示iframe遮挡
		popUp.show();
		//清除历史时钟
		w.clearInterval(clock)
		//注册一个新时钟用于监测动画是否可用
		clock = setInterval(function(){
			var swf = swfobject.getObjectById(id), snap = 0;
			//监测动画加载百分比
			if(swf && swf.PercentLoaded()==100){
				//清除监测可用时钟
				w.clearInterval(clock);
				//注册播放进度时钟
				clock = setInterval(function(){
					//currentframe为当前动画贞
					var c = swf.CurrentFrame(), t;
					//对ie及其它浏览器区分获取总动画贞
					try {t = swf.TotalFrames()}catch(e){t = swf.TotalFrames}
					//如果c等于-1则说明还没准备好
					if( c<0 ){return}
					//如果当前贞小于总贞并且缓存的贞数不大于当前贞则重置缓存贞
					//由于时钟不可能过于频繁的监测所以需要一个缓存值来比对动画是否又循环播放了
					if( c<t && snap<=c ){
						snap = c;
					}
					//如果动画重新播放了或已经播放完成，则终止动画播放并且清除容器以便下一动画播放不会出现问题
					//这里不使用StopPlay()、GoToFrame()、Rewin()对动画进行控制这些指令需要动画配合domain，无法要求所有动画加入该设置
					else{
						clear();
					}
				},80);
			}
		},100);
		
		//监听用户点击esc
		add(b, clear, "keyup");
		//点击任意位置取消显示
		add(popUp.oMask, clear, "mouseup");
		popUp.oMask.title = $CLTMSG["CF0105"];
	}
})();
