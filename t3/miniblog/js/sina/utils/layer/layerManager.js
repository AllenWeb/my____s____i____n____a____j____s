/*
 * Copyright (c) 2009, Sina Inc. All rights reserved. 
 * @ClassName LayerManager
 * @FileOverview 基础层的多实例管理类
 * @Author Random | YangHao@sina.staff.com.cn
 * @Created 2009-03-24
 */

var LayerManager=function(){
	this.layers=[];
	this.activeLayer={};
};

LayerManager.prototype={
	addLayer:function(layer){
		this.layers.push(layer);
		this.activeLayer=this.layers[this.layers.length-1];
	},
	removeLayer:function(layer){
		for(var i=0;i<this.layers.length;i++){
			if(this.layers[i]==layer){
				this.layers.splice(i,1);
				break;
			}
		}
		this.activeLayer=this.layers[this.layers.length-1];
	}
};
