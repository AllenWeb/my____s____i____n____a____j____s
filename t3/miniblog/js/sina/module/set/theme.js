/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Theme 设置风格类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-08
 */
$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/core/array/findit.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/tab/tabs.js");
$import("sina/module/set/custom/customtheme.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/customMSG.js");
$import("sina/module/interface/interfase_save_theme.js");
$import("sina/module/interface/interface_theme_save_upload_img.js");
$import("sina/utils/template.js");

var Theme = Core.Class.create();
Theme.prototype={
	/**
	 * 关闭时是否需要提示保存
	 */
	isSave:true,
	
	/**
	 * 当前选中的样式
	 */
	activeSelection:config.common.t,
	
	initialize:function(dialog){
		this.dialog = dialog;
		this.initTags();
		if(Core.Array.findit(scope.overdue_theme_cnf, config.common.t) != -1){
			this.showTabs("0");
		}else{
			this.setSelectImg(config.common.t);
		}

		this.initEvent();
		//dialog.setMiddle();
	},
	/**
	 * s
	 */
	initTags:function(){
		var _this = this;
	
		var vtabs = new Tabs($E("diy_vtab"));
		var no_num_arr = ["0","custom"];
		var tab_data = scope.theme_cnf;
		tab_data.custom = {name: "自定义风格", data: []};
		for(var name in tab_data){
			var op= {
				className: "CP_setsbon",
				onabort:Core.Function.bind3(_this.hiddenTag, _this,[name]),
				onfocus:Core.Function.bind3(_this.showTag, _this,[name])
			};
			var title;
			if(name == "13"){
				op.cls = "xuan_icon";
				if(config.common.t.split("_")[0] == "13"){
					title = '<em id="tab_em_' + name + '">炫动模板</em>';
				}else{
					title='<em id="tab_em_' + name
					 + '"><img height="11" width="47" src="http://simg.sinajs.cn/common/images/090326_pagesetting_1.gif"/></em>';
				}
			}else{
				title="<em id=tab_em_" + name + ">" + tab_data[name].name + "</em>";
			}
			if(name == config.common.t.split("_")[0]){
				op.isFocus = true;
				this.initItems(name);
			}
		 	if(Core.Array.findit(no_num_arr,name) != -1){
				this[name + "_tab"] = new Tab(title, op);
			}else{
				var num,data = tab_data[name].data;
				if(data[data.length-1].split("_")[1] == "0"){
					num = data.length - 1;
				}else{
					num = data.length;
				}
				this[name + "_tab"] = new Tab(title + "<cite>(" + (num) + ")</cite>", op);
			}
			vtabs.add(this[name + "_tab"]);
		}
	},
	initEvent:function(){
		Core.Events.addEvent("theme_tab_save", Core.Function.bind2(this.save,this), "click");
		Core.Events.addEvent("theme_tab_cancel", Core.Function.bind2(this.cancel,this), "click");
	},
	/**
	 * 初始化某模板分类中的点选模板缩略图的html，并在最后进行事件绑定
	 * @param {String} property 模板分类号
	 */
	initItems:function(property){
		var setDate = {type_class1: "CP_setstyle", type_class2: "CP_setstys"};
		var xuanDate = {type_class1: "CP_xuanstyle", type_class2: "CP_xuanstys"};
		var html = ' <div class="#{type_class1} hidden" id="items_' + property
					+'"><div class="#{type_class2}"><ul class="CP_chos">';
		var tmp = new Utils.Template(html);
		if(property != 13){
			html = tmp.evaluate(setDate);	
		}else{
			html = tmp.evaluate(xuanDate);
		}
		
		var data = scope.theme_cnf[property].data;
		for(var i = 0; i < data.length; i ++){
			var url = 'http://simg.sinajs.cn/tpl/' + data[i] + '/images/tmp.png';
			var select_id = "select_" + property + "_" + data[i];
			if(data[i].split("_")[1] == "0"){
				//判断是否为动炫模板
				if(data[i].split("_")[0] != "13"){
					url = "http://simg.sinajs.cn/common/images/CP_chosrnd.gif";	
				}else{
					url = "http://simg.sinajs.cn/common/images/CP_radomflashpic.gif";
				}
			}

			html += '<li id="item_' + property + '_' + data[i] + '" class="CP_choson">'
					+ '<a href="javascript:;" onclick="return false;">'
						+ '<span><img title="选择并预览" alt="选择&#10并预&#10览" src=' + url + '></span>'
						+ '<b id="'+select_id+'"></b>'
					+ '</a></li>';
		}
		html += "</ul></div></div>";
		//自定义部分
		if(property == "custom"){
			 html = '<dl class="CP_setchg hidden" id="items_' + property + '"></dl>';
		}
		Core.Dom.insertHTML($E("item_content"), html, "BeforeEnd");
		//自定义部分
		if(property == "custom"){
			this.initCustom();
		}
		var _this=this;
		Core.Array.foreach(data, Core.Function.bind2(function(e){
				Core.Events.addEvent("item_" + property + "_" +  e, Core.Function.bind3(this.selectItem, this, [e]), "click");
				
				//增加鼠标移进后边框变绿，移出后无边框的效果
				Core.Events.addEvent("item_" + property + "_" + e, Core.Function.bind3(function(){
					for(var i = 0; i < $E("item_" + property + "_" + e).childNodes.length; i ++){
						if($E("item_" + property + "_" + e).childNodes[i].tagName == "A"){
							if (_this.activeSelection != e) {
								$E("item_" + property + "_" + e).childNodes[i].style.border = "2px solid #51BD2F";
							}
							break;
						}
					}
				}, this, [e]), "mouseover");
				Core.Events.addEvent("item_" + property + "_" + e, Core.Function.bind3(function(){
					for(var i = 0; i < $E("item_" + property + "_" + e).childNodes.length; i ++){
						if($E("item_" + property + "_" + e).childNodes[i].tagName == "A"){
							if (_this.activeSelection != e) {
								$E("item_" + property + "_" + e).childNodes[i].style.border = "2px solid #FFFFFF";
							}
							break;
						}
					}
				}, this, [e]), "mouseout");
			}, this)
		);
		
	},
	initCustom:function(){
			this.headCustom = new CustomTheme($E("items_custom"), {
			 	title: "头图",
				type:"head"
			 });
			
			 this.bgCustom = new CustomTheme($E("items_custom"), {
			 	title: "背景图",
				type:"bg"
			 });
	},
	/**
	 * 点击模板缩略图时打钩，有打双钩的情况。
	 * @param {String} id 模板号
	 */
	setSelectImg:function(id){
		// Modified by L.Ming 20090721 看当前模板是否为正常模板（如商业模板，用户不可选但可以克隆）
		// 如果不是正常模板，就默认显示推荐分类
		// （是否为下线模板的检查在 initialize方法中）
		var themeVisible = false;
		for(var name in scope.theme_cnf){
			var select_img_id = "select_" + name + "_img";
			$Debug("***" + "select_" + name + "_" + id);
			var select_item = $E("select_" + name + "_" + id);
			var select_img = $E(select_img_id);
			if(select_img){
				select_img.parentNode.parentNode.style.border = "2px solid #FFFFFF";
				Core.Dom.removeNode(select_img);
				select_img = null;
			}
			if(Core.Array.findit(scope.theme_cnf[name].data,id) != -1){
				if(!$E("items_"+name)){
					this.initItems(name);
					select_item=$E("select_" + name + "_" + id);
					if(name != 0){
						if(!$E("select_0_" + id)){
							this.showTabs(name);
						}
						else{
							this.showTabs(0);
						}
					}
				}
				themeVisible = true;
				select_item.parentNode.style.border = "2px solid #51BD2F";
				select_item.innerHTML = '<img align="absmiddle" class="CP_i_ok" '
						+ 'src="http://sjs.sinajs.cn/common/images/CP_i.gif" id="' + select_img_id + '"/>';	
			}
		}
		if(!themeVisible){
			this.showTabs(0);
		}
	},
	/**
	 * 模板分类之间切换，某个模板分类的隐藏。
	 * @param {String} id 模板分类号
	 */
	hiddenTag: function(id){
		var items = $E("items_" + id);
		if(items){
			items.style.display = "none";
		}
	},
	/**
	 * 模板分类之间切换，某个模板分类的显示。
	 * @param {String} id 模板分类号
	 */
	showTag: function(id){
		var items = $E("items_" + id);
		if(!items){
			this.initItems(id);
			items = $E("items_" + id);
		}
		if(id == "13" && $E("tab_em_" + id)){
			$E("tab_em_"+id).innerHTML = '炫动模板';
		}else{
			if($E("tab_em_13")){
				$E("tab_em_13").innerHTML = '<img height="11" width="47" src="http://simg'
					+ '.sinajs.cn/common/images/090326_pagesetting_1.gif"/>';
			}
		}
		var s_id = this.getSelectThemeId();
		if(id=="custom"){
			if(s_id.split("_")[0] == 13){
				if(this.headCustom){
					if(this.headCustom.uploadView){
						this.headCustom.uploadView.hidden_all();
						if($E("xuandong")){
							$E("xuandong").style.display = "block";
						}
					}
				}
				if(this.bgCustom){
					if(this.bgCustom.uploadView){
						this.bgCustom.uploadView.hidden_all();
						if($E("xuandong")){
							$E("xuandong").style.display = "block";
						}
					}
				}
			}
		}else{
			if(this.headCustom){
				if(this.headCustom.uploadView){
					this.headCustom.uploadView.show_all();
					if($E("xuandong")){
						$E("xuandong").style.display = "none";
					}	
				}
			}
			if(this.bgCustom){
				if(this.bgCustom.uploadView){
					this.bgCustom.uploadView.show_all();
					if($E("xuandong")){
						$E("xuandong").style.display = "none";
					}	
				}
			}
		}
		items.style.display = "block";
	},
	showTabs:function(name){
		this[name + "_tab"].setFocus();
	},
	/**
	 * 点击模板缩略图后，所执行的操作集。 目前:1,图片打钩.2,导入相应css文件
	 * @param {String} id 模板号
	 */
	selectItem:function(id){
		$Debug(id, "#ff0000");
		var _this = this;
		if(Core.Array.findit(scope.overdue_theme_cnf,config.common.t)!=-1 && !this.oldTheme){
			var msg="你目前使用的商业模板已经过期，如果更换将无法恢复。是否更换？";
			windowDialog.confirm(msg, {
                funcOk: function(){
					_this.setSelectImg(id);
					_this.dwThemeCss(id.split("_"));
					_this.oldTheme = true;
				},
                textOk: "是",
                textCancel: "否",
                defaultButton: 1,
                title: "提示！",
                icon: "04",
                width: 300,
                height: 300
			});
		}else{
			this.setSelectImg(id);
			this.dwThemeCss(id.split("_"));
		}
		if(id.split("_")[0] == "13"){
			App.FlashTemplate(id);
		}
		_this.activeSelection = id;
		
		if($E("diy_banner")){
			Core.Dom.removeNode($E("diy_banner"));
		}
		if($E("diy_bg")){
			Core.Dom.removeNode($E("diy_bg"));
		}
		if(this.headCustom){
			if(!this.headCustom.uploadView){
				this.initCustom();
			}
			if(!this.headCustom.uploadView){
				return;
			}
			this.headCustom.uploadView.setDefault_bg();
			this.headCustom.selectItem("default");
			this.headCustom.uploadView.customOption.setEmpty();
		}
		if(this.bgCustom){
			if(!this.bgCustom.uploadView){
				this.initCustom();
			}
			if(!this.bgCustom.uploadView){
				return;
			}
			this.bgCustom.uploadView.setDefault_bg();
			this.bgCustom.selectItem("default");
			this.bgCustom.uploadView.customOption.setEmpty();		
		}
	},
	/**
	 * 导入css文件
	 * @param {Array} ids 模板号
	 */
	dwThemeCss: function(ids){
		if(ids[1] == "0"){
			ids = Boot.randomTheme(ids[0]).split("_");
		}
		if ($IE) {
			var links = SwapLink.getThemeLinds();
			SwapLink.loading = true;
			SwapLink.appendLink(ids, Core.Function.bind3(SwapLink.deleteTLink,SwapLink, [links]));
		}
		else {
			id = "link" + this.themeNum;
			$E("themeLink").href = scope.$BASECSS + "tpl/" + ids[0] + "_" + ids[1] + "/t.css";
		}
		this.themeNum = ids.join("_");
	},
	getSelectThemeId: function(){
		var theme_id;
		for(name in scope.theme_cnf){
			if(isNaN(window.parseInt(name))){
				continue;
			}
			if($E("select_" + name + "_img")){
				var arr = $E("select_" + name + "_img").parentNode.id.split("_");
				theme_id = arr[2] + "_" + arr[3];
			}
		}
		if(typeof theme_id == "undefined"){
			theme_id = config.common.t;
		}
		return theme_id;
	},
	isChanged: function(){
		if(config.common.t != this.getSelectThemeId()){
			return true;
		}
		return false;
	},
	save: function(){
		var _this = this;
		var theme_id = this.getSelectThemeId();
		var secure_code = $encrypt_code || "";
		var param = {
			uid: scope.$uid,
			productid: scope.p_key,
			secure_code: secure_code
		};
		var useless;
		//没有换模板
		if(!_this.isChanged()){
			//没有初始化自定义图片程序
			if(!_this.headCustom){
				return;
			}
			//有初始化自定义图片程序，但没有自定义图片
			else if(!_this.headCustom.isChanged() && !_this.bgCustom.isChanged()){
				return;
			}
			//有初始化自定义图片程序，有自定义图片
			else{
				this.saveCustom();
			}
		}
		//有更换模板
		else{
			param.t = theme_id;
			if(theme_id.split("_")[1] == 0  || config.common.r == 1 &&theme_id.split("_")[1] != 0){
				param.key += ",r";
				if( theme_id.split("_")[1] == 0){
					param.r = "1";
				}else{
					param.r = "0";
				}
			}
			$Debug("******************************************");
			//用setTimout暂时解决Ie6下请求接口会出现abort的问题
			window.setTimeout(function(){
				scope.Inter_template_set.request({
					GET : param,
					onSuccess: function(_data){
						$Debug("success:" +_data);
						//有初始化自定义图片程序
						if(_this.headCustom){
							//有初始化自定义图片程序，有自定义图片
							if (_this.headCustom.isChanged() || _this.bgCustom.isChanged()) {
								_this.saveCustom();
							}else{
								window.location.reload();
							}
						}
						//没有初始化自定义图片程序
						else{
							window.location.reload();
						}
					
						
					}.bind2(_this),
					onError : function (_data) {
						showError(_data.code);
						$Debug("error:" + _data);
					},
					onFail : function () {
					}
				});
			},10);
		}
	},
	saveCustom:function(){
		var secure_code = $encrypt_code || "";
		var param = {
			uid: scope.$uid,
			productid: scope.p_key,
			secure_code: secure_code
		};
		Core.Class.extend(param, this.headCustom.getParameter());
		Core.Class.extend(param, this.bgCustom.getParameter());	
		scope.Inter_tpimage_set.request({
			GET : param,
			onSuccess: function(_data){
				$Debug("success:" + _data);
					window.location.reload();
				},
				onError : function (_data) {
					showError(_data.code);
					$Debug("error:" + _data);
				},
				onFail : function () {
				}
		});	
	},
	cancel:function(){
		this.isSave = false;
		this.dialog.hidden();
		this.isSave = true;
	},
	resetData:function(){
		
		if(this.isChanged()){
			this.selectItem(config.common.t);
		}
		if(this.headCustom){
			if(this.headCustom.uploadView){
				this.headCustom.uploadView.setCancel();
				this.headCustom.uploadView.customOption.setCancel();
			}
		}
		if(this.bgCustom){
			if(this.bgCustom.uploadView){
				this.bgCustom.uploadView.setCancel();
				this.bgCustom.uploadView.customOption.setCancel();
			}
		}
	},
	resetSeclect:function(){
		if(this.headCustom){
			if (config.common.head.usepic && config.common.head.usepic == 1) { //custom
				this.headCustom.selectItem("custom");
			}
			else{
				this.headCustom.selectItem("default");
			}
		}
		if(this.bgCustom){
			if (config.common.bg.usepic && config.common.bg.usepic == 1) { //custom
				this.bgCustom.selectItem("custom");
			}
			else{
				this.bgCustom.selectItem("default");
			}
		}
	}
};



