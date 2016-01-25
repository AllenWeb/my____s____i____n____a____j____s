/**
 * @author wangliang3@staff.sina.com.cn
 */
//import API
$import("diy/dom.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
//ajax
$import("sina/utils/io/ajax.js");
//import comm function
$import("jobs/activity/validate.js");
$import("diy/dialog.js");
$import("diy/builder2.js");
$import("jobs/activity/widget.js");
//转发
$import("jobs/base.js");
$import("jobs/request.js");
$import("diy/mb_dialog.js");
$import("sina/core/string/leftB.js");
$import("sina/core/events/fireEvent.js");
$import("sina/utils/sinput/sinput.js");
$import("sina/core/function/bind2.js");
$import("diy/enter.js");
$import("diy/loginAction.js");
$import("diy/flyout.js");
$import("diy/timer.js");
$import("jobs/refurbishNumber.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/getTextAreaHeight.js");
$import("sina/core/string/byteLength.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/BindAtToTextarea.js");
$import("sina/core/events/stopEvent.js");
$import('diy.rollOut');
/**
 * job actInfo dom 依赖
 * 自定义属性 act : value('join','unjoin','int','unint')
 */
$registJob('actInfo', function(){
	var events = Core.Events, cdom = Core.Dom, adom = App.Dom;
	var config = {
		mod : $E('activity_info'),
		eid : scope.$eid,
		actAtt : 'act',
        postUrl : '/event/aj_join.php',
		popId : 'activity_applayer',
		popBodyID : 'activity_applayer_bd',
		btnClass : 'actBtn', 
		btnClass2 : 'actBtn actBtn_white',
		privacy: scope.$privacy,
		//判断是否需要输入手机号码   modify by xiongping
		phoneNeed:scope.$phoneNeed,
		bindPhone:scope.$bindPhone,
		username :scope.$username
		//userPhone : scope.$userPhone
		/*privacy: "1",
		phoneNeed:'1',
		bindPhone:'111',
		username :"熊平"*/
    };
	var items = {
		joinnum : $E('activity_join_num'),
		intnum : $E('activity_join_int')
	};
	var build;
	var ids = {};
	var handler = {
		init : function(){
			if(!config.mod){ return; }
			App.Dom.getBy(function(el){
				var type = el.getAttribute(config.actAtt);
				if(type != null){
					items[type] = el;//动态添加abtn到items
					events.addEvent(el,handler.btnClick);
				}
			},'a',config.mod);
			if($E("event_print")){
				events.addEvent($E("event_print"),handler.printMember);
			}
		},
		initDialog : function(pars){
			var conf = {
				id : config.popId,
		        width : 430,
		        zIndex : 1000,
		        hidden : true
		    };
			var html = '<div id="'+config.popBodyID+'"style="padding:10px 20px 20px;"></div>';
			//modify by xiongping
			var dialogTitle;
			if(config.privacy == '1'){
				dialogTitle = $CLTMSG['E00004'];
			}else{
				dialogTitle = $CLTMSG['E00003'];
			}
			var dialog = new App.Dialog.BasicDialog(dialogTitle, html, conf);
			handler.buildDialogItems(dialog,pars);
			/*if(config.userPhone != '' && config.phoneNeed == '1' && config.bindPhone == ''){
				build.domList[ids.phone].value = config.userPhone;
				build.domList[ids.phone].style.color = "#000";
			}*/
			//解决因为出现错误信息而致使按钮移位的情况
			/*if(config.privacy == '1' && config.phoneNeed == '1'){
				build.domList[ids.contentDiv].style.height = "260px";
			}else if(config.privacy == '1' && config.phoneNeed != '1'){
				build.domList[ids.contentDiv].style.height = "130px";
			}*/
			return dialog;
		},
		buildDialogItems : function(dialog,json){
			ids = {
				'app' : 'app',
				'tip' : 'tip',
				'submit' : 'submit',
				'cancel' : 'cancel',
				'phone'  : 'phone',
				'phonetip' : 'phonetip',
				'changePhone':'changePhone',
				'phoneArea' : 'phoneArea',
				'phone_detail':'phone_detail',
				'contentDiv':'contentDiv'
			};
			var pars ={};
			// modify by xiongping
			if (config.privacy != '1' && config.phoneNeed == '1') {
				if (config.bindPhone != '') {
					pars['template'] = '<div class="writeM2"><div id="phoneArea"><h3><b>Hi，' + config.username + '</b></h3>';
					pars['template'] += '<p>'+$CLTMSG['E00005'].replace(/#\{phone\}/,config.bindPhone)+'</p></div>';
					pars['template'] += '<p id="phone_detail" class="p_2">'+$CLTMSG['E00001']+'</p>';
					pars['template'] += '<p class="btn"><a class="newabtngrn" id="' + ids.submit + '"  act="' + json.type + '" href="#"><em>确定</em></a><a href="javascript:void(0)"  id="changePhone">'+$CLTMSG['E00006']+'</a></p></div>';
				}
				else {
					pars['template'] = '<div class="writeM"><div class="writeMInput"><span class="must">*</span><input id="' + ids.phone + '" type="text" value="请输入手机号码..." style="color:#CCC;ime-mode:Disabled" class="PY_input"/><a class="newabtngrn" href="#" id="' + ids.submit + '"  act="' + json.type + '"><em>确定</em></a><a id="' + ids.cancel + '" href="#">取消</a>';
					pars['template'] += '<p id="' + ids.phonetip + '" class="errorTs yellow2"></p>';
					pars['template'] += '<div class="conbox p_2"  id="phone_detail">'+$CLTMSG['E00001']+'</div></div>';
				}
			}
			else {
				pars['template'] = '<div class="writeM3"><div id="contentDiv"><p>'+$CLTMSG['E00002']+'</p>';
				pars['template'] += '<span class="must">*</span><textarea id="' + ids.app + '" class="texta"></textarea>';
				pars['template'] += '<p id="' + ids.tip + '" class="errorTs yellow2"></p>';
				if (config.phoneNeed == 1) {
					pars['template'] += '<h3 class="top_20"><b>'+$CLTMSG['E00003']+'</b></h3>';
					//有绑定手机号码的情况下
					if (config.bindPhone != '') {
						pars['template'] += '<div id="phoneArea"><h3><b>Hi，'+config.username+'</b></h3>';
						pars['template'] += '<p>'+$CLTMSG['E00005'].replace(/#\{phone\}/,config.bindPhone)+'<a id="changePhone" href="javascript:void(0)" class="bold">['+$CLTMSG['E00006']+']</a></p></div>';
					}
					else {
						pars['template'] += '<p><span class="must">*</span><input id="' + ids.phone + '" value="请输入手机号码..." style="color:#CCC;ime-mode:Disabled" class="PY_input" /></p>';
						pars['template'] += '<p class="errorTs yellow2" id="' + ids.phonetip + '"></p>';
					}
					pars['template'] += '<p id="phone_detail" class="p_2">'+$CLTMSG['E00001']+'</p>';
				}
				pars['template'] += '</div><p class="btn"><a id="' + ids.submit + '"  act="' + json.type + '" class="newabtngrn" href="#"><em>确定</em></a><a href="#"  id="' + ids.cancel + '">取消</a></p></div>'
			}
			pars['box']=$E(config.popBodyID);
			build = App.builder2(pars);
			
			var layFun = {
				changePhone : function(){
					scope.$phoneChanged = 1;
					build.domList[ids.phoneArea].innerHTML = '<span class="must">*</span><input id="phone" style="color:#CCC;ime-mode:Disabled" value="请输入手机号码..." />';
					build.domList[ids.phoneArea].innerHTML+= '<p class="errorTs yellow2" style="display:none" id="phonetip"></p>';
					events.addEvent($E('phone'),layFun.checkPhone,'blur');
					events.addEvent($E('phone'),layFun.focusFun,'focus');
					//$E('phone').focus();
				},
				changePhone2 : function(){
					scope.$phoneChanged = 1;
					var str = '';
					str = '<div class="writeM"><div class="writeMInput"><span class="must">*</span><input id="' + ids.phone + '" type="text" value="请输入手机号码..." style="color:#CCC;ime-mode:Disabled" class="PY_input"/><a class="newabtngrn" href="#" id="' + ids.submit + '"  act="' + json.type + '"><em>确定</em></a><a id="' + ids.cancel + '" href="#">取消</a>';
					str += '<p id="' + ids.phonetip + '" class="errorTs yellow2"></p>';
					str += '<div class="p_2"  id="phone_detail">'+$CLTMSG['E00001']+'</div></div>';
					$E(config.popBodyID).innerHTML = str;
					events.addEvent($E('phone'),layFun.checkPhone,'blur');
					events.addEvent($E('phone'),layFun.focusFun,'focus');
					events.addEvent($E('cancel'),layFun.cancel);
					events.addEvent($E('submit'),layFun.submit);
					//$E('phone').focus();
				},
				cancel : function(){
					events.stopEvent();
					dialog.distory();
					scope.$phoneChanged = 0;
				},
				checkInput : function(){
					var isOk = false;
					if(App.Validate.isEmpty(build.domList[ids.app].value)){
						build.domList[ids.tip].style.display = '';
						build.domList[ids.tip].innerHTML = App.getMsg('E00006');
					}else{
						isOk = true;
						build.domList[ids.tip].innerHTML = '';
						build.domList[ids.tip].style.display = 'none';
					}
					return isOk;
				},
				/*
				 * 增加参与者手机号码输入
				 * Add By xiongping1@staff.sina.com.cn
				 */
				focusFun : function(){
					if (scope.$phoneChanged == 1) {
						var phoneNum = $E('phone').value;
						$E('phone').style.color = "#000"
						if(phoneNum == "请输入手机号码..."){
							$E('phone').value = "";
						}
						return;
					}
					var phoneNum = build.domList[ids.phone].value;
					build.domList[ids.phone].style.color = "#000";
					if(phoneNum == "请输入手机号码..."){
						build.domList[ids.phone].value = "";
						return;
					}
				},
				checkPhone : function(){
					var isOk = false;
					if(scope.$phoneChanged == 1){
						var phoneNum = $E('phone').value;
						if(App.Validate.isEmpty(phoneNum) || phoneNum == "请输入手机号码..."){
							$E('phonetip').style.display = '';
							$E('phonetip').innerHTML = App.getMsg("E00020");
							//build.domList[ids.phone_detail].style.display = "none"
						}else if(!/^1[3,5,8]{1}[0-9]{1}[0-9]{8}$/.test(phoneNum)){
							$E('phonetip').style.display = '';
							$E('phonetip').innerHTML = App.getMsg("E00021");
							//build.domList[ids.phone_detail].style.display = "none"
						}else{
							isOk = true;
							$E('phonetip').innerHTML = '';
							$E('phonetip').style.display = "none";
						}
						return isOk;
					}
					var phoneNum = build.domList[ids.phone].value;
					if(App.Validate.isEmpty(phoneNum) || phoneNum == "请输入手机号码..."){
						build.domList[ids.phonetip].style.display = '';
						build.domList[ids.phonetip].innerHTML = App.getMsg("E00020");
						//build.domList[ids.phone_detail].style.display = "none"
					}else if(!/^1[3,5,8]{1}[0-9]{1}[0-9]{8}$/.test(phoneNum)){
						build.domList[ids.phonetip].style.display = '';
						build.domList[ids.phonetip].innerHTML = App.getMsg("E00021");
						//build.domList[ids.phone_detail].style.display = "none"
					}else{
						isOk = true;
						build.domList[ids.phonetip].innerHTML = '';
						build.domList[ids.phonetip].style.display = 'none';
					}
					return isOk;
				},
				submit : function(){
					events.stopEvent();
					if(config.privacy == '1'){
						if(!layFun.checkInput()){
							return;
						}
					}
					if(config.phoneNeed == "1"){ //需要手机号码的时候
						if (config.bindPhone != '' && scope.$phoneChanged == 1) {
							//scope.$inputPhone = $E('phone').value;
							if (!layFun.checkPhone()) {
								return;
							}
						} else if(config.bindPhone == '' && config.phoneNeed == '1'){
							//scope.$inputPhone = build.domList[ids.phone].value;
							if (!layFun.checkPhone()) {
								return;
							}
						}
					}
					var json = {}
					if(config.phoneNeed == '1' && config.privacy != '1'){
						json = {
							type: build.domList[ids.submit].getAttribute(config.actAtt),
							eid: config.eid,
							apptext : '',
							needPhone : scope.$phoneNeed
						}
					}else{
						json = {
							type: build.domList[ids.submit].getAttribute(config.actAtt),
							eid: config.eid,
							apptext : build.domList[ids.app].value,
							needPhone : scope.$phoneNeed
						}
					}
					//发送手机号码  modify by xiongping
					if(config.phoneNeed == '1'){
						if(config.bindPhone && scope.$phoneChanged == 1){ //已绑定，同时更改了手机号码
							json.phone = $E('phone').value;
						}else if(config.bindPhone && !scope.$phoneChanged){ //已绑定，同时未进行更改
						}else{  
							json.phone = build.domList[ids.phone].value;
						}
					}
					var callBack = function(data){
						if (data.code == 'A00006' || data.code == 'E00014') {
							scope.$phoneChanged = 0;
							dialog.distory();
							var tip = App.alert('申请成功',{icon:3,hasBtn:false});
							
							var timer = $IE?1500:1000;
							
							setTimeout(function(){
								handler.countViewNum(data.type);
								handler.buildTip(items['join'],json.type)
					            tip.distory();
								if (data.code == 'A00006') {
									//config.userPhone = scope.$inputPhone;
									App.act_recommend();
								}
					        }, timer);
						}else{
							var tip = App.alert($SYSMSG[data.code]);
						}
						return false;
						
					};
					handler.ajaxPost(items['join'],json,callBack);
				}
			};
			events.addEvent(build.domList[ids.submit],layFun.submit);
			events.addEvent(build.domList[ids.cancel],layFun.cancel);
			events.addEvent(build.domList[ids.app],layFun.checkInput,'blur');
			events.addEvent(build.domList[ids.phone],layFun.checkPhone,'blur');
			if(config.privacy != "1"){
				events.addEvent(build.domList[ids.changePhone],layFun.changePhone2);
			}else{
				events.addEvent(build.domList[ids.changePhone],layFun.changePhone);
			}
			events.addEvent(dialog._btn_close,function(){scope.$phoneChanged=0},"click");
			events.addEvent(build.domList[ids.phone],layFun.focusFun,'focus');
		},
		btnClick :function(){
			events.stopEvent();
			var obj = events.getEventTarget();
			if(obj.tagName.toLowerCase()=='em'){
				obj = obj.parentNode;
			}
			var type = obj.getAttribute(config.actAtt);
			
			var json = {
				type: type,
				eid: config.eid
			};
			if(type == 'join'){
				if(config.privacy == '1' || config.phoneNeed == '1'){
					var oDialog = handler.initDialog({type:type});
					oDialog.show();
				}else{
					handler.ajaxPost(obj,json);
					App.act_recommend();
				}
			}else{
				handler.ajaxPost(obj,json);
			}
		},
		buildTip : function(obj,act){
			var isjoin = /\join/.test(act);
			var type = 'un'+act;
			var parent = obj.parentNode.parentNode;
			parent.removeChild(obj.parentNode);
			
			var str = {
				unjoin : {
					0 : '我对这个活动感兴趣',
					1 : '[不感兴趣了]',
					2 : '[我要参加]'
				},
				unint : {
					0 : '我已参加这个活动',
					1 : '[不参加了]'
				},
				privacy : {
					0 : '我已申请参加这个活动',
					1 : '[取消申请]'
				}
			};
			
			var tmp = (config.privacy==1&&type=='unjoin')?str.privacy:(isjoin?str.unint:str.unjoin);
			var html = [],
				shortJion = 'join';//扩展用户感兴趣时直接加入活动的快捷按钮
			html.push('<span class="amc_txt">');
			html.push(tmp[0]);
			if(act=='int'){
				html.push('<a id="'+shortJion+'" href="#" act="'+shortJion+'">'+tmp[2]+'</a>');
			}
			html.push('<a id="'+type+'" href="#" act="'+type+'">'+tmp[1]+'</a>');
			html.push('</span>');
			
			var pars = {
				'template' : html.join(''),
				'box' : parent
			};
			var newObj = App.builder2(pars);
			items[type] = newObj.domList[type];
			events.addEvent(items[type],handler.btnClick);
			if (act == 'int') {
				items[shortJion] = newObj.domList[shortJion];
				items[shortJion].setAttribute('tip',shortJion);
				events.addEvent(items[shortJion],handler.btnClick);
			}
		},
		buildBtn : function(obj,type){
			var parent = obj.parentNode.parentNode;
			parent.removeChild(obj.parentNode);
			var ids = {
				'iact' : 'int',
				'jact' : 'join'
			};
			
			var pars = {
				'template' : '<div class="amc_btn"><a privacy="'+config.privacy+'" class="'+config.btnClass+'" href="#" act="'+ids.jact+'" id="'+ids.jact+'"><em>我要参加</em></a><a class="'+config.btnClass2+'" href="#" act="'+ids.iact+'" id="'+ids.iact+'"><em>我感兴趣</em></a></div>',
				'box' : parent
			};
			var newObj = App.builder2(pars);
			items[ids.iact] = newObj.domList[ids.iact];
			items[ids.jact] = newObj.domList[ids.jact];
			
			events.addEvent(items[ids.iact],handler.btnClick);
			events.addEvent(items[ids.jact],handler.btnClick);
			
		},
		refreshBtn : function(obj,num,type){
			if(/^\un\w/.test(type)){
				handler.buildBtn(obj,type);
			}else{
				handler.buildTip(obj,type);
			}
		},
		callBack : function(json,func){
			func = func == undefined ? function(){return true;} : func;
			if(!func(json)){return;}
			if(json.code == 'A00006' || json.code == 'E00014'){
				var obj = items[json.type];
				var num =/^\un\w/.test(json.type) ? -1 : 1;
				handler.countViewNum(json.type);
				handler.refreshBtn(obj,num,json.type);
			}else{
				App.alert($SYSMSG[json.code]);
			}

		},
		ajaxPost : function(obj,json,func){
			json = json == undefined ? {} : json;
			var callControl = function(json){
				if(!json && !json.type){return;}
				handler.callBack(json,func);
			};
			Utils.Io.Ajax.request(config.postUrl, {
                'POST': json,
                'onComplete': function(json){
                    if(json){
						callControl(json);
					}
                },
                'onException': function(){
                    //callBack.error();
                },
                'returnType': 'json'
            });
		},
		countViewNum : function(type){
			var obj = /\join/.test(type) ? items['joinnum'] : items['intnum'];
			var count =/^\un\w/.test(type) ? -1 : 1;
			count = parseInt(obj.innerHTML)+ count;
			obj.innerHTML = count >= 0 ? count : 0;
			if(type == 'join' && items[type].getAttribute('tip') && items[type].getAttribute('tip') == 'join'){
				count = parseInt(items['intnum'].innerHTML)+ -1;
				items['intnum'].innerHTML = count >= 0 ? count : 0;
			}
		},
		printMember:function(){
			Utils.Io.Ajax.request("/event/event_print.php",{
				'POST'       :{eid:config.eid},
				'onComplete' :function(json){
					if(json.code == "A00006"){
						var iframe=document.createElement('IFRAME');
						var doc=null;
						iframe.setAttribute('style','position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
						document.body.appendChild(iframe);
						doc=iframe.contentWindow.document;
						doc.write(json.data.html);
						doc.close();
						//alert(iframe.contentWindow.document.body.innerHTML);
						iframe.contentWindow.focus();
						iframe.contentWindow.print();
						if(navigator.userAgent.indexOf("MSIE")>0) {
							document.body.removeChild(iframe);
						}
					}
				},
				'onException':function(){
					
				},
				'returnType' :'json'
			})
		}
	};
	//page init
	handler.init();
});
App.ModForward = function(fid, content, uid, el, exid, forwardName, forwardContent, uname,callback){
	Core.Events.stopEvent(); //阻止默认事件
	
	//var _countTime = 0; //用于统计时间的变量
    if (scope.$cuser_status === 'nofull' && scope.$uid !== '') {
        App.finishInformation();
        return false;
    }
    if (uid === scope.$uid) {
        App.alert($CLTMSG["CD0024"]);
        return false;
    }
    var checkAT = function(content, name){
        if ((new RegExp('(@|＠)' + name + '([^a-zA-Z0-9\u4e00-\u9fa5_]|$)')).test(content)) {
            return true;
        }
        else {
            return false;
        }
        
    };
    //var regurl     = "/reg.php?inviteCode=" + (scope.$inviteCode?scope.$inviteCode:""); //版本回滚使用
    var defaultTxt = $CLTMSG["CD0025"];
    var forwardContentFinal = '';
    var testForwardName = decodeURIComponent(forwardName);
    var testForwardContent = decodeURIComponent(forwardContent);
    var testForwardUName = decodeURIComponent(uname);
    if (forwardContent === '' || forwardContent === undefined) {
        forwardContentFinal = defaultTxt;
    }
    else {
        //		if(!checkAT(testForwardContent,testForwardName)){
        //		ModForward	forwardContentFinal += ('@' + testForwardName + ' ');
        //		}
        //forwardContentFinal += (testForwardContent +' //');
        //if(!checkAT(testForwardContent,testForwardUName)){
        //forwardContentFinal += ('@' + uname + ' ');
        //}
        forwardContentFinal = ' //@' + testForwardName + ':' + testForwardContent;
    }
    var title = $CLTMSG["CD0026"];
    var loginStr = '<div class="shareLogin">\
                    	<div id="loginerror_' + fid + '"></div>\
						<em>'+ $CLTMSG['CD0027'] + '</em>\
                        <span class="cInputBorder"><span class="cInputborderR"><input type="text" id="logintitle_' +
    fid +
    '" class="inputType"  style="width: 100px;"/></span></span>\
                        <em>&nbsp&nbsp&nbsp&nbsp' + $CLTMSG['CD0028'] + ' </em>\
                        <span class="cInputBorder"><span class="cInputborderR"><input type="password" id="loginpwd_' +
    fid +
    '" class="inputType" style="width: 100px;"/></span></span>\
                    	<div class="clearit"></div>\
                    </div>';
    loginStr = scope.$uid ? "" : loginStr;
    //
    if (el) {
        var lastForwarderName = el.getAttribute("lastforwardername");
        var initBlogerName = el.getAttribute("initblogername");
    }
    var aComment = [];
    aComment.push('<div class="selSend">');
    if (lastForwarderName) {
        aComment.push('<p><label for="lastForwarder_' + fid + '"><input type="checkbox" class="labelbox" id="lastForwarder_' + fid + '" />' + $CLTMSG['CD0029'].replace(/#\{forwarder\}/g,lastForwarderName) + '</label></p>')
    }
    if (initBlogerName && initBlogerName != lastForwarderName) {
        aComment.push('<p><label for="initBloger_' + fid + '"><input type="checkbox" class="labelbox" id="initBloger_' + fid + '" />' + $CLTMSG['CD0030'].replace(/#\{bloger\}/g,initBlogerName)  + '</label></p>');
    }
    aComment.push(' </div>');
    var html = '\
			<div class="shareLayer" id="forwardcontent_' + fid + '">\
				<div class="zok" id="modforwardsucess_' + fid + '" style="display:none"></div>\
				<div id="mdforwardinputarea_' + fid + '">\
				<div class="turnToTxt" id="sharecontent_' + fid + '">' + $CLTMSG['CD0031'] + decodeURIComponent(content) + '</div>\
				<div class="clearit"></div>\
				<div style="margin-top:5px;">\
					<div class="lf">\
						<a onclick="App.showFaces(this,$E(\'mdforwardtextarea_' + fid + '\'),-12,5);" title="'+ $CLTMSG["CD0032"]+ '" href="javascript:void(0);" class="faceicon1"></a>\
					</div>\
				</div>\
				<div id="tipInfoBox' + fid + '" style="float:right;margin-right:13px;color:#008800"></div>\
				<textarea class="PY_textarea" id="mdforwardtextarea_' + fid + '">' + forwardContentFinal + '</textarea>' + loginStr + aComment.join(" ") +
				'<div class="MIB_btn"><a href="javascript:void(0);" id="mdforwardbtn_' + fid + '" class="btn_normal"><em>' + $CLTMSG['CD0023'] + '</em></a><a href="javascript:void(0)" id="mdforwardcancel_' + fid + '" class="btn_notclick"><em>' + $CLTMSG['CD0005']+ '</em></a></div>\
				</div>\
			</div>\
		';
    var cfg = {
        width: 390,
        zIndex: 1000
//        hidden: true
    };
    var dialog = new App.Dialog.BasicDialog(title, html, cfg);
	//给转发层植入成功标签
	dialog._success = function(_cb){
//		$E('mdforwardinputarea_' + fid).style.display = 'none';
//		$E('modforwardsucess_' + fid).style.display = '';
//		$E('modforwardsucess_' + fid).innerHTML = '<img align="absmiddle" src="http://tjs.sjs.sinajs.cn/' + scope.$PRODUCT_NAME + 'style/images/common/transparent.gif" class="PY_ib PY_ib_3"> ' + $CLTMSG["CD0035"];
		dialog.close();
		var tipMsg = new App.alert($CLTMSG["CD0035"], {
			icon: 3,
			hasBtn: false
		});
		setTimeout(function(){
//			$E('mdforwardinputarea_' + fid).style.display = '';
//			$E('modforwardsucess_' + fid).style.display = 'none';
			tipMsg.close();
			_cb();
		}, 1000);
	};
	
    var mdforwardtextarea = $E("mdforwardtextarea_" + fid);
    //Utils.Sinput.limitMaxLen(mdforwardtextarea,maxlen);
    var tipStringOK = $CLTMSG['CD0033'];
    var tipStringErr = $CLTMSG['CD0034'];
    var forwardInputLimit = function(){
        var num = Math.ceil(Core.String.byteLength(Core.String.trim(mdforwardtextarea.value)) / 2);
        if($E('tipInfoBox' + fid)){
        	if (num > 140) {
	            $E('tipInfoBox' + fid).innerHTML = tipStringErr.replace(/\$\{num\}/, (maxlen / 2 - num) * (-1));
	            $E('tipInfoBox' + fid).style.color = '#880000';
	            return false;
	        }
	        else {
	            $E('tipInfoBox' + fid).innerHTML = tipStringOK.replace(/\$\{num\}/, (maxlen / 2 - num));
	            $E('tipInfoBox' + fid).style.color = '#008800';
	            return true;
	        }
        }
        
    };
    if (el) {
		try {
			setTimeout(function(){
				$E("mdforwardtextarea_" + fid).focus();
				if (!$IE) {
					$E("mdforwardtextarea_" + fid).setSelectionRange(0, 0);
				}
				forwardInputLimit();	
			},100);
			
		} 
		catch (e) {
		}
    }
    else {
        dialog.show();
        $E("mdforwardtextarea_" + fid).focus();
        if (!$IE) {
			$E("mdforwardtextarea_" + fid).setSelectionRange(0, 0);
        }
        setTimeout(forwardInputLimit, 1);
    }
    var url = "/mblog/forward.php";
	if(scope.$eid){
		url = "/event/aj_forward.php";
	}
    var mdforwardbtn = $E("mdforwardbtn_" + fid);
    var maxlen = 280;
    App.BindAtToTextarea(mdforwardtextarea, {"borderWidth":"1px","fontSize":"12px"});
    App.autoHeightTextArea(mdforwardtextarea, function(){
        setTimeout(forwardInputLimit, 1);
    }, 145);
    var loginerror = $E("loginerror_" + fid);
	//modify by chibin 2009-12-1
    var disClass = "btn_notclick";
    var enableClass = "btn_normal";
    
    var name = $E("logintitle_" + fid);
    var pwd = $E("loginpwd_" + fid);
    
    var options = {
        zIndex: 1010,
        ref: name,
        wrap: loginerror,
        offsetY: -1,
        offsetX: 30
    };
    
    mdforwardtextarea.onfocus = function(){
        if (mdforwardtextarea.value === defaultTxt) {
            mdforwardtextarea.value = "";
        }
    };
    
    mdforwardtextarea.onblur = function(){
        if (mdforwardtextarea.value === "") {
            mdforwardtextarea.value = defaultTxt;
        }
    };
    
    mdforwardtextarea.onkeydown = function(event){
        event = event || window.event;
        if (event.keyCode === 13 && event.ctrlKey) {
            mdforwardbtn.onclick();
        }
    };
    
    $E("mdforwardcancel_" + fid).onclick = function(){
        dialog.close();
        return false;
    };
    
    function forwardSuccess(){
        var reason = mdforwardtextarea.value = Core.String.leftB(mdforwardtextarea.value, maxlen);
        if (reason === defaultTxt) {
            reason = "";
        }
        var postdata = {
            'reason': reason.replace(/\uff20/ig, '@'),
            'mid': fid,
			'styleid'	: scope['styleid'],
			'retcode' : scope.doorretcode||""
        };
		if(scope.$eid){
			postdata.eid = scope.$eid;
		}
		scope.doorretcode = "";
        if (scope.$pageid === "search") {
            postdata.from = 'search';
        }
        if ((scope.$pageid === "myprofile" || scope.$pageid === "search") && scope.$feedtype !== "isori") {
            postdata.isindex = 1;
        }
        var cb = function(data, json){
            //转发时如果进评论,则评论数量+1
            if (postdata.isLast) {
                var comments = $E("_comment_count_miniblog2_" + fid);
//                if (comments && comments.getElementsByTagName("strong").length < 0) {
//                    comments.innerHTML = comments.innerHTML + "<strong>(1)</strong>";
//                }
//                else {
//                    var connter = $E("_comment_count_miniblog2_" + fid).getElementsByTagName("strong")[0];
//                    if (connter) {
//                        var count = parseInt(connter.innerHTML.replace(/\(|\)/g, ""));
//                        count = isNaN(count)? 1 : count+1;
//                        connter.innerHTML = "(" + count + ")";
//                    }
//                }
				if(!comments){return}
				var s = comments.getElementsByTagName("strong");
				if(s && (s = s[1])){
					var count = s.innerHTML;
					count = parseInt(count.match(/(\d+)/));
					count = ((count+"")=="NaN"?0:count)
					count = Math.max((count+1),0);
					s.innerHTML = "";
					count && (s.innerHTML = ["(", count, ")"].join(""));
				}
            }
            
			//提交成功后提示层完成时调用的函数
			var _afterSuccesscallback = function(){
				if (!scope.$uid) {
					location.reload();
				}
				if(typeof callback === "function"){
					//now I only need the el,if you need more ,you can add more.
					callback(el);
				}
				//假写数据
				var feedlist = $E("feed_list");
				if(feedlist){
					var feedBox = document.createElement('UL');
					feedBox.innerHTML = data.html;
					
					// 对内容作展示和绑定
					try{
						App.bindMedia(feedBox);
					}catch(e){
						//console.log(e);
					}

					if(App.refurbishUpdate){
						App.refurbishUpdate.add(1);
					}
					
					var $d = window.document, $e = $d["documentElement"]||{};
					var $t = function(){
						if(arguments.length > 0){
							$e.scrollTop = arguments[0];
							$d["body"].scrollTop = arguments[0];
							return;
						}
						return (window.pageYOffset||Math.max($e.scrollTop, $d["body"].scrollTop));
					};

					var feedList = $E('feed_list');
					setTimeout(function(){
						var newFeed = feedBox.getElementsByTagName('li')[0];
						var tagFeed = feedList.getElementsByTagName('li')[0];
						
						if(scope.$eid){
							var betops = App.Dom.getByClass('betop','img',feedList);
							var len = betops.length;
							if(len>0){
								var tmp = betops[len-1];
								while(!App.Dom.hasClass(tmp,'MIB_linedot_l')){
									tmp = tmp.parentNode;
								}
								tagFeed = tmp.nextSibling;
							}
						}
						if(tagFeed){
							feedList.insertBefore(newFeed, tagFeed);
						}else{
							feedList.appendChild(newFeed);
						}
						
						//滑动出现
						newFeed.style.display = 'none';
						App.rollOut(newFeed);
					}, 1500);
				}
			};
			
			dialog._success(_afterSuccesscallback);
			
            var num = $E(exid);
            if (num) {
                var count = num.innerHTML.match(/\d+/) || 0;
                num.innerHTML = '(' + (parseInt(count) + 1) + ")";
                num.style.display = "";
            }
        };
        var ecb = function(json){
			mdforwardbtn.className = enableClass;
			if(json && typeof json === "string" && json.indexOf("error")>0){
				App.alert($CLTMSG["CD0036"]);
				return false;
			}
			//需要验证码
			if(json.code === "MR0050"){
				mdforwardbtn.className = enableClass;
				App.forbidrefresh(function(){
					Core.Events.fireEvent(mdforwardbtn,"click");
				},url);
				
				return false;
			}
			if(json === $CLTMSG['CD0037']){return;}
            App.alert(json, {
                ok: function(){
                    if (!scope.$uid) {
                        location.reload();
                    }
					//如果是重复发送，关闭层
					if(json.code === "M01155"){
						dialog.close();
					}
                }
            });
        };
        var getPara = 0;
        //isLast ，isRoot 指明是否需要同时发评论
        if ($E("lastForwarder_"+fid) && $E("lastForwarder_"+fid).checked) {
            postdata.isLast = "1";
            getPara++;
        }
        if ($E("initBloger_"+fid) && $E("initBloger_"+fid).checked) {
            postdata.isRoot = "1";
            getPara++;
        }
        //修改"转发进评论"功能的接收程序地址,加上GET参数(f=n)
        if (getPara > 0) {
            url += "?f=" + getPara;
        }
        App.doRequest(postdata, url, cb, ecb);
    };
    
    function errortTip(str, el){
        el.focus();
        App.fixElement.setHTML(str, "", options);
        mdforwardbtn.className = enableClass;
        return false;
    };
    
    if (!scope.$uid) {
        /**
         * 登录层下来框
         */
        passcardOBJ.init(name, {
            overfcolor: "#999",
            overbgcolor: "#e8f4fc",
            outfcolor: "#000000",
            outbgcolor: ""
        }, pwd, window);
        App.initLoginInput(name);
    }
    mdforwardbtn.onclick = function(){
        if (!forwardInputLimit()) {
            var orbit = ['#fff', '#fee', '#fdd', '#fcc', '#fdd', '#fee', '#fff', '#fee', '#fdd', '#fcc', '#fdd', '#fee', '#fff'];
            var index = 0;
            var hook = App.timer.add(function(){
                if (index / 2 >= orbit.length) {
                    App.timer.remove(hook);
                    return false;
                }
                mdforwardtextarea.style.backgroundColor = orbit[index / 2];
                index += 1;
            });
            return false;
        }
        if (mdforwardbtn.className === disClass) {
            return false;
        }
        mdforwardbtn.className = disClass;
        if (scope.$uid) { //用户已经登录
            forwardSuccess();
        }
        else {
            var namestr = Core.String.trim(name.value);
            var pwdstr = Core.String.trim(pwd.value);
            
            if (!namestr || namestr === name.title) {
                errortTip($SYSMSG["M00901"], name);
                return false;
            }
            else {
                App.fixElement.hidden();
            }
            if (!pwdstr) {
                errortTip($SYSMSG["M00902"], pwd);
                return false;
            }
            else {
                App.fixElement.hidden();
            }
            
            App.LoginAction({
                name: namestr,
                pwd: pwdstr,
                remb: 7,
                error: function(reason, errno){
                    var msg = "";
                    if (errno === "4010") {
                        reason = App.getMsg({
                            code: 'R01011'
                        });
                        msg = App.getMsg("R01010", {
                            mail: loginname.value
                        });
                    }
                    else {
                        if (errno === "101" || errno === "5") {
                            msg = App.getMsg({
                                code: "R11111"
                            });
                        }
                    }
                    App.fixElement.setHTML(reason, msg, options);
                    mdforwardbtn.className = enableClass;
                },
                succ: function(){
                    forwardSuccess();
                }
            });
        }
        return false;
    };
    App.enterSubmit({
        parent: 'forwardcontent',
        action: function(){
            mdforwardbtn.onclick();
        }
    });
};