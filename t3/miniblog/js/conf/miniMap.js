/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/map/mapabc/miniMap.js");

function main(){
	 var jobs = new Jobs();
    jobs.add("miniMap");
    jobs.start();
}
