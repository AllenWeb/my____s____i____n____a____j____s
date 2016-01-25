/*
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @ClassName Layer
 * @FileOverview 基础页面显示层
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 * @Updated 2009-05-04 (添加注释)
 */

$import("sina/sina.js");
$import("sina/core/base/parseParam.js");
$import("sina/core/base/detect.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/template.js");
$import("sina/utils/layer/layerPrototype.js");

var Layer=function(tmpLayer){
	this.entity=null;
	this.ifm=null;
	
	var _this=this;
	var Property={
		width:0,
		height:0,
		x:0,
		y:0,
		isFixed:false,
		entityId:"",
		contentId:"",
		UI:'<div id="#{id}">#{text}</div>',
		content:{
			id:"id1",
			text:"text1"
		},
		layerPrototype:new LayerPrototype(tmpLayer.template),
		layerTemplate:tmpLayer
	};
	
	
	this.getProperty = function () {
		return Property;
	};
	
	(function initialize(){
		var p=_this.getProperty();
		Property.entityId="layer_"+_this.getUniqueID();
		Property.contentId=Property.entityId+"_content";

		_this.entity=$C("div");
		_this.entity.style.position="absolute";
		_this.entity.style.left=p.x+"px";
		_this.entity.style.top=p.y+"px";
		_this.setTemplate({templateName:""});
		p.width=parseInt(_this.entity.style.width);
		if(Core.Base.detect.$IE6){
			_this.addIframe();
		}
		document.body.appendChild(_this.entity);

		_this.hidden();
		
	})();
	
	//特殊处理layer在IE6下滚动条滚动的时候相对于屏幕位置不改变
	this._ie6Fixed=function(){
		_this.entity.style.left = document.documentElement.scrollLeft + _this.getProperty().x + "px";
		_this.entity.style.top = document.documentElement.scrollTop + _this.getProperty().y + "px";

		if (_this.ifm){
			_this.ifm.style.left = document.documentElement.scrollLeft + _this.getProperty().x + "px";
			_this.ifm.style.top = document.documentElement.scrollTop + _this.getProperty().y + "px";
		}
	};
};

Layer.prototype={
	/**
	 * 设置模板
	 * opts.templateName:[string](模板名称)
	 */
	setTemplate:function(opts){
		var p = this.getProperty();
		var tempEntity=$C("div");
		
		Core.Base.parseParam(p,opts);
		
		p.layerPrototype.setTemplate(p.layerTemplate.name);
		var tmp=new Utils.Template(p.layerPrototype.getProperty().activeTemplate || '<div id="#{layerId}"><div id="#{contentId}"></div></div>');
		tempEntity.innerHTML=tmp.evaluate({layerId:p.entityId,contentId:p.contentId});
		document.body.appendChild(tempEntity);
		
		this.entity=$E(p.entityId);
		document.body.replaceChild(this.entity,tempEntity);
		tempEntity=null;
	},
	
	/**
	 * 设置高度和宽度，这里设置的是内容器的高度和宽度来撑开外容器
	 * opts.width:[number]
	 * opts.height:[number]
	 */
	setSize:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p,opts);
		
		if (opts.width) {
			$E(p.contentId).style.width = p.width + "px";
		}
		if(opts.height){
			$E(p.contentId).style.height = p.height+"px";
		}
	},
	
	
	/**
	 * 设置对象的位置
	 * opts.x:[number]
	 * opts.y:[number]
	 */
	setPosition:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p, opts);
		this.entity.style.left=p.x+"px";
		this.entity.style.top=p.y+"px";
		if(Core.Base.detect.$IE6 && p.isFixed){
			this.entity.style.left=p.x+document.documentElement.scrollLeft+"px";
			this.entity.style.top=p.y+document.documentElement.scrollTop+"px";
		}
		
		if(this.ifm){
			this.ifm.style.left=this.entity.style.left;
			this.ifm.style.top=this.entity.style.top;
		}
	},
	
	/**
	 * 如果有背景ifrmae的时候，实时更新iframe的大小与layer保持一致
	 */
	updateIfmSize:function(){
		if(this.ifm){
			var _this=this;
			clearInterval(_this.updateIfmSizeTimer);
			_this.updateIfmSizeTimer = window.setInterval(function(){
				_this.ifm.style.width=_this.entity.offsetWidth + "px";
				_this.ifm.style.height=_this.entity.offsetHeight + "px";
			},3000);
		}
	},
	
	/**
	 * 外观和内容的设置，设置UI只改变表现，设置content只改变数据
	 * opts.UI:[string](UI的模板)
	 * opts.content[Object](UI模板所匹配的数据对象)
	 */
	setContent:function(opts){
		var p = this.getProperty();
		if (p.UI != opts.UI || p.content != opts.content) {
			Core.Base.parseParam(p, opts);
			var tmp = new Utils.Template(p.UI);
			$E(p.contentId).innerHTML = tmp.evaluate(p.content);
		}
	},
	
	/**
	 * 设置layer是否在滚动条滚动的时候相对于屏幕位置不改变
	 * opts.isFixed:[bool]
	 */
	setFixed:function(opts){
		var p = this.getProperty();
		Core.Base.parseParam(p, opts);
		if(Core.Base.detect.$IE6){
			var _this=this;
			if(p.isFixed){
				Core.Events.addEvent(window,_this._ie6Fixed, "scroll");
			}else{
				Core.Events.removeEvent(window,_this._ie6Fixed, "scroll");
			}
		}else{
			// 修正FF2下,同一zindex的,fixed会导致遮盖的问题
			// @author FlashSoft
			this.entity.style.position="absolute";
			var _t = this;
			setTimeout(function() {
				_t.entity.style.position=p.isFixed?"fixed":"absolute";
			}, 1);
		}
	},
	
	/**
	 * 显示layer，如果有背景iframe则一起显示
	 */
	show:function(){
		this.entity.style.display="";
		if(this.ifm){
			this.ifm.style.display="";
			this.updateIfmSize();
		}
	},
	
	/**
	 * 隐藏layer，如果有背景iframe则一起隐藏
	 */
	hidden:function(){
		this.entity.style.display="none";
		if(this.ifm){
			this.ifm.style.display="none";
		}
	},
	
	/**
	 * 添加背景iframe
	 */
	addIframe:function(){
		this.ifm=$C("iframe");
		this.ifm.style.position="absolute";
		this.ifm.style.zIndex = "1024";
		this.ifm.style.width = "1px";
		this.ifm.style.height = "1px";
		this.ifm.style.left=this.entity.style.left;
		this.ifm.style.top=this.entity.style.top;
		document.body.appendChild(this.ifm);
		Core.Dom.setStyle(this.ifm,"opacity",0);
	},
	
	/**
	 * 获取唯一ID
	 */
	getUniqueID:function(){
		return parseInt(Math.random()*10000).toString()+(new Date).getTime().toString();
	}
};
