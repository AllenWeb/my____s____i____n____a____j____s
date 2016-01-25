/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblogShare.js");

function main(){
	(function(w,d){var dw,dh,de = d.documentElement;dw = (de && de.clientWidth)?de.clientWidth:d.body.clientWidth;dh=(de && de.clientWidth)?de.clientHeight:d.body.clientHeight;if(dw<620||dh<450){window.resizeTo(620,450)}})(window,document);
	var _countdown = $E("countdown");
	var _t = 3;
	setInterval(function(){
		if(_t>0){
			_countdown.innerHTML = _t--;
		}else{
			window.close();
		}
	},1000)
}
