/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("jobs/MiniPlayer.js")

function main(){
	var jobs = new Jobs();
	jobs.add("login");
	jobs.add("initMiniPlayer");
	jobs.start();
}