/**
 * @ chibin | chibin@staff.sina.com.cn
 * @ 二次新版注册页
 */
$import("jobs/base.js");
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/querytojson.js');
$import('diy/check.js');
$import('diy/enter.js');
$import("diy/prompttip.js");
$import("diy/checkForm.js");
$import("diy/checkFormUI2.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/sinput/sinput.js");
$import("diy/date.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/stopEvent.js");
$import("diy/constellation.js");
$import("diy/schoolSelector.js");

$registJob('finishinfo2', function(){
    try {
        var _box = $E('information_box');
        var _nickName = $E('nickname');
        var _province = $E('provnice');
        var _invitcod = $E('invitecode');
        var _city = $E('city');
        var _birth = $E('birth');
        var _mobile = $E('mobile');
        var _idType = $E('card_type');
        var _idcard = $E('card');
        var _schoolType = $E('school_type');
        if ($E('rdoboy') && $E('rdogirl')) {
            var _gender = [$E('rdoboy'), $E('rdogirl')];
        }
        var _red_nickName = $E('red_nickname');
        var _red_province = $E('red_province');
        var _red_invitcod = $E('red_invitecode');
        var _red_gender = $E('red_gender');
        var _red_mobile = $E('red_mobile');
        var _red_card = $E('red_card');
        //var _gender = $E('gender');
        var _submit = $E('submit');
        
        var _html2json = App.htmlToJson;
        var _query2json = App.queryToJson;
        var _bindCity = App.ProvinceAndCity;
        var _addEvent = Core.Events.addEvent;
        var _checkNick = App.checkMiniName;
        var _checkNicksp2 = App.checkNickSp2;
        var _checkIdCard = App.checkIdCard;
        var _trim = Core.String.trim;
        var _alert = App.alert;
        var _enter = App.enterSubmit;
        var _promptip = App.promptTip;
        
        var succHTML = '<div class="success"><img class="tipicon tip3" src="'+scope.$BASEIMG+'style/images/common/transparent.gif" alt="" title=""></div>';
        var errorHTML = '<div style="" class="errormt">\
                        <strong><span>请输入昵称</span></strong>\
                    </div>';
        if (_city) {
            new _bindCity(_province, _city, (_province.getAttribute('truevalue') || _province.value), (_city.getAttribute('truevalue') || _city.value));
        }
        
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
            'MR0038': function(el){
                return true;
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
            'M01130': function(el){//邀请码
                el.value = _trim(el.value);
                if (/^[0-9a-zA-Z]{5,32}$/.test(el.value) || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01131': function(el){//查空
                el.value = _trim(el.value);
                if (el.value) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'M01104': function(els){//性别
                for (var i = 0, len = els.length; i < len; i++) {
                    if (els[i].checked) {
                        return true;
                    }
                }
                return false;
            },
            'M01129': function(el){//昵称重复
                return true;
            },
            'MR0123': function(el){//手机号15位~~
                if (el.value.length > 15) {
                    return false;
                }
                return true;
            },
            'MR0124': function(el){//手机号查空~~
                el.value = _trim(el.value);
                if (el.value) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'MR0037': function(el){
                var value = _trim(el.value);
                if (value) {
                    return _checkNicksp2(value);
                }
            },
            'R01442': function(el){//证件类型判断
                if (_idType.value == '0') {
                    return false;
                }
                else {
                    return true;
                }
            },
            'R01007': function(el){//证件号码为空
                el.value = _trim(el.value);
                if (el.value && el.value != $SYSMSG['R01007']) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        
        App.Checkinfo = App.checkForm(App.checkFormUI2);
        var clientTips = [];
        if (_invitcod) {
            App.Checkinfo.add('M01130', _invitcod, _red_invitcod, checkFunction['M01130']);
            App.Checkinfo.add('M01131', _invitcod, _red_invitcod, checkFunction['M01131']);
            clientTips.push({
                'el': _invitcod,
                'key': 'R01009',
                'error': _red_invitcod
            });
        }
        
        if (_nickName) {
            App.Checkinfo.add('M01100', _nickName, _red_nickName, checkFunction['M01100']);
            App.Checkinfo.add('M01101', _nickName, _red_nickName, checkFunction['M01101']);
            App.Checkinfo.add('M01128', _nickName, _red_nickName, checkFunction['M01128']);
            App.Checkinfo.add('M01102', _nickName, _red_nickName, checkFunction['M01102']);
            //App.Checkinfo.add('M01103', _nickName, _red_nickName, checkFunction['M01103']);
            App.Checkinfo.add('M01129', _nickName, _red_nickName, checkFunction['M01129']);
            App.Checkinfo.add('MR0037', _nickName, _red_nickName, checkFunction['MR0037']);
			App.Checkinfo.add('M01120', _nickName, _red_nickName, checkFunction['M01120']);
			App.Checkinfo.add('MR0038', _nickName, _red_nickName, checkFunction['MR0038']);
            clientTips.push({
                'el': _nickName,
                'key': 'R01001',
                'error': _red_nickName
            });
        }
        if (_province) {
            App.Checkinfo.add('M01007', _province, _red_province, checkFunction['M01007']);
            clientTips.push({
                'el': _province,
                'key': 'M01007',
                'error': _red_province
            });
        }
        if (_city) {
            clientTips.push({
                'el': _city,
                'key': 'M01007',
                'error': _red_province
            });
        }
        if ($E('rdoboy')) {
            App.Checkinfo.add('M01104', _gender, _red_gender, checkFunction['M01104']);
        }
        
        if (_birth) {
            clientTips.push({
                'el': _birth
            });
            clientTips.push({
                'el': $E('pub_birthday_option')
            });
            
            clientTips.push({
                'el': $E('schlname')
            });
            clientTips.push({
                'el': $E('study_start_year')
            });
            clientTips.push({
                'el': $E('study_end_year')
            });
            
            clientTips.push({
                'el': $E('com_name')
            });
            clientTips.push({
                'el': $E('com_start_year')
            });
            clientTips.push({
                'el': $E('com_end_year')
            });
        }
        if (_mobile) {
            App.Checkinfo.add('MR0123', _mobile, _red_mobile, checkFunction['MR0123']);
            App.Checkinfo.add('MR0124', _mobile, _red_mobile, checkFunction['MR0124']);
             clientTips.push({
                'el': _mobile
            });
        }
        //身份证
        if (_idcard) {
            //            App.Checkinfo.add('M01133', _idcard, _red_card, checkFunction['M01133']);
            Core.Events.addEvent(_idcard, function(){
                if (_idcard.value === '') {
                    _idcard.value = $SYSMSG['R01007'];
                }
            }, 'blur');
            Core.Events.addEvent(_idcard, function(){
                if (_idcard.value === $SYSMSG['R01007']) {
                    _idcard.value = '';
                }
            }, 'focus');
            Utils.Sinput.limitMaxLen(_idcard, 40);
            App.Checkinfo.add('R01442', _idcard, _red_card, checkFunction['R01442']);//"证件类型判断"
            App.Checkinfo.add('R01007', _idcard, _red_card, checkFunction['R01007']);//"证件号码为空"
            //其它证件号码校验（3～20英文，数字）--$SYSMSG['R01418']
            //$SYSMSG['otherID'] = "请输入正确的证件号码";//已经注册到msg.js了 改为M01191
            //            App.Checkinfo.add('M01191', _idcard, _red_card, checkFunction['M01191']);
            //            App.Checkinfo.add('M01191', _idcard, _red_card, checkFunction['M01191']);
            //            _idType.onchange = function(){
            //                Core.Events.fireEvent(_idcard, 'blur');
            //            };
              clientTips.push({
                'el': _idcard
            });
        }
        if (_idType) {
            App.Checkinfo.add('R01442', _idcard, _red_card, checkFunction['R01442']);//"证件类型判断"
               clientTips.push({
                'el': _idType
            });
            _idType.onchange = function(){
                if (!checkFunction['R01442']()) {
                    Core.Events.fireEvent(_idcard, 'blur');
                }
                else {
                    if (!checkFunction['R01007'](_idcard)) {
                        //						Core.Events.fireEvent(_idcard, 'blur');
                        _red_card.style.display = "none";
                        _idcard.focus();
                    }
                    else {
                        Core.Events.fireEvent(_idcard, 'blur');
                    }
                }
            };
            _idType.onblur = function(){
                Core.Events.fireEvent(_idType, 'change');
            };
            //			App.Checkinfo.add('R01007', _idcard, _red_card, checkFunction['R01007']);//"证件号码为空"
        }
        if(_schoolType){
             clientTips.push({
                'el': _schoolType
            });
			
			Core.Events.addEvent(_schoolType, function(){
                $E('schlname').value = $CLTMSG['CC5827'];
				$E('info_school_id').value = '';
            }, 'change');
        }
        
        
        App.bindFormTips(clientTips);
        var nameUsable = true;
        var useingName = '';
        var checking = false;
        var suggestNick = [];
        scope.ajaxCheckNickName = function(){
            //$E('use_name').style.display = 'none'
            if (App.Checkinfo.check(['M01100', 'M01101', 'M01128', 'M01102', 'MR0037'])) {
                useingName = _trim(_nickName.value);
                if ($E('use_name').style.display !== 'none') {
                    $E('use_name').style.display = '';
                    $E('use_name').innerHTML += '<div class="loading"></div>';
                }
                Utils.Io.Ajax.request('/person/aj_checknick.php', {
                    'GET': {
                        'nickname': useingName
                    },
                    'onComplete': function(json){
                        try {
                            if (json.code == 'A00006') {
                                nameUsable = true;
                                _nickName.errorKey = false;
                                $E('use_name').style.display = 'none';
                            }
                            else 
                                if (json.code == 'M01129') {
                                    if (json.data.length > 0) {
                                        $E('use_name').style.display = '';
                                        suggestNick = suggestNick.concat(json.data);
                                        var showStr = '<h4 class="erroRed">' + $CLTMSG['CY0108'] + '</h4><ul>'
                                        for (var q = 0; q < json.data.length; q++) {
                                            showStr = showStr + '<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[q] + '\');" id="rdoo_' + (q + 1) + '" name="rdoo"><label for="rdoo_' + (q + 1) + '">' + json.data[q] + '</label></li>';
                                        }
                                        showStr = showStr + '</ul><span class="lastLi"><a href="javascript:void(0);" onclick="scope.ajaxCheckNickName()">' + $CLTMSG['CC0902'] + '</a></span>';
                                        //								var showStr = '<h4 class="erroRed">' + $CLTMSG['CY0108'] + '</h4>'+
                                        //								          	'<ul>'+
                                        //								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[0] + '\');" id="rdoo_1" name="rdoo"><label for="rdoo_1">' + json.data[0] + '</label></li>'+
                                        //								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[1] + '\');" id="rdoo_2" name="rdoo"><label for="rdoo_2">' + json.data[1] + '</label></li>'+
                                        //								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[2] + '\');" id="rdoo_3" name="rdoo"><label for="rdoo_3">' + json.data[2] + '</label></li>'+
                                        //								            	'<li><input type="radio" onclick="scope.changeUserNameFunc(\'' + json.data[3] + '\');" id="rdoo_4" name="rdoo"><label for="rdoo_4">' + json.data[3] + '</label></li>'+
                                        //								            '</ul>';
                                        
                                        $E('use_name').innerHTML = showStr;
                                    }
                                    App.Checkinfo.showError([json['code']]);
                                    nameUsable = false;
                                }
                                else {
                                    nameUsable = false;
                                    App.Checkinfo.showError([json['code']]);
                                    _nickName.errorKey = json['code'];
                                    $E('use_name').style.display = 'none';
                                }
                            checking = false;
                        } 
                        catch (exp2) {
                            nameUsable = true;
                            checking = false;
                        }
                    },
                    'onException': function(){
                        nameUsable = true;
                        checking = false;
                    },
                    'returnType': 'json'
                });
            }
        };
        scope.changeUserNameFunc = function(value){
            $E('use_name').style.display = 'none';
            $E('nickname').value = value;
            //$E('nickname').style.border = '#999 solid 1px';
            $E('red_nickname').innerHTML = succHTML;
            $E('nickname').parentNode.parentNode.className = "jh_yanzheng";
            //$E('nickname').style.backgroundColor = '#fff'; //border-color: rgb(255, 0, 0); background-color: rgb(255, 204, 204);
            
            $E('red_nickname').style.display = '';
            //$E('red_nickname').getElementsByTagName('SPAN')[0].innerHTML = '';
            nameUsable = true;
        }
        
        var _key = false;
        var success = function(json){
            //window.location.replace((_query2json(window.location.search.slice(1),true))['r'] || ('/'+scope.$oid));
            if (/open.t.sina.com.cn/g.test((_query2json(window.location.search.slice(1), true))['r'])) {
                window.location.replace('http://open.t.sina.com.cn');
            }
            else {
                window.location.replace('/person/guide_interest.php' + window.location.search + (window.location.search ? '&' : '?') + (json ? json : ''));
            }
            _key = false;
        };
        var error = function(json){
            if (json) {
                if (json.code && json.code === "R01438") {
                    return App.alert($SYSMSG["R01438"]);
                }
                //_promptip( $SYSMSG[json['code']], false, false, 'wrong');
                App.alert({
                    'code': json['code']
                });
            }
            else {
                App.alert($CLTMSG["CC0901"]);
                //_promptip($CLTMSG["CC0901"], false, false, 'error');
            }
            _key = false;
        };
        App.finishSubmit = function(){
            if (checking) {
                setTimeout(App.finishSubmit, 500);
            }
            else {
                setTimeout(function(){
                    if (nameUsable && App.Checkinfo.check()) {
                        App.finishRumor(success, error);
                    }
                }, 100);
            }
            return false;
            
        };
        App.finishRumor = function(success, error){
            if (_key) {
                return false
            }
            _key = true;
            var data = _html2json(_box);
            data.token = scope.$token ? scope.$token : "";
            data.retcode = scope.doorretcode || "";
            scope.doorretcode = "";
            data.isusename = 0;
            for (var i = 0, len = suggestNick.length; i < len; i += 1) {
                if (data.nickname == suggestNick[i]) {
                    data.isusename = 1;
                    break;
                }
            }
            if (!App.Checkinfo.check()) {
                _key = false;
                return false;
            }
            if (data.schname == $CLTMSG['CC5827']) {
                data.schname = '';
            }
            if (data.com_name == $CLTMSG['CY0148']) {
                data.com_name = '';
            }
            Utils.Io.Ajax.request('/person/aj_full_info.php', {
                'POST': data,
                'onComplete': function(json){
                    if (json.code == 'A00006') {
                        success(json.data);
                    }
                    else if (json.code == "MR0050") {
                            App.forbidrefresh(function(){
                                Core.Events.fireEvent(_submit, 'click');
                            }, '/person/aj_full_info.php', true);
                            _key = false;
                        }
                    else if (json.code == 'M01140') {
                            App.regApplictaion({
                                'reg-form-config': {
                                    zIndex: 1000,
                                    width: 440
                                },
                                'schooltype':$E('school_type').value,
                                name:$E('schlname').value,
                                province: $E('provnice').value || '',
                                city:$E('city').value || '',
                                //                                        'area': dom.area.value,
                                'input': $E('nameid'),
                                'afterApply': function(spec) {
                                    spec['input'].value = spec['school'] || '';
                                    $E('info_school_id').value = spec['school_id'] || '';
                                    $E('info_city').value = spec['city'] || '';
                                    //$E('info_area').value = spec['area']||"";
                                    $E('info_province').value = spec['province'] || '';
                                    Core.Events.fireEvent($E('submit'), 'click');
                                    $E('info_apply').value = "1";
                                }
                            });
                        }
                    else {
                            error(json);
                        }
                    _submit.className = 'ktwb';
                },
                'onException': function(){
                    error();
                    _submit.className = 'ktwb';
                },
                'returnType': 'json'
            });
            _submit.className = 'ktwb ktwb_load';
        }
        var chg_sex = function(id){
            if (id == 'man') {
                $E('man').className = 'isboy';
                $E('woman').className = 'girl';
            }
            else {
                $E('man').className = 'boy';
                $E('woman').className = 'isgirl';
            }
            if ($E(id).getElementsByTagName('input').length > 0) {
                $E(id).getElementsByTagName('input')[0].checked = true;
            }
            $E('red_gender').innerHTML = succHTML
            $E('red_gender').style.display = "";
        }
        _addEvent(_submit, App.finishSubmit, 'click');
        //_enter({
        //	parent : 'information_box',
        //	action : App.finishSubmit
        //});
        _addEvent(_nickName, scope.ajaxCheckNickName, 'blur');
        
        if ($E('man')) {
            _addEvent($E('man'), function(){
                chg_sex('man');
            }, 'click');
        }
        if ($E('woman')) {
            _addEvent($E('woman'), function(){
                chg_sex('woman');
            }, 'click');
        }
        if (_birth) {
            var carbox = $C('DIV'), dateBox = $C('DIV');
            var pos = Core.Dom.getXY(_birth);
            var yd = 0;
            var md = 0;
            var dd = 0;
            carbox.className = "pc_caldr";
            carbox.style.cssText = 'z-index:999;position:absolute;display:none';
            carbox.style.left = pos[0] + 'px';
            carbox.style.top = pos[1] + 30 + 'px';
            carbox.appendChild(dateBox);
            document.body.appendChild(carbox);
            var newDate = new Date();
            var changeBirthShow = function(){
                var key = $E('pub_birthday_option').value;
                var t = birth_template;
                var h = {
                    'Capricorn': 'CY0144',
                    'Aquarius': 'CY0145',
                    'Pisces': 'CY0146',
                    'Aries': 'CY0135',
                    'Taurus': 'CY0136',
                    'Gemini': 'CY0137',
                    'Cancer': 'CY0138',
                    'Leo': 'CY0139',
                    'Virgo': 'CY0140',
                    'Libra': 'CY0141',
                    'Scorpio': 'CY0142',
                    'Sagittarius': 'CY0143'
                }
                if (_birth.value) {
                    see_birth.style.display = '';
                }
                else {
                    see_birth.style.display = 'none';
                }
                if (key == '0') {
                    t = t.replace('${birth}', yd + '年' + (parseInt(md) + 1) + '月' + dd + '日');
                }
                else 
                    if (key == '3') {
                        t = t.replace('${birth}', $CLTMSG[h[App.constellation(md, dd)]]);
                    }
                    else 
                        if (key == '2') {
                            t = t.replace('${birth}', (parseInt(md) + 1) + '月' + dd + '日');
                        }
                        else 
                            if (key == '1') {
                                t = t.replace('${birth}', '保密');
                                see_birth.style.display = 'none';
                            }
                birth_info_box.innerHTML = t;
            };
            var date = new domkey.Date(dateBox, function(y, m, d){
                _birth.value = y + '年' + (parseInt(m,10) + 1) + '月' + d + '日';
                carbox.style.display = 'none';
                see_birth.style.display = '';
                var pos = Core.Dom.getXY(see_birth);
                birth_info_box.style.left = (pos[0] - 60) + 'px';
                birth_info_box.style.top = (pos[1] - 360) + 'px';
                yd = y;
                md = m;
                dd = d;
                changeBirthShow();
            }, 1990, //年
 0, //月
 newDate, //点击范围开始
 365 * 100,//点击范围长度［天］
 1 //选中的日期
);
            _addEvent(_birth, function(){
                carbox.style.display = '';
            }, 'focus');
            _addEvent(_birth, function(){
                Core.Events.stopEvent();
            }, 'click');
            _addEvent(dateBox, function(){
                Core.Events.stopEvent();
            }, 'click');
            _addEvent(document.body, function(){
                carbox.style.display = 'none';
            }, 'click');
            dateBox.setAttribute("unselectable", "on");
            _addEvent($E('pub_birthday_option'), changeBirthShow, 'change');
            _addEvent($E('pub_birthday_option'), function(){
                carbox.style.display = 'none';
            }, 'focus');
        }
        if ($E('student')) {
            _addEvent($E('student').getElementsByTagName('LABEL')[0], function(){
                $E('schl_info').style.display = '';
                $E('com_info').style.display = 'none';
                //$E('student').getElementsByTagName('INPUT')[0].checked = true;
            }, 'click');
            var dd = App.autoComplate({
                'input': $E('schlname'),
                'ok': function(value, text){
                    $E('schlname').value = text;
                },
                'light': function(el){
                    el.className = 'bg';
                },
                'dark': function(el){
                    el.className = '';
                },
                'timer': 2,
                'style': 'width:220px;position:absolute;z-index:200',
                'class': 'co_sl_2',
                'type': 'ajax',
                'data': '/person/relateschool.php'
            });
            _addEvent($E('schlname'), function(){
                //$E('schlname').value = Core.String.leftB($E('schlname').value,100);
            }, 'blur');
            var timecontrol = function(){
                var t1 = parseInt($E('study_start_year').value);
                var t2 = parseInt($E('study_end_year').value);
                if (t1 > t2) {
                    $E('study_end_year').value = t1 + '';
                }
            };
            //_addEvent($E('study_start_year'),timecontrol,'change');
            //_addEvent($E('study_end_year'),timecontrol,'change');
            var def_str_school = $CLTMSG['CY0147'];
//            _addEvent($E('schlname'), function(){
//                if ($E('schlname').value == def_str_school) {
//                    $E('schlname').value = '';
//                }
//            }, 'focus');
//            _addEvent($E('schlname'), function(){
//                if ($E('schlname').value == '') {
//                    $E('schlname').value = def_str_school;
//                }
//            }, 'blur');
            //显示学校选择
            var  selector;
            _addEvent($E('schlname'), function() {
                if (selector && selector.dialog._distory != true) {
                    return false
                }
                selector = App.schoolSelector({
                    'form-config': {
                        zIndex: 1000,
                        //					hiddClose: true,
                        width: 590
                    },
                    'input': $E('schlname'),
                    /*
                     选择已有学校后操作
                     */
                    'afterSelect': function(spec) {
                        spec['input'].value = spec['school'] || '';
                        $E('info_school_id').value = spec['school_id'] || '';
                        $E('info_city').value = spec['city'] || '';
                        $E('info_area').value = spec['area'] || '';
                        $E('info_province').value = spec['province'] || '';
                        Core.Events.fireEvent($E('schlname'), 'blur');
                        $E('info_apply').value = "0";
                    },
                    /*
                     申请成功后操作
                     */
                    'afterApply': function(spec) {
                        spec['input'].value = spec['school'] || '';
                        $E('info_school_id').value = spec['school_id'] || '';
                        $E('info_city').value = spec['city'] || '';
                        $E('info_area').value = spec['area'] || '';
                        $E('info_province').value = spec['province'] || '';
                        Core.Events.fireEvent($E('schlname'), 'blur');
                        $E('info_apply').value = "1";
                    },
                    province: _province.value || '',
                    city:_city.value || '',
                    area:$E('info_area').value||'',
                    'schooltype':_schoolType.value,
                    'schUrl':'/person/relateschool.php',
                    'areaUrl':''
                });
            }, 'focus');
        }
        if ($E('worker')) {
            _addEvent($E('worker').getElementsByTagName('LABEL')[0], function(){
                $E('schl_info').style.display = 'none';
                $E('com_info').style.display = '';
                //$E('worker').getElementsByTagName('INPUT')[0].checked = true;
            }, 'click');
            var dd2 = App.autoComplate({
                'input': $E('com_name'),
                'ok': function(value, text){
                    $E('com_name').value = text;
                },
                'light': function(el){
                    el.className = 'bg';
                },
                'dark': function(el){
                    el.className = '';
                },
                'timer': 2,
                'style': 'width:220px;position:absolute;z-index:200',
                'class': 'co_sl_2',
                'type': 'ajax',
                'data': '/person/relatecompany.php'
            });
            _addEvent($E('com_name'), function(){
                //$E('com_name').value = Core.String.leftB($E('com_name').value,100);
            }, 'blur');
            var timecontrol2 = function(){
                var t1 = parseInt($E('com_start_year').value);
                var t2 = parseInt($E('com_end_year').value);
                if (t1 > t2) {
                    $E('com_end_year').value = t1 + '';
                }
            };
            _addEvent($E('com_start_year'), timecontrol2, 'change');
            _addEvent($E('com_end_year'), timecontrol2, 'change');
            var def_str_company = $CLTMSG['CY0148'];
            _addEvent($E('com_name'), function(){
                if ($E('com_name').value == def_str_company) {
                    $E('com_name').value = '';
                }
            }, 'focus');
            _addEvent($E('com_name'), function(){
                if ($E('com_name').value == '') {
                    $E('com_name').value = def_str_company;
                }
            }, 'blur');
        }
        if ($E('noword')) {
            _addEvent($E('noword').getElementsByTagName('LABEL')[0], function(){
                $E('schl_info').style.display = 'none';
                $E('com_info').style.display = 'none';
                //$E('noword').getElementsByTagName('INPUT')[0].checked = true;
            }, 'click');
        }
        
        var birth_template = '<div class="cmt"></div>\
		   <div class="cmm">\
		   	<div class="cmmp1">\
		      <img src="'+scope.$BASEIMG+'style/images/reguide_twice/pm1.jpg" /></div>\
		      <div class="cmct">\
		      	<div class="cbtxt">生日：${birth}</div>\
		      </div>\
		   </div>\
		   <div class="cmb"></div>';
        var birth_info_box = $C('DIV');
        birth_info_box.className = 'cmlayer';
        document.body.appendChild(birth_info_box);
        birth_info_box.style.display = 'none';
        var see_birth = $E('pop_layer');
        if (see_birth) {
            _addEvent(see_birth, function(){
                birth_info_box.style.display = '';
            }, 'mouseover');
            _addEvent(see_birth, function(){
                birth_info_box.style.display = 'none';
            }, 'mouseout');
        }
    } 
    catch (exp) {
        console.log(exp)
    }
});
