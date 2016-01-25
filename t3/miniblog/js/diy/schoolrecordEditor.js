/**
 * @author chibin | chibin@staff.sina.com.cn
 *
 * 为学校myschool单写一个
 */
$import('diy/htmltojson.js');
$import('diy/provinceandcity.js');
$import('diy/comparejson.js');
$import('diy/check.js');
$import("diy/checkForm.js");
$import("diy/checkFormUI.js");
$import("diy/autocomplate.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/array/findit.js");
$import('sina/core/dom/removeNode.js');
$import('sina/core/string/encodeHTML.js');
$import('sina/core/dom/getElementsByClass.js');
$import('sina/core/function/bind2.js');
(function(proxy){
    /**
     * dom : {
     schooltype
     name
     join
     note
     box
     },
     spec: {
     
     }
     */
    proxy.recordEditor = function(dom, spec){
        var that = {};
        //		var provCity;
        //		try {
        //			provCity = new App.ProvinceAndCity(dom.prov, dom.city, 0, 0);
        //		}catch(e){}
        var checkFun = {
            //            'M01140': function(el){//名称必填
            //                el.value = Core.String.trim(el.value);
            //                if (el.value) {
            //                    return true;
            //                }
            //                else {
            //                    return false;
            //                }
            //            },
            //			'M01140' : function(el){//名称怪字符
            //				el.value = Core.String.trim(el.value);
            //				if(App.checkMiniName(el.value) || el.value.length == 0){
            //					return true
            //				}else{
            //					return false;
            //				}
            //			},
            'M01139': function(el){//名称长度限制
                el.value = Core.String.trim(el.value);
                var lens = Core.String.byteLength(el.value);
                if (lens <= 50 || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            //			'M01144' : function(el){//加入时间要早于离开时间
            //				if(parseInt(el.value)*parseInt(dom.leave.value) === 0){
            //					return true;
            //				}
            //				if(parseInt(el.value) > parseInt(dom.leave.value)){
            //					return false;
            //				}else{
            //					return true;
            //				}
            //			},
            'M01141': function(el){//备注字数限制
                el.value = Core.String.trim(el.value);
                var lens = Core.String.byteLength(el.value);
                if (lens <= 140 || el.value.length == 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            'A00006': function(){
                return true;
            }
            //			'M01141' : function(el){//备注怪字符
            //				el.value = Core.String.trim(el.value);
            //				if(App.checkMiniName(el.value) || el.value.length == 0){
            //					return true
            //				}else{
            //					return false;
            //				}
            //			}
        };
        var notefocus = function(el){
            if (el.value == $CLTMSG['CC5828'] || el.value == $CLTMSG['CC5829']) {
                el.value = '';
            }
			Core.Events.stopEvent();
			return false;
        };
        var noteblur = function(el){
            if (el.value == '') {
                if (dom.schooltype.value == 1) {
                    el.value = $CLTMSG['CC5828'];
                }
                else {
                    el.value = $CLTMSG['CC5829'];
                }
            }
			Core.Events.stopEvent();
			return false
        };
        Core.Events.addEvent(dom.note, (function(el){
			return function(){
				notefocus(el);
			}
		})(dom.note), 'focus');
        Core.Events.addEvent(dom.note, (function(el){
			return function(){
				noteblur(el);
			}
		})(dom.note), 'blur');
        var Checkinfo = App.checkForm(App.checkFormUI);
        Checkinfo.add('M01140', dom.name, dom.red_name, function(){
            return true;
        });
        Checkinfo.add('M01139', dom.name, dom.red_name, checkFun['M01139']);
        Checkinfo.add('M01141', dom.note, dom.red_note, checkFun['M01141']);
        Checkinfo.add('A00006', dom.schooltype, dom.red_school_type, checkFun['A00006']);
        //        var namefocus = function(){
        //            if (dom.name.value == '请输入完整的学校名称') {
        //                dom.name.value = '';
        //            }
        //        };
        //        var nameblur = function(){
        //            if (dom.name.value == '') {
        //                dom.name.value = '请输入完整的学校名称';
        //            }
        //        };
        
        var dd = App.autoComplate({
            'input': dom.name,
            'ok': function(value, text){
                dom.name.value = text;
                dom.school_id.value = value || '';
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
            'data': spec.searchInter + '?schooltype=' + dom.schooltype.value
        });
        
        Core.Events.addEvent(dom.schooltype, function(){
            dd.set('data', spec.searchInter + '?schooltype=' + dom.schooltype.value);
            dom.name.value = $CLTMSG['CC5827'];
            dom.school_id.value = '';
            if (dom.schooltype.value != 1) {
                $E('txt_grade') && ($E('txt_grade').innerHTML = $CLTMSG['CC5816'])
                if (Core.String.trim(dom.note.value) === $CLTMSG['CC5828'] || Core.String.trim(dom.note.value) == "") {
                    dom.note.value = $CLTMSG['CC5829']
                }
            }
            else {
                if (Core.String.trim(dom.note.value) === $CLTMSG['CC5829'] || Core.String.trim(dom.note.value) == "") {
                    dom.note.value = $CLTMSG['CC5828']
                }
                $E('txt_grade') && ($E('txt_grade').innerHTML = $CLTMSG['CC5817'])
            }
        }, 'change');
        var tips = App.bindFormTips([{
            'el': dom.name,
            'key': 'R00044'
        }, {
            'el': dom.note,
            'key': 'R00045',
			'default-fun': function(el){	
				return el.value===$CLTMSG['CC5828'];
			}
        }]);
        Core.Events.addEvent(dom.join, function(){
            if (dom.join.value != '0') {
                return false
            }
            var pos = Core.Dom.getXY(dom.join);
            tips.domList['content'].innerHTML = $SYSMSG['R22222'];
            tips.box.style.top = (pos[1] - 3) + 'px';
            if (dom.join.getAttribute('positionleft')) {
                tips.box.style.left = (pos[0] + dom.join.offsetWidth + dom.join.getAttribute('positionleft') * 1) + 'px';
            }
            else {
                tips.box.style.left = pos[0] + dom.join.offsetWidth + 'px';
            }
            tips.box.style.display = '';
            //                els[k]['el'].style.borderColor = '#A5C760';
            //                els[k]['el'].style.backgroundColor = '#F4FFD4';
        }, 'focus');
        Core.Events.addEvent(dom.join, function(){
            //			if(dom.join.value!='0'){
            tips.box.style.display = 'none';
            //				return false
            //			}else{
            //				tips.box.style.display = '';
            //				return false
            //			}
        
        }, 'blur');
        
        /**
         * name
         */
        var domList = ['name', 'join', 'note', 'school_id', 'schooltype', 'apply', 'province', 'city', 'area'];
        that.set = function(key, value){
            if (Core.Array.findit(domList, key) !== -1) {
                dom[key].value = value;
            }
            //			if(key === 'provAndCity'){
            //				try {
            //					provCity.loadNewData(value.prov, value.city);
            //				}catch(e){}
            //			}
            if (key === 'error') {
                Checkinfo.showError(value);
            }
            return that;
        };
        /**
         * data : return htmlToJson
         */
        that.get = function(key){
            if (key === 'data') {
                var oData = App.htmlToJson(dom.box);
                var oSelect = dom["privacy"];
                oData["privacy"] = oSelect.value;
                oData["privacyName"] = oSelect.options[oSelect.selectedIndex].text;
                if (oData["name"] == $CLTMSG['CC5827']) {
                    oData["name"] = ""
                }
                if (oData["remark"] == $CLTMSG['CC5828'] || oData["remark"] == $CLTMSG['CC5829']) {
                    oData["remark"] = ""
                }
                return oData;
            }
            if (key === 'check') {
                return Checkinfo;
            }
        };
        that.hiddError = function(){
        
            that.get('check').hideError(['M01140']);
            dom.red_name.style.display = 'none';
            dom.red_school_type.style.display = 'none';
            dom.red_note.style.display = 'none';
            dom.note.style.cssText = '';
            dom.name.style.cssText = '';
        };
        return that;
    };
    /**
     * dom : {
     prov
     city
     name
     join
     leave
     note
     box
     submit
     cancel
     },
     spec: {
     inter
     isconfirm
     success
     cancel
     }
     */
    proxy.updater = function(dom, spec){
        var that = {};
        var nData = {
            'name': ''
        };
        var currentId = '';
        var recordor = proxy.recordEditor(dom, spec);
        var isChange = function(oData, nData){
            if (oData.name === nData.name) {
                return false;
            }
            else {
                return true;
            }
        };
        spec.empty = function(){
        
            dom.privacy.value = "0";
            spec.loadData({
                'name': $CLTMSG['CC5827'],
                'start': '0',
                //                'end': '0',
                'remark': $CLTMSG['CC5828'],
                'province': '',
                'city': '',
                'area': '',
                'school_id': '0',
                'apply': '',
                'schooltype': '1'
            });
            currentId = '';
            recordor.hiddError();
            Core.Events.fireEvent(dom.name, 'blur')
        };
        spec.loadData = function(data){
            recordor.set('privacy', data['privacy']).set('name', data['name']).set('join', data['start']).set('note', data['remark'] || (data['schooltype'] == 1 ? $CLTMSG['CC5828'] : $CLTMSG['CC5829'])).set('schooltype', data['schooltype']).set('school_id', data['school_id']).set('province', data['province']).set('city', data['city']).set('area', data['area'] || '').set('apply', data['apply'] || '');
            nData = recordor.get('data');
            currentId = data['id'] || '';
        };
        var lock = false;
        spec.update = function(){
            if (lock) {
                return false;
            }
            lock = true;
            if (!recordor.get('check').check()) {
                lock = false;
                return false;
            }
            var data = recordor.get('data');
            data.id = currentId;
            Utils.Io.Ajax.request(spec.inter, {
                'POST': data,
                'onComplete': function(json){
                    try {
                    
                        if (json.code === 'A00006') {
                            data.apply = json.data.apply;//重置申请状态
                            spec.success(json.data, data);
                        }
                        else {
                            if (json.code === "M00003") {
                                App.ModLogin(null, $CLTMSG['CX0120']);
                                return;
                            }
                            if (json.code === "M01140") {
                                var parm = {
                                    'reg-form-config': {
                                        zIndex: 1000,
                                        width: 440
                                    },
                                    'schooltype': dom.schooltype.value || dom.schooltype.getAttribute('truevalue'),
                                    'name': (dom.name.value == $CLTMSG['CC5827']) && '',
                                    'province': dom.province.value || scope.cprov_id,
                                    'city': dom.city.value || scope.ccity_id,
                                    'area': dom.area.value,
                                    'input': $E('nameid'),
                                    'afterApply': function(spec){
                                        spec['input'].value = spec['school'] || '';
                                        $E('info_school_id').value = spec['school_id'] || '';
                                        $E('info_apply').value = "1";
                                        $E('info_city').value = spec['city'];
                                        $E('info_area').value = spec['area'];
                                        $E('info_province').value = spec['province'];
                                        //                                        Core.Events.fireEvent(dom.submit, 'click');
                                        dom.join.focus();
                                    }
                                }
                                
                                //								spec['schooltype']=
                                //								spec['name']=;
                                //								spec['province']=dom.province.value;
                                //								spec['city']=dom.city.value;
                                //								spec['area']=;
                                App.regApplictaion(parm);
                                return false;
                            }
                            if (!recordor.get('check').showError([json['code']])) {
                                App.alert($SYSMSG[json['code']]);
                            }
                        }
                    } 
                    catch (exp) {
                    }
                    finally {
                        lock = false;
                    }
                },
                'onException': function(){
                    //					spec.error();
                    App.alert($CLTMSG['CC0901'], {
                        icon: 2
                    });
                    lock = false;
                },
                'returnType': 'json'
            });
        };
        spec.cancel = function(cb){
            if (typeof cb !== 'function') {
                cb = spec.defaultCancel ||
                function(){
                };
            }
            if (isChange(recordor.get('data'), nData)) {
                if (spec.isconfirm) {
                    App.confirm({
                        code: "R00041"
                    }, {
                        ok: function(){
                            spec.empty();
                            cb();
                        },
                        cancel: function(){
                        
                        }
                    });
                }
                else {
                    spec.empty();
                    cb();
                }
            }
            else {
            
                spec.empty();
                
                cb();
            }
            
        };
        that.empty = function(){
            spec.empty();
            return that;
        };
        that.loadData = function(data){
            spec.loadData(data);
            return that;
        };
        that.update = function(){
            spec.update();
            return that;
        };
        that.cancel = function(cb){
            spec.cancel(cb);
            return that;
        };
        
        that.set = function(key, value){
        
            if (key === 'success' || key === 'cancel') {
                if (typeof value === 'function') {
                    spec[key] = value;
                }
            }
            if (key === 'inter' || key === 'isconfirm') {
                spec[key] = value;
            }
            return that;
        };
        that.get = function(key){
            return spec[key];
        };
        
        Core.Events.addEvent(dom.submit, spec.update, 'click');
        Core.Events.addEvent(dom.cancel, spec.cancel, 'click');
        return that;
    };
    
    function updateLocation(params, spec){
        params.provincename = '';
        params.cityname = '';
        if (spec.dom.prov.selectedIndex) {
            params.provincename = spec.dom.prov.options[spec.dom.prov.selectedIndex].text;
        }
        if (params.city != '0' && params.city != '1000') {
            params.cityname = spec.dom.city.options[spec.dom.city.selectedIndex].text;
        }
        params.location = '(';
        if (params.provincename != '') {
            params.location = params.location + params.provincename;
        }
        if (params.cityname != '') {
            params.location = params.location + '，' + params.cityname;
        }
        if (params.location == '(') {
            params.location = '';
        }
        else {
            params.location = params.location + ')';
        }
        return params;
    }
    
    function renderItem(params, div, spec){
        var itemHtml = '<ul class="infoTable" ' +
        'onmouseover="scope.toggleEditor && scope.toggleEditor(this,true)" ' +
        'onmouseout="scope.toggleEditor&&scope.toggleEditor(this,false)">' +
        spec.build(params, spec.template) +
        '</ul>';
        var insDom = Core.Dom.insertHTML(div, itemHtml, "beforebegin");
        if (spec.itemLength > 0) {
            if (!(params.apply == 1 && spec.applyLength == 0)) {
                //itemHtml = '<div class="MIB_linedot1"></div>' + itemHtml;
                Core.Dom.insertHTML(insDom, '<div class="MIB_linedot1"></div>', "beforebegin");
            }
            else {
                //				if(spec.itemLength>=1){
                Core.Dom.insertHTML(div, '<div class="MIB_linedot1"></div>', "afterend");
                //				}
            }
        }
        
        //		if (spec.itemLength > 0) {
        //			if(div.id ==='modify_result'){					
        //            	itemHtml ="<div class='MIB_linedot1'></div>" +itemHtml; //到尾部了
        //			}else{
        //				itemHtml = itemHtml +  "<div class='MIB_linedot1'></div>";
        //			}
        //        }
        //        Core.Dom.insertHTML(div, itemHtml, "beforebegin");
        //        Core.Dom.insertHTML(div, lineHtml, "afterend");
    }
    
    proxy.schoolrecordList = function(spec){
        var data = {};
        var that = {};
        var current = -1;
        /*
         编辑学校
         */
        spec.edit = function(box){
        
            var oData = App.htmlToJson(box);
            if (current == oData.id) {
                return false;
            }
            window.location.hash = 'info_box';
            window.location = window.location; //2010.7.29 修改chrome下无法跳转锚点的bug
            editor.cancel(function(){
                $E("privacy_option").options.selectedIndex = (oData['privacy'] === '0') ? 0 : 1;
                $E("txt_grade").innerHTML = (oData['schooltype'] === '1') ? $CLTMSG['CC5817'] : $CLTMSG['CC5816'];
                current = oData.id;
                editor.loadData(oData).set('success', function(json, params){
                    current = -1;
                    if (box) {
                        if (params['apply'] != 1) {
                            var div = $E("modify_result");
                        }
                        else {
                            var div = $E("modify_result_apply");
                        }
                        if (params['apply'] != 1) {
                            //							var div = $E("modify_result_apply");
                            //						}else{
                            
                            
                            if (box.parentNode == spec.listBox) {//普通编辑
                                if (div.style.display !== "none") {
                                    renderItem(scope._last_params, div, spec);
                                }
                                if (json.total && json.total > 0) {
                                    //仅显示同一学校同学区域
                                    div.style.display = "block";
                                    div.parentNode.style.display = "block";
                                    div.innerHTML = json.html;
                                    
                                    //                                params = updateLocation(params, spec);
                                    scope._last_params = params;
                                    
                                    var line = box.nextSibling;
                                    while (line && line.nodeType == 3) {
                                        line = line.nextSibling;
                                    }
                                    if (line && (line.className === "MIB_linedot1")) {
                                        spec.listBox.removeChild(line);
                                    }
                                    spec.listBox.removeChild(box);
                                    
                                }
                                else {
                                    div.style.display = "none";
                                    box.innerHTML = spec.build(params, spec.template);
                                }
                            }
                            else {
                                if (json.total && json.total > 0) {
                                    //仅显示同一学校同学区域
                                    div.style.display = "block";
                                    div.parentNode.style.display = "block";
                                    div.innerHTML = json.html;
                                }
                                else {
                                    div.style.display = "none";
                                    renderItem(params, div, spec);
                                }
                            }
                        }
                        else {
                            if (box.parentNode == spec.listBox) {//普通编辑
                                div.style.display = "none";
                                box.innerHTML = spec.build(params, spec.template);
                            }
                            else {
                                $E("modify_result").style.display = "none";
                                renderItem(params, div, spec);
                            }
                        }
                        editor.empty().set('success', spec.add);
                        if (spec.itemLength >= 15) {
                            spec.dom.box.style.display = 'none';
                            $E("info_tip").style.display = 'none';
                        }
                    }
                });
            });
            spec.dom.box.style.display = '';
            $E("info_tip").style.display = '';
        };
        /*
         增加学校
         */
        spec.add = function(json, params){
            scope.added = scope.added ||
            {};
            scope.added[json['id']] = params;
            params['id'] = json['id'];
            if (params['apply'] == 1) {
                var div = $E("modify_result_apply");
            }
            else {
                var div = $E("modify_result");
            }
            if (div.style.display !== "none") {
                //连续增加时
                if (scope.added[div.getElementsByTagName("input")[0].value]) {
                    renderItem(scope.added[div.getElementsByTagName("input")[0].value], div, spec);
                    div.style.display = "none";
                }
                else {//有其它学校在编辑显示
                    renderItem(scope._last_params, div, spec);
                }
            }
            //
            
            if (json.total && json.total > 0) {
                //仅显示同一学校同学区域
                div.style.display = (json.total && json.total > 0) ? "block" : "none";
                div.parentNode.style.display = "block";
                div.innerHTML = json.html;
                //                params = updateLocation(params, spec);
                scope._last_params = params;
            }
            else {
                //创建该学校列表项
                renderItem(params, div, spec);
            }
            
            editor.empty().set('success', spec.add);
            spec.itemLength += 1;
            if (params['apply'] == 1) {
                spec.applyLength += 1;
            }
            if (spec.itemLength >= 15) {
                spec.dom.box.style.display = 'none';
                $E("info_tip").style.display = 'none';
            }
            current = -1;
            spec.listBox.style.display = '';
        };
        /*
         
         删除学校
         
         */
        spec.del = function(box){
        
            var oData = App.htmlToJson(box);
            App.confirm({
                code: "R00042"
            }, {
                ok: function(){
                    Utils.Io.Ajax.request(spec.delInter, {
                        'POST': oData,
                        'onComplete': function(json){
                            if (json.code === 'A00006') {
                            
                                spec.itemLength -= 1;
                                if (!oData.school_id) {
                                    spec.applyLength -= 1;
                                }
                                //如果修改时删除，需要清空编辑form(spec.empty是动态创建的，此时无法使用)
                                if (current == oData.id) {
                                    var dom = spec.dom;
                                    dom.name.value = '';
                                    dom.join.value = '0';
                                    //                                    dom.leave.value = '0';
                                    dom.note.value = '';
                                    dom.province.value = '0';
                                    dom.city.value = '0';
                                    dom.apply.value = '0';
                                    dom.area.value = '';
                                    dom.schooltype.value = '1';//大学
                                    current = '';
                                }
                                
                                //如果是信息框的删除操作
                                var pNode = box.parentNode;
                                if (pNode.className === "modify_result") {
                                    pNode.innerHTML = "";
                                    pNode.style.display = "none";
                                    if (pNode.parentNode.getElementsByTagName("UL").length === 0) {
                                        pNode.parentNode.style.display = "none";
                                    }
                                    return;
                                }
                                
                                //删除表现到线的
                                var xian = box.nextSibling;
                                var done = false;
                                while (xian) {
                                    if (xian.nodeType === 1 && xian.className == 'MIB_linedot1') {
                                        Core.Dom.removeNode(xian);
                                        done = true;
                                        break;
                                    }
                                    xian = xian.nextSibling;
                                }
                                if (!done) {
                                    xian = box.previousSibling;
                                }
                                while (xian) {
                                    if (xian.nodeType === 1 && xian.className == 'MIB_linedot1') {
                                        Core.Dom.removeNode(xian);
                                        break;
                                    }
                                    xian = xian.previousSibling;
                                }
                                //结束删除的线
                                
                                Core.Dom.removeNode(box);
                                if (spec.itemLength <= 0) {
                                    spec.listBox.style.display = 'none';
                                }
                                spec.dom.box.style.display = '';
                                $E("info_tip").style.display = '';
                            }
                            else {
                                if (json.code === "M00003") {
                                    App.ModLogin(null, $CLTMSG['CX0120']);
                                    return;
                                }
                            }
                        },
                        'onException': function(){
                            App.alert($CLTMSG['CX0121']);
                        },
                        'returnType': 'json'
                    });
                },
                cancel: function(){
                
                }
            });
            
        };
        
        /*
         构造保存成功后显示的学校UL
         
         */
        spec.build = function(data, temp){
            //location
            if (data.schoolInfo == undefined) {
            
                switch (data.school_type) {
                    case '1':
                        data.schooltypeName = $CLTMSG['CC5818']
                        break;
                    case '2':
                        data.schooltypeName = $CLTMSG['CC5819']
                        break;
                    case '3':
                        data.schooltypeName = $CLTMSG['CC5820']
                        break;
                    case '4':
                        data.schooltypeName = $CLTMSG['CC5821']
                        break;
                    case '5':
                        data.schooltypeName = $CLTMSG['CC5822']
                        break;
                }
                
                //                data.provincename = '';
                //                data.cityname = '';
                //                if (spec.dom.prov && spec.dom.prov.selectedIndex) {
                //                    data.provincename = spec.dom.prov.options[spec.dom.prov.selectedIndex].text;
                //                }
                //                if (data.city != '0' && data.city != '1000') {
                //                    data.cityname = spec.dom.city.options[spec.dom.city.selectedIndex].text;
                //                }
                data.schoolInfo = data.schooltypeName;
                //                if (data.provincename != '') {
                //                    data.location = data.location + data.provincename;
                //                }
                //                if (data.cityname != '') {
                //                    data.location = data.location + '，' + data.cityname;
                //                }
            }
            //end location
            
            //start
            if (data.start && data.start.length == 4) {
                data.schoolInfo += '-' + data.start
            }
            
            //remark
            if (data.remark) {
                data.remarkString = Core.String.encodeHTML(data.remark);
                data.remark = Core.String.encodeHTML(data.remark).replace(/\"/g, '&quot;');
                data.schoolInfo += '-' + data.remark;
            }
            //end remark
            
            
            //during
            //            data.during = ' — ';
            //            if (data.start != 0) {
            //                data.during = data.start + $CLTMSG['CX0122'] + data.during;
            //            }
            //            if (data.end != 0) {
            //                if (data.end != '9999') {
            //                    data.during = data.during + data.end + $CLTMSG['CX0122'];
            //                }
            //                else {
            //                    data.during = data.during + $CLTMSG['CC5501'];
            //                }
            //            }
            //            if (data.during == ' — ') {
            //                data.during = '';
            //            }
            //end during
            if (data.apply == "1") {
            
                temp = temp.replace(/#{findmate}/g, '').replace(/#{applyclass}/g, 'tipicon').replace(/#{applyschool}/g, '#{name}').replace(/#{applytip}/g, 'onmouseout="scope.infoEditor&&scope.infoEditor(this,false,\'CC5823\')" onmouseover = "scope.infoEditor&&scope.infoEditor(this,true,\'CC5823\')"').replace(/#{displayPrivacy}/g, 'none')
            }
            else {
                temp = temp.replace(/#{findmate}/g, '<span><a href="/search/user.php?s_school=#{name}">' +
                '<img src="' +
                scope.$BASEIMG +
                'style/images/common/transparent.gif" ' +
                'class="small_icon search_icon" title="' +
                $CLTMSG["CC1902"] +
                '">' +
                $CLTMSG["CC2001"] +
                '</a></span>').replace(/#{applyclass}/g, 'tipicon_no').replace(/#{applyschool}/g, '<a href="/search/user.php?s_school=#{encoded_name}&comorsch_type=1">#{name}</a>').replace(/#{applytip}/g, '').replace(/#{displayPrivacy}/g, '""');
            }
            //name
            //对url内链接编码,注意顺序
            temp = temp.replace(/#{encoded_name}/g, encodeURIComponent(data.name));
            data.name = Core.String.encodeHTML(data.name).replace(/\"/g, '&quot;');
            //end name
            //申请
            for (var k in data) {
                var re = new RegExp('#\{' + k + '\}', 'g');
                temp = temp.replace(re, data[k]);
            }
            //            if (data.remark === "") {
            //                temp = temp.replace('<li class="infoRemarks"></li>', "");
            //            }
            
            //避免IE6下折行问题
            if (data.provincename === "") {
                temp = temp.replace(/<span class="edu_conn_place"><\/span>/g, "");
            }
            return temp;
        };
        var editor = proxy.updater(spec.dom, {
            'inter': spec.addInter,
            'isconfirm': spec.isconfirm,
            'searchInter': spec.srhInter,
            'defaultCancel': function(){
                editor.empty().set('success', spec.add);
                current = -1;
                if (spec.itemLength >= 15) {
                    spec.dom.box.style.display = 'none';
                    $E("info_tip").style.display = 'none';
                }
            }
        });
        
        that.edit = spec.edit;
        that.del = spec.del;
        
        editor.set('success', spec.add);
        return that;
    };
})(App);

