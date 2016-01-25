/**
 * @author Liusong liusong@staff.sina.com.cn
 */

/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_search.js");
$import("jobs/mod_login.js");
$import("jobs/publisher.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_setwidget.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add('set_widget');
	jobs.add("start_suda");
	jobs.start();
	
	App.actmblog = function(){
		Utils.Io.Ajax.request('/plugins/aj_widget.php', {
			'onComplete': function(json){
				if (json.code == 'A00006') {
					App.confirm($SYSMSG["M11001"],{ok:function(){
						if(json.data){
							window.location.href = json.data;
						}
					},ok_label:"去看看",cancel_label:"关闭",icon:3});
				}
				else {
					App.alert($SYSMSG[json.code],{ok_label:"关闭"});
				}
			},
			'onException': function(){
			},
			'returnType': 'json'
		});
	};
	
}