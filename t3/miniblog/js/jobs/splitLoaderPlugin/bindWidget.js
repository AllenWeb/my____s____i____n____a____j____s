/**
 * @author liusong@staff.sina.com.cn
 */
$import("diy/CustomEvent.js");

App.bindWidget = function(oDom, sKey, oData){
    if (oDom && oData && oData.code == "A00006") {
        var wrap = $C("div"), scripts, i = 0, len, c;
        wrap.innerHTML = oData.data;
        scripts = wrap.getElementsByTagName("script");
        if (len = scripts.length) {
            for (; i < len; i++) {
                c = scripts[i];
                c.parentNode.removeChild(c);
                c = null;
            }
        }
        oDom.innerHTML = "";
        while (wrap.firstChild) {
            oDom.appendChild(wrap.firstChild)
        }
        App.CustomEvent.fire("widget", sKey, oDom, oData);
    }
};
