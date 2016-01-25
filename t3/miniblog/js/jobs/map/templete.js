/**
 * @author liusong@staff.sina.com.cn
 */
App.mapTemplete = (function(){
	var it = {};
		it.popMapPanel = '<table class="mBlogLayer"><tbody>\
			<tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr>\
			<tr>\
				<td class="mid_l"></td>\
				<td class="mid_c">\
					<div id="popUpMiniMapLoadingPanel" style="position:absolute;left:200px;top:125px;z-index:99999"><img src=\'' + [scope.$BASECSS,'style/images/common/loading.gif'].join("") + '\'/></div>\
					<div class="layerBox">\
						<div class="geo_info_layer" style="width:400px;">\
							<div class="map_box"><iframe id="mini_map_panel" style="width:400px;height:250px;border:0 none;" frameBorder="0" scrolling="no" src="#{SRC}"></iframe></div>\
							<div id="popUpMiniMapArrow" class="geo_arrow" style="left:120px"></div>\
							<a href="javascript:;" class="close" title="#{CX0145}" onClick="App.popUpMiniMap.close();return false;"></a>\
							<a href="javascript:;" id="zoomIn" class="map_zoomIn" title="#{CL0825}" onMouseDown="App.popUpMiniMap.zoomIn();return false;"></a>\
							<a href="javascript:;" id="zoomOut" class="map_zoomOut" title="#{CL0826}" onMouseDown="App.popUpMiniMap.zoomOut();return false;"></a>\
						</div>\
					</div>\
				</td>\
				<td class="mid_r"></td>\
			</tr>\
			<tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody>\
		</table>';
		it.popUpMapTip = '<div class="bubble" style="top:20px;left:50px;"></div>';
	return it;
})();