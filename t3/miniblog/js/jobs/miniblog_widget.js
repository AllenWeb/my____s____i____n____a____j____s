/**
 * @author yuwei@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/fireEvent.js");
//$import("msg/msg.js");
$import("sina/utils/url.js");
$import("sina/core/dom/getStyle.js");

$registJob( "miniblog_widget", function(){
	var p = {
		submit   : $E("publisher_submit"),
		content  : $E("publish_editor"),
		limitTip : $E("limitTip"),
		wapper   : $E("widget_wapper"),
		contentw : $E("widget_content_wapper")
	};
	
	var query = new Utils.Url(window.location.href).query;
	if(query){
		var wapper = p.wapper;
		var contentw = p.contentw;
		if( wapper && contentw ){
			if(query.width){
				wapper.style.width = query.width + "px";
			}
			if(query.height){
				contentw.style.height = query.height + "px";
			}
			
		}
	}
	
	document.body.style.backgroundColor = Core.Dom.getStyle(p.wapper,"backgroundColor");//让背景颜色和皮肤一致
	
	App.logout = function(){
  		window.location.href = "http://t.sina.com.cn/logout.php?backurl="+escape(document.URL);
	};

	App.login = function(){
		var loginDiv = document.getElementById("login_div");
		var displayMblog = document.getElementById("widget_content_wapper");
		displayMblog.style.display = "none";
		loginDiv.style.display = "";
		
		if(window.innerHeight){
			p.wapper.style.height = window.innerHeight + "px";
			if(loginDiv.offsetHeight > window.innerHeight){
				loginDiv.style.height = "180px";
			}
		}else if(document.documentElement){//IE6 window height
			var h = Math.max(document.documentElement.clientHeight,document.documentElement.offsetHeight);
			p.wapper.style.height =  h + "px";
			if(loginDiv.offsetHeight > h){
				loginDiv.style.height = "180px";
			}
		}
	};
	
	if(!scope.$uid){
		p.contentw.style.height = p.contentw.offsetHeight + 100 +"px" ;
	}
	
	//
	if(scope.$tags && scope.$tags.join){
		var tagStr = "";
		try{
			for(var i=0;i<scope.$tags.length;i++){
				tagStr += "#" + decodeURIComponent(scope.$tags[i]) +  "# ";
			}
		}catch(e){
			//decodeURIComponent解码错误？
		}
		
	}
	p.content.value = tagStr||$CLTMSG["CD0019"];
	//
	var moreUrl = scope.$moreUrl;
	
	App.more = function(){
		if(moreUrl){
			window.open(moreUrl,"miniblog_more");
		}
	};
	
	var shiftShow = function(list){
		var that = {};
		var current = 0;
		var movingkey = true;
		moreUrl = list[0]['title'].getAttribute("res");
		for(var i = 0, len = list.length; i < len; i += 1){
			(function(k){
				Core.Events.addEvent(list[k]['title'],function(){
					if(k == current){
						return false;
					}
					list[k]['title'].className = "selected";
					list[current]['title'].className = '';
					list[k]['content'].style["display"] = "block";
					list[current]['content'].style["display"] = 'none';
					moreUrl = list[k]['title'].getAttribute("res");
					current = k;
					list[k]['content'].parentNode.scrollTop = 0;
				},'click');
			})(i);
		}
	};
	
	shiftShow([
		{'title' : $E('tag_all'),'content' : $E('content_all')},
		{'title' : $E('tag_follow'),'content' : $E('content_follow')}
	]);
	
	var setTimeTag2Url = function(_url){
		var lastUrl = /^(.+&ct=)[0-9]+$/.exec(_url);
		if(lastUrl){
			return lastUrl[1] + (new Date()).getTime();
		} else {
			return _url + '&ct=' + (new Date()).getTime();
		}
	}
	
	if(p.submit && p.content){
		Core.Events.addEvent( p.submit,function(){
			var content = Core.String.trim( p.content.value );
				if(content && content!= $CLTMSG["CD0019"]){
					if(!scope.$uid){
						App.login();
						return false;
					}
					else{
						p.submit.disabled = true;
						var params = {
							'content' : content,
							'from'    : scope['$pageid']
						};
						if(query && query.current_url){
							params['current_url'] = query.current_url; //current_url指明父页面地址,用于追踪微博来源　
						}
						Utils.Io.Ajax.request('/mblog/publish.php', {
							'POST'		: params,
							'onComplete': function(json){
								if(json.code == 'A00006'){
									setTimeout(function(){
										window.location.href = setTimeTag2Url(window.location.href);
									}, 800);
									
								}else{
									p.content.blur();
									if(json.code=="M00003"){
										App.login();
										return false;
									}else{
										//p.limitTip.innerHTML = $SYSMSG[json["code"]];
										App.showTip($SYSMSG[json["code"]]);
									}
								}
								p.submit.disabled = false;
							},
							'onException': function(){
							},
							'returnType': 'json'
						});
					}
					
				}
			return false;
		},"click");
		
		var listener = (function(c,b,t){
			c.style.color = "#999999";
			return function(event){
				var sType = event.type;
				if( sType=="focus" ){
					c.style.color = "#333333";
					if(c.value == $CLTMSG["CD0019"]){
						c.value = "";
					}
				}
				if( sType=="blur" ){
					c.style.color = "#999999";
					if(Core.String.trim(c.value)==""){
						c.value = $CLTMSG["CD0019"];
						return;
					}
				}
				var sLength = 280;
				var value = Core.String.trim(c.value);
				var snapLength = Core.String.byteLength(value.replace(new RegExp($CLTMSG["CD0019"],"g"),""));
				if( snapLength > sLength || snapLength == 0){
					var txt = "";
					if(snapLength>0){
						txt = $CLTMSG['CD0020'].replace(/#\{len\}/,Math.ceil(( snapLength - sLength )/2));
					}else{
						txt = $CLTMSG['CD0021'].replace(/#\{len\}/,sLength/2);
					}
					t.innerHTML = txt;
					b.disabled = "disabled";
				}else{
					t.innerHTML = $CLTMSG['CD0021'].replace(/#\{len\}/,Math.ceil((sLength - snapLength)/2));
					b.disabled = "";
				}
			};
		})(p.content, p.submit, p.limitTip);
		
		Core.Events.addEvent(p.content, listener, "focus");
		Core.Events.addEvent(p.content, listener, "blur");
		Core.Events.addEvent(p.content, listener, "keyup");
		
		Core.Events.addEvent(p.content,function(event){
			if((event.ctrlKey==true && event.keyCode=="13")||(event.altKey==true && event.keyCode=="83")){
				p.submit.blur();
				Core.Events.fireEvent(p.submit,"click");
			}
		},"keyup");
	}
	
});
