/**
 * @author haidong@staff.sina.com.cn
 * 邀请页
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/suda.js");
$import("jobs/search/new_search_head.js");
$import("jobs/search/search_tab.js");
$import("jobs/guide_interest.js");
$import("jobs/miniblog_follow_all.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add("bind_mobile_info");
	jobs.add('init_head_search');
	jobs.add('search_tab_select');
	jobs.add('follow_all');
	jobs.add("start_suda");
	jobs.add("guide_interest");
	jobs.start();
}