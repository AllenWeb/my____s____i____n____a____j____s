/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import("sina/jobs.js");
$import("jobs/base.js");
$import("diy/copy.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("diy/flyDialog.js");
$import("jobs/suda.js");

function main(){
	var jobs = new Jobs();
	jobs.add("initSearch");
	jobs.add('init_input');
	jobs.add("start_suda");
	jobs.start();
	$E('copy_invite').onclick = function(){
		$E('invite_url').select();
		var sucStr   = "邀请链接复制成功！ 你可以利用快捷方式Ctrl+V键粘贴到UC、QQ或MSN等聊天工具中。"; 
		var options  = {icon:3};
		if(App.copyText($E('invite_url').value) == false){
			sucStr   = "你的浏览器不支持脚本复制或你拒绝了浏览器安全确认，请尝试手动[Ctrl+C]复制。";
			options  = {icon:1};
		}
		App.flyDialog(sucStr,null,$E("copylink"),options);
	};
	$E('invite_url').onclick = function(){
		$E('invite_url').select();
	}
}
