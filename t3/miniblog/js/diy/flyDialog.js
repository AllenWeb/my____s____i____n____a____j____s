/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("diy/flyout.js");


/**
 * 飞出弹层
 * @param {String}       sText          必选参数，显示文本
 * @param {String}       sDialogType    必选参数，弹层类型，默认为aler，例如 alert,confirm
 * @param {HTMLElement}  oFromTarget    非必选参数，弹层从该对像位置飞出，如果没有对像则没有飞出效果，与普通弹层一样
 * @param {Object}       oConfig        非必选参娄，弹层配置，见dialog.js 例如：{icon:2,ok:function(){}}
 * @example 
 *  <input id="buttonExample" type="button" value="点击以向春哥致敬"/>
 *  App.flyDialog("信春哥，得永生！！", "confirm", $E("buttonExample"), {icon:1,ok:function(){alert("春哥天福永享，寿与天齐")}};
 *  @see diy/flyout.js, diy/dialog.js
 */

App.flyDialog = function( sText, sDialogType, oFromTarget, oConfig){
//	(oConfig = oConfig||{})["hidden"] = true;
	var oAlert = App[sDialogType||"alert"]( sText, oConfig );
//	if( oFromTarget ){
//		App.doFlyOut(
//			oFromTarget,
//			oAlert._node,
//			{
//				resFun:function(){try {
//					oAlert.show();
//				}catch(e){}},
//				"style":"border:#000 2px solid;background:#bad;opacity:0.2;filter:alpha(opacity=20);zoom:1",
//				time:0.75
//			}
//		);
//	}else{
//		oAlert.show();
//	}
	return oAlert;
}
