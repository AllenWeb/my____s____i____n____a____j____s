var xmlHttp;
var page = 1;
//var flag = 1;  //to jugement wheather the init_page method has run or not 
var total_pages;     //总留言页数
var message_box;

function createXMLHttpRequest()
{
    if(window.ActiveXObject)
    {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		//alert("Microsoft");
    }
    else if(window.XMLHttpRequest)
    {
        xmlHttp = new XMLHttpRequest();
		//alert("firefox");
    } 
}

function change_page(num){
    page = num;
}
function startRequest()
{
    createXMLHttpRequest();
	var url = "phpServlet/servlet.php?page="+page;
    try
    {
        xmlHttp.onreadystatechange = init_page;
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
    catch(exception)
    {
       alert("xmlHttp Fail");
    }
}
function init_page()
{  
    if(xmlHttp.readyState == 4)
    {       
        if (xmlHttp.status == 200 || xmlHttp.status == 0)
        {	
			//alert(xmlHttp.status);
            var result = xmlHttp.responseText;
			var array = new Array();
			array = result.split("|");
			set_mess(array);  
			}else{
				alert(xmlHttp.status);
			}
        }  
}
function set_mess(arr){
     message_box = arr;
}
function mess_box(){
    
	return message_box;
}

function sendXMLHttpReq(pageNumber){
	change_page(pageNumber);
	startRequest();
}