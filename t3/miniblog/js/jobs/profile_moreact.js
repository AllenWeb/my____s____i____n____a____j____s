/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import("jobs/group_manage.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/array/isArray.js");
$import("diy/htmltojson.js");
$import("sina/core/dom/insertHTML.js");
//他人首页更多操作
App.profile_moreact = function(specdom, nick){
    var obj_msg = scope.letter ||
    {
        show: false
    };//私信
    var obj_grp = {
        show: false
    };//scope.setGroup || {show: false};//分组
    var obj_nickname = scope.nickname ||
    {
        show: false
    };//昵称
    var obj_recfriend = scope.recFriend ||
    {
        show: false
    };//推荐
    var obj_black = scope.black ||
    {
        show: false
    };//黑名单
    var obj_fans = {
        show: (scope.isfans ? true : false)
    };//粉丝
    var common = [{
        'tagName': 'IFRAME',
        'attributes': {
            'frameborder': '0',
            'src': 'about:blank',
            'class': '',
            'id': 'ifm',
            'style': 'position: absolute; z-index: 120; left: 100px; top: 100px;'
        }
    }, {
        'tagName': 'UL',
        'attributes': {
            'class': 'handle_menu',
            'id': 'handle_menu',
            'style': 'position: absolute; z-index: 600; left: 100px; top: 100px;'
        },
        'childList': [{
            'tagName': 'LI',
            'attributes': {
                'id': 'message'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'letter',
                    'id': 'btn_message',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CD0054']
                }
            }]
        }, {
            'tagName': 'LI',
            'attributes': {
                'id': 'group'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'set_group',
                    'id': 'btn_group',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CD0059']
                }
            }//暂时保留分组
]
        }, {
            'tagName': 'LI',
            'attributes': {
                'id': 'delfans'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'del_fans',
                    'id': 'btn_delfans',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CY0104']
                }
            }]
        }, {
            'tagName': 'LI',
            'attributes': {
                'id': 'nickname'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'nickname',
                    'id': 'btn_nickname',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CD0060']
                }
            }]
        }, {
            'tagName': 'LI',
            'attributes': {
                'id': 'friend'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'rec_friend',
                    'id': 'btn_friend',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CX0028']
                }
            }]
        }, {
            'tagName': 'LI',
            'attributes': {
                'id': 'black_list'
            },
            'childList': [{
                'tagName': 'A',
                'attributes': {
                    'class': 'black_list',
                    'id': 'btn_black_list',
                    'href': 'javascript:void(0);',
                    'innerHTML': $CLTMSG['CD0061']
                }
            }]
        }]
    }];
    var set_position = function(dom, tips){
        var pos = Core.Dom.getXY(dom);
        Core.Dom.setXY(tips.box, [pos[0], pos[1] + dom.offsetHeight - 4]);
        Core.Dom.setXY(tips.ifm, [pos[0], pos[1] + dom.offsetHeight - 4]);
    };
    var set_evt = function(el_tips){
        //私信
        Core.Events.addEvent(el_tips.domList['btn_message'], function(){
            App.msgDialog(decodeURIComponent(obj_msg['name']), false);
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, "click");
        //分组
        Core.Events.addEvent(el_tips.domList['btn_group'], function(){
            App.grpDialog(scope.setGroup);
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, "click");
        //备注
        Core.Events.addEvent(el_tips.domList['btn_nickname'], function(){
            App.followRemarkAdd('', obj_nickname['oid'] || '', Core.String.decodeHTML(decodeURIComponent(obj_nickname['remarkName'])) || '');
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, "click");
        //推荐给朋友
        Core.Events.addEvent(el_tips.domList['btn_friend'], function(){
            App.modrecommended(decodeURIComponent(obj_recfriend['name']));
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, "click");
        //不在黑名单中，加他黑死他
        Core.Events.addEvent(el_tips.domList['btn_black_list'], function(){
            App.move_to_blacklist(obj_black['oid'], el_tips.domList['black_list'], decodeURIComponent(obj_black['name']), decodeURIComponent(obj_black['ta']));
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, "click");
        //移除粉丝
        Core.Events.addEvent(el_tips.domList['btn_delfans'], function(){
            App.followcancel(scope.$oid, el_tips.domList['btn_delfans'], 1, decodeURIComponent(obj_recfriend['name']));
            el_tips.box.style.display = "none";
            el_tips.ifm.style.display = "none";
        }, 'click');
    }
    var setdisplay = function(el_tips){
        if (!obj_msg["show"]) {
            el_tips.domList["message"].style.display = "none";
        }
        else {
            el_tips.domList["message"].style.display = "";
        }
        if (!obj_grp["show"]) {
            el_tips.domList["group"].style.display = "none";
        }
        else {
            el_tips.domList["group"].style.display = "";
        }
        if (!obj_nickname["show"]) {
            el_tips.domList["nickname"].style.display = "none";
        }
        else {
            el_tips.domList["nickname"].style.display = "";
        }
        if (!obj_recfriend["show"]) {
            el_tips.domList["friend"].style.display = "none";
        }
        else {
            el_tips.domList["friend"].style.display = "";
        }
        if (!obj_black["show"]) {
            el_tips.domList["black_list"].style.display = "none";
        }
        else {
            el_tips.domList["black_list"].style.display = "";
        }
        if (!obj_fans["show"]) {
            el_tips.domList["delfans"].style.display = "none";
        }
        else {
            el_tips.domList["delfans"].style.display = "";
        }
        el_tips.box.style.display = "";
    };
    scope.moreactshowing = true;
    if (!scope.moreact) {
        scope.moreact = new App.Builder(common);
        scope.moreact.box = scope.moreact.domList['handle_menu'];
        scope.moreact.ifm = scope.moreact.domList['ifm'];
        document.body.appendChild(scope.moreact.ifm);
        document.body.appendChild(scope.moreact.box);
        setdisplay(scope.moreact);
        set_evt(scope.moreact)
        scope.moreact.ifm.style.position = 'absolute'
        scope.moreact.box.style.position = 'absolute';
        scope.moreact.ifm.style.zIndex = 600;
        scope.moreact.box.style.zIndex = 600;
        scope.moreact.ifm.style.height = scope.moreact.box.offsetHeight + "px";
        scope.moreact.ifm.style.width = scope.moreact.box.offsetWidth + "px";
        var tk;
        if (specdom) {
            set_position(specdom, scope.moreact);
            tk = setInterval(function(){
                set_position(specdom, scope.moreact);
            }, 100);
        };
        Core.Events.addEvent(specdom, function(){
            scope.moreactshowing = false;
            setTimeout(function(){
                if (!scope.moreactshowing) {
                    hidd_moreact();
                }
            }, 100);
        }, 'mouseout');
        Core.Events.addEvent(scope.moreact.box, function(){
            scope.moreactshowing = true;
        }, 'mouseover');
        Core.Events.addEvent(scope.moreact.box, function(){
            scope.moreactshowing = false;
            setTimeout(function(){
                if (!scope.moreactshowing) {
                    hidd_moreact();
                }
            }, 100);
        }, 'mouseout');
        
    }
    else {
        setdisplay(scope.moreact);
    }
    //点击外面直接关闭层
    var hidd_moreact = function(e){
        var oEvent = Core.Events.getEvent();
        var oTarget = oEvent ? (oEvent.srcElement || oEvent.target) : null;
        while (oTarget && oTarget != document.body) {
            if (oTarget == scope.moreact.box || oTarget == $E("moreact")) {
                return true;
            }
            oTarget = oTarget.parentNode;
        }
        if (scope.moreact) {
            scope.moreact.box.style.display = "none";
            scope.moreact.ifm.style.display = "none";
        }
        Core.Events.removeEvent(document.body, hidd_moreact, 'click');
    }
    Core.Events.addEvent(document.body, hidd_moreact, 'click');
};

App.grpDialog = function(objgrp, isreload){
    var nick = decodeURIComponent(objgrp['name']);
    //获取此人的groupid
    var arr_mygrp = objgrp['gids'] ? objgrp['gids'].split(',') : '';
    var arr_grp = App.group_manage.list();
    var fuid = objgrp['oid'];
    for (var i = 0, len = arr_grp.length; i < len; i += 1) {
        arr_grp[i]["checked"] = false;
        for (var j = 0, len2 = arr_mygrp.length; j < len2; j += 1) {
            if (arr_mygrp[j] == arr_grp[i][('gid')]) {
                arr_grp[i]["checked"] = true;
            }
        }
    }
    var li_html = function(){
        var a = '';
        for (var j = 0; j < arr_grp.length; j++) {
            a = a + '<li><input type="checkbox" value="' + arr_grp[j]["gid"] + '" class="labelbox" name="group_dialog_' + arr_grp[j]["gid"] + '" id="group_dialog_' + arr_grp[j]["gid"] + '"' + (arr_grp[j]["checked"] ? "  checked" : "") + '/><label for="group_dialog_' + arr_grp[j]["gid"] + '" title="' + Core.String.decodeHTML(Core.String.encodeHTML(arr_grp[j]["name"])) + '">' + Core.String.decodeHTML(Core.String.encodeHTML(arr_grp[j]["name"])) + '</label></li>'
        }
        return a;
    }
    
    var html = '<div class="shareLayer">\
                            <div class="shareTxt" id="shareTxt">' + (scope.groupList.length <= 0 ? $CLTMSG['CY0101'] : $CLTMSG['CD0062']) + '</div>\
							<ul id="group_list" class="group_list">' +
    li_html() +
    '</ul>\
							<div class="addNew"><a id="creategrp" href="javascript:void(0);"><em>+</em>' +
    $CLTMSG['CD0063'] +
    '</a></div>\
                            <div id="newgrp" class="newBox" style="display:none">\
                            	<div class="newBox_input">\
                                	<input id="group_input" type="text" value="' +
    $CLTMSG['CD0064'] +
    '" class="newBox_txt"/> <a href="javascript:void(0);" id="create_group" class="btn_normal"><em>' +
    $CLTMSG['CD0065'] +
    '</em></a>  <a href="javascript:void(0);" id="cancel_group">' +
    $CLTMSG['CD0005'] +
    '</a>\
                                </div>\
                                <p id="group_error" class="newBox_err error_color" style="display:none">' +
    $CLTMSG['CD0066'] +
    '</p>\
                            </div>\
                            <div class="MIB_btn">\
						 <a href="javascript:void(0)" id="g_submit" class="btn_normal"><em>' +
    $CLTMSG['CD0155'] +
    '</em></a>\
						 <a href="javascript:void(0)" id="g_nogroup" class="btn_normal"><em>' +
    $CLTMSG['CD0153'] +
    '</em></a>\
						 </div>\
                        </div>';
    html = html.replace(/#\{nick\}/, nick);
    
    //dialog配置
    var c = {
        width: 390,
        zIndex: 1200,
        hidden: true
    };
    
    var oDialog = new App.Dialog.BasicDialog($CLTMSG["CD0154"], html, c);
    
    
    
    var oElement = {
        submit: $E("g_submit"),
        shareTxt: $E("shareTxt"),
        notgroup: $E("g_nogroup"),
        creategroup: $E("create_group"),
        creategrp: $E("creategrp"),
        newgrp: $E("newgrp"),
        group_error: $E("group_error"),
        group_input: $E("group_input"),
        group_list: $E("group_list"),
        cancel_group: $E("cancel_group")
    };
    //超过20个则不允许添加新分组了
    if (scope.groupList.length >= 20) {
        oElement['creategrp'].style.display = "none";
    }
    else {
        oElement['creategrp'].style.display = "";
    }
    if (scope.groupList.length <= 0) {
        oElement['creategrp'].style.display = "none";
        oElement['newgrp'].style.display = '';
        oElement['newgrp'].className = 'newBox newBox_noBg';
        oElement['submit'].style.display = 'none';
        oElement['notgroup'].style.display = 'none';
    }
    else {
        if (scope.groupList.length < 20) {
            oElement['creategrp'].style.display = "";
        }
        oElement['newgrp'].style.display = "none";
        oElement['newgrp'].className = 'newBox';
        oElement['submit'].style.display = '';
        oElement['notgroup'].style.display = '';
    }
    oDialog.show();
    //判断b是否都在a里并且b和a的长度一样长
    var checksamegids = function(a, b){
        if (a.length != b.length) {
            return true;
        }
        else {
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < b.length; j++) {
                    if (a[i] == b[j]) {
                        break;
                    }
                    else 
                        if (j == b.length - 1) {
                            return true;
                        }
                }
            }
            return false;
        }
    }
    oElement['submit'].onclick = function(){
        var gids = App.htmlToJson(oElement['group_list'], ['input']);
        var arr_gids = new Array();
        for (var key in gids) {
            arr_gids.push(gids[key]);
        }
        //chibin add
        if (checksamegids(arr_gids, arr_mygrp)) {
            App.group_manage.addAll({
                'group_id': arr_gids.join(","),
                'person_id': fuid,
                'success': function(json){
                    oDialog.close();
                    if (scope.groupList.length > 0) {
                        var d = App.alert($CLTMSG["CD0067"], {
                            ok: function(){
                                window.location.reload(true);
                            },
                            icon: 3,
                            hasBtn: false
                        });
                        setTimeout(function(){
                            window.location.reload(true);
                        }, 1000);
                    }
                    else {
                        if (isreload) {
                            window.location.reload(true);
                        }
                        oDialog.close();
                    }
                }
            })
        }
        else {
            if (isreload) {
                window.location.reload(true);
            }
            oDialog.close();
        };
            }
    oElement['notgroup'].onclick = function(){
        oDialog.close();
        if (isreload) {
            window.location.reload(true);
        }
    };
    var newGroup = $CLTMSG["CD0064"];
    oElement['cancel_group'].onclick = function(){
        if (scope.groupList.length <= 0) {
            oDialog.close();
            return false;
        }
        oElement['creategrp'].style.display = "";
        oElement['newgrp'].style.display = "none";
        oElement['group_input'].value = newGroup;
        oElement['group_error'].style.display = "none";
    }
    oElement['group_input'].onfocus = function(){
        if (oElement['group_input'].value == newGroup) {
            oElement['group_input'].value = '';
        }
    }
    oElement['group_input'].onblur = function(){
        if (Core.String.trim(oElement['group_input'].value) == "") {
            oElement['group_input'].value = newGroup;
        }
    }
    oElement['creategroup'].onclick = function(){
        if (oElement['creategroup'].locked) {
            return false;
        }
        if (!checkGroupName()) {
            return false;
        }
        oElement['group_input'].value = Core.String.trim(oElement['group_input'].value);
        if (!oElement['group_input'].value) {
            return false;
        }
        
        oElement['creategroup'].locked = true;
        App.group_manage.create({
            'name': Core.String.trim(oElement['group_input'].value),
            'success': function(json){
                oElement['group_input'].blur();
                oElement['creategrp'].style.display = "";
                oElement['newgrp'].style.display = "none";
                oElement['group_error'].style.display = "none";
                Core.Dom.insertHTML(oElement['group_list'], '<li><input type="checkbox" value="' + json + '" class="labelbox" name="group_dialog_' + json + '" id="group_dialog_' + json + '"/><label for="group_dialog_' + json + '" title="' + Core.String.encodeHTML(Core.String.trim(oElement['group_input'].value)) + '">' + Core.String.encodeHTML(Core.String.trim(oElement['group_input'].value)) + '</label></li>', 'beforeend')
                oElement['creategroup'].locked = false;
                oElement['group_input'].value = newGroup;
                if (scope.groupList.length >= 20) {
                    setTimeout(function(){
                        oElement['creategrp'].style.display = "none";
                    }, 20);
                }
                oElement['newgrp'].className = 'newBox';
                oElement['submit'].style.display = '';
                oElement['notgroup'].style.display = '';
                oElement['shareTxt'].innerHTML = $CLTMSG['CD0062'].replace(/#\{nick\}/, nick);
            },
            'onError': function(json){
                oElement['creategroup'].locked = false;
				if (json && json.code) {
					oElement['group_error'].innerHTML = $SYSMSG[json.code];
					oElement['group_error'].style.display = '';
				}
                return false;
            }
        });
    }
    oElement['creategrp'].onclick = function(){
        oElement['creategrp'].style.display = "none";
        oElement['newgrp'].style.display = "";
    }
    
    oElement['group_input'].onkeypress = function(e){
        var ev = e || window.event;
        if (ev.keyCode == 13) {
            Core.Events.fireEvent(oElement['creategroup'], "click");
        }
    }
    
    var checkGroupName = function(){
        var str = Core.String.trim(oElement['group_input'].value);
        if (Core.String.byteLength(str) > 16) {
            oElement['group_error'].innerHTML = $SYSMSG['M14010'];
            oElement['group_error'].style.display = '';
            return false;
        }
        if (str == '' || str == newGroup) {
            oElement['group_error'].innerHTML = $SYSMSG['M14014'];
            oElement['group_error'].style.display = '';
            return false;
        }
        for (var i = 0, len = arr_grp.length; i < len; i += 1) {
            if (Core.String.decodeHTML(arr_grp[i]["name"]) == str) {
                oElement['group_error'].innerHTML = $SYSMSG['M14008'];
                oElement['group_error'].style.display = '';
                return false;
            }
        }
        oElement['group_input'].value = str;
        oElement['group_error'].style.display = 'none';
        return true;
    };
    return oDialog;
};

$registJob('profile_moreact', function(){
    var el = $E('moreact');
    Core.Events.addEvent(el, function(){
        App.profile_moreact(el);
    }, 'mouseover');
    
});
