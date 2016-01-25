/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getXY.js");
$import("jobs/map/templete.js");
$import("diy/scrollTo.js");

(function(){
	
	var w = window, d = document, de = document.documentElement||{}, uni, popUpWindow, popUpWindowHtml=App.mapTemplete.popMapPanel, addEvent = Core.Events.addEvent, stopEvent = Core.Events.stopEvent;
	
	//国际化编码初始化
	conf = {
		'CL0824': $CLTMSG['CL0824'],
		'CL0825': $CLTMSG['CL0825'],
		'CL0826': $CLTMSG['CL0826'],
		'CX0145': $CLTMSG['CL0701'],
		'SRC'   : ""
	};
	
	popUpWindow = (function(){
		var it = {},_c;
		it.root = null;
		it.init = function(){
			if( it.root){return it.root}
				it.root = $C("div");
				it.root.style.position = "absolute";
				it.root.style.visibility = "hidden";
				it.root.style.zIndex = "2000";
				document.body.appendChild(it.root);
				addEvent(document.body, function(){
					it.hidden();
				},"mousedown");
				addEvent(window, function(){
					it.hidden();
				},"resize");
			return it.panel;
		};
		it.content = function(content){
			if(!it.root){it.init()}
			if(content && content!=_c){_c = it.root.innerHTML = content}
		};
		it.show = function(content){
			setTimeout(function(){
				it.root.style.visibility = "visible"
			},10);
		};
		it.hidden = function(){
			it.root.style.visibility = "hidden";
		};
		it.position = function(x, y){
			it.root.style.left = x + "px";
			it.root.style.top = y + "px";
			//it.show();
		};
		return it;
	})();
	
	/**
	 * 
	 * @param {Object} longitude 必选参数,经度
	 * @param {Object} latitude  必选参数,纬度
	 * @param {Object} head过    必选参数,头像
	 * @param {Object} internal  必选参数,国内/国外 true/false
	 * @param {Object} address   非必选参数,地址
	 */
	
	App.popUpMiniMap = (function(){
		var it = {}, panel, _p, _c, change = false,_ready=false, timer, _t=null, stopEvent = Core.Events.stopEvent, clock, max, min;
		it.info = null;
		it.close = popUpWindow.hidden;
		it.zoomIn = function(){stopEvent()};
		it.zoomOut = function(){stopEvent()};
		it.change = function(){};
		it.validateZoom = function(level){
			$E("zoomOut").className = (level<min)?"map_zoomOut_no":"map_zoomOut";
			$E("zoomIn").className = (level>max)?"map_zoomIn_no":"map_zoomIn";
		};
		it.allowZoom = function(zin, zout){
			$E("zoomOut").className = zin?"map_zoomOut_no":"map_zoomOut";
			$E("zoomIn").className = zout?"map_zoomIn_no":"map_zoomIn";
		}
		it.ready = function(map){
			var lp = $E("popUpMiniMapLoadingPanel");
			lp && (lp.style.display = "none");
			it.zoomIn = function(){map.zoomIn();stopEvent()};
			it.zoomOut = function(){map.zoomOut();stopEvent()};
			it.change  = map.change;
			it.change(it.info);
			change = false;
			_ready = true;
		};
		it.show = function( el, longitude, latitude, head, internal, address ){
			address = address.replace(/[ ]/g,"&nbsp;");
			clearTimeout(clock);
			clock = setTimeout(function(){
				(_t !== internal) && (function(){
					_t = internal; _ready = false, change = true;
					popUpWindow.content((function(){
						conf.SRC = (internal=="1"? "/mblog/map1.php" : "/mblog/googlemap.php");
						max = (internal=="1"?16:18);
						min = (internal=="1"?4:1);
						return popUpWindowHtml.replace(/#\{(.*?)\}/g,function(h, r){
							return conf[r];
						});
					})());
				})();
				popUpWindow.show();
				var arrow = $E("popUpMiniMapArrow");
				_p=$E("mini_map_panel");
				it.info = {"longitude":longitude, "latitude":latitude,"head":head,"address":address};
				var p = Core.Dom.getXY(el);
				var top = window.pageYOffset||Math.max((document["documentElement"]||{}).scrollTop, document.body.scrollTop);
				var x = (p[0]||0)-110;
				var y = Math.max((p[1]||0)-270,0);
				if(scope.$pageid=="mblog"){
					y = p[1] + 20;
					var ys = y + 262, wh = (w["innerHeight"]||((de && de["clientHeight"]) ? de["clientHeight"] : d["body"]["clientHeight"])) + top;
					arrow.style.cssText = "left: 120px; background-position: 0px 0px; top:-8px;";
					popUpWindow.position(x,y);
					if(ys > wh){
						App.scrollTo(top, top + (ys - wh) + 20)
					}
				}else{
					arrow.style.backgroundPosition = "0px"
					arrow.style.bottom = "-8px";
					arrow.style.cssText = "position:absolute;z-index:1000;left: 120px; background-position: right 0px; bottom: -8px;"
					popUpWindow.position(x,y);
					if(y<top){setTimeout(function(){
						App.scrollTo(top, y - 20)
					},10)}
				}
				if(_ready){it.change(it.info)}	
			},10)
		};
		return it;
	})();
	App.bindPopUpMiniMap = function( dom , x, y, type, head, addr, nick){
		addr = (addr || $CLTMSG["CL0910"]) + " ";
		dom.innerHTML = ['<img title="',$CLTMSG["CL0909"],'" class="small_icon geo_info" src="' +scope.$BASECSS+'style/images/common/transparent.gif"/>',addr,'- <a href="####" onclick="App.popUpMiniMap.show(this,\'',x,'\',\'',y,'\',\'',head,'\',\'',type,'\',\'',(nick? nick+" - ":""),addr,'\');return false;">',$CLTMSG["CL0908"],'</a>'].join("")
	};
})();
