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
 * 爱问地图
 */

$registJob("miniMap",function(){
	var mPanel=$E("main"), p, map, _longitude, _latitude, handle, _loading, currentL=14, ce = Core.Events, addEvent = ce.addEvent, stopEvent = ce.stopEvent;
	mPanel.style.width = "400px";
	mPanel.style.height =  "250px";
	mPanel.style.position = "relative";
	var mapoption = new MMapOptions();  
		mapoption.zoom=14;  
		mapoption.center=new MLngLat(116.397428,39.90923);  
		mapoption.overviewMap = HIDE;
		mapoption.isCongruence=true;  
	map = new SMap("main", mapoption);
	if(!map){return}
	//修正爱问地图加载图标不居中的问题
	if (_loading = $E("imgId")) {
		_loading.style.left = "184px";
		_loading.style.top  = "109px";
	};
	function setAllowZoom(){
		try {
			level = map.getZoomLevel();
			(handle = window.top.App.popUpMiniMap) && handle.allowZoom(level < 4, level > 16);
		}catch(e){}
	}
	p = (function(){
			var it = {}, _point = null, _data, otid = "", tid = "", count = 0, tip;
			//修正爱问地图的移动会跳的问题
			it.fix = function(){
				var ll = new MLngLat(_data.longitude, _data.latitude,1);
				pt = map.fromLngLatToContainerPixel(ll);
				tip.style.top = (pt.y * 1 - 49) + "px";
				tip.style.left = (pt.x * 1 - 20) + "px";
				setAllowZoom();
			};
			//在地图上显示一个Tip
			it.setPoint = function(longitude, latitude, content){
				if (!tip) {
					tip = $C("div");
					tip.id = "tip";
					tip.style.cssText = "position:absolute;z-index:9999;cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;";
					$E("main").appendChild(tip);
					map["addEventListener"](map, MAP_MOVING, it.fix);
					map["addEventListener"](map, MAP_MOVE_END, it.fix);
					map["addEventListener"](map, ZOOM_CHANGED, it.fix);
				}
				tip.innerHTML = '<div class="bubble"><img style="cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;" title='+ _data.address +' src="' + _data.head + '"></div>';
				map.setZoomAndCenter(14,new MLngLat(longitude,latitude),1);
				it.fix();
			};
			it.zoomIn = function(){
				map.zoomIn();
				setAllowZoom();
			};
			it.zoomOut = function(){
				map.zoomOut();
				setAllowZoom();
			};
			it.change = function(data){
				_data = data;
				it.setPoint(_data.longitude, _data.latitude)
			};
			return it;
		})();
		try {
			(handle = window.top.App.popUpMiniMap) && handle.ready(p)
		}catch (e) {}
});
