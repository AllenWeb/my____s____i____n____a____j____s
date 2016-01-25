/**
 * @fileoverview 微博新推广页
 * @author yuwei@staff.sina.com.cn
 */
$import('sina/core/events/addEvent.js');
$import("diy/marquee.js");
$import("sina/core/array/findit.js");

//微博向上缓动显示
$registJob("marquee",function(){
	var marqueeBox = $E("txtBoxCon").parentNode;
	var divs = marqueeBox.getElementsByTagName("div");
	var items = [];
	for(var i = 0, len = divs.length;i < len; i += 1){
		if(divs[i].className === "list"){
			items.push(divs[i]);
		}
	}
	var doMarquee = new App.marquee(marqueeBox,items,{forward:"up",speed:1});
	Core.Events.addEvent(marqueeBox,function(){doMarquee.pause()},'mouseover');
	Core.Events.addEvent(marqueeBox,function(){doMarquee.restart()},'mouseout');
	doMarquee.start();
});

//输入用户名字时提示邮箱
$registJob("loginMailTips",function(){
	passcardOBJ.init(document.getElementById("loginname"),
	{
		overfcolor: "#999",
		overbgcolor: "#e8f4fc",
		outfcolor: "#000000",
		outbgcolor: ""
	},document.getElementById("password"),parent);
});

//高亮显示鼠标停留的博主图片
$registJob("highLightLi",function(){
	var imgs = $E("imgList").getElementsByTagName("img");
	//随机取5个图片不重复的显示
	var randomIMGs = [];
	while(randomIMGs.length < 5 ){
		var randomIndex = Math.floor(Math.random() * imgs.length);
		if(Core.Array.findit(randomIMGs,imgs[randomIndex])===-1){
			randomIMGs.push(imgs[randomIndex]);
		}
	}
	var len = randomIMGs.length;
	for(var i = 0;i < len;i++){
		randomIMGs[i].parentNode.parentNode.style.display = "list-item"; 
		Core.Events.addEvent(randomIMGs[i],function(e){
			e = e || window.event;
			var el = e.target||e.srcElement;
			el.parentNode.parentNode.className = "on";
			el.parentNode.nextSibling.className = "pbg2";
		},'mouseover');// mouseenter
		Core.Events.addEvent(randomIMGs[i],function(e){
			e = e || window.event;
			var el = e.target||e.srcElement;
			el.parentNode.parentNode.className = "";
			el.parentNode.nextSibling.className = "pbg";
		},'mouseout');
		
		var a = randomIMGs[i].parentNode.nextSibling.firstChild;
		Core.Events.addEvent(a,function(e){
			e = e || window.event;
			var el = e.target||e.srcElement;
			el.parentNode.parentNode.className = "on";
			el.parentNode.className = "pbg2";
		},'mouseover');// mouseenter
		Core.Events.addEvent(a,function(e){
			e = e || window.event;
			var el = e.target||e.srcElement;
			el.parentNode.parentNode.className = "";
			el.parentNode.className = "pbg";
		},'mouseout');
	}
});
