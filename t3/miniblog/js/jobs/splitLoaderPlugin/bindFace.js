/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/PopUpSwfPlayer.js");
$import("sina/core/string/encodeHTML.js");
(function(ns){
	ns.bindFace = function(dom, key, value){
		dom.href = "####";
		dom.target = "";
		//变量声名
		var encodeTitle = function(value){
			return value.replace(/[^\w\u4e00-\u9fa5\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u2014\uff3f]/g,"");
		}
		var id, face, html, prev, disp, isBinded, flag, type;
		//事件绑定
		Core.Events.addEvent(dom, function(){
			setTimeout((function(v, f){
				return function(){
					App.PopUpSwfPlayer(v.flash);
				}
			})(value), 100);
			return false;
		}, "click");
		//初始化
		id = dom.parentNode.getAttribute("mid");
		html = '<div class="feed_img"><a class="magicpic_link" href="####" title="' + encodeTitle(value.title) + '" onclick="App.PopUpSwfPlayer(\'' + value.flash + '\');return false;"><img src="' + value.screen + '"></a><a href="####" class="playmp" title="' + $CLTMSG['CL0912'] + '" onclick="App.PopUpSwfPlayer(\'' + value.flash + '\');return false;"></a></div>';
		prev = $E("prev_" + id);
		disp = $E('disp_' + id);
		if(!/1|2/.test(type = dom.parentNode.getAttribute('type'))){return}
		if (scope.$pageid === 'mblog' && type == "1") {
			prev = disp;
			prev.style.display = "";
		}
		if(!prev){return}
		//初始化预览
		if (prev.getAttribute('mbind') != '1') {
			prev.setAttribute('mbind', '1');
			var imgs = Core.Dom.getElementsByClass(prev, 'div', 'feed_img'), type = "beforebegin";
			imgs.length && (flag = imgs[0]) && (type = "afterEnd");
			!flag && (flag = (flag = Core.Dom.getElementsByClass(prev, 'div', 'clear')) && flag[0]);
			if (flag) {
				Core.Dom.insertHTML(flag, html, type);
			}
			else {
				prev.innerHTML = html;
			}
		}
	};
})(App);