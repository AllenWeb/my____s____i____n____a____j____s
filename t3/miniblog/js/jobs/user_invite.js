/**
 * @author haidong@staff.sina.com.cn
 * 新用户引导
 */
$import("sina/sina.js");
$import("jobs/base.js");
$import("sina/core/function/bind2.js");
$import("jobs/request.js");
$import("diy/htmltojson.js");
$import("diy/check.js");
$import("diy/mb_dialog.js");
$import("diy/enter.js");
$import("diy/prompttip.js");
$import("diy/provinceandcity.js");
$import("sina/core/string/byteLength.js");
$import("jobs/toggle.js");

$registJob("user_invite",function(){
		var _searchBoxInitString = $CLTMSG['CX0061'];
		//搜人表单
		var searchInput = $E("searchinput");
		var searchbtn = $E("searchbtn");
		Core.Events.addEvent(searchInput, function(){
			if(searchInput.value == _searchBoxInitString){
				searchInput.value = "";
			}
			return;
		}, "focus");
		Core.Events.addEvent(searchInput, function(){
			if(/search=(.+)/.test(window.location.href)){
                                return;
                        }
			if(searchInput.value == ""){
				searchInput.value = _searchBoxInitString;
			}
			return;
		}, "blur");
		
		searchbtn.onclick = function(){
			var value = Core.String.trim(searchInput.value);
			if(value == _searchBoxInitString){
				searchInput.value = "";
			}
			document.filterform1.submit();
			return false;
		};

		searchInput.onkeydown = function(event){
			event = event||window.event;
			if(event.keyCode == 13){
				Core.Events.fireEvent(searchbtn, 'click');
			}
		};
});

/**
 * 邀请基本函数
 * @param {Object} options
 */
