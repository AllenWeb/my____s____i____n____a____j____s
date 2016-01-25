/**
 * @fileoverview 微博新推广页
 * @author yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/login.js");
$import("jobs/inputHandler.js");
$import("jobs/cardtips.js");
$import("jobs/yunying_unlogin3.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/langSelect.js");
$import("jobs/suda.js");
$import("jobs/information_unlogin.js");
$import("jobs/cache.js");
function main(){
    var jobs = new Jobs();
	jobs.add("splitLoadMedia");
	jobs.add("index_login");
	jobs.add("information_unlogin");
    //jobs.add('login3');
	//jobs.add('set_password');
    jobs.add('init_input');
    //jobs.add('loginMailTips');
    jobs.add('highLightLi');
	jobs.add("marquee");
	jobs.add("topicmarquee");
    jobs.add("start_suda");
	jobs.add("unlogin_cache");
    jobs.start();
}