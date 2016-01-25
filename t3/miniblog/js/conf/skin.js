/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/skinmanage.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_search.js");

$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("jobs/publisher3.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/pop_manage.js");
$import("jobs/getfocus.js");
$import("jobs/miniblog_del.js");
$import("jobs/refurbishNumber.js");
$import("jobs/recommUser.js");
$import("jobs/favourite.js");
$import("jobs/mod_recommended.js");
$import("jobs/seevideo.js");
$import("jobs/group_index.js");
$import("jobs/tag.js");
$import("diy/searchdialog_topic.js");
$import("jobs/group_sidebar.js");
$import("jobs/maybeconcern_index.js");
$import("jobs/paging.js");
$import("jobs/publisher_dialog.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");
$import("jobs/bindMobileInfo.js");

function main(){
	var jobs = new Jobs();
	
	//从模板feed过来时弹出提示框	
	jobs.add("init_skin");
	jobs.add("initSearch");
	jobs.add('init_input');
	
	if (scope.$uid == scope.$oid) {
		jobs.add("publisher3");
		jobs.add("recommuser");
	}	
	jobs.add("hotsearch");
	jobs.add("topic");
	jobs.add("loadComment");
	jobs.add("refurbishNumber");
	jobs.add("group_option");
	jobs.add("set_tag");
	jobs.add('maybeconcern_index');
	jobs.add("group_sidebar");
	jobs.add("paging");
	jobs.add("splitLoadMedia");
	jobs.add("changeSkinDial");	
	//绑定绿丝带
	jobs.add("bind_mobile_info");
	jobs.add("start_suda");
	jobs.start();
}