/**
 * @fileoverview 删除访客、好友或从黑名单移除操作
 * @author xy xinyu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import('sina/core/events/addEvent.js');
$import("sina/utils/io/jsload.js");
$import("sina/utils/dialog.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/removeNode.js");
$import("sina/utils/windowDialog.js");
$import("sina/module/addToBlackPerson.js");
$import("sina/utils/windowDialog.js");
$import("sina/msg/firendMSG.js");
$import("sina/msg/visitorMSG.js");
$import("sina/msg/blackMSG.js");

var platDeleteView = function(uid, type, product, subid){
    //_uid表示需要删除的访客，好友或需要移除黑名单的uid
    this._uid = uid;
    //type表示删除的是什么东西,c代表在组件里删除访客,p代表在访客管理里删除访客
    //f代表删除好友,b代表从黑名单删除
    this._type = type;
    //$Debug(">>>>>>>>>>>"+arguments.length);
    if (arguments.length == 3) {//说明是访客页面，代表是哪个产品的访客，目前值为blog/photo/music
        this._product = product;
    }
    if (arguments.length == 4) {//说明是正文页或专辑页，代表当前博文或者专辑的id
        this._product = product;
        this._subid = subid;
    }
    this._ran = parseInt(Math.random() * 10000);
    this._did = "del_" + this._ran;
    this._oid = "ok_" + this._ran;
    //alert(this._product):
    //$Debug("this._uid="+this._uid);

};
platDeleteView.prototype = {

    initialize: function(){
        var _this = this;
        var obj = {
            ad: false,
            drag: true,
            title: "提示",
            content: _this.getHTML(),
            shadow: 1,
            close: true,
            middle: true
        };
        
        var func = {};
        //        if (window.delSomeBodyDialog) {
        //			$Debug("have one");
        //            window.delSomeBodyDialog.hidden();
        //			window.delSomeBodyDialog=null;
        //        }
        var dialog = new Sina.Utils.dialog(obj, func);
        // dialog.onClose = this.hidden;
        this.bindEvent();
        return dialog;
    },
    getHTML: function(){
        var html = '';
        if (this._type == "c" || this._type == "p") {
            if ($isAdmin) {//应该是$isAdmin
                html += '<div class="CP_layercon2"><div class="layerRow">\
          <div class="title"><img class="CP_ib CP_ib_query" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /></div>\
          <div class="cont w330">\
            <p class="sTit"><strong>确实要删除此访问记录吗？</strong></p>\
				<p class="c666">\
              <input class="iptChk" type="checkbox" id="isAddBlack"/>\
              加入黑名单</p>\
            <p class="c999 l20" >' + $SYSMSG["A10015"] + '</p>\
				</div>\
          <p class="space5"></p>\
          <p class="tCenter"><a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._oid + '\">&nbsp;&nbsp;是&nbsp;&nbsp;</cite></a>&nbsp;<a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._did + '\">&nbsp;&nbsp;否&nbsp;&nbsp;</cite></a></p>\
        </div>\
      </div></div>';
            }
            else {
                html += '<div class="CP_layercon2"><div class="layerRow">\
          <div class="title"><img class="CP_ib CP_ib_query" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /></div>\
          <div class="cont w330">\
            <p class="sTit"><strong>确实要删除此访问记录吗？</strong></p>\
				</div>\
          <p class="space5"></p>\
          <p class="tCenter"><a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._oid + '\">&nbsp;&nbsp;是&nbsp;&nbsp;</cite></a>&nbsp;<a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._did + '\">&nbsp;&nbsp;否&nbsp;&nbsp;</cite></a></p>\
        </div>\
      </div></div>';
            }
        }
        else 
            if (this._type == "f") {
                html += '<div class="CP_layercon2"><div class="layerRow">\
          <div class="title"><img class="CP_ib CP_ib_query" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /></div>\
          <div class="cont w330">\
            <p class="sTit"><strong>确实要删除此好友吗？</strong></p>\
							<p class="c666">\
              <input class="iptChk" type="checkbox" id="isAddBlack"/>\
              加入黑名单</p>\
            <p class="c999 l20" >'+$SYSMSG["A10015"]+'</p>\
				</div>\
          <p class="space5"></p>\
          <p class="tCenter"><a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._oid + '\">&nbsp;&nbsp;是&nbsp;&nbsp;</cite></a>&nbsp;<a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._did + '\">&nbsp;&nbsp;否&nbsp;&nbsp;</cite></a></p>\
        </div>\
      </div></div>';
            }
            else 
                if (this._type == "b") {
                    html += '<div class="CP_layercon2"><div class="layerRow">\
          <div class="title"><img class="CP_ib CP_ib_query" src="http://simg.sinajs.cn/common/images/CP_ib.gif" align="absmiddle" alt="" title="" /></div>\
          <div class="cont w330">\
            <p class="sTit"><strong>确实要解除此黑名单吗？</strong></p>\
				</div>\
          <p class="space5"></p>\
          <p class="tCenter"><a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._oid + '\">&nbsp;&nbsp;是&nbsp;&nbsp;</cite></a>&nbsp;<a href="javascript:;" class="CP_a_btn2" onclick="return false;"><cite id=\"' + this._did + '\">&nbsp;&nbsp;否&nbsp;&nbsp;</cite></a></p>\
        </div>\
      </div></div>';
                }
        return html;
    },
    bindEvent: function(){
        var _self = this;
        //$Debug("111111111111111");
        Core.Events.addEvent($E(this._oid), this.save.bind2(_self), "click");
        Core.Events.addEvent($E(this._did), this.hidden.bind2(_self), "click");
    },
    show: function(){
        this.dialog = this.dialog || this.initialize();
        //this.dialog.setFixed();
        this.dialog.show();
        
    },
    save: function(){
        this.hidden();
        var url = "";
        var option = {};
        var productMap = {
            "blog": 1,
            "vblog": 2,
            "photo": 8,
            "music": 1024,
            "tiezi": 64
        };
        var self = this;
        //$Debug("uid="+scope.$uid);
        if (this._type == "c" || this._type == "p") {
            //$Debug(this._subid+";"+this._product);
            //$Debug(typeof this._subid!=='undefined');
            //$Debug("arguemnts.length+"+arguments.length);
            $Debug("productMap[self._product]=" + self._product);
            if (typeof this._subid !== 'undefined') {//登陆后的文章页
                url = "http://footprint.cws.api.sina.com.cn/del.php?pid=" + productMap[self._product] + "&subid=" + this._subid + "&uid=" + scope.$uid + "&deleteuid=" + this._uid;
                if ($E("isAddBlack") && $E("isAddBlack").checked) {
                    url += "&inblack=1";
                }
            }
            else {
                url = "http://footprint.cws.api.sina.com.cn/del.php?pid=" + productMap[self._product] + "&uid=" + scope.$uid + "&deleteuid=" + this._uid;
                if ($E("isAddBlack") && $E("isAddBlack").checked) {
                    url += "&inblack=1";
                }
            }
            option = {
                onComplete: (function(txt){
                    switch (txt.code) {
                        case "A00006":
                            //							window.windowDialog.alert($SYSMSG["A00006"], {funcOk: function(){
                            window.location.reload();
                            //							}, textOk:"确定", icon: "01"});
                            break;
                        default:
                            showError(txt.code);
                            break;
                    }
                }).bind2(this),
                onException: function(txt){
                },
                charset: "utf-8"
            };
        }
        else 
            if (this._type == "f") {
                url = "http://icp.cws.api.sina.com.cn/friend/DelFriend.php?friend_uid=" + this._uid;
				if ($E("isAddBlack") && $E("isAddBlack").checked) {
                    url += "&inblack=1";
                }else{
					url += "&inblack=0";
				}
                option = {
                    onComplete: (function(txt){
                        switch (txt.code) {
                            case "A00006":
                                //							window.windowDialog.alert($SYSMSG["A00006"], {funcOk: function(){
                                window.location.reload();
                                //							}, textOk:"确定", icon: "01"});
                                break;
                            default:
                                showError(txt.code);
                                break;
                        }
                    }).bind2(this),
                    onException: function(txt){
                    },
                    charset: "utf-8"
                };
            }
            else 
                if (this._type == "b") {
                    url = "http://icp.cws.api.sina.com.cn/friend/DelBlack.php?black_uid=" + this._uid;
                    option = {
                        onComplete: (function(txt){
                            switch (txt.code) {
                                case "A00006":
                                    //							window.windowDialog.alert($SYSMSG["A00006"], {funcOk: function(){
                                    window.location.reload();
                                    //							}, textOk:"确定", icon: "01"});
                                    break;
                                default:
                                    showError(txt.code);
                                    break;
                            }
                        }).bind2(this),
                        onException: function(txt){
                        },
                        charset: "utf-8"
                    };
                }
        
        Utils.Io.JsLoad.request(url, option);
        
        while ($E("isAddBlack")) {
            //删除加入黑名单checkbox
            Core.Dom.removeNode("isAddBlack");
        }
    },
    hidden: function(){
        this.dialog.hidden();
    }
};

/**
 * 页面中需要调用的函数
 * @param {Object} uid 需要删除的那个uid
 * @param {Object} type 在哪个页面中进行删除操作
 */
function $deleteVistorOrFirendOrBlack(uid, type, product, subid){
    $Debug(typeof arguments.length);
    if (arguments.length == 2) 
        var platdelview = new platDeleteView(uid, type);
    else 
        if (arguments.length == 3) {//各个产品
            var platdelview = new platDeleteView(uid, type, product);
        }
        else {//正文
            var platdelview = new platDeleteView(uid, type, product, subid);
        }
    platdelview.show();
    //window.delSomeBodyDialog = platdelview.dialog;
}
