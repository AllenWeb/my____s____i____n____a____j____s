/**
 * @author liusong@staff.sina.com.cn
 */
$import("sina/core/dom/getStyle.js")
$import("sina/utils/io/ajax.js");
(function(){
	//namespace
	var w = window;
	var d = w.document;
	var b = d.body;
	var l = w.location;
	/**
	 * 地址参数解析
	 */
	App.urlParam = function(){
		var o = {};
		var s = ("" + w.location.search).match(/\?([^?]*)/);
			s = s ? s[1] : null;
		if(s){
			s.replace(/([^&=]*)(?:\=([^&]*))?/gim, function(w, k, v){
				if(k && v){
					o[k] = decodeURIComponent(v);	
				}
	        });
		}
		return o;
	}
	/**
	 * 节点包装
	 * @param el       {HTMLElment} 必选参数，需要包装的对象
	 * @param position {String}     非必选参数，默认为static,如果被包装内容中有position:absolute则此项需要设置为relative其父级也应该为relative
	 */
	App.wipe = (function(){
		var wipeList = {};
		return function(el,position){
			var _,att;
			if(!(att = el.getAttribute("wipeid"))){
				_ = {},	el = $E(el);
				_.target = el;
				_.parent = _.target.parentNode;
				_.wrap = d.createElement("div");
				_.parent.insertBefore(_.wrap,el);
				_.wrap.appendChild(el);
				_.wrap.style.overflow = "hidden";
				_.wrap.style.display = "block";
				_.wrap.style.height = "0px";
				_.wrap.style.position = position||"static";
				_.target.style.display = "block";
				_.target.style.overflow = "hidden";
				_.target.style.visibility = "visible";
				_.offsetPaddingTop = parseInt(Core.Dom.getStyle(el,"paddingTop"));
				_.offsetPaddingBottom = parseInt(Core.Dom.getStyle(el,"paddingBottom"));
				_.offsetHeight = el.offsetHeight + _.offsetPaddingTop + _.offsetPaddingBottom;
				_.target.style.marginTop = -_.offsetHeight;
				att = "r_" + (new Date).getTime() + "_" + Math.ceil(Math.random()*1000);
				el.setAttribute("wipeid",att);
				wipeList[att] = _;
			}else{
				_ = wipeList[att];
			}
			return _;
		};
	})();
	/**
	 * 节点下滑
	 * @param {HTMLElment} el        必选参数，需要下滑的对象
	 * @param {Function}   fCallBack 非必选参数，滑动完成后回调
	 */
	App.wipeDown = function(el,fCallBack){
		var _ = App.wipe(el);
		_.timer = setInterval((function(_){
			var offset = -_.offsetHeight;
			var factorDesacceleration = 50;
			return function(){
				var s = offset * factorDesacceleration /500;
				offset -= s;
				offset = Math.min((offset*0.9)+1,0);
				if(offset==0){
					clearInterval(_.timer);
					if (fCallBack) {fCallBack()}
				}
				var height = (_.offsetHeight + offset)+"px";
				_.target.style.marginTop = offset + "px";
				_.wrap.style.height = height;
			}	
		})(_),20);
		return _;
	};
	
	App.io = (function(){
		var ins={},hash={};
		ins.register = function(id, oParam){
			hash[id] = hash[id] || oParam;
		};
		ins.fire = function(id,oParam){
			var data = {};
			data[hash[id]['method']] = oParam;
			data['onComplete'] = function(json){
				hash[id]['success'](json,oParam);
			};
			data['returnType'] = 'json';
			data['onException'] = function(){};
			Utils.Io.Ajax.request(hash[id]['url'],data);
		};
		return ins;
	})();
	App.login = function(){
		var prox = encodeURIComponent("http://v.t.sina.com.cn/widget/widget_prox.php");
		var loginPopWindow = window.open("login.php?url=" + prox,"miniblog_login",['toolbar=1,status=0,resizable=1,width=620,height=450,left=',(screen.width-620)/2,',top=',(screen.height-450)/2].join(""))
		loginPopWindow.focus();
	};
	var openState;
	/*App.login2 = function(){
		var login_div = $E("login_div");
		login_div.style.overflow = "hidden";
		var moveSque = 10;
		var moveStep = 10;
		var finalHeight = 300;
		if (openState) {
			var closeTime = window.setInterval(function(){
				var curHeight = login_div.offsetHeight;
				if(curHeight > moveStep){
					login_div.style.height = curHeight - moveStep + "px";
				}else{
					login_div.style.display = "none";
					openState = false;
					window.clearInterval(closeTime);
				}
			},moveSque)
		}
		else {
			login_div.style.height = "1px";
			login_div.style.display = "block";
			var showTime = window.setInterval(function(){
				var curHeight = login_div.offsetHeight;
				if (curHeight < finalHeight) {
					login_div.style.height = curHeight + moveStep + "px";
				}
				else {
					openState = true;
					window.clearInterval(showTime);
				}
			}, moveSque)
		}
	};*/
	App.login2 = function(){
		var login_div = $E("login_div");
		var param = App.urlParam()||{};
		param.height = param.height||600
		login_div.style.overflow = "hidden";
		var moveSque = 10;
		var average = 6;
		var finalHeight = param.height - $E("div_top").offsetHeight;
		if (openState) {
			var closeTime = window.setInterval(function(){
				var curHeight = login_div.offsetHeight;
				if(curHeight > 0){
					var moveStep = Math.ceil(curHeight/average);
					login_div.style.height = curHeight - moveStep + "px";
				}else{
					login_div.style.display = "none";
					openState = false;
					window.clearInterval(closeTime);
				}
			},moveSque)
		}
		else {
			login_div.style.height = "1px";
			login_div.style.display = "block";
			var showTime = window.setInterval(function(){
				var curHeight = login_div.offsetHeight;
				if (curHeight < finalHeight) {
					var moveStep = Math.ceil((finalHeight-curHeight)/average);
					login_div.style.height = curHeight + moveStep + "px";
				}
				else {
					openState = true;
					window.clearInterval(showTime);
				}
			}, moveSque)
		}
	};
	App.regist2 = function(){
		var loginPopWindow = window.open("full_info.php","miniblog_login",['toolbar=1,status=0,resizable=1,width=620,height=450,left=',(screen.width-620)/2,',top=',(screen.height-450)/2].join(""))
		loginPopWindow.focus();
	};
	
})();
