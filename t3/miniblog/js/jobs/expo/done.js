/**
 * @author chibin
 *
 * 终于到最后一步了！！！
 */
$import("sina/utils/template.js");
$import("diy/htmltojson.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/trim.js");
$import('diy/publisher.js');
$registJob('done', function(){
    var element = {
        editor: $E('publish_editor'), //发布框
        limit: $E('publisher_info'), //140个字限制
        publish: $E('publisher_submit') //发布按钮
    }
    
    var tmp = new Utils.Template($CLTMSG['CC3601']);
    element['emptyStr'] = tmp.evaluate({
        job: decodeURIComponent(scope.$job) || scope.$job
    });
    
    
    var pub = App.miniblogPublisher({
        'editor': element['editor'],
        'submit': element['publish'],
        'info': element['limit']
    }, {
        'onDisable': function(){
            element['publish'].className = 'btn_notclick';
        },
        'onEnable': function(){
            element['publish'].className = 'btn_normal';
        },
        'onLimit': function(len){
            if (len >= 0 && len <= 140) {
                element['limit'].innerHTML = $CLTMSG['CD0071'].replace(/#\{cls\}/, "pipsLim").replace(/#\{len\}/, 140 - len);
            }
            else {
                element['limit'].innerHTML = $CLTMSG['CD0072'].replace(/#\{cls\}/, "pipsLim").replace(/#\{style\}/, "").replace(/#\{len\}/, (140 - len) * (-1));
            }
        },
        'onSuccess': function(json, params){
		    $E('okbox').style.display='';
			setTimeout(function(){
				window.location.href = 'http://t.sina.com.cn/' + scope.$uid;
			},1500)
        },
        'onError': function(){
		  element['publish'].className = 'btn_normal';
        },
        'limitNum': 140,
        'emptyStr': element['emptyStr']
        //'styleId': scope.styleid
    });
    element['editor'].value = element['emptyStr'];
	pub.limit();
    return false;
    
});
