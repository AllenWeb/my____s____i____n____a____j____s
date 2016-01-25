/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/base/detect.js");
$import("sina/core/events/addEvent.js");
$registJob('toolbarinstall', function(){
    var _step = scope['$toolbarstep'];
    var _ieshow = $E("status_ie");
    var _ffshow = $E("status_ff");
    var _othershow = $E("status_other");
    var _detect = Core.Base.detect;
    var _addevent = Core.Events.addEvent;
	var _ffinstallurl= scope['$ffolsetupurl'];
    //判断是否安装了插件
    if (_step == "install") {
    
        var _vivimin = $E('vivimin');
        var i = 0;
        try {
            _vivimin.IETInit(2);
			window.location.replace("/plugins/toolbar.php?step=succ");
        } 
        catch (e) {
                 if (i > 0) {   		
	        window.location.replace("/plugins/toolbar.php?step=fail");
                  }
                 i++;
        }
        return;
    }  
    var _btn_install;
    
    //loading中
    var _load_url = "/plugins/toolbar.php?step=install";   
    var foxinstall = function(){
    	var k = $CLTMSG['CX0039'];
        InstallTrigger.install({
            k : _ffinstallurl
        });
    }        
    //初始化显示
    var checkNav = function(){ 

        if (_detect.$IE) {
            //ie浏览器

            _ieshow.style.display = "";
            _ffshow.style.display = "none";
            _othershow.style.display = "none";
            
            return 1;
        }
        if (_detect.$MOZ && !_detect.$SAFARI ) {
            //moz浏览器

            _ffshow.style.display = "";
            _ieshow.style.display = "none";
            _othershow.style.display = "none";
            
            return 2;
        }
        else {
            _othershow.style.display = "";
            _ffshow.style.display = "none";
            _ieshow.style.display = "none";
            return 3;
        }
    };
    var pluginstall = function(type){
        //ie浏览器在线安装
        if (type == 1) {
            _btn_install = $E("ieinstall");
            _addevent(_btn_install, function(){
                window.location.replace(_load_url);
				 Core.Events.stopEvent();
            }, 'click');
        }
        //ff浏览器下载安装
        if (type == 2) {
            _btn_install = $E("ffinstall")
            _addevent(_btn_install, function(){
                foxinstall();
				 Core.Events.stopEvent();
            }, 'click');
        }
        return false;
    }
    var question = function(){
        var _answer = $E("answer");
        if (_answer) {
            _answer.style.display = "none";
        }
        if ($E("question")) {
            _addevent($E("question"), function(){
                if (_answer) {
                    if (_answer.style.display == "none") {
                        _answer.style.display = "";
                    }
                    else {
                        _answer.style.display = "none";
                    }
					 Core.Events.stopEvent();
                }
            }, 'click');
        }
        
    }	
	var failreload = function(){
		var rfail = $E("fail_reload");
		if (rfail){
			_addevent(rfail, function(){
                //window.location.replace("/plug/toolbar.php?step=install");
				window.location.replace("/plugins/toolbar.php?step=install");
				 Core.Events.stopEvent();
            }, 'click');
		}
	}
    
    //程序start
	failreload();
    question();
    var exptype = checkNav();
    pluginstall(exptype);
    
    
    
});
