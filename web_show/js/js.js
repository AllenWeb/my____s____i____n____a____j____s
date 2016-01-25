
<!-- 皮肤选择器 -->
var chooseTopic1="topic1";
var chooseTopic="topic1";
var chooseContent1="content1";
var chooseContent="content1";

var choosePage1="page1";
var choosePage="page1";

var titleBg1="images/nav.gif";
var titleBg="images/title_bg_1.gif";
var bottonColor="#0F5C9B";
function selectBg(css,color,bg){
	var folder="css/";
	document.getElementById("choose").href=folder+css;
	titleBg=bg;
	bottonColor=color;
	document.getElementById(chooseTopic).style.background="url("+titleBg+") no-repeat";
	document.getElementById(choosePage).style.background=bottonColor;
	
}

function selectTopic(obj,id){
	document.getElementById(chooseTopic1).style.background="url("+titleBg1+") no-repeat";
	chooseTopic=obj;	
	document.getElementById(chooseTopic).style.background="url("+titleBg+") no-repeat";
	chooseTopic1=obj;
	document.getElementById(chooseContent1).style.display="none";
	chooseContent=id;
	document.getElementById(chooseContent).style.display="block";
	chooseContent1=id;
}


function selectPage(obj){
	choosePage=obj;
	document.getElementById(choosePage1).style.background="#FFF";
	document.getElementById(choosePage1).style.color=bottonColor;
	document.getElementById(choosePage1).style.borderColor=bottonColor;
	document.getElementById(choosePage).style.background=bottonColor;
	document.getElementById(choosePage).style.color="#FFF";
	choosePage1=obj;
}


<!-- 初始化 -->
var backg1=null;
var backg2=null;
var backg3=null;
var backg4=null;
var topic1=null;
var topic2=null;
var topic3=null;
var topic4=null;

var pageSize=20;
var maxPageLength=null;
var currentPage = 1;
var foot1=null;
var foot2=null;
var lastPage=null;
var nextPage=null;
function demo(){	
	document.getElementById("topic1").style.background="url("+titleBg+")";
	document.getElementById("content1").style.display='block';

	backg1 = document.getElementById("backg1");
	backg1.onclick = function(){
		selectBg('style1.css','#0F5C9B','images/title_bg_1.gif');
	}
	backg2 = document.getElementById("backg2");
	backg2.onclick = function(){
		selectBg('style2.css','#FDA229','images/title_bg_2.jpg');
	}
	backg3 = document.getElementById("backg3");
	backg3.onclick = function(){
		selectBg('style3.css','#060','images/title_bg_3.jpg');
	}
	backg4 = document.getElementById("backg4");
	backg4.onclick = function(){
		selectBg('style4.css','#E5D9BA','images/title_bg_4.jpg');
	}
	topic1 = document.getElementById("topic1");
	topic1.onclick = function(){
		selectTopic(this.id,'content1');
	}
	topic2 = document.getElementById("topic2");
	topic2.onclick = function(){
		selectTopic(this.id,'content2');
	}
	topic3 = document.getElementById("topic3");
	topic3.onclick = function(){
		selectTopic(this.id,'content3');
	}
	topic4 = document.getElementById("topic4");
	topic4.onclick = function(){
		selectTopic(this.id,'content4');
	}

	sendXMLHttpReq(1);
	//alert("");
	var total_arr=new Array();
	total_arr = mess_box();
	var temp = total_arr[0];
	alert(temp);
	maxPageLength=getPageLength(temp);
	alert(maxPageLength)
	document.getElementById("last").value=maxPageLength;
	var jiyu = document.getElementById("jiyu");
	displayPageOnDiv(jiyu,total_arr,1);
	
	var foot_middle = document.getElementById("foot_middle");
	for(var i=1;i<=maxPageLength;i++){		
		var inputButton = document.createElement("input");
		inputButton.type = "button";
		inputButton.id = ("page"+i);
		inputButton.value = i;
		foot_middle.appendChild(inputButton);
		inputButton.onclick = function(){
			selectPage(this.id);
			sendXMLHttpReq(this.value);
			//alert("");
			var page_arr = mess_box();
			var jiyu = document.getElementById("jiyu");
			displayPageOnDiv(jiyu,page_arr,this.value);
			currentPage = parseInt(this.value);
			dispayPageSizeItem(currentPage,maxPageLength);
		}
	}
	
	init_dispayPartOfPageSize(1);
	foot1 = document.getElementById("foot1");
	foot2 = document.getElementById("foot2");
	lastPage = document.getElementById("lastPage");
	nextPage = document.getElementById("nextPage");
	unDisplaySpan(lastPage);
	unDisplaySpan(foot1);
	displitPage(maxPageLength);
	
}
/*************************************************************/

