/**
 * @fileoverview
 *	通行证登录接口，使用 Ijax POST 数据请求
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-15
 */
$import("sina/interface.js");
$import("sina/utils/io/ijax.js");
//- 通行证登录接口
scope.Inter_Login = new Interface("http://icp.cws.api.sina.com.cn/login/login.php", "ijax");