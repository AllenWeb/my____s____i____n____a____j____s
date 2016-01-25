/**
 * @author chibin
 *
 * VIP他人首页锁定页面
 *
 */
$import('sina/core/events/fireEvent.js');
$registJob('lockscreen4addfollow', function(){
    if (scope.lockscreen != '1' && scope.lockscreen != '2' && scope.lockscreen!='3') 
        return false;
    if (scope.lockscreen == '1') {
        if (scope.huolibaobei === true) {
            var txt = $CLTMSG['CC4304'];
        }
        else {
            var txt = $CLTMSG['CC4301'].replace(/#sex#/, scope.sex).replace(/#realname#/, scope.realname)
        }
    }
    else if(scope.lockscreen =='2'){
		if (scope.$pageid == 'profile') {
			var txt = $CLTMSG['CC4305'].replace(/#realname#/, scope.realname).replace(/#link_name#/, scope.att_linkname).replace(/#att_names#/, (Core.Array.each(scope.att_names, function(str){
				return decodeURIComponent(str);
			})).join('、'))
		}else{
			var txt = $CLTMSG['CC4307'].replace(/#realname#/, scope.realname).replace(/#link_name#/, scope.att_linkname).replace(/#att_names#/, (Core.Array.each(scope.att_names, function(str){
				return decodeURIComponent(str);
			})).join('、'))
		}
    }else if(scope.lockscreen =='3'){
		var alt = App.alert($CLTMSG['CC4306'],{icon:3});
		setTimeout(function(){
			alt.close();
			return false;
		},3000)
		return false;
	}
    App.doRequest({
        oid: scope.$oid
    }, '/attention/aj_lateatt.php', function(){
        var dlog = App.confirm(txt, {
            ok: function(){
                dlog.close();
				try {
					Core.Events.fireEvent($E('add_atn'), 'click')
				}catch(e){}
				if(scope.lockscreen =='2'){
					App.doRequest({uid:scope.suids.join(','),fromuid:scope.$uid},'/attention/aj_addfollow.php')
				}
            },
            ok_label: $CLTMSG['CC4302'],
            cancel_label: $CLTMSG['CC4303'],
            icon: 4
        });
    }, function(){
    });
});
