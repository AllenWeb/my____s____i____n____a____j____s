/**
 * @fileoverview 新建推荐
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/searchfollow.js");
$import("jobs/group_selector.js");
$import("jobs/group_sidebar.js");
$import("jobs/group_selector.js");
$import("jobs/group_member.js");
$import("jobs/relation/addrecommend.js");
$import("jobs/bindMobileInfo.js");
$import("jobs/miniblog_search.js");
function main(){
	var jobs = new Jobs();
	jobs.add("addrecommend");
	jobs.add("initSearch");
    jobs.add("group_select");        //分组选择器
    jobs.add("group_sidebar");        //分组侧边栏
    jobs.add("group_member");        //分组内容页
    jobs.add("bind_mobile_info");
	jobs.start();
}