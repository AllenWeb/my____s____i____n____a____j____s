$import("sina/sina.js");
$import("sina/app.js");
$import("diy/splitLoader.js");
$import("jobs/seevideo.js");
$import("jobs/splitLoaderPlugin/bindTitle.js")
$import("jobs/splitLoaderPlugin/bindFace.js");
$import("diy/FormatViewTime.js");
$import("jobs/map/popUpMiniMap.js");
$import("diy/SimpleJSLoader.js");

$registJob("splitLoadMedia",function(){
	
	var $GA = App.getElementsByAttribute,
	_bindApp = function(){
		var oInstance = {}, hash = {}, _data = [], _doms = [];
		oInstance.data = _data;
		oInstance.plugin = function( type, fMethod ){
			hash[type] = fMethod;
			return oInstance;
		};
		oInstance.add = function(id, dom){
			_data.push(id);
			_doms.push(dom);
		};
		oInstance.exec = function( oElement, sKey, oData ){
			var method;
			(method = hash[oData["type"]]) && method(oElement, sKey, oData);
		};
		oInstance.flush = function(json){
			var i=0, len=_doms.length;
			if(!len){return}
			for(i; i<len; i++){
				if (json[_data[i]]) {
					try {oInstance.exec(_doms[i], _data[i], json[_data[i]])}catch(e){};
					_doms.splice(i,1);_data.splice(i,1);
					i--;len--;
				}
			}
		};
		return oInstance;
	},
	shortId = function( sValue ){
		return ((sValue = sValue.match(/\/([^\/]+)\/?(<[^<]*)?$/i)) && sValue[1])||"";
	};
	
	App.splitLoader.
	//图片分屏绑定
	plugin({
		"init" : function(){
			var imgs = $GA(document.body,"img","dynamic-src");
			return imgs;
		},
		"flush": function(doms){
			if (doms.length) {
				var d, f = arguments.callee,d = d = doms.shift(), u, v;
				if(d && (u = d.getAttribute("dynamic-src"))){
					d.src = u;
					//如果小图需要预载大图
					if(d.getAttribute("vimg")){
						v = new Image();
						v.setAttribute("dynamic-src", u.replace(/\/thumbnail\//,"/bmiddle/"));
						doms.push(v);
					}
				}
				setTimeout(function(){
					f(doms);
				}, 0);
			}
		}
	},"flushImg").
	//绑定短链app应用
	plugin((function(){
		var bind = _bindApp();
		return {
			'init': function(){
				var a = $GA(document.body, "a", "mt");
				return a;
			},
			'extract': function(dom){
				bind.add(shortId(dom.innerHTML), dom);
			},
			"flush": (function(){
				bind.
				plugin("video", App.bindVideo).
				plugin("url", App.bindTitle).
				plugin("magic" , App.bindFace);
				//			.plugin("vote" , App.bindVote)
				//			
				return function(d){
					var data = {
						"url": bind.data.join(",")
					};
					var api = '/mblog/sinaurl_info.php';
					var fail = function(){
					};
					var success = function(json){
						bind.flush(json);
					};
					App.doRequest(data, api, success, fail, "post");
				};
			})()
		};
	})(),"flushApp").
	//绑定音乐
	plugin({
		"init" : function(){
			var a = $GA(document.body,"a","sm");
			return a;
		},
		"extract" : function(dom){
			var su = (su = dom.innerHTML.match(/^[^<]*/)) && su[0];
			if(su){
				App.bindMusic(dom, shortId(su), su);
			}
		}
	},"flushMusic").
	//绑定评论及转发数
	plugin((function(){
		var bind = _bindApp();
		return {
			"init":function(){
				var s = $GA(document.body,"strong","rid");
				return s;
			},
			'extract':function(dom){
				bind.add(dom.getAttribute("rid"), dom);
			},
			"flush":(function(){
				bind
				.plugin("count", function(dom,sKey,data){
					var count,att = dom.getAttribute("type");
					if(att && (count = parseInt(data[att]))){
						dom.innerHTML = ["(", count, ")"].join("");
					}
				});
				return function(dom){
					if(!dom.length || !(/^myprofile|mymblog|profile$/i.test(scope.$pageid))){
						return;
					}
					var data = {"mids": bind.data.join(","),"oid":scope.$oid};
					var api = '/mblog/aj_comment.php';
					var fail = function(){};
					var success = function(json){
						bind.flush(json);
					};
					
					App.doRequest(data,api,success,fail,"post");
				}
			})()
		};
	})(),"flushCommentCount").
	//绑定时间以
	plugin({
		"init" : function(){
			var d = $GA(document.body,"strong","date");
			return d;
		},
		"extract" : function(dom){
			var num = dom.getAttribute("date")*1;
			num && (num = App.FormatViewTime(num));
			num && (dom.innerHTML = num)
		}
	},"flushTime").
	//绑定删除微博链接
	plugin({
		"init" : function(){
			var d = $GA(document.body,"strong","oid");
			return d;
		},
		"extract" : function(dom){
			var oid = dom.getAttribute("oid");
			oid && (oid == scope.$uid) && (dom.style.display = "")
		}
	},"flushState").
	//绑定国际化feed语言
	plugin({
		"init": function(){
			var l = $GA(document.body,"strong","lang");
			return l;
		},
		"extract" : function(dom){
			var lang = dom.getAttribute("lang");
			lang && (lang = $CLTMSG[lang]) && (dom.innerHTML = lang);
		}
	},"flushLanguage").
	//绑定地图信息
	plugin((function(){
		var xys = [], doms = [], heads = [], ginfo = {}, con = 0;
		App.bindGeo = function(json){
			var key,info,xy;
			for(key in json){
				if(info = ginfo[key]){
					xy = info["geo"].split(",");
					App.bindPopUpMiniMap(info["dom"], xy[0], xy[1], json[key].type, info["head"], json[key].addr, info["nick"]);
				}
			}
		}
		return {
			'init': function(){
				var p = $GA(document.body, "p", "geo");
				return p;
			},
			'extract': function(dom){
				var geo = dom.getAttribute("geo"), head = dom.getAttribute("head"), nick = dom.getAttribute("nick")||"";
				//var id = ["g",new Date().getTime().toString(32),Math.floor(Math.random()*1000).toString(32)].join("_");
				var id = ["g",con++].join("");
				ginfo[id] = {"dom":dom, "head":head, "geo":geo, "nick":nick};
				xys.push([geo,id].join(","));
			},
			"flush": function(dom){
					if(!xys.length){return}
					var api = ['http://api.map.sina.com.cn/i/xyInChina_mul.php?xy=',xys.join("|"),"&rnd=",new Date().getTime().toString(32),Math.floor(Math.random()*1000).toString(32)].join("");
					xys = [];
					App.SimpleJSLoader(api);
			}
		};
	})(),"flushMap");
	App.bindMedia = function(oElement){
		var m,a,i,c,t,d,l,g;
		(i=$GA(oElement,"img","dynamic-src")) && i.length && App.flushImg.flush(i);
		(a=$GA(oElement,"a","mt")) && a.length && App.flushApp.flush(a);
		(m=$GA(oElement,"a","sm")) && m.length && App.flushMusic.flush(m);
		(c=$GA(oElement,"strong","rid")) && c.length && App.flushCommentCount.flush(c);
		(t=$GA(oElement,"strong","date")) && t.length && App.flushTime.flush(t);
		(d=$GA(oElement,"strong","oid")) && d.length && App.flushState.flush(d);
		(l=$GA(oElement,"strong","lang")) && l.length && App.flushLanguage.flush(l);
		(g=$GA(oElement,"p","geo")) && g.length && App.flushMap.flush(g);
	};
});

