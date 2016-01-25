/**
 * @fileoverview
 * 页面内组件渲染流程
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/componentRender/renderByList.js");
$import("sina/utils/io/jsload.js");
/**
 * 
 * @param {Array} defaultList 产品内可直接渲染的组件
 * @param {Object} widgetList 产品外需要通过接口加载渲染程序的组件
 */
Module.ComponentRender.render = function (defaultList, widgetList) {
	Module.ComponentRender.renderByList(defaultList);
	var url = "http://v.space.sina.com.cn/module/getmdinfo.php?modules=" + widgetList.join(",");
	Utils.Io.JsLoad.request(url, {
		onComplete : function(){},
		onError : function(){},
		onException : function(){
//			Module.ComponentRender.renderByList(widgetList);
		}
	});
};
