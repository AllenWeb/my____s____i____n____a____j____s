/**
 * @author haidong|haidong@staff.sina.com.cn
 * 手机绑定
 */
$import("sina/sina.js");
$import("jobs/base.js");
$import("sina/core/string/trim.js");
$import("diy/mb_dialog.js");
$import("diy/iframeMask.js");
$import("sina/core/dom/getXY.js");
$import("diy/dom.js");
$import("diy/widget/poplayer.js");
$import("diy/widget/dragdrop.js");

$registJob("initPage",function(){
	var $addEvent = Core.Events.addEvent;
	var $setStyle = function(el, property, val){
		Core.Dom.setStyle(el, property, val);
		return el;
	};
	var $trim     = Core.String.trim;
	
	var status = $E("pagestatus");	
	/**
	 * 验证手机号
	 * @param {Object} num
	 */
	var checkNum = function(num){
		return /^1\d{10}$/.test(num);				
	};
	/**
	 * 是否为电信用户
	 * @param {Object} num
	 */
	var checkDX = function(num){
		return /^1(33|53|89|80)/.test(num);
	};
	/**
	 * 提交前验证
	 * @param {Object} num
	 * @param {Object} numError
	 * @param {Object} item
	 */
	var check = function(num,item,error){		
		if(!checkNum(num)){
			$setStyle(error,"visibility","visible").innerHTML = $CLTMSG['CC3201'];
			return 0;
		}else{
			$setStyle(error,"visibility","hidden").innerHTML = "";
		}		
		if(!item.checked){			
			$setStyle(error,"visibility","visible").innerHTML = $CLTMSG['CC3202'];
			return 0;
		}else{
			$setStyle(error,"visibility","hidden").innerHTML = "";
		}		
		return 1;
	};
	/**
	 * ajax请求
	 * @param {Object} url
	 * @param {Object} param
	 * @param {Object} cb
	 * @param {Object} ecb
	 */
	var request = function(url,param,cb,ecb){
		param = param||{};
		cb    = cb||function(){};
		ecb   = ecb||function(){};
		Utils.Io.Ajax.request(url,{
			onComplete:function(json){					
				if(json.code == "A00006"){
					cb(json);	
				}else{
					ecb(json);	
				}				
			},
			onException:function(){	
				ecb(json);			
			},
			POST:param,
			method:"post",
			returnType:"json"
		});
	};
	var mobilebox = $E("mobilebox");
	var itembox   = $E("itembox");
	var itemcontent = $E("itemcontent");
	var mobileerrTip= $E("mobileerrTip"); 
	var postBtn   = $E("mobilebindbtn");
	var itemwrap = $E("itemwrap");
	/**
	 * 提交手机绑定
	 */
	var postMobile = function(){
		var num = $trim(mobilebox.value);		
		if(check(num,itembox,mobileerrTip)){
			var show = $E("showmobilewrap");
			var set  = $E("setmobilewrap");
			if(show && set){
				var mobilenum = $E("mobilenum");			
				if(mobilebox.value == $trim(mobilenum.innerHTML)){
					$setStyle(show,"display","");
					$setStyle(set, "display","none");							
					mobilebox.value = "";			
					return false;
				}				
			}					
			var param = {
				mobile:num
			};
			scope.isquit && (param.isquit =1 );
			function cb(json){	
				$setStyle(mobileerrTip,"visibility","hidden").innerHTML = "";
				location.reload();		
			}
			function ecb(json){
				if(json && json.code && json.code==="M06005"){
					return createUnbindLayer(num,json.telecom,json.mobile);
				}
				$setStyle(mobileerrTip,"visibility","visible").innerHTML = App.getMsg(json);
			}
			var surl = "/mobile/aj_bindmobile.php";
			request(surl,param,cb,ecb);
		}else{
			mobilebox.focus();
			mobilebox.select();
		}	
	};
	/**
	 * 关闭或者开启手机发送后的提醒
	 * @param {Object} el
	 */
	var closeRem = function(){		
		var el = this;
		var url = "/mobile/aj_setnotice.php";
		var status = el.rel;
		var cb = function(){
			if(status == "1"){
				el.innerHTML = $CLTMSG['CC3203'];
				$E('setsuccess').innerHTML = $CLTMSG['CC3204'];
				el.rel = 0;
			}else{
				el.innerHTML = $CLTMSG['CC3205'];
				$E('setsuccess').innerHTML = $CLTMSG['CC3206'];
				el.rel ="1";
			}
		};
		request(url,{isnotice:status},cb);
		return false;
	};
	/**
	 * 提交绑定
	 */
	$addEvent(postBtn,function(){
		postMobile();
		return false;	
	},"click");	
	/**
	 * 鼠标移出输入后电话号码的判断
	 */
	$addEvent(mobilebox,function(){
		var num = $trim(mobilebox.value);
		if(!checkNum(num)){
			return $setStyle(mobileerrTip,"visibility","visible").innerHTML = $CLTMSG['CC3201'];
		}
		//comment by chibin 现在支持电信了
//		if(checkDX(num)){
//			return $setStyle(mobileerrTip,"visibility","visible").innerHTML = "暂不支持中国电信手机用户，请谅解。";
//		}
		$setStyle(mobileerrTip,"visibility","hidden");
	},"blur");		
	/**
	 * 服务条款绑定
	 */
	$addEvent(itemcontent,function(){
		var id = 'itemwrap';
		var pid = id+'_panel';
		var panel = App.CommLayer(pid,{ismask:true,index:1300,width:'500px',title:$CLTMSG['CC0205']});
		panel.bd.style.cssText = 'padding:10px;margin:0 0 10px 0;height:280px;overflow-y:scroll;'
		panel.bd.innerHTML = $E(id).innerHTML;
		panel.show();
		
//		if(itemwrap.style.display == "none"){
//			$setStyle(itemwrap,"display","");
//		}else{
//			$setStyle(itemwrap,"display","none");
//		}
//		return false;
	},"click");
	
	var loopRequst = function(url,period){
		period = period||10000;
		var clearItv = function(){
			if(itv){
				clearInterval(itv);
				itv = null;
			}
		}
		var itv = setInterval(function(){
			request(url,{},function(){
				clearItv();				
				location.reload();
			})
		},period);
	};	
	/*
	 * js渲染已绑定手机号 
	 * chibin add 2010-2-9
	 */
	if($E("mobilenum")){
		$E("mobilenum").innerHTML = '<img src="/mobile/aj_mobile_number.php?uid='+scope.$uid+'&image=2"/>';
	}
	
	
	switch(status.value){		
		case "M06000":
		//未绑定		
		break;			
		case "M06001":
		//绑定中
		loopRequst("/mobile/aj_checkbind.php");
		
		var changeNumBtn = $E("changenum");
		var mobileNum    = $E("mobilenum");				
		/**
		 * 浮出层
		 */
		var layer = $E("validateLayer");
				
		var fixPosition = function(){			
			var pos   = Core.Dom.getXY($E("mobilebox"));
			var left  = ((document.documentElement.offsetWidth - layer.offsetWidth) /2) ;
			var top   = pos[1];	
			layer.style.left =  left +"px";
			layer.style.top  =  top +"px";	
			layer.style.zIndex = 110;
		};
		
		App.oMask = App.iframeMask(102,fixPosition);		
		App.oMask.show(layer.style.display = "");		
		fixPosition();	
		
		/**
		 * 点击修改
		 */			
		$addEvent($E("changemobilenum"),function(){
			if(App.oMask){
				App.oMask.hidden();
				layer.style.display = "none";
				mobilebox.value = $E("bindmobile_num").innerHTML ; 
				mobilebox.select();
			}
		},"click");
		break;
		
		case "M06002":
		//绑定成功
		var isnotice = $E("isnotice");
		/**
		 * 关闭提醒
		 */
		$addEvent(isnotice,closeRem.bind2(isnotice),"click");
		/**
		 * 取消绑定
		**/
		$addEvent($E("cancelBind"),function(){
			var url = "/mobile/aj_cancelbind.php";
			request(url,{},function(){
				location.reload();
			});
			return false;
		},"click");	
		//chibin modify 2010-2-9
		$addEvent($E("changeBind"),function(){
			request('/mobile/aj_mobile_number.php?uid='+scope.$uid+'&image=1',{},function(json){var show = $E("showmobilewrap");
			var set  = $E("setmobilewrap");
			$setStyle(show,"display","none");
			$setStyle(set, "display","");
			var mobilenum = $E("mobilenum");			
			mobilebox.value = $trim(json.data);	
			},function(){})
					
		},"click");
		
		$addEvent($E("cancelbtn"),function(){
			var show = $E("showmobilewrap");
			var set  = $E("setmobilewrap");
			$setStyle(show,"display","");
			$setStyle(set, "display","none");
			mobilebox.value = "";
		},"click");
		/**
		 * 更改号码
		 */			
		break;
	}	
	
	var unbindBox;
	/**
	 * 解除绑定提示层
	 * @param{Number}mobile
	 * @param{Boolean}isTelecom 是电信则发送到1066 8888 1，否则移动联通发送到1066 8888 66
	 * */
	function createUnbindLayer(mobile,isTelecom,isMobile){
		var to = isTelecom?"1066 8888 66":"1066 8888 66";
			to = isMobile?"1069 009 009":to;
		if(!unbindBox){
			var box = $C('div');
			box.id = 'unbind_box';
			box.className = "mobi_fl";
			box.style.cssText = "position: absolute;z-index: 1100;";
			var html = '\
		    <div class="mobi_flimg">\
		        <img width="41" height="41" src="http://i0.sinaimg.cn/dy/wbk/images1234/img_bigicon.gif">\
		    </div>\
		    <div class="mobi_fltxt">\
		        <p>\
		            '+$CLTMSG['CC3207']+'<span class="span_org" id="binded_num" >'+ mobile +'</span>'+$CLTMSG['CC3208']+'\
		        </p>\
		        <p>\
		            '+$CLTMSG['CC3209']+'\
		        </p>\
		        <p>\
		            <span class="span_org">"JCBD" </span>'+$CLTMSG['CC3210']+'<span class="span_org" id="unbind_to">'+ to +'。</span>\
		        </p>\
		        <p>\
		            <a style="margin-left:0px;" href="javascript:void(0);" onclick="$E(\'unbind_box\').style.display=\'none\';App.oMask.hidden();">'+$CLTMSG['CC3211']+'</a>\
		        </p>\
		    </div>';
		    box.innerHTML = html;
		    document.body.appendChild(box);
		    unbindBox = box;
		}else{
			$E('unbind_box').style.display = '';
			$E("binded_num").innerHTML = mobile;
			$E("unbind_to").innerHTML = to;
		}
		var scroll = App.Dom.getScroll();
		var winSize = App.Dom.getScreen();
		$E('unbind_box').style.top = Math.round(winSize.h/4 + scroll.t) + 'px';
		$E('unbind_box').style.left = Math.round((winSize.w - App.Dom.getStyle(box, 'width').replace('px', '') * 1) / 2 + scroll.l) + 'px';

		App.oMask = App.iframeMask(1000);		
		App.oMask.show();	
	    return unbindBox;
	}
});