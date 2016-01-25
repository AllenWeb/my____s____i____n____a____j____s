/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");
$registJob('sharebookmarks', function(){
    var _sharebtn = $E("share");
    var _addEvent = Core.Events.addEvent;
    var _detect = Core.Base.detect;
    var _ieshow = $E("iehelp");
    var _ffshow = $E("ffhelp");
    var _ietext = $E("ieinfo");
    var _fftext = $E("ffinfo");
    var _ieaction = $E("ieaction");
    var _ffaction = $E("ffaction");
    var exptype;
    var navtype = function(){
        if (_detect.$IE) {
            //ie浏览器           
            _ffshow.style.display = "none";
            _fftext.style.display = "none";
            _ffaction.style.display = "none";
            _ieshow.style.display = "";
            _ietext.style.display = "";
            _ieaction.style.display = "";
            return 1;
        }
        else {
            _ieshow.style.display = "none";
            _ietext.style.display = "none";
            _ieaction.style.display = "none";
            _ffshow.style.display = "";
            _fftext.style.display = "";
            _ffaction.style.display = "";
            return 2;
        }
    }
    var _changeAtt = function(type, btn){
        btn.title = btn.alt = $CLTMSG["CD0093"];
        btn.href = "javascript:(function(){window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href)+'&source=bookmark','_blank','width=450,height=400');})()";        
        //ff的
        if (type == 2) {
            _sharebtn.style.cursor = "move";
        }
    }
    var _alerttext = function(type, btn){   
        var msg;
        if (type == 1) {
            msg = $CLTMSG["CD0094"];
        }
        else {
            msg = $CLTMSG["CD0095"];
        }
        App.alert(msg);
        return false;
    }
    
    //程序start
    exptype = navtype();    
    _changeAtt(exptype, _sharebtn);
    _addEvent(_sharebtn, (function(type, btn){
        return function(){
            _alerttext(type, btn);
            Core.Events.stopEvent();
        };
    })(exptype, _sharebtn), "click");
});

