/**
 *
 * @param type label param
 * @return 
 * @author antz
 */
//http://blog.sina.com.cn/main_v5/ria/ii.html?type=blog&label=search&parm=comment
function v6SendLog(type, label, param) {
	var o = new Image();
	o.src = "http://blog.sina.com.cn/main_v5/ria/ii.html?type="+ type +"&label=" + label + "&parm=" + param + "&" + new Date().valueOf();
}