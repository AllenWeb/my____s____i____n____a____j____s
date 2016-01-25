$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/removeNode.js");
$import('sina/core/events/addEvent.js');
$import("diy/getEventDom.js");

App.getImgSize = function(url, echo){
	
	
	function startLoad(){
		var img = new Image();
		imgLoader = $C("div");
		imgLoader.style["visibility"] = "hidden";
		imgLoader.style["height"] = "1px";
		imgLoader.style["overFlow"] = "hidden";
		var timer, imgLoader;
	
		var afterImgLoaded = function(e){
			clearTimeout(timer);
			var _size = [img.width, img.height];
			Core.Events.removeEvent(img, afterImgLoaded, "load");
			imgLoader.removeChild(img);
			Core.Dom.removeNode(imgLoader);
			delete img;
			delete imgLoader;

			setTimeout(function(){
				echo(_size);
			}, 1);
			return;
		}
		
		imgLoader.appendChild(img);
		document.body.appendChild(imgLoader);
		Core.Events.addEvent(img, afterImgLoaded, "load");
		
		timer = setTimeout(function(){
			Core.Events.removeEvent(img, afterImgLoaded, "load");
			imgLoader.removeChild(img);
			Core.Dom.removeNode(imgLoader);
			delete img;
			delete imgLoader;
			startLoad();
		},3000);
		
		img.src = url;
	}
	startLoad();
};
