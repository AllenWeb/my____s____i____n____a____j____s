$import("sina/core/events/addEvent.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("diy/SimpleJSLoader.js");
$import("diy/builder3.js");

/**
 * 绑定第三方应用
 * @author liusong@staff.sina.com.cn 
 * @param {Object} oDom  必选参数，短链对象
 * @param {Object} sKey  必选参数，短链接认别特征码
 * @param {Object} oData 必选参数，短链数据
 */

App.bindApplication = (function(){
	var ce            = Core.Events,
		cs            = Core.String,
		add           = ce.addEvent,
		byteL         = cs.byteLength,
		leftB         = cs.leftB,
		ipad          = /\((iPad)/i.test(navigator.userAgent),
		aText         = ipad? 'javascript:;': '#',
		mblog         = $CONFIG.$pageid == 'mblog',
		lang          = $CONFIG.$lang == "zh"? "zh_cn": $CONFIG.$lang,
		ui            = {};
		ui['wraph']   = mblog? '': '<div class="MIB_assign_t"></div><div class="MIB_assign_c MIB_txtbl"><div class="blogPicOri"><p>';
		ui['wrape']   = mblog? '': '</div></div><div class="MIB_assign_b"></div>';
		ui['close']   = ['<cite><a dd="close" onclick="return false;" title="#{CD0079}" href="',aText,'"><img src="#{baseimg}style/images//common/transparent.gif" class="small_icon cls" title="#{CD0079}">#{CD0079}</a></cite><cite class="MIB_line_l">|</cite>'].join('');
		ui['loading'] = '<center><img style="padding-top:20px;padding-bottom:20px" src="http://timg.sjs.sinajs.cn/t3/style/images/common/loading.gif"/></center>';
		ui['content'] = ['<cite><a target="_blank" href="#{url}" title="#{url}"><img src="#{baseimg}style/images//common/transparent.gif" class="small_icon original">#{title,22}</a></cite></p><div dd="content">',ui['loading'],'</div>'].join('');
		ui['1']       = [ui['wraph'],(mblog? '':ui['close']),ui['content'],ui['wrape']].join('');
		ui['2']       = ['<div class="MIB_linedot_l1"></div><p>',ui['close'], ui['content']].join("");
	var valdateIpad = function(){
		
	};
	/**
	 * 初始化展示区
	 * @param {Object} type  类型标识 1:原创微博 2:转发微博
	 * @param {Object} prev  预览区
	 * @param {Object} disp  展示区
	 * @param {Object} key   短链接认别特征码
	 * @param {Object} data  短链数据
	 * @param {Object} mblog 是否为单条页
	 */
	var initDSP = function(type, prev, disp, key, data, mblog){
		var
		data = {
			'CD0079'  : $CLTMSG['CD0079'],
			'baseimg' : $CONFIG.$BASEIMG,
			'title'   : data.title || '',
			'url'     : data.url   || ''
		},
		builder = App.DomBuilder(ui[type].replace(/#\{(\w*)?,?(\d*)?}/g,function(sMatch, sKey, nLimit){
			var value = data[sKey] || '';
		    if( value && (nLimit = (nLimit*1)) && nLimit < byteL(value)){
				value = [leftB(value, nLimit),"..."].join('');
			}
		    return value;
		}),disp),
		cnt = builder.domList.content;
		//收起绑定
		add(builder.domList.close, function(){
			if(prev){prev.style.display = ''}
			disp.style.display = 'none';
			disp.innerHTML = '';
		}, "click");
		if(prev){prev.style.display = 'none'}
		disp.style.display = '';
		disp.style.visibility = 'visible';
		builder.add();
		//请求第三方应用显示内容
		var clock = setTimeout(function(){
			cnt.innerHTML = $CLTMSG['CL0915'];
		},10000);
		App.Jsonp(['http://api.t.sina.com.cn/widget/show.jsonp?source=3417389906&short_url=',key,'&lang=',lang,'&jsonp=#{jsonp}','&vers=3'].join(''), function(json){
			if(!json){return}
			clearTimeout(clock);
			if(json.result){
				cnt.innerHTML = json.result;
				setTimeout(function(){
					cnt.style.marginBottom = "1px";
				},0);
			}
			else if(json.error_code){
				cnt.innerHTML = $CLTMSG['CL0916'];
			}
		});
	};
	/**
	 * @param {Object} oDom  必选参数，短链对象
	 * @param {Object} sKey  必选参数，短链接认别特征码
	 * @param {Object} oData 必选参数，短链数据
	 */
	return function(oDom, sKey, oData){
		var fid = oDom.parentNode.getAttribute("mid"), type = oDom.parentNode.getAttribute('type'), disp = $E('disp_' + fid), prev = $E('prev_' + fid)||disp, mbind = prev.getAttribute('mbind');
		if(type == '3' || !disp){return}
		oDom.onclick = function(){
			return false;
		};
		var onopen = function(clear){
			clear!==1 && (disp.innerHTML = '');
			initDSP(type, prev, disp, sKey, oData, mblog);
		};
		add(oDom, onopen, 'click');
		if(mbind!=1){
			prev.setAttribute('mbind','1');
			//如果是单条页，并且非转发，则直接初始化展示
			if(mblog && type!='2'){
				onopen(1);
				return false;
			}
			//如果预览区还没有初始化，则插入预览
			var wrap = $C('div'), feedImg = Core.Dom.getElementsByClass(prev,'div','feed_img')[0];
			wrap.className = 'feed_img';
			wrap.innerHTML = ['<a href="',aText,'" onclick="return false;"><img class="imgicon" style="cursor:pointer" src="',oData.screen,'"></a></div>'].join('');
			if(feedImg){
				feedImg.parentNode.insertBefore(wrap, feedImg.nextSibling)
			}else{
				prev.insertBefore(wrap, prev.firstChild);
			}
			add(wrap, onopen, 'click');
		}
	};	
})();

//'<center><img style="padding-top:20px;padding-bottom:20px" src="http://timg.sjs.sinajs.cn/t3/style/images/common/loading.gif"/></center>';