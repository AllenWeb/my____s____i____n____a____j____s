/**
 * @fileoverview 微博广场首页
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");

$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/publisher.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/pop_manage.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_del.js");
$import("jobs/recommUser.js");
$import("jobs/favourite.js");
$import("jobs/mod_recommended.js");
$import("jobs/pulley.js");
$import("jobs/publisher_dialog.js");
$import('jobs/miniblogcard.js');
$import('jobs/square_news_dropdown.js');
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/square_index.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("splitLoadMedia");
    jobs.add("initSearch");
    jobs.add("hotsearch");
    jobs.add("topic");
    jobs.add("loadComment");
    jobs.add('init_input');
    jobs.add("miniblogCard");
    jobs.add("square_news_dropdown");
    jobs.add("pulley");
    jobs.add("square_index");
	jobs.add("start_suda");
    jobs.start();
}
