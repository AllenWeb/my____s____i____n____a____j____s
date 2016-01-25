/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("jobs/base.js");
$import("jobs/login.js");
App._LoginAction = App.LoginAction;
App.LoginAction = function(cfg){
    window.sinaSSOConfig['feedBackUrl'] = "http://expo2010.t.sina.com.cn/ajaxlogin.php";
    App._LoginAction(cfg);
};
