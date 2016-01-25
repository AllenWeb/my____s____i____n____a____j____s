/**
 * @author feng.dimu
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_follow.js");
$import("jobs/publisher_dialog.js");
$import("jobs/miniblog_search.js");
$import("jobs/square/square_app_gallery.js");
$import("jobs/square/square_app_text.js");
$import("jobs/square/square_app_listHover.js");
$import('jobs/square_news_dropdown.js');
$import("jobs/topTray.js");
$import("jobs/suda.js");

function main(){	
	var jobs = new Jobs();
    jobs.add("imageGallery");   
    jobs.add("showmoretext");    
    jobs.add("initListHover");   
	jobs.add("initSearch");
	jobs.add("square_news_dropdown");
	jobs.add("start_suda");
    jobs.start();	
}
