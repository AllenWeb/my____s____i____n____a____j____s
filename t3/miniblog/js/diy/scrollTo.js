$import("sina/sina.js");
$import("sina/app.js");


/**
 * 屏滚y 从A到B
 * @author liusong@staff.sina.com.cn
 */
(function(ns){
	var timer, que, i, step = 8, of;
	ns.scrollTo = function(nForm, nTo, nStep){
		step = nStep||step;
		of = nForm - nTo;
		que = [of]; que[step] = 0;
		i = 1;
		for (i; i < step; i++) { que[i]= (of = of / 2) }
		clearInterval(timer);
		timer = setInterval(function(){
			if (que.length) {
				window.scrollTo(0,nTo + que.shift());
				return;
			}
			clearInterval(timer);
		}, 30);
	}
})(App);
