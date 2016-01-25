$import("sina/utils/utils.js");
$import("sina/core/dom/setStyle2.js");
Utils.Resize = function(){
		var blk = this;
		window.onresize = start;
		function start () {
		    blk.onresize();
		
		};
		function end () {
			document.onresize = null;
		
		}
};