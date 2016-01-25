/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/getStyle.js");
(function(ns){
	ns.ELSize = function( oElement, key, hasMargin ){
		var c = Core.Dom.getStyle, os = oElement[(key=="width")? "offsetWidth": "offsetHeight"], i = 0, p = ["padding","margin","border"], d = (key == "width")? ["Left", "Right"]:["Top", "Bottom"];
		for(i; i<d.length; i++){
			os -= parseFloat(c(oElement,"padding" + d[i]))||0;
			hasMargin && (os += parseFloat(c(oElement,"margin"  + d[i]))||0);
			os -= parseFloat(c(oElement,"border"  + d[i] + "Width"))||0;
		}
		return os;
	}
})(App);
