/**
 * @author chibin | chibin@staff.sina.com.cn
 */
$import("sina/core/array/isArray.js");
$import("jobs/miniblog_follow_all.js");
App.moreFeed = function(){
    var _key = false;
    var _more = $E("more_button");
    if (_key) {
        return false
    }
	var disp = _more.getAttribute('disp').split(',')
    if (Core.Array.isArray(scope.att_container)) {
		for (var j = 0; j < disp.length; j++) {
			scope.att_container.push(disp[j])
		}
    }
    var getDispList = function(str, act){
        if (!str) {
            return;
        }
        var _list = str.split(',');
        for (var i = 0; i < _list.length; i = i + 1) {
            if ($E(_list[i])) {
                $E(_list[i]).style.display = act;
				if ($E('select_num')) {
					$E('select_num').innerHTML = parseInt($E('select_num').innerHTML) + $E(_list[i]).getElementsByTagName('input').length;
					scope.maxatt = parseInt($E('select_num').innerHTML);
				}
			}
        }
    }
    _key = true;
    _more.innerHTML = '<span class="loading">'+$CLTMSG['CC0402']+'</span>';
	setTimeout(function(){
        getDispList(_more.getAttribute('disp'),'');
        getDispList(_more.getAttribute('hidd'),'none');
        App._notclick(true);
    }, 600)
    return false;
};
