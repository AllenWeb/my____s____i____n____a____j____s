/**
 * 这个代码用来给注册页面使用
 */
$import("sina/sina.js");
$import("jobs/request.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import('diy/provinceandcity.js');
$import("jobs/mousemove.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getXY.js");
$import("diy/date.js");
$import("jobs/rightlist_follow.js");

/**
 * 加关注
 * @param {Object} uid 用户id
 * @param {Object} url 关注url
 * @param {Object} el  当前元素 不可为空
 */
App.followadd = function(uid, el, url){
    if (!uid) {
        return;
    }
    url = "/attention/aj_addfollow.php";
    //while(el.nodeName.toLowerCase(0) != "div"){
    //	el = el.parentNode;
    //}
    function cb(){
        el.innerHTML = '<span class="add_yet"></span>' + $CLTMSG['CX0025'];
        el.href = "javascript:void(0);";
        el.className = "concernBtn_Yet";
        if (el) {
            el.ask_following = true;
        }
    }
    if (el.ask_following) {
        return false;
    }
    //App.followOperation({uid:uid,fromuid:scope.$uid},url,cb);
    App.followOperation({
        uid: uid,
        fromuid: scope.$uid
    }, url, cb, el);
    //el.ask_following = true;
};

App.followOperation = function(data, url, cb, el){
    if (!scope.$uid) {
        App.ModLogin({
            func: arguments.callee,
            param: [data, url, cb]
        });
        return false;
    }
    if (scope.$uid == "123456") {
        var arg = arguments[0];
        data = arg[0];
        url = arg[1];
        cb = arg[2];
    }
    function ecb(json){
        if (el) {
            el.ask_following = false;
        }
        if (json.code == "M00003") {
            App.ModLogin();
        }
        else if (json&&json.code == 'MR0050') {
            App.forbidrefresh(function(){
                data['retcode']=scope.doorretcode;
                App.doRequest(data, url, sucss, ecb);
            },'/attention/aj_addfollow.php')
        } 
		else{
            App.alert(json, {
                ok: function(){
                    if (scope.$uid == "123456") {
                        location.reload();
                    }
                }
            });
        }
    }
    var sucss = function(json){
        cb(json);
        if (scope.$uid == "123456") {
            location.reload(true);
        }
    }
	
	App.doRequest(data, url, sucss, ecb);
//    //chibin add 防止恶意加关注
//    App.doRequest({}, '/attention/aj_checkdoor.php', function(){
//        App.doRequest(data, url, sucss, ecb);
//    }, function(json){
//        if (json.code == 'R01441') {
//            App.forbidrefresh(function(){
//                App.doRequest(data, url, sucss, ecb);
//            })
//        }else{
//			App.alert(App.getMsg({
//				'code': json.code
//			}));
//		}
//    });
}

$registJob("searchuser", function(){
    var _searchBoxInitString = $CLTMSG["CX0061"];
    
    var province = $E('province');
	if(!province){
		return;
	}
    var city = $E("city");
    
    //数据初始化
    var _provcode = province.getAttribute('truevalue') || province.value;
    var _citycode = city.getAttribute('truevalue') || city.value;
    var _pcObject = new App.ProvinceAndCity(province, city, _provcode, _citycode);
    var disCls = "btn_notclick btnxs";
    var searchbtn = $E("searchbtn");
    var filterbtn = $E("filterbtn");
    
    //添加回车事件
    Core.Events.addEvent($E("comorsch"), function(e){
        var event = e || window.event;
        if (event.keyCode == 13) {
            Core.Events.fireEvent(filterbtn, 'click');
        }
    }, "keyup");
    
    filterbtn.onclick = function(){
        //为了和顶部的搜索人统一，这个内容也需要encode一下
        $E("keywords_input").value = encodeURIComponent($E("keywords_input").value);
        $E("comorsch").value = Core.String.trim($E("comorsch").value);
        //如果是默内容的话，置为空
        if ($E("comorsch").value == "学校/公司名称") {
            $E("comorsch").value = "";
        }
        $E("filtersearch").value = $E("comorsch").value;
        $E("filterform").submit();
        return false;
    };
    //搜人表单
    var searchInput = $E("searchinput");
    if (searchbtn) {
        searchbtn.onclick = function(){
            var value = Core.String.trim(searchInput.value);
            if (value == _searchBoxInitString) {
                searchInput.value = "";
            }
            document.filterform1.submit();
            return false;
        };
    }
    if (searchInput) {
        searchInput.onkeydown = function(event){
            event = event || window.event;
            if (event.keyCode == 13) {
                Core.Events.fireEvent(searchbtn, 'click');
            }
        };
        Core.Events.addEvent(searchInput, function(){
            if (searchInput.value == _searchBoxInitString) {
                searchInput.value = "";
            }
            return;
        }, "focus");
        Core.Events.addEvent(searchInput, function(){
            if (/search=(.+)/.test(window.location.href)) {
                return;
            }
            if (searchInput.value == "") {
                searchInput.value = _searchBoxInitString;
            }
            return;
        }, "blur");
    }
});

$registJob("advancedSearch", function(){
    var datestr = "yyyy-mm-dd";
    var $addEvent = Core.Events.addEvent;
    var $stop = Core.Events.stopEvent;
    (function(){
        var wrap = $E(arguments[0]);
		if(!wrap){
			return;
		}
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.style.display = "none";
            wrap.className = "pc_caldr";
            document.body.appendChild(wrap);
        }
        var els = Array.prototype.slice.call(arguments, 1);
        var bindCal = function(){
            if (this.value == datestr) {
                this.value = "";
            }
            var postion = Core.Dom.getXY(this);
            wrap.style.position = "absolute";
            wrap.style.left = postion[0] + "px";
            wrap.style.top = (postion[1] + this.offsetHeight) + "px";
            wrap.style.display = "";
            wrap.relateid = this;
            $stop();
        };
        for (var i = 0; el = els[i]; i++) {
            el = $E(el);
            $addEvent(el, bindCal.bind2(el), "focus");
            $addEvent(el, bindCal.bind2(el), "click");
        }
        $addEvent(wrap, $stop, "click");
        function pad(str, n){
            n = n || 2;
            str = str + "";
            if (str.length < n) {
                return arguments.callee("0" + str, n);
            }
            return str;
        }
        var servertime = new Date(scope.$severtime * 1000)
        new domkey.Date(wrap, function(y, m, d){
            m = parseInt(m,10) + 1;
            d = parseInt(d,10);
            var relateid = wrap.relateid;
            if (relateid = $E(relateid)) {
                relateid.value = y + "-" + pad(m) + '-' + pad(d);
            }
            toggle();
        }, servertime.getFullYear(), servertime.getMonth(), servertime, 365);
        function toggle(bl){
            return wrap.style.display = bl == true ? "" : "none";
        }
        $addEvent(document.body, toggle, "click");
    })("pc_caldr", "startdate", "enddate");
    
    function parseDate(str){
        var array = str.split(/-/ig);
        try {
            return new Date(array[0], array[1], array[2]);
        } 
        catch (e) {
            return null;
        }
    }
    
    (function(){
        var advancedsubmit = $E("advancedsubmit");
		if(!advancedsubmit){
			return;
		}
        function getSelectBoxValue(_name){
            var _inputValues = document.getElementsByName(_name);
            var _value = "";
            for (var i = 0; i < _inputValues.length; i++) {
                if (_inputValues[i].checked) {
                    _value = _inputValues[i].value;
                    break;
                }
            }
            return _value;
        }
        function formchecked(){
            var start = $E("startdate").value;
            var end = $E("enddate").value;
            if (start && start != datestr && end) {
                var starttime = parseDate(start);
                var endtime = parseDate(end);
                if (starttime && endtime) {
                    if (starttime > endtime) {
                        App.alert($CLTMSG["CD0083"]);
                        return false;
                    }
                }
            }
            start = start == datestr ? "" : start;
            var filter = $E("filter").value;
            var filter_ori = getSelectBoxValue("filter_ori");
            var filter_pic = getSelectBoxValue("filter_pic");
            return "http://t.sina.com.cn/k/" + encodeURIComponent($E("query").value) + "&searchopen=1" + "&filter_ori=" + filter_ori + "&filter_pic=" + filter_pic + "&starttime=" + start + "&endtime=" + end + "&nick=" + encodeURIComponent($E("usernick").value) + (filter != "" ? ("&filter=" + filter) : "");
        }
        $addEvent(advancedsubmit, function(){
            var searchStr = "";
            if (searchStr = formchecked()) {
                location.href = searchStr;
            }
            $stop();
        }, "click");
    })();
});

App.highSearch = function(el){
    var target = $E("high_search");
    if (el.className != "") {
        el.className = "";
        target.style.display = "none"
    }
    else {
        el.className = "navSearch";
        target.style.display = "";
    }
};
