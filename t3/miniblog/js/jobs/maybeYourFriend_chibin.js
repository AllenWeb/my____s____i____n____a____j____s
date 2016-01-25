/**
 * @author dongkun || hittsungod@gmail.com
 * 可能感兴趣的人
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/opacity.js");
$import("sina/core/array/ArrayWithout.js");
$import("diy/CustomEvent.js");
$registJob('maybeYourFriend', function(){
    var _div = $E('maybe_friens_container');
    App.mbufLock = false;
    //错误判断
    if (!_div) {
        return false;
    }
    //程序开始
    //getElementByTagName
    var $tag = function(pel, cel){//参数:pel父节点,cel子节点
        return pel.getElementsByTagName(cel);
    }
    //isInArray
    var isInArray = function(arr, data){
        for (var i = 0, len = arr.length; i < len; i += 1) {
            if (arr[i] == data) {
                return true
            }
        }
        return false;
    }
    var _divInner = $tag(_div, 'div');
    var _getRefresh = $tag(_div, 'p');
    var _maybe_friens_task = $E('maybe_friens_task');
    var _refresh = $E('mb_refresh'); //$tag(_getRefresh[0], 'a');
    var _list = $E('interest_person');
    var _more = $tag(_divInner[2], 'a'); //$tag(_divInner[2], 'a');
    var _url = "/person/aj_maybefriend.php";
    var rtn = "";
    /*
     * 监听
     */
    var Event = {
        add_Event: Core.Events.addEvent,
        addRefresh: function(_r, _t){//监听刷新   			可爱的换一换
            Event.add_Event(_r, function(){
                if (_t._html.length <= 5) {
                    Check.checkAndRequest(true, _list,function(){});
                }
                else {
                    Check.checkBuffer(_t, true);
                }
            }, 'click');
        },
        addFollow: function(_fl, _unt, _num){//监听关注
            Event.add_Event(_fl, function(){
                try {
                    _unt.innerHTML = '';
                    _unt.className = '';
                } 
                catch (exp) {
                }
            }, 'click');
        },
        addUnLike: function(_ni, _un){//监听不感兴趣
            Event.add_Event(_ni, function(){
                Show.show_Link(_un, true);
            }, 'mouseover');
            Event.add_Event(_ni, function(){
                Show.show_Link(_un, false);
            }, 'mouseout');
        },
        bindFandU: function(conTainer){ //用于绑定不感兴趣和关注操作
            var _notInterest = $tag(conTainer, 'dd');
            for (var i = 0, l = _notInterest.length; i < l; i++) {
                var temp = $tag(_notInterest[i], 'a');
                Show.show_Link(temp[2], false);
                Event.addFollow(temp[1], temp[2], i);
                Event.addUnLike(_notInterest[i].parentNode, temp[2]);
            }
            temp = null;
            _notInterest = null;
        }
    };
    /*
     * 显示控件
     */
    var Show = {
        show_Link: function(linkName, state){//显隐通用函数
            if (linkName) {
                if (state === true) {
                    linkName.style.display = "";
                }
                if (state === false) {
                    linkName.style.display = "none";
                }
            }
        },
        showContent: function(container, html, replace){//显示内容,显示规则[1,3]
            var htmlContent = html;
            if (!replace) {
                container.innerHTML = htmlContent;
            }
            else {
                container.innerHTML = htmlContent.replace(/(^<dl( uid=\"[0-9]*\")*>)|(<\/dl>$)/gi, "");
            }
            Event.bindFandU(container);
        }
    };
    /*
     * 检测
     */
    var Check = {
        checkBuffer: function(T, isUnlike){//剩余person的个数
            var showHTML
            if (T._uid.length > 0) {
                var len = T._uid.length;
				if (isUnlike) {
                    showHTML = T._html.splice(0, len < 3 ? len : 3).join("");
                    T._uidN = T._uid.splice(0, len < 3 ? len : 3);
                    rtn = ""
                }
                else {
                    rtn = T._uid.shift();
                    T._uidN.push(rtn);
                    showHTML = T._html.shift();
                }
                if (T._uid.length > 0) {
                    Show.show_Link(_refresh, true);
                    Show.show_Link(_more[0], true);
                }else{
					Show.show_Link(_refresh, false);
                    Show.show_Link(_more[0], false);
				}
                if (isUnlike) {
                    Show.showContent(_list, showHTML);
                }
                else {
                    Show.showContent(T.delContainer, showHTML, true);
                }
                App.userCardInit && App.userCardInit();
            }
            else {
                //显示任务列表

                Show.show_Link(_refresh, false);
                Show.show_Link(_more[0], false);
                if (T._uidN.length == 0) {
                    Show.showContent(_list, "");
					_maybe_friens_task.innerHTML = taskAllHTML;
                }
                rtn = "";
            }
        },
        checkAndRequest: function(isUnlike, container, cb){ //参数isUnlike表示是否是点击"不感兴趣"而触发的换一个
            var len = Task._uid.length;
            if (len <= 5) { //小于5个的时候开始请求。
                Task.getList(isUnlike, function(){
                    Check.checkBuffer(Task, isUnlike);
                    Event.bindFandU(container || _list);
                    if (typeof cb === "function") {
						cb();
					};
                });
            }
            Event.bindFandU(container || _list);
        }
    };
    App.replaceByAnewUser = function(delEle, uid){
        //nuid = nuid || delEle.getAttribute("nuid");
        var deleteEle = function(){
            delEle.innerHTML = "";
            Task._uidN = Core.Array.ArrayWithout(Task._uidN, uid);
            Task.delContainer = delEle;
            var newEle_uid, newEle;
            //显示小于5个的时候，该请求了！！！
            if (Task._html.length <= 5) {
                Check.checkAndRequest(false, delEle, function(){
                    if (rtn) {
                        delEle.setAttribute('uid', rtn);
                        App.userCardInit && App.userCardInit();
						setTimeout(function(){
							App.opacity(delEle, {
                            first: 0,
                            last: 100,
                            time: 2
                        });	
						},200)
                    }
                    else {
                        Core.Dom.removeNode(delEle);
                    }
					App.mbufLock = false;
                });
				return false;
            }
            else {
                Check.checkBuffer(Task, false);
				App.mbufLock = false;
            }
            if (rtn) {
                delEle.setAttribute('uid', rtn);
                App.userCardInit && App.userCardInit();
                App.opacity(delEle, {
                    first: 0,
                    last: 100,
                    time: 2
                });
            }
            else {
                Core.Dom.removeNode(delEle);
            }
			return false;
            //            else {
            //                newEle = Task._html.splice(3, 1).join("");
            //                newEle_uid = Task._uid.splice(3, 1).join("");
            //                Task._uidN.push(newEle_uid);
            //                newEle = newEle.replace(/(^<dl( uid=\"[0-9]*\")*>)|(<\/dl>$)/gi, "");
            //                delEle.innerHTML = newEle;
            //                Event.bindFandU(delEle);
            //            }
        
        }
        App.opacity(delEle, {
            first: 100,
            last: 0,
            time: 1
        }, deleteEle);
    };
    App.unLike = function(uid, el){
		if(App.mbufLock){
			return false;
		}
		App.mbufLock = true
        var _url = "/pub/aj_disincline.php";
        App.doRequest({
            "nuid": uid,
            "rnd": Math.random()
        }, _url, function(){
			App.replaceByAnewUser(el.parentNode.parentNode.parentNode, uid);
        }, function(){
			App.replaceByAnewUser(el.parentNode.parentNode.parentNode, uid);
        }, "get"); 
    };
    /*
     * 任务逻辑
     */
    var taskAllHTML = '';
    
    var Task = {
        _uid: [],
        _html: [],
        _uidN: [], //用来显示，页面上显示的那几个
        init: function(){
            Show.show_Link(_refresh, false);
            Show.show_Link(_more[0], false);
        },
        getList: function(f, callBack){//get请求列表
            Utils.Io.Ajax.request(_url, {
                'GET': {
                    'withtask': 1
                },
                'onComplete': function(json){
                    //                    try {
                    if (json.code === 'A00006' && (json.data == '' || json.data.length > 0) && json.taskAll) {
                        taskAllHTML = json.taskAll || '';
                        if (json.data.length > 0) {
                            if (json.taskTodo == '') {
                                _maybe_friens_task.style.display = 'none'; //没了就给老子消失
                            }
                            else {
                                _maybe_friens_task.innerHTML = json.taskTodo; //告诉我你丫还要干什么
                            }
                            for (var i = 0, len = json.data.length; i < len; i++) {
                                if (Task._uidN.length > 0) {
									
                                    if ((f?f:(!isInArray(Task._uidN, json.data[i].uid))) && (!isInArray(Task._uid, json.data[i].uid))) { //不能跟页面上的重复,也不能跟还没显示的重复,否则那就下一个
                                        Task._uid.push(json.data[i].uid);
                                        Task._html.push(json.data[i].html);
                                    }
                                }
                                else {
                                    Task._uid.push(json.data[i].uid);
                                    Task._html.push(json.data[i].html);
                                }
                            }
                        }
                        if (json.data.length == 0) {
                            _maybe_friens_task.innerHTML = taskAllHTML;
                            _div.style.display = 'none';
                        }
                        if (typeof callBack === "function") {
                            callBack();
                        }
                    }
                    else {
						if (json.data.length == 0) {
                            _maybe_friens_task.innerHTML = taskAllHTML;
                            _div.style.display = 'none';
                        }
                        _div.innerHTML = "";
                        _div.className = "";
                        _maybe_friens_task.innerHTML = "";
                        _maybe_friens_task.className = "";
                    }
                    //                    } 
                    //                    catch (exp1) {
                    //                        _div.className = "";
                    //                        _div.innerHTML = "";
                    //                    }
                },
                'onException': function(exp2){
                    _div.className = "";
                    _div.innerHTML = "";
                },
                'returnType': 'json'
            });
        },
        run: function(){
            Task.init(); //在右侧模块化需求中不用执行此行
            Task.getList(true, function(){
                Check.checkBuffer(Task, true);
                Event.addRefresh(_refresh, Task);
            }); //在右侧模块化需求中不执行getList，而直接初始化Task中的uidN
        }
    };
    Task.run();
});
