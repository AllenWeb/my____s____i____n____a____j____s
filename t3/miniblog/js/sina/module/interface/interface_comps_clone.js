/**
 * @fileoverview
 *	设置模块 & 模块拖动接口
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-18
 */
$import("sina/interface.js");
$import("sina/utils/io/jsload.js");
//$import("sina/utils/io/ijax.js");
//$import("sina/utils/io/ajax.js");
//- 测试接口
scope.Inter_comps_clone = new Interface("http://icp.cws.api.sina.com.cn/pfconf/module_clone.php", "jsload");
