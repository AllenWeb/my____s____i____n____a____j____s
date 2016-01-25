/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/inputHandler.js");
$import("jobs/fullinfo/step3.js");
$import("jobs/mousemove.js");
$import("jobs/searchuser.js");
$import("jobs/miniblog_follow_all.js");
$import("jobs/guide_interest.js");
$import("jobs/addonetag.js");
$import("jobs/langSelect.js");
$import("jobs/suda.js");
$import("diy/reg_more.js");
function main(){
    var jobs = new Jobs();
	jobs.add('follow_all');
    jobs.add('init_input');
	jobs.add('msn_submit');
	jobs.add('guide_interest');
	jobs.add("start_suda");
    jobs.start();
}
