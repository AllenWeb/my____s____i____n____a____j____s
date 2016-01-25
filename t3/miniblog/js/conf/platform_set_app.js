/**
 * @desc 设置我的应用
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/mod_login.js");
$import("jobs/topTray.js");
$import("jobs/platform/set_app.js");
function main(){
	var jobs = new Jobs();
	jobs.add('initAppListHover');
	jobs.add("initSearch");
	jobs.start();	
}