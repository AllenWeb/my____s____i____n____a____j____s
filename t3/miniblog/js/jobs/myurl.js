/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('diy/check.js');
$import('diy/enter.js');
$import("diy/prompttip.js");
$import("diy/copy.js");

$registJob('myurl',function(){
	try {
		var _url = $E('url');
		var _sub = $E('submit');
		var _key = false;
		
		var _trim = Core.String.trim;
		var _addEvent = Core.Events.addEvent;
		var _alert = App.alert;
		var _enter = App.enterSubmit;
		var _promptip	= function(str){
			$E('urlError').innerHTML = str;
			$E('urlError').style.display = '';
		};
		
		var _check = function(str){
			if (str.length > 20 || str.length < 4) {
				_promptip( $SYSMSG['M01115'], false, false, 'wrong');
				return false;
			}else{
				$E('urlError').style.display = 'none';
			}
			if (!RegExp("^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$").test(str)) {
				_promptip( $SYSMSG['M01118'], false, false, 'wrong');
				return false;
			}else{
				$E('urlError').style.display = 'none';
			}
			return true;
		};
		
		var _submitForm = function(){
			if (_key) {
				return false
			}
			_key = true;
			var _val = _trim(_url.value);
			var success = function(json){
				_alert({
					'code': 'A00006'
				});
				_key = false;
			};
			var error = function(json){
				if (json) {
					_promptip( $SYSMSG[json['code']], false, false, 'wrong');
				}else{
					_promptip( $SYSMSG['R01404'], false, false, 'wrong');
				}
				_key = false;
			};
			Utils.Io.Ajax.request('/person/mysite_post.php', {
				'POST': {
					'domain': _val
				},
				'onComplete': function(json){
					if (json.code == 'A00006') {
						window.location.reload(true);
						//success(json.data);
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
		_addEvent(_sub, function(){
			var _val = _trim(_url.value);
			if (!_check(_val)) {
				_key = false;
				return false;
			}
			App.confirm($CLTMSG['CD0055'],{
				'ok': function(){
					_submitForm();
				}
			});
		}, 'click');
		_addEvent(_url, function(e){
			var ev = window.event || e;
			if(ev.keyCode == 13){
				var _val = _trim(_url.value);
				if (!_check(_val)) {
					_key = false;
					return false;
				}
				App.confirm($CLTMSG['CD0055'],{
					'ok' : _submitForm
				});
			}
		}, 'keypress');
		_addEvent(_url,function(){
			_check(_url.value);
		},'blur');
		
		
		
		var copyLink = function(event){
			var copytext = $E("copytext");
			var sucStr   = $CLTMSG["CD0056"]; 
			var options  = {icon:3};
			if(App.copyText(copytext.value) == false){
				sucStr   = $CLTMSG["CD0016"];
				options  = {icon:1};
			}
			App.flyDialog(sucStr,null,$E("copylink"),options);
			Core.Events.stopEvent(event);
		}
		Core.Events.addEvent($E("copylink"),copyLink,"click");
	}catch(exp){alert(exp)}
});
