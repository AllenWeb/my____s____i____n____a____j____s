/**
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @fileoverview 左右移动按钮函数
 * @author xy xinyu@staff.sina.com.cn
 * @version 1.0 2009-07-09
 */

$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");

/**
 * 左移函数
 */
function toLeft(){
	//得到点击事件的对象
	var clickedObj = "";
    var e = Core.Events.fixEvent(Core.Events.getEvent());
    if (e.target.tagName == "A") 
         clickedObj = e.target.parentNode;
    else 
        if (e.target.tagName == "DIV") 
            clickedObj = e.target;
			
	//得到需要进行左右移动的ul
	var ul=clickedObj.parentNode.firstChild.firstChild;
	
	//根据ul上的属性value中的长度以及样式中left的值计算左移多少
	var width=ul.getAttribute("value");
	if(parseInt(width)<=6*66)
	return;
	var left=parseInt(Core.Dom.getStyle(ul,"left"));
	if(!left){left=0;}
	var num=parseInt(width)+parseInt(left);
	if(num<=6*66)return;
	$Debug("left="+left);
	$Debug("width+left="+(width+left));
	if(num/66>12){
		left=left-6*66;
	}else if(num/66>6){
		left=left-(Math.floor(num/66)-6)*66;
	}
	
	//应用样式
	Core.Dom.setStyle(ul,"position","relative");
	Core.Dom.setStyle(ul,"left",left+"px");
};
/**
 * 右移函数
 */
function toRight(){
	//得到点击事件的对象
	var clickedObj = "";
    var e = Core.Events.fixEvent(Core.Events.getEvent());
    if (e.target.tagName == "A") 
         clickedObj = e.target.parentNode;
    else 
        if (e.target.tagName == "DIV") 
            clickedObj = e.target;
	//得到需要进行左右移动的ul
	var ul=clickedObj.parentNode.firstChild.firstChild;
	
	//根据ul上的样式中left的值计算右移多少
	var width=ul.getAttribute("value");
	if(parseInt(width)<=6*66)
	return;
	var left=parseInt(Core.Dom.getStyle(ul,"left"));
	if(!left){left=0;}
	var num=parseInt(width)+parseInt(left);
	if(left>=0)return;
	$Debug("left="+left);
	$Debug("width+left="+(width+left));
	if(-left/66>6){
		left=left+6*66;
	}else {
		left=0;
	}
	
	//应用样式
	Core.Dom.setStyle(ul,"position","relative");
	Core.Dom.setStyle(ul,"left",left+"px");
};