/**
 * @fileoverview
 * 	App组件渲染流程
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/array/foreach.js");
$import("sina/module/component/comp_app.js");
$import("sina/module/componentRender/renderByList.js");
/**
 * 
 * @param {Array} compList 组件ID列表 >2000
 */
Module.ComponentRender.renderApp = function (compList) {
	Core.Array.foreach(compList, function(v, i){
		$registComp(v, {}, "app");
	});
	Module.ComponentRender.renderByList(compList);
};
