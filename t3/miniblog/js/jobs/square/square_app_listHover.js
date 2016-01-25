/**
 * @author feng.dimu dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/hover.js");
$import("sina/core/array/foreach.js")
$registJob("initListHover",function(){
	
	var _con = $E('square_app_list');	
	var _mout = function(el){
		el.className = '';
	}

	var _mover = function(el){
		el.className = "cur";
	//	showBtn(el);
	}
	
//	function showBtn(el){
//		return;
//		if ( el._hasSetHover ) return;
//		el._hasSetHover = true;
//		el = el.getElementsByTagName('div')[0];
//		var list = el.getElementsByTagName('a');
//		if ( !list[1] ) return;
//		App.hover(el,function(el){
//			list[1].style.display = 'block'
//		},function(el){
//			list[1].style.display = 'none'
//		})			
//	}
	
	Core.Array.foreach(_con.getElementsByTagName('li'),function(v){
		App.hover(v,_mover,_mout);
	})
		
});
