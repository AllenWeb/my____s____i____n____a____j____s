/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("diy/builder.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/encodeHTML.js");
$import("diy/querytojson.js");
$import("diy/imgURL.js");
$import("diy/curtain.js");

$registJob('topics_widget',function(){
	App.timer.delay = 1;
	var addEvent = Core.Events.addEvent;
	var addList = [];
	//单例，数据通信
	var io = (function(){
		var that = {};
		var hash = {};
		
		/*
		 *spec {
		 success : function(json,params){
		 
		 }
		 method: POST|GET
		 url:http://t.sina.com.cn
		 
		 }
		 */
		that.register = function(key,spec){
			if(!hash[key]){
				hash[key] = spec;
			}else{
				throw '注册过啦！';
			}
		};
		that.changeCallBack = function(key,fun){
			if(!hash[key]){
				hash[key] = {};
			}
			hash[key]['success'] = fun;
		};
		that.fire = function(key,params){
			var args = {};
			args[hash[key]['method']] = params;
			args['onComplete'] = function(json){
				hash[key]['success'](json,params);
				/*if(json.code === 'A00006') {
					
				}else{
					//error
				}*/
			};
			args['returnType'] = 'json';
			args['onException'] = function(){};
			Utils.Io.Ajax.request(hash[key]['url'],args);
		};
		return that;
	})();
	io.register('comment',{
		'url'		: 'http://v.t.sina.com.cn/widget/addcomment.php',
		'method'	: 'POST',
		'success'	: function(){}
	});
	//单例，元素列表
	var itemList = (function(spec){
		var that = {};
		var list = [];
		var anim = document.createElement('LI');
		that.push = function(item){
			list.push(item);
			spec.box.appendChild(item.dom('box'));
		};
		that.pop = function(){
			spec.box.removeChild(list.splice(-2,1)[0].dom('box'));
		};
		that.unshift = function(item,isAnimation){
			if(list.length !== 0){
				spec.box.insertBefore(item.dom('box'),list[0].dom('box'));
			}else{
				spec.box.appendChild(item.dom('box'));
			}
			if(isAnimation){
				spec.box.insertBefore(anim,item.dom('box'));
				anim.style.height = item.dom('box').offsetHeight + 'px';
				item.dom('box').style.display = 'none';
				App.curtain.droop(anim,function(){
					spec.box.removeChild(anim);
					item.dom('box').style.display = '';
				});
			}
			list.unshift(item);
		};
		that.getItemByIndex = function(index){
			return list[index];
		};
		that.node = list;
		that.length = function(){return list.length;};
		that.isInclude = function(id){
			for(var i = 0,len = list.length; i < len; i += 1){
				if(list[i].get && id == list[i].get('mblogid')){
					return true;
				}
			}
			return false;
		};
		that.changeHeight = function(initHeight){
			var pos = Core.Dom.getXY(spec.box);
			spec.box.style.height = (initHeight - pos[1] - 10) + 'px';
		};
		return that;
	})({
		'box'	: $E('box')
	});
	
	
	
	//单例，评论模块
	var comment = (function(){
		var template = [
			{'tagName' : 'textarea', 'attributes' : {'id' : 'content'}},
			{'tagName' : 'div', 'attributes' : {'class' : 'publish'}, 'childList': [
				{'tagName' : 'a', 'attributes' : {'class' : 'btn_4 publish_mini','href' : 'javascript:void(0);','id':'submit','innerHTML' : '<span>发布</span>'}},
				{'tagName' : 'a', 'attributes' : {'class' : 'btn_4 publish_mini','href' : 'javascript:void(0);','id':'cancel','innerHTML' : '<span>取消</span>'}}
			]}
		];
		var box = document.createElement('DIV');
			box.className = 'pub_remark';
			
		var dom = new App.Builder(template,box);
		var l = dom.domList;
		
		var currentActionItem = null;
		
		var hidd = function(){
			if(currentActionItem) {
				currentActionItem.dom('comment').style.display = '';
				currentActionItem.dom('box').removeChild(box);
				currentActionItem.dom('box').isComment = false;
			}
			l['content'].value = '';
			currentActionItem = null;
			if(!newsTimer && itemType == 'feed'){
				startnewsTimer();
			}
		};
		var show = function(initStr){
			if (itemType == 'comment') {
				l['submit'].innerHTML = '<span>回复</span>';
			}
			currentActionItem.dom('box').appendChild(box);
			currentActionItem.dom('comment').style.display = 'none';
			if(initStr){
				l['content'].value = initStr;
			}
			currentActionItem.dom('box').isComment = true;
			if(newsTimer && itemType == 'feed'){
				stopnewsTimer();
			}
		};
		
		var submit = function(){
			if(!currentActionItem){
				throw 'no item';
			}
			var str = Core.String.leftB(Core.String.trim(l['content'].value),280);
			if(str.length <= 0){
				hidd();
				return false;
			}
			var params = {
				'content'		: str,
				'listInDiv'		: '1',
				'productId'		: 'miniblog',
				'ownerUid'		: currentActionItem.get('uid'),
				'productName'	: '新浪微博',
				'resInfo'		: '',
				'resourceId'	: currentActionItem.get('mid'),
				'uid'			: scope.$uid
			};
			if(currentActionItem.get('srcid')){
				params['cid'] = currentActionItem.get('cmtid');
				params['ownerUid'] = currentActionItem.get('mbloguid');
				params['replyUid'] = currentActionItem.get('uid');
				params['resTitle'] = encodeURIComponent(currentActionItem.get('content'));
			}else{
				params['resTitle'] = encodeURIComponent(currentActionItem.get('content').text);
			}
			io.fire('comment',params);
		};
		
		var that = {};
			that.dom = function(id){
				if(id == 'box'){
					return dom.box;
				}
				return l.domList[id];
			};
			that.hidd = function(){
				hidd();
				return that;
			};
			that.show = function(initStr){
				show(initStr);
				return that;
			};
			that.act = function(item){
				hidd();
				currentActionItem = item;
				show();
			};
			
		io.changeCallBack('comment',function(json,params){
			hidd();
		});
		addEvent(l['submit'],submit,'click');
		addEvent(l['content'],function(ev){
			if(ev.ctrlKey == true && ev.keyCode == "13"){
				submit();
			}
		},'keyup');
		addEvent(l['cancel'],hidd,'click');
		if(scope.$widget_width){
			l['content'].style.width = parseInt(scope.$widget_width) - 48 + 'px';
		}
			
		return that;
		
	})();
	
	//单例，发布模块
	var publish = (function(){
		//这个是发布器的dom，能用就用
		var template = [
			{'tagName' : 'textarea', 'attributes' : {'id' : 'publishInput'}},
			{'tagName' : 'div', 'attributes' : {}, 'childList': [
				{'tagName' : 'div', 'attributes' : {'class':'fl'}, 'childList': [
					{'tagName' : 'a', 'attributes' : {'class':'check','href' : 'http://v.t.sina.com.cn/widget/widget_video_comment.php' + window.location.search,'id' : 'commentIcon'}},
					{'tagName' : 'marquee', 'attributes' : {'id':'marquee','class':'info','innerHTML': decodeURIComponent(scope.$widget_q7) ,'loop':'-1', 'width':'165', 'direction':'left', 'onmouseout':'this.stop()', 'onmouseover':'this.start()', 'scrollamount':'2' }}
				]},
				{'tagName' : 'a', 'attributes' : {'class':'btn_3 publish','href' : 'javascript:void(0);','id' : 'publishBtn','innerHTML':'<span>发布</span>'}}
			]}
		];
		var box = new App.Builder(template,$E('publish'));
		if(scope.$widget_width){
			box.domList['publishInput'].style.width = parseInt(scope.$widget_width) - 24 + 'px';
		}
		
		var submit = function(e){
			var query = window.location.search.slice(1);
			var videourl = App.queryToJson(query)['videourl'];
			var str = Core.String.leftB(Core.String.trim(box.domList['publishInput'].value),280);
			var key = decodeURIComponent(scope.$widget_q).split('~')[0];
			if(str.length <= 0){
				return false;
			}
			io.fire('publish',{
				'content': '#' + key.split('~')[0] + '#' + str + ' ' + videourl,
				'appkey' : scope.$widget_appkey
			});
		};
		addEvent(box.domList['publishBtn'],submit,'click');
		addEvent(box.domList['publishInput'],function(ev){
			if(ev.ctrlKey == true && ev.keyCode == "13"){
				submit();
			}
		},'keyup');
		addEvent(box.domList['marquee'],(function(m){
			return function(){
				try{
					m.stop();
				}catch(e){}
			}
		})(box.domList['marquee']),'mouseover');
		addEvent(box.domList['marquee'],(function(m){
			return function(){
				try{
					m.start();
				}catch(e){}
			}
		})(box.domList['marquee']),'mouseout');
		return box;
	})();
	
	//发布成功后
	var afterPublish = function(e,p){
		//假写数据到页面，按照搜索结果的格式写
		var spec = {
			'content':{
				'text':p.content
			},
			'userinfo':{
				'portrait': decodeURIComponent(scope.$widget_portrait),
				'nick': decodeURIComponent(scope.$widget_nick)
			},
			'uid':scope.$uid,
			'mid':e.data.mid
		};
		e && e.data && e.data.mid62 && addList.push(e.data.mid62)
		publish.domList['publishInput'].value = '';
		itemList.unshift(item(spec));
	};
	
	var parseURL = function(str){
		var re = RegExp('http:\\/\\/([\\w-]+(\\.[\\w-]+)+(\\/[\\w-   .\\/\\?%&+=\\u4e00-\\u9fa5]*)?)?','ig');
		var ret = str.replace(re,function(url){
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		});
		return ret;
	};
	
	var parseAT = function(str){
		var re = RegExp('(?:((@|＠)([a-zA-Z0-9\u4e00-\u9fa5_]*))[^a-zA-Z0-9\u4e00-\u9fa5_]?)','ig');
		var ret = str.replace(re,function(url){
			if(/(^[a-zA-Z0-9\u4e00-\u9fa5_]*$)/.test(url.slice(1))){
				return '<a href="http://t.sina.com.cn/n/' + url.slice(1) + '" target="_blank">' + url + '</a>';
			}else{
				return '<a href="http://t.sina.com.cn/n/' + url.slice(1,-1) + '" target="_blank">' + url.slice(0,-1) + '</a>' + url.slice(-1);
			}
		});
		return ret;
	};
	
	var parseHot = function(str){
		var re = RegExp('#[^#]*#','ig');
		var ret = str.replace(re,function(url){
			return '<a href="http://t.sina.com.cn/k/' + url.slice(1,-1) + '" target="_blank">' + url + '</a>';
		});
		return ret;
	};
	
	var itemType = scope.$widget_page_type || 'feed';
	//每条feed是一条item。
	var item = function(spec,dis){
		var template = [{'tagName' : 'a', 'attributes' : {'href' : '#','id' : 'headLink','target' : '_blank'}, 'childList': [
				{'tagName' : 'img', 'attributes' : {'title' : '','id':'headImg'}}
			]},
			{'tagName' : 'a', 'attributes' : {'class' : 'user_name text_1','href' : '#','id':'nameLink','target' : '_blank'}},
			{'tagName' : 'span', 'attributes':{'id':'content'}},
			{'tagName' : 'div', 'attributes' : {'class' : 'console','id':'info'}, 'childList': [
				{'tagName' : 'div', 'attributes' : {'class' : 'time text_2','id':'time'}},
				{'tagName' : 'a', 'attributes' : {'class' : 'btn_4 remark text_1','href' : 'javascript:void(0);','id':'comment','innerHTML' : '<span>评论</span>'}}
			]}
		];
		
		var box = document.createElement('LI');
		var dom = new App.Builder(template,box);
		box.style.display = dis?'none':'block';
		var l = dom.domList;
		if (itemType == 'feed') {
			l['headLink'].href = 'http://t.sina.com.cn/' + (spec.uid ? spec.uid : '');
			l['headImg'].src = spec.userinfo.portrait ? spec.userinfo.portrait : null;
			l['headImg'].title = spec.userinfo.nick ? spec.userinfo.nick : '';
			l['nameLink'].innerHTML = spec.userinfo.nick ? spec.userinfo.nick : '';
			l['nameLink'].href = 'http://t.sina.com.cn/' + (spec.uid || '');
			l['content'].innerHTML = '&nbsp;' + parseHot(parseAT(parseURL(Core.String.encodeHTML(spec.content.text ? spec.content.text : ''))));
			l['time'].innerHTML = '<a href="http://t.sina.com.cn/' + (spec.uid ? spec.uid : '') + '" target="_blank">' + (spec.time_str ? spec.time_str : '1分钟前') + '</a>';
		}
		if (itemType == 'comment'){
			l['headLink'].href = 'http://t.sina.com.cn/' + (spec.uid || '');
			l['headImg'].src = spec.userinfo.portrait ? spec.userinfo.portrait : null;
			l['headImg'].title = spec.userinfo.nick ? spec.userinfo.nick : '';
			l['nameLink'].innerHTML = spec.userinfo.nick ? spec.userinfo.nick : '';
			l['nameLink'].href = 'http://t.sina.com.cn/' + (spec.uid || '');
			l['content'].innerHTML = '&nbsp;' + parseHot(parseAT(parseURL(Core.String.encodeHTML(spec.content || ''))));
			l['time'].innerHTML = '<a href="http://t.sina.com.cn/' + (spec.uid ? spec.uid : '') + '" target="_blank">' + (spec.time_str ? spec.time_str : '1分钟前') + '</a>';
			l['comment'].innerHTML = '<span>回复</span>';
		}
		
		
		if ($IE) {
			addEvent(box, function(){
				if (!box.isComment) {
					box.className = 'hover';
				}
			}, 'mouseover');
			addEvent(box, function(){
				box.className = '';
			}, 'mouseout');
		}
		if(scope.$uid == ''){
			l['comment'].style.display = 'none';
		}
			
		//渲染数据
		
		var that = {};
		that.dom = function(id){
			if(id == 'box'){
				return dom.box;
			}
			return l[id];
		};
		that.get = function(key){
			return spec[key];
		};
		
		Core.Events.addEvent(l['comment'],function(){
			comment.act(that);
		},'click');
		
		return that;
	};
	
	//查看更多功能
	var more = function(){
		var _more = $C('LI');
		_more.className = 'more text_1';
		_more.innerHTML = '<a href="javascript:void(0);"><span>查看更多>></span></a>';
		
		addEvent(_more, showMore,'click');
		
		var that = {};
		that.dom = function(){
			return _more;
		};
		return that;
	};
	
	//查看更多函数
	var showMore = function(e){
		var last = (function(){
			for(var i=0; i < (itemList.length()-1) ; i++){
				if(itemList.node[i].dom('box').style.display === 'none'){
					return i;
				}
			}
			return itemList.length()-1;
		})();
		//向后显示10条
		var next = ((last+25)>(itemList.length()-1))?(itemList.length()-1):(last+25);
		for(var i=last;i<next;i++){
			itemList.node[i].dom('box').style.display = '';
		}
		//如果没有了就打开新页面
		last = (function(){
			for(var i=0; i < (itemList.length()-1) ; i++){
				if(itemList.node[i].dom('box').style.display === 'none'){
					return i;
				}
			}
			return 0;
		})();
		if(!last){
			itemList.getItemByIndex(itemList.length()-1).dom().innerHTML = '<a target="_blank" href="http://t.sina.com.cn/k/' + decodeURIComponent(scope.$widget_q) + '"><span>查看更多>></span></a>';
			Core.Events.removeEvent(itemList.getItemByIndex(itemList.length()-1).dom(),showMore,'click');
		}
	};
	
	
	//初始化页面，获取数据
	
	io.register('feed',
		{
			'success':function(e,u){
				if(e.errno){
					var data = e['result'];
					//生成feed列表
					for(var i=0,len=data.length;i<len;i++){
						if(addList.length && addList.indexOf(data[i].mblogid)>0){continue}
						if(i>10){
							itemList.push(item(data[i],1));
						}else{
							itemList.push(item(data[i],0));
						}
					}
					//增加显示查看更多
					itemList.push(more());
				}else{}
			},
			'method':'GET',
			'url':'http://v.t.sina.com.cn/widget/searchmblog.php'
		}
	);
	
	io.register('myComment',{
		'success':function(e,u){
			try {
				if (e.errno) {
					var data = e['result'];
					for(var i = 0, len = data.length; i < len; i += 1){
						itemList.push(item(data[i], 0));
					}
				}
				else {
				
				}
			}catch(exp){console.log(exp)}
		},
		'method':'GET',
		'url':'http://v.t.sina.com.cn/widget/getmycomment.php'
	});
	
	
	
	//给发布器做数据接口绑定
	io.register('publish',
		{
			'success':afterPublish,
			'method': 'POST',
			'url':'http://v.t.sina.com.cn/widget/publish.php'
		}
	);
	var newsList = [];
	//给自动更新做绑定
	io.register('news',{
		'success'	: function(json,params){
			try {
				if (json['errno'] == 1) {
					var data = json['result'];
					for (var i = data.length - 1; i >= 0; i -= 1) {
						if (!itemList.isInclude(data[i]['mblogid'])) {
							newsList.unshift(data[i]);
						}
					}
				}
			}catch(exp){console.log(exp)}
		},
		'method'	: 'GET',
		'url'		: 'http://v.t.sina.com.cn/widget/searchmblog.php'
	});
	
	if(scope.$widget_height){
		itemList.changeHeight(parseInt(scope.$widget_height));
	}
	
	
	var newsTimer = null;
	var shownewsTimer = null;
	var startnewsTimer = function(){
		newsTimer = setInterval(function(){io.fire('news',{
			'q': decodeURIComponent(scope.$widget_q), 
			'pagesize':'15',
			'isrt':'5',
			'url_random':'0',
			'uid':scope.$uid,
			'date':encodeURIComponent(new Date())
		})},30*1000);
		shownewsTimer = setInterval(function(){
			if(newsList.length > 0){
				var data = newsList.pop();
				itemList.unshift(item(data,0),true);
				itemList.pop();
			}
		},5*1000);
	};
	var stopnewsTimer = function(){
		try{
			clearInterval(newsTimer);
			clearInterval(shownewsTimer);
			newsTimer = null;
			shownewsTimer = null;
		}catch(exp){
			
		}
	};
	if(itemType == 'feed'){
		io.fire('feed',{'q': decodeURIComponent(scope.$widget_q), //这个h是测试数据
						'pagesize':'50',
						'isrt':'5',
						'url_random':'0'}
		);
		startnewsTimer();
	}else{
		io.fire('myComment',{});
	}
	scope.initHeight = function(){itemList.changeHeight(parseInt(scope.$widget_height))};
});
