/*
 * miniblog首页js
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/goTop.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/publisher.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/indexMsgCallBack.js");
$import("jobs/miniblog_del.js");
$import("jobs/scaleimg.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/favourite.js");
$import("jobs/mod_recommended.js");
$import("jobs/seevideo.js");
$import("jobs/set_blacklist.js");
$import("jobs/tag.js");
//$import("diy/searchdialog_topic.js");
$import("jobs/group_sidebar.js");
$import("jobs/group_selector.js");
$import("jobs/group_member.js");
$import("jobs/profile_moreact.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/publisher_dialog.js");
$import("diy/bigpop.js");
$import("jobs/suda.js");
$import("jobs/information_profile.js");
$import("jobs/mod_register_login.js");
$import("jobs/addPrivateSkin.js");
$import("jobs/miniblog_follow_lockscreen.js");
$import("jobs/search/keyword_filter.js");
$import("jobs/medal.js");
$import("jobs/autopublish.js");
$import("jobs/search/content_filter.js");
function main(){
	var jobs = new Jobs();
	jobs.add("splitLoadMedia");
	jobs.add("lockscreen4addfollow");
	jobs.add("initSearch");
	jobs.add("group_select");		//分组选择器
	jobs.add("group_sidebar");		//分组侧边栏
	jobs.add("group_member")		//分组内容页
	jobs.add("topic");
	jobs.add("loadComment");
	jobs.add("indexMsgCallBack");
	jobs.add('init_input');
	jobs.add("bind_mobile_info");
	jobs.add("seevideo");
	jobs.add("set_tag");
	jobs.add("profile_moreact");
	jobs.add("start_suda");
    jobs.add("bigpop");
	if (scope.$uid === '') {
		jobs.add("information3");
		jobs.add("showCheckCode");
	}
	if($E('link1')){
		jobs.add('addPrivateSkin');
	}
	jobs.add("keyword_filter");
	jobs.add("medal");
	jobs.add("content_filter");
	jobs.start();
}
