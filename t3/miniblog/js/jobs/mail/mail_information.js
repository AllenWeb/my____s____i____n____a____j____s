/**
 * 邮件开通微博
 * @author liusong@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("diy/htmltojson.js");
$import("sina/core/string/byteLength.js");
$import("diy/checkForm.js");
$import("diy/enter.js");
$import('diy/provinceandcity.js');
$import("sina/core/array/foreach.js");
$registJob("mail_information", function(){
	try {
		var _trim       = Core.String.trim;
//		var _checkNick  = App.checkMiniName;
		var _html2json = App.htmlToJson;
		var _addEvent   = Core.Events.addEvent;
		//TODO url地址
		var _api        = "/mailbox/aj_full_info.php";
		//对像初始化
		var oElements = {
			"city"                   : $E("city"),
	//		"gender"                 : $E("gender"),
			"submit"                 : $E("submit"),
			"wrapper"                : $E("wrapper"),
			"nickname"               : $E("nickname"),
			"systemInformation"      : $E("system_information"),
			"systemInformationPanel" : $E("system_information_panel"),
			"province"               : $E("province")
		};
		
		var checkUI = function(key,noError,affect,error){
			if ( !error ) return;
			if(error.key && error.key !== key && noError){
				return false;
			}else{	
				showCUI(key,noError,error);
			}
		};
		
        function showCUI(key, noError, error){
			if ( !error ) return;
            if (noError) {		
                error.className = 'co_kd2 ok_color';
                error.innerHTML = "";
                error.key = false;
            }
            else {
		
                error.className = 'errorTs error_color';
                error.innerHTML = $SYSMSG[key] || $CLTMSG[key];
                error.key = key;
            }
        };
		
		var checkFunction = {
			'M01100' : function(el){ //不能为空
				var value = Core.String.trim(el.value || '')
				return !!value;
			},			
			'M01101' : function(el){//大于2个汉字
				el.value = _trim(el.value);
				var lens = Core.String.byteLength(el.value);
				if(lens >= 4 || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01102' : function(el){//小于20个汉字
				el.value = _trim(el.value);
				var lens = Core.String.byteLength(el.value);
				if(lens <= 20 || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01128' : function(el){//全数字
				el.value = _trim(el.value);
				if(!/^[0-9]*$/.test(el.value) || el.value.length == 0){
					return true;
				}else{
					return false;
				}
			},
			'M01103':function(el){
				var value = Core.String.trim(el.value || '')
				return /^[a-zA-Z0-9\u4e00-\u9fa5_.]*$/.test( value ) ;
			},
			'CF0106':function(el){
				var value = Core.String.trim(el.value || '')
				return !/^[_.]+|[_.]+$/.test( value ) ;
			},
			'M01007':function(el){
				return !(Core.String.trim(el.value) === '0');
			},
			'M01104':function(el){
				return true;
			}			
		}
		
		App.Checkinfo = App.checkForm(checkUI);			
		var _nickError = $E('nickname_error');
		oElements.nickname && Core.Array.foreach('M01100,M01101,M01102,M01128,CF0106,M01103'.split(','),function(v,i){
			App.Checkinfo.add(v,oElements.nickname,_nickError,checkFunction[v],'test');
		})		
		oElements.province && App.Checkinfo.add('M01007',$E("province"),$E("province_error"),checkFunction['M01007']);
		
		$E("male") && App.Checkinfo.add('M01104',$E("male"),$E("gender_error"),checkFunction['M01104'])
		$E("female") && App.Checkinfo.add('M01104',$E("female"),$E("gender_error"),checkFunction['M01104'])
		
		//绑定省市
		oElements.province && oElements.city && (function(p,c){
			new App.ProvinceAndCity(p, c, (p.getAttribute('truevalue') || p.value), (c.getAttribute('truevalue') || c.value));
		})(oElements.province,oElements.city)
		//开通后跳转到注册页
		var navigateTo = function(){
			window.location.href = "/mailbox/recommend_mailbox.php?contacts=" + encodeURIComponent(scope.$contacts) + '&feedback=' + encodeURIComponent(scope.$feedback);
		};
		//开通请求的回掉
		var cbBack = function(oJson){
			if( typeof oJson == "object" && oJson.code == "A00006"){
				navigateTo();
				return;
			};
			var msg = $CLTMSG["CD0036"];			
			(typeof oJson == "object") && oJson.code && (msg=$SYSMSG[oJson.code]||msg);
			var  _s, _p;
			_s = oElements.systemInformation;
			_p = oElements.systemInformationPanel;			
			_s && (_s.innerHTML = msg );
			_p && (_p.style.display = "table-row");
			
		}
		
		var checking = false , nameUsable = false,lastName = _trim( oElements.nickname.value );
		function ajaxCheckNickName( ){
			var useingName = _trim( oElements.nickname.value );
			if( lastName == useingName && nameUsable && !checking )  return; //如果是已经检查过并且没有在check的不再检查			
			lastName = useingName;
			if ( App.Checkinfo.check(['M01100', 'M01101', 'M01128', 'M01102', 'CF0106', 'M01103']) ) {
				checking = true;
				Utils.Io.Ajax.request('/mailbox/aj_checknick.php', {
					'GET'		: {'nickname' : useingName},
					'onComplete': function(json){
						try {
							if (json.code == 'A00006') {
								nameUsable = true;
								checking = false;
							}							
							showCUI(json.code,json.code == 'A00006',_nickError);
								//App.Checkinfo.showError([json['code']]);
						}catch(exp2){}
					},
					'onException': function(){
						nameUsable = true;
						checking = false;
					},
					'returnType': 'json'
				});
				
			}
		}
		oElements.nickname && _addEvent( oElements.nickname , ajaxCheckNickName, 'blur');
		oElements.nickname || ( nameUsable = true , ajaxCheckNickName = function(){} );
		
		
		//发布注册信息点击
		var sendTimer = null;		
		function sendSubmit(){
			clearTimeout(sendTimer);
			if( !checking && !nameUsable){
				ajaxCheckNickName();
			}
			if( checking ){ //如果正在检查	
				sendTimer = setTimeout( arguments.callee,50 );
				return;
			}
			var data = _html2json( oElements.wrapper );
			data.token = scope.$token?scope.$token:"";	
			nameUsable && Utils.Io.Ajax.request(_api, {
					"POST"        : data,
					"onComplete"  : cbBack,
					"onException" : cbBack,
					"returnType"  : "json"
				});
				
		}
		
		var submit = function(){
			if( oElements.wrapper && App.Checkinfo.check()){
				sendSubmit();
			}
		};
		//事件绑定
		oElements.submit && _addEvent(oElements.submit, submit, "click");
	}catch(e){}
});