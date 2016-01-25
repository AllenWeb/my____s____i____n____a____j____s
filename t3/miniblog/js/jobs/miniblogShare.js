$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/fireEvent.js");
//$import("msg/msg.js");
$import("diy/iframeMask.js");
$import("sina/utils/url.js");
/**
 * miniblog widget
 * @author Liusong liusong@staff.sina.com.cn
 */

$registJob( "miniblog_share", function(){
	(function(w,d){var dw,dh,de = d.documentElement;dw = (de && de.clientWidth)?de.clientWidth:d.body.clientWidth;dh=(de && de.clientWidth)?de.clientHeight:d.body.clientHeight;
	if((dw<620||dh<450) && !/iPhone|iPad|iPod/i.test(navigator.userAgent)){window.resizeTo(620,450)}})(window,document);
	var _allow;
	var p = {
		submit   : $E("publisher_submit"),
		content  : $E("publish_editor"),
		limitTip : $E("limitTip"),
		errorInfo: $E("errorInfo")
	};
	
	var allow = function(b){
		if(!b){
			p.submit.removeAttribute("href");
		}else{
			p.submit.setAttribute("href","javascript:;")
		}
		_allow = b;
	}
	
	if(p.errorInfo){
		p.errorInfo.style["display"] = "none";
	}
	
	if(p.submit && p.content){
		allow(false);
		Core.Events.addEvent( p.submit,function(){
			if(!_allow){return}
			var content = Core.String.trim( p.content.value );
			var waitIcon;
				if(!$E("waitIcon")){
					waitIcon = $C("div");
					waitIcon.innerHTML = '<img src="'+scope.$BASEIMG+'style/images/common/loading.gif"/>';
					waitIcon.style.visibility = "hidden";
					waitIcon.style.position = "absolute";
					waitIcon.style.zIndex = 800;
					waitIcon.id = "waitIcon";
					document.body.appendChild(waitIcon);
				}
				waitIcon = $E("waitIcon");
			var rePos = (function(wi){
				return function(aPos){
					wi.style.left = (aPos[2] - wi.offsetWidth)/2+"px";
					wi.style.top  = (aPos[3] - wi.offsetHeight)/2+"px";
				};
			})(waitIcon);
			var contentMask = App.iframeMask(799,rePos);
			var obj = new Utils.Url(window.location.href);
			//obj.query
				if( content ){
					if(!scope.$uid){
						App.login();
						return false;
					}
					else{
						allow(false);
						waitIcon.style.visibility = "visible";
						contentMask.show();
						var params = {
							'content'   : content,
							'styleid'   : 1,
							'form'      : scope['$pageid'],
							'share_pic' : $E("share_pic").value,
							'sourceUrl'	: scope.source ? decodeURIComponent(obj.query["sourceUrl"]) : "",
							'source'	: scope.source ? scope.source : $CLTMSG["CD0022"]
						};
						if(obj && obj.query && obj.query.appkey){
							params["appkey"] = obj.query.appkey;
						}
						Utils.Io.Ajax.request('/mblog/publish.php', {
							'POST'	: params,
							'onComplete': function(json){
								if(json.code == 'A00006'){
									setTimeout(function(){
										window.location.href = "/share/ok.php";
									}, 800);
									
								}else{
									waitIcon.style.visibility = "hidden";
									contentMask.hidden();
									if(json.code=="M00003"){
										window.location.href = "/widget/login.php";
										return false;
									}else{
										p.errorInfo.style.display = "";
										p.errorInfo.innerHTML = $SYSMSG[json["code"]];
									}
								}
								allow(true);
							},
							'onException': function(){
								//error();
							},
							'returnType': 'json'
						});
					}
					
				}
			return false;
		},"click");
		
		var listener = (function(c,b,t){
			return function(){
				var sLength = 280;
				var value = Core.String.trim(c.value);
				var snapLength = Core.String.byteLength(value);
				if( snapLength > sLength || snapLength == 0){
					var txt = "";
					if(snapLength>0){
						txt = $CLTMSG['CD0020'].replace(/#\{len\}/,Math.ceil(( snapLength - sLength )/2));
					}else{
						txt = $CLTMSG['CD0021'].replace(/#\{len\}/,sLength/2);
					}
					t.innerHTML = txt;
					allow(false);
				}else{
					t.innerHTML = $CLTMSG['CD0021'].replace(/#\{len\}/,Math.ceil((sLength - snapLength)/2));
					allow(true);
				}
			}
		})(p.content, p.submit, p.limitTip);
		
		Core.Events.addEvent(p.content, listener, "focus");
		Core.Events.addEvent(p.content, listener, "blur");
		Core.Events.addEvent(p.content, listener, "keyup");
		
		Core.Events.addEvent(p.content,function(event){
			if((event.ctrlKey==true && event.keyCode=="13")||(event.altKey==true && event.keyCode=="83")){
				p.submit.blur();
				Core.Events.fireEvent(p.submit,"click");
			}
		},"keyup");
		
		p.content.focus();
		//if($MOZ){
		//	var range = p.content.setSelectionRange(0,0);
		//}
		if($IE){
			var oSelector = p.content.createTextRange();
			oSelector.moveStart('character',p.content.value.length);
			oSelector.select(); 
		}
	}
	
});
