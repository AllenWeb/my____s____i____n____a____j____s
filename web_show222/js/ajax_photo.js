
var xmlHttpPhoto;
var itemName;
var pageNo_photo;

function createxmlHttpPhotoRequest(){

   if(window.ActiveXObject)    {
        xmlHttpPhoto = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(window.XMLHttpRequest){
        xmlHttpPhoto = new XMLHttpRequest();
    } 
}

function startRequest_photo(type,page){
	itemName = type;
	pageNo_photo = page;
    createxmlHttpPhotoRequest();
	var arg = "type="+type+"&page="+page;
	var url = "phpServlet/servlet_photo.php?"+arg;
    try{
		xmlHttpPhoto.open("GET", url, true);
        xmlHttpPhoto.onreadystatechange = init_photo_page; 
        xmlHttpPhoto.send(null);
    }
    catch(exception){
        alert("xmlHttp Fail");
    }
}
function init_photo_page(){    
    if(xmlHttpPhoto.readyState == 4){        
        if (xmlHttpPhoto.status == 200 || xmlHttpPhoto.status == 0){
            var result = xmlHttpPhoto.responseText;
			var rootJson = photoJson(result);
			var rootJson_length = photoJson_lenght(result);
			display_item_photo(itemName,rootJson,rootJson_length,pageNo_photo);
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
function photoJson_lenght(str){
	var t = str.indexOf("@");
	var len = str.slice(0,t);
	var length = parseInt(len);
	return length;
}
//将指定类型相册解析成json对象
function photoJson(str){
   var t = str.indexOf("@");
   t = t + 1;
   var photo = str.slice(t);
   photo = photo.replace(/\@/g,'"},{"');
   photo = '{"album":[{"' + photo + '"}]}';
   photo = photo.replace(/\|/g,'","');
   photo = photo.replace(/\-/g,'":"');
   var photoJson = eval("(" + photo + ")");
   return photoJson;
}