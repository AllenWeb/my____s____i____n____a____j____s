/**
 * @author chibin
 * password
 */
$import("sina/sina.js");
$import("sina/app.js");
//$import("sina/utils/cookie/cookie.js");
//$import("msg/clientmsg.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/fireEvent.js');
App.setPassword = function(id,tid){
    var _password_input = $E(id);//password
	var _password_input_text = $E(tid)   //text
    if (_password_input) {
        if (_password_input.value == "") {
            //_password_input.setAttribute('type','text');
			_password_input.style.display="none";
			_password_input_text.style.display="";
            _password_input_text.value = $SYSMSG['M00902'];
        }
    }
//	Core.Events.addEvent(_password_input, function(){
//        if (_password_input.value == '' || _password_input.value == $SYSMSG['M00902']) {
//            if (_password_input.tagName == 'INPUT' && (_password_input.type == 'text' || _password_input.getAttribute('type') == 'text')) {
//                _password_input.value="";
//				_password_input.setAttribute('type','password');
//            }
//        }
//		return false
//    }, 'focus')
	
	Core.Events.addEvent(_password_input_text, function(){
//        if (_password_input.value == '' || _password_input.value == $SYSMSG['M00902']) {
//            if (_password_input.tagName == 'INPUT' && (_password_input.type == 'text' || _password_input.getAttribute('type') == 'text')) {
//                _password_input.value="";
//                _password_input.setAttribute('type','password');
//            }
//        }
        _password_input_text.style.display="none";
		
		_password_input.style.display="";
		_password_input.focus();
        return false
    }, 'focus')
	
	Core.Events.addEvent(_password_input, function(){
		if (_password_input.value == '') {
            if (_password_input.tagName == 'INPUT' && (_password_input.type == 'password' || _password_input.getAttribute('type') == 'password')) {
                //_password_input.setAttribute('type','text');
				_password_input.style.display="none";
		        _password_input_text.value = $SYSMSG['M00902'];
				_password_input_text.style.display="";
				Core.Events.fireEvent(_password_input_text,'blur');
            }
        }
		return false
    }, 'blur')
    return false;
};
