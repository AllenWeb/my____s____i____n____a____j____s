/**
 * @ haidong | haidong@staff.sina.com.cn
 * @ 用户引导第二步
 */

$import("jobs/base.js");
$import("sina/core/function/bind2.js");

$registJob("guide2",function(){
	var selectAll = $E("selectAll");
	var followbtn = $E("followbtn");
	var followwrap= $E("followwrap");
	(function(){
		var els = followwrap.getElementsByTagName("input");
		for(var i=0,len = els.length;i<len;i++){
			var el = els[i];
			Core.Events.addEvent(el,(function(){							
				if(!this.checked){
					selectAll.checked = false;
				}else{
					var index = 0;
					for(var j=0,jlen = els.length;j<jlen;j++){
						var jel = els[j];
						if(!jel.checked){
							break;
						}else{
							index ++;
						}
					}
					if(index == els.length){
						selectAll.checked = true;
					}
				}
			}).bind2(el),"click");
		}
	})();
	
	//提交
	Core.Events.addEvent(followbtn,function(){
		var els = followwrap.getElementsByTagName("input");
		var index = 0;
		for(var i=0,len = els.length;i<len;i++){
			var el = els[i];
			if(el.checked){
				$E("open2rd").submit();
				return false;
			}
		}
		location.href = "/open/guide3.php";
		return false;
	},"click");
	
	Core.Events.addEvent(selectAll,function(){
		var checked = selectAll.checked;		
		var els = followwrap.getElementsByTagName("input");
		for(var i=0,len = els.length;i<len;i++){
			var el = els[i];
			el.checked = checked;
		}
	},"click");
});
