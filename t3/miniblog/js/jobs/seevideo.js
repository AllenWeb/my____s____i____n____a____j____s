/**
 * @author chibin
 */
$import("sina/sina.js");
$import("diy/imgURL.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/swfobject.js");
$import("diy/htmltojson.js");
$import("sina/core/dom/next.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("diy/smoothscroll.js");
$import("sina/core/dom/domInsert.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/byteLength.js");

App.bindVideo = function(_dom, _key, _value){
	var _addevent = Core.Events.addEvent;
    var _seevideo = App.seevideo;
	var _node = {};
	var _previewHTML = function(mid,mtype){
	   try {
	   	
		var str = decodeURIComponent(_value['title']);
		if (Core.String.byteLength(str) > 24) {
            str = Core.String.leftB(str, 24 - 1) + "...";
        }
		
	   	_value['title'] = str;
	   }catch(e){
	   }
	   return '<img width="120px" height="80px" alt="" src="' + _value['screen'] + '">\
          <div type="'+mtype+'" mid="'+mid+'" class="video_play">\
            <a shorturl_id="' +
		_key +
		'"  href="javascript:void(0);"><img title="'+_value['title']+'" src="'+scope.$BASEIMG+'style/images/common/feedvideoplay.gif"></a>\
          </div>';
	};
    //渲染媒体层
    var render = function(node,videoInfo,_previewdiv){
        //从未绑定过
        if(_previewdiv && _previewdiv.getAttribute("mbind")!='1'){
            //插入位置在图片之后的那个，因此需要先找一下有没有预览图片
            var inspos = {}
			
			if(Core.Dom.getElementsByClass(_previewdiv,'div','feed_img').length>0){
				inspos['dom']=Core.Dom.getElementsByClass(_previewdiv,'div','feed_img')[0];
				inspos['pos']='afterEnd';
			}else{
				inspos['dom']=_previewdiv;
                inspos['pos']='afterBegin';
			}
			var feed_img = $C('div');
            feed_img.className = 'feed_img';
            feed_img.innerHTML = _previewHTML(node['mid'],node['mtype']);
            Core.Dom.domInsert(inspos['dom'],feed_img,inspos['pos']);
            var cldr = feed_img.childNodes || feed_img.children;
            //预览图片
            cldr[0].src = videoInfo['screen'];
			_previewdiv.setAttribute("mbind",'1')
            var a = feed_img.getElementsByTagName('A')[0];
            _addevent(a,function(){
				node['node']=a;
                _seevideo(node,videoInfo)
            },'click'); 
        }
    };
    //区分每个链接是视频还是音频
    _dom.href = "javascript:void(0);";
    _dom.target = "";
	_node['mid']= _dom.parentNode.getAttribute("mid");
	var prevDiv = $E('prev_'+_node['mid']);
    var showvdiv = $E("disp_"+_node['mid']);
	_value['shorturl']= _key;
	_node['mtype']=_dom.parentNode.getAttribute("type");
    _addevent(_dom,  function(){
		_node['node']=_dom;
       _seevideo(_node,_value);
    }, 'click');
	if (!(scope.$pageid == "mblog" && _node['mtype'] == '1')) {
        render(_node, _value,prevDiv);
    }else{
	//单条微博页原创需要直接展现
        if (!_value) {
            return false;
        }
        //转发则不用展现，原创需要直接展现，大家一起抢多媒体展现资源，mbind为1是说明你已经抢不到了，受死吧！！
        if((!_value)||_node['mtype']!="1"||showvdiv.getAttribute("mbind")=='1'){
            return false;
        }
        var video = {
            mid: decodeURIComponent(_node['mid']),
            url: decodeURIComponent(_value["flash"]),
            title: _value["title"],
            shorturl: _value['shorturl'],
            ourl: decodeURIComponent(_value["url"]),
            mtype: _node['mtype']
        };
        var setswfobject = function(url,mid){
            var flashParams = {
                quality: "high",
                allowScriptAccess: "always",
                wmode: "transparent",
                allowFullscreen: true
            };
            var flashVars = {
                playMovie: "true"
            };
            swfobject.embedSWF(url, mid, "440", "356", "9.0.0", null, flashVars, flashParams);
        };
        var html = '<div class="MIB_linedot_l1"></div>\
		          <p><a href="http://sinaurl.cn/' +
                video['shorturl'] +
                '" target = "_blank" class="lose" title="' +
                video['ourl'] +
                '"><img alt="" title="" class="small_icon original" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' +
                video['title'] +
                '</a></p><div class="note_noflash" id="' +
                video['mid'] +'">'+ $CLTMSG['CD0180'].replace(/#\{shorturl\}/g, video['shorturl']) +'</div>';
        showvdiv.innerHTML = html;
        setswfobject(video['url'],video['mid']);
		showvdiv.setAttribute("mbind",'1');
    }   
};
App.bindMusic = function(_dom, _key, _value){
	var node={
		node:_dom,
		mid: _dom.parentNode.getAttribute("mid"),
		shorturl:_value
	};
	var _addevent = Core.Events.addEvent;
	_addevent(_dom,function(){
		App.listenmusic(node);
	},'click')
};

/*
 * 显示视频的div id="disp_"+mid
 * 
 * 隐藏缩略图div id="prev_"+mid
 * 
 * 
 */
App.seevideo = function(node,videoInfo){
    //运营页不展开
    if (scope.$pageid == "yunying_index") {
        return true;
    }
	var _vinfo = videoInfo;
	if (!_vinfo) {
		return false;
	}
	//判断用户点的是a链接还是小图标
	var el = node['node'].tagName=="A"?node['node']:node['node'].parentNode;
	//信息在<p mid="***" type="1">
	//type=1 原创 2转发原文 3 转发理由
    var video = {
        mid: node['mid'],
        url: decodeURIComponent(_vinfo["flash"]),
        title: _vinfo["title"],
        shorturl: _vinfo['shorturl'],
        ourl: decodeURIComponent(_vinfo["url"]),
        mtype: node['mtype']
    };
	
	var _showvdiv = $E("disp_"+video['mid']);
	var _imagediv = $E("prev_"+video['mid']);
	var checksame = function(vdiv,shorturl){
		//判断是否已经展开图片或者投票内容
		if(Core.Dom.getElementsByClass(vdiv, "A", "lose").length>0){
			if ("http://sinaurl.cn/" + shorturl == Core.Dom.getElementsByClass(vdiv, "A", "lose")[0].href) {
				return true;
			}
			else {
				return false;
			}
		}else{
			return false;
		}
	}
    var setswfobject = function(url,mid){
		var flashParams = {
	        quality: "high",
	        allowScriptAccess: "always",
	        wmode: "transparent",
	        allowFullscreen: true
   		};
	    var flashVars = {
	        playMovie: "true"
	    };
    	swfobject.embedSWF(url, mid, "440", "356", "9.0.0", null, flashVars, flashParams);
	}
	
	var getvideoHTML = function(videocfg){
		if (videocfg) {
			//单条原创
			if (scope.$pageid == "mblog" && videocfg['mtype'] == "1") {
			return '<div class="MIB_linedot_l1"></div>\
			    <p><a href="http://sinaurl.cn/' +
				videocfg['shorturl'] +
				'" target = "_blank" class="lose" title="' +
				videocfg['ourl'] +
				'"><img alt="" title="" class="small_icon original" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' +
				videocfg['title'] +
				'</a></p><div class="note_noflash" id="' +
				videocfg['mid'] +'">'+ $CLTMSG['CD0180'].replace(/#\{shorturl\}/g, videocfg['shorturl']) +'</div>';	
			}
			else{
				if (videocfg['mtype'] == "1") {
					return '<div class="MIB_assign_t"></div>\
					<div class="MIB_assign_c MIB_txtbl">\
					<div class="blogPicOri">\
		                <p>\
						<a href="javascript:;" onclick="App.closevideo(\'' +
					videocfg['mid'] +
					'\');"><img alt="" title="" class="small_icon cls" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>'+$CLTMSG['CD0079']+'</a>\
							<cite class="MIB_line_l">|</cite>\
							<a href="http://sinaurl.cn/' +
					videocfg['shorturl'] +
					'" target = "_blank" class="lose" title="' +
					videocfg['ourl'] +
					'"><img alt="" title="" class="small_icon original" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' +
					videocfg['title'] +
					'</a>'+' <a style="margin-left:12px;" href="javascript:;" onclick="App.openVideoWindow(this);"><img alt="" title="" class="small_icon turn_r" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' + $CLTMSG['CX0221'] + '</a>'+'\
											</p>\
											 <div class="note_noflash" id="' +
					videocfg['mid'] +
					'">\
									  	' + $CLTMSG['CD0180'].replace(/#\{shorturl\}/g, videocfg['shorturl']) +'\
									  </div>\
											 </div>\
										</div>\
										<div class="MIB_assign_b"></div>';
				}
				else{
					return '<div class="MIB_linedot_l1" style="display: block;"></div>\
		                <p>\
						<a href="javascript:;" onclick="App.closevideo(\'' +
					videocfg['mid'] +
					'\');"><img alt="" title="" class="small_icon cls" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>'+ $CLTMSG['CD0079'] +'</a>\
							<cite class="MIB_line_l">|</cite>\
							<a href="http://sinaurl.cn/' +
					videocfg['shorturl'] +
					'" target = "_blank" class="lose" title="' +
					videocfg['ourl'] +
					'"><img alt="" title="" class="small_icon original" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' +
					videocfg['title'] +
					'</a>'+' <a style="margin-left:12px;" href="javascript:;" onclick="App.openVideoWindow(this);"><img alt="" title="" class="small_icon turn_r" src="'+scope.$BASEIMG+'style/images/common/transparent.gif"/>' + $CLTMSG['CX0221'] + '</a>'+'\
											</p>\
											 <div class="note_noflash" id="' +
					videocfg['mid'] +
					'">\
									  	'+ $CLTMSG['CD0180'].replace(/#\{shorturl\}/g, videocfg['shorturl']) +'\
									  </div>';
				}
			}
		}
	} 
	
	//隐藏缩略图
    if (_showvdiv && _showvdiv.style.display != "none") {
		if(!checksame(_showvdiv,video['shorturl'])){
			_showvdiv.innerHTML = getvideoHTML(video);
			setswfobject(video['url'],video['mid']);
			scroller(_showvdiv,1000,-60,0,true,true);
		}
	}else{
			_imagediv.style.display = "none";
			_showvdiv.innerHTML = getvideoHTML(video);
			setswfobject(video['url'],video['mid']);
			_showvdiv.style.display="";
			scroller(_showvdiv,1000,-60,0,true,true);
			
	}
	//-------------发送视频点击统计信息------------------
	try{
		scope.statistics({
			"video_url" : encodeURIComponent("http://sinaurl.cn/"+video['shorturl']),
			"title"     : encodeURIComponent(video['title']),
			'video_src_url' : encodeURIComponent(video['ourl'])
		});
	}catch(e){}
    	//----------------------------------------------
	return false;
};

//用户体验提升
App.openVideoWindow = (function(){
	var _next = function(elm){
		var o = $E(elm);
		var next = o.nextSibling;
		if(!next){
			return null;
		}
		if(next.nodeType !== 1){
			return _next(next);
		}
		return next;
	};
	
	var _video_window = false;
	
	return function(d){
		if(!_video_window){
			_video_window = $C('div');
			var _module = '\
			<table class="mBlogLayer">\
				<tr>\
					<td class="top_l"></td>\
					<td class="top_c"></td>\
					<td class="top_r"></td>\
				</tr>\
				<tr>\
					<td class="mid_l"></td>\
					<td class="mid_c">\
						<div class="layerBox">\
							<div style="padding:3px 0 3px 5px"><a href="javascript:void(0);" id="pop_video_window_close"><img src="'+scope.$BASEIMG+'style/images/common/transparent.gif" class="small_icon cls" />' + $CLTMSG['CX0222'] + '</a></div>\
							<div class="layerBoxCon" style="width:440px;" id="pop_video_window"></div>\
						</div>\
					</td>\
					<td class="mid_r"></td>\
				</tr>\
				<tr>\
					<td class="bottom_l"></td>\
					<td class="bottom_c"></td>\
					<td class="bottom_r"></td>\
				</tr>\
			</table>\
			';
			_video_window.innerHTML = _module;
			document.body.appendChild(_video_window);
			
			Core.Events.addEvent($E('pop_video_window_close'), function(){
				if(_videoplace.childNodes.length > 0){
					_video_window.style.display = 'none';
					_videoplace.removeChild(_videoplace.childNodes[0]);
				}
			}, 'click');
		}
		
		var _video = _next(d.parentNode);
		var _newvideo = _video.cloneNode(true);
		var _videoplace = $E('pop_video_window');
		
		// 算位置
		var _x = Core.Dom.getLeft(d);
		var _cssText = 'position:fixed;bottom:0px;right:0px;z-index:1000;_position:absolute';
		_video_window.style.cssText = _cssText;
		
		if(_videoplace.childNodes.length > 0){
			_videoplace.removeChild(_videoplace.childNodes[0]);
		}
		
		_videoplace.appendChild(_newvideo);
		
		//找到收起链接
		var _close = d.parentNode.getElementsByTagName('a')[0];
		
		_video_window.style.display = '';
		Core.Events.fireEvent(_close, 'click');
		
		//for ie6
		(function(){
			if($IE6 && _video_window.style.display == ''){
				_video_window.style.cssText = _cssText;
				setTimeout(arguments.callee, 200);
			}
		})();
	};
})();

App.closevideo = function(mid){
	var _showvdiv = $E("disp_"+mid);
	var _imagediv = $E("prev_"+mid);	
	var _img;
	if(Core.Dom.getElementsByAttr(_imagediv, "class", "imgSmall").length > 0){
		_img = Core.Dom.getElementsByAttr(_imagediv, "class", "imgSmall");
	} 
	else{
		_img = Core.Dom.getElementsByAttr(_imagediv, "className", "imgSmall");//可恶的ie6问题
	}
	if(_img.length > 0){
		var _bigimg = _img[0];
		App.shrinkImg(_bigimg);
	}
	_imagediv.style.display="";
	_showvdiv.style.display="none";
    _showvdiv.innerHTML = "";
    return false;
};

App.listenmusic = function(node){
	//判断用户点的是a链接还是小图标
	var el = node['node'].tagName=="A"?node['node']:node['node'].parentNode;
	el.target='';
	el.href='javascript:void(0);';
	var mid = node['mid']; 
	var shorturl = node["shorturl"];
	var music = {
        mid: decodeURIComponent(mid),
        url: decodeURIComponent(shorturl)
    };
	
	App.popUpMiniPlayer(music["mid"], music['url'])
	//scope.musicshow.focus();
	return false;
};

App.popUpMiniPlayer = function(mid,url){
	//var openURL = "/music/player.php";
	var openUrl = "http://music.sina.com.cn/yueku/t/player.html";
	var search = "";
	mid && url && (function(){
		search = ["?mid=",mid,"&url=",encodeURIComponent(url)].join("");
	})();
	//scope.musicshow = window.open([openUrl,search].join(""),$CLTMSG['CD0085'],'width=730,height=600,top='+(window.screen.height-600)/2+', left='+(window.screen.width-730)/2+', toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
	scope.musicshow = window.open([openUrl,search].join(""),'w_yuekuplayer','width=629,height=595,top='+(window.screen.height-600)/2+', left='+(window.screen.width-730)/2+', toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
	if(scope.musicshow){
		scope.musicshow.focus();
	}
};
