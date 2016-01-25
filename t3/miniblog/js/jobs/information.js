/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/comparejson.js');
$import("diy/prompttip.js");
$import('diy/check.js');
$import("diy/checkForm.js");
$import("diy/checkFormUI.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("diy/dateselecter.js");

$registJob('information', function(){
    try {
        //获取页面元素
        var _box = $E('information_box');
        var _submit = $E('submit');
        
        var _nick = $E('nickname');
        var _city = $E('city');
        var _province = $E('province');
        var _intrds = $E('mydesc');
        var _email = $E('email');
        var _qq = $E('qq');
        var _msn = $E('msn');
        var _idcard = $E('idcard');
        var _idType = $E('idtype');
        var _realname = $E('realname');
        
        var _red_nick = $E('red_nickname');
        var _red_prov = $E('red_prov');
        var _red_itrds = $E('red_mydesc');
        var _red_email = $E('red_email');
        var _red_qq = $E('red_qq');
        var _red_msn = $E('red_msn');
        var _red_idcard = $E('red_idcard');
        var _red_realname = $E('red_realname');
        
        var _pri_email = $E('pub_email');
        var _pri_qq = $E('pub_qq');
        var _pri_msn = $E('pub_msn');
        
        var _year = document.getElementsByName("Date_Year")[0], _month = document.getElementsByName("birthday_m")[0], _day = document.getElementsByName("birthday_d")[0];
        App.selecter(_year, _month, _day, parseFloat(_day.getAttribute("init_value")));
        var _blog = $E("blog"), _blogTip = $E("blogtip"), _pubBlog = $E("pubblog");
        if (window.location.href.indexOf("focus=blog") !== -1) {
            setTimeout(function(){
                _blog.focus();
            }, 100);
        }
        //将全局的方法私有化
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _html2json = App.htmlToJson;
        var _compjson = App.compareJson;
        var _bindCity = App.ProvinceAndCity;
        var _checkNick = App.checkMiniName;
        var _checkNicksp2 = App.checkNickSp2;
        var _checkMail = App.checkEml;
        var _checkQQ = App.checkQQNum;
        var _checkIdCard = App.checkIdCard;
        var _alert = App.alert;
        var _promptip = App.promptTip;
        
        //数据初始化
        var _provcode = _province.getAttribute('truevalue') || _province.value;
        var _citycode = _city.getAttribute('truevalue') || _city.value;
        var _pcObject = new _bindCity(_province, _city, _provcode, _citycode);
        var _oData = _html2json(_box);
        var _key = false;
        
        //局部的函数
        var success = function(json){
            _promptip($SYSMSG['A00006']);
            _key = false;
            _oData = _html2json(_box);
        };
        var error = function(json){
            if (json) {
                if (!App.Checkinfo.showError([json['code']])) {
                    _promptip($SYSMSG[json['code']], false, false, 'wrong');
                }
            }
            else {
                _promptip($SYSMSG['R01404'], false, false, 'error');
            }
            _key = false;
        };
        var errorInput = function(input, red, code){
            red.innerHTML = $SYSMSG[code];
            red.style.display = '';
            //_promptip.close();
        };
        var rightInput = function(input, red){
            red.style.display = 'none';
        };
        
        //checkForm
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
            'M01007': function(el){//省为空
                if (el.value != 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            //			'M01106' : function(el){//邮件
            //				el.value = _trim(el.value);
            //				if(el.value){
            //					if(_checkMail(el.value)){
            //						return true;
            //					}else{
            //						return false;
            //					}
            //				}else{
            //					return true;
            //				}
            //			},
            'M01123': function(el){//qq
                el.value = _trim(el.value);
                if (el.value) {
                    if (_checkQQ(el.value)) {
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
            'M01119': function(el){//自我介绍
                el.value = _trim(el.value);
                
                if (Core.String.byteLength(el.value) <= 140) {
                    return true;
                }
                else {
                    return false;
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
            'M01133': function(el){
                el.value = _trim(el.value);
                if (el.value.length <= 0 || _idType.value != "1") {
                    return true;
                }
                return _checkIdCard(el.value);
            },
            'M01191': function(el){//其它证件号码校验（3～20位数字,英文）--$SYSMSG['R01418']
                el.value = _trim(el.value);
                if (el.value.length <= 0 || _idType.value == "1") {
                    return true;
                }
                if (_idType.value != "1") {
                    return /^[0-9a-zA-Z]{3,20}$/.test(el.value);
                }
            },
            'M01135': function(el){
                el.value = _trim(el.value);
                if (el.value.length <= 0) {
                    return true;
                }
                if (Core.String.byteLength(el.value) > 16 || Core.String.byteLength(el.value) < 4) {
                    return false;
                }
                else {
                    return true;
                }
            },
            'M01136': function(el){
                el.value = _trim(el.value);
                if (/[0-9\s_><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(el.value)) {
                    return false;
                }
                else {
                    return true;
                }
            },
            "M01127": function(el){
                var value = _trim(el.value);
                if (value) {
                    $E("blogInfoTip").style.display = "none";
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
                    $E("blogInfoTip").style.display = "";
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
            'M01190': function(el){
                el.value = _trim(el.value);
                if (el.value) {
                    $E("blogInfoTip").style.display = "none";
                    return (Core.String.byteLength(el.value) <= 100);
                }
                else {
                    $E("blogInfoTip").style.display = "";
                    return true;
                }
            }
        };
        //$SYSMSG['longBlog'] = "最多可输入100字"; chibin modify 已在msg.js里注册 改为M01190
        
        _addEvent(_blog, function(){
            $E("blogInfoTip").style.display = "none";
        }, "focus");
        
        App.Checkinfo = App.checkForm(App.checkFormUI);
        App.Checkinfo.add('M01127', _blog, _blogTip, checkFunction['M01127']);
        App.Checkinfo.add('M01190', _blog, _blogTip, checkFunction['M01190']);
        
        App.Checkinfo.add('M01100', _nick, _red_nick, checkFunction['M01100']);
        App.Checkinfo.add('M01101', _nick, _red_nick, checkFunction['M01101']);
        App.Checkinfo.add('M01128', _nick, _red_nick, checkFunction['M01128']);
        App.Checkinfo.add('M01102', _nick, _red_nick, checkFunction['M01102']);
		App.Checkinfo.add('MR0037', _nick, _red_nick, checkFunction['MR0037']);
		App.Checkinfo.add('MR0038', _nick, _red_nick, checkFunction['MR0038']);
        //		App.Checkinfo.add('M01103',_nick,_red_nick,checkFunction['M01103']);
        App.Checkinfo.add('M01129', _nick, _red_nick, checkFunction['M01129']);
		App.Checkinfo.add('M01120', _nick, _red_nick, checkFunction['M01120']);
		App.Checkinfo.add('M01197', _nick, _red_nick, checkFunction['M01197']);
        App.Checkinfo.add('M01007', _province, _red_prov, checkFunction['M01007']);
        if (_email && _red_email) {
            //			App.Checkinfo.add('M01106',_email, _red_email,checkFunction['M01106']);
            _email.onfocus = function(){
                scope.updateEmail(_email);
            };
        }
        App.Checkinfo.add('M01123', _qq, _red_qq, checkFunction['M01123']);
        App.Checkinfo.add('M01126', _msn, _red_msn, checkFunction['M01126']);
		App.Checkinfo.add('M01125', _msn, _red_msn, checkFunction['M01125']);
        App.Checkinfo.add('M01119', _intrds, _red_itrds, checkFunction['M01119']);
        if (_idcard) {
            App.Checkinfo.add('M01133', _idcard, _red_idcard, checkFunction['M01133']);
            
            //其它证件号码校验（3～20英文，数字）--$SYSMSG['R01418']
            //$SYSMSG['otherID'] = "请输入正确的证件号码";//chibin modify 已注册到msg.js 改为M01191
            App.Checkinfo.add('M01191', _idcard, _red_idcard, checkFunction['M01191']);
            //
            
            _idType.onchange = function(){
                Core.Events.fireEvent(_idcard, 'blur');
            };
        }
        if (_realname) {
            App.Checkinfo.add('M01135', _realname, _red_realname, checkFunction['M01135']);
            App.Checkinfo.add('M01136', _realname, _red_realname, checkFunction['M01136']);
			App.Checkinfo.add('M01197', _realname, _red_realname, checkFunction['M01197']);
        }
        
        var oldnick = $E("oldnick");
        if (scope.isvip == 1) {
            var _eventType = $IE ? "propertychange" : "input"; //propertychange				
            try {
                _addEvent(_nick, function(event){
                    event = event || window.event;
                    if (oldnick.value != _nick.value && scope.isvip && ($IE ? event.propertyName == "value" : true)) {
                        var key = "M01137"
                        _red_nick.style.display = "";
                        _red_nick.className = 'cudTs3';
                        _red_nick.getElementsByTagName('TD')[4].innerHTML = $SYSMSG['M01137'];
                    }
                    else {
                        _red_nick.style.display = "none";
                    }
                }, _eventType);
            } 
            catch (e) {
            
            }
        }
        
        try {
            App.bindFormTips([{
                'el': _nick,
                'key': 'R01001'
            },            //			{
            //				'el': _email,
            //				'key': 'R01002'
            //			},
            {
                'el': _qq,
                'key': 'R01003'
            }, {
                'el': _msn,
                'key': 'R01004'
            }, {
                'el': _intrds,
                'key': 'R01005'
            }, {
                'el': _idcard,
                'key': 'R01101'
            }, {
                'el': _realname,
                'key': 'R01102'
            }, {
                'el': _blog,
                //'key':"blogTip"
                'key': "M01192"
            }]);
            
            //$SYSMSG["blogTip"] = "例如http://blog.sina.com.cn/sinat"; chibin modify 已注册到msg.js
        
        } 
        catch (exp2) {
        }
        
        try {
            if (_pri_email) {
                var check_pri_email = function(){
                    //					if(_trim(_email.value) != ''){
                    //						_pri_email.disabled = false;
                    //					}else{
                    //						_pri_email.disabled = true;
                    //					}
                };
                _addEvent(_email, check_pri_email, 'keyup');
                check_pri_email();
            }
            
            if (_pri_msn) {
                var check_pri_msn = function(){
                    //					if(_trim(_msn.value) != ''){
                    //						_pri_msn.disabled = false;
                    //					}else{
                    //						_pri_msn.disabled = true;
                    //					}
                }
                _addEvent(_msn, check_pri_msn, 'keyup');
                check_pri_msn();
            }
            
            if (_pri_qq) {
                var check_pri_qq = function(){
                    //					if(_trim(_qq.value) != ''){
                    //						_pri_qq.disabled = false;
                    //					}else{
                    //						_pri_qq.disabled = true;
                    //					}
                }
                _addEvent(_qq, check_pri_qq, 'keyup');
                check_pri_qq();
            }
        } 
        catch (ex) {
        }
        
        
        
        var nameUsable = true;
        var useingName = _nick.value;
        var checking = false;
        var ajaxCheckNickName = function(){
            if (_oData['nickname'] == _trim(_nick.value)) {
                nameUsable = true;
                checking = false;
                _nick.errorKey = false;
                return true;
            }
            //			if(App.Checkinfo.check(['M01100','M01101','M01128','M01102','M01103'])){
            if (App.Checkinfo.check(['M01100', 'M01101', 'M01128', 'M01102','MR0037'])) {
                useingName = _trim(_nick.value);
                Utils.Io.Ajax.request('/person/aj_checknick.php', {
                    'GET': {
                        'nickname': useingName
                    },
                    'onComplete': function(json){
                        try {
                            if (json.code == 'A00006') {
                                nameUsable = true;
                                _nick.errorKey = false;
                            }
                            else {
                                nameUsable = false;
                                App.Checkinfo.showError([json['code']]);
                                _nick.errorKey = json['code'];
                            }
                            checking = false;
                        } 
                        catch (exp2) {
                            nameUsable = true;
                            checking = false;
                        }
                    },
                    'onException': function(){
                        //error();
                        nameUsable = true;
                        checking = false;
                    },
                    'returnType': 'json'
                });
            }
        };
        /*
         * 成功后刷新旧数据
         */
		var refreshOldData = function(hashname,obj){
			for(var i in hashname){
				try {
					$E(i).value = obj[hashname[i]];
				}catch(e){}
			}
		}
        
        //全局的函数
        App.information = {};
        //提交函数
        App.information['submit'] = function(){
            if (checking) {
                setTimeout(App.information['submit'], 500);
            }
            else {
                setTimeout(function(){
                    if (nameUsable && App.Checkinfo.check()) {
                        App.information['rumor'](success, error);
                    }
                }, 100);
            }
            return false;
        };
        
        App.information['rumor'] = function(success, error){
            if (typeof success != 'function') {
                throw ('The publishRumor need a function as thrid parameter');
            }
            
            if (typeof error != 'function') {
                throw ('The publishRumor need a function as fourth parameter');
            }
            if (_key) {
                return false
            }
            _key = true;
            var parameters = _html2json(_box);
            if ($E("favorite_email") && $E("favorite_email").innerHTML != "") {
                parameters.cmail = $E("favorite_email").innerHTML;
            }
            
            if (_compjson(parameters, _oData)) {
                success();
            }
            else {
                Utils.Io.Ajax.request('/person/myinfo_post.php', {
                    'POST': parameters,
                    'onComplete': function(json){
                        if (json.code == 'A00006') {
                            success(json.data);
                            _oData = parameters;
							refreshOldData({'oldnick':'nickname','oldrealname':'realname'},parameters)
                            if (parameters.card_code) {
                                try {
                                    var stars = _idcard.value.substring(3, _idcard.value.length).replace(/\w/g, "*");
                                    _idcard.parentNode.innerHTML = '<p class="info_tabTip font_14">' + stars +
                                    _idcard.value.substring(_idcard.value.length - 3) +
                                    '</p>';
                                    _idType.parentNode.innerHTML = '<p class="info_tabTip font_14">' +
                                    _idType.options[_idType.selectedIndex].text +
                                    '</p>'
                                } 
                                catch (e) {
                                
                                }
                            }
                            scope.isvip && (delete scope.isvip);
                            
                            //修改邮件成功后显示为可修改状态
                            var mail = $E("email");
                            if (mail && Core.String.trim(mail.value).length > 0 && mail.type != "hidden") {
                                var tagName = mail.parentNode.tagName.toUpperCase();
                                if (tagName === "TD") {
                                    var option = $E("pub_email_option").value;
                                    var value = mail.value;
                                    mail.parentNode.innerHTML = '<p class="info_tabTip">' +
                                    '<span id="favorite_email" >' +
                                    mail.value +
                                    '</span>' +
                                    '<a id="modify_email" href="javascript:void(0);" ' +
                                    'onclick="scope.updateEmail(this)"> ' +
                                    $CLTMSG['CC1402'] +
                                    '</a>' +
                                    '<input type="hidden" class="PY_input" value="' +
                                    value +
                                    '" name="cmail" id="email"></p>' +
                                    '<p class="info_tabTip">\
												<select id="pub_email_option" name="pub_email">\
													<option selected="" value="0">' +
                                    $CLTMSG['CC2201'] +
                                    '</option>\
													<option value="2">' +
                                    $CLTMSG['CC2202'] +
                                    '</option>\
													<option value="1">' +
                                    $CLTMSG['CC2203'] +
                                    '</option>\
												</select>\
											</p>';
                                    $E("pub_email_option").value = option;
                                }
                            }
                            //
                        }
                        else {
                            if (json.code == 'A00001') {
                                App.alert({
                                    'code': 'A00001'
                                });
                            }
                            else {
                                error(json);
                            }
                        }
                    },
                    'onException': function(){
                        error();
                    },
                    'returnType': 'json'
                });
            }
            
        };
        _addEvent(_submit, function(){
            if (scope.isvip && oldnick.value != _nick.value) {
                App.cf = App.confirm({
                    code: "M01138"
                }, {
                    ok: function(){
                        App.information['submit']();
                    },
                    cancel: function(){
                        _nick.value = oldnick.value;
                    },
                    ok_label: $CLTMSG['CC2204']
                });
            }
            else {
                App.information['submit']();
            }
        }, 'click');
        _addEvent(_nick, function(){
            checking = true;
            ajaxCheckNickName();
        }, 'blur');
    } 
    catch (exp) {
    }
    
    //------------------------------------------------修改邮件操作--------------------------------------------
    scope.updateEmail = function(oUpdateEmail){
        var t = (new Date()).getTime(), okID = "ok_" + t, cancelID = "cancel_" + t;
        var initEmail = ($E("favorite_email") && $E("favorite_email").innerHTML) || "";
        var html = '<div style="margin-left:25px;"><div id="first_step">\
				<div class="mailBoxLayer" style="min-height:100px;height:100px;">\
				<p  class="gray6">' + $CLTMSG['CC2205'] + '</p>\
				<div class="inputBox">' +
        $CLTMSG['CC2206'] +
        '<input type="text" id="new_email" value="' +
        initEmail +
        '"   ></div>\
				<p id="email_error" style="display:none;" class="errorTs error_color">' +
        $CLTMSG['CC2207'] +
        '</p></div>\
				<div class="btns" style="margin-left:70px;">\
				<a id="' +
        okID +
        '" href="javascript:void(0);" class="btn_normal"><em>' +
        $CLTMSG['CC1102'] +
        '</em></a>\
				<a id="' +
        cancelID +
        '" href="javascript:void(0);" class="btn_normal"><em>' +
        $CLTMSG['CC1103'] +
        '</em></a>\
				</div></div>\
				<div id="next_step" class="mailBoxLayer"  style="display:none;">\
			    <p class="gray6">' +
        $CLTMSG['CC2208'] +
        '\
			    </p><br><div class="email" >\
			    <p class="fb font_18" id="modified_email" ></p>\
			    <a id="valid_email" target="_blank" href="/setting/mailnotice" class="btn_normal"><em>' +
        $CLTMSG['CC2209'] +
        '</em></a></div></div>\
			</div>';
        
        var dialog = App.customDialog(html, {
            icon: 5,
            width: 400,
            height: 180,
            title: "<strong id='title'>" + $CLTMSG['CC2210'] + "</strong>",
            ok_label: $CLTMSG['CC1102'],
            btns: []
        });
        
        var newEmail = $E("new_email"), emailError = $E("email_error");
        function checkEmail(){
            if (Core.String.trim(newEmail.value).length === 0) {
                return true;
            }
            if (App.checkEml(Core.String.trim(newEmail.value))) {
                emailError.style.display = "none";
            }
            else {
                emailError.style.display = "block";
            }
        }
        _addEvent(newEmail, checkEmail, 'blur');
        
        _addEvent($E(okID), function(){
            if (Core.String.trim(newEmail.value).length === 0) {
                var url = "http://t.sina.com.cn/person/mailnotice_unbind.php";
                App.doRequest({}, url, function(data, result){
                    dialog.close();
                    //解除绑定邮件成功后清空邮箱输入域，显示为可修改状态
                    var mail = $E("email");
                    if (mail.type == "hidden") {
                        var tagName = mail.parentNode.tagName.toUpperCase();
                        if (tagName === "P") {
                            var option = $E("pub_email_option").value;
                            mail.parentNode.parentNode.innerHTML = '<span id="favorite_email" style="display:none;"></span>' +
                            '<a id="modify_email" href="javascript:void(0);" onclick="scope.updateEmail(this)" ' +
                            'style="display: none;"> ' +
                            $CLTMSG['CC1402'] +
                            '</a>' +
                            '<input type="text" class="PY_input" value="" name="cmail" id="email">' +
                            '<p class="info_tabTip">\
										<select id="pub_email_option" name="pub_email">\
											<option selected="" value="0">' +
                            $CLTMSG['CC2201'] +
                            '</option>\
											<option value="2">' +
                            $CLTMSG['CC2202'] +
                            '</option>\
											<option value="1">' +
                            $CLTMSG['CC2203'] +
                            '</option>\
										</select>\
									</p>';
                            $E("pub_email_option").value = option;
                            $E("email").onfocus = function(){
                                scope.updateEmail($E("email"));
                            };
                        }
                    }
                    //
                
                }, function(result){
                    emailError.style.display = "block";
                    emailError.innerHTML = (result && result.code) ? $SYSMSG[result.code] : $CLTMSG['CC0901'];
                });
                
                return;
            }
            if (App.checkEml(Core.String.trim(newEmail.value))) {
                emailError.style.display = "none";
                var params = {
                    email: newEmail.value
                };
                var url = "http://t.sina.com.cn/person/mailnotice_active.php";
                App.doRequest(params, url, function(data, result){
                    $E("first_step").style.display = "none";
                    $E("next_step").style.display = "block";
                    $E("title").innerHTML = $CLTMSG['CC2211'];
                    $E("modified_email").innerHTML = newEmail.value;
                    if ($E("favorite_email")) {
                        $E("favorite_email").innerHTML = newEmail.value;
                    }
                    
                    //修改邮件成功后显示为可修改状态
                    var mail = $E("email");//new_email
                    if (mail && mail.type != "hidden") {
                        var tagName = mail.parentNode.tagName.toUpperCase();
                        if (tagName === "TD") {
                            var option = $E("pub_email_option").value;
                            var value = mail.value;
                            mail.parentNode.innerHTML = '<p class="info_tabTip">' +
                            '<span id="favorite_email" >' +
                            $E("new_email").value +
                            '</span>' +
                            '<a id="modify_email" href="javascript:void(0);" ' +
                            'onclick="scope.updateEmail(this)"> ' +
                            $CLTMSG['CC1402'] +
                            '</a>' +
                            '<input type="hidden" class="PY_input" value="' +
                            value +
                            '" name="cmail" id="email"></p>' +
                            '<p class="info_tabTip">\
										<select id="pub_email_option" name="pub_email">\
											<option selected="" value="0">' +
                            $CLTMSG['CC2201'] +
                            '</option>\
											<option value="2">' +
                            $CLTMSG['CC2202'] +
                            '</option>\
											<option value="1">' +
                            $CLTMSG['CC2203'] +
                            '</option>\
										</select>\
									</p>';
                            $E("pub_email_option").value = option;
                        }
                    }
                    //
                }, function(result){
                    emailError.style.display = "block";
                    emailError.innerHTML = (result && result.code) ? $SYSMSG[result.code] : $CLTMSG['CC0901'];
                });
            }
            else {
                emailError.style.display = "block";
            }
        }, "click");
        
        _addEvent($E(cancelID), function(){
            dialog.close();
        }, "click");
    };
    
    var oUpdateEmail = $E("modify_email");
    if (oUpdateEmail) {
        oUpdateEmail.onclick = function(){
            scope.updateEmail(oUpdateEmail);
        };
    }
});
