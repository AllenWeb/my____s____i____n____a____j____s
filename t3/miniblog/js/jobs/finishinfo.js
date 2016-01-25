/**
 * @ Robin Young | yonglin@staff.sina.com.cn
 * @ 与话题有关的操作
 */

$import("jobs/base.js");
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/querytojson.js');
$import('diy/check.js');
$import('diy/enter.js');
$import("diy/prompttip.js");
$import("diy/checkForm.js");
$import("diy/checkFormUI.js");
$import("sina/core/string/byteLength.js");
$registJob('finishinfo', function(){
	try {
		var _box = $E('information_box');
		var _nickName = $E('nickname');
		var _province = $E('provnice');
		var _invitcod = $E('invitecode');
		var _city = $E('city');
		if($E('gender')){
			var _gender = $E('gender').getElementsByTagName('INPUT');
		}
		var _red_nickName = $E('red_nickname');
		var _red_province = $E('red_provnice');
		var _red_invitcod = $E('red_invitecode');
		var _red_gender   = $E('red_gender');
		
		//var _gender = $E('gender');
		var _submit = $E('submit');
		
		var _html2json = App.htmlToJson;
		var _query2json = App.queryToJson;
		var _bindCity = App.ProvinceAndCity;
		var _addEvent = Core.Events.addEvent;
		var _checkNick = App.checkMiniName;
		var _trim = Core.String.trim;
		var _alert = App.alert;
		var _enter = App.enterSubmit;
		var _promptip	= App.promptTip;
		
		if (_city) {
			new _bindCity(_province, _city, (_province.getAttribute('truevalue') || _province.value), (_city.getAttribute('truevalue') || _city.value));
		}
		
		var checkFunction = {
			'M01100' : function(el){//查空
				el.value = _trim(el.value);
				if(el.value){
					return true;
				}else{
					return false;
				}
			},
			'M01101' : function(el){//昵称的字数限制2－20
				el.value = _trim(el.value);
				var lens = Core.String.byteLength(el.value);
				if(lens >= 4 || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01102' : function(el){//昵称的字数限制2－20
				el.value = _trim(el.value);
				var lens = Core.String.byteLength(el.value);
				if(lens <= 20 || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01128' : function(el){//全数字
				el.value = _trim(el.value);
				if(!/^[0-9]*$/.test(el.value) || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01103' : function(el){//怪字符
				el.value = _trim(el.value);
				if(_checkNick(el.value) || el.value.length == 0){
					return true
				}else{
					return false;
				}
			},
			'M01007' : function(el){//省为空
				if(el.value != 0){
					return true;
				}else{
					return false;
				}
			},
			'M01130' : function(el){//邀请码
				el.value = _trim(el.value);
				if(/^[0-9a-zA-Z]{5,32}$/.test(el.value) || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01131' : function(el){//查空
				el.value = _trim(el.value);
				if(el.value){
					return true;
				}else{
					return false;
				}
			},
			'M01104' : function(els){//性别
				for(var i = 0, len = els.length; i < len; i += 1){
					if(els[i].checked){
						return true;
					}
				}
				return false;
			},
			'M01129' : function(el){//昵称重复
				return true;
			}
		};
		
		App.Checkinfo = App.checkForm(App.checkFormUI); 
		var clientTips = [];
		if(_invitcod){
			App.Checkinfo.add('M01130', _invitcod, _red_invitcod, checkFunction['M01130']);
			App.Checkinfo.add('M01131', _invitcod, _red_invitcod, checkFunction['M01131']);
			clientTips.push({'el' : _invitcod, 'key' : 'R01009'});
		}
		
		if (_nickName) {
			App.Checkinfo.add('M01100', _nickName, _red_nickName, checkFunction['M01100']);
			App.Checkinfo.add('M01101', _nickName, _red_nickName, checkFunction['M01101']);
			App.Checkinfo.add('M01128', _nickName, _red_nickName, checkFunction['M01128']);
			App.Checkinfo.add('M01102', _nickName, _red_nickName, checkFunction['M01102']);
			App.Checkinfo.add('M01103', _nickName, _red_nickName, checkFunction['M01103']);
			App.Checkinfo.add('M01129', _nickName, _red_nickName, checkFunction['M01129']);
			clientTips.push({'el' : _nickName, 'key' : 'R01001'});
		}
		if (_province) {
			App.Checkinfo.add('M01007',_province, _red_province,checkFunction['M01007']);
		}
		if (_gender){
			App.Checkinfo.add('M01104',_gender, _red_gender,checkFunction['M01104']);
		}
		
		App.bindFormTips(clientTips);
		
		
		var nameUsable = true;
		var useingName = '';
		var checking = false;
		var suggestNick = [];
		var ajaxCheckNickName = function(){
			if(App.Checkinfo.check(['M01100','M01101','M01128','M01102','M01103'])){
				useingName = _trim(_nickName.value);
				if($E('use_name').parentNode.parentNode.style.display !== 'none'){
					$E('use_name').parentNode.parentNode.style.display = '';
					$E('use_name').innerHTML = '<div class="loading"></div>';
				}
				Utils.Io.Ajax.request('/person/aj_checknick.php', {
					'GET'		: {'nickname' : useingName},
					'onComplete': function(json){
						try {
							if (json.code == 'A00006') {
								nameUsable = true;
								_nickName.errorKey = false;
								$E('use_name').parentNode.parentNode.style.display = 'none';
							}else if(json.code == 'M01129'){
								$E('use_name').parentNode.parentNode.style.display = '';
								suggestNick = suggestNick.concat(json.data);
								var showStr = '<h4 class="erroRed">' + $CLTMSG['CY0108'] + '</h4>'+
								          	'<ul>'+
								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[0] + '\');" id="rdoo_1" name="rdoo"><label for="rdoo_1">' + json.data[0] + '</label></li>'+
								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[1] + '\');" id="rdoo_2" name="rdoo"><label for="rdoo_2">' + json.data[1] + '</label></li>'+
								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[2] + '\');" id="rdoo_3" name="rdoo"><label for="rdoo_3">' + json.data[2] + '</label></li>'+
								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[3] + '\');" id="rdoo_4" name="rdoo"><label for="rdoo_4">' + json.data[3] + '</label></li>'+
								            '</ul>';
								$E('use_name').innerHTML = showStr;
								App.Checkinfo.showError([json['code']]);
								nameUsable = false;
							}
							else {
								nameUsable = false;
								App.Checkinfo.showError([json['code']]);
								_nickName.errorKey = json['code'];
								$E('use_name').parentNode.parentNode.style.display = 'none';
							}
							checking = false;
						}catch(exp2){
							nameUsable = true;
							checking = false;
						}
					},
					'onException': function(){
						nameUsable = true;
						checking = false;
					},
					'returnType': 'json'
				});
			}
		};
		scope.changeUserNameFunc = function(value){
			$E('nickname').value = value;
			$E('nickname').style.border = '#999 solid 1px';
			$E('nickname').style.backgroundColor = '#fff'; //border-color: rgb(255, 0, 0); background-color: rgb(255, 204, 204);
			$E('red_nickname').className = 'cudTs4';
			$E('red_nickname').getElementsByTagName('TD')[4].innerHTML = '';
			nameUsable = true;
		}
		
		var _key = false;
		var success = function(json){
			//window.location.replace((_query2json(window.location.search.slice(1),true))['r'] || ('/'+scope.$oid));
			window.location.replace('/person/recommend.php' + window.location.search);
			_key = false;
		};
		var error = function(json){
			if (json) {
				if(json.code && json.code==="R01438"){
					return App.alert($SYSMSG["R01438"]);
				}
				_promptip( $SYSMSG[json['code']], false, false, 'wrong');
			}
			else {
				_promptip($CLTMSG["CC0901"], false, false, 'error');
			}
			_key = false;
		};
		App.finishSubmit = function(){
			if(checking){
				setTimeout(App.finishSubmit,500);
			}else{
				setTimeout(function(){
					if(nameUsable && App.Checkinfo.check()){
						App.finishRumor(success,error);
					}
				},100);
			}
			return false;
			
		};
		App.finishRumor = function(success,error){
			if (_key) {
				return false
			}
			_key = true;
			var data = _html2json(_box);
			data.token = scope.$token?scope.$token:"";
			data.isusename = 0;
			for(var i = 0, len = suggestNick.length; i < len; i += 1){
				if(data.nickname == suggestNick[i]){
					data.isusename = 1;
					break;
				}
			}
			if(!App.Checkinfo.check()){
				_key = false;
				return false;
			}
			Utils.Io.Ajax.request('/person/aj_full_info.php', {
				'POST': data,
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
		}
		_addEvent(_submit, App.finishSubmit, 'click');
		_enter({
			parent : 'information_box',
			action : App.finishSubmit
		});
		_addEvent(_nickName, ajaxCheckNickName, 'blur');
	}catch(exp){console.log(exp)}
});