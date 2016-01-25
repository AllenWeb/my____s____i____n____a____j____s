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
$import("diy/mb_dialog.js");
$import("sina/utils/url.js");
$import("diy/url.js");
$import("diy/querytojson.js");

$registJob('finishinfo', function(){
	(function(w,d){var dw,dh,de = d.documentElement;dw = (de && de.clientWidth)?de.clientWidth:d.body.clientWidth;dh=(de && de.clientWidth)?de.clientHeight:d.body.clientHeight;if(dw<620||dh<450){window.resizeTo(620,450)}})(window,document);
	try {
		
		if(scope.isfull=="1"){
			window.opener.location.reload();
			setTimeout(function(){
				window.close();
			},10);
			return false;
		}
		
		var _box = $E('information_box');
		var _province = $E('province');
		var _city = $E('city');
		var _submit = $E('submit');
		var _gender = $E('gender');
		
		var _html2json = App.htmlToJson;
		var _query2json = App.queryToJson;
		var _bindCity = App.ProvinceAndCity;
		var _addEvent = Core.Events.addEvent;
		var _checkNick = App.checkMiniName;
		var _trim = Core.String.trim;
		var _alert = App.alert;
		var _enter = App.enterSubmit;
				
		var _promptip	= function(msgCode, replace, id, type){
			$E("system_information").innerHTML = msgCode;
			$E("system_information").style.display = '';
			$E("system_information").className = "n_errorTs";
		};
		if (_city) {
			new _bindCity(_province, _city, (_province.getAttribute('truevalue') || _province.value), (_city.getAttribute('truevalue') || _city.value));
		}
		
		var _key = false;
		App.finishSubmit = function(){
			if (_key) {
				return false
			}
			_key = true;
			$E("system_information").className = "n_errornull";
			$E("system_information").innerHTML = "";
			var data = _html2json(_box);
			if (data['nickname'] !== undefined) {
				data['nickname'] = _trim(data['nickname']);
				if (!_checkNick(data['nickname'])) {
					_promptip( $SYSMSG['M01005'], false, false, 'wrong');
					_key = false;
					return false;
				}
				if(/^[0-9]*$/.test(data['nickname'])){
					_promptip( $SYSMSG['M01005'], false, false, 'wrong');
					_key = false;
					return false;
				}
			}
			if (data['province']) {
				if (data['province'] === '0') {
					_promptip( $SYSMSG['M01007'], false, false, 'wrong');
					_key = false;
					return false;
				}
			}
			if (_gender) {
				if (!data['gender']) {
					_promptip( $SYSMSG['M01104'], false, false, 'wrong');
					_key = false;
					return false;
				}
			}
			if (data['invitecode'] !== undefined){
				data['invitecode'] = _trim(data['invitecode']);
				if	(!/^[0-9a-zA-Z]{5,32}$/.test(data['invitecode'])){
					_promptip( $SYSMSG['M01130'], false, false, 'wrong');
					_key = false;
					return false;
				}
			}
			var success = function(json){
				try {
					var url = '/'
					var redirect = '/';
					url = (App.parseUrl(location.href)).query;
					redirect = App.queryToJson(url,true)['r'];
				}catch(ex){
					
				}
				if(redirect === undefined || redirect=="/"){
					window.opener.location.reload(true);
					_key = false;
					setTimeout(function(){
						window.close();
					},10);
				}else{
					window.location.href = redirect;
				}
				
			};
			var error = function(json){
				if (json) {
					_promptip( $SYSMSG[json['code']], false, false, 'wrong');
				}
//				else {
//					_promptip( $SYSMSG[json['code']], false, false, 'error');
//				}
				_key = false;
			};
			data.token = scope.$token?scope.$token:"";
			Utils.Io.Ajax.request('/widget/aj_full_info.php', {
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
			return false;
		};
		_addEvent(_submit, App.finishSubmit, 'click');
		_enter({
			parent : 'information_box',
			action : App.finishSubmit
		});
	}catch(exp){console.log(exp)}
});