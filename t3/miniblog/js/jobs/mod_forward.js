/**
 * @author xinlin
 */
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
$import('diy/check_login.js');

/**
 * 转发层，负责转发消息，提供登陆功能
 * @param{String} fid
 * @param{String} content : 内容
 * @param{Number} uid
 * @param{Object} el:HTML DOM
 * @param{String} exid
 * @param{String} forwardName
 * @param{String} forwardContent
 * @param{String} uname
 * @param{Function}callback 转发成功的回调函数
 */
App.ModForward = function(fid, content, uid, el, exid, forwardName, forwardContent, uname,callback){
	Core.Events.stopEvent(); //阻止默认事件
	if(el && el.getAttribute("allowforward")){
		App.alert($SYSMSG["M02020"]);
		return false;
	}
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
    //loginStr = scope.loginKit().isLogin ? "" : loginStr;
	loginStr = "";
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
						<a onclick="App.showFaces(this,$E(\'mdforwardtextarea_' + fid + '\'),-29,5);return false;" title="'+ $CLTMSG["CD0032"]+ '" href="####" class="faceicon1"></a>\
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
	
	//焦点在checkbox上ctrl+enter也可以提交
	if($E("lastForwarder_"+fid)){
		$E("lastForwarder_"+fid).onkeydown = function(event){
			event = event || window.event;
			if (event.keyCode === 13 && event.ctrlKey) {
				mdforwardbtn.onclick();
			}
		};
	}
    if($E("initBloger_"+fid)){
		$E("initBloger_"+fid).onkeydown = function(event){
			event = event || window.event;
			if (event.keyCode === 13 && event.ctrlKey) {
				mdforwardbtn.onclick();
			}
		};
	}
    
    
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
//                    var connter = $E("_comment_count_miniblog_" + fid).getElementsByTagName("strong")[0];
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
				if (!scope.loginKit().isLogin) {
					location.reload();
				}
				if(typeof callback === "function"){
					//now I only need the el,if you need more ,you can add more.
					callback(el);
				}
				//假写数据
				if(App.refurbishUpdate){
					App.refurbishUpdate.add(1);
				}
				if(!data){return}
				var feedlist = $E("feed_list");
				if(feedlist){
					var feedBox = document.createElement('UL');
					feedBox.innerHTML = data.html;
					
					// 对内容作展示和绑定
					
					var $d = window.document, $e = $d["documentElement"]||{};
					var $t = function(){
						if(arguments.length > 0){
							$e.scrollTop = arguments[0];
							$d["body"].scrollTop = arguments[0];
							return;
						}
						return (window.pageYOffset||Math.max($e.scrollTop, $d["body"].scrollTop));
					};
					
					setTimeout(function(){
						var li = feedBox.getElementsByTagName('LI')[0];
						if(!li){return};
						feedlist.parentNode.insertBefore(feedBox,feedlist);
						feedlist.insertBefore(li,(feedlist.getElementsByTagName('LI'))[0]);
						feedBox.parentNode.removeChild(feedBox);
						try{
							App.bindMedia(li);
						}catch(e){
							//console.log(e);
						}
						// _fe.style.display = 'none';
						// App.rollOut(_fe);
						
						//提升用户体验，转发成功后不会向下挤
						var _h = feedlist.getElementsByTagName('LI')[0].offsetHeight;
						$t($t() + _h);
					}, 1000);
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
                    if (!scope.loginKit().isLogin) {
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
        if (scope.loginKit().isLogin) { //用户已经登录
            forwardSuccess();
        }
        else {
			App.ModLogin({
				func:function(){
					forwardSuccess();
				}
			});
			mdforwardbtn.className = enableClass;
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
