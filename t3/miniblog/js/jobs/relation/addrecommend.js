/**
 * @fileoverview 新建推荐
 * @author zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("jobs/base.js");
$import("jobs/request.js");
$import("jobs/request.js");
$import("sina/utils/sinput/sinput.js");
$registJob('addrecommend', function(){
    //获取页面元素
    //对方昵称输入框
    var _nick = $E("nick");
    //错误信息容器
    var _red_nick = $E("red_nick");
    //推荐理由输入框
    var _reason = $E("reason");
    //推荐理由错误信息容器
    var _red_reason = $E("red_reason");
    //推荐的用户列表
    var _userlist = $E("userlist");
    //推荐的用户列表错误信息容器
    var _red_userlist = $E("red_userlist");
    //提交按钮
    var _submit = $E("submit");
    //取消按钮
    var _cancel = $E("cancel");
    //转推一群人
    var _reRecomend = $E("");
    var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
    var _bLength = Core.String.byteLength;
    var _confirm = App.confirm;
    var _alert = App.alert;
    
    var _nickStr = $CLTMSG['ZB0011'];//'请输入对方昵称';
    var _reasonStr = $CLTMSG['ZB0012'];//'告诉他（们），你推荐关注给他们的理由（最多140字）';
    //昵称，推荐理由的输入框获取（失去）焦点时的处理函数。
    var focusOrBlur = function(opts){
        if (opts.focus) {
            if (opts.input.value === opts.tempStr) {
                opts.input.style.color = "";
                opts.input.value = "";
            }
        }
        else {
            if (opts.input.value === "") {
                opts.input.style.color = "#999";
                opts.input.value = opts.tempStr;
            }
        }
    };
    Core.Events.addEvent(_nick, (function(input){
        return function(){
            focusOrBlur({
                focus: true,
                input: input,
                tempStr: _nickStr
            });
        }
    })(_nick), "focus");
    Core.Events.addEvent(_nick, (function(input){
        return function(){
            focusOrBlur({
                focus: false,
                input: input,
                tempStr: _nickStr
            });
        }
    })(_nick), "blur");
    Core.Events.addEvent(_reason, (function(input){
        return function(){
            focusOrBlur({
                focus: true,
                input: input,
                tempStr: _reasonStr
            });
        }
    })(_reason), "focus");
    Core.Events.addEvent(_reason, (function(input){
        return function(){
            focusOrBlur({
                focus: false,
                input: input,
                tempStr: _reasonStr
            });
        }
    })(_reason), "blur");
    Core.Events.addEvent(_cancel, function(){
        //"确定取消吗？\n之前的编辑操作将不被保存"
        _confirm($CLTMSG['ZB0013'], {
            ok: function(){
                window.location.reload();
            }
        });
    }, "click");
    //提示
    var tips = App.builder2({
        'template': '<div class="inter_tip" id="outer" style="position:absolute"><div class="tipcontent" id="inner"></div><div class="tipbt"></div></div>'
    });
    var setTips = function(dom, h){
        var outer = document.getElementById("outer");
        h = typeof h === "undefined" ? 0 : h;
        if (!outer) {
			document.body.appendChild(tips.domList['outer']);
		}
        tips.domList['outer'].style.zIndex = 200;
        var pos = Core.Dom.getXY(dom);
        tips.domList['outer'].style.left = (pos[0] - 45) + 'px';
        tips.domList['outer'].style.top = (pos[1] - 70 - h) + 'px';
        tips.domList['inner'].innerHTML = $CLTMSG['ZB0019'];
    };
    var bindTips = function(){
        if ($E('tip_1') && $E('tip_2')) {
            setTips($E('tip_1'));
            $E('tip_1').onmouseover = function(){
                setTips($E('tip_1'), 0);
                tips.domList['inner'].innerHTML = $CLTMSG['ZB0019'];
                tips.domList['outer'].style.display = '';
            };
            $E('tip_1').onmouseout = function(){
                tips.domList['outer'].style.display = 'none';
            };
            $E('tip_2').onmouseover = function(){
                setTips($E('tip_2'), -20);
                tips.domList['inner'].innerHTML = $CLTMSG['ZB0020'];
                tips.domList['outer'].style.display = '';
            };
            $E('tip_2').onmouseout = function(){
                tips.domList['outer'].style.display = 'none';
            };
            tips.domList['outer'].style.display = 'none';
        }
        else {
            tips.domList['outer'].style.display = 'none';
            setTimeout(bindTips, 2000);
        }
    };
    bindTips();
    //根据输入查找粉丝
    App.fansfind({
        input: _nick,
        searchtype: 1
    });
    
    var fSelectObj = App.getFollowingSelector({
        'perchElement': _userlist,
        'inputWidth': 310,
        'limitNumber': 2000
    });
    fSelectObj.show();
    fSelectObj.get("box").className = _userlist.className;
    Utils.Sinput.limitMaxLen(_reason,280);
    //得到输入内容的长度
    var _getLength = function(str, tempStr){
    
        var len = _trim(str.replace(new RegExp(tempStr, 'g'), '')).length;
        if (len > 0) {
            return Math.ceil(_bLength(_trim(str)) / 2);
        }
        else {
            return 0;
        }
    };
    var checkFunction = {
        //昵称查空
        'MR0001': function(el){
            var len = _getLength(el.value, _nickStr);
            return (len > 0);
        },
        //推荐理由查空
        'MR0002': function(el){
            var len = _getLength(el.value, _reasonStr);
            return (len > 0);
        },
        'MR0003': function(selectObj){
            return selectObj.getSelected().length > 0;
        }
    };
    App.Checkinfo = App.checkForm(function(key, noError, affect, errorPos){
        if (noError) {
            errorPos.style.display = "none";
        }
        else {
            errorPos.style.display = "";
        }
    });
    
    App.Checkinfo.add('MR0001', _nick, _red_nick, checkFunction['MR0001']);
    App.Checkinfo.add('MR0002', _reason, _red_reason, checkFunction['MR0002']);
    App.Checkinfo.add('MR0003', fSelectObj, _red_userlist, checkFunction['MR0003']);
    var _lock = false;
    Core.Events.addEvent(_submit, function(){
        if (_lock) {
			 _lock = false;
			return false;
		}
        _lock = true;
        var checked = App.Checkinfo.check();
        if (!checked) {
			_lock = false
			return false;
		}
        var selected = fSelectObj.getSelected();
        var url = '/recommend/aj_addrecommend.php';
        var nickName = _nick.value;
        var reason = _reason.value;
        //		var p = App.htmlToJson(_reRecomend);
        //		selected = selected.concat(p.c)
        var recuid = selected.join(",");
        var param = {
            nick: nickName,
            reason: reason,
            recuid: recuid
        };
        App.doRequest(param, url, function(data, result){
            //onSuccess成功函数
            if (result && result.code) {
                if (result.code === "A00006") {
                    //"推荐成功！"
                    var _a = _alert($CLTMSG['ZB0014'], {
                        icon: 3,
                        ok: function(){
                            window.location.href = "/recommend/sendrecommend.php";
                        },
                        hasBtn: false
                    });
                    setTimeout(function(){
                        _a.close();
						window.location.href = "/recommend/sendrecommend.php";
                    }, 3000);
                }
            }
        }, function(data){
            //onError失败函数
            var errStr = null;
            if (data.code === 'M09001') {
                errStr = $SYSMSG[data.code];
            }
            else 
                if (data.code === 'M09002') {
                    errStr = $CLTMSG['ZB0018'];
                    _red_userlist.style.display = "";
                    _red_userlist.innerHTML = errStr;
					_lock = false;
                    return;
                }
                else 
                    if (data.code === 'M00004') {
                        errStr = $SYSMSG[data.code];
                        _alert(errStr, {
                            icon: 2
                        });
                    }
                    else 
                        if (data.code === 'M09004') {
                            errStr = $CLTMSG['ZB0016'];
                        }
                        else 
                            if (data.code === 'M09005') {
                                errStr = $CLTMSG['ZB0017'];
                            }
							else
								if(data.code === 'M00006'){
									errStr = $SYSMSG['M00006'];
									_red_reason.style.display="";
									_red_reason.innerHTML=errStr;
									_lock = false;
									return;
								}
								else{
									errStr = $SYSMSG['M13001'];
								}
								
            if (errStr) {
                _red_nick.style.display = "";
                _red_nick.innerHTML = errStr;
            }
            _lock = false;
        });
        
    }, "click");
});
