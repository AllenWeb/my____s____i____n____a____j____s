/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/trim.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/byteLength.js");

$import("diy/enter.js");
$import('diy/check.js');
$import("diy/prompttip.js");
$import("diy/checkForm.js");
$import("diy/mb_dialog.js");
$import('diy/htmltojson.js');
$import("diy/loginAction.js");
$import('diy/comparejson.js');
$import("diy/setPassword.js");
$import("diy/checkFormUI4.js");
$import("diy/TextareaUtils.js");
$import("diy/forbidrefresh_dialog.js");
$import("sina/core/string/leftB.js");
$import("jobs/cardtips.js");
$import("jobs/login.js");

(function(){
	App.getMsg = function(msgCode, replace){
		if (msgCode === undefined) {
			return "";
		}
		if(typeof(msgCode) == "object"){
			msgCode = msgCode.code;
		}
		var msg = $SYSMSG[msgCode] || $CLTMSG[msgCode] || ("Error[" + msgCode + "]");
		if (replace) {
			var tmp = new Utils.Template(msg);
			return tmp.evaluate(replace);
		}
		else {
			return msg;
		}
	};
	function setMask(z,hidden){
		var _mask1 = document.getElementsByTagName("BODY")[0].appendChild($C($IE?'iframe':'div'));
		var $w = window, $d = $w["document"], $e = $d["documentElement"]||{};
		with(_mask1.style){
			position = "absolute";
			backgroundColor = "#000";
			width = "100%";
			zIndex = parseInt(z) - 1;
			top = "0px";
			left = "0px";
		}
		Core.Dom.opacity(_mask1,15);
		_mask1.style.height = Math.max($e.clientHeight,$e.scrollHeight,$e.offsetHeight,$d.body.scrollHeight,$d.body.offsetHeight) + 'px';
		return _mask1;
	};
	function setMiddle(_node){
		var ow = _node.offsetWidth;
		var oh = _node.offsetHeight;
		
		var win_s = Core.System.winSize();
		var scroll_pos = Core.System.getScrollPos();
		var tx = (win_s.width - ow)/2;
		var ty = scroll_pos[0] + (win_s.height - oh)/2;
		_node.style["left"] = tx + 'px';
		_node.style["top"] = (ty < 20 ? 20 : ty) + 'px';
	};
	function iniRegForm(rnd){
		//获取页面元素
		var _box			= $E('mod_reg_information_box' + rnd);
		var _submit			= $E('mod_reg_submit' + rnd);
		var _username		= $E('mod_reg_username' + rnd);
		var _password		= $E("mod_reg_password" + rnd);
		var _password2		= $E("mod_reg_password2" + rnd);
		var _door			= $E('mod_reg_door' + rnd);
		var _after			= $E("mod_reg_after" + rnd);
		var _red_username	= $E('mod_red_reg_username' + rnd);
		var _red_password	= $E('mod_red_reg_password' + rnd);
		var _red_password2	= $E('mod_red_reg_password2' + rnd);
		var _red_door		= $E('mod_red_reg_door' + rnd);
		var _red_after		= $E("mod_red_reg_after" + rnd);
		
		
		//将全局的方法私有化
		var _addEvent		= Core.Events.addEvent;
		var _trim			= Core.String.trim;
		var _html2json		= App.htmlToJson;
		var _compjson		= App.compareJson;
		var _checkMail		= App.checkEml;
		var _alert			= App.alert;
		var _removeEvent	= Core.Events.removeEvent;
		
		//数据初始化
		var _oData = _html2json(_box);
		var popWin = null;
		
		//局部的函数
		var success = function(json){};
		var error = function(json){
			if (json) {
				if (!App.modCheckInfo.showError([json['code']])) {
					_alert($SYSMSG[json['code']]);
				}
			}
			else {
				_alert($SYSMSG[json['code']]);
			}
		};
		var errorInput = function(input,red,code){
			red.innerHTML = $SYSMSG[code];
			red.style.display = '';
		};
		
		var rightInput = function(input,red){
			red.style.display = 'none';
		};
		
		//checkForm
		var checkFunction = {
			'MR0001' : function(el){//邮箱查空
				el.value = _trim(el.value);
				if(el.value){
					return true;
				}else{
					return false;
				}
			},
			'MR0002' : function(el){//判断邮件是否正确
				if(App.modCheckInfo.check(['MR0001'])){
					if(_checkMail(el.value)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			},
			'MR0007' : function(el){//判断是新浪邮箱邮件
				if(!_trim(el.value).length){
					return true;
				}
				if(App.modCheckInfo.check(['MR0001','MR0002'])){
					if(/^.+@(sina\.com|vip\.sina\.com|sina\.cn|2008\.sina\.com|my3ia\.sina\.com)$/i.test(el.value)){
						return false;
					}else{
						return true;
					}
				}else{
					return true;
				}
			},
			'MR0005' : function(el){//判断是否已经注册
				el.ajaxCheck = '1' ;
				if(App.modCheckInfo.check(['MR0001','MR0002','MR0004'])){
					var _parm = {
						"username" : el.value
					};
					Utils.Io.Ajax.request('/reg/ami_check.php', {
						'POST'		: _parm,
						'onComplete': function(json){
							if(json.code == "A00006"){
								el.ajaxCheck = "1";
							} else {
								el.ajaxCheck = "0";
							}
							checkFunction['MR0006'](el);
							return true;
						},
						'onException': function(json){
							return false;
						},
						'returnType': 'json'
					});
					return true;
				}else{
					return true;
				}
			},
			'MR0006' : function(el){//为邮箱地址ajax验证做的单独方法
				if(el.ajaxCheck == "1"){
					App.modCheckInfo.hideError(['MR0006']);
					return true;
				} else if(el.ajaxCheck === undefined){
					App.modCheckInfo.hideError(['MR0006']);
					return true;
				} else {
					App.modCheckInfo.showError(['MR0006']);
	                                return false;
				}
			},
			'MR0014' : function(el){//密码只能是字母和数字
				el.value = _trim(el.value);
				if(App.modCheckInfo.check(['MR0011'])&&App.modCheckInfo.check(['MR0013'])){
					if(/^[0-9a-zA-z\._\-\?]{6,16}$/.test(el.value)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			},
			'MR0011' : function(el){//密码的字数限制小于6
				el.value = _trim(el.value);
				if(el.value.length < 6){
					return false;
				}else{
					return true;
				}
			},
			'MR0013' : function(el){//密码的字数限制最多16
	            el.value = _trim(el.value);
	            if(el.value.length > 16){
					return false;
	            }else{
	                return true;
	            }
	        },
			'MR0020' : function(el){//检查密码相同
				el.value = _trim(el.value);
				if(el.value == _trim(_password.value)){
					return true;
				}else{
					return false;
				}
			},
			'MR0050' : function(el){//验证码
				el.value = _trim(el.value);
				if(el.value.length > 0){
					return true;
				}else{
					return false;
				}
			},
			'MR0071' : function(el){//用户协议选择
				if(el.checked){
					return true;
				}
				return false;
			}
		};
		App.modCheckInfo = App.checkForm(App.checkFormUI4);
		
		//邮箱地址
		App.modCheckInfo.add('MR0001',_username,_red_username,checkFunction['MR0001']);
		App.modCheckInfo.add('MR0002',_username,_red_username,checkFunction['MR0002']);
		App.modCheckInfo.add('MR0007',_username,_red_username,checkFunction['MR0007']);
		App.modCheckInfo.add('MR0005',_username,_red_username,checkFunction['MR0005']);
		App.modCheckInfo.add('MR0006',_username,_red_username,checkFunction['MR0006']);
		//密码
		App.modCheckInfo.add('MR0014',_password, _red_password,checkFunction['MR0014']);
		App.modCheckInfo.add('MR0011',_password, _red_password,checkFunction['MR0011']);
		App.modCheckInfo.add('MR0013',_password, _red_password,checkFunction['MR0013']);
		//再次密码
		App.modCheckInfo.add('MR0020',_password2, _red_password2,checkFunction['MR0020']);
		//验证码
		App.modCheckInfo.add('MR0050',_door, _red_door,checkFunction['MR0050']);
		
		//用户许可协议
		App.modCheckInfo.add('MR0071',_after, _red_after,checkFunction['MR0071']);
		
		App.bindFormTips4([
			{'el' : _username, 'key' : 'MR0003','errorPos':_red_username},
			{'el' : _password, 'key' : 'MR0012','errorPos':_red_password},
			{'el' : _password2, 'key' : 'MR0021','errorPos':_red_password2}
		]);
		//全局的函数
		App.modRegisterMethod = {};
		//提交函数
		App.modRegisterMethod['submit'] = function(){
			if(App.modCheckInfo.check() && (_username.ajaxCheck == "1")){
				setTimeout(function(){
					App.modRegisterMethod['rumor'](success,error);
				},500);
			}
			return false;
		};
		
		var _isNewCheckcode = false; //说明页面现在进入出现重复验证码状态
		
		App.modRegisterMethod['rumor'] = function(success,error){	
			if(typeof success != 'function'){
				throw('The publishRumor need a function as thrid parameter');
			}
			
			if(typeof error != 'function'){
				throw('The publishRumor need a function as fourth parameter');
			}
			
			var parameters = _html2json(_box);
			parameters.token = scope.$token;
			parameters.retcode = scope.doorretcode||"";
			parameters.r = window.location.href;
			parameters.regsrc = 4;
			scope.doorretcode = "";
			if(_compjson(parameters,_oData)){
				success();
			}else{
				Utils.Io.Ajax.request('/reg/reg.php', {
					'POST'		: parameters,
					'onComplete': function(json){
						if(json.code == 'A00006'){
							success(json.data);
							oData = parameters;
							if(json.data){
								window.location.replace(json.data);
							}
						}else if(json.code == 'M00004'){
							_alert({code:'R01438'});
						}else if(json.code == "MR0050"){
							App.forbidrefresh(function(){
								Core.Events.fireEvent(_submit, 'click');
							},'/reg/reg.php');
							return;
						}else if(json.code == "R01409"){
							_red_door.innerHTML = '<span class="iswhat iserro"><img class="tipicon tip2" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title="" /><em>'+$SYSMSG[json['code']]+'</em></span>';
							App.TextareaUtils.setCursor(_door);
							App.modRefreshCheckCode();
						}else{
							error(json);
							
						}
						_submit.className = 'btnlogin1';
					},
					'onException': function(json){
						_addEvent(_submit, App.modRegisterMethod['submit'], 'click');
						error(json);
						_submit.className = 'btnlogin1';
					},
					'returnType': 'json'
				});
				_submit.className = 'btnlogin1 btnlogin1_load';
			}
			
		};
		_addEvent(_submit, App.modRegisterMethod['submit'], 'click');
		//绑定回车提交
		App.enterSubmit({
			parent : _box,
			action : function(){
				Core.Events.fireEvent(_submit, 'click');
			}
		});
		passcardOBJ.init(
			_username,
			{
				overfcolor: "#999",
				overbgcolor: "#e8f4fc",
				outfcolor: "#000000",
				outbgcolor: ""
			},
			_password,
			window
		);
	};
	function iniLoginForm(rnd,cb){
		var login_submit = $E("mod_login_submit" + rnd);
		var login_tip    = $E("mod_login_tip" + rnd);
		var loginname    = $E("mod_loginname" + rnd);
		var password     = $E("mod_password" + rnd);
		var isremember	 = $E("mod_isremember" + rnd);
		
		
		var disableClass = "btn_notclick";
		var enableClass  = "btn_normal";
		
		var options = {
			zIndex:1010,
			ref:loginname,
			wrap:login_tip,
			offsetX:0,
			offsetY:1
		};	
		if(!$IE){
			options.offsetY = 10;
		}
		//初始化用户名输入
		App.initLoginInput(loginname);
		
		if(cb && cb.initErrorTip){//如果传入初始化错误提示
			App.fixElement.setHTML(cb.initErrorTip,"",options);	
		}
		
		function checkForm(el,errStr){
			if(!Core.String.trim(el.value) || (el.value == el.title && el.title)){
			    var oPassword = $E("mod_password_text" + rnd);
			    if(oPassword && oPassword.style && oPassword.style.display !== "none"){
			        oPassword.focus();
			    }
				App.fixElement.setHTML(errStr,"",options);			
				return false;			 
			}else{
				App.fixElement.hidden();
			}
			return true;
		}
		login_submit.onclick = function(){
			if(login_submit.className == disableClass){
				return false;
			}
			login_submit.className = enableClass;		
			if(!checkForm(loginname,App.getMsg({code:"M00901"}))){
				return false;
			}
			if(!checkForm(password,App.getMsg({code:"M00902"}))){
				return false;
			}
			App.LoginAction({
				name:loginname.value,
				pwd :password.value,
				remb:isremember.checked,
				error:function(reason,errno){
					var msg = "";
					if(errno == "4010"){					
						reason = App.getMsg({code:'R01011'});
						msg = App.getMsg("R01010", {mail:loginname.value});
					}else{											
						if(errno == "101" || errno == "5"){
							msg = App.getMsg({code:"R11111"});
						}
					}
					App.fixElement.setHTML(reason,'',options);						
				},
				succ:function(){
					App.modRegisterOrLoginClose();
					if(cb){
						scope.$uid = "123456";
						cb.func(cb.param);
					}else{
						location.reload();
					}
				}
			}); 		
		}
		//回车提交
		App.enterSubmit({
			parent : password.parentNode,
			action : function(){
				login_submit.onclick();
			}
		});
		/**
		 * 登录层下来框
		 */
		passcardOBJ.init(
			loginname,
			{
				overfcolor: "#999",
				overbgcolor: "#e8f4fc",
				outfcolor: "#000000",
				outbgcolor: ""
			},
			$E("mod_password_text" + rnd),
			window
		);
	};
	App.modRegisterAndLogin = function(showType,titleKey ,callBackFunction,loginInfoKey){
		
		//add by dimu 开发者平台跳到注册
		var regurl = /open\.t\.sina/.test(location.href) ? 'http://t.sina.com.cn/reg.php' : "/reg.php";
		
		//add by haidong 国际化
		regurl += "?lang="+scope.$lang;
		var recoverurl = "http://login.sina.com.cn/cgi/getpwd/getpwd0.php?entry=sso";
		
		var regTitle = $CLTMSG['CY0124'];
		var loginTitle = titleKey ? $CLTMSG[titleKey] : false;
		if(titleKey == 'CY0130'){
			loginTitle = loginTitle.replace('\{name\}',Core.String.byteLength(scope.realname) > 10?(Core.String.leftB(scope.realname,10)+'...'):scope.realname).replace('\{titlename\}',scope.realname);
		}
		var loginInfo = $CLTMSG[loginInfoKey] || $CLTMSG['CY0121'];
		
		
		var rnd = (new Date()).getTime();
		var html = '<table class="mBlogLayer">\
					<tr>\
						<td class="top_l"></td>\
						<td class="top_c"></td>\
						<td class="top_r"></td>\
					</tr>\
					<tr>\
						<td class="mid_l"></td>\
						<td class="mid_c">\
					<div class="layerBox">\
					<div class="layerBoxCon" style=" width:530px;">\
					<div class="layerSmartlogin">\
						<div class="layerMedia_close"><a href="javascript:void(0);" onclick="App.modRegisterOrLoginClose()" class="close"></a></div>\
						<div class="yellowBg" id="mod_reg_login_yellow' + rnd + '"></div>\
						<div class="infoForm" id="mod_reg_information_box'+ rnd + '">\
							<div class="infoReg">\
								<table class="tab2">\
                                <tr>\
                                	<th><span>' + $CLTMSG['CY0116'] + '：</span></th>\
                                	<td class="td1"><input type="text" class="inp" id="mod_reg_username' + rnd + '" name="username" /></td>\
                                	<td id="mod_red_reg_username' + rnd + '"><a href="http://t.sina.com.cn/reg_sinamail.php?lang=zh-cn" target="_blank">我没有邮箱</a></td>\
                                </tr>\
                                <tr>\
                                	<th><span>' + $CLTMSG['CY0117'] + '：</span></th>\
                                	<td class="td1">\
										<input type="password" class="inp" id="mod_reg_password' + rnd + '" name="password" />\
									</td>\
                                	<td id="mod_red_reg_password' + rnd + '"></td>\
                                </tr>\
                                <tr>\
                                	<th><span>' + $CLTMSG['CY0118'] + '：</span></th>\
                                	<td class="td1">\
										<input type="password" class="inp" id="mod_reg_password2' + rnd + '" name="password2" />\
									</td>\
                                	<td id="mod_red_reg_password2' + rnd + '"></td>\
                                </tr>\
                                <tr>\
                                	<th><span>' + $CLTMSG['CY0119'] + '：</span></th>\
                                	<td class="td1">\
										<input type="text" class="inp w1" id="mod_reg_door' + rnd +'" name="basedoor" style="width:40px" />\
										<img width="90" height="31" align="absmiddle" src="/pincode/pin1.php?r=1275025963678&amp;lang=zh" style="margin:5px 0;" id="mod_reg_check_img" />\
										<a href="javascript:void(0);" onclick="App.modRefreshCheckCode()">' + $CLTMSG['CY0120'] + '</a>\
									</td>\
                                	<td id="mod_red_reg_door' + rnd + '"></td>\
                                </tr>\
								<tr>\
                                	<th>&nbsp;</th>\
                                    <td class="td1"><div class="lf"><input type="checkbox" id="mod_reg_after' + rnd +'" class="labelbox" checked="checked" name="after" value="1" /><label for="chbb">' + $CLTMSG['CY0129'] + '</label></div></td>\
                                	<td id="mod_red_reg_after' + rnd + '"></td>\
								</tr>\
                                <tr>\
                                	<th>&nbsp;</th>\
                                	<td class="td1"><a href="javascript:void(0);" class="btnlogin1" id="mod_reg_submit' + rnd + '"></a></td>\
                                	<td>&nbsp;</td>\
                                </tr>\
								</table>\
							</div>\
							<div class="clearit"></div>\
						</div>\
						<div class="infoForm" id="mod_reg_login_box'+ rnd + '">\
							<div class="infoLeft">\
								<table class="tab1">\
								<caption>' + loginInfo + '</caption>\
								<tr>\
									<th id="mod_login_tip' + rnd + '" scope="row"></th>\
									<td></td>\
					            </tr>\
								<tr>\
									<td><input type="text" class="inp" id="mod_loginname' + rnd + '" /></td>\
								</tr>\
								<tr>\
									<td><input type="text" style="color:#999;display:none;" class="inp" id="mod_password_text' + rnd + '" /><input type="password" class="inp" id="mod_password' + rnd + '" /></td>\
								</tr>\
								<tr>\
									<th>\
										<a href="javascript:void(0);" class="btn_normal" id="mod_login_submit' + rnd + '"><em>' + $CLTMSG['CD0134'] + '</em></a>\
										<input type="checkbox" id="mod_isremember' + rnd + '" class="chkb" checked="checked" /><label for="mod_isremember' + rnd + '">' + $CLTMSG['CY0123'] + '</label>\
									</th>\
								</tr>\
								</table>\
							</div>\
							<div class="infoRight">\
								<p class="p1">' + $CLTMSG['CY0122'] + '</p>\
								<p class="p2"><a href="javascript:void(0);" class="btnlogin1" onclick="App.modRunToRegisterOrLogin(\'register\');"></a></p>\
							</div>\
							<div class="clearit"></div>\
						</div>\
					</div>\
					</div>\
					</div>\
					</td>\
					<td class="mid_r"></td>\
					</tr>\
					<tr>\
					<td class="bottom_l"></td>\
					<td class="bottom_c"></td>\
					<td class="bottom_r"></td>\
					</tr>\
					</table>';
		var box = $C('DIV');
		box.innerHTML = html;
		box.style.position = 'absolute';
		box.style.zIndex = 1600;
		box.style.width = '540px';
		
		document.body.appendChild(box);
		iniRegForm(rnd,callBackFunction);
		iniLoginForm(rnd,callBackFunction);
		
		var cachePassCardStatus = passcardOBJ.menuStatus;
		App.modRunToRegisterOrLogin = function(type){
			if(type === 'login'){
				$E('mod_reg_login_box'+ rnd).style.display = '';
				$E('mod_reg_information_box'+ rnd).style.display = 'none';
				if(loginTitle){
					$E('mod_reg_login_yellow' + rnd).innerHTML = loginTitle;
					$E('mod_reg_login_yellow' + rnd).style.display = '';
				}else{
					$E('mod_reg_login_yellow' + rnd).style.display = 'none';
				}
				passcardOBJ.menuStatus = {
					"sina.cn": true,
					// 是否显示Sina邮箱
					"sina.com": true,
					// 是否显示VIP邮箱 
					"vip.sina.com": true,
					"163.com" : true,			
					"qq.com" : true,
					"126.com" : true,
					"hotmail.com" : true,
					"gmail.com" : true,
					"sohu.com" : true
				};
			}else if(type === 'register'){
				$E('mod_reg_login_box'+ rnd).style.display = 'none';
				$E('mod_reg_information_box'+ rnd).style.display = '';
				$E('mod_reg_login_yellow' + rnd).innerHTML = regTitle;
				$E('mod_reg_login_yellow' + rnd).style.display = '';
				passcardOBJ.menuStatus = {
					"163.com" : true,			
					"qq.com" : true,
					"126.com" : true,
					"hotmail.com" : true,
					"gmail.com" : true,
					"sohu.com" : true
				};
				try{
					GB_SUDA._S_uaTrack('tblog_reg','layer_reg');
				}catch(ex){
					
				}
			}
		};
		App.setPassword('mod_password' + rnd, 'mod_password_text' + rnd);
		App.modRegisterOrLoginClose = function(){
			document.body.removeChild(box);
			document.body.removeChild(mask);
			passcardOBJ.menuStatus = cachePassCardStatus;
			App.modRunToRegisterOrLogin = false;
		};
		App.modRunToRegisterOrLogin(showType);
		setMiddle(box);
		var mask = setMask(600);
		try{
			GB_SUDA._S_uaTrack('tblog_reg','layer_login');
		}catch(exp){}
		return box;
	};
	App.modRefreshCheckCode = function(){
		setTimeout(function(){
			$E("mod_reg_check_img").src = '/pincode/pin1.php?r=' + ((new Date()).getTime()) +"&lang="+scope.$lang;
			$E("mod_reg_check_img").style.display = "";
		},10);
	};
})();

