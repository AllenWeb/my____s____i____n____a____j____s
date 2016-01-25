/**
 * @desc 微博工具绑定139成功页
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import("jobs/mod_login.js");
$import("jobs/topTray.js");
$import("jobs/tools/bind_publisher.js");
$import("jobs/inputHandler.js");
function main(){
	var jobs = new Jobs();
	jobs.add("bind_publisher");
//	jobs.add('init_input');
	jobs.add("initSearch");	
	jobs.start();	
}