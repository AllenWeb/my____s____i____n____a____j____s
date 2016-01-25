/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName LayerManager
 * @FileOverview 基础层的原型类，对模板进行操作
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

var LayerPrototype=function(layerTemplate){
	var Property={
		activeTemplate:"",
		templates:layerTemplate
	};
	
	this.getProperty = function(){
		return Property;
	};
};

LayerPrototype.prototype={
	setTemplate:function(templateName){
		var p = this.getProperty();
		p.activeTemplate=p.templates[templateName] || "";
	}
};