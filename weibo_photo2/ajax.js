
var xmlHttp;
var args;

function $(id){return document.getElementById(id);}

function addEvent(){
    $("ok").onclick = function(){
      var type = $("type").value;
	  var page = $("page").value;
	  args = "type="+type+"&page="+page;
	  alert(args);
	  startRequest(args);
    }
}



function createXMLHttpRequest()
{
    if(window.ActiveXObject)
    {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(window.XMLHttpRequest)
    {
        xmlHttp = new XMLHttpRequest();
    }
}

function startRequest(arg)
{
    createXMLHttpRequest();
	var url = "servlet.php?"+arg;
	alert(url);
    try
    {
		xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = init_page; 
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
            var result = xmlHttp.responseText;
			
			var rootJson = photoJson(result);
			alert(rootJson.album[1].url);
			
		
        }
    
   }
}
//将跟相册信息解析成json对象
function rootToJson(str){
   var s = str.replace(/\|/g,'","');
   s = s.replace(/\-/g,'":"');
   s = '{"' + s + '"}';
   alert(s);
   var json = eval("(" + s + ")");
   return json;
}

//将指定类型相册解析成json对象
function photoJson(str){
   var photo = str.slice(1);
   photo = photo.replace(/\@/g,'"},{"');
   photo = '{"album":[{"' + photo + '"}]}';
   photo = photo.replace(/\|/g,'","');
   photo = photo.replace(/\-/g,'":"');
   //alert(photo);
   var photoJson = eval("(" + photo + ")");
   return photoJson;
}