/*
 * Copyright (c) 2007, Sina Inc. All rights reserved. 
 * @fileoverview 通过iframe加载子域数据的方法
 */
/**
 *  @author  xp   | yanbo@staff.sina.com.cn
 *			stan | chaoliang@staff.sina.com.cn
 *  @class   ajax with via a iframe
 *	@update  
 *		Support cancel mechanism.
 *		Support request queue.
 *		remove junk elements such as temporary created Form for post method.
 *	@TODO
 *		replace Prototype-DOM methods(getWin()) with native methods for speeding-up.
 *	@example
 *		//- get
		Utils.Io.Ijax.request("blog.sina.com.cn/test.php", {
			onComplete : function(resultText) {
				$Debug(resultText);
			},
			onException: function() {
				$Debug("error");
			}
		})
		//- post
		Utils.Io.Ijax.request("blog.sina.com.cn/test.php", {
			onComplete : function(resultText) {
				$Debug(resultText);
			},
			onException: function() {
				$Debug("error");
			},
			GET : {
				para1 : 1,
				para2 : 2
			}
		})
 *		
 */

// 载入需要的文件
$import("sina/utils/io/_io.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/string/encodeDoubleByte.js");

$import("sina/utils/url.js");

Utils.Io.Ijax = {
	
	/**
	 * 保存缓冲的任务列表
	 */
	arrTaskLists : [],
	/**
	 * 创建 iframe 节点用于载入数据，因为支持双线程，同时建立两个，减少 DOM 操作次数
	 */
	createLoadingIframe: function () {
		if(this.loadFrames != null){
			return false;
		}
		/**
		 * 生成随机 ID 来保证提交到当前页面的数据交互 iframe
		 * L.Ming | liming1@staff.sina.com.cn 2009-01-11
		 */
		var rndId1 = "loadingIframe_thread" + Math.ceil(Math.random() * 10000);
		var rndId2 = "loadingIframe_thread" + Math.ceil((Math.random() + 1) * 10000);
		this.loadFrames = [rndId1, rndId2];
	    var html = '<iframe id="' + rndId1 +'" name="' + rndId1 +'" class="invisible"\
	              scrolling="no" src=""\
	              allowTransparency="true" style="display:none;" frameborder="0"\
	              ><\/iframe>\
				  <iframe id="' + rndId2 +'" name="' + rndId2 +'" class="invisible"\
	              scrolling="no" src=""\
	              allowTransparency="true" style="display:none;" frameborder="0"\
	              ><\/iframe>';
	    //Sina.dom.addHTML(document.body, html); 临时替换
		var oIjaxIframeCnt = $C("div");
		oIjaxIframeCnt.id = "ijax_iframes";
		oIjaxIframeCnt.innerHTML = html;
		$Debug("创建 Ijax 需要的 iframe");
		document.body.appendChild(oIjaxIframeCnt);
		// 记录两个 iframe 加载器，默认是空闲状态
		var loadTimer = setInterval(Core.Function.bind2(function(){
			if($E(this.loadFrames[0]) != null && $E(this.loadFrames[1]) != null){
				clearInterval(loadTimer);
				loadTimer = null;
				this.loadingIframe = {
					"thread1" : {
						"container" : $E(this.loadFrames[0]),
						"isBusy" : false
					},
					"thread2" : {
						"container" : $E(this.loadFrames[1]),
						"isBusy" : false
					}
				};		
				this.loadByList();
			}
		}, this), 10);
	},
	/**
	 * 判断是否可以开始加载数据，必须是两个 iframe 节点可用的情况下
	 */
	isIjaxReady: function () {
		if(typeof this.loadingIframe == "undefined"){
//			$Debug("this.loadingIframe 暂时不存在");
			return false;
		}
		for(var oLoadCnt in this.loadingIframe){
			if(this.loadingIframe[oLoadCnt].isBusy == false){
//				$Debug("加载器空闲...");
				this.loadingIframe[oLoadCnt].isBusy = true;
				return this.loadingIframe[oLoadCnt];
			}
		}
//		$Debug("加载器繁忙...");
		return false;			
	},
	/**
	 * 处理请求参数接收
	 * 
	 * @param url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
	 * @param option 可选参数 {
	 *  onComplete  : Function (Array responsedData),
	 *  onException : Function ();
	 *  GET : {}, 通过 GET 提交的数据
	 *  POST : {} 通过 POST 提交的数据
	 * }
	 */
	request: function (url, option) {
		var oTask = {};
		oTask.url = url;
		oTask.option = option || {};
		this.arrTaskLists.push(oTask);
//		$Debug("数据列表：" + this.arrTaskLists.length);
		if(this.loadFrames == null){
			this.createLoadingIframe();
		}
		else{
			this.loadByList();
		}		
	},
	/**
	 * 缓冲列表管理
	 */
	loadByList: function () {
		// 如果等待列表为空，则终止加载
		if (this.arrTaskLists.length == 0) {
			// 重新建立 iframe
			return false;
		}
		// 取得两个加载器的状态，看是否有空闲的
		var loadStatus = this.isIjaxReady();
		if(loadStatus == false){
			return false;
		}
//		$Debug("加载开始...");	
		var newData = this.arrTaskLists[0];
		this.loadData(newData.url, newData.option, loadStatus);
		// 删除列表第一条
		this.arrTaskLists.shift();			
	},
	/**
	 * 加载单条数据
	 */
	loadData: function (url, option, loader) {
		var _url = new Utils.Url(url);
		if (option.GET) {
			for(var key in option.GET){
				_url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
			}					
		}		
		// 接口设置 Domain
		_url.setParam("domain", "1");
		// 接口增加随机数
		//modified by stan | chaoliang@staff.sina.com.cn
		//减少不必要的强制更新数据
		//_url.setParam("rnd", Math.random());
		_url = _url.toString();
//		$Debug("Ijax url : " + _url);
//		$Debug("Ijax id : " + loader.container.id);
		// 当前用于加载数据的 iframe 对象
		var ifm = loader.container;
		ifm.listener = Core.Function.bind2(function () {
			try{
				var iframeObject = ifm.contentWindow.document, sResult;
				// 临时函数
				var tArea = Core.Dom.byClz(iframeObject ,'textarea','')[0];
//				$Debug("有 TEXTAREA 对象么？" + (typeof tArea != "undefined"));
				if (typeof tArea != "undefined") {
					sResult = tArea.value;
				}
				else {
					sResult = iframeObject.body.innerHTML;
				}
//				$Debug("Ijax data : " + sResult);
				if(option.onComplete){
					option.onComplete(sResult);
				}
				else{
					option.onException();
				}
			}
			catch(e){
				if(option.onException){
					option.onException(e.message, _url.toString());
				}
			}
			loader.isBusy = false;
			Core.Events.removeEvent(ifm, ifm.listener, "load");
//			loader.src = ""; 重新建立 iframe
			this.loadByList();
		},this);
		Core.Events.addEvent(ifm, ifm.listener, "load");
		// 如果需要 post 数据
		if(option.POST){
//			$Debug("Ijax->post");
			var oIjaxForm = $C("form");
			oIjaxForm.id = "IjaxForm";
			oIjaxForm.action = _url;
			oIjaxForm.method = "post";
			oIjaxForm.target = ifm.id; 
			for(var oItem in option.POST) {
				var oInput = $C("input");
				oInput.type = "hidden";
				oInput.name = oItem;
				oInput.value = Core.String.encodeDoubleByte(option.POST[oItem]);
				oIjaxForm.appendChild(oInput);
			};
			document.body.appendChild(oIjaxForm);
//			setTimeout(function(){
				oIjaxForm.submit();
//			}, 2000);			
		}
		else{
			try{
				window.frames(ifm.id).location.href = _url;
			}catch(e){
				ifm.src = _url;
			};			
		}
	}
};