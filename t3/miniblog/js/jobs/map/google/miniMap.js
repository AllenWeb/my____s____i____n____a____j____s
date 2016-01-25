/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/imgURL.js");
$import("jobs/map/templete.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
/**
 * google地图
 */
(function(){
	var p, map, handle, addEvent=Core.Events.addEvent, stopEvent=Core.Events.stopEvent;
	
	if(!google){return}
	
	google.load("maps", "2.x", {base_domain: "ditu.google.cn", language: "zh-CN"});
	
	//地图加载成功后进行初始化工作
	google.setOnLoadCallback(function() {
		
		//对地图大小进行设置
		var gMap=$E("map"),loading=$E("loading");
			gMap.style.width = "400px";
			gMap.style.height = "250px";
			
		//创建一个Marker类
		google.maps.SMarker = function(latlng, opt){
			this.latlng = latlng;
			this.html = opt.innerHTML || '';
			this.className = opt.className || '';
			this.css = opt.css || {};
			this.id = opt.id || '';
		};
		
		//继承google的overlay
		google.maps.SMarker.prototype = new google.maps.Overlay();
		google.maps.SMarker.prototype.initialize = function(){
			var c = map.fromLatLngToDivPixel(this.latlng);
			var div = $C("div");
			div.style.left = (c.x - 20)+"px";
			div.style.top = (c.y - 49)+"px";
			div.style.position = "absolute";
			div.innerHTML = this.html;
			map.getPane(G_MAP_MAP_PANE).appendChild(div); 
			this.map = map;  
			this.container = div;
		};
		
		//可以移除Marker的方法
		google.maps.SMarker.prototype.remove = function(){
			var c = this.container.parentNode;
			c.removeChild(this.container);
			this.container.style.display = "none";
		};
		
		//可以重绘Marker的方法
		google.maps.SMarker.prototype.redraw = function(force){
			if (!force) return;
			var c = this.map.fromLatLngToDivPixel(this.latlng);
			this.container.style.left = (c.x - 20) + "px";
			this.container.style.top = (c.y - 49) + "px";
			map.getPane(G_MAP_MAP_PANE).appendChild(this.container); 
		};
		function setAllowZoom(){
			try {
				level = map.getZoom();
				(handle = window.top.App.popUpMiniMap) && handle.allowZoom(level < 1, level > 18);
			}catch(e){}
		}
		//地图回调的api
		var p = (function(){
			var it={}, _marker=null, _point, _icon, _data;
			it.fix = function(longitude, latitude){
				map.setCenter(new google.maps.LatLng(latitude, longitude), 14);
			};
			it.setPoint = function(longitude, latitude){
				it.fix(longitude, latitude);
				var latlng = new GLatLng(latitude, longitude);
				if(_marker){_marker.remove();_marker = null;}
				_marker = new google.maps.SMarker(latlng, {
					innerHTML : '<div class="bubble"><img style="cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;" title='+ _data.address +' src="' + _data.head + '"></div>'
				});
				window.top.App.marker = _marker;
				map.addOverlay(_marker);
			};
			it.zoomIn  = function(){map.zoomIn();setAllowZoom()};
			it.zoomOut = function(){map.zoomOut();setAllowZoom()};
			it.change  = function(data){
				_data = data;
				it.setPoint(data.longitude,data.latitude);
			};
			it.reset = function(){
				try{
					_marker.redraw(true);
				}catch(e){}
			};
			return it;
		})();
		
		//初始化地图
		map = App.map = new google.maps.Map2(gMap);
		map.enableScrollWheelZoom();
		GEvent.addListener(map, "moveend", p.reset);
		GEvent.addListener(map, "zoomend", setAllowZoom);
		window.focus();
		//注册调用
		try{(handle = window.top.App.popUpMiniMap) && handle.ready(p)}catch(e){}
	});
})();