App.inviteUser = function(options){
	var type  = options["type"];
	var erorr = $E(type + "_tab_err");
	var url   = options["url"];
	var invitebtn = $E(type +"_invitebtn"); 
	var empty      = function(){};
	
	var loadIcon= $E(type+"_load");
	
	var oData = {};
	
	var status = {
		msn:{
			"in":$CLTMSG['CX0062'],
			"out":$CLTMSG['CX0063']
		},
		mail:{
			"in":$CLTMSG['CX0064'],
			"out":$CLTMSG['CX0065']
		},
		att:{
			"in":$CLTMSG['CX0066'],
			"out":$CLTMSG['CX0067']
		},
		friend:{
			"in":$CLTMSG['CX0068'],
			"out":$CLTMSG['CX0069']
		}
	}
	//关注成功
	var _onAttSuccss = function(attUser){		
		if(attUser.length != 0){		
			setStatus([$E(type+"_att_tip")]);
			$E(type + "_att_num").innerHTML = attUser.length;
		}else{
			setStatus(null,[$E(type+"_top").parentNode]);
		}
	};
	//在新浪好友内
	var _onFileInSuccss = function(inUserStr,user){
			_onToggleStatus(1);
			var userContent = $E(type+"_in_user");
			var tipContent  = $E(type+"_in_tip");
			var selectBtn   = $E(type + "_in_select");
			if(user.length != 0){
				userContent.innerHTML = inUserStr;
				tipContent.innerHTML  =	status[type]["in"].replace(/××/,computeLen(user));
			}else{
				userContent.innerHTML = "";
				tipContent.innerHTML  =	"";
			}
			selectBtn.checked = true;
		/**
		if((type =="att")|| (type =="friend")){
			if(inUserStr){				
				$E(type+"_in_user").innerHTML = inUserStr;	
				$E(type+"_in_tip").innerHTML  = status[type]["in"].replace(/××/,computeLen(user));
				setStatus(["showpanel",type+"_panel",type + "_in_content",type+"_step1"],["controlpanel"]);	
				$E(type + "_in_select").checked = true;				
			}else{
				setStatus([type+"_att_tip",type+"_att_user",type + "_in_null","showpanel",type+"_panel",type+"_step1"],[type + "_in_content","controlpanel"]);
				$E(type +"_att_icon").src = openIcon;
			}
		}else{
			if(inUserStr){
				$E(type+"_in_user").innerHTML = inUserStr;	
				$E(type+"_in_tip").innerHTML  = status[type]["in"].replace(/××/,computeLen(user));
				setStatus([type + "_in_content",type+"_panel","showpanel",type+"_step1"],["controlpanel",type+"_step2"]);	
				$E(type + "_in_select").checked = true;
			}else{
				setStatus(["showpanel",type+"_panel",type+"_step2",type + "_out_content"],["controlpanel",type+"_step1"]);
			}
		}
		**/
	};
	//显示隐藏状态
	var _onToggleStatus = function(bl){
		if(bl){
			invitebtn.parentNode.parentNode.style.display = "";
			loadIcon.style.display  = "none";
		}else{	
			invitebtn.parentNode.parentNode.style.display = "none";
			loadIcon.style.display  = "";
		}
	};
	//新浪好友外
	var _onFileOutSuccss = function(outUserStr,user){	
			var userContent = $E(type+"_out_user");
			var tipContent  = $E(type+"_out_tip")
			var selctBtn    = $E(type + "_out_select");
			
			if(user.length != 0){
				userContent.innerHTML = outUserStr;
				tipContent.innerHTML  = status[type]["out"].replace(/××/,computeLen(user));				
			}else{
				userContent.innerHTML = "";
				tipContent.innerHTML  = "";				
			}
			selctBtn.checked = true;
		/**
		if(outUserStr){
			$E(type+"_out_tip").innerHTML  = status[type]["out"].replace(/××/,computeLen(user));
			$E(type+"_out_user").innerHTML = outUserStr;
			$E(type + "_out_select").checked = true;					
		}else{
			setStatus([type + "_out_null"],[type + "_out_content"]);			
		}
		if(user.length == 0){			
			$E(type +"_guid_1").style.display = "none";		
		}
		**/
	};
	
	var _commanCB = function(inarr,outarr){
		if(inarr.length == 0 && (outarr.length == 0)){
			setStatus([type+"_att_tip",type+"_att_user"]);
			$E(type +"_att_icon").className = "small_icon cls";	
		}
		App.bindEvent(type,inarr,outarr);
		if(inarr.length != 0 ){
			setStatus(["showpanel",type+"_panel",type + "_in_content",type+"_step1"],["controlpanel","invite_Flist"]);
		}else{
			$E(type +"_in_jumpbtn").onclick();
		}
		if(outarr.length == 0){
			var guide = $E(type +"_guid_1");
			guide && (guide.style.display = "none");
		}
		location.hash = "sina";		
	}
	//错误回调
	var _onFail = function(){
		_onToggleStatus(1);
	};
	var _onCheckForm = function(){
		var oData = App.htmlToJson($E(type+'_tab'), ["input"]);
		if(!App.checkEml(oData.user)){
			erorr.innerHTML = $CLTMSG['CX0070'];
			erorr.style.display = "";
			return false;
		}else{
			erorr.style.display = "none";
		}
		if(!oData.password){
			erorr.innerHTML = $CLTMSG['CX0071'];
			erorr.style.display = "";
			return false;
		}else{
			erorr.style.display = "none";
		}
		_onToggleStatus();	
		return oData;
	};
	
	//提交的回调
	var onRequestFail = function(json){
		_onToggleStatus(1);
		erorr.style.display = "";
		erorr.innerHTML = App.getMsg(json);
	}
	
	function computeLen(obj){
		if(obj instanceof Array){
			return obj.length;
		}else{
			var len = 0;
			for(var i in obj){
				len += obj[i].length;
			}
			return len;
		}
	}
	
	var onCheckForm = options["onCheckForm"]|| _onCheckForm;
	var onFileOutSuccss= options["_onFileOutSuccss"]|| _onFileOutSuccss;
	var onFail = options["onFail"] || _onFail;
	var onFileOutSuccss = options["onFileOutSuccss"]||_onFileOutSuccss;
	var onToggleStatus  = options["onToggleStatus"]||_onToggleStatus;
	var onFileInSuccss = options["onFileInSuccss"]||_onFileInSuccss;
	var onAttSuccss    = options["onAttSuccss"]||_onAttSuccss;
	var commanCB      = options["commanCB"] || _commanCB;
	function onInviteSuccss(result){
		var attArr = result.in_att||[];		
		var inArr  = result.in_no_att||[];
		var outArr = result.out||[];	
		var formatHTML ;
		if(type == "msn"){
			formatHTML = function(data,format,ext){
				var arr = ['<input type="hidden" name="mymail" value="' + (oData ? oData.user : '') + '" /><input type="hidden" name="mailtype" value="' + type + '" />'];
				for(var i in data){
					var dataarr = data[i];
					if(i == "0"){
						i = $CLTMSG['CX0072'];
					}
					if(i == ""){
						i = $CLTMSG['CX0073'];
					}
					if(dataarr.length != 0){
						arr.push('');
						arr.push('<div class="bar" onclick="App.toggleTable(this)">' + i + '</div>');
						arr.push('<table class="f_emailList">');
						for(var j=0,jlen = dataarr.length;j<jlen;j++){							
							var tr = format(dataarr[j]);
							arr.push(tr);
						}	
						arr.push('</table>');
					}	
				}				
				return arr.join("");
			}
		}else{
			formatHTML = function(dataarr,format,ext){
				var arr = ['<input type="hidden" name="mymail" value="' + (oData ? oData.user : '') + '" /><input type="hidden" name="mailtype" value="' + type + '" />'];
				if(dataarr.length != 0){
					arr.push('');
					arr.push('<table class="f_emailList">');
					arr.push('<tbody>');
					for(var j=0,jlen = dataarr.length;j<jlen;j++){
						arr.push(format(dataarr[j]));
					}		
					arr.push('</tbody>');
					arr.push('</table">');
				}
				return arr.join('');
			}
		}
		 /**
		 * 关注用户
		 */
		(function(){			
			if(attArr.length != 0){				
				setTimeout(function(){			
					App.formatAttUser(attArr,$E(type + "_att_user"));
				},10);
			}
	  	    onAttSuccss(attArr);		
		})();
		/**
		 * 在微博内
		 */
		(function(){
			var cb = function(jobj){				
				var tr = '<tr class="MIB_linedot2" onmouseover="App.toggleClass(event,this,\'tr_bg1 MIB_linedot2\')" onmouseout="App.toggleClass(event,this)">'
				tr +='<th><input class="labelbox" checked="checked" name="uids" type="checkbox" value="'+ jobj.uid+'" onclick="App.select(this,\''+ type +'_in_select\',\''+ type +'_in_user\')"/></th>';
				tr += '<td class="td_1"><a href="/'+ jobj.uid+'"><img src="' + jobj.icon + '"/></a></td>'
				tr += '<td><a href="/'+ jobj.uid+'">'+jobj.name+'</a>   '+ (jobj.name == jobj.email?"":jobj.email)+'</td>';								
				tr += '</tr>';
				return tr;
			}	
			var inStr = formatHTML(inArr,cb);		
			onFileInSuccss(inStr,inArr);
			document.documentElement.scrollTop = 0;			
		})();
		
		/**
		 * 不在需要发送邀请
		 */		
		 (function(){
 			var cb = function(obj){
				if(typeof (obj) == "string"){
					obj = {name:obj,email:obj};
				}				
				var tr = '<tr class="MIB_linedot2" onmouseover="App.toggleClass(event,this,\'tr_bg1\')" onmouseout="App.toggleClass(event,this)">';				
				tr     += '<th><input  onclick="App.select(this,\''+type+'_out_select\',\''+type+'_out_user\')" type="checkbox" name="emails" value="'+obj.email+'" checked="checked"/></th>';
				
				/**
				tr     += '<th style="display:none"><input  onclick="App.select(this,\''+type+'_out_select\',\''+type+'_out_user\')" type="checkbox" name="emails" value="'+obj.email+'" checked="checked"/></th>';
				*/
				tr     += '<td>' + obj.name +' ' + (obj.name == obj.email?"":obj.email) +'</td>';
				tr     += '</tr>';
				return tr;
			}					
			if( type == "msn" || type == "mail"){
				var outStr = formatHTML(outArr,cb);	
				onFileOutSuccss(outStr,outArr);					
			}		
		 })();
		 
		 commanCB(inArr,outArr);
	}
	function invite(){
		if(oData = onCheckForm()){
			App.doRequest(oData,url,onInviteSuccss,onRequestFail);					
		}		
		return false;
	}	
	Core.Events.addEvent(invitebtn,invite,"click");
	App.enterSubmit({parent:$E(type+'_tab'),action:invite});
};

