/**
 * @author chibin chibin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/contains.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/removeNode.js");
$import("diy/hover.js");
/**
 * 初始化评论管理列表，在鼠标移入评论feed区时显示删除图标
 */
$registJob('init_commentoutboxlist', function(){
    var commentList = $E("commentsList");
    var commentItems = Core.Dom.getElementsByClass(commentList, "li", "commentsCell");
    var length = commentItems.length;
    var i = 0;
    if (length > 0) {
        for (i; i < length; i++) {
            (function(item){
				var oDelBtn = Core.Dom.getElementsByClass(item,"div","icon_closel");
				if( oDelBtn instanceof Array && oDelBtn[0] ){
					item.delBtn = oDelBtn[0];
				}
                Core.Events.addEvent(item, function(){
					item.delBtn.style.display = "";
                    Core.Events.stopEvent();
                }, "mouseover");
                Core.Events.addEvent(item, function(){
					item.delBtn.style.display = "none";
                }, "mouseout");
            })(commentItems[i]);
        }
    }
});

/*
 *  全选操作
 */
scope.selectAllOutboxComment = function(bChecked){
	
    var topcheck_selectall = $E("selectall");
    
    var bottomcheck_selectall = $E("selectallbottom");

    bChecked = (bChecked != null) ? bChecked : !topcheck_selectall.checked;
    topcheck_selectall.checked = bChecked;
    bottomcheck_selectall.checked = bChecked;
    var allcheck = Core.Dom.getElementsByClass($E("commentsList"), "input", "ckb");
    if (allcheck.length > 0) {
        for (var i = 0; i < allcheck.length; i++) {
            allcheck[i].checked = bChecked;
        }
    }
	return false;
}

/*
 * 选择某一条记录
 *
 */
scope.selectOutboxComment = function(){
    //uncheck false为不是全选，true为全选
    var uncheck = true;
    var topcheck_selectall = $E("selectall");
    var bottomcheck_selectall = $E("selectallbottom");
    var allcheck = Core.Dom.getElementsByClass($E("commentsList"), "input", "ckb");
    if (allcheck.length > 0) {
        for (var i = 0; i < allcheck.length; i++) {
            if (!allcheck[i].checked) {
                uncheck = false;
                break;
            }
        }
        topcheck_selectall.checked = uncheck;
        bottomcheck_selectall.checked = uncheck;
    }
}

/**
 * 删除选中的评论
 */
scope.deleteOutboxSeleced = function(){
    var allcheck = Core.Dom.getElementsByClass($E("commentsList"), "input", "ckb");
    var elm = App.Comment.getTarget();
    var sMsg;
    var postid = [];
    var postcid = [];
    var postrid = [];
    if (allcheck.length > 0) {
        for (var i = 0; i < allcheck.length; i++) {
            if (allcheck[i].checked) {
                var checkvalue = allcheck[i].value.split(",");
                postid.push(checkvalue[2]);
                postcid.push(checkvalue[1]);
                postrid.push(checkvalue[0]);
            }
        }
        if (postid.length > 0 && postcid.length > 0) {
            App.Comment.alert(elm, App.getMsg("SCM004"), 4, function(){
                Utils.Io.Ajax.request("/comment/delcommentsend.php", {
                    "POST": {
                        "delIdStr": postid.join(","),
                        "delCidStr": postcid.join(","),
                        "delResIdStr": postrid.join(",")
                    },
                    "onComplete": function(json){
                        if (json.code == "A00006") {
                            window.location.reload(true);
                        }
                    },
                    "onException": function(json){
                        if (json) {
                            App.alert(App.getMsg(json.code));
                        }
                        else {
                            App.alert($CLTMSG["CC0701"]);
                        }
                    },
                    returnType: "json"
                });
            }, function(){
            });
        }
        else {
            App.Comment.alert(elm, $CLTMSG["CC0702"], 1);
        }
    }
};





