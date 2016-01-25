/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview CustomTheme 设置自定义css类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-08
 */
$import("sina/core/class/create.js");

var CoustomOption=Core.Class.create();
CoustomOption.prototype = {
	initialize:function(type){
		this.type=type;
		this.container=type=="head"?$E("headPic950"):document.body;
		this.option={};
		if(type=="head"){
			this.option.height=type+"_height";
		}
		this.option.repeat=type+"_repeat";
		this.option.positionX=type+"_positionX";
		this.option.positionY=type+"_positionY";
	},
	setReapat:function(value){
		$Debug(typeof(value));
		if(value && typeof(value)=="string"){
			this.container.style.backgroundRepeat=scope.cssReapetConf[value];
		}else{
			this.container.style.backgroundRepeat=scope.cssReapetConf[$E(this.option.repeat).value];	
		}
	},
	setPositionX:function(value){
		if(value && typeof(value)=="string"){
			this.container.style.backgroundPositionX = scope.cssPositionXConf[value];
		}
		else {
			$Debug(scope.cssPositionXConf[$E(this.option.positionX).value]);
			this.container.style.backgroundPosition = scope.cssPositionXConf[$E(this.option.positionX).value]+" "+scope.cssPositionYConf[$E(this.option.positionY).value];
			
		}
	},
	setPositionY:function(value){
		if(value && typeof(value)=="string"){
			this.container.style.backgroundPositionY = scope.cssPositionYConf[value];
			//将自定义背景图向下作托盘高度值的偏移
			if(this.container==document.body){
				//当前自定义背景图是否设置为居上显示
				if (scope.cssPositionYConf[$E(this.option.positionY).value] == "top") {
					this.container.style.backgroundPositionY = "43px";
				}
			}
		}
		else {
			this.container.style.backgroundPosition = scope.cssPositionXConf[$E(this.option.positionX).value]+" "+scope.cssPositionYConf[$E(this.option.positionY).value];
			
			//将自定义背景图向下作托盘高度值的偏移
			if(this.container==document.body){
				//当前自定义背景图是否设置为居上显示
				if (scope.cssPositionYConf[$E(this.option.positionY).value] == "top") {
					this.container.style.backgroundPosition = scope.cssPositionXConf[$E(this.option.positionX).value]+" 43px";
				}
			}
		}
		
		
	},
	setHeight:function(e){
		if (e.keyCode) {
			if(e.keyCode!=13)
				return;
		}
		var value=parseInt($E("head_height").value);	
		if (value > 300 || value < 100) {
			$E("head_height_tip").innerHTML="<br/><font color=red>请输入100-300之间的数值</font>";
			return;
		}
		$E("head_height_tip").innerHTML="像素(100-300)";
		this.setEleHeight(value);
	},
	setEleHeight: function(value){
		if(!value){
			this.container.style.height="";
			$E("headpic100").style.height="";
			$E("ntoptitle").style.height="";
		}else{
			this.container.style.height=value+"px";
			$E("headpic100").style.height=value+"px";
			$E("ntoptitle").style.height=value+"px";
		}
		
	},
	setBackgroundImage:function(url){
		if(url){
			this.container.style.backgroundImage="url("+url+")";
		}else{
			this.container.style.backgroundImage="";
		}
			
	},
	setAll:function(pic_id){
		this.setBackgroundImage(getImgStaticPath(pic_id));
		this.setReapat();
		this.setPositionX();
		this.setPositionY();
		if(this.option.height){
			this.setHeight();
		}
	},
	setDefault:function(pic_id){
		this.setBackgroundImage(getImgStaticPath(pic_id));
		this.setReapat("default");
		this.setPositionX("default");
		this.setPositionY("default");
		if(this.option.height){
			this.setHeight("100px");
		}
	},setCancel:function(){
		if(config.common[this.type].usepic=="1"){
			this.setBackgroundImage(getImgStaticPath(config.common[this.type].currpic));
			this.setReapat(config.common[this.type].tiled);
			this.setPositionX(config.common[this.type].align_h);
			this.setPositionY(config.common[this.type].align_v);
			if(this.option.height){
				this.setHeight(config.common[this.type].height);
			}
		}else{
			this.setEmpty();
		}

	},
	setEmpty:function(){
			this.container.style.backgroundImage="";
			this.container.style.backgroundPositionY="";
			this.container.style.backgroundPositionX="";
			this.container.style.backgroundRepeat="";
			if(this.type=="head"){
				this.container.style.height="";
				$E("headpic100").style.height="";
				$E("ntoptitle").style.height="";
			}
	}
	
	
};


