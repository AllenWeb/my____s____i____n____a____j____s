/**
 * @ author Liusong liusong@staff.sina.com.cn
 * @ 回复发布器
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("jobs/mod_login.js");
$import("sina/utils/io/ajax.js");
$import("diy/delDialog.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("jobs/mod_login.js");
$import("diy/getTextAreaHeight.js");

/**
 * 回复发布器
 * @param {Object} oElement 必选参数
 * @param {Object} oConfig  必选参数
 * @example 
 *  var oElement   = { 'submit' : $E("submit"), 'editor' : $E("editor"), 'info' : $E("info"), 'nick' : $E('nick') };
 *  var oConfig    = { 'limit' : 1000, 'normClass' : "btn1", 'disabledClass' : "btn2", 'postUrl':'/a.php' };
 *  var oPublisher = App.msgPublisher( oElement, oConfig );
 */

App.msgPublisher = function( oElement, oConfig, bRefresh, fCallBack ){

	oElement = oElement || {};
	//modify by chibin 2009-12-1
	//oConfig  = oConfig  || { 'limit':600, 'postUrl':'/message/addmsg.php', 'normClass':'mBlogBtn', 'disabledClass':'mBlogBtn2' };
	oConfig  = oConfig  || { 'limit':600, 'postUrl':'/message/addmsg.php', 'normClass':'btn_normal', 'disabledClass':'btn_notclick' };
	var msgPublisher = {};
	
	//限制用户输入字数
	
	msgPublisher.limit = (function(e,c){
		return function(){
			var snapText = e.editor.value;
			var snapLength = Core.String.byteLength(snapText);
			if( snapLength > c.limit ){
				e.editor.value = Core.String.leftB(snapText, c.limit);
			}
		};
	})( oElement, oConfig );
	
	//如果不用自动增高去掉下边这行
	App.autoHeightTextArea(oElement.editor, msgPublisher.limit, oConfig.maxHeight||null);

	//发送回复内容
	msgPublisher.submit = (function(e,c){
		return function(){
			try{
				if( !e.submit.lock ){
					e.submit.className = c.disabledClass || e.submit.className;
					e.submit.lock = true;
					var nick = Core.String.trim(e.nick.value)
					//昵称不能为空
					if( !nick || nick== $CLTMSG["CD0049"] ){
						e.submit.className = c.normClass || e.submit.className;
						e.submit.lock = false;
						e.info.innerHTML = $SYSMSG["M01100"];
						e.info.style.display = "";
						return;
					}
					//内容不能为空
					var content = Core.String.trim(e.editor.value);
					if( !content ){
						e.submit.className = c.normClass || e.submit.className;
						e.submit.lock = false;
						e.info.innerHTML = $SYSMSG["M07001"];
						e.info.style.display = "";
						return;
					}
					var oPost = {
						"content" : encodeURIComponent(content),
						"name"    : encodeURIComponent(nick)
					};
					Utils.Io.Ajax.request(c.postUrl,{
						"POST"        : oPost,
						"onComplete"  : function(oResult){
							e.submit.className = c.normClass || e.submit.className;
							e.submit.lock = false;
							if(oResult.code=="A00006"){
								if( fCallBack ){
									fCallBack();
								}
								if( bRefresh ){
									window.location.reload(true);
								}else{
									var al = App.alert($SYSMSG["M09003"],{'icon':3,hasBtn:false});
									setTimeout(function(){al.close();},1000);
								}
							}
							else if(oResult.code=="M00003"){
								App.ModLogin(function(){
									window.location.reload(true);
								});
							}
							else{
								e.info.innerHTML = $SYSMSG[oResult.code];
								e.info.style.display = "";
								//App.flyDialog( $SYSMSG[oResult.code], "alert", e.submit);
							}
						},
						"onException" : function(){
							e.submit.className = c.normClass || e.submit.className;
							e.submit.lock = false;
						},
						"returnType"  : "json"
					});
				}
			}catch(error){}
		};
	})( oElement, oConfig );
	
	//事件绑定
	//如果不需要自动增高,打开下边两行
	//Core.Events.addEvent( oElement.editor, msgPublisher.limit,  "keyup" );
	//Core.Events.addEvent( oElement.editor, msgPublisher.limit,  "blur" );
	if(oElement.editor){
		Core.Events.addEvent(oElement.editor,function(event){
			if((event.ctrlKey==true && event.keyCode=="13")||(event.altKey==true && event.keyCode=="83")){
				oElement.editor.blur();
				msgPublisher.submit();
			}
		},"keyup");
	}
	//绑定昵称输入
	if(oElement.nick){
		Core.Events.addEvent(oElement.nick,(function(n){
			return function(){
				if( n.value === $CLTMSG["CD0049"]){
					n.value = "";
				}
				n.style.color = "#333333";
			};
		})(oElement.nick),"focus");
		Core.Events.addEvent(oElement.nick,(function(n){
			return function(){
				if( Core.String.trim(n.value)==""){
					n.value = $CLTMSG["CD0049"];
				}
				n.style.color = "#999999";
			};
		})(oElement.nick),"blur");
		oElement.nick.value = oElement.nick.value || $CLTMSG["CD0049"];
		oElement.nick.style.color = "#999999";
	}
	//绑定发送按钮
	if(oElement.submit){
		Core.Events.addEvent( oElement.submit, msgPublisher.submit, "click" );
	}
	
	return msgPublisher;
	
};