if ($IE) {
	var SwapLink = {
		getThemeLinds: function(){
//			if(!this.tip){
//				this.tip=new $ProcessTip();
//				this.tip.setTipText("正在读取中...");
//			}
//			this.tip.onProgress();
			//$E("blogname").innerHTML+=this.tip.tip.style.display+"-*-";
			var cssLinks = document.getElementsByTagName("link"), length = cssLinks.length, d_links = [];
			for (var i = 0; i < length; i++) {
				var href = cssLinks[i].href;
				if (href.indexOf("/t.css") != -1){
					d_links.push(cssLinks[i]);
				}
			}
			return d_links;
		},
		appendLink: function(ids, onloadFunc){
			var themeLink = this.$CLink(scope.$BASECSS + "tpl/" + ids[0] + "_" + ids[1] + "/t.css");
			themeLink.onload = onloadFunc;
			
			//加延迟执行，避免在IE下背景为空白
			setTimeout(function(){
				document.getElementsByTagName("head")[0].appendChild(themeLink);
			},1);
			
		},
		deleteTLink: function(links){
			for (var i = 0; i < links.length; i++) {
				links[i].disabled="disabled";
				Core.Dom.removeNode(links[i]);
			}
			this.loading=false;
			//this.tip.onComplete();
			//$E("blogname").innerHTML+=this.tip.tip.style.display+"-+-";
		},
		$CLink: function(href){
			var link = $C("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = href;
			return link;
		}
		,loading:false
	};
}

