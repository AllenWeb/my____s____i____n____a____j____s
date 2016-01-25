/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");


App.Validate = (function(){
    return {
        isEmpty: function(str){
            return /^\s*$/g.test(str.replace(/^\s+|\s+$/g, ''));
        },
        isNumber: function(str){
            return /^[+\-]?\d+(\.\d+)?$/.test(str)
        },
        limitInputNumber: function(){
            var events = Core.Events;
            var e = events.getEvent(), obj = events.getEventTarget();
            
            var checkIsInteger = function(str){
                if (str == "") {
                    return true;
                }
                else 
                    //chibin modify
                    if (/^(\-?)(\d+)$/.test(str)) {
                        return true;
                    }
                    else {
                        return false;
                    }
            };
            if ((!$IE) && e.charCode != 0 && !checkIsInteger(String.fromCharCode(e.charCode))) {
                events.stopEvent();
                return;
            }
            else 
                if ($IE && !checkIsInteger(String.fromCharCode(e.keyCode))) {
                    events.stopEvent();
                    return;
                }
        },
        limitSymbolInput: function(){
            var event = Core.Events.getEvent();
            if ((event.keyCode > 32 && event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 65) || (event.keyCode > 90 && event.keyCode < 97)) {
                Core.Events.stopEvent();
            }
            
            
        },
        isSelected: function(obj){
            return obj.selectedIndex == 0 ? false : true;
        }
    }
})();
