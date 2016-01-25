/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");

App.scrollToTarget = (function(){
	//timer
	var clock = (function(){
		var _oTimer, _oInstance = {};
		_oInstance.stop = function(){
			clearInterval(_oTimer);
		};
		_oInstance.start = function(fMethod){
			_oInstance.stop();
			_oTimer = setInterval(function(){
				!fMethod() && _oInstance.stop();
			},20);
		};
		return _oInstance;
	})();
	//animation
	var animation = function(nForm, nTo){
		var _nTop = nForm;
		var _distance = nTo - nForm;
		var _nOffset = Math.abs(_distance), _oInstance = {};
		var _nSpeed = _distance * 30 /500;
		_oInstance.flush = function(){
			if(_nSpeed>0){
				_nSpeed -= _nSpeed/30;
				_nTop = ((_nTop+_nSpeed)<nTo)?_nTop+_nSpeed:nTo;
			}
			else 
			if(_nSpeed<0){
				_nSpeed += _nSpeed/30;
				_nTop = ((_nTop+_nSpeed)>nTo)?_nTop+_nSpeed:nTo;
			}
			document.documentElement.scrollTop = _nTop;
			if(_nTop == nTo){
				return false;
			}
			return true;
		}
		return _oInstance;
	};
	return function(oElement){
		try {
			var _sTop, _eTop, _nOffset;
			_sTop = Math.max(document.body.scrollTop, (document.documentElement) ? document.documentElement.scrollTop : 0);
			_eTop = (typeof oElement == "number")? oElement : Core.Dom.getXY(oElement)[1];
			clock.start(animation(_sTop, _eTop).flush);
		}catch(e){}
	}; 
})();

