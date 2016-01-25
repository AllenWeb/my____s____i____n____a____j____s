/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/goTop.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/publisher3.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/pop_manage.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/miniblog_del.js");
$import("jobs/refurbishNumber.js");
$import("jobs/recommUser.js");
$import("jobs/favourite.js");
$import("jobs/mod_recommended.js");
$import("jobs/group_index.js");
// $import("jobs/tag.js");
//$import("diy/searchdialog_topic.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/group_sidebar.js");
$import("jobs/paging.js");
//$import("jobs/maybeconcern_index.js");
$import("jobs/topic_recom.js");
$import("jobs/set_bless_icon.js");
$import("diy/bigpop.js");
$import("jobs/suda.js");
$import("jobs/search/atme_filter.js");
$import("jobs/search/keyword_filter.js");
$import("jobs/miniblog_follow_lockscreen.js");
$import("jobs/hotkey.js");
$import("jobs/medal.js");
$import("jobs/autopublish.js");
$import("jobs/BetterUserCard.js");
$import("jobs/maybeYourFriend.js");
$import("jobs/tailor/widget_setting.js");

function main(){
	try{
		document.execCommand("BackgroundImageCache", false, true)
	}catch(e){}
	var jobs = new Jobs();
	jobs.add("splitLoadMedia");
	jobs.add("initSearch");
	if (scope.$uid === scope.$oid) {
		jobs.add("publisher3");
		jobs.add("recommuser");
	}	
	jobs.add("lockscreen4addfollow");
	jobs.add("hotsearch");
	jobs.add("topic");
	jobs.add("loadComment");
	jobs.add('init_input');
	jobs.add("bind_mobile_info");
	jobs.add("refurbishNumber");
	jobs.add("group_option");
	//jobs.add("set_tag");
	//jobs.add('maybeconcern_index');
	jobs.add("group_sidebar");
	jobs.add("paging");
	jobs.add("setBlessIcon");
	jobs.add("bigpop");
	jobs.add("keyword_filter");
	jobs.add("atme_filter");
	jobs.add("start_suda");
	jobs.add("hotkey");
	jobs.add("medal");
	jobs.add("userCard");
	jobs.add("maybeYourFriend");
	jobs.add("widget_setting");
	
	jobs.start();
}