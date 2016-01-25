/**
 * @id Core.Dom.setStyle2
 * @param {Element|String} elem 节点或节点的id
 * @param {String} css代码
 * @author shaomin | shaomin@staff.sina.com.cn
 * @为当前element的加各种样式,与setStyle不同，这个可以赋多个值
 * example : $setStyle2('myDiv',{'border':'1px solid red;',"backgroundColor": "red", "background-color": "green"})
 */
$import("sina/core/dom/_dom.js");
$import("sina/core/dom/setStyle.js");
(function() {

var toStyleAttribute =  function (styleName) {
    var arr = styleName.split('-');
    var cc = arr[0];
    for (var i = 1; i < arr.length; i++) {
        cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
    }
    return cc;
};


 Core.Dom.setStyle2 = function (elem, style) {
 		if(typeof elem == 'string'){
			elem = $E(elem);
		}
		
        for (var name in style) {
	    styleAttr = toStyleAttribute(name);
	    Core.Dom.setStyle(elem, styleAttr, style[name]);
        }
    };
	

})();