/**
 * @author chibin
 */
$import("jobs/base.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/getXY.js");
$import("diy/querytojson.js");
$import("diy/date.js");
//
//$registJob('square_dateselect', function(){	
//	App.square_dateselect()
//});
App.square_dateselect = function(url, el){

    try {
		var date = [];
        try {
            date = $E("dateselect").innerHTML.split('-');
        } 
        catch (ex) {
        }
        
        var box = document.createElement('DIV');
        var btn = el;
        if (date.length) {
            btn.innerHTML = date.join('-');
        }
        else {
            btn.innerHTML = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate();
        }
        box.style.cssText = 'position:absolute;display:none';
        var pos = Core.Dom.getXY(btn);
        box.style.left = pos[0] + 'px';
        box.style.top = pos[1] + 20 + 'px';
        document.body.appendChild(box);
        box.className = "pc_caldr";
        new domkey.Date(box, function(y, m, d){
			window.location.href = url + '&t=' + y + '-' + (parseInt(m) + 1) + '-' + d;
            return false;
        }, (date[0] ? parseInt(date[0],10) : (new Date()).getFullYear()), //年
 (date[1] ? parseInt(date[1],10) : (new Date()).getMonth() + 1) - 1, //月
 (new Date(parseInt(scope.$severtime,10) * 1000)), //点击范围开始
 Math.ceil(((new Date()).getTime() - 1258646400000) / (24 * 60 * 60 * 1000)),//点击范围长度［天］
 (parseInt(date[2]) || ((new Date()).getDate())) //选择日期
);
        box.style.display = '';
        Core.Events.stopEvent();

        box.onclick = function(){
            Core.Events.stopEvent();
            return false;
        };
        
        //Core.Events.removeEvent(document.body,hidd , 'click');
        var hidd = function(){
            box.style.display = 'none';
			Core.Events.removeEvent(document.body,hidd , 'click');
        }
        Core.Events.addEvent(document.body,hidd , 'click');
    } 
    catch (exp) {
    
    }
    
};
