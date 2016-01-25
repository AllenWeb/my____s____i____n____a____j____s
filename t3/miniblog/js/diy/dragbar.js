/**
 * @author chibin
 *
 * 拖动条操作
 *
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");
/*
 * spec = {
 * bar : 拖动条
 * slider:滑块
 * dragfunc : function{}; 滑动后事件
 * step : 百分比    每点一次左划右划的百分比
 * }
 */
App.dragbar = function(spec){
    var _addevent = Core.Events.addEvent;
    var _fixevent = Core.Events.fixEvent;
    var _getEvent = Core.Events.getEvent;
    var _stopEvent = Core.Events.stopEvent;
    var _removeEvent = Core.Events.removeEvent;
    var startX, origX, deltaX;
    var _iSliderWidth, _BarWidth;
    var that = {};
    
    var init = function(spec){
        _iSliderWidth = spec['slider'].offsetWidth;
        _BarWidth = spec['bar'].offsetWidth;
        _addevent(spec['slider'], function(){
            mousedown(spec);
        }, 'mousedown');
        //		_addevent(spec['slider'],function(){mouseup(spec);},'mouseup');
        //		_addevent(document.body,function(){if(!that.ondrag) return false;
        //			if (document.selection) {
        //				document.selection.empty();
        //			}else{
        //				window.getSelection().removeAllRanges();
        //		}},'mouseup');
        //		_addevent(document.body,function(){mouseup(spec);},'mousemove');
        //		_addevent(spec['bar'],function(){mousemove(spec);},'mousemove');
        //		_addevent(spec['bar'],function(){mousedown(spec);},'mousedown');
    }
    
    var mousedown = function(){
        var evt = _fixevent(_getEvent());
        that.ondrag = true;
        startX = evt.clientX;
        origX = spec['slider'].offsetLeft;
        deltaX = startX - origX;
        _addevent(document.body, mousemove, 'mousemove');
        _addevent(document.body, mouseup, 'mouseup');
        _stopEvent();
        return false;
    };
    var mousemove = function(){
        var evt = _fixevent(_getEvent());
        var _p = (evt.clientX - deltaX) >= 0 ? (evt.clientX - deltaX) : 0;
        if (that.ondrag) {
            if (_p <= _BarWidth - _iSliderWidth) {
                spec['slider'].style["left"] = _p + "px";
            }
            else {
                _p = _BarWidth - _iSliderWidth
                spec['slider'].style["left"] = _p + "px";
            }
            that.percent = Math.ceil(_p / (_BarWidth - _iSliderWidth) * 100); // 滑动比例 用百分数表示
        }
		_stopEvent();
        return false;
    };
    var mouseup = function(){
        spec['dragfunc'](that);
        that.ondrag = false;
        _removeEvent(document.body, mousemove, 'mousemove');
        _removeEvent(document.body, mouseup, 'mouseup');
		_stopEvent();
        return false;
    };
    init(spec);
    that.step = Math.ceil((_BarWidth - _iSliderWidth) / (spec['step'] || 12));
    that.drag = function(spec){
        var left = spec['slider'].offsetLeft;
        var _p;
        if (spec['dragtype'] === 'plus') {
            _p = (left + that.step) <= (_BarWidth - _iSliderWidth) ? (left + that.step) : (_BarWidth - _iSliderWidth);
            spec.percent = _p / (_BarWidth - _iSliderWidth) * 100; // 滑动比例 用百分数表示
        }
        else {
            _p = (left - that.step) >= 0 ? (left - that.step) : 0;
            spec.percent = _p / (_BarWidth - _iSliderWidth) * 100; // 滑动比例 用百分数表示
        }
        spec['slider'].style["left"] = _p + "px";
    };
    that.drag_mousedown = function(spec){
        if (!that.hook) {
            that.hook = setInterval(function(){
                that.drag(spec);
            }, 50)
        }
        _stopEvent();
        return false;
    };
    that.drag_mouseup = function(root){
        spec['dragfunc'](spec);
        clearInterval(that.hook);
        that.hook = null;
    };
    
    return that;
};