App.bindEvent = function(type,inArr,outArr){
	//显式第二步
	var showstep2 = function(){
		var showArr = ["showpanel",type+"_panel",type + "_step2"];
		if(outArr.length != 0){
			showArr.push(type +"_out_content");
		}else{		
			showArr.push(type +"_out_null");
		}
		var hiddenArr = ["controlpanel",type + "_step1","invite_Flist"];
		setStatus(showArr,hiddenArr);	
		location.hash = "top";	
	};
	
	//显式全部
	var showControl = function(){
		var showArr = ["controlpanel","invite_Flist"];
		var hiddenArr =["showpanel",type+"_panel",type + "_step2",type + "_step1",type +"_out_content",type +"_in_content"];
		setStatus(showArr,hiddenArr);
	};
	
	//跳过第一步
	var jump1 = function(){
		if(outArr.length == 0){
			showControl();		
		}else{
			showstep2();
		}
		document.documentElement.scrollTop = 0;
	};
	
	//跳过第二步
	var jump2 = function(){
		showControl();
		document.documentElement.scrollTop = 0;
		return false;
	};
	//*************************************第一步*************************************//
	//跳过第一步
	(function(){
		var jumpbtn1 = $E(type +"_in_jumpbtn");
		jumpbtn1.onclick = function(){
			jump1();
			return false;
		};
	})();
	
	//关注
	(function(){
		var focus = $E(type +"_in_btn");
		focus.onclick = function(){
			var posturl = "/invite/aj_att_addreqs.php";
			var param = App.htmlToJson($E(type +'_in_user'), ["input"]);
			if(!param.uids){
				$E(type +"_in_jumpbtn").onclick();
				return false;
			}
			App.doRequest(param,posturl,function(){				
				App.promptTip({code:"M00912"},'' , type +"_add_succ");				
				if($IE){
					location.hash = "top";
				}else{
					document.body.scrollIntoView();
				}		
				setTimeout(function(){					
					$E(type +"_in_jumpbtn").onclick();
				},3000);				
				
			},function(json){
				App.alert(json);
			});
			return false;
		}
	})();
	
	//全选1
	(function(){
		var select1 = $E(type +"_in_select");
		select1.onclick = function(){
			App.selectAll(select1,type +"_in_user");			
		}		
	})();
	
	//*************************************第一步*************************************//
	
	
	//*************************************第二步*************************************//
	//跳过2
	(function(){
		var jumbtn2 = $E(type +"_out_jump");
		if(jumbtn2){
			jumbtn2.onclick = function(){
				jump2();
				return false;
			};			
		}

	})();
	
	//全选
	(function(){
		var selectbtn2 = $E(type +"_out_select");	
		selectbtn2.onclick = function(){
			App.selectAll(selectbtn2,type + "_out_user");
		}
	})();
	
	
	var checkSenderName = function(type){
		$E(type + '_sender_name').value = Core.String.trim($E(type + '_sender_name').value);
		var lens = Core.String.byteLength($E(type + '_sender_name').value);
		if(lens > 20){
			$E(type + '_red_sender_name').style.display = '';
			$E(type + '_red_sender_name').innerHTML = $SYSMSG['R01422'];
			return false;
		}else{
			$E(type + '_red_sender_name').style.display = 'none';
			return true;
		}
	}
	try{
		$E('msn_sender_name').onblur = function(){
			checkSenderName('msn');
		};
		$E('mail_sender_name').onblur = function(){
			checkSenderName('mail');
		};	
	}catch(exp2){}
	//发送邀请
	(function(){
		var invitebt2 = $E(type +"_out_btn");
		if(invitebt2){
			invitebt2.onclick = function(){
				try {
					if (!checkSenderName(type)) {
						return false;
					}
				}catch(exp2){}
				var posturl = "/invite/aj_att_sendmails.php";				
				var param = App.htmlToJson($E(type +'_out_user'), ["input"]);
				if($E(type +'_sender_name')){
					param.nickName = $E(type +'_sender_name').value;
				}
				App.doRequest(param,posturl,function(json){
					App.promptTip({code:"M00913"},'' , type +"_out_succ");					
					if($IE){
						location.hash = "top";
					}else{
						document.body.scrollIntoView();
					}	
					setTimeout(function(){										
						jump2();
					},3000);				
				},function(json){
					if(json.code == 'R01421'){
						$E(type +'_red_sender_name').style.display = '';
						$E(type +'_red_sender_name').innerHTML = $SYSMSG[json.code];
					}else{
						App.alert(json);
					}
				});	
				return false;	
			}		
		}		
	})();
	
	//跳过
	(function(){
		var jumpbtn3 = $E(type +"_other_jumpbtn");
		jumpbtn3.onclick = function(){
			jump2();
			return false;
		};
	})();
	//***************************************第二步***************************************
};


