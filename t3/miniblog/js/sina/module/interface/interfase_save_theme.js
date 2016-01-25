/**
 * @fileoverview
 *	更换模板，使用 jsload GET 数据请求
 * @author dg.Liu | dongguang@staff.sina.com.cn
 * @version 1.0
 * @since 2008-10-29
 */
$import("sina/interface.js");
$import("sina/utils/io/jsload.js");
//- 通行证登录接口
scope.Inter_template_set = new Interface("http://icp.cws.api.sina.com.cn/pfconf/template_set.php", "jsload",true);