/**
 * @fileoverview 添加手机订阅
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/interface.js");
$import("sina/msg/phone_attention.js");
$import("sina/core/events/getEventTarget.js");

/**
 * 手机订阅
 */
scope.PhoneAttentionAdd = Core.Class.create();
scope.PhoneAttentionAdd.prototype = {

    initialize: function(){
    },
    add: function(fuid){
        var fuid = fuid || scope.$uid;
        if (!this.addInterface) {
            this.addInterface = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/attention.php", "jsload");
        }
        checkAuthor();
        if (!$isLogin) {
         	  $login(Core.Function.bind3(this.request, this, [fuid]));
        }else{
			this.request(fuid);
		}

    },
    request: function(fuid){
        this.addInterface.request({
            GET: {
                fuid: fuid
            },
            onSuccess: function(data){
				var msg='手机关注成功！<br/><span style="font-weight: 100; font-size: 12px;">><a target="_blank" href="http://profile.blog.sina.com.cn/phone_attention.php?uid='+$UID+'"> 查看关注动态</a>>></span>'
				winDialog.alert(msg,{
					icon: "03",
				    funcOk: function(){
					}
				});	
            },
            onError: function(data){
                if(data.code=="B24010"){
					window.location.href="http://profile.blog.sina.com.cn/phone_attention.php?uid="+$UID
				}else{
					showError(data.code);
				}
            },
            onFail: function(){
            }
        });
    }
};
