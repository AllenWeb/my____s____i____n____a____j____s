/**
 * @author Liusong liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getElementsByClass.js");

/**
 * 获取checkbox列表，此操作仅执行一次
 */
scope.getList = function(){
	if(scope.oCommentList==null){
		var oCommentList = $E("commentsList");
		scope.oCommentList = Core.Dom.getElementsByClass( oCommentList, "input", "ckb" );
	}
	return scope.oCommentList;
}

scope.cancelSelect = function(){
	var bUnCheck = false;
	var oCheck = $E("selectall");
	var oCheckBottom = $E("selectallbottom");
	var aChecks = scope.getList();
	var iLength = aChecks.length;
	if( iLength > 0 ){
		var i = 0;
		for( i; i< iLength; i++ ){
			if(!aChecks[i].checked){
				bUnCheck = true;
				break;
			}
		}
		oCheck.checked = !bUnCheck;
		if (oCheckBottom) {
			oCheckBottom.checked = !bUnCheck;
		}
	}
};

/**
 * 选中所有可以删除的评论feed
 * @param {Boolean} bChecked
 */

scope.selectAllComment = function(bChecked){
	var oCheck = $E("selectall");
	var oCheckBottom = $E("selectallbottom");
	var bSelect = ( bChecked == null )?!oCheck.checked:bChecked;
	var aChecks = scope.getList();
	var iLength = aChecks.length;
	oCheck.checked = bSelect;
	if (oCheckBottom) {
		oCheckBottom.checked = bSelect;
	};
	if( iLength > 0 ){
		var i = 0;
		for( i; i< iLength; i++ ){
			aChecks[i].checked = bSelect;
		}
	}
};

/**
 * 删除选中的评论feed
 */

scope.deleteSeleced = function(){
	var oElm = App.Comment.getTarget();
	var aChecks = scope.getList();
	var iLength = aChecks.length;
	var sMsg;
	var oPostId = [];
	var oPostCid = [];
	var oPostRid = [];
	if( iLength > 0 ){
		var i = 0;
		for( i; i< iLength; i++ ){
			if(aChecks[i].checked){
				var aValue = aChecks[i].value.split(",");
				oPostId.push(aValue[2]);
				oPostCid.push(aValue[1]);
				oPostRid.push(aValue[0]);
			}
		}
		if( oPostId.length>0 && oPostCid.length>0 ){
			App.Comment.alert(oElm, App.getMsg("SCM004"), 4, function(){
				Utils.Io.Ajax.request("/comment/delcommentmsg.php",{
					"POST"        : {
						"delIdStr"    : oPostId.join(","),
						"delCidStr"   : oPostCid.join(","),
						"delResIdStr" : oPostRid.join(",")
					},
					"onComplete"  : function (oResult){
						//如果用户未登陆，则先让用户登陆
						if(oResult.code == "A00006"){
							setTimeout(function(){
								window.location.reload(true);
							},300);
						}
					},
					"onException" : function(oResult){
						App.alert(App.getMsg(oResult.code));
					},
					returnType : "json"
				});	
			},function(){});
		}
		else{
			App.Comment.alert(oElm, App.getMsg("SCM006"), 1);
		}
	}
};

/**
 * 初始化评论管理列表，在鼠标移入评论feed区时显示删除图标
 */

$registJob('init_commentList', function(){
	var commentList = $E("commentsList");
	var commentItems = Core.Dom.getElementsByClass(commentList,"li","commentsCell");
	var length = commentItems.length;
	var i = 0;
	if(length>0){
		for(i;i<length;i++){
			(function(item){
				var oDelBtn = Core.Dom.getElementsByClass(item,"div","icon_closel");
				if(!oDelBtn.length || !(oDelBtn = oDelBtn[0])){
					return;
				}
				Core.Events.addEvent(item, function(){
					oDelBtn.style.display = "";
					oDelBtn.style.visibility = "visible";
				},"mouseover");
				Core.Events.addEvent(item, function(){
					oDelBtn.style.visibility = "hidden";
				},"mouseout")
			})(commentItems[i]);
		}
	}
});
