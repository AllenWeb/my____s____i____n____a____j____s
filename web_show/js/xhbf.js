//控制循环播放的对象

function $(id){
	return document.getElementById(id);
}

window.addEvent=function m(){
	$("xunHuan").onclick = function(){
		$("contentDiv").style.display = "none";
		$("huandengpianbofang").style.display = "block";
		flag1 = 0;
		turn_pic();
	}
	/*
	$("fullScreen").onclick = function(){
		$("total").style.display = "none";
		document.body.style.backgroundColor = "black";
		$("fullScreen").value = "正常模式";
		$("huandengpianbofang").style.display = "block";
		flag1 = 0;
		turn_pic();
	}
	*/
	$("stop").onclick = function(){
		stop_hdp();
	}
	$("continue").onclick = function(){
		flag1--;
		turn_pic();
	}
	$("turn_back").onclick = function(){
		stop_hdp();
		$("huandengpianbofang").style.display = "none";
		selectTopic('topic2','content2');
		$("contentDiv").style.display = "block";

	}
	$("view").onmousemove = function(event){
		var browse = window.navigator.appName.toLowerCase();
		
		event = window.event?window.event:event;
		var left;
		var top;

		if(browse.indexOf("microsoft") > -1){
				left = parseInt(event.offsetX);
				top = parseInt(event.offsetY);
			}else{
				left = parseInt(event.layerX);
				top = parseInt(event.layerY);
			}
		
		if(left>50&&left<200){
			$("back").style.visibility = "visible";
			//$("back").style.margin-left = left;
			//$("back").style.margin-top = top;
		}else{
			//$("back").style.visibility = "hidden";
		}
	}
}
var pic_array = new Array('images/pic_1.jpg','images/pic_2.jpg','images/pic_3.jpg','images/pic_4.jpg','images/pic_5.jpg','images/pic_6.jpg');
	
var t;
var flag1=0;
//幻灯片切换
function turn_pic(){
	flag1++;
	$("view").src = pic_array[flag1-1];
	if(flag1==6){
		flag1 = 0;
	}
	t=setTimeout("turn_pic()",3000);

}

//幻灯片停止
function stop_hdp(){
	clearTimeout(t);
}