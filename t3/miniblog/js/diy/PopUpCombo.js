$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("diy/EncodeUtils.js");

/**
 * @author liusong@staff.sina.com.cn
 */

App.PopUpCombo = (function(){
	var it = {}, ce = Core.Events, addEvent=ce.addEvent, removeEvent=ce.removeEvent, stopEvent=ce.stopEvent, filter = App.EncodeUtils.regexp, toIndex, value, content, current, key, reg, tip, panel, head, lis=[], onSelect, onClose, len, selected=0;
	it.validate = false;
	/**
	 * 设置当前index值, 该值仅支持 [-1~1]
	 * @param {Object} num
	 */
	it.index = function(num){
		toIndex = !num?0: selected + num;
		toIndex = toIndex<0?len:(toIndex>len)?0:toIndex;
		lis[selected].className="";
		lis[toIndex].className="cur";
		selected = toIndex;
		value = content[selected];
	};
	it.click = function(){
		onSelect && onSelect(value)
	};
	it.hidden = function(){
		it.initTip();
		tip.style.display = "none";
		it.validate && !(it.validate = false) && onClose && onClose()
	};
	it.initTip = function(){
		if(!tip){
			tip = $C("div");
			tip.appendChild( panel = $C("ul") );
			with(tip.style){zIndex = 2000; position="absolute";display="none"}
			tip.className = "Atwho";
			document.body.appendChild(tip);
		}
	};
	it.position = function(x, y, offsetX, offsetY){
		it.initTip();
		it.validate = true;
		tip.style.display = "block";
		with(tip.style){left= (x + offsetX)+"px"; top= (y + offsetY)+"px"}
	};
	it.selection = function(event){
		var keyCode = event.keyCode, toIndex, value;
		if(!it.validate){return}
		if(keyCode==40 || keyCode==38){
			it.index(keyCode==40?1:-1);
			stopEvent();
		}else if(keyCode==13 || keyCode==9){
			it.click();
			stopEvent();
		}else if(keyCode==27){
			it.hidden();
			stopEvent();
		}
	};
	it.addItem = function( itemValue ){
		var li = document.createElement("li"), index;
		li.innerHTML = itemValue.replace(reg,"<b>$1</b>");
		lis.push(li)
		len = index = lis.length - 1;
		content.push(itemValue);
		panel.appendChild(li);
		addEvent(li, function(){
			lis[selected].className="";
			lis[index].className="cur";
			value = itemValue;
			selected = index;
			stopEvent();
		},"mouseover");
		addEvent(li, function(){
			it.click();
			it.hidden();
			stopEvent();
		},"mousedown")
	};
	it.bind = function(oElement, aContent, sKey, fOnSelect, fOnClose, sHead ){
		var i=0, l = aContent.length;
		reg = new RegExp("(" + filter(sKey) + ")","gi")
		selected = 0; content = []; onSelect = fOnSelect; len = 0; lis = []; onClose = fOnClose;
		it.initTip(); panel.innerHTML = "";
		if(sHead){panel.appendChild( head = $C("div")); head.innerHTML=sHead}
		for(i; i<l; i++){
			//if(aContent[i].match(reg)){
				it.addItem(aContent[i]);
			//}
		}
		if(!lis.length){it.addItem(sKey)}
		it.index(0);
		if(current==oElement){return}
		current && removeEvent(current, it.selection, "keydown");
		removeEvent(document.body, it.hidden, "mouseup");
		addEvent((current = oElement), it.selection, "keydown");
		addEvent(document.body, it.hidden, "mouseup");
	};
	return it;
})();