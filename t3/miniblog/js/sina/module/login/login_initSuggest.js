/**
 * @fileoverview
 *	初始化 Suggest
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008
 */
$import("sina/module/login/_login.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
Module.Login.initSuggest = function (){
//	$Debug("Suggest init...");
	passcardOBJ.init(
		// FlashSoft 
		// 需要有下拉框的input对象，注意,最好这个input的autocomplete设定为off
		$E("login_name"),
		{
			overfcolor: "#999",		// 鼠标经过字体颜色
			overbgcolor: "#e8f4fc",	// 鼠标经过背景颜色
			outfcolor: "#000000",	// 鼠标离开字体颜色
			outbgcolor: ""			// 鼠标离开背景颜色
		},
		// 输入完成后,自动需要跳到的input对象[备选]
	$E("login_pass"), parent);
	if ($E("login_name" && parent.isLoginShow)) {
		$E("login_name").focus();
	}
	else{
		Core.Events.addEvent(window, function () {
			if (parent.isLoginShow) {
				$E("login_name").focus();
			}
		}, "load");
	}
};
