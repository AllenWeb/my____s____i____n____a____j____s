/**
 * @desc 设置我的应用
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("diy/hover.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("diy/dialog.js");

$registJob("initAppListHover", function(){
    var _con = $E('square_app_list');
	if( !_con ) return;
    var _mout = function(el){
        el.className = '';
    }
    var _mover = function(el){
        el.className = "focus";
    }
    
    Core.Array.foreach(_con.getElementsByTagName('li'), function(v){
        App.hover(v, _mover, _mout);
    })
});

(function(){
    var navigateTo = function(){
        var go = function(){
            window.location.reload();
        };
		setTimeout(go, 0);
//        var clock = setTimeout(go, 2000);
//        var alert = App.alert({
//            "code": "A00006"
//        }, {
//            ok: function(){
//                clearTimeout(clock);
//                setTimeout(go, 0);
//            }
//        });
        
    };
    
    function sendDel( appKey ){
    
        var fail = function(oJson){
			var code = oJson && oJson.code || '';
			var msg = $SYSMSG[ code ] || $CLTMSG['CF0117'];
			
            var _timer = null;
            var alert = App.alert(  msg , {
                ok: function(){
                    clearTimeout(_timer);
                }
            });
            _timer = setTimeout(function(){
                alert.close();
            }, 5000)
            
        };
        
        var succ = function(oJson){
            if (oJson && oJson.code == 'A00006') {
            	navigateTo();
            }
            else {
                fail(oJson);
            }
        };
//        setTimeout(function(){
//			succ({code:'A00006'});
//		},500)
//		
//		return ;
	
        Utils.Io.Ajax.request("/person/aj_apprevoke.php", {
            "POST": {
                "appkey": appKey
            },
            "onComplete": succ,
            "onException": fail,
            "returnType": "json"
        });
	
    }
    
    
    //解决APP搜全
    scope.unBindApp = function( appKey ){
        App.confirm($CLTMSG["CF0116"], {
            ok: function(){
				
            	sendDel( appKey );
            }
        })
    }
    
    
    
})();

