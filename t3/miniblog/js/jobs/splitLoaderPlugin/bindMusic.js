/**
 * @author liusong@staff.sina.com.cn
 */
//$import("diy/swfobject.js");
//$import("diy/CustomEvent.js");
//$import("sina/core/string/leftB.js");
//$import("sina/core/string/byteLength.js");

$import("jobs/splitLoaderPlugin/bindApplication.js");

App.bindMusic = function(_dom, _key, _value){
	App.bindApplication(_dom, _key, _value);
};

//(function(){
//	var current = {}, ind = 0;
//	/**
//	 * 插入播放器
//	 * @param {Object} pid
//	 * @param {Object} key
//	 * @param {Object} data
//	 */
//	function initPlayer(pid, key, data, isMblog){
//		var flashParams = {
//        	quality: "high",
//        	"allowScriptAccess": "always",
//        	"wmode": "transparent"
//   		},
//		flashVars = {
//			"singer"   : encodeURIComponent(data["title"]),
//			"song"     : encodeURIComponent(data["author"]),
//			"songurl"  : encodeURIComponent(data["url"]),
//			"logo"     : encodeURIComponent(data["logo"]),
//			"source"   : encodeURIComponent(data["cname"]),
//			"slink"    : key,
//			"autoPlay" : !isMblog
//	    }
//		swfobject.embedSWF([$CONFIG.$BASESTATIC,"miniblog/static/swf/player/simplePlayer.swf",Boot.getJsVersion()].join(""), pid, "440", "55", "10.0.0", null, flashVars, flashParams);
//	}
//	/**
//	 * 切换播放器
//	 * @param {Object} dom
//	 * @param {Object} pid
//	 * @param {Object} key
//	 * @param {Object} mid
//	 * @param {Object} data
//	 */
//	function toggle(dom, pid, key, data, isMblog){
//		var cid, currentPlayer;
//		if( (cid = current.pid) && cid == pid){
//			//同一feed内有多个音乐时，如果key与当前播放key相同则不再进行初始化
//			if(current.key == key){return}
//			current = {"panel":dom, "pid":pid, "key":key};
//			initPlayer(pid, key, data, isMblog);
//			return
//		}
//		if(cid){
//			var currentPlayer = $E(cid);
//			currentPlayer.parentNode.replaceChild(current.panel,currentPlayer);
//			current.panel.style.cssText = "";
//		}
//		current = {"panel":dom, "pid":pid, "key":key};
//		initPlayer(pid, key, data, isMblog);
//	}
//	/**
//	 * 绑定播放器
//	 * @param {Object} _dom
//	 * @param {Object} _key
//	 * @param {Object} _value
//	 */
//	App.bindMusic = function(_dom, _key, _value){
//		var p = _dom.parentNode,
//			prevHidden = false,
//			binded = p.getAttribute("hasMPlayer"),
//			type = p.getAttribute("type"),
//			mtype = p.getAttribute("mtype"),
//			mid = p.getAttribute("mid"),
//			prev = $E("prev_" + mid),
//			disp = $E("disp_" + mid), 
//			pid = "player_" + mid,
//			wrap = $C("div"),
//			snap = $C("div"),
//			isMblog = $CONFIG.$pageid == "mblog" && !prev && Boolean(disp),
//			sct = ["line-height:55px;height:55px;clear:both;",isMblog?"padding-top:10px":""].join(""),
//			hct = [$IE? "position:absolute;": "line-height:0px;height:0px;","visibility:hidden;",isMblog?"padding-top:10px":""].join(""),
//			clear = $C("div"),
//			panel,
//			position,
//			bind;
//		if (type == "3") {return}
//		clear.className = "clear";
//		snap.id = pid;
//		snap.className = "playerBox_on";
//		snap.title = _value.title;
//		snap.appendChild(document.createTextNode([Core.String.leftB(_value.title,12),Core.String.byteLength(_value.title)>12?"...":""].join("")));
//		//绑定播放器切换
//		bind = function(dom){
//			//唉为了IE
//			panel = snap.cloneNode(true);
//			panel.onmouseover = (function(p){return function(){p.className = "playerBox_off"}})(panel);
//			panel.onmouseout = (function(p){return function(){p.className = "playerBox_on"}})(panel);
//			Core.Events.addEvent(dom||panel, function(){
//				if(prevHidden){return}
//				bind();
//				wrap.style.cssText = sct;
//				toggle(panel, pid, _key, _value, isMblog)
//			},"click");
//		};
//		//如果该条feed还没有绑定音乐则初始化一个播放按钮
//		if (!binded) {
//			p.setAttribute("hasMPlayer",1);
//			wrap.style.cssText = sct;
//			if (isMblog) {
//				disp.parentNode.appendChild(wrap, disp.nextSibling);
//			}else{
//				prev.appendChild(clear);
//				prev.parentNode.insertBefore(wrap, prev.nextSibling);
//			}
//			bind();
//			wrap.appendChild(panel);
//			Core.Events.fireEvent(panel,"click");
//		}
//		//屏蔽连接有效性
//		_dom.onclick = function(){
//			return false;
//		}
//		bind(_dom);
//		//监听预览区隐藏事件，如果该预览区中的音乐正在播放则将其停止
//		App.CustomEvent.add("preview", "hidden", function(_mid){
//			if(_mid!=mid){return}
//			var p = swfobject.getObjectById(pid);
//			if(p && pid == current.pid){
//				try{
//					p.IPause();
//					position = p.IPosition();
//					p.style.visibility = "hidden";
//					prevHidden = true;
//				}catch(e){}
//			}
//			wrap.style.cssText = hct;
//		});
//		//监听预览区显示事件，如果该预览区中的音乐是由隐藏导至停止则在显示时让音乐继续播放
//		App.CustomEvent.add("preview", "show", function(_mid){
//			if(_mid!=mid){return}
//			var p = swfobject.getObjectById(pid);
//			if(p && pid == current.pid){
//				try{
//					p.style.visibility = "visible";
//					p.IPause();
//					p.IPlay(position||0);
//					prevHidden = false;
//				}catch(e){}
//			}
//			wrap.style.cssText = sct;
//		});
//	}
//})();
