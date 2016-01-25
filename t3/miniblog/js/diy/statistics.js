$import("sina/sina.js");
$import("sina/core/events/addEvent.js");

/**
 * @fileoverview
 * 使用静态页统计
 *  INS.submit   简易静态接口提交, 页面只保留一个统计用script
 *  INS.onScroll 屏幕每滚动一屏，向静态接口提交一次统计
 * @author liusong@staff.sina.com.cn
 */

Boot.addDOMLoadEvent(function(){
	//simple namespace
	var w = window;
	var d = w["document"];
	var b = d["body"];
	var e = d["documentElement"];
	var h = document.getElementsByTagName("head")[0];
	//instance
	var INS = {};
	/**
	 * 简易静态接口提交, 页面只保留一个统计用script
	 * @param {Object} oGet 必选参数，提交参数
	 */
	INS.submit = (function(){
		var s,aQuerry;
		return function(oGet){
			aQuerry = [];
			for(var i in oGet){	aQuerry.push("".concat(i,"=",oGet[i])); }
			if (s) {s.parentNode.removeChild(s)};
			s = document.createElement("script");
			s.charset = "utf-8";
			s.src = ["http://hits.sinajs.cn/c.html?",aQuerry.join("&")].join("");
			h.appendChild(s);
		};
	})();
	/**
	 * 滚屏处理
	 * 屏幕每滚动一屏，向静态接口提交一次统计
	 */
	INS.onScroll = (function(){
		var pw,st,ph=600,current=1;
		return function(){
			pt = Math.max(e.scrollTop, b.scrollTop);
			if( ph && pt && pt > ph ){
			var snap = Math.floor(pt/ph);
				if(snap > current){
					var oGet = {
						"scroll2" : snap,
						"rnd" : parseInt(Math.random() * 100000000)
					};
					current = snap;
					INS.submit( oGet );
				}
			}
		};
	})();
	//页面滚动事件绑定
	Core.Events.addEvent(w,INS.onScroll,"scroll");
});
