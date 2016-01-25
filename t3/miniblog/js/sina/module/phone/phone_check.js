/**
 * @fileoverview 绑定手机
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @created 2009-11-11
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/interface.js");
$import("sina/msg/phone_attention.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/utils/windowDialog.js");

/**
 * 绑定手机
 */
scope.PhoneCheck=Core.Class.create();
scope.PhoneCheck.prototype={
	//按纽是可用或是不可用状态
	buttonState:true,
	//服务条款是显示或隐藏
	copyrightState:"hidden",
	/**
	 * 初始化
	 */
	initialize:function(){
		this.attachEvent();
	},
	attachEvent:function(){
		Core.Events.addEvent("agree",this.swapButton.bind2(this));
		Core.Events.addEvent("iphoneservice",this.swapCopyright.bind2(this));
		Core.Events.addEvent("iphonecheck",this.add.bind2(this));
	},
	/**
	 * 添加手机订阅
	 */
	add:function(){
		if(!this.buttonState){
			return;
		}
		if($E("iphonenum").value=="" || $E("iphonecode").value==""){
			showError("B24006");
			return;
		}
		if(!this.addInterface){
			this.addInterface=new Interface("http://control.blog.sina.com.cn/admin/iphoneattention/check.php","jsload");	
		}
		checkAuthor();
        if (!$isLogin) {
            $login(this.request.bind2(this));
        }else{
			this.request();
		}
		
	},
	request:function(){
		var a="0";
		if($E("agree").checked){
			a="1";
		}
		this.addInterface.request({
			GET : {
				p:$E("iphonenum").value,
				c:$E("iphonecode").value,
				a:a
			},
			onSuccess : function (data) {
				//window.location.href=window.location.href;
				window.location.href="http://profile.blog.sina.com.cn/phone_attention.php?uid="+$UID;
			},
			onError : function (data) {
				showError(data.code);
			},
			onFail : function (){
			}
		});
	},
	/**
	 * 按钮的不可用状态和可用状态之间切换
	 */
	swapButton:function(){
		var ele=$E("iphonecheck").parentNode;
		var target=Core.Events.getEventTarget();
		if(target.checked){
	//		ele.parentNode.className="MoNcheck_lawBtn";
			ele.className="SG_aBtn SG_aBtnB SG_aBtn14";
			this.buttonState=true;
		}else{
		//	ele.parentNode.className="MoNcheck_lawBtn2";
			ele.className="SG_aBtn SG_aBtn14 SG_aBtn_dis";
			this.buttonState=false;
		}
		
	},
	/**
	 * 服务条款的显示和隐藏之间的切换
	 */
	swapCopyright:function(){
		var ele=$E("iphoneservice_content");
		if(this.copyrightState=="hidden"){
			ele.style.display="block";
			this.copyrightState="show"
		}else{
			ele.style.display="none";
			this.copyrightState="hidden"
		}
	}
};
