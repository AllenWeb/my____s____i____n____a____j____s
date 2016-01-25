/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Diy 页面自定义类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-07
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/dialog.js");
$import("sina/utils/windowDialog.js");
$import("sina/utils/tab/tabs.js");
$import("sina/module/set/comps.js");
$import("sina/module/set/theme.js");
$import("sina/module/set/layout.js");

var Diy=Core.Class.create();
Diy.prototype={
	initialize: function(){
	},
	getHtml:function(){
		var  html='<div class="CP_set">\
				<div class="CP_tag2" id="diy_tab">\
				</div>\
				<div class="CP_setcnt CP_setcnt2" id="theme_tab_content">\
					<div class="CP_setsbar" id="diy_vtab"></div>\
					<div id="item_content"></div>\
				</div>\
				<div id="comps_tab_content" class="hidden"></div>\
				<div id="layout_tab_content" class="CP_setcnt hidden">layout</div>\
					<p class="CP_setsub hidden"  id="theme_tab_buts"><a href="#" id="theme_tab_save" onclick="return false" class="CP_a_btn2"><cite>保存</cite></a><a href="#"   id="theme_tab_cancel"  onclick="return false" class="CP_a_btn2"><cite>取消</cite></a></p>\
					<p class="CP_setsub hidden"  id="comps_tab_buts"><a href="#"  id="comps_tab_save"  onclick="return false"  class="CP_a_btn2"><cite>保存</cite></a><a href="#"  id="comps_tab_cancel" class="CP_a_btn2" onclick="return false"> <cite>取消</cite></a></p>\
					<p class="CP_setsub hidden"  id="layout_tab_buts"><a href="#"  id="layout_tab_save"  onclick="return false"  class="CP_a_btn2"><cite>保存</cite></a><a href="#"  id="layout_tab_cancel"  class="CP_a_btn2"  onclick="return false"><cite>取消</cite></a></p></div>';
		return html;
	},
	hiddenContent: function (arr){
		for(i = 0;i < arr.length; i ++){
			  $E(arr[i]).style.display = "none";
		}
      
    },
	showContent:  function (arr){
		for(i = 0;i < arr.length; i ++){
			  $E(arr[i]).style.display = "block";
		}
    },
	initDialog:function(){
		var obj  = {
			ad: false,
			drag: true,
			title: "页面设置",
			content: "",
			shadow: 1,
			fixed:false,
			width: 617,
			height: 580
		};
		var func = {
			onDragStart: function () {
//				$Debug("拖动开始！");
			},
			onDrag: function () {
//				$Debug("拖动中！");
			},
			onDragEnd: function () {
//				$Debug("拖动结束！");
			},
			onContentUpdate: function () {
//				$Debug("更新内容！");
			},
			onPosUpdate: function () {
//				$Debug("位置更新！");
			},
			onShow: function () {
//				$Debug("显示dialog！");
			},
			onHidden: function () {
//				$Debug("隐藏dialog！");
			}
		};
		this.dialog = new Sina.Utils.dialog(obj, func);
		this.dialog.setHelp("http://photo.sina.com.cn/gallerypub/help/blog.html?id=26");
		this.dialog.setContent(this.getHtml());
		this.dialog.show();
		
		var theme=new Theme(this.dialog);
		var layout = new Layout(this.dialog);
		
		scope.pageSetDialog = this.dialog;
		
	    //横向tab
	    var tabs = new Tabs($E("diy_tab"), {
	        className: "CP_tag2s"
	    });
		
		var themeTab=new Tab("<em>设置风格</em>", {
			isFocus: true,
	        className: "CP_tagon",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["theme_tab_content", "theme_tab_buts"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["theme_tab_content","theme_tab_buts"]])
	    });
	    tabs.add(themeTab);
	    //纵向tab

		//this.dialog.setCloseEvent(Core.Function.bind2(theme.resetData,theme));

		themeTab.addOnAbort(function(){
			if( theme.isChanged() || (theme.headCustom && (theme.headCustom.isChanged()||theme.bgCustom.isChanged())) ){
				windowDialog.confirm("是否保存此更改?", {
	  				funcOk: Core.Function.bind2(theme.save,theme),
	  				textOk: "是",
					funcCancel:Core.Function.bind2(theme.resetData,theme),
	  				textCancel: "否",
	  				defaultButton: 1,  // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
	  				title:	"提示",
	  				icon:	"04",  // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
	  				width:	350,  // 对话框宽度，默认 300px
	  				height:	300   // 对话框高度，默认自适应
	  			}); 
			}
		});
		var _product = "", _setComps = false;
		switch ($CONFIG.$product){
			case "blog":
				_product = "博客";
				_setComps = true;	break;
			case "space":
				_product = "空间";	break;
			case "app":
				_product = "应用";	break;
			case "tieba" :
				_product = "贴吧";	break;
			case "photo" :
				_product = "相册";	break;
			default:
				break;
		}
		if ($CONFIG.$product == "blog" && scope.$pageid=="indexM") {//是否为个人博客首页
			if (_setComps && scope.$pageid=="indexM") {
				var blogTabTitle = $CONFIG.$product == "blog" ? "首页" : "";
				var compsTab = new Tab("<em>设置" + _product + blogTabTitle + "模块</em>", {
					isFocus: false,
					className: "CP_tagon",
					onabort: Core.Function.bind3(this.hiddenContent, this, [["comps_tab_content", "comps_tab_buts"]]),
					onfocus: Core.Function.bind3(this.showContent, this, [["comps_tab_content", "comps_tab_buts"]])
				});
				tabs.add(compsTab);
				scope.$_setCompsTab = new Module.SetComps(this.dialog);
				compsTab.addOnAbort(function(){
					if (scope.$_setCompsTab != null && scope.$_setCompsTab.isChanged()) {
						windowDialog.confirm("是否保存此更改?", {
							funcOk: Core.Function.bind2(scope.$_setCompsTab.save, scope.$_setCompsTab),
							textOk: "是",
							funcCancel: Core.Function.bind2(scope.$_setCompsTab.resetData, scope.$_setCompsTab),
							textCancel: "否",
							defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
							title: "提示",
							icon: "04", // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
							width: 350, // 对话框宽度，默认 300px
							height: 300 // 对话框高度，默认自适应
						});
					}
				});
			}
			
			if ($CONFIG.$product == "blog" && scope.$pageid=="indexM") {
				var layoutTab = new Tab("<em>设置博客首页版式</em>", {
					className: "CP_tagon",
					onabort: Core.Function.bind3(this.hiddenContent, this, [["layout_tab_content", "layout_tab_buts"]]),
					onfocus: Core.Function.bind3(this.showContent, this, [["layout_tab_content", "layout_tab_buts"]])
				});
				tabs.add(layoutTab);
				
				layoutTab.addOnAbort(function(){
					if (layout.isChanged()) {
						windowDialog.confirm("是否保存此更改?", {
							funcOk: Core.Function.bind2(layout.save, layout),
							textOk: "是",
							funcCancel: Core.Function.bind2(layout.resetData, layout),
							textCancel: "否",
							defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
							title: "提示",
							icon: "04", // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
							width: 350, // 对话框宽度，默认 300px
							height: 300 // 对话框高度，默认自适应
						});
					}
				});
				
			}
		}
		this.dialog._dialogFUNC.onHidden = function(e){
			if(theme.isChanged() ||(theme.headCustom != null && (theme.headCustom.isChanged()||theme.bgCustom.isChanged())) ){
				if(theme.isSave){
					windowDialog.confirm("是否保存此更改?", {
	  				funcOk: Core.Function.bind2(theme.save,theme),
	  				textOk: "是",
					funcCancel:Core.Function.bind2(theme.resetData,theme),
	  				textCancel: "否",
	  				defaultButton: 1,  // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
	  				title:	"提示",
	  				icon:	"04",  // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
	  				width:	350,  // 对话框宽度，默认 300px
	  				height:	300   // 对话框高度，默认自适应
	  			}); 
				}
				else{
					theme.resetData();
				}
			}
			
			if(layout.isChanged()){
				if (layout.isSave) {
					windowDialog.confirm("是否保存此更改?", {
						funcOk: Core.Function.bind2(layout.save, layout),
						textOk: "是",
						funcCancel:Core.Function.bind2(layout.resetData,layout),
						textCancel: "否",
						defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
						title: "提示",
						icon: "04", // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
						width: 350, // 对话框宽度，默认 300px
						height: 300 // 对话框高度，默认自适应
					});
				}
				else{
					layout.resetData();
				}
			}
			
			if (scope.$_setCompsTab != null && scope.$_setCompsTab.isChanged()) {
				if (scope.$_setCompsTab.isSave) {
					windowDialog.confirm("是否保存此更改?", {
						funcOk: Core.Function.bind2(scope.$_setCompsTab.save, scope.$_setCompsTab),
						textOk: "是",
						funcCancel: Core.Function.bind2(scope.$_setCompsTab.resetData, scope.$_setCompsTab),
						textCancel: "否",
						defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
						title: "提示",
						icon: "04", // 可选值："01"、"02"、"03" : ! 、"04" : ? 、"05"
						width: 350, // 对话框宽度，默认 300px
						height: 300 // 对话框高度，默认自适应
					});
				}
				else{
					scope.$_setCompsTab.resetData();
				}
			}
			
		};
		this.dialog._dialogFUNC.onShow = function(){
			if(theme){
				theme.resetData();
			}
			if(scope.$_setCompsTab){
				scope.$_setCompsTab.resetData();
			}
			if(layout){
				layout.resetData();
			}
		};
		this.dialog.setMiddle();
	}
};

