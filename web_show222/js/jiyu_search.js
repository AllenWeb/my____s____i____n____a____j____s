var xmlHttpSearch;

function createSearchXMLHttpRequest(){
    if(window.ActiveXObject)    {
        xmlHttpSearch = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(window.XMLHttpRequest){
        xmlHttpSearch = new XMLHttpRequest();
    } 
}

function startRequest_search(keyword){
    createSearchXMLHttpRequest();
	var url = "phpServlet/servlet.php?keyword="+keyword;
    try{
        xmlHttpSearch.onreadystatechange = searchCallback;
        xmlHttpSearch.open("GET", url, true);
        xmlHttpSearch.send(null);
    }
    catch(exception){
        alert("xmlHttp Fail");
    }
}

function searchCallback(){  
    if(xmlHttpSearch.readyState == 4){       
        if (xmlHttpSearch.status == 200 || xmlHttpSearch.status == 0){	
            var result = xmlHttpSearch.responseText;
			var array = new Array();
			array = result.split("|");
			callback_init_page(array);
			}else{
				alert(xmlHttpSearch.status);
			}
        }  
}