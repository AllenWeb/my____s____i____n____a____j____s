/**
 * @fileoverview 新用户引导--推荐关注--批量加关注
 * @author chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/miniblog_follow_all.js");
$import("jobs/guide_interest.js");
$import("jobs/more.js");
$import("jobs/langSelect.js");
$import("jobs/suda.js");
$import("diy/reg_more.js");
function main(){
    var jobs = new Jobs();
    jobs.add("follow_all");
	jobs.add("guide_interest");
	jobs.add("start_suda");
    jobs.start();
}