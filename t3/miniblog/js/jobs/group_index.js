/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/isArray.js");
$import("diy/dialog.js");
$import("diy/htmltojson.js");
$import('sina/utils/cookie/cookie.js');
$registJob('group_option', function(){
    if(!scope.groupList||scope.groupList.length==0){
		return;
	}
	//我的首页li
    var _li_myprofile = $E("li_myprofile");
    var _addevent = Core.Events.addEvent;
    //分组列表页
    var _showgroups = $E("showgroups");
    var _addEvent = Core.Events.addEvent;		
//	_addevent(_li_myprofile,function(){
//		_showgroups.style.display="";
//		Core.Events.stopEvent();
//	},"mouseover");
//	_addevent(_li_myprofile,function(){
//		_showgroups.style.display="none";
//		Core.Events.stopEvent();
//	},"mouseout");
    
});
App.groupshow_index = function(el){
	var ul_group = $E("ul_group");
    if (el.innerHTML.indexOf("&gt;") >= 0 || el.innerHTML.indexOf(">") >= 0) {
       //show
        el.innerHTML = "&lt;";
        ul_group.style.display = "none";
		//chibin add 为了增加cookie设置
		Utils.Cookie.setCookie('gopen','0',24*7,false,'t.sina.com.cn',false);
   }
   else {
       //hidden
        el.innerHTML = "&gt;";
        ul_group.style.display = "";
		Utils.Cookie.setCookie('gopen','1',24*7,false,'t.sina.com.cn',false);
    }
};
App.group_option = function(){
	if(!scope.groupList||scope.groupList.length==0){
		return false;
	}
    var _glist = scope.groupList;
    var _html = function(){
        var _head = '<div id="group_options" class = "shareLayer"><div class="shareTxt">'+$CLTMSG['CC1101']+'</div>';
        var _middle = '';
		if(_glist.length>0){
			_middle = '<ul class="group_list">';						
		}
        for (var i = 0; i < _glist.length; i++) {
            _middle += '<li><input type="checkbox" value="' + _glist[i].gid + '" name="groupoption" class="labelbox" id="input' + i + '"' + (_glist[i].display == "1" ? "checked" : "") + '/><label for="input' + i + '">' + _glist[i].name + '</label></p>';
        }
		if(_glist.length>0){
			_middle +='</ul>';
		}
        var _tail = '<div class="MIB_btn"><a id="group_submit" href="javascript:void(0)" class="btn_normal"><em>'+$CLTMSG['CD0155']+'</em></a><a id="group_cancel" href="javascript:void(0)" class="btn_normal"><em>'+$CLTMSG['CD0153']+'</em></a></div></div>';
        return _head + _middle + _tail;
    };
	
    var _dialog = new App.Dialog.BasicDialog($CLTMSG['CC1104'], _html(), {
        zIndex: 1200,
        hidden: true
    });
    var _addEvent = Core.Events.addEvent;
    var _gsubmit = $E("group_submit");
    var _gcancel = $E("group_cancel");
    var _group_options = $E("group_options");
    var _getparams = function(){
        return App.htmlToJson(_group_options);
    }
    var url="/attention/aj_group_setdisplay.php";
    var cb = function(){
        _dialog.close();
        window.location.reload();
    };
    var ecb = function(json){
        _dialog.close();
        if (json) {
            App.alert({
                code: json.code
            });
        }
        else {
            App.alert({
                code: "R01404"
            });
        }
        
    };
    _dialog.show();
    var _submitevent = function(){
		var group = _getparams();
		var params = {
            gids: Core.Array.isArray(group["groupoption"])?group["groupoption"].join(","):group["groupoption"]
        };
        App.doRequest(params, url, cb, ecb);
    }
    _addEvent(_gsubmit, function(){
        _submitevent();
    }, "click");
    _addEvent(_gcancel, function(){
        _dialog.close();
    }, "click");
	//-------------发送分组点击统计信息------------------
    var oScript = document.createElement("script");
	oScript.src = "http://hits.sinajs.cn/c.html?action=groupshow&uid="+scope.$uid;
	document.body.appendChild(oScript);
    //----------------------------------------------
};

