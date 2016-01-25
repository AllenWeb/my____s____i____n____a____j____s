/**
 * @desc 微博工具绑定139首页
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/mod_login.js");
$import("jobs/topTray.js");
$import("jobs/tools/bind139.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initBind139");
	jobs.add("initSearch");
	jobs.start();	
}