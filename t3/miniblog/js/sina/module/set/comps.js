/**
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview Component 选择模块
 * @author L.Ming | liming1@sina.staff.com.cn
 * @version 1.0
 * @since 2008-09-08
 */
$import("sina/module/module.js");
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/replaceNode.js");
$import("sina/core/array/findit.js");
$import("sina/core/array/copy.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/array/foreach.js");
$import("sina/core/array/insert.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/j2o.js");
$import("sina/utils/template.js");
$import("sina/utils/windowDialog.js");
$import("sina/msg/systemMSG.js");
$import("sina/msg/compsMSG.js");
$import("sina/module/component/updateComponentToConf.js");

Module.SetComps = Core.Class.create();
Module.SetComps.prototype = {
	/**
	* 关闭时是否需要提示保存
	*/
	isSave:true,
	
	initialize:function(dialog){
		this.dialog = dialog;
		var _list = config.component.x;
		var compConfig = [];
		for(var m = 1; m <= _list; m ++ ){
//			alert(config.component["c" + m]);
			compConfig = compConfig.concat(config.component["c" + m] || []);
		}
		scope.setCompsResult = compConfig;
//		alert("页面设置：congfig 接口已经有的组件<br/>" + compConfig);
		this.initHtml();
	},
	initHtml:function(){
		var html='<div class="CP_setcnt">' + 
					'<div class="CP_setview">' +
						'<div class="CP_setvw">' +
							'<table>' +
								'<tbody><tr>' +
									'<td id="module_set_thumb" style="background-image:url(http://simg.sinajs.cn/common/images/module_thumb/default.gif)">&nbsp;</td>' +
								'</tr>' +
							'</tbody></table>' +
							'<p id="pageset_comp_desc" class="CP_setdesp">勾选右侧模块，保存后模块即可显示在您的首页中，您还可以拖动模块改变位置。</p>' +
						'</div>' +
					'</div>' +
					'<div class="CP_setmds">' +
						'<dl>###</dl>' +
					'</div>' +
				'</div>';
		var _result = "";
		if($CONFIG.$product != "app"){
			var _moduleName = ["其他", "固定模块", "基本模块", "扩展模块", "活动模块", "应用模块", "特殊模块", "widget"];
			var _group = {
				"base" : _moduleName[2],
				"extend" : _moduleName[3],
				"activity" : _moduleName[4]
			};
			var _sub = [];
			for(var key in _group){
				_result += '<dt><em>' + _group[key] + '：</em></dt><dd id="pageset_' + key + 'list">内容读取中...</dd>';
			}
		}
		var _appHTML = '';
		/*
		var _appHTML = '<dt><em>应用模块：</em><a class="CP_a_fuc" href="javascript:;">[<cite>添加更多应用</cite>]</a></dt>\
				<dd id="pageset_applist">内容读取中...\
				<!--<p><label><input type="checkbox"/>心理测试</label></p>//-->\
			</dd>';*/
		var _customHTML = '<dt><em>自定义内容模块：</em><a class="CP_a_fuc" ' +
					'href="javascript:;" onclick="return false;">[<cite onclick="Module.SetComps._open(\'text\')">创建文本模块</cite>]</a><a class="CP_a_fuc" ' +
					'href="javascript:;" onclick="return false;">[<cite onclick="Module.SetComps._open(\'link\')">创建列表模块</cite>]</a><a class="CP_a_fuc" ' +
					'href="javascript:;" onclick="return false;">[<cite onclick="Module.SetComps._open(\'manage\')">管理</cite>]</a></dt>' +
					'<dd id="pageset_customlist">内容读取中...' +
					'</dd>';
		switch ($CONFIG.$product){
			case "blog":
				_result += _appHTML + _customHTML;
				break;
			case "space":
				_result += _appHTML;
				break;
			case "app":
				_result = _appHTML;
				break;
		}
		$E("comps_tab_content").innerHTML = html.replace(/###/g, _result);
		try {
			this.loadDefaultData();
		}
		catch(e){}
//		this.loadAppData();
		try {
			this.loadDiyData();
		}
		catch(e){}		
		Core.Events.addEvent("comps_tab_save", Core.Function.bind2(this.save,this), "click");
		Core.Events.addEvent("comps_tab_cancel", Core.Function.bind2(this.cancel,this), "click");
		return;
	},
	loadDefaultData : function () {
		var _default = new Interface("http://icp.cws.api.sina.com.cn/pfconf/get_productmodule.php", "jsload");
		_default.request({
			GET : {
				"uid" : scope.$uid,
				"productid" : scope.pid_map[$CONFIG.$product]
			},
			onSuccess : function (data) {
				var _base = [], _extend = [], _activity = [];
				if (data == "") {
					this.parseData($E("pageset_baselist"));
					this.parseData($E("pageset_extendlist"));
					this.parseData($E("pageset_activitylist"));				
				}
				else {
					var _data = Core.String.j2o(data);
//					$Debug("页面设置默认组件：" + _data);
					scope.modulesInfo = {};
					for (var key in _data) {
						//					$Debug("key : " + key  + ", _data[key] : " + _data[key]);
						if (_data[key] == null || _data[key].mod_order == "") {
							continue;
						}
						_data[key].cid = key;
						_data[key].name = Core.String.a2u(_data[key].ria_title);
						scope.modulesInfo[key] = {};
						scope.modulesInfo[key].des = Core.String.a2u(_data[key].ria_desc);
						scope.modulesInfo[key].ria_icon = _data[key].ria_icon;
						scope.modulesInfo[key].isNew = (_data[key].is_new == "1");
						switch (_data[key].mod_type) {
							case "2":
								_base.push(_data[key]);
								break;
							case "3":
								_extend.push(_data[key]);
								break;
							case "4":
								_activity.push(_data[key]);
								break;
						}
					}
					_base = _base.sort(function(a, b){
						return window.parseInt(a.mod_order) - window.parseInt(b.mod_order);
					});
					_extend = _extend.sort(function(a, b){
						return window.parseInt(a.mod_order) - window.parseInt(b.mod_order);
					});
					_activity = _activity.sort(function(a, b){
						return window.parseInt(a.mod_order) - window.parseInt(b.mod_order);
					});
				//				alert("模块信息\n2 : " + _base.length + "个\n" + "3 : " + _extend.length + "个\n" + "4 : " + _activity.length + "个");	
				this.parseData([_base, $E("pageset_baselist")]);
				this.parseData([_extend, $E("pageset_extendlist")]);
				this.parseData([_activity, $E("pageset_activitylist")]);
				}
			}.bind2(this),
			onError : function () {
				
			}.bind2(this),
			onFail : function () {
				
			}.bind2(this)
		});
	},
// App 组件，此功能暂时关闭
//	loadAppData : function(){
//		return;
//		$Debug(_data);
//		var _custom = new Interface("http://v.space.sina.com.cn/app/list.php?uid=" + scope.$uid, "jsload");
//		_custom.request({
//			onSuccess : function (data) {
//				this.parseAppData([data, $E("pageset_applist")]);
//			}.bind2(this),
//			onError : function (){},
//			onFail : function () {}
//		});
//	},
//	parseAppData : function(_data){
//		
//	},
	loadDiyData : function(){
//		$Debug("load Diy Component List");
		if($CONFIG.$product != "blog"){
			return false;
		}
		var _custom = new Interface("http://control.blog.sina.com.cn/admin/custom/get_custom_info.php?uid=" + $uid, "jsload");
		_custom.request({
			onSuccess : function (data) {
				if (data != null) {
					this.parseData([data, $E("pageset_customlist")]);
				}
				else{
					this.parseError($E("pageset_customlist"));
				}
			}.bind2(this),
			onError : function (){},
			onFail : function () {}
		});
	},
	parseData : function(_data){
		var _list = window.config.component.x;
		var compConfig = [];
		for(var m = 1; m <= _list; m ++ ){
			compConfig = compConfig.concat(window.config.component["c" + m] || []);
		}
		scope.setCompsResult = compConfig;
		var sResult = "";
		if (_data[0].length == 0) {
			sResult = "此分类暂无组件。";
		}
		else {
			var _template = '<p><label class="#{className}"><input id="#{id}" type="checkbox" #{chk} onclick="Module.SetComps._click(this, #{index})"/><span title="#{name}">#{name}#{img}</span></label></p>';
			var _result = [];
			for (var i = 0, len = _data[0].length; i < len; i++) {
				try {
					var _item = {};
					_item.index = _data[0][i].cid;
					_item.id = "pageset_comp" + _data[0][i].cid + "_status";
					
					if(Core.Array.findit(scope.setCompsResult, _data[0][i].cid) > -1){
						_item.chk = "checked";
						_item.className="CP_setmds_checkbox";
					}
					else{
						_item.chk="";	
					}

					_item.name = _data[0][i].name;
					_item.img = (typeof scope.modulesInfo[_data[0][i].cid] != "undefined" && scope.modulesInfo[_data[0][i].cid].isNew) ? '<img align="absmiddle" title="" alt="" src="http://simg.sinajs.cn/common/images/CP_i.gif" class="CP_i CP_i_fresh"/>' : '';
					//$Debug(_item.index + ":" + _item.id + ":" + _item.chk + ":" + _item.name)
					_result.push(_item);
				}catch(e){
					$Debug(e.message);
				}
			}
			var tmp = new Utils.Template(_template);
			sResult = tmp.evaluateMulti(_result, false);
		}
		$E(_data[1]).innerHTML = sResult;
		
		//后期增加的，接口里没有提供，当页面中有推荐时显示选项。-ant-zhangpeng@staff...
		if(config["private"]){
			if(_data[1] == $E("pageset_extendlist") && config["private"].tj  && config["private"].tj == 1){
			if ($E("module_909")) {
				$E(_data[1]).innerHTML += '<P><label class="CP_setmds_checkbox"> <input id="pageset_comp909_status" checked type="checkbox" onclick="Module.SetComps._click(this, 909)"/><span title="博主被推荐的博文">博主被推荐的博文</span></label></p>';
			} else {
				$E(_data[1]).innerHTML += '<P><label class=""> <input id="pageset_comp909_status"  type="checkbox" onclick="Module.SetComps._click(this, 909)"/><span title="博主被推荐的博文">博主被推荐的博文</span></label></p>';
			}
			scope.modulesInfo = scope.modulesInfo || {};
			scope.modulesInfo["909"] = {};
			scope.modulesInfo["909"].des = "博主被推荐的博文：展示自己曾经被新浪博客推荐过的精彩博文。";
			}
		}
		
	},
	parseError : function (_cnt) {
		_cnt.innerHTML = "该分类数据读取失败。";
	},
	chkboxClick : function (cid) {
//		$Debug("defaultChecked : " + ($E("pageset_comp" + cid + "_status").defaultChecked == true));
	},
	isChanged : function(){
		function compare1(x1,x2){
			var num1 = window.parseInt(x1);
			var num2 = window.parseInt(x2);
			return num1>=num2?1:-1;
		}
		var c1=Core.Array.copy(config.component.c1);
		var c=config.component.c3?c1.concat(config.component.c3):c1;
		var setCompsResult=Core.Array.copy(scope.setCompsResult);

		return setCompsResult.sort(compare1).join().localeCompare(c.sort(compare1).join());
	},
	save:function(){
		// 需做多列兼容
//		config.component.c2 = config.component.c2 || [];
		var cols = config.component.x, _currCnf = [];
		for(var i = 1; i <= cols; i ++){
			_currCnf = _currCnf.concat(config.component["c" + i]);
		}
		_userCnf = scope.setCompsResult;
		var diffDel = Core.Array.ArrayWithout(_currCnf, _userCnf);
//		diffDel = diffDel.concat(Core.Array.ArrayWithout(_userCnf, _currCnf));
		var diffAdd = Core.Array.ArrayWithout(_userCnf, _currCnf).reverse();
//		alert("add : " + diffAdd + "\ndel : " + diffDel);
		var c1 = config.component.c1;
		if (config.component.x > 2) {
			var c2 = config.component.c3;
			Core.Array.foreach(diffAdd, function(e){
				c2 = Core.Array.insert(c2, 0, e);
			});
		}
		else {
			Core.Array.foreach(diffAdd, function(e){
				c1 = Core.Array.insert(c1, 1, e);
			});
		}
		c1 = Core.Array.ArrayWithout(c1, diffDel);
		if (c2) {
			c2 = Core.Array.ArrayWithout(c2, diffDel);
		}
		var _result = (config.component.x > 2) ? (c1 + "||" + c2) : (c1 + "|");
		Module.Component.updateComponentToConf(_result);
//		$Debug("save");
	},
	cancel:function(){
		this.isSave=false;
		this.dialog.hidden();
		this.isSave=true;
	},
	resetData:function(){
		var c1=Core.Array.copy(config.component.c1);
		var c=config.component.c3?c1.concat(config.component.c3):c1;
		var cList=","+c.join()+",";
		var setCompsResultList=","+Core.Array.copy(scope.setCompsResult).join()+",";
		
		//去掉新勾选的
		for(var i=scope.setCompsResult.length-1;i>=0;i--){
			if(cList.indexOf(","+scope.setCompsResult[i]+",")==-1){
				$E("pageset_comp"+scope.setCompsResult[i]+"_status").checked=false;
				$E("pageset_comp"+scope.setCompsResult[i]+"_status").parentNode.className="";
				scope.setCompsResult.splice(i,1);
			}
		}
		
		//恢复之前选中的
		for(var j=0;j<c.length;j++){
			if(setCompsResultList.indexOf(","+c[j]+",")==-1){
				$E("pageset_comp"+c[j]+"_status").checked=true;
				$E("pageset_comp"+c[j]+"_status").parentNode.className="CP_setmds_checkbox";
				scope.setCompsResult.push(c[j]);
			}
		}
	}
};
Module.SetComps._click = function (obj, key) {
//	$Debug(key + " click! ");
	if(obj.checked){
		if (scope.setCompsResult.length >=21) {
			obj.checked=false;
			windowDialog.alert("你的页面模块已超过20个，不能继续添加。过多的模块会影响页面的打开速度。", {"icon" : "03"});
		}
		else {
			obj.parentNode.className="CP_setmds_checkbox";
			// Modified by L.Ming 20090720  组件缩略图改由接口中读取
			$E("module_set_thumb").style.backgroundImage = key < 1000 ? ('url(' + scope.modulesInfo[key].ria_icon + ')') : 'url(http://simg.sinajs.cn/common/images/module_thumb/default.gif)';
			$E("pageset_comp_desc").innerHTML = (key > 1000 && key < 2000) ? "自定义内容模块：用自写的文本或列表，丰富您的博客内容。" : scope.modulesInfo[key].des;
			scope.setCompsResult.push(key);
		}
	}
	else{
		obj.parentNode.className="";
		$E("module_set_thumb").style.backgroundImage = 'url(http://simg.sinajs.cn/common/images/module_thumb/default.gif)';
		scope.setCompsResult = Core.Array.ArrayWithout(scope.setCompsResult, [key]);
		$E("pageset_comp_desc").innerHTML = "勾选右侧模块，保存后模块即可显示在您的首页中，您还可以拖动模块改变位置。";
	}
};
Module.SetComps._open = function (oDialog, sUrl){
	checkAuthor();
	if(!$isAdmin){
		windowDialog.alert($SYSMSG.A00003, {
			funcOk : function () {
				window.location.reload();
			},
			icon : "03"
		});
		return;
	}
	var _link = {
		"text" : {
			"title" : "设置模块 > 管理自定义模块 > 自定义文本模块",
			"url": "http://control.blog.sina.com.cn/admin/custom/custmod/new_custmod.php?t=html"
		},
		"link" : {
			"title" : "设置模块 > 管理自定义模块 > 自定义列表模块",
			"url": "http://control.blog.sina.com.cn/admin/custom/custmod/new_custmod.php?t=link"
		},
		"manage" : {
			"title" : "设置模块 > 管理自定义模块",
			"url": "http://control.blog.sina.com.cn/admin/custom/custmod/custmod_list.php"
		}
	};
	sUrl = sUrl || _link[oDialog].url;
//	alert(sUrl);
	if (typeof scope.customModuleDialog == "undefined") {
		var _param = {
			ad: false,
			drag: true,
			title: _link[oDialog].title,
			content: "",
			shadow: 1,
			width: 620,
			height: 422
		};
		var _func = {
			onDragStart: function(){},
			onDrag: function(){},
			onDragEnd: function(){},
			onContentUpdate: function(){},
			onPosUpdate: function(){},
			onShow: function(){},
			onHidden: function(){}
		};
		var _dialog = new Sina.Utils.dialog(_param, _func);
		_dialog.setIframe({
			url: sUrl,
			width: 620,
			height: 422
		});
		_dialog.setMiddle();
		_dialog.show();
		scope.customModuleDialog = _dialog;
	}
	else {
		scope.customModuleDialog.setIframe({
			url: sUrl,
			width: 620,
			height: 422
		});
		scope.customModuleDialog.setTitle(_link[oDialog].title);
		scope.customModuleDialog.setMiddle();
		scope.customModuleDialog.show();
	}
	if(typeof scope.pageSetDialog != "undefined"){
		scope.pageSetDialog.hidden();
	}
};

window.$refreshDiyComp = function(){
	if (scope.$_setCompsTab != null) {
		scope.$_setCompsTab.loadDiyData();
	}
};