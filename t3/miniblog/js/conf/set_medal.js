/**
 * @fileoverview 勋章设置
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/set_medal.js");
function main(){
	var jobs = new Jobs();
	jobs.add("set_medal");
	jobs.start();
}