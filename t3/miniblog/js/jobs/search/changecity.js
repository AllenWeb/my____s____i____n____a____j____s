/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/winSize.js");
$import("diy/samecitydialog.js");
$import("diy/querytojson.js");
$import("diy/jsontoquery.js");
App.search_city = function(el){
    if (scope.areadialog) {
        return false;
    }
    scope.areadialog = new App.AreaDialog(el);
    Core.Events.addEvent(scope.areadialog._elsubmit, function(){
		var sdata = App.queryToJson(window.location.search.slice(1));
		sdata.province = (scope.areadialog._province.getAttribute('truevalue') && scope.areadialog._province.value);
		sdata.city = (scope.areadialog._city.getAttribute('truevalue') && scope.areadialog._city.value);
        //window.location.href = "/pub/city?p=" + (scope.areadialog._province.getAttribute('truevalue') && scope.areadialog._province.value) + "&c=" + (scope.areadialog._city.getAttribute('truevalue') && scope.areadialog._city.value);
    	window.location.href = 'http://t.sina.com.cn/search/user.php?' + App.jsonToQuery(sdata);
	}, 'click');
    Core.Events.addEvent(el, function(){
        Core.Events.stopEvent();
        return false;
    }, "click");
	scope.areadialog.show();
	Core.Events.stopEvent();
    Core.Events.addEvent(document.body, function(){
        if (scope.areadialog) {
            scope.areadialog.close();
            scope.areadialog = null;
        }
        return false;
    }, "click");
};
