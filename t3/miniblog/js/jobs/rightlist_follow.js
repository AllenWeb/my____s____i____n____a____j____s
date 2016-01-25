/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("jobs/base.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("jobs/miniblog_follow.js");
$import("diy/jsontoquery.js");
App.rightSideFollow = function(uid, el, callback, conf){
    var url = "/attention/aj_addfollow.php";
    if (conf) {
        url += ('?' + App.jsonToQuery(conf));
    }
    function cb(){
        var newDom = document.createElement("SPAN");
        newDom.innerHTML = $CLTMSG['CC2510'];
        Core.Dom.insertAfter(newDom, el);
        Core.Dom.removeNode(el);
        if (typeof(callback) == "function") {
            callback();
        }
    }
    App.followOperation({
        uid: uid,
        fromuid: scope.$uid
    }, url, cb);
};
(function(){
    var cb = function(uid, el){
        var delEle = el;
        if (delEle.tagName !== "DL") {
            delEle = el.parentNode.parentNode.parentNode;
        }
        App.replaceByAnewUser(delEle);
    };
    
    App.rightSuggestFollow = function(uid, el, conf){
        var dl = el.parentNode.parentNode.parentNode;
        var retFun = function(){
            setTimeout(function(){
                cb(uid, dl);
            }, 1000);
        }
        App.rightSideFollow(uid, el, retFun, conf);
        
    };
    
    App.card_follow = function(uid){
        //find el
        var _di = $E('interest_person');
        var _dl = _di.getElementsByTagName('dl');
        for (var i = 0; i < _dl.length; i++) {
            if (_dl[i].getAttribute('uid') == uid) {
                var el = _dl[i];
                break;
            }
        }
        if (el) {
            cb(uid, el);
        }
    };
})();

