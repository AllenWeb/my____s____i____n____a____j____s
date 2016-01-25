/**
 * @desc 微博工具微博墙设置页
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/inputHandler.js");
$import("jobs/mod_login.js");
$import("jobs/topTray.js");
$import("jobs/plugins/set_weiboWall.js");
function main(){
	var jobs = new Jobs();
	jobs.add('init_weiboWall_set');
//	jobs.add('init_input');
	jobs.add("initSearch");
	jobs.start();
	
}

//