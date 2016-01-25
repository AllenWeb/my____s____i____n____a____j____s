/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import("sina/core/events/addEvent.js");
$import("diy/dom.js");

$registJob("init_input",function(){
	
	App.Dom.getBy(function(el){
		//部分input 如v3 searh 深色背景显示异常,含有dycolor该属性值为false的不处理
		if(el.getAttribute('dycolor')||el.getAttribute('dycolor') == false){
			return;
		}
		var sType = el.getAttribute('type');
		var name = el.getAttribute('name');
		if (/text|password/.test(sType) && name != 'nickname') {
			//这里做加强处理，如果有clew属性，那么就是默认的提示，会有统一的键盘输入和输出
			var _clew = el.getAttribute('clew');
			el.style.color = "#999";
			Core.Events.addEvent(el,function(){
				if(_clew){
					if(_clew === el.value){
						el.value = ''
					}
				}
				el.style.color = "#333";
			},'focus');
			Core.Events.addEvent(el,function(){
				if(_clew){
					if(el.value === ''){
						el.value = _clew
					}
				}
				el.style.color = "#999";
			},'blur');
		}
	},'input',document);
	
	
	/*
	var inputs = document.getElementsByTagName("input");
	var length = inputs.length;
	var i = 0;
	for( i;i<length;i++){
		(function(oInput){
			var sType = oInput.getAttribute("type");
			var name = oInput.getAttribute("name");
			if( (sType == "text" || sType == "password") && name!="nickname"){
				
				//这里做加强处理，如果有clew属性，那么就是默认的提示，会有统一的键盘输入和输出
				var _clew = oInput.getAttribute('clew');
				
				oInput.style.color = "#999999";
				Core.Events.addEvent(oInput,(function(el){
						return function(){
							if(_clew){
								if(_clew === el.value){
									el.value = ''
								}
							}
							el.style.color = "#333333";
						};
					})(oInput)
				,"focus");
				Core.Events.addEvent(oInput,(function(el){
						return function(){
							if(_clew){
								if(el.value === ''){
									el.value = _clew
								}
							}
							el.style.color = "#999999";
						};
					})(oInput)
				,"blur");
			}
		})(inputs[i])
	}*/
});
