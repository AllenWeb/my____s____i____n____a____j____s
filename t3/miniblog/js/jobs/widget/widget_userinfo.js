/**
 * @author xp
 */
$import("sina/core/dom/getElementsByClass.js")
$import("jobs/widget/widget_method.js");
$import("jobs/widget/widget_pulish.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/previous.js");
$import("sina/core/dom/contains.js");

$registJob("widget_userinfo",function(){
	//初始化配置
	cfg = {
		wrapper        : $E("widget_wrapper")
	};
	//初始化地址参数
	var param = App.urlParam()||{};
	//初始化widget外层宽度
	if (param.width) {
		param.width = param.width > 140 ? param.width : 140;
	}else{
		param.width = 140;
	};
	if(cfg.wrapper){
		cfg.wrapper.style.width = param.width + "px";
		document.body.style.overflow = "hidden";
	};
	//初始化widget外层的高度
	if(param.height){
		param.height = param.height > 60 ? param.height : 60;
	}else{
		param.height = 60;
	};
	if(cfg.wrapper){
		cfg.wrapper.style.height = param.height + "px";
		cfg.wrapper.style.overflow = "hidden";
		cfg.wrapper.style.position = "relative";
	}
})