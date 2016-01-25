/**
 * @ Robin Young | yonglin@staff.sina.com.cn
 * @ 与话题有关的操作
 */

$import("jobs/base.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/removeNode.js");
$import("jobs/mod_login.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/dom.js");
$import("diy/TextareaUtils.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/string/byteLength.js");
$import('diy/dom.js');

$registJob('topic', function(){
	var _alert = App.alert;
	var generalError = function(json){
		if (json&&json['code']) {
			_alert({
				'code': json['code']
			},{'ok':function(){
				if(scope.$uid == "123456"){
					window.location.reload();
					return;
				}
			}});
		}else{
			_alert({
				'code': 'R01404'
			});
		}
		lock = false;
	};
	var lock = false;
	var element = {
		'addBox' : $E('add_topic_box'),
		'lisBox' : $E('list_topic_box'),
		'moreBox': $E('more_topic_box'),
		'lisTit' : $E('topic_list_title'),
		'shell'  : $E('topic_list_shell'),
		'newTopic': $E('add_topic_btn'),
		'topic': $E('att_topic')
	}

	var template = {
		'botton'	: '<a href="javascript:void(0);" onclick="App.topic.add(\'${keyword}\',this);return false;">' + $CLTMSG['CX0040'] + '</a>',
		'added'		: $CLTMSG['CX0041'] + ' (<a href="javascript:;" onclick="App.topic.del(\'${keyid}\',\'${keyword}\',this);return false;">' + $CLTMSG['CX0042'] + '</a>)',
		'item'      :  '<a href="/k/${keyword}">${keyword}</a><span href="javascript:void();" onclick="App.topic.del(\'${keyid}\');return false;" title="' + $CLTMSG['CX0043'] + '">x</span>'
	};
	
	var req = {
		'addTopic' : {'mtd' : 'POST' , 'url' : '/dialog/adddialog.php'},
		'delTopic' : {'mtd' : 'POST' , 'url' : '/dialog/deldialog.php'}
	};
	
	var doRequest = function(key,parameters,sucFun,errFun){
		if(!req[key]){throw('wrong key for request!')}
		if(!parameters){throw('what is you want to update?')}
		sucFun = sucFun || function(){};
		errFun = errFun || generalError;
		var option = {};
		option[req[key]['mtd']] = parameters;
		option['onComplete'] = function(json){
			if(json.code == 'A00006'){
				sucFun(json['data']);
			}else{
				errFun(json);
			}
		};
		option['onException'] = errFun;
		option['returnType'] = 'json';
		Utils.Io.Ajax.request(req[key]['url'], option);
	}
	
	var isList = element['lisBox'] ? true : false;
	
	var maxList = 10;
	
	App.topic = {
		'add'	: function(keyword,dom,func,errfunc){
			if(lock) return false;
			lock = true
			func = func ||function(){};
			
			keyword = decodeURIComponent(keyword);
			if(!keyword){return false}
			if(scope.$uid == ""){
				App.ModLogin({
					"func"	:	App.topic.add,
					"param"	:	keyword
				});
				return;
			}
			var success = function(json){
				//未登录状态下，提交成功直接刷新页面
				if(scope.$uid == "123456"){
					window.location.reload();
					return;
				}
				
				var keyid = json||'';
				var addedString = template['added'].replace(/\$\{keyword\}/g,encodeURIComponent(keyword)).replace(/\$\{keyid\}/g,keyid);
				if(dom){
					dom.parentNode.innerHTML = addedString;
				}
				if(element['addBox']){
					element['addBox'].innerHTML = addedString;
				}
				//如果存在列表，则对列表的操作
				if(isList){
					//操作页面
					var topicItem = document.createElement('LI');
					topicItem.id = 'topic_' + keyid;
					//keyword = encodeURIComponent(keyword)
					keyword = Core.String.encodeHTML(Core.String.trim(keyword));
					topicItem.innerHTML = template['item'].replace(/\$\{keyword\}/g,keyword).replace(/\$\{keyid\}/g,keyid);
					if(App.topic['list'].length == 0){
						element['lisBox'].parentNode.style.display = "block";
					}
					var sHtml = '<li id = "'+topicItem.id +'" onmouseover="this.className=\'list_hover\'" ' +
							'onmouseout="this.className=\'\'">' + topicItem.innerHTML + '</li>';
					Core.Dom.insertHTML(element['lisBox'], sHtml, "AfterBegin");
					
					//操作缓存列表
					App.topic['list'].push(topicItem);
					element['lisTit'].innerHTML = $CLTMSG['CX0044'] + '(' + App.topic['list'].length + ')';
					if(App.topic.list.length > 10){
						if (element['moreBox']) {
							var lis = element['lisBox'].getElementsByTagName("LI");
							for(var i=len;i>=10;i--){
								lis[i].style.display = 'none';
							}
							element['moreBox'].style.display = 'block';
						}
					}
					func();
				}
				lock = false;
			};
			//setTimeout(success,2000);
			doRequest('addTopic', {'keyWords' : keyword}, success,	errfunc);
		},
		'del'	: function(keyid, keyword, dom){
			if(!keyid){return false}
			var success = function(json){
				if(isList){
					try {
						Core.Dom.removeNode('topic_' + keyid);
						for (var i = 0, len = App.topic['list'].length; i < len; i++) {
							if (App.topic['list'][i].id == 'topic_' + keyid) {
								App.topic['list'].splice(i, 1);
								break;
							}
						}
						element['lisTit'].innerHTML = $CLTMSG['CX0044'] + '(' + App.topic['list'].length + ')';
					}catch(exp){}
				}
				if(element['addBox']){
					try {
						if (scope['$search'] == keyword) {
							element['addBox'].innerHTML = template['botton'].replace(/\$\{keyword\}/g,keyword);
						}
					}catch(exp){}
				}
				if(dom){
					try {
						dom.parentNode.innerHTML = template['botton'].replace(/\$\{keyword\}/g,keyword);
					}catch(exp){}
				}
				if(element['shell']){
					if(!App.topic.list.length){
						element['shell'].style.display = 'none';
					}
				}
			};
//			App.confirm({'html' : "确定删除吗？"},{
//				'ok' : function(){
					doRequest('delTopic', {'id' : keyid}, success);
//				},
//				'cancel' : function(){}
//			});
		},
		'more'	: function(mount){//wangliang3 modify
			var showList = [],hideList=[];
			for(var i = 0,j = 0,len = App.topic['list'].length; i < len; i ++){
				var tmp = App.topic['list'][i];
				if(tmp['style']['display'] == 'none'){
					if(j < mount){
						j++;
						showList.push(tmp);
						continue;
					}
					hideList.push(tmp);
				}
			}
			
			var c = 0;
			var tk = App.timer.add(
				function(){
					if(c >= showList.length){
						App.timer.remove(tk);
						if (App.topic['list'].length > 0 && App.topic['list'][App.topic['list'].length - 1].style.display != 'none') {
							if (element['moreBox']) {
								element['moreBox'].style.display = 'none';
							}
						}
						return false;
					}
					showList[c].style.display = '';
					c ++;
				}
			);
			
			if(hideList.length > 0){
				return;
			}
			
			var obj = Core.Events.getEventTarget();
			if(typeof(obj)== 'object'){
				for(;!App.Dom.hasClass(obj,'txt_right');obj = obj.parentNode);
				var _mlSpan = App.Dom.getByClass('MIB_liner','span',obj);
				if(_mlSpan && _mlSpan[0]){
					_mlSpan[0].style.display='none';
				}
				var _addA = obj.getElementsByTagName('a');
				if(_addA && _addA[1]){
					_addA[1].style.display='none';
				}
				
			}
		},
		'list'	: []
	};
	if(isList){
		var itemList = element['lisBox'].getElementsByTagName('LI');
		for(var i = 0, len = itemList.length; i < len; i ++){
			App.topic['list'].push(itemList[i]);
		}
	}
	
	/**
	* 增加使用浮层“添加”活动分类功能
	* @author by wangliang 2010-07-01
	*/
	if(element['newTopic']){
		var buildLayer = function(){
			var html = [];
			html.push('<div id="panel" style="position:absolute;left:0px;z-index:10;" class="small_Yellow pop_tips"><table class="CP_w" style="width: 200px;">');
			html.push('<thead><tr><th class="tLeft"><span></span></th><th class="tMid"><span></span></th><th class="tRight"><span></span></th></tr></thead><tfoot><tr><td class="tLeft"><span></span></td><td class="tMid"><span></span></td><td class="tRight"><span></span></td></tr></tfoot>');
			html.push('<tbody><tr><td class="tLeft"><span></span></td><td class="tMid">');
			html.push('	<div class="tagslayer">');
			html.push('		<p><input type="text" id="topic" class="PY_input" /><a id="save" href="javascript:;" class="btn_normal btnxs"><em>'+$CLTMSG['CC1102']+'</em></a></p>');
			html.push('		<p class="txt"><span id="error">'+$CLTMSG['CC5001']+'</span></p>');
			html.push('	</div></td><td class="tRight"><span></span></td></tr>');
			html.push('</tbody></table>');
			html.push('<div class="close"><a id="close" href="javascript:;"></a></div></div>');
			
			var handler = {
				closePanel : function(){
					build.domList['panel'].style.display='none';
					build.domList['panel'].parentNode.removeChild(build.domList['panel']);
					element['topic'].style.cssText = '';
				},
				saveTopic : function(){
					var value = build.domList['topic'].value.replace(/^\s+|\s+$/g, '');
					var count = Core.String.byteLength(value);
					if(count > 20){
						build.domList['error'].style.cssText = 'color:red;'
						build.domList['error'].innerHTML=$CLTMSG['CC5004'];
						return;
					}
					var topic = build.domList['topic'].value.replace(/^\s+|\s+$/g, '');
					if(topic == ''){
						build.domList['error'].style.cssText = 'color:red;'
						build.domList['error'].innerHTML=$CLTMSG['CC5002'];
						return;
					}
					var isExist = false;
					App.Dom.getBy(function(el){
						if(!isExist && el.innerHTML == topic){
							isExist = true;
						}
					},'a',element['lisBox']);
					if (!isExist) {
						topic = encodeURIComponent(topic);
						Core.Events.removeEvent(build.domList['save'],handler.saveTopic);
						App.topic.add(topic, null, function(){
							handler.closePanel();
						},function(json){
							Core.Events.addEvent(build.domList['save'],handler.saveTopic);
							build.domList['error'].style.cssText = 'color:red;'
							build.domList['error'].innerHTML=$SYSMSG[json['code']];
						});
					}else{
						build.domList['error'].style.cssText = 'color:red;'
						build.domList['error'].innerHTML=$CLTMSG['CC5003'];
					}
				}
			};
			var conf = {
				template: html.join(''),
				box: element['topic']
			};
			var build = App.builder2(conf);
			Core.Events.addEvent(build.domList['save'],handler.saveTopic);
			Core.Events.addEvent(build.domList['close'],handler.closePanel);
			App.TextareaUtils.setCursor(build.domList['topic']);
		};
		var clickAddBtn = function(){
			var data = App.Dom.getByClass('pop_tips','div',element['topic'])||[];
			if(data.length>0){
				return;
			}
			element['topic'].style.cssText = 'position:relative;overflow:visible;z-index:4;';
			buildLayer();
		};
		Core.Events.addEvent(element['newTopic'],clickAddBtn);
	};
});




