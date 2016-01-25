/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("sina/app.js");
$registJob("invitetop",function(){
	//App.resizeIframe();
});

App.resizeIframe = function(){
	var iframe    = $E("adiframe");
	var iframwrap = $E("iframewrap");
	var content   = iframe.contentWindow;
	var height = Math.max(content.document.documentElement.scrollHeight,content.document.body.scrollHeight);	
	setInterval(function(){
		try{
			if(App.iframeHeight != height){
				App.iframeHeight = height;
				iframe.height =  height;
				iframwrap.style.height = height +"px";
			}	
		}catch(e){
			
		}	
	},100);
}
