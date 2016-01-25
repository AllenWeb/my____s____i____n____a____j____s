/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Theme 更换版式类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-08
 */

$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind3.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/compsMSG.js");
$import("sina/module/interface/interface_component.js");


var Layout = Core.Class.create();
Layout.prototype = {
	/**
	* 关闭时是否需要提示保存
	*/
	isSave:true,
	
	initialize:function(dialog){
		this.dialog=dialog;
		this.initHtml();
		this.initData();
	},
	initData:function(){
		var str;
		if(config.component && config.component.c3){
			str="3";
		}
		else{
			str="2";
		}
		this.setSelect(str);
	},
	initHtml:function(){
		var html='<div class="CP_setlayout">\
						<ul class="CP_chos">\
							<li id="2l"><a href="javascript:;">\
								<span><img id="2l_img"src="http://sjs.sinajs.cn/common/images/CP_demo_04.png" /></span>\
								<b id="layout_select_2"></b></a>\
							</li>\
							<li id="3l"><a href="javascript:;">\
								<span><img id="3l_img" src="http://sjs.sinajs.cn/common/images/CP_demo_03.png" /></span>\
								<b id="layout_select_3"></b></a>\
							</li>\
						</ul>\
					</div>';
		$E("layout_tab_content").innerHTML=html;
		Core.Events.addEvent($E("2l"),Core.Function.bind3(this.setSelect,this,["2"]));
		Core.Events.addEvent($E("3l"),Core.Function.bind3(this.setSelect,this,["3"]));
		Core.Events.addEvent("layout_tab_save",Core.Function.bind2(this.save,this),"click");
		Core.Events.addEvent("layout_tab_cancel",Core.Function.bind2(this.cancel,this),"click");
	},
	setSelect:function(num){
		$Debug(num);
		var select_item=$E("layout_select_"+num);
		var select_img=$E("layout_select_img");
		if(select_img){
			select_img.parentNode.parentNode.style.border="";
			Core.Dom.removeNode(select_img);
			select_img=null;
		}
		select_item.parentNode.style.border="2px solid #51BD2F";
		select_item.innerHTML='<img align="absmiddle" class="CP_i_ok" src="http://sjs.sinajs.cn/common/images/CP_i.gif" id="layout_select_img"/>';
		if(num="2"){
			$E("2l").className="CP_select" ;
			$E("3l").className="CP_no_select" ;
		}else{
			$E("2l").className="CP_no_select" ;
			$E("3l").className="CP_select" ;
		}
	},
	isChanged:function(){
		var layout_id=$E("layout_select_img").parentNode.id.split("_")[2];
		if(config.component && config.component.c3 && layout_id=="2"){
			return true;
		}
		if (config.component && !config.component.c3 && layout_id == "3") {
			return true;
		}
		return false;
	},
	save:function(){
		if(!this.isChanged()){
			return;
		}
		var layout_id=$E("layout_select_img").parentNode.id.split("_")[2];
		var parm={
			uid: scope.$uid,
			productid:scope.p_key
		};
		if(layout_id=="2" && config.component){
			
			parm.module=config.component.c1.join(",")+","+config.component.c3.join(",")+"|";
		}else if(config.component){
			//var arr1=config.component.c1.splice(0,2);
			//var arr2=config.component.c1.splice(3);
			//parm.module=config.component.c1.join(",")+config.component.c3.join(",")+"||";
			parm.module=config.component.c1+"||";
		}
		scope.Inter_component.request({
			GET : parm,
			onSuccess: function(_data){
				$Debug("success:"+_data);
				window.location.reload();
			},
			onError : function (_data) {
				showError(_data.code);
				$Debug("error:"+_data);
			},
			onFail : function () {
				window.location.reload();
			}
		});
		$Debug("save");
	},
	cancel:function(){
		this.isSave=false;
		this.dialog.hidden();
		this.isSave=true;
	},
	resetData:function(){
		var layout_id=$E("layout_select_img").parentNode.id.split("_")[2];
		if(config.component && config.component.c3 && layout_id=="2"){
			this.setSelect(3);
		}
		if (config.component && !config.component.c3 && layout_id == "3") {
			this.setSelect(2);
		}
	}
};