/**
 * @fileoverview 添加/删除/显示用户自定义标签功能
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/jobs.js");
$import("jobs/base.js");
$import("jobs/topTray.js");
$import("jobs/tag.js");
$import("jobs/suda.js");
function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add("set_tag");
	jobs.add("start_suda");
	jobs.start();
}

