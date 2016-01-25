/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 设置个人资料组件中关注人气
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
$import("sina/module/module.js");
$import("sina/sina.js");
$import("sina/core/class/extend.js");
$import("sina/module/interface/interface_see_number.js");
$import("sina/msg/SeeMSG.js");

Module.SeeState=Core.Class.extend(Module.SeeState||{},
{
	setHotNumber:function(){		
		if($E("attention_hot")){
			var param={
				"uid":$uid,
				"attention":"suid"
			};
			scope.Inter_see_number.request({
	            GET: param,
	            onSuccess: function(_data){
					$E("attention_hot").innerHTML='<strong><a href="http://profile.blog.sina.com.cn/attention.php?uid='+$uid+'&type=1" target="_blank">'+_data[$uid]+"</a></strong>";
	            },
	            onError: function(_data){
	                $Debug("error:" + _data);
	            },
	            onFail: function(){
	            }
	        });
		}
    }
});
