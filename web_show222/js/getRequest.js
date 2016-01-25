var xmlHttp;

function createXMLHttpRequest(){
    if(window.ActiveXObject)    {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    } 
}

function startRequest(page){
    createXMLHttpRequest();
	var url = "phpServlet/servlet.php?page="+page;
    try{
        xmlHttp.onreadystatechange = initCallback;
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
    catch(exception){
        alert("xmlHttp Fail");
    }
}

function initCallback(){  
    if(xmlHttp.readyState == 4){       
        if (xmlHttp.status == 200 || xmlHttp.status == 0){	
            var result = xmlHttp.responseText;
			var array = new Array();
			array = result.split("|");
			callback_init(array);
			}else{
				alert(xmlHttp.status);
			}
        }  
}
function startRequest_page(page){	
    createXMLHttpRequest();
	var url = "phpServlet/servlet.php?page="+page;
    try{
        xmlHttp.onreadystatechange = init_page;
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
    catch(exception){
        alert("xmlHttp Fail");
    }
}
function init_page(){  
    if(xmlHttp.readyState == 4){       
        if (xmlHttp.status == 200 || xmlHttp.status == 0){	
            var result = xmlHttp.responseText;
			var array = new Array();
			array = result.split("|");
			callback_init_page(array);
			}else{
				alert(xmlHttp.status);
			}
        }  
}

function sendXMLHttpReq(pageNumber){
	startRequest(pageNumber);
}
function sendXMLHttpReq_page(pageNumber){
	startRequest_page(pageNumber);
}