$import("sina/sina.js");
$import("sina/core/dom/insertAfter.js");
$import("diy/imgURL.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("diy/getimgsize.js");
$import("diy/curtain.js");
$import("jobs/rotate.js");
$import("sina/core/base/detect.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/smoothscroll.js");
$import("diy/comm/crc32.js");

/**
 * 收缩图片
 * @param{String}_fid: feedID
 * */
// 重新修正收缩图片代码 pjan 2010-4-7
App.shrinkImg = function(_fid){
	//基础方法
	var $w = window, $d = $w["document"], $e = $d["documentElement"]||{};
	var $t = function(){
		if(arguments.length > 0){
			$e.scrollTop = arguments[0];
			$d["body"].scrollTop = arguments[0];
			return;
		}
		return ($w.pageYOffset||Math.max($e.scrollTop, $d["body"].scrollTop));
	};
	var $s = $w["innerHeight"] || ($e && $e["clientHeight"]) ? $e["clientHeight"] : $d["body"]["clientHeight"];
	var $xy = Core.Dom.getXY;
	/**
	 * 获取对象y坐标
	 * @param {Object} el
	 */
	var $y = function(el){
		var et,pn;
		if ('getBoundingClientRect' in el) {
				et = el.getBoundingClientRect().top;
				return et + $t();
		}
		if(!(pn = el.offsetParent)){return 0}
		et = pn.offsetTop;
		while (pn && pn!=$d["body"]) {
			et += pn.offsetTop;
			pn = pn.offsetParent;
		}
		return et||0;
	};
	//获取对象距离浏览器窗口的高度
	var $sl = function(d, t){
		if(t){ //下面距离
			return $s - ($xy(d)[1] - $t());
		}else{//上面距离
			return $xy(d)[1] - $t();
		}
	};	

	var _dispContainer = $E('disp_' + _fid);
	var _prevContainer = $E('prev_' + _fid);
	
	//提升用户体验：收起的时候如果超过一条feed高度，那么保证下一条feed在可视范围
	var _li = _prevContainer.parentNode.parentNode;
	if(_li.nodeName.toLowerCase() !== 'li'){
		_li = _li.parentNode.parentNode;
	}
	var _dis = $sl(_li);
	
	_dispContainer.innerHTML = '';
	_dispContainer.style.display = 'none';
	_prevContainer.style.display = '';
	
	var _afterHeight = _li.offsetHeight;
	
	if((-_dis)  > _afterHeight){
		//显示当前查看的feed
		$t($t() + _dis);
		//不显示当前查看的feed，不过这样的话，用户不知道到了哪一条，还是会滚动到上面一条查看
		//$t($t() + _dis + _afterHeight);
	}
};

/**
 * 展开显示大图片
 * @param {Object} HTML DOM :<a> tag
 * @param {String} pid
 * @param {Boolean} bForward :是否是转发内容
 */
// 重新修改图片缩放代码 pjan 2010-4-7
App.scaleImg = function(dom, pid, bForward){
	var baseURI = scope.$BASEIMG+"style/images/",
		smallImg = {},
		defaultWidth = 440;//v2原创图片、转发图片最大宽度统一为440;
	smallImg.dom = dom.getElementsByTagName("IMG")[0];
	smallImg.initW = smallImg.dom.width;
	smallImg.initH = smallImg.dom.height;
	
	//判断是否是转发
	if(bForward && $IE6){//IE6下旋转后需要以此为基准调整
		defaultWidth -= 8;
	}
	//防止多次点击
	if(dom.loading && dom.loading.style.display === ''){
		return;
	}
	
	// 显示loading图标
	if(!dom.loading){
		var	loading = dom.loading = $C("img");
		loading.src =  baseURI + "common/loading.gif";
		Core.Dom.insertAfter(loading, dom, 'beforeend');
		loading.style.cssText = ['position:absolute','top:' + (smallImg.initH/2 -10) + 'px' , 'left:' + (smallImg.initW/2 -10) + "px",
		  'background-color:transparent','border:0px','width:16px','height:16px','z-index:1001'].join(";");
	}else{
		dom.loading.style.display = "";
	}
	//获取图片大小后的回调函数
	var getImgSize = function(size){
		var newImgSize = {};
		if(size[0] > defaultWidth){
			newImgSize.width = defaultWidth;
			newImgSize.height = Math.round(size[1]*(defaultWidth/size[0]));
		} else {
			newImgSize.width = size[0];
			newImgSize.height = size[1];
		}
		slideShowImg(newImgSize);
	}
	
	// 开始出现大图片展示以及操作
	var slideShowImg = function(newImgSize){
		//获取展示区的id
		var getDisplayId = function(){
			var _prev = dom.parentNode.parentNode.getAttribute("id");
			return _prev.replace('prev_', '');
		};
		
		var _fid = getDisplayId();
		var _dispContainer = $E('disp_' + _fid);
		var _prevContainer = $E('prev_' + _fid);
		
		var	preView = $C("div");
		preView.className = "blogPicOri";
		var imgId = "loaded" + (new Date().getTime());
		var rotateLeft = "left" + (new Date().getTime())+Math.round(Math.random(100)*100000);
		var rotateRight = "right" + (new Date().getTime())+Math.round(Math.random(100)*100000);
		var iconURI = baseURI + "/common/transparent.gif";
		try{
			scope.statistics({
				"type":"open_img",
				"source":encodeURIComponent(App.imgURL(pid, "bmiddle")
			)});
		}catch(e){}
		
		var preView_innerHTML = '\
		    <p>\
		        <cite>\
		            <a href="javascript:;" onclick="App.shrinkImg(\'' + _fid + '\');">\
		            	<img title="' + $CLTMSG['CD0079'] + '" class="small_icon cls" src="'+iconURI+'">' + $CLTMSG['CD0079'] + '</a>\
		            <cite class="MIB_line_l">|</cite>\
		        </cite>\
		        <cite>\
					<a href="'+ App.imgURL(pid, pid.charAt(9)=='w'?'large':'orignal') +'" target="_blank">\
		            	<img  title="' + $CLTMSG['CD0080'] + '" class="small_icon original" src="'+iconURI+'">' + $CLTMSG['CD0080'] + '</a>\
		        </cite>\
		        <cite class="MIB_line_l">|</cite>\
		        <cite>\
		            <a id="'+rotateLeft+'" href="javascript:;"><img  title="' + $CLTMSG['CD0081'] + '" class="small_icon turn_l" \
		            	src="'+iconURI+'">' + $CLTMSG['CD0081'] + '</a>\
		        </cite>\
		        <cite>\
		            <a id="'+rotateRight+'" href="javascript:;" class="last_turn_r">\
		            	<img title="' + $CLTMSG['CD0082'] + '" class="small_icon turn_r" src="'+iconURI+'">' + $CLTMSG['CD0082'] + '</a>\
		        </cite>\
		    </p>\
		    <img id="'+imgId+'" class="imgSmall" \
		    	src="'+ App.imgURL(pid, "bmiddle") +'" \
		    	width="' + newImgSize.width + '" height="' + newImgSize.height + '" >\
		';
		if(bForward){
			preView.innerHTML = preView_innerHTML;
		}else{
			preView.innerHTML = '<div class="MIB_assign_t"></div><div class="MIB_assign_c MIB_txtbl"><div class="blogPicOri">' + preView_innerHTML + '</div></div><div class="MIB_assign_b"></div>';
			preView.className = 'MIB_assign';
		}
		
		//加载完成，loading隐藏
		dom.loading.style.display = "none";
		
		//预览区隐藏，展示区显示
		_dispContainer.style.display = '';
		_prevContainer.style.display = 'none';		
		
		if(bForward){//转发图片前面加分割线
			var	lineDot = $C("div");
			lineDot.className = "MIB_linedot_l1";
			_dispContainer.appendChild(lineDot);
			_dispContainer.appendChild(preView);
		}else{
			_dispContainer.appendChild(preView);
		}
		
		Core.Events.addEvent($E(imgId), function(){
			App.shrinkImg(_fid);
		}, "click");
		Core.Events.addEvent($E(rotateLeft), function(){
			App.rotate.rotateLeft(imgId,90,rotateCallback,defaultWidth);
		}, "click");
		Core.Events.addEvent($E(rotateRight), function(){
			App.rotate.rotateRight(imgId,90,rotateCallback,defaultWidth);
		}, "click");
		
		//try{ setTimeout(function(){scroller(_dispContainer,1000,-60,0,true,true)},10) }catch(e){}
		
		function rotateCallback(canvas){
			//重新附加光标样式
			canvas.className = "imgSmall";
			Core.Events.addEvent(canvas, function(){
				App.shrinkImg(_fid);
			}, "click");
			
			//图片居中(因为图片收缩后其样式被更改了)
			preView.parentNode.style.cssText = "text-align:center;width:100%;";
		}
	};
	
	new App.getImgSize(App.imgURL(pid, "bmiddle"), getImgSize);
};
