/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 引导模块
 */
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/guide/gender.js");
$import("jobs/guide/location.js");
$import("jobs/guide/name.js");
$import("jobs/guide/nick.js");
$import("jobs/guide/birthday.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add('guide_gender');
	jobs.add("guide_location");
	jobs.add("guide_name");
	jobs.add("guide_nick");
	jobs.add("guide_birthday");
	jobs.add("start_suda");
	jobs.start();
}
