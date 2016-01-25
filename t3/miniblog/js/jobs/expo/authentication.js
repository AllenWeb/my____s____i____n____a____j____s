/**
 * @author chibin
 *
 * 认证身份
 */
$import("sina/utils/io/ajax.js");
$import("diy/htmltojson.js");
$import("jobs/information_mail.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/trim.js");
$registJob('authenticate', function(){
    var element = {
        authCode: $E('authCode'), //认证码
        authInfo: $E('authInfo'), //认证失败提示
        authInfo_msg: $E('authInfo_msg'), //认证失败内容
        verifyCode: $E('verifyCode'), //验证码
        verifyInfo: $E('verifyInfo'), //验证失败提示
        verifyInfo_msg: $E('verifyInfo_msg'), //验证失败内容
        url: '/aj_verify.php',
        nextUrl: '/volunteer.php',
        nextStep: $E('nextStep'),
        succTip: 'cudTs4',
        failTip: 'cudTs3'
    }
    var disp = {
        authFocus: function(){
            element['authCode'].style.borderColor = '#A5C760';
            element['authCode'].style.backgroundColor = '#F4FFD4';
        },
        authBlur: function(){
            element['authCode'].style.borderColor = '#999999 #C9C9C9 #C9C9C9 #999999';
            element['authCode'].style.backgroundColor = '#F8FBEF';
        },
        authError: function(){
            element['authCode'].value = '';
            element['authCode'].style.borderColor = '#FF0000';
            element['authCode'].style.backgroundColor = '#FFCCCC';
        },
        verifyFocus: function(){
            element['verifyCode'].style.borderColor = '#A5C760';
            element['verifyCode'].style.backgroundColor = '#F4FFD4';
        },
        verifyBlur: function(){
            element['verifyCode'].style.borderColor = '#999999 #C9C9C9 #C9C9C9 #999999';
            element['verifyCode'].style.backgroundColor = '#F8FBEF';
        },
        
        verifyError: function(){
            element['verifyCode'].value = '';
            element['verifyCode'].style.borderColor = '#FF0000';
            element['verifyCode'].style.backgroundColor = '#FFCCCC';
        }
    }
    //检查用的
    var check = {
        //查空
        'CC3502': function(str, type){
            if (!(str instanceof String)) {
                str = str.toString();
            }
            if ((Core.String.trim(str)).length) {
                return true;
            }
            else {
                element[type + 'Info'].className = element['failTip'];
                element[type + 'Info'].style.display = ''
                element[type + 'Info_msg'].innerHTML = App.getMsg({
                    code: 'CC3502'
                });
                return false;
            }
        },
        'MR0050': function(str, type){
            if (!(str instanceof String)) {
                str = str.toString();
            }
            if ((Core.String.trim(str)).length) {
                return true;
            }
            else {
                element[type + 'Info'].className = element['failTip'];
                element[type + 'Info'].style.display = ''
                element[type + 'Info_msg'].innerHTML = App.getMsg({
                    code: 'MR0050'
                });
                return false;
            }
        },
        //查6位数字字母
        'CC3501': function(str){
            if (new RegExp("^[a-zA-Z0-9]{6}$").test(str)) {
                element['authInfo'].style.display = ''
                element['authInfo'].className = element['succTip'];
                element['authInfo_msg'].innerHTML = '';
                return true;
            }
            else {
                element['authInfo'].className = element['failTip'];
                element['authInfo'].style.display = ''
                element['authInfo_msg'].innerHTML = App.getMsg({
                    code: 'CC3501'
                });
                return false;
            }
        },
        'M14301': function(){
            element['authInfo'].className = element['failTip'];
            element['authInfo'].style.display = ''
            element['authInfo_msg'].innerHTML = App.getMsg({
                code: 'M14301'
            });
            disp['authError']();
			element['verifyCode'].value = '';;
            App.refreshCheckCode();
            return false;
        },
        //        'MR0050': function(){
        //            element['verifyInfo'].className = element['failTip'];
        //            element['verifyInfo'].style.display = ''
        //            element['verifyInfo_msg'].innerHTML = App.getMsg({
        //                code: 'MR0050'
        //            });
        //            disp['verifyError']();
        //            return false;
        //        },
        'R01409': function(){
            element['verifyInfo'].className = element['failTip'];
            element['verifyInfo'].style.display = ''
            element['verifyInfo_msg'].innerHTML = App.getMsg({
                code: 'R01409'
            });
            disp['verifyError']();
            App.refreshCheckCode();
            return false;
        }
    };
    var checkInfo = function(str, code, type){
        for (var i = 0; i < code.length; i++) {
            if (check[code](str, type)) {
                continue;
            }
            else {
                return false;
            }
        }
        return true;
    }
    var cb = function(){
        window.location.href = element['nextUrl'];
    }
    var ecb = function(json){
        if (json) {
            check[json.code]();
        }
    }
    var req = function(){
        var param = App.htmlToJson(document, ['INPUT']);
        Utils.Io.Ajax.request(element['url'], {
            'POST': param,
            'onComplete': function(json){
                if (json && json.code == 'A00006') {
                    cb();
                }
                else {
                    ecb(json);
                }
            },
            'onException': function(){
                window.location.reload();
            },
            'returnType': 'json'
        });
    };
    Core.Events.addEvent(element['authCode'], function(){
        if (checkInfo(element['authCode'].value, ['CC3502'], 'auth')) {
            disp['authBlur']();
            return false;
        };
        disp['authError']();
    }, 'blur');
    Core.Events.addEvent(element['authCode'], function(){
        element['authInfo'].style.display = 'none';
        disp['authFocus']();
    }, 'focus');
    
    Core.Events.addEvent(element['verifyCode'], function(){
        if (checkInfo(element['verifyCode'].value, ['MR0050'], 'verify')) {
            disp['verifyBlur']();
            return false;
        };
        disp['verifyError']();
    }, 'blur');
    Core.Events.addEvent(element['verifyCode'], function(){
        element['verifyInfo'].style.display = 'none';
        disp['verifyFocus']();
    }, 'focus');
    Core.Events.addEvent(element['nextStep'], function(){
        if (!checkInfo(element['authCode'].value, ['CC3502'], 'auth')) {
            disp['authError']();
            return false;
        };
        if (!checkInfo(element['verifyCode'].value, ['MR0050'], 'verify')) {
            disp['verifyError']();
            return false;
        }
        req();
    }, 'click');
    return false;
    
});
