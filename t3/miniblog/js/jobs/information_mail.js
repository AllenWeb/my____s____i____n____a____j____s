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
$import("sina/core/events/fireEvent.js");
$import("diy/forbidrefresh_dialog.js");

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
	var _answer		= $E('answer');
	var _question	= $E('question');
	var _question_other = $E('question_other'); //其他问题的容器
	//var _question_other_info = $E('question_other_info'); //其他问题的容器提示
	var _question_new = $E("question_new");
	var _after		= $E("after");
	var _suggest_username = $E("suggest_username");
	
	var _red_username	= $E('red_reg_username');
	var _red_password	= $E('red_reg_password');
	var _red_password2	= $E('red_reg_password2');
	var _red_door		= $E('red_door');
	var _red_question	= $E("red_question");
	var _red_question_new	= $E("red_question_new");
	var _red_answer		= $E('red_answer');
	var _red_after		= $E("red_after");
	
	
	//将全局的方法私有化
	var _addEvent	= Core.Events.addEvent;
	var _trim		= Core.String.trim;
	var _html2json	= App.htmlToJson;
	var _compjson	= App.compareJson;
	var _checkNick	= App.checkMiniName;
	var _checkMail	= App.checkEml;
	var _alert		= App.alert;
	var _promptip	= App.promptTip;
	var _removeEvent= Core.Events.removeEvent;
	
	//数据初始化
	var _oData		= _html2json(_box);
	
	//局部的函数
	var success = function(json){
		_promptip($SYSMSG['A00006']);
	};
	
	var error = function(json){
		if (json) {
			if (!App.Checkinfo.showError([json['code']])) {
				_promptip($SYSMSG[json['code']], false, false, 'wrong');
			}
		}
		else {
			_promptip( $SYSMSG[json['code']], false, false, 'error');
		}
	};
	var errorInput = function(input,red,code){
		red.innerHTML = $SYSMSG[code];
		red.style.display = '';
	};
	
	var rightInput = function(input,red){
		red.style.display = 'none';
	};
	
	function _fullShape2halfShape(str){
		var _key = {
			"Ａ":"A",
			 "Ｂ":"B",
			 "Ｃ":"C",
			 "Ｄ":"D",
			 "Ｅ":"E",
			 "Ｆ":"F",
			 "Ｇ":"G",
			 "Ｈ":"H",
			 "Ｉ":"I",
			 "Ｊ":"J",
			 "Ｋ":"K",
			 "Ｌ":"L",
			 "Ｍ":"M",
			 "Ｎ":"N",
			 "Ｏ":"O",
			 "Ｐ":"P",
			 "Ｑ":"Q",
			 "Ｒ":"R",
			 "Ｓ":"S",
			 "Ｔ":"T",
			 "Ｕ":"U",
			 "Ｖ":"V",
			 "Ｗ":"W",
			 "Ｘ":"X",
			 "Ｙ":"Y",
			 "Ｚ":"Z",
			 "ａ":"a",
			 "ｂ":"b",
			 "ｃ":"c",
			 "ｄ":"d",
			 "ｅ":"e",
			 "ｆ":"f",
			 "ｇ":"g",
			 "ｈ":"h",
			 "ｉ":"i",
			 "ｊ":"j",
			 "ｋ":"k",
			 "ｌ":"l",
			 "ｍ":"m",
			 "ｎ":"n",
			 "ｏ":"o",
			 "ｐ":"p",
			 "ｑ":"q",
			 "ｒ":"r",
			 "ｓ":"s",
			 "ｔ":"t",
			 "ｕ":"u",
			 "ｖ":"v",
			 "ｗ":"w",
			 "ｘ":"x",
			 "ｙ":"y",
			 "ｚ":"z",
			 "１":"1",
			 "２":"2",
			 "３":"3",
			 "４":"4",
			 "５":"5",
			 "６":"6",
			 "７":"7",
			 "８":"8",
			 "９":"9",
			 "０":"0"
		};
		var _str = str.split("");
		for(var i=0;i<_str.length;i++){
			if(_key[_str[i]]){
				_str[i] = _key[_str[i]];
			}
		}
		return _str.join("");
	}
	
	
	//checkForm
	var checkFunction = {
		//邮箱注册
		'MR0100' : function(el){//邮箱查空
			el.value = _trim(el.value);
			if(el.value){
				return true;
			}else{
				return false;
			}
		},
		"MR0102" : function(el){ //字符长度 不能少于4个
			el.value = _trim(el.value);
			if(App.Checkinfo.check(['MR0100'])){
				if(el.value.length >=4 && el.value.length <= 32){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		
		'MR0119' : function(el){ //含有空格
			if (App.Checkinfo.check(['MR0100', "MR0102"])) {
				if(/^.* +.*$/.test(el.value)){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		'MR0010' : function(el){ //含有非法字符
			if (App.Checkinfo.check(['MR0100', "MR0102","MR0119"])) {
				if(/^[a-z0-9_]*[^a-z0-9_ ]+[a-z0-9_]*$/.test(el.value)){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		'MR0118' : function(el){ //首尾有下划线
			if (App.Checkinfo.check(['MR0100', "MR0102","MR0119","MR0010"])) {
				if(/^(_.{3,15})|(.{3,15}_)$/.test(el.value)){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		'MR0117' : function(el){ //全是数字
			if (App.Checkinfo.check(['MR0100', "MR0102","MR0119","MR0010","MR0118"])) {
				if(/^[0-9]{4,16}$/.test(el.value)){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		'MR0101' : function(el){//判断邮件是否正确
			if(App.Checkinfo.check(['MR0100',"MR0102","MR0119","MR0010","MR0118","MR0117"])){
				if(!/^[a-z0-9][a-z0-9_]{2,14}[a-z0-9]$/.test(el.value)){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		'MR0103' : function(el){//判断是否已经注册
			if(App.Checkinfo.check(['MR0100', "MR0102","MR0119","MR0010","MR0118","MR0117","MR0101"])){
				var _parm = {
					"mail": el.value,
					"mailtype": ($E('reg_mailtype') ? $E('reg_mailtype').value : '')
				}
				Utils.Io.Ajax.request('/reg/sinamail_check.php', {
					'POST'		: _parm,
					'onComplete': function(json){
						if(json.code == "A00006"){
							el.ajaxCheck = "1";
						} else {
							el.ajaxCheck = "0";
						}
						checkFunction['MR0112'](el);
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
		'MR0112' : function(el){//为邮箱地址ajax验证做的单独方法
			if(el.ajaxCheck == "1"){
				App.Checkinfo.hideError(['MR0112']);
				return true;
			} else if(el.ajaxCheck === undefined) {
				App.Checkinfo.hideError(['MR0112']);
                                return true;
			} else {
				App.Checkinfo.showError(['MR0112']);
				return false;
			}
		},
		//密码注册
		'M00902' : function(el){
			el.value = _trim(el.value);
			if(el.value.length == 0){
				return false;
			}
			return true;
		},
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
		'MR0071' : function(el){
			if(el.checked){
				return true;
			}
			return false;
		},
		//密码问题
		'MR0104' : function(el){
			if(el.value == 0){
				return false;
			}
			el.value = _trim(el.value);
			if(el.value == 1){
				_question_other.style.display = "";
//				_question_other_info.style.display = "";
			}else{
				_question_other.style.display = "none";
//				_question_other_info.style.display = "none";
			}
			return true;
		},
		//密码找回选择"其他"报错
		'MR0107' : function(el){
			if(_question.value != 1){
				return true;
			}
			el.value = _trim(el.value);
			el.value = _fullShape2halfShape(el.value);
			if(el.value.length == 0){
				return false;
			}
			return true;
		},
		'MR0108':function(el){
			if(_question.value != 1){
				return true;
			}
			el.value = _trim(el.value);
			if(App.Checkinfo.check(['MR0107'])){
				if(Core.String.byteLength(el.value) >=4 && Core.String.byteLength(el.value) <= 32){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		'MR0109':function(el){
			if(_question.value != 1){
				return true;
			}
			el.value = _trim(el.value);
			if (App.Checkinfo.check(['MR0107','MR0108'])) {
				if(/^[0-9a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5 ]*[0-9a-zA-Z\u4e00-\u9fa5]$/.test(el.value)){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		//密码找回答案错误
		"MR0116" : function(el){
			el.value = _trim(el.value);
			el.value = _fullShape2halfShape(el.value);
			if(el.value.length == 0){
				return false;
			}
			return true;
		},
		"MR0113":function(el){
			el.value = _trim(el.value);
			if (App.Checkinfo.check(['MR0116'])) {
				if(Core.String.byteLength(el.value) >=6 && Core.String.byteLength(el.value) <= 80){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		"MR0114":function(el){
			el.value = _trim(el.value);
			if (App.Checkinfo.check(['MR0116',"MR0113"])) {
				if(/^[0-9a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5 ]*[0-9a-zA-Z\u4e00-\u9fa5]$/.test(el.value)){
					return true;
				} else{
					return false;
				}
			}else{
				return true;
			}
		},
		"MR0115":function(el){
			el.value = _trim(el.value);
			if (App.Checkinfo.check(['MR0116', "MR0113", "MR0114"])) {
				if(_question.value == 1){
					if(_question_new.value == el.value){
						return false;
					}else{
						return true;
					}
				}else{
					if(_question.value == el.value){
						return true;
					}else{
						return true;
					}
				}
			}else{
				return true;
			}
		}
	};

	App.Checkinfo = App.checkForm(App.checkFormUI2);
	
	//邮箱地址
	App.Checkinfo.add('MR0100',_username,_red_username,checkFunction['MR0100']);
	App.Checkinfo.add('MR0101',_username,_red_username,checkFunction['MR0101']);
	App.Checkinfo.add('MR0102',_username,_red_username,checkFunction['MR0102']);
	App.Checkinfo.add('MR0103',_username,_red_username,checkFunction['MR0103']);
	App.Checkinfo.add('MR0117',_username,_red_username,checkFunction['MR0117']);
	App.Checkinfo.add('MR0118',_username,_red_username,checkFunction['MR0118']);
	App.Checkinfo.add('MR0119',_username,_red_username,checkFunction['MR0119']);
	App.Checkinfo.add('MR0010',_username,_red_username,checkFunction['MR0010']);
	App.Checkinfo.add('MR0112',_username,_red_username,checkFunction['MR0112']);
	
	//密码
	App.Checkinfo.add('MR0014',_password, _red_password,checkFunction['MR0014']);
	App.Checkinfo.add('MR0011',_password, _red_password,checkFunction['MR0011']);
	App.Checkinfo.add('MR0013',_password, _red_password,checkFunction['MR0013']);
	App.Checkinfo.add('M00902',_password, _red_password,checkFunction['M00902']);
	//再次密码
	App.Checkinfo.add('MR0020',_password2, _red_password2,checkFunction['MR0020']);
	
	//密码问题
	App.Checkinfo.add('MR0104',_question, _red_question, checkFunction['MR0104']);
	
	//密码找回问题
	App.Checkinfo.add('MR0107',_question_new, _red_question_new, checkFunction['MR0107']);
	App.Checkinfo.add('MR0108',_question_new, _red_question_new, checkFunction['MR0108']);
	App.Checkinfo.add('MR0109',_question_new, _red_question_new, checkFunction['MR0109']);
	
	//密码找回答案
	App.Checkinfo.add('MR0116',_answer, _red_answer, checkFunction['MR0116']);
	App.Checkinfo.add('MR0113',_answer, _red_answer, checkFunction['MR0113']);
	App.Checkinfo.add('MR0114',_answer, _red_answer, checkFunction['MR0114']);
	App.Checkinfo.add('MR0115',_answer, _red_answer, checkFunction['MR0115']);
	
	//验证码
	//App.Checkinfo.add('MR0050',_door, _red_door,checkFunction['MR0050']);
	
	//用户许可协议
	App.Checkinfo.add('MR0071',_after, _red_after,checkFunction['MR0071']);
	
	//绑定提示文案
	App.bindFormTips([
		{'el' : _username, 'key' : 'MR0105', 'errorPos':_red_username},
		{'el' : _password, 'key' : 'MR0012','errorPos':_red_password},
		{'el' : _password2, 'key' : 'MR0021','errorPos':_red_password2},
		{'el' : _question, 'key' : 'MR0106','errorPos':_red_question},
		{'el' : _question_new, 'key' : 'MR0106','errorPos':_red_question_new},
		{'el' : _answer, 'key' : 'MR0110','errorPos':_red_answer}
	]);
	//全局的函数
	App.information = {};
	//提交函数
	App.information['submit'] = function(){
		if(App.Checkinfo.check() && (_username.ajaxCheck == "1")){
			_removeEvent(_submit, App.information['submit'], 'click');
			setTimeout(function(){
				App.information['rumor'](success,error);
			},500);
		}
		return false;
	};
	
//	var _isNewCheckcode = false; //说明页面现在进入出现重复验证码状态
	
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
			//问题去掉问号
			if(parameters["question"] != "1" && parameters["question"] != "0"){
				if(parameters["question"].charAt(parameters["question"].length - 1) == "\uFF1F"){
					parameters["question"] = parameters["question"].slice(0, parameters["question"].length - 1);
				}
			}
			
			Utils.Io.Ajax.request('/reg/reg_sinamail.php', {
				'POST'		: parameters,
				'onComplete': function(json){
					_addEvent(_submit, App.information['submit'], 'click');
					if(json.code == 'A00006'){
						success(json.data);
						oData = parameters;
						if(json.data){
							//setTimeout(function(){
								window.location.href = json.data;
							//},2000);
						}
//					}else if(json.code == 'M00004'){
//						App.alert({
//							code: 'R01438'
//						});
					}else if(json.code == "MR0050"){
						App.forbidrefresh(function(){
							Core.Events.fireEvent(_submit, 'click');
						},'/reg/reg_sinamail.php',true);
						return;
					}else{
						//_addEvent(_submit, App.information['submit'], 'click');
						App.alert({
							code: json.code
						});
					}
//					_addEvent(_submit, App.information['submit'], 'click');
//					//refresh check code
//					if(!_isNewCheckcode){
//						App.refreshCheckCode();
//					}else{
//						$E('door2Submit').className = 'btn_normal';
//					}
					_submit.className = 'btn_ljzc';
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
	
	//给输入框绑定联想输入
	function _suggestUsername(e){
		var u = _trim(_username.value);
		if(u.length > 0 ){
			_suggest_username.style["display"] = "";
			var str=$CLTMSG['CC2102'];
			var tmp = new Utils.Template(str);
			var title = tmp.evaluate({name:u});
			_suggest_username.innerHTML = title;
		}else{
			_suggest_username.style["display"] = "none";
		}
	}
	_addEvent(_username, _suggestUsername, 'keyup');
	
	//修改bug：http://issue.internal.sina.com.cn/browse/MINIBLOGBUG-221
	_addEvent(_username, function(e){
		_red_username.style.display = "none";
	}, "focus");
	
	//绑定回车提交
	App.enterSubmit({
		parent : _box,
		action : function(){
			Core.Events.fireEvent(_submit, 'click');
		}
	});
	   _username.focus();
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
//					<p class="btn"><a class="btn_normal" href="javascript:void(0);" id="door2Submit"><em>'+$CLTMSG['CC2105']+'</em></a>  <a class="btn_notclick" href="javascript:void(0);" id="door2Cancel"><em>'+$CLTMSG['CL0603']+'</em></a></p>\
//				</div>\
//				';
//			_newCheckcodeLayer = new App.Dialog.BasicDialog($SYSMSG['MR0050'],msg,{'width':420,'zIndex':1000,'hiddClose':true});
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
}

//更新验证码
App.refreshCheckCode = function(){
	setTimeout(function(){
		$E("check_img").src = '/pincode/pin.php?r=' + ((new Date()).getTime()) ;
		$E("check_img").style.display = "";
	},100);
};

//更新验证码2
//App.refreshCheckCode2 = function(){
//	setTimeout(function(){
//		if($E("door2img")){
//			$E("door2img").src = '/pincode/pin.php?r=' + ((new Date()).getTime()) + '&rule';
//			$E("door2img").style.display = "";
//		}
//	},100);
//};


$registJob('informationMail',iniForm);
$registJob('showCheckCode',function(){
	App.refreshCheckCode();
});
