/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/system/winSize.js");
$import("diy/samecitydialog.js");

App.square_city = function(el){
    if (scope.areadialog) {
        return false;
    }
    scope.areadialog = new App.AreaDialog(el);
	Core.Events.addEvent(scope.areadialog._elsubmit, function(){
        window.location.href = "/pub/city?p=" + (scope.areadialog._province.getAttribute('truevalue') && scope.areadialog._province.value) + "&c=" + (scope.areadialog._city.getAttribute('truevalue') && scope.areadialog._city.value);
    }, 'click');
    Core.Events.addEvent(el, function(){
        Core.Events.stopEvent();
        return false;
    }, "click");
    scope.areadialog.show();
    Core.Events.stopEvent();
    Core.Events.addEvent(document.body, function(){
        if (scope.areadialog) {
            scope.areadialog.close();
            scope.areadialog = null;
        }
        return false;
    }, "click");
};
$registJob('square_city_pulley', function(){
    try {
        var shell = $E('star_list');
		if(!shell) return false;
        var num = 2//步长
		var box = $E('sbody');
        var items = shell.getElementsByTagName('TD');
        box.style.width=(num*262)+'px';
        App.pulley($E('turn_left'), $E('turn_right'), box, items, shell, num, 262, {
			notloop: true,
			endLFun: function(){
				rollli('right');
			},
			endRFun: function(){
                rollli('left');
            }
		});
        App._pIndex = 0;
        var rollli = function(op){
            var lis = $E('roll').getElementsByTagName('li');
            for (var k = 0; k < lis.length; k++) {
                if (lis[k].className == 'cur') {
                    lis[k].className = '';
					if (op == 'left') {
						if (k + 1 == lis.length) {
							lis[0].className = 'cur';
						}
						else {
							lis[k + 1].className = 'cur';
						}
						break;
					}else{
						if (k - 1 < 0) {
                            lis[lis.length - 1].className = 'cur';
                        }
                        else {
                            lis[k - 1].className = 'cur';
                        }
                        break;
					}
                }
            }
        }
		
 
//        Core.Events.addEvent($E('turn_left'), function(){
//			rollli('right');
//        }, 'click');
//		Core.Events.addEvent($E('turn_right'), function(){
//            rollli('left');
//        }, 'click');
        //	for (var i = 0; i < roll.length; i++) {
        //		Core.Events.addEvent(roll[i], (function(_index){
        //			return function(){
        //				var _differ = _index - App._pIndex;
        //				if (_differ == 0) {
        //					return false;
        //				}
        //				if (_differ < 0) {
        //					pull.left(num * (Math.abs(_differ)), function(){
        //						App._pIndex = i;
        //					}, function(){
        //					});
        //				}
        //				else {
        //					pull.right(num * (Math.abs(_differ)), function(){
        //						App._pIndex = i;
        //					}, function(){
        //					});
        //				}
        //			};
        //		})(i), 'click');
        //	};
    } 
    catch (e) {
    };
    });

