/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * 用于动态给页面添加“返回顶部”按钮
 */
$import("sina/sina.js");
$import("diy/dom.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("diy/scrollTo.js");
(function(){
	Boot.addDOMLoadEvent(function(){
		var goTop = $C("a");
		var bgColor = scope.goTopBg || "";
		var _html = '<span class="goTopbg '+bgColor+'"></span>\
					<span class="goTopcon">\
						<em class="toparr">&lt;</em><span>' + $CLTMSG['CD0183'] + '</span>\
					</span>';
		goTop.harf = "return false;";
		goTop.className = "goTop";
		goTop.innerHTML = _html;
		Core.Events.addEvent(goTop, function(){
			App.scrollTo(Core.System.getScrollPos(document)[0], 0);
		}, "click");
		//默认为隐藏状态
		Core.Dom.setStyle(goTop, "visibility", "hidden");
		document.body.appendChild(goTop);
		
		var _gSTop = function(){
			return Core.System.getScrollPos(document)[0];
		}
		var _gSH = function(){
			return App.Dom.getScreen().h;
		}
		
		var _gSW = function(){
			return App.Dom.getScreen().w;
		}
		//解决在IE6下更改窗口大小时，goTop按钮不能自动调整布局
		$IE6 && Core.Events.addEvent(window, function(){
			//如果此时goTop按钮为不隐藏状态，才对其布局进行重新设置
			if(Core.Dom.getStyle(goTop, "visibility") !== "hidden"){
				Core.Dom.setStyle(goTop, "top", _gSTop() + _gSH() - 80 + "px");
			}
			Core.Dom.setStyle(goTop, "display", (_gSW() <= 800)?"none":"");
		}, "resize");
		
		Core.Events.addEvent(window, (function(){
			var timer = "";
			return function(){
				timer && clearTimeout(timer);
				if(_gSTop() > 0){
					if ($IE6) {
						Core.Dom.setStyle(goTop, "visibility", "hidden");
						timer = setTimeout(function(){
							Core.Dom.setStyle(goTop, "top", _gSTop() + _gSH() - 80 + "px");
							Core.Dom.setStyle(goTop, "visibility", "visible");
						}, 500);
					}
					else {
						Core.Dom.setStyle(goTop, "position", "fixed");
						Core.Dom.setStyle(goTop, "bottom", "30px");
						Core.Dom.setStyle(goTop, "visibility", "visible");
					}
				}
				else{
					Core.Dom.setStyle(goTop, "visibility", "hidden");
				}
			}
		})(),"scroll");
	})
})()
