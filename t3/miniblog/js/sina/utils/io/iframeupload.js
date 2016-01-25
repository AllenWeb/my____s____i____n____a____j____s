/**
 * @fileoverview 
 * 通过 iframe 上传文件
 * @description :
 *
 * @example

	     new Utils.Io.iframeUpload('postFrame').post(
	 			'picForm',
	 			'http://img.blog.sina.com.cn/upload.php',
	 			function(txt){
	 				alert(txt); //返回文本
	 			}
 			);
	 		
 * 
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008.08.26
 */
// 引入需要的文件
$import("sina/utils/io/_io.js");
$import("sina/sina.js");
$import("sina/core/function/bind2.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/class/extend.js");

Utils.Io.iframeUpload = Core.Class.create();

Core.Class.extend(Utils.Io.iframeUpload.prototype,{
	/**
	 * 初始化
	 * @param {Object} 目标上传 iframe 对象
	 * @author xs
	 */			
	initialize: function(frameId){
		this.ifr = $E(frameId);
		if (!this.ifr) {
			return;
		}
		this.ifr.actionCb = null;
	},
	/**
	 * 开始提交上传
	 * @param {Object}	上传表单 form 的 id
	 * @param {String}		上传图片的 url
	 * @param {Function}	上传成功的回调函数
	 * @param {Function}	上传开始执行的回调
	 * @param {Function}	上传结束执行的回调 (在回调成功之前执行)
	 * @param {Object}	超时控制对象， 例： { interval : 5000,  cb:  function(){ alert('超时回调'); } }
	 * @param {Object} 出错的时候调用 
	 * @author xs | flashsoft
	 * @other
	 *  新增出错回调
	 */
	post: function(formId, url, cb, start, end, timeout, err_func){
		this.f = $E(formId);
		if (!this.f) {
			return;
		}
//		this.f.getAttributeNode("action").nodeValue = url||this.f.getAttributeNode("action").nodeValue;
		this.f.action = url || this.f.action;
		this.f.method = 'POST';
		//this.f.enctype = "multipart/form-data";
		this.f.target = this.ifr.id;
		//init iframe
		this.ifr.actionCb = cb;
		this.ifr.ifrEvt = Core.Function.bind2(this.checkLoad, this.ifr);
		Core.Events.addEvent(this.ifr, this.ifr.ifrEvt, 'load');
		//this.ifr.onload = this.ifr.ifrEvt;
		this.ifr.onProgress 	= start || function(){};
		this.ifr.onProgressEnd	= end || function(){};
		this.ifr.onError = err_func || function () {};
		
		this.f.submit();				
		this.ifr.onProgress();	

		//上传图片加入超时机制
		if(timeout){
			this.ifr.timeoutFlag = setTimeout(Core.Function.bind2(function(){
					//中断上传
					this.abort();
					try{
						timeout.cb();
					}catch(e){}
			}, this), timeout.interval || 10000);
		}
	},
	checkLoad:function(){
		if (this.onProgressEnd) {
			this.onProgressEnd();
		}
		if (this.timeoutFlag) {
			clearTimeout(this.timeoutFlag);
		}
		if (!this.actionCb) {
			return;
		}
		try{
			var body  = this.contentWindow.document.body;
			this.actionCb(body.innerHTML);
			Core.Events.removeEvent(this,this.ifrEvt,'load');
		}catch(e){ 
			this.onError(e.reason);
			$Debug('iframeUpload error:"'+e.reason+'"');
		}
	},
	/**
	 * 终止上传
	 * @author xs
	 */
	abort:function(){
		this.ifr.actionCb = null;
		this.ifr.onProgress 	= function(){};
		this.ifr.onProgressEnd	= function(){};	
		this.ifr.location = "about:blank";
		Core.Events.removeEvent(this.ifr,this.ifr.ifrEvt,'load');
	}
});

$G('iframeUpload', Utils.Io.iframeUpload, 'xs', '通过Iframe 上传图片');