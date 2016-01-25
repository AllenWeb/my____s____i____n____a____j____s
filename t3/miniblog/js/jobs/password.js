/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('diy/check.js');
$import("diy/checkForm.js");
$import("diy/checkFormUI.js");
$import("diy/prompttip.js");
$registJob('password',function(){
	try {
		var _old = $E('old_password');
		var _new = $E('new_password');
		var _com = $E('compare_password');
		var _sub = $E('submit_password');
		var _img = $E('image_password');
		
		var _addEvent	= Core.Events.addEvent;
		var _alert		= App.alert;
		var _PwdPower	= App.checkPwdPowerNew;
		var _promptip	= App.promptTip;
		var _tip = $CLTMSG["CD0057"];
		var _imgstr = [_tip + ' <img src="'+scope.$BASEIMG+'style/images/setup/pwd_no.gif" />',
					 _tip + ' <img src="'+scope.$BASEIMG+'style/images/setup/pwd_simple.gif" />', 
					 _tip + ' <img src="'+scope.$BASEIMG+'style/images/setup/pwd_middle.gif" />', 
					 _tip + ' <img src="'+scope.$BASEIMG+'style/images/setup/pwd_strong.gif" />'];
		
		var _comparePassword = function(){
			var k = _new.value ? _PwdPower(_new.value) : 0;
			_img.innerHTML = _imgstr[k];
			return true;
		};
		var checkFunction = {
			'M01112' : function(el){//旧密码
				if(el.value){
					return true;
				}else{
					return false;
				}
			},
			'M01111' : function(el){//新密码
				if(el.value.length >= 6 && el.value.length <= 16){
					return true;
				}else{
					return false;
				}
			},
			'M01113' : function(el){//怪字符
				if(el.value.length == 0){
					return true;
				}
				if(el.value && /^[a-zA-Z0-9._?-]+$/i.test(el.value)){
					return true;
				}else{
					return false;
				}
			},
			'M01114' : function(el){//重复密码
				if(el.value == _new.value){
					return true;
				}else{
					return false;
				}
			}
		};
		App.Checkinfo = App.checkForm(App.checkFormUI); 
		App.Checkinfo.add('M01112',_old,$E('red_opwd'),checkFunction['M01112']);
		App.Checkinfo.add('M01113',_new,$E('red_npwd'),checkFunction['M01113']);
		App.Checkinfo.add('M01111',_new,$E('red_npwd'),checkFunction['M01111']);
		App.Checkinfo.add('M01114',_com,$E('red_cpwd'),checkFunction['M01114']);
		App.bindFormTips([
			{'el' : _old},
			{'el' : _new, 'key' : 'R01006'},
			{'el' : _com}
		]);
		var _key = false;
		var _submitPassword = function(){
			if(_key){return false}
			_key = true;
			var success = function(){
				_promptip($SYSMSG['A00006']);
				_key = false;
			};
			var error = function(json){
				if (json) {
					_promptip( {
						'code': json['code']
					}, false, false, 'wrong');
				}
				else {
					_promptip( 'error', false, false, 'error');
				}
				_key = false;
			};
			if(!App.Checkinfo.check()){
				_key = false;
				return false;
			}
			Utils.Io.Ajax.request('/person/editpasswd_post.php', {
				'POST': {
					'oldpwd' : _old.value,
					'newpwd' : _new.value
				},
				'onComplete': function(json){
					if (json.code == 'A00006') {
						success(json.data);
					}
					else {
						error(json);
					}
				},
				'onException': function(){
					error();
				},
				'returnType': 'json'
			});
			return false;
		};
		_addEvent(_new, _comparePassword, 'blur');
		_addEvent(_com, _comparePassword, 'blur');
		_addEvent(_sub, _submitPassword, 'click');	
	}catch(exp){console.log(exp)}
});