/**
 * @author dongkun || hittsungod@gmail.com
 * 可能感兴趣的人
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("diy/opacity.js");
$registJob('maybeYourFriend', function(){
    var _div = $E('maybe_friens_container');
    var _divInner = $tag(_div, 'div');
    var _getRefresh = $tag(_div, 'p');
    var _maybe_friens_task = $E('maybe_friens_task');
    var _refresh = $tag(_getRefresh[0], 'a');
    var _list = $E('interest_person');
    var _more = $tag(_divInner[2], 'a');
    var _url = "/person/aj_maybefriend.php";
    function $tag(pel, cel){//参数:pel父节点,cel子节点
        return pel.getElementsByTagName(cel);
    }
    if (!_div) {
        return false;
    }
    /*
     * 监听
     */
    var Event = {
        add_Event: Core.Events.addEvent,
        addRefresh: function(){//监听刷新
            Event.add_Event(_refresh[0], function(){
                Task._uid.splice(0, 3);
                Task._html.splice(0, 3);
                Task._uidN = Task._uid.slice(0);
                if (Task._html.length < 5) {
                    Check.checkAndRequest(true);
                }
                Check.checkBuffer(Task._html, true);
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
        showContent: function(count){//显示内容,显示规则[1,3]
            var htmlContent = '';
            for (var i = 0; i < count; i++) {
                htmlContent += Task._html[i];
            }
            _list.innerHTML = htmlContent;
            //Task._uid.splice(0, 3);//n
            //Task._html.splice(0, 3);//n
            //Task._uidO = Task._uid.slice(0);//n
            var _notInterest = $tag(_list, 'dd');
            var _listPerson = $tag(_list, 'dl');
            var _unLikeLink = [];
            var _follow = [];
            for (var i = 0, l = _notInterest.length; i < l; i++) {
                var temp = $tag(_notInterest[i], 'a');
                _unLikeLink.push(temp[2]);
                _follow.push(temp[1]);
                Show.show_Link(_unLikeLink[i], false);
                Event.addFollow(_follow[i], _unLikeLink[i], i);
                Event.addUnLike(_notInterest[i].parentNode, _unLikeLink[i]);
            }
        }
    };
    /*
     * 检测
     */
    var Check = {
        checkBuffer: function(arr, f){//剩余person的个数,f用于判断是不是页面刚刚初始化
            if (arr) {
                var len = arr.length;
                if (len < 4) {//隐藏刷新和更多
                    if (len == 0) {//显示任务列表
                        _maybe_friens_task.innerHTML = taskAllHTML;
                    }
                    if (len == 1) {
                        Show.showContent(1);
                    }
                    if (len == 2) {
                        Show.showContent(2);
                    }
                    Show.showContent(len);
                    Show.show_Link(_refresh[0], false);
                    Show.show_Link(_more[0], false);
                }
                else {
                    if (f) {
                        Show.showContent(3);
                        Task._uidN.push(Task._uid[0]);
                        Task._uidN.push(Task._uid[1]);
                        Task._uidN.push(Task._uid[2]);
                    }
                    Show.show_Link(_refresh[0], true);
                    Show.show_Link(_more[0], true);
                }
                App.userCardInit && App.userCardInit();
            }
        },
        checkAndRequest: function(f){
            var len = Task._uid.length;
            if (len < 5) {
                if (Task._flag == true) {
                    Task.getList(f);
                }
                else 
                    if (len < 4) {
                        Show.show_Link(_refresh[0], false);
                        Show.show_Link(_more[0], false);
                    }
            }
            var _notInterest = $tag(_list, 'dd');
            var _listPerson = $tag(_list, 'dl');
            var _unLikeLink = [];
            var _follow = [];
            for (var i = 0, l = _notInterest.length; i < l; i++) {
                var temp = $tag(_notInterest[i], 'a');
                _unLikeLink.push(temp[2]);
                _follow.push(temp[1]);
                Show.show_Link(_unLikeLink[i], false);
                Event.addFollow(_follow[i], _unLikeLink[i], i);
                Event.addUnLike(_notInterest[i].parentNode, _unLikeLink[i]);
            }
            
        }
    };
    App.replaceByAnewUser = function(delEle){
        //nuid = nuid || delEle.getAttribute("nuid");
        var deleteEle = function(){
            if (Task._html.length < 4) {
                var newEle = '';
                Task._html.pop();
                Task._uid.pop();
            }
            else {
                var newEle = Task._html.splice(3, 1);
                var uid = Task._uid.splice(3, 1);
                Task._uidN.push(uid);
            }
            if (newEle != '') {
                newEle = newEle[0];
                newEle = newEle.replace(/(^<dl( uid=\"[0-9]*\")*>)|(<\/dl>$)/gi, "");
            }
            else {
                //delEle.parentNode.removeChild(delEle);
                delEle.style.display = 'none';
                if (Task._html.length == 0) {//显示任务列表
                    _maybe_friens_task.innerHTML = taskAllHTML;
                    _div.style.display = 'none';
                }
                return;
            }
            delEle.innerHTML = newEle;
            App.opacity(delEle, {
                first: 0,
                last: 100,
                time: 2
            });
            
            uid = uid[0];
            delEle.setAttribute('uid', uid);
            App.userCardInit && App.userCardInit();
            Check.checkAndRequest(false);
        }
        App.opacity(delEle, {
            first: 100,
            last: 0,
            time: 1
        }, deleteEle);
    };
    App.unLike = function(uid, el){
        var _url = "/pub/aj_disincline.php";
        App.doRequest({
            "nuid": uid,
            "rnd": Math.random()
        }, _url, function(){
        }, function(){
        }, "get");
        App.replaceByAnewUser(el.parentNode.parentNode.parentNode);
    }
    /*
     * 任务逻辑
     */
    var taskAllHTML = '';
    var isInArray = function(arr, data){
        for (var i = 0, len = arr.length; i < len; i += 1) {
            if (arr[i] == data) {
                return true
            }
        }
        return false;
    }
    var Task = {
        _uid: [],
        _html: [],
        //_uidO: [],//n
        _uidN: [],
        _flag: true,
        init: function(){
            Show.show_Link(_refresh[0], false);
            Show.show_Link(_more[0], false);
        },
        getList: function(f){//get请求列表
            Utils.Io.Ajax.request(_url, {
                'GET': {
                    'rnd': Math.random(),
                    'withtask': 1
                },
                'onComplete': function(json){
                    try {
                        if (json.code === 'A00006' && (json.data == '' || json.data.length > 0) && json.taskAll) {
                            taskAllHTML = json.taskAll || '';
                            //this.withtask = 0;
                            if (json.data.length < 27) {
                                Task._flag = false;
                            }
                            if (json.data.length == 27) {
                                Task._flag = true;
                            }
                            if (json.data.length == 0) {
                                _maybe_friens_task.innerHTML = taskAllHTML;
                                _div.style.display = 'none';
                            }
                            if (json.data.length > 0) {
                                _maybe_friens_task.innerHTML = json.taskTodo;
                                if (json.taskTodo == '') {
                                    _maybe_friens_task.style.display = 'none';
                                }
                            }
                            for (var i = 0, len = json.data.length; i < len; i++) {
                                if (Task._uidN.length != 0) {
                                    if (!isInArray(Task._uidN, json.data[i].uid)) {
                                        Task._uid.push(json.data[i].uid);
                                        Task._html.push(json.data[i].html);
                                    }
                                }
                                else {
                                    Task._uid.push(json.data[i].uid);
                                    Task._html.push(json.data[i].html);
                                }
                            }
                            if (json.data.length != 0) {
                                Check.checkBuffer(Task._uid, f);
                            }
                        }
                        else {
                            _div.innerHTML = "";
                            _div.className = "";
                            _maybe_friens_task.innerHTML = "";
                            _maybe_friens_task.className = "";
                        }
                    } 
                    catch (exp1) {
                        _div.className = "";
                        _div.innerHTML = "";
                    }
                },
                'onException': function(exp2){
                    _div.className = "";
                    _div.innerHTML = "";
                },
                'returnType': 'json'
            });
        },
        run: function(){
            Task.init();
            Task.getList(true);
            Event.addRefresh();
            Event.addUnLike();
        }
    };
    
    Task.run();
});
