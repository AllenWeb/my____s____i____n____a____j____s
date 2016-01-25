/**
 * 重载组件
 * @param {Number} sId 组件 ID 号
 */
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/stopEvent.js");
$import("sina/utils/dialog.js");
$import("sina/utils/windowDialog.js");
$import("sina/module/componentRender/renderByList.js");
$import("sina/module/component/updateComponentToConf.js");
$import("sina/msg/systemMSG.js");
/*
App.showDialogContent=function(str, op){
	var dialogCfg = {
		ad: false,
		title: op.title || "提示！",
		drag: true,
		shadow: op.shadow || 1,
		css: "Dialog",
		content: "",
		middle: true,
		width: op.width || 300,
		height: op.height || 300
	};
	var func = {};
	if (typeof window.htmlDialog == "undefined") {
		var dialog = new Sina.Utils.dialog(dialogCfg, func);
		window.htmlDialog = dialog;
	}
	else{
		dialog = window.htmlDialog;
	}
	dialog.setContent(str);
	dialog.setTitle(op.title);
	dialog.setSize(op.width, op.height);
	dialog.show();
	dialog.setMiddle();
	return dialog;	
};
*/
/**
 * 克隆组件
 * @param {Number} sId 组件 ID 号
 */
//Module.Component.clone = function (sId) {
//	alert("clone " + sId);
//};
/**
 * 管理组件
 * @param {Number} sId 组件 ID 号
 */
/*
manageComp = Module.Component.manage = function (sId) {
	e = "" + sId;
	var sUrl = "", sTitle="", w, h, scr = "yes", inDialog = false;
	switch(e) {
		case "3":
			sUrl = "http://control.blog.sina.com.cn/admin/article/article_class_list.php?" + Math.random(); //458 426
			w = 430;
			h = 422;
			sTitle = "分类管理";
			inDialog = true;
			break;
		case "15":
			sUrl = "http://relay.widget.sina.com.cn/relay/widget_relay_setup.php";
			w = 550;
			h = 500;
			scr = "no";
			break;
		default:
			sUrl = "http://control.blog.sina.com.cn/admin/custom/custmod/edit_custmod.php?cid=" + e + "&" + Math.random();
			w = 620;
			h = 422;
			sTitle = "设置模块 > 管理自定义模块";
			inDialog = true;
			break;
	}
	if(inDialog){
		var sContent = '<iframe src="' + sUrl + '" style="width:' + w + 'px;height:' + h + 'px;" frameborder="0" scrolling="no"></iframe>';
		App.showDialogContent(sContent, {
			title: sTitle,
			width:	w,
			height:h
		});
	}
};
*/

manageComp = Module.Component.manage = function(sId){
	if(typeof scope.currentModule[sId] != "undefined" && typeof scope.currentModule[sId].manage != "undefined"){
//		$Debug("调用实例本身的管理");
		scope.currentModule[sId].manage();
	}
	else if(sId > 1000 && sId <= 2000) {
		sUrl = "http://control.blog.sina.com.cn/admin/custom/custmod/edit_custmod.php?cid=" + sId + "&" + Math.random();
		Module.SetComps._open("manage", sUrl);
	}
	else if(sId > 2000) {
		$Debug("App组件 " + sId + " 管理");
	}
	else {
		$Debug("1000以下的组件，但未定义管理功能");
	}
};
/**
 * 刷新指定的组件
 * @param {Object} sId
 */ 
refreshComp = Module.Component.reload = function (sId) {
	var arrRefreshComp = [];
	for(var i = 0; i < arguments.length; i ++){
		arrRefreshComp[i] = arguments[i];
	}
	setTimeout(Module.ComponentRender.renderByList(arrRefreshComp), 2000);
};
/**
 * 删除指定的组件
 * @param {Number} sId 组件 ID 号
 */
hideComp = Module.Component.manage = function (sId,states) {
	windowDialog.confirm(arguments.length==2?"确实要隐藏此模块吗？此模块的活动已结束，隐藏后不可恢复。":"要隐藏该内容模块吗？隐藏后可以在页面设置模块中再次显示。", {
		textOk : "是",
		funcOk : function(){			
			var compConfig = config.component;
			var compList = [];//alert(config.b + " / " + scope.p_key)
			for(var i = 1, len = parseInt(compConfig.x) + 1; i < len; i ++){
				config.component["c" + i] = compConfig["c" + i] = Core.Array.ArrayWithout(compConfig["c" + i], [sId]);
				compList.push(compConfig["c" + i]);
			}
		var _delComp = new Interface("http://icp.cws.api.sina.com.cn/pfconf/module_hidden.php", $IE6 ? "ijax" : "jsload");
		
		_delComp.request({
				GET:{
					uid:scope.$uid,
 					productid:scope.pid_map[$CONFIG.$product],
 					moduleid:sId
				},
				onSuccess : function () {
//					alert("数据提交成功");
					window.removeComp(sId);
					if(typeof config.component.c3 != "undefined" && config.component.c3.length == 0){
						if(Core.Dom.getElementsByClass($E("column_2"), "div", "column3empty") == 0){
							//无空列显示
							var emptySig = $C("div");
							emptySig.className = "column3empty";
							emptySig.innerHTML = "您可将模块放置在此!";
							$E("column_2").appendChild(emptySig);
						}
					}
				},
				onError : function (_data){
					showError(_data.code);
				},
				onFail : function () {
					$Debug("组件删除接口请求异常");
					showError("A00001");
				}
			});
				
		},
		textCancel : "否"		
		});
//	Core.Events.stopEvent();
};

window.removeComp = function (sId) {
	if($E("module_" + sId)){
		Core.Dom.removeNode($E("module_" + sId));
	}
};