/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Tabs 标签类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-05
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");

/**
 * Tabs 用于多个tab之间的切换操作
 * @author dg.liu | dongguang@staff.sina.com.cn
 * @param  container{Element} 父节点
 * @param  option{Object} 
 * @example
 	var tabs=new Tabs($E("tab_content"),{className:"CP_tag2s"});
 */
var Tabs=Core.Class.create();
Tabs.prototype={
	initialize:function(container,option){
		$Debug("Tabs_init");
		option=option||{};
		var className=option.className||"";
		this.tabsArr=[];
		this.htmlEle=$C("ul");
		this.htmlEle.className=className;
		container.appendChild(this.htmlEle);
	},
	add:function(tab){
		this.tabsArr.push(tab);
		this.htmlEle.appendChild(tab.element);
		Core.Events.addEvent(tab.element,Core.Function.bind3(this.swapTags,this,[tab]));
			
	},
	swapTags:function(tab){
		if(tab.isFocus==false){
			for(var i=0;i<this.tabsArr.length;i++){
				this.tabsArr[i].setAbort();
			}
			tab.setFocus();
		}else{
			return;
		}
	}
};
/**
 * @Tab 标签类
 * @param title(String) 标签内容
 * @param option(Object)
 * @example
 	tabs.add(new Tab("<em>设置风格</em>", {isFocus: true,className:"CP_tagon"}));
	tabs.add(new Tab("<em>设置博客模块</em>",{className:"CP_tagon"}));
	tabs.add(new Tab("<em>设置博客版式</em>",{className:"CP_tagon"}));
 */
var Tab=Core.Class.create();
Tab.prototype={
	initialize:function(title,option){
		$Debug("Tab"+title+" is init");
		this.option=option||{};
		var isFocus=option.isFocus||false;
		this.className=option.className||"";
		this.focus=[option.onfocus];
		this.abotrts=[option.onabort];
		this.element=$C("li");
		if(option.cls){
			this.element.className=option.cls;
		}
		isFocus?this.setFocus():this.setAbort();
		this.element.innerHTML=title;
	},
	setAbort:function(){
		if(this.isFocus==false){
			return;
		}
		if(this.option.cls){
			this.element.className=this.option.cls;
		}else{
			this.element.className="";	
		}
		
		this.isFocus=false;
		this.onabort();
	},setFocus:function(){
		this.element.className=this.className;
		this.isFocus=true;
		this.onfocus();
	},onabort:function(){
		for(var i=0;i<this.abotrts.length;i++){
			this.abotrts[i]();
		}
		
	},onfocus:function(){
		for(var i=0;i<this.focus.length;i++){
			this.focus[i]();
		}
	},
	addOnAbort:function(abortFunc){
		this.abotrts.push(abortFunc);
	},
	addOnFocus:function(focusFunc){
		this.focus.push(focusFunc);
	}
};

