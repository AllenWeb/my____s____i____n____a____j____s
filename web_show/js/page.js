
/* 	var PageNo=1;
	var curPageNo=1;
	var pageSize=20;
	var condiv;
	var footerPageList;
	var footerPage_ul;
	var front;
	var back; */
	
function displitPage(maxLength){
	
	var foot1 = document.getElementById("foot1");
	foot1.style.display = "none";
	var lastPage = document.getElementById("lastPage");
	lastPage.onclick = function(){
		
		
	}
	
	
	
	//pageClickEve(1,maxLength);
	
	/* var maincon = document.getElementById("main");
	condiv = maincon.getElementsByTagName("div");
	footerPageList = document.getElementById("footerPage");
	footerPage_ul = document.getElementById("footerPage_ul");
	middlePage();
	var last = document.getElementById("last");
	last.innerHTML = condiv.length;
	addEve();
	fenpage(PageNo,curPageNo,condiv); */
}


function pageClickEve(fLength,maxLength){
	
	for(var i=fLength;i<=(fLength+10)&&i<=maxLength;i++){
		var pa="page"+i;
		document.getElementById(pa).onclick = function(){
			selectPage(this.id);
			
			sendXMLHttpReq(this.value);
			var total_arr = mess_box();
			maxPageLength=getPageLength(total_arr[0]);
			var jiyu = document.getElementById("jiyu");
			displayPageOnDiv(jiyu,total_arr,this.value);
			
			
		}
	}
}

 function displayUl(){
	back = document.getElementById("back");
	front = document.getElementById("front");
	if((curPageNo/10)<=1){
		front.style.display = "none";
		back.style.display = "block";
	}else if(curPageNo>=10*parseInt(condiv.length/10)+1){//||(curPageNo/10)>=Math.ceil(condiv.length/10)
		front.style.display = "block";
		back.style.display = "none";
	}else{
		front.style.display = "block";
		back.style.display = "block";
	}
 }
 function middlePage(){
	while(footerPage_ul.hasChildNodes()){
		footerPage_ul.removeChild(footerPage_ul.firstChild);
	}
	displayUl();
	for(var i=10*parseInt(curPageNo/10);i<(10*parseInt(curPageNo/10)+11) && i<condiv.length;i++){

		var createLI = document.createElement("li");
		createLI.innerHTML = i+1;
		createLI.onclick = function(){
			PageNo = curPageNo;
			curPageNo= this.innerHTML;
			if(curPageNo%10==1){
				middlePage();
			}
			displayUl();
			fenpage(PageNo,curPageNo,condiv);
		} 
		footerPage_ul.appendChild(createLI);	
	}
 }
 function addEve(){
	var lastpage = document.getElementById("lastpage");
	lastpage.onclick = function(){
		if(curPageNo>1){
			PageNo = curPageNo;
			curPageNo--;
			fenpage(PageNo,curPageNo,condiv);
		}else{
			PageNo = curPageNo;
			fenpage(PageNo,curPageNo,condiv);
		}
	};
	var nextpage = document.getElementById("nextpage");
	nextpage.onclick = function(){
		if(curPageNo<condiv.length){
			PageNo = curPageNo;
			curPageNo++;
			fenpage(PageNo,curPageNo,condiv);
		}else{
			PageNo = curPageNo;
			fenpage(PageNo,curPageNo,condiv);
		}
	};
	var first = document.getElementById("first");
	first.onclick = function(){
		PageNo = curPageNo;
		curPageNo=1;
		fenpage(PageNo,curPageNo,condiv);
		middlePage();
	}
	var last = document.getElementById("last");
	last.onclick = function(){
		PageNo = curPageNo;
		curPageNo=condiv.length;
		fenpage(PageNo,curPageNo,condiv);
		middlePage();
	}
}
function fenpage(oldpage,pagelen,condiv){
	if(pagelen<=1) pagelen=1;
	if(pagelen>=condiv.length)pagelen=condiv.length;
	for(var i=(oldpage-1)*1;i<oldpage*1;i++){
		condiv[i].style.display = "none";
	}
	for(var i=(pagelen-1)*1;i<pagelen*1;i++){
		condiv[i].style.display = "block";
	}
}





