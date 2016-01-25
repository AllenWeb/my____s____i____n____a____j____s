
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

var pageSize=10;
var maxPageLength=null;
var currentPage = 1;
var foot1=null;
var foot2=null;
var lastPage=null;
var nextPage=null;
var keyValue=null;
var parth = new Array("六度空间团队相册-->战  铖-->romantic","六度空间团队相册-->战  铖-->belle",
					  "六度空间团队相册-->范学亮-->fantasy","六度空间团队相册-->范学亮-->caricature",
					  "六度空间团队相册-->郭志伟-->after90","六度空间团队相册-->郭志伟-->theme",
					  "六度空间团队相册-->张燕燕-->scenery","六度空间团队相册-->张燕燕-->desolation",
					  "六度空间团队相册-->宋德彬-->yearn","六度空间团队相册-->陈志能-->wallpaper");

function callback_init(total_arr){
	maxPageLength=getPageLength(total_arr[0]);
	var jiyu = document.getElementById("jiyu");
	displayPageOnDiv(jiyu,total_arr,1);
	
	var foot_middle = document.getElementById("foot_middle");
	for(var i=1;i<=maxPageLength;i++){		
		var inputButton = document.createElement("input");
		inputButton.type = "button";
		inputButton.id = ("page"+i);
		inputButton.value = i;
		foot_middle.appendChild(inputButton);
	}
	init_dispayPartOfPageSize(1);
	displitPage(maxPageLength);
}

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
		}
		init_dispayPartOfPageSize(1);
		unDisplaySpan(foot1);
	}else if(pageNo >= maxLength-4){
		if(pageNo == maxLength){
			unDisplaySpan(nextPage);
		}
		init_dispayPartOfPageSize(maxLength-9);
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
function callback_init_page(page_arr){
	var jiyu = document.getElementById("jiyu");
	displayPageOnDiv(jiyu,page_arr,currentPage);
	
}
function displitPage(maxLength){
	 var foot_middle = document.getElementById("foot_middle");
	var inputButton = foot_middle.getElementsByTagName("input");
	for(var i=0;i<inputButton.length;i++){
		inputButton[i].onclick = function(){
			selectPage(this.id);
			currentPage = parseInt(this.value);
			startRequest_page(currentPage);
			dispayPageSizeItem(currentPage,maxLength);
		}
	} 
	
	var lastPage = document.getElementById("lastPage");
	lastPage.onclick = function(){
		if(currentPage<=1){
			currentPage=1;
		}else{
			currentPage--;
		}
		selectPage("page"+currentPage);
		startRequest_page(currentPage);
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
		startRequest_page(currentPage);
		dispayPageSizeItem(currentPage,maxLength);
	}
	var first = document.getElementById("first");
	first.onclick = function(){
		currentPage = 1;
		selectPage("page"+currentPage);
		startRequest_page(currentPage);
		dispayPageSizeItem(currentPage,maxLength);
		init_dispayPartOfPageSize(1);
	}
	var last = document.getElementById("last");
	last.onclick = function(){
		currentPage = maxLength;
		selectPage("page"+currentPage);
		startRequest_page(currentPage);
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
		var text1="楼"+((parseInt(value)-1)*pageSize+j)+" ";
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
function showyear(ele,s){
		var m=document.getElementById(s).style.display;
		var menu_p = ele.getElementsByTagName("p");
		var pic_top_title = document.getElementById("pic_top_title");
		pic_top_title.innerHTML = "六度空间团队相册";
		if(m=='inline'){
			document.getElementById("menu").style.background="url(images/nolines_plus.gif) no-repeat";
			document.getElementById("menu").style.backgroundPosition="center left";
			document.getElementById(s).style.display='none';	
			menu_p[0].style.color = "black";
		}
		else{
			document.getElementById("menu").style.background="url(images/nolines_minus.gif) no-repeat";
			document.getElementById("menu").style.backgroundPosition="center left";
			document.getElementById(s).style.display='inline';	
			menu_p[0].style.color = "red";
			}
}

function showmonth(ele,s){	
		var arr = new Array("六度空间团队相册-->战  铖","六度空间团队相册-->范学亮","六度空间团队相册-->郭志伟",
						    "六度空间团队相册-->张燕燕","六度空间团队相册-->宋德彬","六度空间团队相册-->陈志能");
	    var m=document.getElementById(s).style.display;
		var x='y'+s.substring(4);
		var menu_p = ele.getElementsByTagName("p");
		var pic_top_title = document.getElementById("pic_top_title");
		var str = parseInt(s.charAt(4));
		pic_top_title.innerHTML = arr[str-1];
		if(m=='inline'){
			document.getElementById("year"+s.substring(4)).style.background="url(images/nolines_plus.gif) no-repeat";
			document.getElementById("year"+s.substring(4)).style.backgroundPosition="center left";
			document.getElementById(s).style.display='none';
			menu_p[0].style.color = "black";
			}
		else{
			document.getElementById("year"+s.substring(4)).style.background="url(images/nolines_minus.gif) no-repeat";
			document.getElementById("year"+s.substring(4)).style.backgroundPosition="center left";
			document.getElementById(s).style.display='inline';
			menu_p[0].style.color = "red";
		}
}
function showItemsColor(){
	for(var i=0;i<=9;i++){
		var id_name = "item"+i;
		var items = document.getElementById(id_name);
		var items_p = items.getElementsByTagName("p");
		items_p[0].style.color = "black";
	}
}
var page_photo_size = 15;
function getPagelength_root(rootLength){
	if(rootLength%page_photo_size ==0){
		return parseInt(rootLength/page_photo_size);
	}else{
		return parseInt(rootLength/page_photo_size)+1;
	}
}
function display_item_photo(name,root,root_length,pageNo_photo){
	var pic_page = document.getElementById("pic_page");
	pic_page.innerHTML = "";
	var pagelength_root = getPagelength_root(root_length);
	var pic_view = 	document.getElementById("pic_view");
	pic_view.innerHTML = "";
	for(var i=0;i<root.album.length;i++){
		var photo_img = document.createElement("img");
		photo_img.src = root.album[i].url;
		photo_img.alt = root.album[i].name;
		photo_img.title = root.album[i].name;
		pic_view.appendChild(photo_img);
		
		/* photo_img.onclick = function(){
			
		} */
	}
	
	for(var i=1;i<=pagelength_root;i++){
		var pic_page_input = document.createElement("input");
		pic_page_input.type = "button";
		pic_page_input.className = "photo_show";
		pic_page_input.value = i;
		pic_page.appendChild(pic_page_input);
		
		pic_page_input.onclick = function(){
			startRequest_photo(name,this.value);
		}
	}
}

function createPhotos(id,str){
	var menu = document.getElementById("menu");
	menu.onclick = function(){
		showyear(this,'year');
	}
	var year1 = document.getElementById("year1");
	year1.onclick = function(){
		showmonth(this,'menu1');
	}
	var year2 = document.getElementById("year2");
	year2.onclick = function(){
		showmonth(this,'menu2');
	}
	var year3 = document.getElementById("year3");
	year3.onclick = function(){
		showmonth(this,'menu3');
	}
	var year4 = document.getElementById("year4");
	year4.onclick = function(){
		showmonth(this,'menu4');
	}
	var year5 = document.getElementById("year5");
	year5.onclick = function(){
		showmonth(this,'menu5');
	}
	var year6 = document.getElementById("year6");
	year6.onclick = function(){
		showmonth(this,'menu6');
	}
	for(var i=0;i<=9;i++){
		var id_name = "item"+i;
		var items = document.getElementById(id_name);
		items.onclick = function(){
			showItemsColor();
			var items_p = this.getElementsByTagName("p");
			items_p[0].style.color = "red";
			var pic_top_title = document.getElementById("pic_top_title");
			var str = parseInt(this.id.charAt(4));
			pic_top_title.innerHTML = parth[str];
			var typeName = items_p[0].innerHTML;
			startRequest_photo(typeName,1);
		}
	}
	
}
function createCurriculumSheet(){
	new Jcalendar();
}
function createTeamIntroduce(id,str){
	
}
onload=function(){	
	document.getElementById("topic1").style.background="url("+titleBg+")";
	document.getElementById("content1").style.display='block';
	document.getElementById("searchKey").onclick = function(){
		keyValue = document.getElementById("keyword").value;
		if(keyValue.length==0 || keyValue==" "){
			alert("请输入关键字且关键字必须为非空白字符");
		}else{
			startRequest_search(keyValue);
		}
	} 

	backg1 = document.getElementById("backg1");
	backg1.onclick = function(){
		selectBg('style1.css','#0F5C9B','images/title_bg_1.gif');
	}
	backg2 = document.getElementById("backg2");
	backg2.onclick = function(){
		selectBg('style2.css','#90F','images/title_bg_2.jpg');
	}
	backg3 = document.getElementById("backg3");
	backg3.onclick = function(){
		selectBg('style3.css','#060','images/title_bg_3.jpg');
	}
	backg4 = document.getElementById("backg4");
	backg4.onclick = function(){
		selectBg('style4.css','#FDA229','images/title_bg_4.jpg');
	}
	topic1 = document.getElementById("topic1");
	topic1.onclick = function(){
		selectTopic(this.id,'content1');
	}
	topic2 = document.getElementById("topic2");
	topic2.onclick = function(){
		selectTopic(this.id,'content2');
		createPhotos(this.id,'content2');
	}
	topic3 = document.getElementById("topic3");
	topic3.onclick = function(){
		selectTopic(this.id,'content3');
		createCurriculumSheet();
	}
	topic4 = document.getElementById("topic4");
	topic4.onclick = function(){
		selectTopic(this.id,'content4');
		createTeamIntroduce(this.id,'content4');
	}
	sendXMLHttpReq(1);
	foot1 = document.getElementById("foot1");
	foot2 = document.getElementById("foot2");
	lastPage = document.getElementById("lastPage");
	nextPage = document.getElementById("nextPage");
	unDisplaySpan(lastPage);
	unDisplaySpan(foot1);	
}













