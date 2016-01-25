/**
 * 这个代码用来给超快速注册页面使用
 */
//$import("msg/msg.js");
$import('diy/htmltojson.js');
$import('diy/comparejson.js');
$import('diy/check.js');
$import("diy/prompttip.js");
$import("diy/checkForm.js");
$import("diy/checkFormUI_unlogin.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("jobs/cardtips.js");
$import("jobs/mod_login.js");
$import("jobs/login.js");
$import("diy/enter.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/TextareaUtils.js");
$import("diy/copy.js");

//更新验证码
App.refreshCheckCode = function(){
    if(!$E("check_img")) return false;
    setTimeout(function(){
        $E("check_img").src = '/pincode/pin1.php?r=' + ((new Date()).getTime()) + "&lang=" + scope.$lang;
        $E("check_img").style.display = "";
    }, 10);
};

$registJob('information_unlogin', function(){
	try {
		//获取页面元素
		var _box = $E('information_box');
		var _submit = $E('reg_submit');
		var _username = $E('reg_username');
		var _password = $E("reg_password");
		var _password2 = $E("reg_password2");
		var _door = $E('door');
		var _after = $E("reg_after");
		var _red_username = $E('red_reg_username');
		var _red_password = $E('red_reg_password');
		var _red_password2 = $E('red_reg_password2');
		var _red_door = $E('red_door');
		var _red_after = $E("red_reg_after");
		
		
		//将全局的方法私有化
		var _addEvent = Core.Events.addEvent;
		var _trim = Core.String.trim;
		var _html2json = App.htmlToJson;
		var _compjson = App.compareJson;
		var _checkMail = App.checkEml;
		var _alert = App.alert;
		var _removeEvent = Core.Events.removeEvent;
		
		//数据初始化
		var _oData = _html2json(_box);
		var popWin = null;
		
		//局部的函数
		var success = function(json){
		};
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
		var errorInput = function(input, red, code){
			red.innerHTML = $SYSMSG[code];
			red.style.display = '';
		};
		
		var rightInput = function(input, red){
			red.style.display = 'none';
		};
		
		//checkForm
		var checkFunction = {
			'MR0001': function(el){//邮箱查空
				el.value = _trim(el.value);
				if (el.value) {
					return true;
				}
				else {
					return false;
				}
			},
			'MR0002': function(el){//判断邮件是否正确
				if (App.modCheckInfo.check(['MR0001'])) {
					if (_checkMail(el.value)) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			},
			'MR0007': function(el){//判断是新浪邮箱邮件
				if (!_trim(el.value).length) {
					return true;
				}
				if (App.modCheckInfo.check(['MR0001', 'MR0002'])) {
					if (/^.+@(sina\.com|vip\.sina\.com|sina\.cn|2008\.sina\.com|my3ia\.sina\.com)$/i.test(el.value)) {
						return false;
					}
					else {
						return true;
					}
				}
				else {
					return true;
				}
			},
			'MR0005': function(el){//判断是否已经注册
				el.ajaxCheck = '1';
				if (App.modCheckInfo.check(['MR0001', 'MR0002', 'MR0004'])) {
					var _parm = {
						"username": el.value
					};
					Utils.Io.Ajax.request('/reg/ami_check.php', {
						'POST': _parm,
						'onComplete': function(json){
							if (json.code == "A00006") {
								el.ajaxCheck = "1";
							}
							else {
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
				}
				else {
					return true;
				}
			},
			'MR0006': function(el){//为邮箱地址ajax验证做的单独方法
				if (el.ajaxCheck == "1") {
					App.modCheckInfo.hideError(['MR0006']);
					return true;
				}
				else 
					if (el.ajaxCheck === undefined) {
						App.modCheckInfo.hideError(['MR0006']);
						return true;
					}
					else {
						App.modCheckInfo.showError(['MR0006']);
						return false;
					}
			},
			'MR0014': function(el){//密码只能是字母和数字
				el.value = _trim(el.value);
				if (App.modCheckInfo.check(['MR0011']) && App.modCheckInfo.check(['MR0013'])) {
					if (/^[0-9a-zA-z\._\-\?]{6,16}$/.test(el.value)) {
						return true;
					}
					else {
						return false;
					}
				}
				else {
					return true;
				}
			},
			'MR0011': function(el){//密码的字数限制小于6
				el.value = _trim(el.value);
				if (el.value.length < 6) {
					return false;
				}
				else {
					return true;
				}
			},
			'MR0013': function(el){//密码的字数限制最多16
				el.value = _trim(el.value);
				if (el.value.length > 16) {
					return false;
				}
				else {
					return true;
				}
			},
			'MR0020': function(el){//检查密码相同
				el.value = _trim(el.value);
				if (el.value == _trim(_password.value)) {
					return true;
				}
				else {
					return false;
				}
			},
			'MR0050': function(el){//验证码
				el.value = _trim(el.value);
				if (el.value.length > 0) {
					return true;
				}
				else {
					return false;
				}
			},
			'MR0071': function(el){//用户协议选择
				if (el.checked) {
					return true;
				}
				return false;
			}
		};
		//App.modCheckInfo = App.checkForm(App.checkFormUI_unlogin);
		App.modCheckInfo = (function(UIF){
			var that = {};
			var list = [];
			that.add = function(key,act,err,fun){
				list.push({
					'key' : key,
					'act' : act,
					'err' : err,
					'fun' : fun
				});
			};
			that.check = function(l){
				var ret = true;
				if(l){
					for(var j = 0, len2 = l.length; j < len2; j += 1){
						for(var i = 0, len = list.length; i < len; i += 1){
							if(list[i]['key'] == l[j]){
								if(list[i]['fun'](list[i]['act'])){
									UIF(list[i]['key'],true,list[i]['act'],list[i]['err']);
								}else{
									UIF(list[i]['key'],false,list[i]['act'],list[i]['err']);
									ret = false;
								}
								break;
							}
						}
					}
				}else{
					for(var i = 0, len = list.length; i < len; i += 1){
						if(list[i]['fun'](list[i]['act'])){
							UIF(list[i]['key'],true,list[i]['act'],list[i]['err']);
						}else{
							UIF(list[i]['key'],false,list[i]['act'],list[i]['err']);
							ret = false;
						}
					}
				}
				return ret;
			};
			that.showError = function(l){
				for(var j = 0, len2 = l.length; j < len2; j += 1){
					for(var i = 0, len = list.length; i < len; i += 1){
						if(list[i]['key'] == l[j]){
							UIF(list[i]['key'],false,list[i]['act'],list[i]['err']);
							break;
						}
					}
				}
			};
			that.hideError = function(l){
				for(var j = 0, len2 = l.length; j < len2; j += 1){
					for(var i = 0, len = list.length; i < len; i += 1){
						if(list[i]['key'] == l[j]){
							UIF(list[i]['key'],true,list[i]['act'],list[i]['err']);
							break;
						}
					}
				}
			}
			return that;
			
		})(App.checkFormUI_unlogin);
		//邮箱地址
		App.modCheckInfo.add('MR0001', _username, _red_username, checkFunction['MR0001']);
		App.modCheckInfo.add('MR0002', _username, _red_username, checkFunction['MR0002']);
		App.modCheckInfo.add('MR0007', _username, _red_username, checkFunction['MR0007']);
		App.modCheckInfo.add('MR0005', _username, _red_username, checkFunction['MR0005']);
		App.modCheckInfo.add('MR0006', _username, _red_username, checkFunction['MR0006']);
		//密码
		App.modCheckInfo.add('MR0014', _password, _red_password, checkFunction['MR0014']);
		App.modCheckInfo.add('MR0011', _password, _red_password, checkFunction['MR0011']);
		App.modCheckInfo.add('MR0013', _password, _red_password, checkFunction['MR0013']);
		//再次密码
		App.modCheckInfo.add('MR0020', _password2, _red_password2, checkFunction['MR0020']);
		//验证码
		App.modCheckInfo.add('MR0050', _door, _red_door, checkFunction['MR0050']);
		
		//用户许可协议
		App.modCheckInfo.add('MR0071', _after, _red_after, checkFunction['MR0071']);
		
		App.bindFormTips_unlogin([{
			'el': _username,
			'key': 'MR0003',
			'errorPos': _red_username
		}, {
			'el': _password,
			'key': 'MR0012',
			'errorPos': _red_password
		}, {
			'el': _password2,
			'key': 'MR0021',
			'errorPos': _red_password2
		}]);
		//全局的函数
		App.modRegisterMethodUnlogin = {};
		//提交函数
		App.modRegisterMethodUnlogin['submit'] = function(){
			if (App.modCheckInfo.check() && (_username.ajaxCheck == "1")) {
				setTimeout(function(){
					App.modRegisterMethodUnlogin['rumor'](success, error);
				}, 500);
			}
			
			return false;
		};
		
		var _isNewCheckcode = false; //说明页面现在进入出现重复验证码状态
		App.modRegisterMethodUnlogin['rumor'] = function(success, error){
			if (typeof success != 'function') {
				throw ('The publishRumor need a function as thrid parameter');
			}
			
			if (typeof error != 'function') {
				throw ('The publishRumor need a function as fourth parameter');
			}
			
			var parameters = _html2json(_box);
			parameters.token = scope.$token;
			parameters.retcode = scope.doorretcode || "";
			parameters.r = window.location.href;
			scope.doorretcode = "";
			if (_compjson(parameters, _oData)) {
				success();
			}
			else {
				Utils.Io.Ajax.request('/reg/reg.php', {
					'POST': parameters,
					'onComplete': function(json){
						if (json.code == 'A00006') {
							success(json.data);
							oData = parameters;
							if (json.data) {
								window.location.replace(json.data);
							}
						}
						else 
							if (json.code == 'M00004') {
								_alert({
									code: 'R01438'
								});
							}
							else 
								if (json.code == "MR0050") {
									App.forbidrefresh(function(){
										Core.Events.fireEvent(_submit, 'click');
									}, '/reg/reg.php');
									return;
								}
								else 
									if (json.code == "R01409") {
										_red_door.className = 'iswhat iserro';
										_red_door.innerHTML = '<img class="tipicon tip2" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title="" /><em>' + $SYSMSG[json['code']] + '</em>';
										App.refreshCheckCode();
										App.TextareaUtils.setCursor(_door);
									}
									else {
										error(json);
										
									}
						_submit.className = 'quickBtnReq';
					},
					'onException': function(json){
						_addEvent(_submit, App.modRegisterMethodUnlogin['submit'], 'click');
						error(json);
						_submit.className = 'quickBtnReq';
					},
					'returnType': 'json'
				});
				_submit.className = 'quickBtnReq quickBtnReq_load';
			}
			
		};
		_addEvent(_submit, App.modRegisterMethodUnlogin['submit'], 'click');
		//绑定回车提交
		App.enterSubmit({
			parent: _box,
			action: function(){
				Core.Events.fireEvent(_submit, 'click');
			}
		});
		passcardOBJ.init(_username, {
			overfcolor: "#999",
			overbgcolor: "#e8f4fc",
			outfcolor: "#000000",
			outbgcolor: ""
		}, $E('reg_password'), window);
		passcardOBJ.menuStatus = {
			"163.com" : true,			
			"qq.com" : true,
			"126.com" : true,
			"hotmail.com" : true,
			"gmail.com" : true,
			"sohu.com" : true
		};
		App.refreshCheckCode();
		
		
		/*_addEvent(_username, function(){
			$E('reg_body').style.display = '';
			$E('login_form').style.display = 'none';
		}, 'focus');*/
		/*_addEvent($E('login_show'), function(){
			if($E('login_form').style.display == 'none'){
				$E('login_form').style.display = '';
			}else{
				$E('login_form').style.display = 'none';
			}
		}, 'click');*/
		//App.setPassword('reg_password', 'reg_password_text');
		//App.setPassword('reg_password2', 'reg_password2_text');
	}catch(exp){
		console.log(exp)
	}
});

/*
 * $registJob("index_login", function(){
    var submit = $E("login_submit_btn");
    var loginname = $E("loginname");
    var password_text = $E("password_text");
    var remusrname = $E("remusrname");
    var login_form = $E("login_form");
    if (!remusrname) {
        remusrname = {
            'checked': true
        };
    }
    //初始化用户名输入
    App.initLoginInput(loginname);
    
    var options = {
        zIndex: 1010,
        ref: loginname,
        offsetY: 1,
        offsetX: 1
    };
    function checkForm(el, errStr){
        if (!Core.String.trim(el.value) || (el.value == el.title && el.title)) {
            password_text.focus();
            App.fixElement.setHTML(errStr, "", options);
            return false;
        }
        else {
            App.fixElement.hidden();
        }
        return true;
    }
    
    Core.Events.addEvent(submit, function(event){
        if (!checkForm(loginname, App.getMsg({
            code: "M00901"
        }))) {
            return false;
        }
        if (!checkForm($E('password'), App.getMsg({
            code: "M00902"
        }))) {
            return false;
        }
        else {
            App.LoginAction({
                name: loginname.value,
                pwd: $E('password').value,
                remb: remusrname.checked,
                error: function(reason, errno){
                    var msg = "";
                    if (errno == "4010") {
                        reason = App.getMsg({
                            code: 'R01011'
                        });
                        msg = App.getMsg("R01010", {
                            mail: loginname.value
                        });
                    }
                    else {
                        if (errno == "101" || errno == "5") {
                            msg = App.getMsg({
                                code: "R11111"
                            });
                        }
                    }
                    //App.fixElement.setHTML(reason, msg, options);
                },
                succ: function(){
                    var redirect = scope.redirect ? Core.String.trim(scope.redirect) : "http://t.sina.com.cn/";
                    location.replace(redirect);
                }
            });
        }
        Core.Events.stopEvent(event);
    }, "click");
    
    //给form绑定键盘回车提交
    if (login_form) {
        App.enterSubmit({
            parent: $E("password").parentNode,
            action: function(){
                Core.Events.fireEvent("login_submit_btn", 'click');
            }
        });
    }
    passcardOBJ.init(loginname, {
        overfcolor: "#999",
        overbgcolor: "#e8f4fc",
        outfcolor: "#000000",
        outbgcolor: ""
    }, password_text, parent);
    //chibin add for 360
    if (Core.String.trim(loginname.value) != '' && Core.String.trim($E('password').value) != '') {
        setTimeout(function(){
            Core.Events.fireEvent(submit, 'click');
        }, 100);
    }
});
 */
