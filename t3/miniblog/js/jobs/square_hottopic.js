/**
 * @author chibin
 * 热门话题加载数字及显示
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/miniblog_search.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getElementsByClass.js");
$registJob('square_hottopic', function(){
    //需要加载数字的
    var maybeatt = $E("maybeattentionlist");
    var myatt = $E("myattentionlist");
    var myatt_eindex = myatt?myatt.getElementsByTagName('TR').length:1;
    scope.square_getnum({
        maybeatt: {
            el: maybeatt,
            sindex: 0
        },
        myatt: {
            el: myatt,
            sindex: 0,
            eindex: (myatt_eindex > 10 ? 9 : myatt_eindex - 1)
        }
    });
});

/*
 * el 标示取哪一块区域的数字
 * length 标示取前多少个话题，默认取table的行数
 */
scope.square_getnum = function(elsobj){
    var _getEBC = Core.Dom.getElementsByClass;
    var params = {};
    var gettopName = function(elobj){
		var _arr_topName = new Array();
		if (elobj['el']) {
			var _arr_tr = elobj['el'].getElementsByTagName('TR');
			var _start = elobj['sindex'] || 0;//开始下标
			var _end = elobj['eindex'] || _arr_tr.length - 1;//结束下标
			for (var i = _start; i <= _end; i++) {
				_arr_topName.push(encodeURIComponent(_getEBC(_arr_tr[i], "DIV", "topName")[0].getElementsByTagName('A')[0].innerHTML));
			}
		}
        return _arr_topName;
    }
    var settopNum = function(elobj, _arr_topNum){
        if (!_arr_topNum || _arr_topNum.length == 0) 
            return;
        var _arr_tr = elobj['el'].getElementsByTagName('TR');
        var _start = elobj['sindex'] || 0;//开始下标
        var _end = elobj['eindex'] || _arr_tr.length - 1;//结束下标
        for (var i = _start, j = 0; i <= _end; i++, j++) {
            _getEBC(_arr_tr[i], "DIV", "tipNums")[0].innerHTML = _arr_topNum[j];
        }
    }
    var _success = function(json){
        for (var name in json.data) {
            settopNum(elsobj[name], json.data[name]);
        }
    };
    var _fail = function(json){
        return false;
    };
    try {
        for (var name in elsobj) {
            params[name] = gettopName(elsobj[name]).join(',');
        }
        Utils.Io.Ajax.request("/pub/aj_gettopicnum.php", {
            "POST": params,
            "onComplete": function(oResult){
                if (oResult.code == "A00006") {
                    _success(oResult);
                }
                //失败回调
                else {
                    _fail(oResult);
                }
            },
            "onException": function(){
            },
            returnType: "json"
        });
    } 
    catch (e) {
    
    }
};

//查看更多话题
scope.viewMoreMyAttention = function(){
    var count = 10;
    var numstart = 0;
    var numend = 0;
    var items = document.getElementById('myattentionlist').getElementsByTagName('TR');
    for (var i = 0, len = items.length; i < len; i += 1) {
        if (items[i].style.display == 'none') {
            if (numstart == 0) {
                numstart = i;
            }
            items[i].style.display = '';
            numend = i;
            count -= 1;
            if (count <= 0) {
                //return;
                break;
            }
        }
    }
    if (count > 0) {
        document.getElementById('viewMoreMyAttention').style.display = 'none';
    }
    scope.square_getnum({
        myatt: {
            el: $E("myattentionlist"),
            sindex: numstart,
            eindex: numend
        }
    });
};