$registJob("msn_invite",function(){		
	var url = "/invite/aj_msncontact.php";	
	var type    = "msn";
	var options = {
		url:url,
		type:type
	}
	App.inviteUser(options);
});

$registJob("friend_invite",function(){		
	var url = "/invite/aj_fricontact.php";	
	var type    = "friend";
	var invitebtn = $E(type +"_invitebtn"); 	
	var loadIcon= $E(type+"_load");
	
	var onCheckForm = function(){
		invitebtn.style.display = "none";
		loadIcon.style.display  = ""; 
		return true;
	}
	var options = {
		url:url,
		type:type,
		onCheckForm:onCheckForm
	}
	App.inviteUser(options);
});

$registJob("att_invite",function(){		
	var url = "/invite/aj_attcontact.php";	
	var type    = "att";
	var invitebtn = $E(type +"_invitebtn"); 	
	var loadIcon= $E(type+"_load");
	
	var onCheckForm = function(){
		invitebtn.style.display = "none";
		loadIcon.style.display  = ""; 
		return true;
	}
	var options = {
		url:url,
		type:type,
		onCheckForm:onCheckForm
	}
	App.inviteUser(options);
});

$registJob("mail_invite",function(){		
	var url = "/invite/aj_mailcontact.php";	
	var type    = "mail";
	var invitebtn = $E(type +"_invitebtn"); 	
	var loadIcon= $E(type+"_load");
	var err = $E("mail_tab_err");
	var onCheckForm = function(){
		var oData = App.htmlToJson($E('mail_tab'), ["input","select"]);
		var emails = {"0":"sina.com","1":"tom.com","2":"gmail.com","3":"163.com","4":"126.com","5":"sohu.com"};
		if(!App.checkEml(oData.user + "@" + emails[oData.type])){						
			err.style.display = "";
			err.innerHTML     = $CLTMSG['CX0074'];
			return false;
		}
		if(!oData.password){
			err.style.display = "";
			err.innerHTML     = $CLTMSG['CX0075'];
			return false;
		}
		invitebtn.parentNode.parentNode.style.display = "none";
		loadIcon.style.display  = ""; 
		err.style.display = "none";
		return oData;
	}
	var options = {
		url:url,
		type:type,
		onCheckForm:onCheckForm
	}
	App.inviteUser(options);
});

