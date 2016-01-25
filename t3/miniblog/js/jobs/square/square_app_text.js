/**
 *@author feng.dimu dimu@staff.sina.com.cn
 *应用广场应用详细页的应用介绍展开和收起
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');

$registJob('showmoretext',function(){
	
      
	
		var _con = $E('appinfocon');
		if ( !_con ) return;
		var _str = _con.innerHTML;
		_con.style.display = '';	
		
		var str = cutstr(_str,280);
		//var str = Core.String.shorten(_str,280);
		if( str == _str ) return;	
		var _btn = $C('a');
		_btn.className = 'more';
		_btn.setAttribute('href','#nogo');
		
        function cutstr(str, len){
            if (!str || !len) {
                return "";
            }
            
            var a = 0, i = 0, _b = '';
            for (i = 0; i < str.length; i++) {
                str.charCodeAt(i) > 255 ? a += 2 : a++;
                if (a > len) {
                    return _b;
                }
                _b += str.charAt(i);
            }
            return str;
        }
		
		
		function showHide(){
			document.body.appendChild(_btn);
			if( _btn.innerHTML != '[展开]' ){
				_btn.innerHTML = '[展开]';
				_con.innerHTML = str;
			}else{
				_btn.innerHTML = '[收起]';
				_con.innerHTML = _str;

			}
			_con.appendChild(_btn);

		}
		Core.Events.addEvent(_btn,showHide,'click');
		showHide();
		
		});

