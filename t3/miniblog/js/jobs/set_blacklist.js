/**
 * @author chibin  
 * @updated by yuwei
 * 黑名单管理
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/flyDialog.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getElementsByClass.js");
/*
 * 屏蔽用户,加入到黑名单
 */
App.move_to_blacklist = function(uid, el, name,sex){
    App.shielduserope("add",  el, {
        fuid: scope.$uid,
        touid: uid
    }, name,sex);
};

/*
 * 取消屏蔽用户，移除黑名单
 * 
 * act＝1表明用来在黑名单管理页面操作
 */
App.remove_from_blacklist = function(uid, el, name,sex,act){
    App.shielduserope("remove",  el, {
        fuid: scope.$uid,
        touid: uid
    }, name , sex,act);
};

/*
 * params:{
 * fuid:当前用户id
 * touid:被添加黑名单用户的ID
 * }
 */
//具体操作
App.shielduserope = function(type, el, params, name ,sex,act){
    if (!scope.$uid) {
        location.replace("/login.php?url=" + encodeURIComponent(location.href));
        return false;
    }
    var _dorequest = App.doRequest;
    var _shieldope = {};
    _shieldope['type'] = type;
	_shieldope['act'] = act?act:'';
    _shieldope['url'] = _shieldope['type'] == "add" ? "/blacklist/addblacklist.php" : "/blacklist/delblacklist.php";
    _shieldope['params'] = params;
    //添加黑名单成功回调
    _shieldope['addcb'] = function(json){
        var _dialog = App.alert(_shieldope['alertHTML'](name),{icon:3,hasBtn:false});
        setTimeout(function(){
            _dialog.close();
            window.location.reload(true);
        }, 1000);
    }
    //取消黑名单成功回调
    _shieldope['removecb'] = function(data,result){
		if(_shieldope['act']=='1'){
			//act为1是黑名单管理列表页，删除当前行
			var tmp = el;
			while(tmp.nodeName.toLowerCase() != 'li'){
				tmp = tmp.parentNode;
			}
			Core.Dom.removeNode(tmp);
		}
		window.location.reload();
    }
    
    //失败回调
    _shieldope['error'] = function(json){
        if (json.code) {
            App.alert({
                code: json.code
            });
        }
        else {
            App.alert($CLTMSG["CC0701"]);
        }
    }
    _shieldope['confimmsg'] = function(shieldname){
        return {
            des: "<div id='black_list_txt'><strong style='font-size:14px;'>" + $CLTMSG['CD0086'].replace(/#\{name\}/,shieldname) +
            "</strong>" +
            "<br><div style='margin-top:5px;'>" + $CLTMSG['CD0087'].replace(/#\{sex\}/g,sex) + "</div></div>"
        }
    }
    _shieldope['alertHTML'] = function(shieldname){
        return $CLTMSG['CD0088'].replace(/#\{name\}/,shieldname);
    }
    _shieldope['dialog'] = function(name, el, ok){
        //飞出
        var confirmdia = App.flyDialog(_shieldope['confimmsg'](name), "confirm", el, {
            "icon": 1,
            'width':400,
            "ok": function(){
                if (typeof ok === "function") {
                    ok()
                }
            }
        });
        var style = $E("black_list_txt").parentNode.style;
        style.width = "270px";
        style.marginTop = "-10px";
        return confirmdia;
    }
	//程序start
    if (_shieldope['type'] == "add") {
        _shieldope['dialog'](name, el, function(){
            _dorequest(_shieldope['params'], _shieldope['url'], _shieldope['addcb'], _shieldope['error'])
        }, _shieldope['type']);
    }
    else {
    	App.flyDialog($CLTMSG["CD0089"], "confirm", el, {
            "icon": 1,
            'width':377,
            "ok": function(){
                 _dorequest(_shieldope['params'], _shieldope['url'], _shieldope['removecb'], _shieldope['error']);
            }
        });
    }
};