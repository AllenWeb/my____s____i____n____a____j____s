/**
 * @fileoverview 我的通知列表
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/notice_list.js");
function main(){
	var jobs = new Jobs();
	jobs.add("noticeList");
	jobs.start();
}