function displaySpan(spanName){
	spanName.style.display = "inline";
}
function unDisplaySpan(spanName){
	spanName.style.display = "none";
}
function dispayPageSizeItem(pageNo,maxLength){
	displaySpan(foot1);
	displaySpan(foot2);
	displaySpan(lastPage);
	displaySpan(nextPage);
	if(pageNo <= 6){
		if(pageNo == 1){
			unDisplaySpan(lastPage);
		}else{
			init_dispayPartOfPageSize(1);
		}
		unDisplaySpan(foot1);
	}else if(pageNo >= maxLength-4){
		if(pageNo == maxLength){
			unDisplaySpan(nextPage);
		}else{
			init_dispayPartOfPageSize(maxLength-9);
		}
		unDisplaySpan(foot2);
	}else{
		dispayPartOfPageSize(pageNo);
	}
}
function init_dispayPartOfPageSize(start){

	var foot_middle = document.getElementById("foot_middle");
	var foot_middle_input_arr = foot_middle.getElementsByTagName("input");
	for(var i=0;i<foot_middle_input_arr.length;i++){
		unDisplaySpan(foot_middle_input_arr[i]);
	}
	for(var i=start-1;i<start+9;i++){
		displaySpan(foot_middle_input_arr[i]);
	}
}
function dispayPartOfPageSize(pageNo){
	var foot_middle = document.getElementById("foot_middle");
	var foot_middle_input_arr = foot_middle.getElementsByTagName("input");
	for(var i=0;i<foot_middle_input_arr.length;i++){
		unDisplaySpan(foot_middle_input_arr[i]);
	}
	for(var i=pageNo-6;(i<= pageNo+3) && i<foot_middle_input_arr.length;i++){
		displaySpan(foot_middle_input_arr[i]);
	}
}

function displitPage(maxLength){
	
	var lastPage = document.getElementById("lastPage");
	lastPage.onclick = function(){
		if(currentPage<=1){
			currentPage=1;
		}else{
			currentPage--;
		}
		selectPage("page"+currentPage);
		sendXMLHttpReq(currentPage);
		alert("");
		var page_arr = mess_box();
		var jiyu = document.getElementById("jiyu");
		displayPageOnDiv(jiyu,page_arr,currentPage);
		dispayPageSizeItem(currentPage,maxLength);
	}
	var nextPage = document.getElementById("nextPage");
	nextPage.onclick = function(){
		if(currentPage>=maxLength){
			currentPage=maxLength;
		}else{
			currentPage++;
		}
		selectPage("page"+currentPage);
		sendXMLHttpReq(currentPage);
		alert("");
		var page_arr = mess_box();
		var jiyu = document.getElementById("jiyu");
		displayPageOnDiv(jiyu,page_arr,currentPage);
		dispayPageSizeItem(currentPage,maxLength);
	}
	var first = document.getElementById("first");
	first.onclick = function(){
		currentPage = 1;
		selectPage("page"+currentPage);
		sendXMLHttpReq(currentPage);
		alert("");
		var page_arr = mess_box();
		var jiyu = document.getElementById("jiyu");
		displayPageOnDiv(jiyu,page_arr,currentPage);
		dispayPageSizeItem(currentPage,maxLength);
		init_dispayPartOfPageSize(1);
	}
	var last = document.getElementById("last");
	last.onclick = function(){
		currentPage = parseInt(this.value);
		selectPage("page"+currentPage);
		sendXMLHttpReq(currentPage);
		alert("");
		var page_arr = mess_box();
		var jiyu = document.getElementById("jiyu");
		displayPageOnDiv(jiyu,page_arr,currentPage);
		dispayPageSizeItem(currentPage,maxLength);
		init_dispayPartOfPageSize(currentPage-9);
	}
}
function getPageLength(total){
	if(total%pageSize==0){
		return parseInt(total/pageSize);
	}else{
		return 1+parseInt(total/pageSize);
	}
}

function displayPageOnDiv(ele,arr,value){

	ele.innerHTML="";
	var length = arr.length-2;
	var time = parseInt(length/4);
    for(var j=1;j<=time;j++){
		var text1="楼"+((parseInt(value)-1)*20+j)+" ";
		var text2="";
		for(var i=1;i<=4;i++){
			if(i%4 !=0){
				text1 += arr[(j-1)*4+i]+" ";
			}else{
				text2 = arr[(j-1)*4+i];
			}
		}
		var contextDiv1 = document.createElement("div");
		contextDiv1.className = "contextDiv1";
		var contextDiv2 = document.createElement("div");
		contextDiv2.className = "contextDiv2";
		contextDiv1.innerHTML = text1;
		contextDiv2.innerHTML = text2;
		ele.appendChild(contextDiv1);
		ele.appendChild(contextDiv2);
	}
}

