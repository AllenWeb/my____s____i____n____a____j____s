/**
 * @fileoverview 取消手机订阅
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");

$import("sina/interface.js");
$import("sina/msg/phone_attention.js");
$import("sina/msg/phone_attention.js");


/**
 * 取消手机订阅
 */
scope.PhoneAttentionCancel = Core.Class.create();
scope.PhoneAttentionCancel.prototype = {
    initialize: function(){
    },
    cancel: function(fuid){
    
        winDialog.confirm($SYSMSG['B24015'], {
            funcOk: function(){
                if (!this.cancelInterface) {
                    this.cancelInterface = new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/cancel_attention.php", "jsload");
                }
				this.cancelInterface.request({
					GET : {
						fuid:fuid
					},
					onSuccess : function (data) {
						winDialog.alert("取消成功",{
							funcOk: function(){
								window.location.href=window.location.href;
							}, 
							icon: "01" 
						})
						
					},
					onError : function (data) {
						showError(data.code);
					},
					onFail : function (){
					}
				});
            }.bind2(this),
            textOk: "是",
            textCancel: "否",
            defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
            title: "提示",
            icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
        });
        
        
    }
};
