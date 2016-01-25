/**
 * @author haidong
 * 通用鼠标焦点事件
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/sinput/sinput.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/addEvent.js");
$import("diy/TextareaUtils.js");


/*
 * Pjan
 * 公开搜索的方法，因为有两个地方调用
 */
App.hotSearch = function(input,subbtn,form,maxlen,txt,cindex){
	var maxlen  = maxlen || 30;
	var textnode= $E(input);
	var subbtn=   $E(subbtn);
	Utils.Sinput.limitMaxLen(textnode,maxlen);
	function formget(event){
		var value = Core.String.trim(textnode.value);
		value     = Core.String.leftB(value,maxlen);
		if(value && value != txt){							
			location.href = '/k/' + encodeURIComponent(encodeURIComponent(value));
		}else{
//			textnode.focus();	
			App.TextareaUtils.setCursor(textnode);		
		}
		Core.Events.stopEvent(event);
	}
	
	Core.Events.addEvent(subbtn,formget,"click");
	Core.Events.addEvent(textnode,function(e){
		if(e.keyCode == 13){
			formget();
		}
	},'keyup');
};

$registJob("hotsearch",function(){
	//App.search("hot_keyword","hot_submit","hot_search",null,"搜索其他话题...");	
	try{
		App.hotSearch("hot_keyword","hot_submit","hot_search",null,$CLTMSG["CC1001"]);
	}catch(exp){}
});

$registJob("hotsearchtop",function(){
	//App.search("hot_keyword","hot_submit","hot_search",null,"搜索其他话题...");	
	try{
		App.hotSearch("hot_keyword_top","hot_submit_top","hot_search_top",null,$CLTMSG["CC1001"]);
	}catch(exp){}
});
