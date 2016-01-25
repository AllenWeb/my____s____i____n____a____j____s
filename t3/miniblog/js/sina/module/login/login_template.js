/**
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview 登陆对话框的模板
 * @author Random | yanghao@staff.sina.com.cn
 */

$import("sina/module/login/_login.js");

var strTemplate=[];
strTemplate.push('<div class="CP_layercon2">');
	strTemplate.push('<div class="dingyueLogin">');
		strTemplate.push('<div id="login_error_msg" style="display:none;padding-left:64px; line-height:25px; color:red;">登录名或密码错误</div>');
		strTemplate.push('<div class="boxA">登录名：');
			strTemplate.push('<input id="login_username" name="login_username" type="text" size="28" class="input_bor" />&nbsp;&nbsp;<a target="_blank" href="http://login.sina.com.cn/hd/reg.php?entry=shequ" style="font-size:12px;">立即注册</a>');
		strTemplate.push('</div>');
		strTemplate.push('<div class="boxA">密　码：');
			strTemplate.push('<input id="login_password" maxlength="16"  name="login_pass" type="password" size="28" class="input_bor" />&nbsp;&nbsp;<a target="_blank" href="http://login.sina.com.cn/getpass.html" style="font-size:12px;">找回密码</a>');
		strTemplate.push('</div>');
		strTemplate.push('<div id="login_ckimg" class="boxA" style="display:none;"> <p class="p_img">验证码：');
			strTemplate.push('<input id="login_vcode" name="login_vcode" type="text" class="input_bor" size="6" maxlength="4" />');
			strTemplate.push('<img id="checkImg" src="http://space.sina.com.cn/CheckCode.php?type=4" width="51" height="16" />&nbsp;<a href="javascript:;" onclick="return false;" style="font-size:12px;"><span id="reloadCode">看不清？换一下</span></a></p>');
		strTemplate.push('</div>');
		strTemplate.push('<div class="boxB"><p><input id="login_save" type="checkbox" value="" checked /> 记住登录名</p><p style="margin-top:8px;"><input type="button" value="登录" class="input0111" id="login_button" name=""/></p></div>');
	strTemplate.push('</div>');
	strTemplate.push('<div class="CP_lg_ad"><iframe style="width:100%;height:30px;" src="http://blog.sina.com.cn/lm/iframe/71/2008/0731/21.html" frameborder="0" scrolling="no"></iframe></div>');
strTemplate.push('</div>');

Module.Login.template=strTemplate.join('');

