/**
 * @fileoverview 新用户引导--推荐关注--批量加关注
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/miniblog_follow_all.js");
$import("jobs/miniblog_flash_demo.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("follow_all");
	jobs.add("flash_demo");
	jobs.add("start_suda");
	jobs.start();
}