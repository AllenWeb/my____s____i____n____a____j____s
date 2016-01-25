/**
 * @author Pjan | peijian@staff.sina.com.cn
 * 提示黄条
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("diy/mb_dialog.js");
$import("diy/curtain.js");
$import("sina/core/dom/getXY.js");


/**
 * 黄条提示
 * @param {Object|String}	msgCode	和App.getMsg保持一致
 * @param {Object|String}	replace 和App.getMsg保持一致
 * @param {String}			id	显示黄签的id
 * @param {String} 		type	图标类型
 * 
 * @example 
 App.promptTip ({code:"A00006"});
*/
	
App.promptTip = function(msgCode, replace, id, type){
	var icon = {
		"ask" : 4,
		"wrong" : 1,
		"error" : 2,
		"ok" : 3 
	};
	type = type ? type : "ok";
	var promptText = (typeof msgCode == "object") ? App.getMsg(msgCode, replace) : msgCode;
	var str = '\
		<div class="PY_clew">\
	            <div class="PY_clewcon">\
	                <div class="icon"><img align="absmiddle" class="PY_ib PY_ib_' + icon[type] + '" src="'+scope.$BASEIMG+'style/images/common/PY_ib.gif" alt="" title=""/></div>\
	                <div class="txt bold">\
	                    ' + promptText + '\
	                </div>\
	                <div class="clear"></div>\
	            </div>\
	    </div>';
	var errId = $E(id ? id : "system_information");
	errId.innerHTML = str;
	errId.style["display"] = '';
	App.curtain.droop(errId);
	window.scrollTo(0, 0);
	
	
	App.promptTip.close = (function(allreadyId){
		return function(){
			if(allreadyId){
				//allreadyId.innerHTML = "";
				App.curtain.raise(allreadyId);
				//allreadyId.style["display"] = 'none';
			}
		}
	})(errId);
	setTimeout(function(){
		App.promptTip.close();
	},2000);
};

