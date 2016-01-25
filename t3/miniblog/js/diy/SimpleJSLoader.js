$import("sina/sina.js");
$import("sina/app.js");

/**
 * @author liusong@staff.sina.com.cn
 */

(function(ns){
	ns.SimpleJSLoader = function(url, success){
		var d = document, j = d.createElement("script"), h = d.getElementsByTagName("head")[0], s = false;
		j.type = "text/javascript";
		j.charset = "UTF-8";
		j.src =  url;
		j.onload = j.onreadystatechange = function(){
			if(!s && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
				s = true;
				j.onload = j.onreadystatechange = null;
				typeof success=="function" && success();
			}
		}
		try {h.appendChild(j)}catch(e){}
	}
})(App);