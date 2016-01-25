/**
 * @fileoverview
 *	通行证登录接口，使用 jsload GET 数据请求
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-15
 */
$import("sina/interface.js");
$import("sina/utils/io/jsload.js");
//- 通行证登录接口
scope.Inter_uplad_cnf = new Interface("http://icpf.sina.com.cn/tp/update_conf.php", "jsload");