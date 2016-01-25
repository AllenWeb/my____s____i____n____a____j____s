/**
 * @author Chibin | chibin@staff.sina.com.cn
 * @随便看看的“查看更多”
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/addHTML.js");
$import("diy/dialog.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$registJob('casuallookmore', function(){
    try {
        var lastid = $E('lastid');
        if (lastid == null) {
            return;
        }
        var feedBox = $E('feedbox');
        var more = $E('feed_more');
        
        //在隐藏窗口提供lastid
        var sLast = $E('lastid').value;
        
        //成功回调，将ul添加到feedBox节点上
        var success = function(json){
            try {
                sLast = json['lastid'];
                //Core.Dom.addHTML(feedBox, json['html']);
                //				var divnode = document.createElement("DIV");
                //				divnode.innerHTML= json['html'];
                Core.Dom.insertHTML(more.parentNode, json['html'],"beforebegin");
                
                if (sLast == '0'||sLast == null) {
                    more.parentNode.style.display = 'none';
                }
                more.innerHTML = $CLTMSG['CC0401'];
                key = false;
            } 
            catch (exp) {
                console.log(exp)
            }
        };
        
        //错误处理
        var error = function(json){
            App.alert({
                'code': 'M14210'
            });
            key = false;
        };
   
        var key = false;
        
        //向后台发送
        var casualmoreFeed = function(){
            if (key) {
                return false;
            }
            key = true;
            more.innerHTML = $CLTMSG['CC0402'];
            Utils.Io.Ajax.request('/yunying/aj_news_more.php', {
                'GET': {
                    'mid': sLast,
                    'feedtype': scope['$feedtype'] || ''
                },
                'onComplete': function(json){
                    if (json.code == 'A00006') {
                        success(json.data);
                    }
                    else {
                        error(json);
                    }
                },
                'onException': function(){
                    error();
                },
                'returnType': 'json'
            });
            return false;
        };
        Core.Events.addEvent(more, casualmoreFeed, 'click');
    } 
    catch (exp) {
        console.log(exp)
    }
});
