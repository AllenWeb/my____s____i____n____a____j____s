/**
 * 开发者平台-创建应用
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("jobs/mod_login.js");
$import("jobs/developer/topTray.js");
$import("jobs/developer/create_app.js");
function main(){
	var jobs = new Jobs();
	jobs.add("create_app");
	jobs.start();
}

