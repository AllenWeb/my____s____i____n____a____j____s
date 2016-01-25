
/**
 * @author shaomin | shaomin@staff.sina.com.cn
 *@ desc 推荐插件
 */	

function share_iframe_data_run(str, url)
{
	var e = Core.Events.getEvent();
	msg(str, "$('iframe_data').src='" + url + "';", 'Alert', '', '',false, {h:120,x:e.clientX,y:e.clientY+50});
	
}

function share_message_show(str, is_ok)
{
//	var e=getEvent();
	if (is_ok == true)
	{
		parent.errTips(str, 1);
//		parent.msg(str, "location.reload();", '信�?????�?', '', '',true, "");
	}
	else
	{	
		parent.errTips(str, 2);
//		parent.msg(str, "", "信�?????�?", "", "", true, "");
	}

}

function share_new_form_callback(uids)
{
	var e = uids.split('|');
	var name = e[0];
	var uid = e[1];
	$E("share_new").share_to_uid.value = uid;
	$E("share_to_name").value=name;
}

function check_mail_count(obj){
	if (obj.value.split(";").length > 5){
		obj.value = obj.value.substr(obj.value.indexOf(";"));
	}
}


function share_comment_show(id, id2)
{
	var obj = $E(id);
	if (obj)
	{
		if (obj.style.display == 'inline')
		{
			obj.style.display='none';
		}
		else
		{
			obj.style.display='inline';
		}
	}
	
	var obj2 = $E(id2);
	if (obj2)
	{
		if (obj2.style.display == 'inline')
		{
//			obj2.style.display='none';
		}
		else
			obj2.style.display='inline';
	}	

	var iHeight	= $E('reco_app').offsetHeight;
	parent.document.getElementsByName('iframe_canvas')[0].height = Math.abs(iHeight)+30 > 800 ? Math.abs(iHeight)+30 : 800;
}

function setCopy(_sTxt){
	try {
		clipboardData.setData('Text',_sTxt);
		//return true;
	}
	catch(e){
		return false;
	}
//		alert("");

	var e = Core.Events.getEvent();
	msg("复制链接成功。<br/>按ctrl+v直接粘贴到您的QQ或MSN上推荐给您的好友吧^_^", "", 'Alert', '', '','', {h:120,x:e.clientX-50,y:e.clientY-100});

	return true;
}


function setIframe(pos, sIframe){
	var sIframe = (sIframe == null) ? $E("commendiframe") : sIframe;
	if (pos == null) {
		Core.Dom.setStyle($E("commendiframe"), "visibility", "hidden");
		return;
	}
	Core.Dom.setStyle(sIframe, "visibility", "visible");
	Core.Dom.setStyle(sIframe, "left", pos.left + "px");
	Core.Dom.setStyle(sIframe, "top", pos.top + "px");
	Core.Dom.setStyle(sIframe, "height", pos.height + "px");
	Core.Dom.setStyle(sIframe, "width", pos.width + "px");
}



