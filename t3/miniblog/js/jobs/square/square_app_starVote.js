/**
 *@author feng.dimu dimu@staff.sina.com.cn
 *新浪APP投票
 */
$import("sina/sina.js")
$import("sina/app.js")
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/getEventTarget.js');
$import('sina/core/array/foreach.js');
$registJob('app_vote',function(){
	var addEvent = Core.Events.addEvent;
	var stopEvent = Core.Events.stopEvent;
	var each = Core.Array.foreach;
	var _con = $E('appstar_con')	
	if( !_con ) return;
	var _list = _con.getElementsByTagName('em');
	var _cl = [] , _starCount = 0;
	//鼠标进入开始
	function reSet(){
	each(_list,function(v,i){
			_cl[i] = v.className;
		})	
	}
	reSet();
	addEvent( _con, function(){
		var el = Core.Events.getEventTarget();
		if ( el.tagName != 'EM' ) return;
		var _c = 'gold_star';
		each(_list,function(v,i){
			v.className = _c;
			if( v === el ){
				_c = "white_star";
				}
		})
		stopEvent();
	}, 'mousemove')
	addEvent( _con, function(){
		each(_cl,function(v,i){
			_list[i].className = v;
		})
		stopEvent();
	}, 'mouseout')
	addEvent( _con, function(){
		//发送评分请求
		reSet();
		stopEvent();
			
	},'click');
});
