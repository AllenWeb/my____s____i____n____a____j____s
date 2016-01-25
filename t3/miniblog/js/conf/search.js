/*
 * search
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topic.js");
$import("jobs/commentConsole.js");
$import("jobs/commentMethod.js");
$import("jobs/scaleimg.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_del.js");
$import("jobs/searchuser.js");
$import("jobs/favourite.js");
$import("jobs/rightlist_follow.js");
$import("jobs/publisher2.js");
//$import("diy/searchdialog.js");
//$import("diy/searchdialog_topic.js");
$import("jobs/publisher_dialog.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/suda.js");
$import("jobs/information_profile.js");
$import("jobs/search_new/search_topic.js");
function main(){
    var jobs = new Jobs();
    jobs.add("splitLoadMedia");
    jobs.add("initSearch");
    
    jobs.add('search_ctrlenter');
    jobs.add('search_topic')
    jobs.add('init_input');
    if(!scope.$searchuser){
//      jobs.add("hotsearch");  
//      jobs.add("hotsearchtop");
        //if (scope.$uid != "") {
        //  jobs.add("publisher");
        //}
        jobs.add("topic");
//      jobs.add("publisher2");
        jobs.add("loadComment");
//      jobs.add("advancedSearch");
    }else{
        jobs.add("searchuser"); 
    }
    if (scope.$uid === '') {
        jobs.add("information3");
        jobs.add("showCheckCode");
    }
    jobs.add("start_suda");
    jobs.start();
}