/**
 * @fileoverview 同城微博
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/miniblog_search.js");
$import("jobs/publisher3.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/miniblog_del.js");
$import("jobs/favourite.js");
$import("jobs/mod_recommended.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/publisher_dialog.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_follow.js");
$import("jobs/pulley.js");
$import('jobs/square_news_dropdown.js');
$import("jobs/city.js");

function main(){
    var jobs = new Jobs();
    jobs.add("splitLoadMedia");
    jobs.add("topic");
    jobs.add("loadComment");
    jobs.add('init_input');
    jobs.add("pulley");
    jobs.add("square_news_dropdown");
    
    jobs.add('city');
    jobs.add('initSearch2');
    jobs.start();
}