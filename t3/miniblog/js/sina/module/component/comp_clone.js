/**
 * 组件克隆功能
 * 处理流程：
 * 	1、如果用户未登录，则提示用户登录——登录后，调用克隆接口
 * 	2、如果用户有该组件，提示无需克隆；如果该组件无法克隆，提示无法克隆；如果成功，跳到访客首页
 * @author L.Ming 2008.02.21
 * 
 * @modified L.Ming 2008.04.16
 * 对火炬手组件，增加更多请求参数的兼容，请求格式：
	$CloneComp(15,{
		tc_id : "xxx",
		ti_id : "xxx"
	});
 * 请求时候会把第二参数的对象转换成字符串格式，追加在克隆接口的参数中，这里是 &tc_id=xxx&ti_id=xxx，完整的调用如下：
 	http://control.blog.sina.com.cn/admin/clone/clone_module.php?uid=11111&suid=11111&module=15&tc_id=xxx&ti_id=xxx&requestId=11111111111111
 */
/**
 * 判断用户是否登录，如果已登录直接调用克隆接口；如果未登录，提示登录，在登录后调用接口
 * 
 */
$import("sina/module/interface/interface_comps_clone.js");
$import("sina/module/floatmenu.js");
$import('sina/utils/windowDialog.js');
$import('sina/msg/compsMSG.js');
$import('sina/msg/compCloneMSG.js');
$import('sina/msg/systemMSG.js');
$CloneComp=function(num){
	checkAuthor();
	if(!$isLogin){
		$login(function(){ /*cloneHandle(num);*/scope.CloneStart(num); });
	}
	else{
		scope.CloneStart(num);
	}
};

scope.CloneStart = function(num,tid){
	checkAuthor();
		var parm={productid:scope.p_key,suid:scope.$uid,uid:$UID,moduleid:num};
		scope.Inter_comps_clone.request({
			GET : parm,
			onSuccess: function(_data){
				$Debug("success:"+_data);
				windowDialog.alert($SYSMSG["A02006"], {icon:"01", funcOk: function(){
						window.open("http://blog.sina.com.cn/u/" + $UID, "_blank", "");
				}});
			},
			onError : function (_data) {
				$Debug("error:"+_data.code);
				switch (_data.code) {
					case "A02003":
						windowDialog.alert($SYSMSG["02003"], {
							icon: "03"
						});
						break;
					case "A02004":
						windowDialog.alert($SYSMSG["02004"], {
							icon: "03"
						});
						break;
					case "A00003":
						windowDialog.confirm($SYSMSG["02005"].replace("#UID", $UID), {
							funcOk: function(){
								window.open('http://blog.sina.com.cn/u/' + $UID, "_blank", "");
							},
							textOk: "升级",
							textCancel: "关闭",
							icon: "03"
						});
						break;
					default:
						showError(_data.code);
						break;
				}
			},
			onFail : function () {
			}
		});
};
