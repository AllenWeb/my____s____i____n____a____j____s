/**
 * @author {FlashSoft}
 */
(function () {
	var funcName = "trace";

	var _traceList = [];
	
	var _startTime = new Date().valueOf();
	var _curTime = new Date().valueOf();
	var _runTime;

	var _trace = function (sText, oOption, sBgColor) {
		oOption = oOption || {};
		if(typeof oOption == "string"){
			oOption = { "color" : oOption };
			if(typeof sBgColor != "undefined" && typeof sBgColor == "string"){
				oOption.bgColor = sBgColor;
			}
		}
		_traceList[_traceList.length] = [sText, oOption];
	};
	var _traceError = function (oError) {
		_trace(oError, {"color": "#F00"});
	};
	_trace.error = _traceError;
	_trace.traceList = _traceList;
	_trace.toString = function () {return "Trace调试已关闭";};
	window[funcName] = _trace;
	window.traceError = _traceError;
})();