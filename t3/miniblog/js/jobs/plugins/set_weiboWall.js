/**
 * @desc 微博墙设置页
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import("sina/core/dom/getElementsByClass.js");
$import("diy/scrollToTarget.js");
$import('sina/core/array/foreach.js');
$import("diy/copy.js");
$import("diy/dialog.js");


(function(){
    var _each = Core.Array.foreach;
    var _addEvent = Core.Events.addEvent;
    
    var conf = {
        uname: scope.$uname, //用户ID
        width: 350,      //宽
        height: 550,     //高
        skin: '1',      //模板
        isTitle: 1,      //是否显示title
        isWeibo: 1,      //是否显示微博
        isFans: 1,       //是否显示粉丝
        fansRow: 2       //显示粉丝行数
    };
    
    var prvAndRef = null;
    (function(){
		var template = '<iframe width="%width%" height="%height%" class="share_self"  frameborder="0" scrolling="no" src="http://service.t.sina.com.cn/widget/WeiboShow.php?%param%"></iframe>'
     //   var template = '<iframe style="width:%width%; height:%height%;" frameborder="0" scrolling="no" src="http://open.t.sina.com.cn/widget/WeiboShow.php?%param%"></iframe>'
        var lastStr = '';
        var _timer = null;
        
        function reload(){
            var temp = [];
            for (var v in conf) {
                temp.push(v + '=' + conf[v]);
            }
            var str = template.replace(/%param%/, temp.join('&'));
            //str = str.replace(/%width%/, conf['width'] + 'px');
            //str = str.replace(/%height%/, conf['height'] + 'px');
			str = str.replace(/%width%/, conf['width']);
            str = str.replace(/%height%/, conf['height']);
            
            if (lastStr == str) 
                return;
            lastStr = str;
            
            $E('input_copyhtml').value = str;
            $E('prev_view').innerHTML = str;
        };
        
        prvAndRef = function(){
            clearTimeout(_timer);
            setTimeout(function(){
                reload();
            }, 500)
        }
        
    })();
    
    (function(){
        var ck = {
            width: [350, 1024, 190],
            height: [550, 800, 75],
            fansRow: [2, 7, 1]
        }
		
		function check( type ){
            var patrn = /^[1-9]\d*$|^0$/;
            var info = ck[type];
            var el = $E('widget_' + type);
            var val = el.value;
            if (!patrn.test(val)) {
				el.value = info[0];
			} else if ((+val) > info[1]) {
				el.value = info[1];
			} else if ((+val) < info[2]) {
				el.value = info[2];
			} else {
				return true;
			}
			return false;		
        }
		
		checkInt = function( type ){
			var ckr = check( type );	
			$E( type=="fansRow" ? 'widget_fan_error' : 'widget_wh_error' ).className = (ckr ? 'normal' : 'warning');			
			return ckr;
		}
		
    })();
    
    
    
    $registJob('init_weiboWall_set', function(){
    	conf.uname = scope.$uname;
        //高宽和粉丝行数设置
        _each(['width', 'height', 'fansRow'], function(v, i){
            var key = 'widget_' + v;
            $E(key).value = conf[v];
            _addEvent($E(key), function(){
                checkInt(v);
                var val = $E(key).value;
                conf[v] = val;
                prvAndRef();
                //TODO 设置属性
            }, 'blur');
        });
        
        //外观方案
        (function(){
            var list = $E('template_skins').getElementsByTagName('a');
            var lastSkin = null;
            _each(list, function(v, i){
                if (i == 0) 
                    lastSkin = v.parentNode;
                _addEvent(v, function(){
                    lastSkin.className = '';
                    lastSkin = v.parentNode;
                    lastSkin.className = 'on';
                    conf['skin'] = i + 1;
                    Core.Events.stopEvent();
                    prvAndRef();
                }, 'click');
            });
            lastSkin.className = 'on';
            
        })();
        
        //模板设置
        _each(['isTitle', 'isWeibo', 'isFans'], function(v, i){
            var key = 'widget_' + v;
            $E(key).checked = true;
            _addEvent($E(key), function(){
				conf[v] = $E(key).checked ? 1 : 0;
                if( v == 'isFans' ){
                	$E('fan_con_1').style.display = conf[ v ] ? 'block' : 'none';
					$E('fan_con_2').style.display = conf[ v ] ? 'block' : 'none';
				//	if( conf[ v ] ) $E('widget_fansRow').value = '2';
                }				
				//conf[ 'fansRow' ] = 2;
                prvAndRef();			   
            }, 'click');
        });
        
        (function(){
            function succ(){
                var kt = App.alert($CLTMSG["CF0118"],{icon:3});
                var ktv = setTimeout(function(){
                    try {
                        kt && (kt.close());
                    } 
                    catch (e) {
                    }
                }, 2000);
                kt.onClose = function(){
                    clearTimeout(ktv);
                    ktv = null;
                };
            };
            
            //两个复制按钮
            _each(['copyhtml'], function(v, i){
                _addEvent($E('input_' + v), function(){
                    $E('input_' + v).select();
                }, 'click' )
                
                _addEvent($E(v), function(){
                    Core.Events.stopEvent();
                    if (App.copyText($E('input_' + v).value || "")) {
                        succ();
                    }
                    else {
                        App.alert($CLTMSG["CD0016"]);
                    };
                    
                                    }, 'click')
            });
            
            
            
            //TODO 设置预览区域
        
        })();
        
        //页面滚动 
        try {
            setTimeout(function(){
                App.scrollToTarget(Core.Dom.getElementsByClass(document.body, "div", "PY_tag")[0])
            }, 1000);
        } 
        catch (e) {
        }
        
        setTimeout(function(){
            prvAndRef();
        }, 0)
        
    })
    
})();



