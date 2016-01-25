/**
 * @author chibin | chibin@staff.sina.com.cn
 */
$import("sina/core/array/isArray.js");
$import("sina/core/array/foreach.js");
$import("jobs/miniblog_follow_all.js");
$registJob("guide_interest", function(){
    var els = document.getElementsByTagName("input")
    scope.maxatt = parseInt($E('select_num').innerHTML)||scope.maxatt;
    for (var i = 0; i < els.length; i++) {
        (function(dom){
            if (dom.type == "checkbox" && dom.value != "") {
                Core.Events.addEvent(dom, function(){
                    setTimeout(function(){
						if ($E('select_num')) {
							if (!dom.checked) {
								$E('select_num').innerHTML = parseInt($E('select_num').innerHTML) - 1;
							}
							else {
								$E('select_num').innerHTML = parseInt($E('select_num').innerHTML) + 1;
							}
						}
						if ($E('check_all')&&scope.maxatt == $E('select_num').innerHTML) {
                                $E('check_all').checked = true;
                            }else{
								$E('check_all').checked = false;
							}
						if ($E('select_num').innerHTML == "0") {
							App._notclick(false);
						}else{
							App._notclick(true);
						}						
                    }, 10);
                }, 'click')
            }
        })(els[i]);
    }
});
