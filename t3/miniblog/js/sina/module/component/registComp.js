/**
 * @fileoverview
 *	通过简易方式快速扩展一个动态组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/module/component/_component.js");
$import("sina/module/component/comp.js");
$import("sina/core/class/define.js");
/**
 * 快速创建一个无需接口请求的动态组件
 * @param {Object} option	组件选项[必选]	{
 	id : "",		组件ID
 	name : "",		组件标题
 	editUrl : "",
 	isDelete : "",
 	dynamic : "",
 	flash : "",
 	html : "",
 	interface : ""
 * }
 */

$registComp = Module.Component.registComp = function (id, override, superClass) {
//	$Debug("开始创建组件 " + id + " ...");
	superClass = Module.Component["Comp_" + superClass];
	superClass = superClass || Module.Component.Comp;
	override.compid = id;
	Module.Component["Comp_" + id] = Core.Class.define(null, superClass, override);
};

