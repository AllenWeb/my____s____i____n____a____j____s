/**
 * 这个代码用来给注册页面使用
*/

//$import("msg/msg.js");
$import('diy/htmltojson.js');
$import('diy/comparejson.js');
$import('diy/check.js');
$import("diy/prompttip.js");
$import("diy/checkForm.js");
$import("diy/checkFormUI2.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("jobs/cardtips.js");
$import("jobs/mod_login.js");
$import("jobs/login.js");
$import("diy/enter.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/TextareaUtils.js");

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

function iniForm(){
	//获取页面元素
	var _box		= $E('information_box');
	var _submit		= $E('submit');
	
	var _username	= $E('reg_username');
	var _password	= $E("reg_password");
	var _password2	= $E("reg_password2");
	var _door		= $E('door');
	var _realname	= $E("realname");
	var _idcard		= $E('idcard');
	var _idType		= $E('idtype');
	var _after		= $E("after");
	
	var _red_username	= $E('red_reg_username');
	var _red_password	= $E('red_reg_password');
	var _red_password2	= $E('red_reg_password2');
	var _red_door		= $E('red_door');
	var _red_realname	= $E("red_realname");
	var _red_idcard	= $E('red_idcard');
	var _red_after		= $E("red_after");
	
	
	//将全局的方法私有化
	var _addEvent	= Core.Events.addEvent;
	var _trim		= Core.String.trim;
	var _html2json	= App.htmlToJson;
	var _compjson	= App.compareJson;
	var _checkNick	= App.checkMiniName;
	var _checkMail	= App.checkEml;
	var _checkQQ	= App.checkQQNum;
	var _alert		= App.alert;
//	var _promptip	= App.promptTip;
	var _checkIdCard= App.checkIdCard;
	var _removeEvent= Core.Events.removeEvent;
	
	//数据初始化
	var _oData		= _html2json(_box);
	var popWin = null;
	
	//局部的函数
	var success = function(json){
		//_promptip($SYSMSG['A00006']);
	};
	var error = function(json){
		if (json) {
			if (!App.Checkinfo.showError([json['code']])) {
//				_promptip($SYSMSG[json['code']], false, false, 'wrong');
				App.alert($SYSMSG[json['code']]);
			}
		}
		else {
//			_promptip( $SYSMSG[json['code']], false, false, 'error');
			App.alert($SYSMSG[json['code']]);
		}
	};
	var errorInput = function(input,red,code){
		red.innerHTML = $SYSMSG[code];
		red.style.display = '';
	};
	
	var rightInput = function(input,red){
		red.style.display = 'none';
	};
	
	//hack纯粹的hack——解决我没有邮箱总是显示的问题
//	_addEvent(_username, function(e){
//		$E("idonthaveamail").style.display = "none";
//	}, 'focus');
	
	//checkForm
	var checkFunction = {
		//邮箱注册
		'MR0001' : function(el){//邮箱查空
			el.value = _trim(el.value);
			if(el.value){
				return true;
			}else{
				return false;
			}
		},
		'MR0002' : function(el){//判断邮件是否正确
			if(App.Checkinfo.check(['MR0001'])){
				if(_checkMail(el.value)){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		'MR0004' : function(el){//判断是新浪邮箱邮件
			
			if(App.Checkinfo.check(['MR0001','MR0002'])){
				if(/^.+@(sina\.com|vip\.sina\.com|sina\.cn|2008\.sina\.com|my3ia\.sina\.com)$/i.test(el.value)){
					if (popWin == null) {
						popWin = App.alert($CLTMSG['CC2301'], {
							ok: function(){
								window.location.href = "/login.php?loginname=" + encodeURIComponent(el.value);
							}
						});
					}
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
			if(App.Checkinfo.check(['MR0001','MR0002','MR0004'])){
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
				App.Checkinfo.hideError(['MR0006']);
				return true;
			} else if(el.ajaxCheck === undefined){
				App.Checkinfo.hideError(['MR0006']);
				return true;
			} else {
				App.Checkinfo.showError(['MR0006']);
                                return false;
			}
		},
		//密码注册
		'MR0014' : function(el){//密码只能是字母和数字
			el.value = _trim(el.value);
			if(App.Checkinfo.check(['MR0011'])&&App.Checkinfo.check(['MR0013'])){
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
		//重复密码注册
		'MR0020' : function(el){//检查密码相同
			el.value = _trim(el.value);
			if(el.value == _trim(_password.value)){
				return true;
			}else{
				return false;
			}
		},
		//昵称
//			'MR0031' : function(el){//查空
//				el.value = _trim(el.value);
//				if(el.value){
//					return true;
//				}else{
//					return false;
//				}
//			},
		'MR0032' : function(el){//少于4个字
			el.value = _trim(el.value);
			if(el.value){
				if( Core.String.byteLength(el.value) >= 4){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		'MR0033' : function(el){//大于20个字
			el.value = _trim(el.value);
			if(el.value){
				if( Core.String.byteLength(String(el.value)) <= 20){
					return true;
				}else{
					return false;
				}
			} else {
				return true;
			}
		},
		'MR0035' : function(el){//全数字
			el.value = _trim(el.value);
			if(!/^[0-9]*$/.test(el.value) || el.value.length == 0){
				return true;
			}else{
				return false;
			}
		},
		'MR0034' : function(el){//怪字符
			el.value = _trim(el.value);
			if(_checkNick(el.value) || el.value.length == 0){
				return true
			}else{
				return false;
			}
		},
		'MR0040' : function(el){//有没有选择省
			if(el.value != 0){
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
				//App.refreshCheckCode();
				return false;
			}
		},
		'MR0061' : function(el){//注册码为空
			el.value = _trim(el.value);
			if(el.value.length > 0){
				return true;
			}else{
				return false;
			}
		},
		'MR0062' : function(el){//注册码格式不正确
			el.value = _trim(el.value);
			if(/^[0-9a-zA-Z]{5,32}$/.test(el.value)){
				return true;
			}else{
				return false;
			}
		},
		'MR0062' : function(el){//注册码格式不正确
			el.value = _trim(el.value);
			if(/^[0-9a-zA-Z]{5,32}$/.test(el.value)){
				return true;
			}else{
				return false;
			}
		},
		'M01135' : function(el){
			el.value = _trim(el.value);
			if(el.value.length <= 0){
				return true;
			}
			if(Core.String.byteLength(el.value) > 16 || Core.String.byteLength(el.value) < 4){
				return false;
			}else{
				return true;
			}
		},
		'M01136' : function(el){
			el.value = _trim(el.value);
			if(/[0-9\s_><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(el.value)){
				return false;
			}else{
				return true;
			}
		},
		'M01133' : function(el){
			el.value = _trim(el.value);
			if(_idType.value != "1" || el.value.length <= 0){
				return true;
			}
			return _checkIdCard(el.value);
		},
		'M01191' : function(el){//其它证件号码校验（3～20位数字,英文）--$SYSMSG['R01418']
			el.value = _trim(el.value);
			if(el.value.length === 0 || _idType.value == "1" || _idType.value == "0"){
				return true;
			}
			if(_idType.value != "1" && _idType.value != "0"){
				return /^[0-9a-zA-Z]{3,20}$/.test(el.value);
			}
		},
		'R01417' : function(el){
			if(_idType.value == 0 && el.value.length > 0){
				return false;
			}else{
				return true;
			}
		},
		'MR0071' : function(el){
			if(el.checked){
				return true;
			}
			return false;
		}
	};
	App.Checkinfo = App.checkForm(App.checkFormUI2);

	//邮箱地址
	App.Checkinfo.add('MR0001',_username,_red_username,checkFunction['MR0001']);
	App.Checkinfo.add('MR0002',_username,_red_username,checkFunction['MR0002']);
	App.Checkinfo.add('MR0004',_username,_red_username,checkFunction['MR0004']);
	App.Checkinfo.add('MR0005',_username,_red_username,checkFunction['MR0005']);
	App.Checkinfo.add('MR0006',_username,_red_username,checkFunction['MR0006']);
	//密码
	App.Checkinfo.add('MR0014',_password, _red_password,checkFunction['MR0014']);
	App.Checkinfo.add('MR0011',_password, _red_password,checkFunction['MR0011']);
	App.Checkinfo.add('MR0013',_password, _red_password,checkFunction['MR0013']);
	//再次密码
	App.Checkinfo.add('MR0020',_password2, _red_password2,checkFunction['MR0020']);
	//验证码
	App.Checkinfo.add('MR0050',_door, _red_door,checkFunction['MR0050']);
	
	//用户许可协议
	App.Checkinfo.add('MR0071',_after, _red_after,checkFunction['MR0071']);
	//真实姓名
	if (_realname) {
		App.Checkinfo.add('M01135', _realname, _red_realname, checkFunction['M01135']);
		App.Checkinfo.add('M01136', _realname, _red_realname, checkFunction['M01136']);
	}
	//身份证
	if (_idcard) {
		App.Checkinfo.add('M01133', _idcard, _red_idcard, checkFunction['M01133']);
		App.Checkinfo.add('R01417', _idcard, _red_idcard, checkFunction['R01417']);//"证件类型不正确"
		//其它证件号码校验（3～20英文，数字）--$SYSMSG['R01418']
		//$SYSMSG['otherID'] = "请输入正确的证件号码";//已经注册到msg.js了 改为M01191
		App.Checkinfo.add('M01191', _idcard, _red_idcard, checkFunction['M01191']);
		_idType.onchange = function(){
			Core.Events.fireEvent(_idcard, 'blur');
		};
	}
	
	App.bindFormTips([
		{'el' : _username, 'key' : 'MR0003','errorPos':_red_username},
		{'el' : _password, 'key' : 'MR0012','errorPos':_red_password},
		{'el' : _password2, 'key' : 'MR0021','errorPos':_red_password2},
		{'el' : _realname, 'key' : 'R01102','errorPos':_red_realname},
		{'el': _idcard,	'key': 'R01101','errorPos':_red_idcard}
	]);
	//全局的函数
	App.information = {};
	//提交函数
	App.information['submit'] = function(){
		// if(_isNewCheckcode){
			// secondCheckcode();
			// return false;
		// }
		if(App.Checkinfo.check() && (_username.ajaxCheck == "1")){
//			_removeEvent(_submit, App.information['submit'], 'click');
			setTimeout(function(){
				App.information['rumor'](success,error);
			},500);
		}
		return false;
	};
	
	var _isNewCheckcode = false; //说明页面现在进入出现重复验证码状态
	
	App.information['rumor'] = function(success,error){
//		if(_isNewCheckcode){
//			try{
//				_newCheckcodeLayer.show();
//			}catch(e){}
//		}
		
		if(typeof success != 'function'){
			throw('The publishRumor need a function as thrid parameter');
		}
		
		if(typeof error != 'function'){
			throw('The publishRumor need a function as fourth parameter');
		}
		
		var parameters = _html2json(_box);
		parameters.token = scope.$token;
		parameters.retcode = scope.doorretcode||"";
		scope.doorretcode = "";
		if(_compjson(parameters,_oData)){
			success();
		}else{
			Utils.Io.Ajax.request('/reg/reg.php', {
				'POST'		: parameters,
				'onComplete': function(json){
//					_addEvent(_submit, App.information['submit'], 'click');
					if(json.code == 'A00006'){
						success(json.data);
						oData = parameters;
						if(json.data){
							//setTimeout(function(){
								window.location.replace(json.data);
							//	_addEvent(_submit, App.information['submit'], 'click');
							//},2000);
						}
//					}else if(json.code == 'M00004'){
//						App.alert({code:'R01438'});
					}else if(json.code == "MR0050"){
						App.forbidrefresh(function(){
							Core.Events.fireEvent(_submit, 'click');
						},'/reg/reg.php');
						return;
					}else if(json.code == "R01409"){
						_red_door.innerHTML = '<div class="errormt" style=""><strong><span>'+$SYSMSG[json['code']]+'</span></strong></div>';
						App.TextareaUtils.setCursor(_door);
						App.refreshCheckCode();
						return;
					}else{
						error(json);
						
					}
					_submit.className = 'btn_ljzc';
					//else{
						//_addEvent(_submit, App.information['submit'], 'click');
						// App.alert(json);
//						App.alert($SYSMSG[json.code],{icon:2,width:370,height:150});
					//}
					
					//refresh check code
//					if(!_isNewCheckcode){
//						App.refreshCheckCode();
//					}else{
						
//					}
				},
				'onException': function(json){
					_addEvent(_submit, App.information['submit'], 'click');
					error(json);
					_submit.className = 'btn_ljzc';
				},
				'returnType': 'json'
			});
			_submit.className = 'btn_ljzc btn_ljzc_load';
		}
		
	};
	_addEvent(_submit, App.information['submit'], 'click');
	
	//设定页面加载默认焦点
	//_username.focus();
	
	
	/*
	* 用户防止乱注册
	*/
//	var _newCheckcodeLayer;
//	var secondCheckcode = function(){
//		//防止用户刷账号
//		if(!_newCheckcodeLayer){
//			var msg = '<div class="auth_code">\
//				<div class="auth_img"><img height="50" id="door2img" /><a href="javascript:void(0);" onclick="App.refreshCheckCode2();return false;">'+$CLTMSG['CC2103']+'</a></div>\
//					<p>'+$CLTMSG['CC2104']+'</p>\
//					<div class="code_input"><input type="text" value="" id="door2inLayer" /></div>\
//					<p class="errorTs error_color" id="door2Error" style="display:none">'+$CLTMSG['CC2101']+'</p>\
//					<p class="btn"><a class="btn_normal" href="javascript:void(0);" id="door2Submit"><em>'+$CLTMSG['CC2105']+'</em></a> <a class="btn_notclick" href="javascript:void(0);" id="door2Cancel"><em>'+$CLTMSG['CL0603']+'</em></a></p>\
//				</div>\
//				';
//			_newCheckcodeLayer = new App.Dialog.BasicDialog($SYSMSG['MR0050'],msg,{'width':420,'zIndex':1000,'hiddClose':true});
//			
//			//绑定事件
//			_addEvent($E('door2Submit'), function(){
//				if($E('door2Submit').className != 'btn_normal'){
//					return;
//				}
//				if($E('door2inLayer').value == ''){
//					$E('door2Error').style.display = '';
//					$E('door2Error').innerHTML = $SYSMSG['MR0050'];
//					return;
//				}
//				var newDoor;
//				if($E('door2')){
//					newDoor = $E('door2');
//					newDoor.value = $E('door2inLayer').value;
//				}else{
//					newDoor = $C('INPUT');
//					newDoor.id = 'door2';
//					newDoor.name = 'door2';
//					newDoor.style.display = 'none';
//					newDoor.value = $E('door2inLayer').value;
//					_box.appendChild(newDoor);
//				}
//				Core.Events.fireEvent(_submit, 'click');
//				$E('door2Submit').className = 'btn_notclick';
//				return false;
//			},'click');
//			_addEvent($E('door2inLayer'),function(){
//				$E('door2Error').style.display = 'none';
//			},'focus');
//			_addEvent($E('door2Cancel'),function(){
//				_newCheckcodeLayer.hidd();
//			},'click');
//		}
//		_newCheckcodeLayer.show();
//		App.refreshCheckCode2();
//	};
	
	/**
	 * 登录用户名联想输入
	 */
	passcardOBJ.menuStatus = {
		"163.com" : true,			
		"qq.com" : true,
		"126.com" : true,
		"hotmail.com" : true,
		"gmail.com" : true,
		"sohu.com" : true
	};
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
	//绑定回车提交
	App.enterSubmit({
		parent : _box,
		action : function(){
			Core.Events.fireEvent(_submit, 'click');
		}
	});
}

//更新验证码
App.refreshCheckCode = function(){
	setTimeout(function(){
		$E("check_img").src = '/pincode/pin1.php?r=' + ((new Date()).getTime()) +"&lang="+scope.$lang;
		$E("check_img").style.display = "";
	},10);
};

//更新验证码2
//App.refreshCheckCode2 = function(){
//	setTimeout(function(){
//		if($E("door2img")){
//			$E("door2img").src = '/pincode/pin.php?r=' + ((new Date()).getTime()) + '&rule';
//			$E("door2img").style.display = "";
//		}
//	},10);
//};


//切换注册方式
App.swichRegistPath = function(type){
	if(type == "mobile"){
		$E("regist_tag_mail").style.display = "none";
		$E("regist_content_mail").style.display = "none";
		$E("regist_content_tip").style.display = "none";
		$E("regist_tag_mobile").style.display = "";
		$E("regist_content_mobile").style.display = "";
	}else{
		$E("regist_tag_mobile").style.display = "none";
		$E("regist_content_mobile").style.display = "none";
		$E("regist_content_tip").style.display = "";
		$E("regist_tag_mail").style.display = "";
		$E("regist_content_mail").style.display = "";
	}
};

$registJob('information2',iniForm);
$registJob('showCheckCode',function(){
	App.refreshCheckCode();
});
