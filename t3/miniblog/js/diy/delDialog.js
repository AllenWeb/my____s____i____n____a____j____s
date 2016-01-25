/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("diy/flyDialog.js");

/**
 * 删除提示层
 * @param {String}      sText       必选参数，提示文字，     例如：你确定要删除你的账号不？
 * @param {String}      sPostApi    必选参数，提交的接口地址，例如：/public/del.php
 * @param {Object}      oPost       必选参数，提交参数，     例如：{"rid":123456,uid:"123456"}
 * @param {Function}    fCallBack   可选参数，成功回调函数
 * @param {Function}    fError      可选参数，失败回调函数
 * @param {HTMLElement} oFormTarget 可选参数，层从那个HTML对象飞出
 */

App.delDialog = function( sText, sPostApi, oPost, fCallBack, fError, oFormTarget, sTitle ){
	
	var oDialog = App.flyDialog( sText, "confirm", oFormTarget||null, {
		ok : function(){
			//同时将用户加入黑名单，updated by yuwei 2009-11-27
			if($E("block_user") && $E("block_user").checked){
				oPost.isblack = "OK";
			}			
			Utils.Io.Ajax.request(sPostApi,{
				"POST"        : oPost,
				"onComplete"  : function(json){
									if (json && json['code'] == 'A00006') {
										fCallBack(json);
									}else{
										fError(json);	
									}
								},
				"onException" : fError,
				"returnType"  : "json"
			});
		},
		icon : 4,
		title : sTitle
	});
	
	return oDialog;

}
