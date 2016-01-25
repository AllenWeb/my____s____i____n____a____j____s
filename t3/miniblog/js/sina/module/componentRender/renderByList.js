/**
 * @fileoverview
 *	组件渲染流程
 * @author Stan | chaoliang@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/componentRender/_componentRender.js");
$import("sina/core/array/foreach.js");

Module.ComponentRender.renderByList = function (list) {
	Core.Array.foreach(list, function(v, i){
		try{
			//[901, 12, 17, 3, 1, 23, 2, 38]
//			var comp = $E("blog_" + v).comp = new Module.Component["Comp_" + v];
			if ($E("module_" + v) != null) {
				var comp = new Module.Component["Comp_" + v]();
				comp.load();
				$Debug("组件 ：" + v + " 初始化成功", "#00FF00", "#666666");
				if(typeof scope.currentModule == "undefined"){
					scope.currentModule = {};
				}
				scope.currentModule[v] = comp;
			}
			else {
				throw new Error("组件 ：" + v + " 初始化失败，页面内缺少组件的HTML节点");
			}
		}catch(e){
			$Debug(e.message || "组件 ：" + v + " 初始化失败，请确认该组件类是否定义过", "#FFCC6B", "#666666");
//			traceError(e);
		}finally{
		}
	});
};