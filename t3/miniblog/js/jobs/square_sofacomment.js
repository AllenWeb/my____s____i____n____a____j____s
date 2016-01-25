/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("jobs/topTray.js");
$import("jobs/inputHandler.js");
$import("jobs/miniblog_search.js");
$import("jobs/commentMethod.js");
$import("jobs/commentConsole.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/replaceNode.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import("diy/prompttip.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import('sina/core/string/decodeHTML.js');
$import("diy/getTextAreaHeight.js");
$import("diy/forbidrefresh_dialog.js");
/**
 * 回复某人的评论
 * @param {Number}  iCommentUid 必选参数，发评论者 UID
 * @param {Number}  iOwnerUid   必选参数，资源所属者 UID
 * @param {Number}  iResourceId 必选参数，资源 ID，被评论的资源
 * @param {String}  sCname      评论者昵称
 * @param {String}  sProductId  必选参数，产品 ID，例如：miniblog - 微博客
 * @param {String}  sResTitle   必选参数，资源标题只有在评论管理中才会出现
 */
scope.square_replyByCid = function(iCommentUid, iOwnerUId, iResourceId, sCname, sProductId, sResTitle, page){
    var oContentNode;
    var bListInDiv = 2;
    var oPostNode = $E("_comment_post_" + sProductId + "_" + iResourceId);
    var oLoginDiv = $E("_comment_logindiv_" + sProductId + "_" + iResourceId);
    var oLoginuser = $E("_comment_loginuser_" + sProductId + "_" + iResourceId);
    var oLoginpassword = $E("_comment_loginpassword_" + sProductId + "_" + iResourceId);
    var oSofalist = $E("sofalist");
    //如果是大评论初始化回复内容到评论下方的输入框中
    oContentNode = $E("_comment_content_" + sProductId + "_" + iResourceId);
    if (Core.String.trim(oContentNode.value) == "") {
        App.promptTip($CLTMSG['CX0010'], "", "", "wrong");
        return false;
    }
    //回复按钮效继承唯评论按钮的基础属性
    var oCommentButton = $E("_comment_post_" + sProductId + "_" + iResourceId);
    if (oCommentButton.locked) {
        return
    };
    oCommentButton.locked = true;
    oCommentButton.className = "btn_notclick";
    
    scope.initCommentLoginInput(oLoginuser, oLoginpassword);
    
    var content = oContentNode.value;
    
    oCommentButton.oParam = {
        "uid": scope.$uid,
        "ownerUid": iOwnerUId,
        "resourceId": iResourceId,
        "productId": sProductId,
        "resTitle": sResTitle,
        "content": content,
        "listInDiv": bListInDiv,
        "cName": sCname,
        "sofa": '1',
        "role": -1,
        "page": $E(page),
        "retcode": scope.doorretcode
    };
    scope.doorretcode = "";
    
    
    //同时发一条微博
    var oForward = $E("sofa_agree");
    if (oForward.checked) {
        oCommentButton.oParam.forward = 1;
    }
    var _setextinfo = function(extinfo){
        if (extinfo && extinfo.length > 0) {
            if (!scope.extinfo) {
                scope.extinfo = new Array();
            }
            for (var i = 0; i < extinfo.length; i++) {
                scope.extinfo[extinfo[i]["shorturl_id"]] = {
                    url: extinfo[i]["url"],
                    title: extinfo[i]["title"],
                    type: extinfo[i]["type"],
                    ourl: extinfo[i]["ourl"]
                };
            }
        }
        else {
            return false;
        }
    };
    var _success = function(result){
		
        $E("nextsofa").style.display = "";
        $E("system_information").style.display = "none";
        if (result) {
            var _feedlist = result.data.html;
            //$E("okbox").style.position="absolute";
            //Core.Dom.setXY($E("okbox"),Core.Dom.getXY(oContentNode));
            //oContentNode.style.visibility = 'hidden';
            oContentNode.disabled = true;
            oContentNode.style.backgroundColor = "#ffffff";
            oContentNode.value = "";

            $E("okbox").style.display = '';
            setTimeout(function(){
                //oContentNode.style.visibility = 'visible';
                oContentNode.disabled = false;
                oContentNode.style.backgroundColor = "#ffffff";
                $E("okbox").style.display = 'none';
                if (result.data) {
                    var feedBox = document.createElement('UL');
                    $E('feedlist').parentNode.insertBefore(feedBox, $E('feedlist'));
                    feedBox.innerHTML = _feedlist;
                    //_setextinfo(result.data.extinfo);
                    App.bindMedia(feedBox);
                    if ($E('feedlist').getElementsByTagName('LI').length > 0) {
                        $E('feedlist').insertBefore((feedBox.getElementsByTagName('LI'))[0], ($E('feedlist').getElementsByTagName('LI'))[0]);
                    }
                    else {
                        $E('feedlist').appendChild((feedBox.getElementsByTagName('LI'))[0]);
                    }
                    
                    feedBox.parentNode.removeChild(feedBox);
                    //Core.Dom.insertHTML($E('feedlist'), _feedlist, "AfterBegin");
                    // _setextinfo(result.extinfo);
                    // App.bindmedia(_mblog);
                }
                scope.square_commentfresh(oCommentButton.oParam["page"]);
                oContentNode.value = "";
                oCommentButton.locked = false;
                oCommentButton.className = "btn_normal";
                
            }, 3000);
        };
            };
    var _fail = function(result){
        oCommentButton.locked = false;
        oCommentButton.className = "btn_normal";
        if (result) {
            if (result.code == "MR0050") {
                App.forbidrefresh(function(){
                    Core.Events.fireEvent(oCommentButton, "click");
                }, "/comment/addcomment.php");
                return false;
            }
            App.promptTip({
                code: result.code
            }, "", "", "wrong");
            
        }
    };
    var postfeedlist = function(_success, _fail){
        Utils.Io.Ajax.request("/comment/addcomment.php", {
            "POST": oCommentButton.oParam,
            "onComplete": function(oResult){
                //如果用户未登陆，则先让用户登陆
                if (oResult.code == "A00006") {
					_success(oResult);
                }
                //失败回调
                else {
                    _fail(oResult)
                }
            },
            "onException": function(){
				alert('error');
            },
            returnType: "json"
        });
    }
    if (!oContentNode.binded) {
        Core.Events.addEvent(oContentNode, function(event){
            if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
                oContentNode.blur();
                Core.Events.fireEvent(oCommentButton, "click");
            }
        }, "keyup");
        oContentNode.binded = true;
    }
    
    postfeedlist(_success, _fail);
    if (scope.$uid == "") {
        oCommentButton.$loginDiv = oLoginDiv;
        oCommentButton.$loginuser = oLoginuser;
        oCommentButton.$loginpassword = oLoginpassword;
        oLoginDiv.style.display = "block";
    }
};
scope.changesofatype = function(id, page){
	var filter = {
		'sofa_all':{},
		'sofa_city':{city:1},
		'sofa_male':{gender:1},
		'sofa_female':{gender:2}
	};
	var fil = {};
	(function(aid,p,f,ft){
		for(var i in f){
			if (i == aid) {
				var c = $C('SPAN');
				var temp = $E(i);
				c.innerHTML = temp.innerHTML;
				c.id=i;
				Core.Dom.replaceNode(c, temp);
				for (var j in f[i]) {
					ft[j] = f[i][j];
				}
				continue;
			}
			else {
				if ($E(i) && $E(i).tagName == 'SPAN') {
					var d = $C('A');
					var temp = $E(i);
					d.innerHTML = temp.innerHTML;
					d.id=i;
					d.href = "javascript:void(0);"
					d.onclick = function(){
						scope.changesofatype(d.id, p, f[i]);
                    };
					Core.Dom.replaceNode(d, temp);
	                continue;
				}
			}
		}
	})(id, page,filter,fil);
	scope.sofatype = fil;
    scope.square_commentfresh(page);
};
//chibin add filter参数，用于抢沙发页filter处理
scope.square_commentfresh = function(page){
    var changebtn = $E("changebtn");
    changebtn.oParam = {
        "sofa": '1',
        "page": $E(page) ? $E(page).value : page.value
    };
    if (scope.sofatype) {
//        var filparm = App.htmlToJson($E('filter'), ['INPUT'])
//        for (var i in filparm) {
//            changebtn.oParam[i] = filparm[i];
//        }
        for (var k in scope.sofatype) {
			changebtn.oParam[k] = scope.sofatype[k];
		}
    }
    var _setextinfo = function(extinfo){
        if (extinfo && extinfo.length > 0) {
            if (!scope.extinfo) {
                scope.extinfo = new Array();
            }
            for (var i = 0; i < extinfo.length; i++) {
                scope.extinfo[extinfo[i]["shorturl_id"]] = {
                    url: extinfo[i]["url"],
                    title: extinfo[i]["title"],
                    type: extinfo[i]["type"],
                    ourl: extinfo[i]["ourl"]
                };
            }
        }
        else {
            return false;
        }
    };
    
    var bindtalength = function(rid, restitle){
        var resid = rid;
        var restitle = restitle;
        var productId = $CONFIG.$product;
        var cNode = $E("_comment_content_" + productId + "_" + resid);
        var pNode = $E("_comment_post_" + productId + "_" + resid);
        if (cNode && pNode) {
            Core.Events.addEvent(cNode, function(event){
                if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
                    cNode.blur();
                    Core.Events.fireEvent(pNode, "click");
                }
            }, "keyup");
            var _limit = function(el){
                var snapLength = Core.String.byteLength(el.value);
                if (snapLength > 280) {
                    el.value = Core.String.leftB(el.value, 280);
                }
            };
            App.autoHeightTextArea(cNode, (function(el){
                return function(){
                    _limit(el);
                };
            })(cNode));
        }
    };
    
    var bindctrlenter = function(rid, restitle){
        var resid = rid;
        var restitle = restitle;
        var productId = $CONFIG.$product;
        var cNode = $E("_comment_content_" + productId + "_" + resid);
        var pNode = $E("_comment_post_" + productId + "_" + resid);
        if (cNode && pNode) {
            Core.Events.addEvent(cNode, function(event){
                if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
                    cNode.blur();
                    Core.Events.fireEvent(pNode, "click");
                }
            }, "keyup");
        }
    };
    var postchange = function(_success, _fail){
        Utils.Io.Ajax.request("/pub/aj_sofa.php", {
            "POST": changebtn.oParam,
            "onComplete": function(oResult){
                //如果用户未登陆，则先让用户登陆
                if (oResult.code == "A00006") {
                    _success(oResult);
                }
                //失败回调
                else 
                    _fail(oResult);
            },
            "onException": function(){
            },
            returnType: "json"
        });
    };
    
    var _success = function(result){
        var tt = setTimeout(function(){
            if (result) {
                var _mblog = $E("mblog");
                _mblog.style.cssText = ""
                _mblog.removeAttribute("cacheid");
                _mblog.innerHTML = result.data.html;
                
                //if (result.data.extinfo) {
                //_setextinfo(result.data.extinfo);
                App.bindMedia(_mblog);
                //}
//                if (!changebtn.oParam['filter']) {
//                    for (var i = 3; i <= 6; i++) {
//                        $E('chb' + i).checked = true;
//                    }
//                }
//                if (!changebtn.oParam['gender']) {
//                    for (var i = 1; i <= 2; i++) {
//                        $E('chb' + i).checked = true;
//                    }
//                }
                bindctrlenter(result.data.resourceId, result.data.resTitle);
                bindtalength(result.data.resourceId, result.data.resTitle);
            };
            clearTimeout(tt);
        }, 100);
    };
    var _fail = function(result){
        if (result.code == "M14013") {
            $E("mblog").style.cssText = "";
            $E("time").innerHTML = result.time;
            $E("nextsofa").style.display = "none";
            //$E("filter_area").style.display = "none";//chibin add
            $E("mblog").innerHTML = "";
            $E("system_information_time").style.display = "";
        }
        else {
            $E("mblog").style.cssText = "";
            App.promptTip({
                code: result.code
            }, "", "", "wrong");
        }
    };
    $E("mblog").innerHTML = "";
    //    $E("mblog").style={
    //		width:"400px",
    //  height:"400px",
    //  border:"1px solid blue",
    //  background:"'+scope.$BASEIMG+'style/images/common/loading.gif"
    //	}
    $E("mblog").style.cssText = 'height:200px;background:url("'+scope.$BASEIMG+'style/images/common/loading.gif") center no-repeat';
    //$E("mblog").innerHTML = '<img src="'+scope.$BASEIMG+'style/images/common/loading.gif" style="border: 0px none ; position: relative; background-color: transparent;  width: 20px; height: 20px; z-index: 1001; align:center;"/>';
    postchange(_success, _fail);
};
$registJob("square_sofacomment", function(){
    var resid = scope.$resourceId;
    var restitle = scope.$resTitle;
    var sProductId = $CONFIG.$product;
    var oContentNode = $E("_comment_content_" + sProductId + "_" + resid);
    var oPostNode = $E("_comment_post_" + sProductId + "_" + resid);
    Core.Events.addEvent(oContentNode, function(event){
        if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
            oContentNode.blur();
            Core.Events.fireEvent(oPostNode, "click");
        }
    }, "keyup");
    var _limit = function(el){
        var snapLength = Core.String.byteLength(el.value);
        if (snapLength > 280) {
            el.value = Core.String.leftB(el.value, 280);
        }
    };
    App.autoHeightTextArea(oContentNode, (function(el){
        return function(){
            _limit(el);
        };
    })(oContentNode));
	scope.sofatype = scope.sofatype||{} ;
});



