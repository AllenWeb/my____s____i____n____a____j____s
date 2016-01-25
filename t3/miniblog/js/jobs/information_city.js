/**
 * @author lei hong | honglei@staff.sina.com.cn
 */
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/comparejson.js');
$import("diy/prompttip.js");
$import('diy/check.js');
$import("diy/checkForm.js");
$import("diy/checkFormUI_city.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("diy/dateselecter.js");
$registJob('information_city', function(){
    try {
        //获取页面元素
		var _apptype = $E('apptype'),_red_apptype = $E('red_apptype');
		var _realname = $E('realname'),_red_realname = $E('red_realname');
		var _mobile = $E('mobile'),_red_mobile = $E('red_mobile');
		var _province = $E('province'),_red_prov = $E('red_prov');
		var _city = $E('city'),_red_city = $E('red_city');
		var _address = $E('address'),_red_address = $E('red_address');
        var _qq = $E('qq'),_red_qq = $E('red_qq');
		var _msn = $E('msn'),_red_msn = $E('red_msn');
		var _email = $E('email'),_red_email = $E('red_email');
        var _special = $E('special'),_red_special = $E('red_special');
		var _works = $E("works"),_red_works = $E("red_works");
		var _submit = $E('apply_sub');

        //将全局的方法私有化
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _compjson = App.compareJson;
        var _bindCity = App.ProvinceAndCity;
        var _checkNick = App.checkMiniName;
        var _checkNicksp2 = App.checkNickSp2;
        var _checkMail = App.checkEml;
		var _checkRealName = App.checkRealName;
        var _alert = App.alert;
		var _promptip = App.promptTip;
		var checkQQNum = function(str){
		if(new RegExp("^[1-9][0-9]{4,11}$").test(str)){
			return true;
		}else{
			return false;
		}
	};
		/*var checkNum = function(num){
			return /^1\d{10}$/.test(num);
		}*/
		var check_validate = function(num){
		//var reg = /^(\d{2,4})-(\d{7,8})$/;  
		var reg = /^[0-9][0-9\-]{5,18}[0-9]$/;
		 	return reg.test(num);
		 }
		 //圆角转半角
		 function FullToDBC(obj){
         	var Str = obj.value;
            var DBCStr = "";
            for(var i = 0; i < Str.length; i++){
                var c = Str.charCodeAt(i);
                if(c == 12288){
                    DBCStr += String.fromCharCode(32);
                    continue;
                }
                if(c > 65280 && c < 65375){
                    DBCStr += String.fromCharCode(c - 65248);
                    continue;
                }
                    DBCStr += String.fromCharCode(c);
                }
                obj.value = DBCStr;
        }
        //数据初始化
        var _provcode = _province.getAttribute('truevalue') || _province.value;
        var _citycode = _city.getAttribute('truevalue') || _city.value;
		//$CLTMSG["CX0116"]='城市/地区';
        var _pcObject = new _bindCity(_province, _city, _provcode, _citycode);
        var _key = false;
        var checkFunction = {
            'M01100': function(el){//查空
                el.value = _trim(el.value);
                if (el.value) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01101': function(el){//昵称的字数限制2－20
                el.value = _trim(el.value);
                var lens = Core.String.byteLength(el.value);
                if (lens >= 4 || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01102': function(el){//昵称的字数限制2－20
                el.value = _trim(el.value);
                var lens = Core.String.byteLength(el.value);
                if (lens <= 20 || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01128': function(el){//全数字
                el.value = _trim(el.value);
                if (!/^[0-9]*$/.test(el.value) || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01103': function(el){//怪字符
                el.value = _trim(el.value);
                if (_checkNick(el.value) || el.value.length == 0) {
                    return true
                }
                else {
                    return false;
                }
            },
            'MR0046': function(el){//省为空
                if (el.value != 0){
                    return true;
                }
                else {
                    return false;
                }
            },
			/*'': function(el){//所在地为空
                if (el.value == '0'||el.value == '1000'){
                    return false;
                }
                else {
                    return true;
                }
            },*/
            'M01106' : function(el){//邮件
            	el.value = _trim(el.value);
            	if(el.value){
            		if(_checkMail(el.value)){
            			return true;
            		}else{
            			return false;
            		}
            	}
				else{
            		return true;
            	}
            },
            'M01123': function(el){//qq
                el.value = _trim(el.value);
                if (el.value) {
                    if (checkQQNum(el.value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            },
			'M16104': function(el){//mobile正确
                el.value = _trim(el.value);
                if (el.value) {
                    if (check_validate(el.value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            },
			'MR0048': function(el){//mobile常用
                el.value = _trim(el.value);
                if (el.value) {
                    if (el.value=='') {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            },
			'M01125': function(el){//MSN 长度限制
                el.value = _trim(el.value);
                if (el.value) {
                    if (Core.String.byteLength(el.value) <= 64) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            },
            'M01126': function(el){//MSN
                el.value = _trim(el.value);
                if (el.value) {
                    if (_checkMail(el.value)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            },
            'M16106': function(el){//特长简介
                el.value = _trim(el.value);
                
                if (Core.String.byteLength(el.value) <= 200) {
                    return true;
                }
                else {
                    return false;
                }
            },
			'M16107': function(el){//address
                el.value = _trim(el.value);
                if (Core.String.byteLength(el.value) <= 100) {
                    return true;
                }
                else {
                    return false;
                }
            },
			'M16108': function(el){//"请输入您的详细地址"
                el.value = _trim(el.value);
                if (Core.String.byteLength(el.value) == 0) {
                    return false;
                }
                else {
                    return true;
                }
            },
            'M01129': function(el){//昵称重复
                return true;
            },
			'M01120': function(el){//昵称有反动文字
				return true;
			},
			'M01197':function(el){//真实姓名的反动字符
				return true;
			},
            'MR0040': function(el){//真实姓名不能低于4个字母或2个汉字
                el.value = _trim(el.value);
                if (Core.String.byteLength(el.value) < 4) {
                    return false;
                }
                else {
                    return true;
                }
            },
			'MR0041': function(el){//真实姓名不能超过16个字母或8个汉字
                el.value = _trim(el.value);
                if (Core.String.byteLength(el.value) > 16) {
                    return false;
                }
                else {
                    return true;
                }
            },
            'MR0042': function(el){//真实姓名不能包含数字
                el.value = _trim(el.value);
				if(/[0-9]+/.test(el.value)){
					return false;
				}else{
					return true;
				}
            },
         /* 'MR0043': function(el){//真实姓名只支持中英文，请修改
                el.value = _trim(el.value);
                if (/[><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(el.value)) {
                    return false;
                }
                else {
                    return true;
                }
            },*/
			'MR0043': function(el){//真实姓名只支持中英文，请修改
                el.value = _trim(el.value);
                if (/^([\u4E00-\u9FA5]|[A-Za-z0-9])*$/.test(el.value)) {
                    return true;
                }
                else {
                    return false;
                }
            },
			/*'MR0044': function(el){//真实姓名不能包含空格或下划线
                el.value = _trim(el.value);
				if(/[\s_]+/.test(el.value)){
					return false;
				}else{
					return true;
				}
            },*/
            "MR0047": function(el){//作品链接地址
                var value = _trim(el.value);
                if (value) {
                    $E("worksInfoTip").style.display = "none";
                    if (Core.String.byteLength(value) < 100) {
                        if (value === "http://") {
                            return false;
                        }
                        if (value.indexOf("http://") === -1) {
                            value = "http://" + value;
                        }
                        return App.checkURL(value);
                    }
                }
                else {
                    $E("worksInfoTip").style.display = "";
                    return true;
                }
            },
            'MR0037': function(el){
                var value = _trim(el.value);
                if (value) {
                    return _checkNicksp2(value);
                }
            },
			'MR0038': function(el){
                return true;
            },
			'MR0039': function(el){
				var value = _trim(el.value);
				if(value=="达人类型"){
					return false;
				}
                return true;
            }
        };
        _addEvent(_works, function(){
            $E("worksInfoTip").style.display = "none";
        }, "focus");
		_addEvent(_qq, function(){
           FullToDBC(_qq);
        }, "blur");
		_addEvent(_mobile, function(){
           FullToDBC(_mobile);
        }, "blur");
		_addEvent(_realname, function(){
           FullToDBC(_realname);
        }, "blur");
		App.Checkinfo = App.checkForm(App.checkFormUI);
		/*_addEvent(_province, function(){
        	App.Checkinfo.add('MR0047', _city, _red_prov, checkFunction['MR0047']);
        }, "change");
        */
		 _addEvent(_address, function(){
		 	if(_address.value=='详细地址'){_address.value=''}else{ return true;}
        }, "focus");
        App.Checkinfo = App.checkForm(App.checkFormUI);
		App.Checkinfo.add('MR0039', _apptype, _red_apptype, checkFunction['MR0039']);
		App.Checkinfo.add('MR0047', _works, _red_works, checkFunction['MR0047']);
        App.Checkinfo.add('MR0046', _province, _red_prov, checkFunction['MR0046']);
        if (_email && _red_email) {
			App.Checkinfo.add('M01106',_email, _red_email,checkFunction['M01106']);
	    }
		App.Checkinfo.add('M16104', _mobile, _red_mobile, checkFunction['M16104']);
		App.Checkinfo.add('MR0048', _mobile, _red_mobile, checkFunction['MR0048']);//常用	
        App.Checkinfo.add('M01123', _qq, _red_qq, checkFunction['M01123']);
        App.Checkinfo.add('M01126', _msn, _red_msn, checkFunction['M01126']);
		App.Checkinfo.add('M01125', _msn, _red_msn, checkFunction['M01125']);
        App.Checkinfo.add('M16106', _special, _red_special, checkFunction['M16106']);
		App.Checkinfo.add('M16107', _address, _red_address, checkFunction['M16107']);
		App.Checkinfo.add('M16108', _address, _red_address, checkFunction['M16108']);
        if (_realname){
		//	App.Checkinfo.add('MR0044', _realname, _red_realname, checkFunction['MR0044']);
		    App.Checkinfo.add('MR0040', _realname, _red_realname, checkFunction['MR0040']);
            App.Checkinfo.add('MR0041', _realname, _red_realname, checkFunction['MR0041']);
			App.Checkinfo.add('MR0042', _realname, _red_realname, checkFunction['MR0042']);
			App.Checkinfo.add('MR0043', _realname, _red_realname, checkFunction['MR0043']);
        }
        var oldnick = $E("oldnick");
        if (scope.isvip == 1) {
            var _eventType = $IE ? "propertychange" : "input"; //propertychange				
        }
        try {
            App.bindFormTips([
			{
            	'el': _email,
            	'key': 'R01002'
           	},
			{
                'el': _mobile,
                'key': 'M16103'
            },
			{
                'el': _qq,
                'key': 'R01003'
            },
			{
                'el': _msn,
                'key': 'R01004'
            },
			{
                'el': _special,
                'key': 'M16106'
            }, 
			{
                'el': _realname,
                'key': 'R01102'
            }, 
			{
                'el': _address,
                'key': 'M16108'
            },
			{
                'el': _works,
                'key': 'M16105'
            }]);
        } 
        catch (exp2) {
        }
        //提交函数
         _addEvent(_submit, function(){
            if (App.Checkinfo.check()) {
				document.forms['applyform'].submit();
            }
            else {
		if($IE&&_mobile.value==''){
		App.Checkinfo.add('MR0048', _mobile, _red_mobile, checkFunction['MR0048']);//常用
		//App.Checkinfo.add('M16104', _mobile, _red_mobile, checkFunction['M16104']);
		}
				return false;
            }
        }, 'click');
    }
    catch (exp) {
    }
});