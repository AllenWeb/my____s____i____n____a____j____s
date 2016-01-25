/*
 * search
 */


//公司 学校 兴趣
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/topTray.js");
$import("jobs/getfocus.js");
$import("jobs/inputHandler.js");
$import("jobs/searchuser.js");
$import("jobs/favourite.js");
$import("jobs/rightlist_follow.js");
//$import("jobs/search/new_search_head.js");
$import("jobs/search/changecity.js");
$import("jobs/suda.js");
$import("jobs/search_new/search_people.js");
$import("jobs/publisher_dialog.js");
function main(){
    var jobs = new Jobs();
    jobs.add("initSearch");
    jobs.add('init_input');
//  jobs.add('init_head_search');
//  jobs.add('init_more_search');       
    jobs.add('search_people');
    if(!scope.$searchuser){
//      jobs.add("hotsearch");  
//      jobs.add("hotsearchtop");
//      jobs.add("advancedSearch");
    }else{
//      jobs.add("searchuser"); 
    }
    jobs.add("start_suda");
    jobs.start();
}