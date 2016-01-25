/**
 * @defreeze 
 * @author chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/splitLoaderPlugin/splitLoadMedia.js");
$import("jobs/langSelect.js");
$import("jobs/suda.js");
$import("jobs/cache.js");
$import("jobs/request.js");
$import("jobs/defreeze_user.js");
function main(){
    var jobs = new Jobs();
	jobs.add("defreeze_user");
    jobs.start();
}