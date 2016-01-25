/**
 * 开发者平台-编辑开发者信息
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("jobs/mod_login.js");
$import("jobs/developer/topTray.js");
$import("jobs/developer/edit_information.js");

function main(){
	var jobs = new Jobs();
	jobs.add("edit_information");
	jobs.start();
}

