/**
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");

App.group = function(items, action, setClass){
	var it = {}, i = 0, len = items.length, selectedStyle, unselectedStyle, add = Core.Events.addEvent;
	it.current = -1;
	it.items = items;
	it.selected
	selectedStyle   = setClass && setClass["selected"]   || null;
	unselectedStyle = setClass && setClass["unselected"] || null;
	for(i; i<len; i++){
		(function(item, index){
			add(item, function(e){
				if(it.current == index && setClass){return}
				unselectedStyle && (it.current!=-1) && (items[it.current].className = unselectedStyle);
				selectedStyle && (item.className = selectedStyle);
				it.current = index;
				action(item, index, it);
				return false;
			},"mouseup");
		})(items[i], i);
	}
};
