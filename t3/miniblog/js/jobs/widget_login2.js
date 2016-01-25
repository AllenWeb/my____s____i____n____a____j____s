/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("jobs/base.js");
$import("diy/enter.js");
$import("sina/core/events/fireEvent.js");
$import("sina/utils/url.js");
$import("jobs/fixelement.js");
$import("diy/url.js");
$import("diy/querytojson.js");

$registJob("login",function(){
	if(scope.islogin=="1"){
		window.opener.location.reload();
		setTimeout(function(){
			window.close();
		},10);
		return false;
	}
	var submit = $E("login_submit_btn");
	var loginname	= $E("loginname");
	var password	= $E("password");
	var login_tip	= $E("errortip");
	var remusrname	= $E("remusrname");
	var login_form	= $E("login_form");
	
	var url = '/'
	var redirect = '/';
	url = (App.parseUrl(location.href)).query;
	if(url){
		redirect = App.queryToJson(url,true)['url'];
	}
	
	//初始化用户名输入
	App.initLoginInput(loginname);
	
	var options = {
		zIndex:1010,
		ref:loginname,		
		offsetY:1,
		offsetX:1
	};	
	function checkForm(el,errStr){
		if(!Core.String.trim(el.value) || (el.value == el.title && el.title)){
			el.focus();			
			App.fixElement.setHTML(errStr,"",options);			
			return false;			 
		}else{
			App.fixElement.hidden();
		}
		return true;
	}	
	
	function cb(result){
		if(result.result){									
			if(scope.$pageid === "new_widget_topic"){
				return window.location.reload();
			}
			if(scope.$pageid === "widget_topic_newwidth"){
				return window.parent.location.reload();
			}
			if(redirect!="/"){
				window.location.href = redirect;
			}else{
				window.opener.location.reload();
				setTimeout(function(){
					window.close();
				},20);
			}
		}else{
			var msg = "";
			var errno = result.errno;
			if(errno == "101" || errno == "5"){
				msg = App.getMsg({code:"R11111"});
			}
			App.fixElement.setHTML(result.reason,msg,{ref:loginname,offsetX:1,offsetY:1});
//			login_tip.style.display = "";
//			login_tip.innerHTML     = result.reason;
		}
	}
		
	Core.Events.addEvent(submit,function(event){
		if(!checkForm(loginname,App.getMsg({code:"M00901"}))){
			return false;		
		}
		if(!checkForm(password,App.getMsg({code:"M00902"}))){
			return false;
		}else{
			App.loginAction(
				loginname.value,
				password.value,
				$E("remusrname").checked,
				cb
			); 		
		}
		Core.Events.stopEvent(event);		
	},"click");
	
	//给form绑定键盘回车提交
	if(login_form){
		App.enterSubmit({
			parent : $E("password").parentNode,
			action : function(){
				Core.Events.fireEvent("login_submit_btn", 'click');
			}
		});
	}
	
	passcardOBJ.init(
	loginname,
	{
		overfcolor: "#999",
		overbgcolor: "#e8f4fc",
		outfcolor: "#000000",
		outbgcolor: ""
	},
	password,
	window);
	
});



App.loginAction = function(name,pwd,checked,loginCb){
	if(typeof(sinaSSOController) != "undefined"){
		sinaSSOController.feedBackUrl = "http://v.t.sina.com.cn/ajaxlogin.php";
		sinaSSOController.customLoginCallBack = loginCb.bind2(sinaSSOController);
		sinaSSOController.login(name,pwd,checked);
	}
};