/**
 * @author xs| zhenhua1@staff.sina.com.cn
 *
 * 拷贝文本内容到剪切板
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");


/**
 * 拷贝文本内容到剪切板
 */
App.copyText = function(text2copy){
	// 检测是否Flash10
	var checkFlashVer = function(){
		var plugin = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ?
		navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
		if (plugin) {
			var words = navigator.plugins["Shockwave Flash"].description.split(" ");
			for (var i = 0; i < words.length; ++i) {
				if (isNaN(parseInt(words[i], 10))){
					continue;
				} 
				var MM_PluginVersion = words[i];
			}
			return MM_PluginVersion >= 10;
		}else if ($IE){
			try{	
				new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10");
				return true;
			}catch(e){
				return false;
			}
		}
	};
	
			
	// IE6 直接使用clipboardData对象
	if (window.clipboardData && $IE6) {
		window.clipboardData.clearData();
		return window.clipboardData.setData("Text", text2copy);
	} else {
		if (checkFlashVer()) {
			if($IE){
				try{
			        	window.clipboardData.clearData();
					return window.clipboardData.setData("Text", text2copy);				
				}catch(e){
					return false;
				}
			}
			// FF下针对FlashPlayer10处理 (有安全提示)
			try {
		                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		                if (!clip) {
					return;
				}
		                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		                if (!trans){
					return;
				} 
		                trans.addDataFlavor('text/unicode');
		                var str = {};
		                var len = {};
		                str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		                var copytext = text2copy;
		                str.data = copytext;
		                trans.setTransferData("text/unicode", str, copytext.length * 2);
		                var clipid = Components.interfaces.nsIClipboard;
		                if (!clip){
					return false;
				} 
		                clip.setData(trans, null, clipid.kGlobalClipboard);
		
						return true;
			}catch(e){ 	return false; }
		}else{
			// 其他情况使用FlashCopy
			var flashcopier = 'flashcopier';
			if(!$E(flashcopier)) {
			var divholder = $C('div');
			divholder.id = flashcopier;
			document.body.appendChild(divholder);
			}
				text2copy = text2copy.replace(/%/g,escape('%')).replace(/&/g,escape('&'));
			var divinfo = '<embed src="/view/js/clipboard.swf" FlashVars="clipboard='+text2copy+'" width="0" height="0" type="application/x-shockwave-flash"></embed>'; //这里是关键
			//var divinfo = '<embed src="http://s.app.pengyou.sina.com.cn/swf/public/clipboard.swf" FlashVars="clipboard=' + text2copy.replace(/%/g,escape('%')).replace(/&/g,escape('&')) + '" width="0" height="0"	type="application/x-shockwave-flash"></embed>';
			$E(flashcopier).innerHTML = divinfo;
			return true;
		}
	}
};
/*
 * @param text:需要链接复制的文本
 * @param cfg:{
 *              succText : 复制成功的提示文案代码,默认CC4101
 *              errorText: 复制失败的提示文案代码，默认CD0016
 *              
 *              }
 * 
 */
App.copyTextDialog = function(text,cfg){
	var config = cfg||{};
	var sucStr   = config['succText']||$CLTMSG["CC4101"]; 
    var options  = {icon:3};    
    if(App.copyText(text||"") == false){
        sucStr   = config['errorText']||$CLTMSG["CD0016"];
        options  = {icon:1};
    }
    App.alert(sucStr,options);
    Core.Events.stopEvent();
};
