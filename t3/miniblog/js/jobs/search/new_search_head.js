/**
 * @author dmfeng
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/string/trim.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");

(function(){
	var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
	var _each = Core.Array.foreach;
	var url = "/search/user.php";
	var h_mod =  false;  //是否是高级搜索
	$registJob('init_head_search',function(){
		//var maxlen = 60;
		var sEl = $E("user_search_input");		
		//initDefValue(sEl , 'CF0108');
		//Utils.Sinput.limitMaxLen( sEl, maxlen );				
		_addEvent($E('user_search_btn'), function(){
            Core.Events.stopEvent();
            setTimeout(function(){
				search_send();
			},0)
        }, 'click');
		if (scope.$pageid != 'miniblog_invite') {
			initInputLen();
			if( getValue( 'user_search_input' , 'CF0108') == '' ) reSetBox( true )
		}
		App.enterSubmit({
            parent: sEl.parentNode,
            action: function(){
                Core.Events.fireEvent($E('user_search_btn'), 'click');
            }
        });
		
	});
	
	var defSearch = {
		nickname:'1',
		realname:'1',
		domain:'1', //域名
		desc:'1',//简介
		isauth:'1'//认证
	}
	
	//根据输入的内容设置搜索
	function initInputLen(){
		//var _last = ''
		var _timer = null;
		_addEvent( $E( 'user_search_input' ),function(){
			clearTimeout(_timer);
			_timer = setTimeout(function(){
				reSetBox( getValue( 'user_search_input' , 'CF0108') == '' )
			},50)
		},'keyup')
	}
	//重设置搜索范围	
	function reSetBox( sel ){
		param = sel ? {} : defSearch;
		_each(['nickname', 'realname', 'domain', 'desc','isauth'], function(v, i){
			$E(v).disabled = sel ; 
			//$E(v).checked = (param[v] == 1 ? true : false);
		})
	}
		
	//开启高级搜索
    $registJob('init_more_search', function(){
        if (!$E('changeSearchMod'))  return;		
		_each(['nickname', 'realname', 'domain', 'desc','isauth'], function(v, i){
			defSearch[v] = $E( v ).checked ? '1' : '0';
			_addEvent( $E( v ),function(){
				defSearch[v] = $E(v).checked ? '1' : '0';
			},'click')
		})
		
		
        var mbtn = $E('changeSearchMod');
        function showModDialog( bh ){
			//显示和隐藏高级搜索         
            $E('highSearchCon').style.display = bh ? '' : 'none';
            var imgel = $E('user_search_btn').getElementsByTagName('img')[0];
            imgel.src = imgel.src.replace(/jh_ffbtn\d/, bh ? 'jh_ffbtn2' : 'jh_ffbtn1')
            $E('isopen').className = bh ? 'jh_search jh_schAdvance left_search' : 'jh_search left_search';
            mbtn.innerHTML = $CLTMSG[bh ? 'CF0115' : 'CF0113'];
			h_mod  = bh;		
        }		
	    _addEvent(mbtn, function(){
			Core.Events.stopEvent();
			showModDialog( !h_mod);
		}, 'click');
		if ($E('changeSearchMod1')) {		
			_addEvent($E('changeSearchMod1'),function(){
				if( h_mod ) return;
				Core.Events.stopEvent();
				showModDialog( true );
			}, 'click');
		}

		showModDialog( /#showsearch/.test( location.href ) );
		//初始化城市选择器		
		new App.ProvinceAndCity( $E('province'), $E('city'),$E( 'province' ).getAttribute('truevalue') , $E( 'city' ).getAttribute('truevalue'));
		var urls = ['/person/relateschool.php','/person/relatecompany.php','/person/aj_tagchooser.php'];
		
		//三个联想输入框
		_each(['s_school','s_work','s_tag'],function(v,i){
			var dom = $E( v );
		   	App.autoComplate({
				'input'	: dom,
				'ok'	: function(value,text){
					dom.value = text;
				},
				'light'	: function(el){
					el.className = 'bg';
				},
				'dark'	: function(el){
					el.className = '';
				},
				'timer'	: 2,
				'style'	: 'width:220px;position:absolute;z-index:200',
				'class'	: 'co_sl_2',
				'type'	: 'ajax',
				'data'	: urls[i]
			});
		})
		//绑热门TAG
		_each($E('hotTagLink').getElementsByTagName('a'),function(v,i){
			/*_addEvent( v , function(){
	            Core.Events.stopEvent();
				$E('s_tag').value = v.innerHTML;
	            setTimeout(function(){
					h_mod = true;
					search_send();
				},0)
        	}, 'click');*/
		})
		
	});
	
	//读取参数跳转页面
	function search_send(){
		var param = {};
		param['search'] = getValue('user_search_input' , 'CF0108') || '';
		param['search'] = encodeURIComponent( _trim( param['search'] ));
		
		if (scope.$pageid != 'miniblog_invite') {
			try {
				_each(['nickname', 'realname', 'domain', 'desc','isauth'], function(v, i){
					param[v] = $E(v).checked  ? 1 : 0;
				})				
			}catch(e){}
		}
		//如果是高级搜索
		if( h_mod ){
			param['gender'] = getRadio('gender');
			_each(['province','city'],function(v,i){			
				param[ v ] = $E( v ).value || $E( v ).getAttribute('truevalue') || '0';
			});
			param['s_school'] = getValue('s_school' , 'CF0110') || '';
			param['s_work'] = getValue('s_work' , 'CF0111')  || '' ;
			param['s_tag'] = getValue('s_tag' , 'CF0112')  || '';
			_each(['s_school','s_work','s_tag'],function(v,i){							
			param[ v ] = encodeURIComponent( _trim( param[v] || ''))
			});			
		}
		App.searchbycondition( url , param );
	}
	//取单选按钮组的值
	function getRadio(name){
		var list = document.getElementsByName(name);
		for(var i=0 ,el = null ; el=list[i] ; i++){
			if( el.checked ) return el.value;
		}
		return 0;
	}
	
	//设置输入框的默认值
	function initDefValue( id , key ){
		var value = $CLTMSG[ key ] || '';
		if ( !$E( id ).value ) $E( id ).value = value;
		_addEvent( $E( id ) ,function(){
				if ( $E( id ).value == value ){
				if ( key == 'CF0108' ) 
					if( scope.$pageid == 'user_search' && (getValue( 'user_search_input' , 'CF0108') == '') ){
						reSetBox( true );
					} 
					 $E( id ).value = ''
				 }
			},"focus");
		_addEvent( $E( id ) ,function(){
				if ( $E( id ).value == '' ) $E( id ).value = value;
			},"blur");
	};
	//取值,处理默认值
	function getValue( el , key){
		var val = _trim( $E( el ).value || '' )
		return val == $CLTMSG[key] ? '' :  val ;
	}
	
	//发送搜索请求跳转
	App.searchbycondition = function(url, params ,bh){
		for(var k in params){
			if(!params[k]){
				delete params[k];
			}
		}
        var t = ['keytime=' + new Date().valueOf()];
        for (var key in params) {
            t.push(key + '=' + params[key]);
        }
        var str = t.join('&');
        if (str) 
            url += (url.indexOf('?') == -1 ? '?' : '&');
		url = url + str;
		if( h_mod || bh ) url += '#showsearch'
		setTimeout(function(){
			location.href =  url ;
		},0)		
        return false;
    };
	
	
})();