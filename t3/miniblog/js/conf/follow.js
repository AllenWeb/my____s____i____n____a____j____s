/**
 * miniblog v2 我关注的人
 * @update 2009.12.1 by liusong@staff.sina.com.cn
 * - $import("jobs/miniblog_search.js");
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/base.js");			
$import("jobs/miniblog_follow.js");	
$import("jobs/topTray.js");			
$import("jobs/inputHandler.js");	
$import("jobs/bindMobileInfo.js");	
$import("jobs/searchfollow.js");	
$import("jobs/group_sidebar.js");
$import("jobs/group_selector.js");
$import("jobs/group_member.js");
$import("jobs/getfocus.js");
$import("jobs/group_setting.js");
$import("jobs/suda.js");
$import("jobs/set_blacklist.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");			//初始化搜索
	jobs.add("initPage");			//页面初始化
	jobs.add('init_input');			//批量初始化输入框
	jobs.add("bind_mobile_info");	//初始化手机绑定信息
	jobs.add("follow_search");		//搜索关注的人
	jobs.add("group_select");		//分组选择器
	jobs.add("group_sidebar");		//分组侧边栏
	jobs.add("group_member")		//分组内容页
	jobs.add("hotsearch");
	
	jobs.add("group_setting");//组重命名
	
	jobs.add("start_suda");
	jobs.start();
}