/**
 * 全选或者全不选
 * @param {Object} selectbtn
 * @param {Object} content
 */
App.selectAll = function(selectbtn,content){
	selectbtn = $E(selectbtn);
	content   = $E(content);
	var els = content.getElementsByTagName("input");
	for(var i = 0,len = els.length;i<len;i++){
		var el = els[i];
		if(el && el.type == "checkbox"){
			el.checked = selectbtn.checked;
		}
	}
};
/**
 * 选择一个元素
 * @param {Object} el
 * @param {Object} checkbox
 * @param {Object} wrap
 */
App.select = function(el,checkbox,wrap){
	el       = $E(el);
	checkbox = $E(checkbox);
	wrap     = $E(wrap);
	if(!el.checked){
		checkbox.checked = false;
		return false;
	}
	var els = wrap.getElementsByTagName("input");
	for(var i = 0,len = els.length;i<len;i++){
		if(els[i].getAttribute('type') == 'checkbox'){
			if( !els[i].checked ){
				checkbox.checked = false;
				return;
			}
		}
	}
	checkbox.checked = true;
}

/**
 * 显示鼠标样式
 * @param {Object} el
 * @param {Object} show
 */
App.toggleClass = function(event,el,cls){
	cls = cls|| "tr_bg1";
	if(event.type == "mouseover"){
		el.className = cls;
	}
	if(event.type == "mouseout"){
		el.className = "MIB_linedot2";
	}
}
/**
 * 设置邮件
 * @param {Object} hostnum
 */
