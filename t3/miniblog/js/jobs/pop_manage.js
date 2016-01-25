/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('sina/app.js');
$import('jobs/base.js');
$import('sina/utils/cookie/cookie.js');

App.closeIntroduction = function(n,d){
	
	if(n == 101){
		Utils.Cookie.setCookie('lianghui','1',24,false,'t.sina.com.cn',false);
		return false;
	}
		
	if(n == 103){
		Utils.Cookie.setCookie('message','1',24*7,false,'t.sina.com.cn',false);
		return false;
	}
	var num = parseInt(n);
	if(n > 10){
		var oldNum = parseInt(Utils.Cookie.getCookie('weekguide')) || 0;
		var kList = [1,2,4,8,16];
		var newNum = (kList[n-11])|oldNum;
		Utils.Cookie.setCookie('weekguide',newNum,((24 -(new Date()).getHours()) - ((new Date()).getMinutes())/60 + 24*(7 - (new Date()).getDay())),false,'t.sina.com.cn',false);
	}else{
		var oldNum = parseInt(Utils.Cookie.getCookie('guide')) || 0;
		var kList = [16,8,4,2,1];
		var newNum = (kList[n-1])|oldNum;
		Utils.Cookie.setCookie('guide',newNum,((24 -(new Date()).getHours()) - ((new Date()).getMinutes())/60),false,'t.sina.com.cn',false);
	}
	
};

App.closeIntroduction2 = function(id, second, flag){
	second = parseInt(second);
	var hour = (second/3600); 
	Utils.Cookie.setCookie((flag || "c_") + id,'1',hour,false,'t.sina.com.cn',false);
};
