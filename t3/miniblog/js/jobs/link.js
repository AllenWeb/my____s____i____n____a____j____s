/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */

$import('diy/enter.js');
$import('jobs/base.js');
$import('jobs/request.js');
$import("diy/prompttip.js");
$import("sina/core/function/bind2.js");
$registJob("tab_select",function(){
	var els = ["sina","163","tianya","sohu","msn","other","baidu"];
	var str = {
		sina :"blog.sina.com.cn/yourname",
		qq   :"http://user.qzone.qq.com/yourname",
		"163":"http://yourname.blog.163.com/",
		tianya:"http://yourname.blog.tianya.cn ",
		sohu :"http://yourname.blog.sohu.com/",
		msn:"http://yourname.spaces.live.com/",
		other:"",
		baidu:"http://hi.baidu.com/yourname"
	};
	for(var i =0,len = els.length;i<len;i++){
		var id = els[i];
		var el = $E(id);	
		Core.Events.addEvent(el,select.bind2(el),"click");
	}
	var _defTip = $E("blogtip").innerHTML;
	var _lock = false;
	function select(){
		if( _lock ) return false;
		_defTip = str[this.id]?$CLTMSG['CC2401']+str[this.id].replace(/yourname/,'<em>yourname</em>'):"<br/>";		
		$E("blogtip").innerHTML = _defTip;
		for(var j=0;j<els.length;j++){
			var otherid = els[j];
			var other = $E(otherid);
			if(other == this){
				other.getElementsByTagName("img")[0].className = "selected";
			}else{
				other.getElementsByTagName("img")[0].className = "";
			}
		}		
	}	
	var blogurl = $E("blogurl");
	var sbbtn   = $E("submit");
	var disClass = "btn_notclick";
	var enableClass ="btn_normal";
	var link_set = $E("link_set");
	var link_show = $E("link_show");
	var link_cancel= $E("link_cancel");
	var link_num = $E("link_num");
	
	function submit (){
		var _url = Core.String.trim(blogurl.value);
		var url = "http://"+_url;
		var urlReg = /^((ht)|f|(rs))tp[s]?:\/\/([a-zA-Z0-9]|[-_])+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
		if(_url.length === 0 || (!urlReg.test(url) &&  !urlReg.test(_url) && _url)){
			App.promptTip({code:"M01127"},null,"system_information","error");
			return false;
		}
		if(sbbtn.className == disClass){
			return false;
		}else{
			sbbtn.className = disClass;
		}
		
		var _timer = null , _lastStr = $CLTMSG['CC2405'];		
		$E("blogtip").innerHTML = _lastStr;
		_timer = setInterval(function(){
			_lastStr = _lastStr.replace(/(\.+)$/g,function(){
					var _s = arguments[1];
					return _s.length >= 3 ? '.' : _s + '.';
				})
			if( $E("blogtip") ) $E("blogtip").innerHTML = _lastStr;
		},500)
						
		function cb(data,json){
			clearInterval( _timer );
			_lock = false;
			App.promptTip($CLTMSG['CC2402'],null,"system_information");				
			sbbtn.className = enableClass;	
			if(json.blogurl != ""){
				link_num.innerHTML = $CLTMSG['CC2403']+json.blogurl;
				link_show.style.display = "";
				link_set.style.display  = "none";
			}
		}		
		function ecb(json){
			clearInterval( _timer );
			_lock = false;
			$E("blogtip").innerHTML = _defTip;
			App.promptTip(json,null,"system_information","error");				
			sbbtn.className = enableClass;	
		}
		_lock = true;		
		App.doRequest({blogurl:_url},"/plugins/aj_editlink.php",cb,ecb);
		return false;
	}

	
	Core.Events.addEvent(sbbtn,submit,"click");
	
	/**
	 * 取消关联
	 */
	function linkcacel(){
		var url = "/plugins/aj_editlink.php";
		var oData = {
			blogurl:""
		};
		function cb(){
			link_show.style.display = "none";
			link_set.style.display  = "";
			blogurl.value = "";
			App.promptTip($CLTMSG['CC2404'],null,"system_information");
			$E("blogtip").innerHTML = _defTip;
		}
		function ecb(json){
			App.promptTip(json,null,"system_information","error");
			$E("blogtip").innerHTML = _defTip;
		}
		App.doRequest(oData,url,cb,ecb);
		return false;
	}
	Core.Events.addEvent(link_cancel,linkcacel,"click");
});
