/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/cardtips.js");
$import("jobs/mod_login.js");
if (typeof sinaSSOConfig != "undefined") {
    sinaSSOConfig.feedBackUrl = "http://open.t.sina.com.cn/ajaxlogin.php";
};

(function(){
    setInterval(function(){
        if (typeof App.modRunToRegisterOrLogin != 'function') 
            return;
        var fun = App.modRunToRegisterOrLogin;
        App.modRunToRegisterOrLogin = function(type){
			App.modRunToRegisterOrLogin = null;
            if (type == 'register') {
                setTimeout(function(){
                   window.open('http://t.sina.com.cn/reg.php?lang=' + scope.$lang);
                }, 0)
                return;
            }
            else {
                fun(type);
            }
        }     
    }, 100)
    
})();
