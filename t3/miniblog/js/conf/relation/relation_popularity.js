/**
 * @fileoverview 关系中心-人气热门推荐
 * @author zhangjinlong jinlong1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");
//$import("jobs/square_star.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import('jobs/miniblogcard.js');
$import("jobs/bindMobileInfo.js");
$import('jobs/square_news_dropdown.js');
$import("jobs/seevideo.js");
$import("jobs/suda.js");
$import("jobs/group_sidebar.js");
$import("jobs/group_selector.js");
$import("jobs/group_member.js");


$import("jobs/guide_interest.js");
$import("jobs/miniblog_follow_all.js");

function main(){
	var jobs = new Jobs();
	//jobs.add("square_star");
	jobs.add("initSearch");
	jobs.add("hotsearch");
	jobs.add('init_input');
	jobs.add("miniblogCard");
	jobs.add("square_news_dropdown");
	jobs.add("seevideo");
	jobs.add("start_suda");
	jobs.add("bind_mobile_info");
	jobs.add("group_select");    //分组选择器
	jobs.add("group_sidebar");   //分组侧边栏
	jobs.add("group_member")     //分组内容页


	jobs.add("guide_interest");	
	jobs.add("follow_all");	
	
	jobs.start();
}