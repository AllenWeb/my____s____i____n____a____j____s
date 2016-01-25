/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('jobs/base.js');
$import('jobs/miniblogcard.js');
$import('sina/core/dom/getXY.js');
$registJob('square_top',function(){
	var domList = document.getElementsByTagName('A');
	for(var i = 0, len = domList.length; i < len; i += 1){
		if(domList[i].getAttribute('linktype') == 'card'){
			Core.Events.addEvent(domList[i],(function(dom){
				return function(e){
					Core.Events.stopEvent(e);
					var href = dom.getAttribute('uid');
					var position = Core.Dom.getXY(dom.parentNode.parentNode);
					App.miniblogCard.show(href,dom.parentNode.parentNode,{
						'left' : position[0],
						'top' : position[1]
					});
				};
			})(domList[i]),'click');
		}
	}
});
