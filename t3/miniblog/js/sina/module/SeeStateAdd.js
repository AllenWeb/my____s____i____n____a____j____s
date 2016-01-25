/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 个人信息组件下方的关注
 * @author dg.Liu | dongguang@staff.sina.com.cn
 */
$import("sina/module/module.js");
$import("sina/sina.js");
$import("sina/core/function/bind2.js");
$import("sina/core/class/extend.js");
$import("sina/module/interface/interface_see_add.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/SeeMSG.js");
$import("sina/productCommon/blog/dialog/dialogConfig.js");
$import("sina/utils/dialog.js");
$import("sina/utils/windowDialog.js");

Module.SeeState=Core.Class.extend(Module.SeeState||{},
{
	add:function(aid){
		if (!$isLogin) {
            $login(function(){
                checkAuthor();
                this.save(aid);
            }.bind2(this));
        }else{
			this.save(aid);
		}
    },
	save:function(aid){
	    var param = {
            uid: $UID,
            aid: aid || $uid
        };
        scope.Inter_see_add.request({
            GET: param,
            onSuccess: function(_data){
               // alert(_data);
            },
            onError: function(_data){
				
				switch(_data.code) {
					case "A33003":
						//var msg="关注已达上限300，不能再添加新的关注了！<br/>可以到<a href='http://profile.blog.sina.com.cn/attention.php?uid="+$UID+"' target='_blank'>关注的人</a>去取消关注一些人，再回来关注吧。";
						var msg="关注失败!<br/><span style='font-weight:100;font-size:12px;'>已达关注上限300，不能再添加新的关注了！你可以先到<a href='http://profile.blog.sina.com.cn/attention.php?uid="+$UID+"' target='_blank'>“我关注的人”</a>去取消关注一些人，再回来关注。</span>";
						winDialog.alert(msg);	
						break;
					case "A33004":
						 //var msg="关注成功!<br/>你将在<a href='http://profile.blog.sina.com.cn/attention_feed.php?uid="+$UID+"' target='_blank'>关注动态</a>页面接收到对方的新信息";
						 
						 var msg= "关注成功!<br/><span style='font-weight:100;font-size:12px;'>你将在关注动态页面接收到对方的新信息。<br/>\
						<a href='http://profile.blog.sina.com.cn/attention_feed.php?uid="+$UID+"' target='_blank'> 查看关注动态</a>>><br/>\
						 <a href='http://profile.blog.sina.com.cn/attention.php?uid="+$UID+"' target='_blank'> 查看我关注的人</a>>><br/>\
						 <a href='http://profile.blog.sina.com.cn/attention.php?uid="+$UID+"&type=1' target='_blank'> 查看谁在关注我</a>>></span>";
						 winDialog.alert(msg,{
						 	icon: "03",
						 	funcOk: function(){
								window.location.reload();
						 	}
						 });	
						break;
					default:
					 	showError(_data.code);
				}
            },
            onFail: function(){
            }
        });
	}
});
