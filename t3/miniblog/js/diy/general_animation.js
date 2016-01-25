/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/timer.js");

if(App.cartoon === undefined){
	App.cartoon = {};
}
(function(proxy){
	proxy.noticeInput = function(el,config){
		if(!el){ throw 'noticeInput need an element'}
		if(!config){config = {}}
		var orbit = config.orbit || ['#fee','#fdd','#fcc','#fdd','#fee','#fff'];
		var times = config.times || 2;
		var delay = config.delay || 2;
		var index = 0;
		var hook = App.timer.add(function(){
			if(index/delay >= orbit.length){
				times -= 1;
				if(times > 0){
					index = 0;
				}else{
					App.timer.remove(hook);
					return false;
				}
			}
			el.style.backgroundColor = orbit[index/delay];
			index += 1;
		});
		return false;
	};
})(App.cartoon);
