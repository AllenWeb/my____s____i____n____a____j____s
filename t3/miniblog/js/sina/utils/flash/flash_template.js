/*
 * Copyright (c) 2007, Sina Inc. All rights reserved.
 * @fileoverview 随便逛逛
 */

$import("sina/app.js");
$import("sina/core/class/create.js");
$import("sina/sina.js");
$import("sina/utils/flash/swf.js");
/**
 * 随便逛逛
 * @author stan | chaoliang@staff.sina.com.cn
 * 
 * @modified L.Ming | liming1@staff.sina.com.cn
 */
App.FlashTemplate= function(template_id){
	var tpl_cfg1 = scope.flash_template_config[template_id];
	if(typeof tpl_cfg1 != 'undefined'){
        Utils.Flash.swfView.Add(tpl_cfg1.swf, "toppicflash", "map1", tpl_cfg1.width, tpl_cfg1.height, "8.0.0.0", "#000", {}, {
            scale: "noscale",
            allowScriptAccess: "always",
            wmode: "transparent"
        });
	}
};

$registJob("flash_template", function () {
	var template;
	if(config.common.t=="13_0"){
		template=scope.theme_id;
	}else{
		template=config.common.t;
	}
	App.FlashTemplate(template);
});