App.setMailHost = function(hostnum, curdom){
	/**
	 * 0 新浪
	 * 1 tom
	 * 2 gmail
	 * 3 163
	 * 4 126
	 * 5 sohu	 
	 */
	var selected = $E("emailHost");
	selected.selectedIndex = hostnum;
	//改变样式
	var _li = curdom.parentNode.parentNode.getElementsByTagName("LI");
	for(var i=0;i<_li.length;i++){
		_li[i].className = "";
	}
	curdom.parentNode.className = "cur";
	return false;
};

/**
 * 格式化关注用户
 * @param {Object} msnatt
 * @param {Object} content
 */
App.formatAttUser = function(msnatt,content){
	if(msnatt.length != 0){
		var attArr = ['<div class="UserList">'];
		attArr.push('<ul>');
		for(var i=0,len = msnatt.length;i<len; i++){
			var obj = msnatt[i];
			var img = obj.icon?'<a href="/'+obj.uid+'"><img class="photo" src="' + obj.icon +'"/></a>':'';
			var li  = '<li>' + img + '<span class="uName"><a href="/'+obj.uid+'">' + obj.name + '</a></span></li>';
			attArr.push(li);
		}
		attArr.push('<ul>');
		attArr.push('</div>');
		attArr.push('<div class="clear"/>');										
		content.innerHTML = attArr.join("");
	}
}

//显示类
window.setStatus = function(showArr,hiddenArr,hiddenhash){
	showArr   = showArr||[];
	hiddenArr = hiddenArr||[];
	for(var i =0,len = showArr.length;i<len;i++){
		var show = $E(showArr[i]);
		show && (show.style.display ="");
	}	
	for(var i =0,len = hiddenArr.length;i<len;i++){
		var hidden = $E(hiddenArr[i]);
		hidden && (hidden.style.display ="none");
	}
};

App.toggleAtt = function(type,hidden){
	var el  = $E(type + "_att_user");
	var img = $E(type + '_att_icon'); 
	if(hidden || el.style.display != "none"){
		el.style.display = "none";
		img.className = "small_icon msn_att_icon";
	}else{
		if(el.style.display == "none"){
			el.style.display = "";
			img.className = "small_icon cls";
		}
	}	
};

App.toggleTable = function(el){
	var next = el.nextSibling;
	while(next){
		if(next.tagName  && next.tagName.toLowerCase() == "table"){
			break;
		}
		next = next.nextSibling;
	}
	if(next){
		if(next.style.display != "none"){
			next.style.display = "none";
		}else{
			next.style.display = "";
		}
	}
};