<!--三级菜单-->

function showyear(s){
		var m=document.getElementById(s).style.display;
		if(m=='inline'){
			document.getElementById("menu").style.background="url(images/nolines_plus.gif) no-repeat";
			document.getElementById(s).style.display='none';
			
		}
		else{
			document.getElementById("menu").style.background="url(images/nolines_minus.gif) no-repeat";
			document.getElementById(s).style.display='inline';	
			
			}
}
function showmonth(s){	
	    var m=document.getElementById(s).style.display;
		var x='y'+s.substring(4);
		//alert(x);
		if(m=='inline'){
			document.getElementById("year"+s.substring(4)).style.background="url(images/nolines_plus.gif) no-repeat";
			document.getElementById(s).style.display='none';
			}
		else{
			document.getElementById("year"+s.substring(4)).style.background="url(images/nolines_minus.gif) no-repeat";
			document.getElementById(s).style.display='inline';
		}
		
}
function monthclick(){
		document.getElementById("month").color="red";
		
}



//控制循环播放的对象
/**************************************幻灯片播放************************************/
function $(id){
	return document.getElementById(id);
}

function addEvent(){
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



//**************************成员介绍*************************************************/

var xm;
var ym;
/* ==== onmousemove event ==== */
document.onmousemove = function(e){
	if(window.event) e=window.event;
	xm = (e.x || e.clientX);
	ym = (e.y || e.clientY);
}

/* ==== window resize ==== */
function resize() {
	if(diapo)diapo.resize();
}
onresize = resize;

/* ==== opacity ==== */
setOpacity = function(o, alpha){
	if(o.filters)o.filters.alpha.opacity = alpha * 100; else o.style.opacity = alpha;
}


////////////////////////////////////////////////////////////////////////////////////////////
/* ===== encapsulate script ==== */
diapo = {
	O : [],
	DC : 0,
	img : 0,
	txt : 0,
	N : 0,
	xm : 0,
	ym : 0,
	nx : 0,
	ny : 0,
	nw : 0,
	nh : 0,
	rs : 0,
	rsB : 0,
	zo : 0,
	tx_pos : 0,
	tx_var : 0,
	tx_target : 0,

	/////// script parameters ////////
	attraction : 2,
	acceleration : .9,
	dampening : .1,
	zoomOver : 2,
	zoomClick : 4,
	transparency : .8,
	font_size: 18,
	//////////////////////////////////

	/* ==== diapo resize ==== */
	resize : function(){
		with(this){
			nx = DC.offsetLeft;
			ny = DC.offsetTop;
			nw = DC.offsetWidth;
			nh = DC.offsetHeight;
			//document.getElementById("txt").style.fontSize = Math.round(nh / font_size) + "px";
			if(Math.abs(rs-rsB)<100) for(var i=0; i<N; i++) O[i].resize();
			rsB = rs;
		}
	},

	/* ==== create diapo ==== */
	CDiapo : function(o){
		/* ==== init variables ==== */
		this.o        = o;
		this.x_pos    = this.y_pos    = 0;
		this.x_origin = this.y_origin = 0;
		this.x_var    = this.y_var    = 0;
		this.x_target = this.y_target = 0;
		this.w_pos    = this.h_pos    = 0;
		this.w_origin = this.h_origin = 0;
		this.w_var    = this.h_var    = 0;
		this.w_target = this.h_target = 0;
		this.over     = false;
		this.click    = false;

		/* ==== create shadow ==== */
		this.spa = document.createElement("span");
		this.spa.className = "spaDC";
		diapo.DC.appendChild(this.spa);

		/* ==== create thumbnail image ==== */
		this.img = document.createElement("img");
		this.img.className = "imgDC";
		this.img.src = o.src;
		this.img.O = this;
		diapo.DC.appendChild(this.img);
		setOpacity(this.img, diapo.transparency);

		/* ==== mouse events ==== */
		this.img.onselectstart = new Function("return false;");
		this.img.ondrag = new Function("return false;");
		this.img.onmouseover = function(){
			diapo.tx_target=0;
			diapo.txt.innerHTML=this.O.o.alt;
			this.O.over=true;
			setOpacity(this,this.O.click?diapo.transparency:1);
		}
		this.img.onmouseout = function(){
			diapo.tx_target=-diapo.nw;
			this.O.over=false;
			setOpacity(this,diapo.transparency);
		}
		this.img.onclick = function() {
			if(!this.O.click){
				if(diapo.zo && diapo.zo != this) diapo.zo.onclick();
				this.O.click = true;
				this.O.x_origin = (diapo.nw - (this.O.w_origin * diapo.zoomClick)) / 2;
				this.O.y_origin = (diapo.nh - (this.O.h_origin * diapo.zoomClick)) / 2;
				diapo.zo = this;
				setOpacity(this,diapo.transparency);
			} else {
				this.O.click = false;
				this.O.over = false;
				this.O.resize();
				diapo.zo = 0;
			}
		}

		/* ==== rearrange thumbnails based on "imgsrc" images position ==== */
		this.resize = function (){
			with (this) {
				x_origin = o.offsetLeft;
				y_origin = o.offsetTop;
				w_origin = o.offsetWidth;
				h_origin = o.offsetHeight;
			}
		}

		/* ==== animation function ==== */
		this.position = function (){
			with (this) {
				/* ==== set target position ==== */
				w_target = w_origin;
				h_target = h_origin;
				if(over){
					/* ==== mouse over ==== */
					w_target = w_origin * diapo.zoomOver;
					h_target = h_origin * diapo.zoomOver;
					x_target = diapo.xm - w_pos / 2 - (diapo.xm - (x_origin + w_pos / 2)) / (diapo.attraction*(click?10:1));
					y_target = diapo.ym - h_pos / 2 - (diapo.ym - (y_origin + h_pos / 2)) / (diapo.attraction*(click?10:1));
				} else {
					/* ==== mouse out ==== */
					x_target = x_origin;
					y_target = y_origin;
				}
				if(click){
					/* ==== clicked ==== */
					w_target = w_origin * diapo.zoomClick;
					h_target = h_origin * diapo.zoomClick;
				}

				/* ==== magic spring equations ==== */
				x_pos += x_var = x_var * diapo.acceleration + (x_target - x_pos) * diapo.dampening;
				y_pos += y_var = y_var * diapo.acceleration + (y_target - y_pos) * diapo.dampening;
				w_pos += w_var = w_var * (diapo.acceleration * .5) + (w_target - w_pos) * (diapo.dampening * .5);
				h_pos += h_var = h_var * (diapo.acceleration * .5) + (h_target - h_pos) * (diapo.dampening * .5);
				diapo.rs += (Math.abs(x_var) + Math.abs(y_var));

				/* ==== html animation ==== */
				with(img.style){
					left   = Math.round(x_pos) + "px";
					top    = Math.round(y_pos) + "px";
					width  = Math.round(Math.max(0, w_pos)) + "px";
					height = Math.round(Math.max(0, h_pos)) + "px";
					zIndex = Math.round(w_pos);
				}
				with(spa.style){
					left   = Math.round(x_pos + w_pos * .1) + "px";
					top    = Math.round(y_pos + h_pos * .1) + "px";
					width  = Math.round(Math.max(0, w_pos * 1.1)) + "px";
					height = Math.round(Math.max(0, h_pos * 1.1)) + "px";
					zIndex = Math.round(w_pos);
				}
			}
		}
	},

	/* ==== main loop ==== */
	run : function(){
		diapo.xm = xm - diapo.nx;
		diapo.ym = ym - diapo.ny;
		/* ==== caption anim ==== */
		diapo.tx_pos += diapo.tx_var = diapo.tx_var * .9 + (diapo.tx_target - diapo.tx_pos) * .02;
		diapo.txt.style.left = Math.round(diapo.tx_pos) + "px";
		/* ==== images anim ==== */
		for(var i in diapo.O) diapo.O[i].position();
		/* ==== loop ==== */
		setTimeout("diapo.run();", 16);
	},

	/* ==== load images ==== */
	images_load : function(){
		// ===== loop until all images are loaded =====
		var M = 0;
		for(var i=0; i<diapo.N; i++) {
			if(diapo.img[i].complete) {
				diapo.img[i].style.position = "relative";
				diapo.O[i].img.style.visibility = "visible";
				diapo.O[i].spa.style.visibility = "visible";
				M++;
			}
			resize();
		}
		if(M<diapo.N) setTimeout("diapo.images_load();", 128);
	},

	/* ==== init script ==== */
	init : function() {
		diapo.DC = document.getElementById("diapoContainer");
		diapo.img = diapo.DC.getElementsByTagName("img");
		diapo.txt = document.getElementById("caption");
		diapo.N = diapo.img.length;
		for(i=0; i<diapo.N; i++) diapo.O.push(new diapo.CDiapo(diapo.img[i]));
		diapo.resize();
		diapo.tx_pos = -diapo.nw;
		diapo.tx_target = -diapo.nw;
		diapo.images_load();
		diapo.run();
	}
}

function dom_onload() {
	if(document.getElementById("diapoContainer")) diapo.init(); else setTimeout("dom_onload();", 128);
}


/**************************************************************************************/
onload=function s(){
		new demo();
		new dom_onload();
		new addEvent();
}

