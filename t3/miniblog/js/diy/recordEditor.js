/**
 * @author Robin Young | yonglin@staff.sina.com.cn
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
     prov
     city
     name
     join
     leave
     note
     box
     },
     spec: {
     
     }
     */
    proxy.recordEditor = function(dom, spec){
        var that = {};
        var provCity = new App.ProvinceAndCity(dom.prov, dom.city, 0, 0);
        var checkFun = {
            'M01140': function(el){//名称必填
                el.value = Core.String.trim(el.value);
                if (el.value && ((spec['type'] == 'company') && el.value != $CLTMSG['CC5901'])) {
                    return true;
                }
                else {
                    return false;
                }
            },
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
            'M01144': function(el){//加入时间要早于离开时间
                if (parseInt(el.value) * parseInt(dom.leave.value) === 0) {
                    return true;
                }
                if (parseInt(el.value) > parseInt(dom.leave.value)) {
                    return false;
                }
                else {
                    return true;
                }
            },
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
			'M01165': function(el){
				el.value = Core.String.trim(el.value);
				if((/^[a-zA-Z\u4e00-\u9fa5]+$/).test(el.value)){
					return true;
				}else{
					return false;
				};
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
        var _focusblur = function(dom, msg, type){
            if (type === 'focus') {
                (dom.value == $CLTMSG[msg]) && (dom.value = '');
                Core.Events.stopEvent();
                return false;
            }
            else {
                (dom.value == '') && (dom.value = $CLTMSG[msg]);
                Core.Events.stopEvent();
                return false;
            }
        }
        Core.Events.addEvent(dom.name, function(){
            _focusblur.apply(null, [dom.name, 'CC5901', 'focus'])
        }, 'focus');
        Core.Events.addEvent(dom.name, function(){
            _focusblur.apply(null, [dom.name, 'CC5901', 'blur'])
        }, 'blur')
        Core.Events.addEvent(dom.note, function(){
            _focusblur.apply(null, [dom.note, 'CC5902', 'focus'])
        }, 'focus');
        Core.Events.addEvent(dom.note, function(){
            _focusblur.apply(null, [dom.note, 'CC5902', 'blur'])
        }, 'blur');
        var Checkinfo = App.checkForm(App.checkFormUI);
        if (spec.type === 'company') {
            Checkinfo.add('M01143', dom.name, dom.red_name, checkFun['M01140']);
            //			Checkinfo.add('M01143',dom.name,dom.red_name,checkFun['M01140']);
            Checkinfo.add('M01142', dom.name, dom.red_name, checkFun['M01139']);
            Checkinfo.add('M01145', dom.join, dom.red_join, checkFun['M01144']);
            Checkinfo.add('M01141', dom.note, dom.red_note, checkFun['M01141']);
            Checkinfo.add('M01165', dom.name, dom.red_name, checkFun['M01165']);
			//			Checkinfo.add('M01141',dom.note,dom.red_note,checkFun['M01141']);
        }
        else {
            //			Checkinfo.add('M01140',dom.name,dom.red_name,checkFun['M01140']);
            Checkinfo.add('M01140', dom.name, dom.red_name, checkFun['M01140']);
            Checkinfo.add('M01139', dom.name, dom.red_name, checkFun['M01139']);
            Checkinfo.add('M01144', dom.join, dom.red_join, checkFun['M01144']);
            Checkinfo.add('M01141', dom.note, dom.red_note, checkFun['M01141']);
            //			Checkinfo.add('M01141',dom.note,dom.red_note,checkFun['M01141']);
        }
        
        
        if (spec.type === 'company') {
            App.bindFormTips([{
                'el': dom.name,
                'key': 'R00044'
            }, {
                'el': dom.note,
                'key': 'R00046',
                'default-fun': function(el){
                    return el.value === $CLTMSG['CC5902'];
                }
            }]);
        }
        else {
            App.bindFormTips([{
                'el': dom.name,
                'key': 'R00044'
            }, {
                'el': dom.note,
                'key': 'R00045'
            }]);
            
        }
        dom.leave.onchange = function(){
            Core.Events.fireEvent(dom.join, 'change');
        };
        var dd = App.autoComplate({
            'input': dom.name,
            'ok': function(value, text){
                dom.name.value = text;
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
            'data': spec.searchInter
        });
        /**
         * name
         */
        var domList = ['name', 'join', 'leave', 'note'];
        that.set = function(key, value){
            if (Core.Array.findit(domList, key) !== -1) {
                dom[key].value = value;
            }
            if (key === 'provAndCity') {
                provCity.loadNewData(value.prov, value.city);
            }
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
                oData["name"] = ((oData["name"] == $CLTMSG['CC5901']) ? '' : oData["name"]);
                oData["remark"] = ((oData["remark"] == $CLTMSG['CC5902']) ? '' : oData["remark"]);
                return oData;
            }
            if (key === 'check') {
                return Checkinfo;
            }
        };
        that.hiddError = function(){
            dom.red_name.style.display = 'none';
            dom.red_join.style.display = 'none';
            dom.red_note.style.display = 'none';
        }
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
                //				'name' : '',		//CHIBIN MODIFY
                'name': $CLTMSG['CC5901'],
                'start': '0',
                'end': '0',
                //				'remark' : '',
                'remark': $CLTMSG['CC5902'],
                'province': '0',
                'city': '0'
            });
            currentId = '';
            recordor.hiddError();
        };
        spec.loadData = function(data){
            recordor.set('name', data['name'] || $CLTMSG['CC5901']).set('join', data['start']).set('leave', data['end']).set('note', data['remark'] || $CLTMSG['CC5902']).set('provAndCity', {
                'city': data['city'],
                'prov': data['province']
            });
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
                            spec.success(json.data, data);
                        }
                        else {
                            if (json.code === "M00003") {
                                App.ModLogin(null, $CLTMSG['CX0120']);
                                return;
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
        '<ul>';
        if (spec.itemLength > 0) {
            itemHtml = "<div class='MIB_linedot1'></div>" + itemHtml;
        }
        Core.Dom.insertHTML(div, itemHtml, "beforebegin");
    }
    
    proxy.recordList = function(spec){
        var data = {};
        var that = {};
        var current = -1;
        
        spec.edit = function(box){
            var oData = App.htmlToJson(box);
            if (current == oData.id) {
                return false;
            }
            window.location.hash = 'info_box';
            window.location = window.location; //2010.7.29 修改chrome下无法跳转锚点的bug
            editor.cancel(function(){
                $E("privacy_option").options.selectedIndex = (oData['privacy'] === '0') ? 0 : 1;
                current = oData.id;
                editor.loadData(oData).set('success', function(json, params){
                    current = -1;
                    if (box) {
                        var div = $E("modify_result");
                        if (box.parentNode == spec.listBox) {//普通编辑
                            if (div.style.display !== "none") {
                                renderItem(scope._last_params, div, spec);
                            }
                            
                            if (json.total && json.total > 0) {
                                //仅显示同一学校同学区域
                                div.style.display = "block";
                                div.parentNode.style.display = "block";
                                div.innerHTML = json.html;
                                
                                params = updateLocation(params, spec);
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
        
        spec.add = function(json, params){
            scope.added = scope.added ||
            {};
            scope.added[json['id']] = params;
            params['id'] = json['id'];
            
            var div = $E("modify_result");
            
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
                params = updateLocation(params, spec);
                scope._last_params = params;
            }
            else {
                //创建该学校列表项
                renderItem(params, div, spec);
            }
            
            editor.empty().set('success', spec.add);
            spec.itemLength += 1;
            if (spec.itemLength >= 15) {
                spec.dom.box.style.display = 'none';
                $E("info_tip").style.display = 'none';
            }
            current = -1;
            spec.listBox.style.display = '';
        };
        
        spec.del = function(box){
            var oData = App.htmlToJson(box);
            App.confirm({
                code: (spec.type === 'company' ? 'R00043' : "R00042")
            }, {
                ok: function(){
                    Utils.Io.Ajax.request(spec.delInter, {
                        'POST': oData,
                        'onComplete': function(json){
                            if (json.code === 'A00006') {
                                spec.itemLength -= 1;
                                
                                //如果修改时删除，需要清空编辑form(spec.empty是动态创建的，此时无法使用)
                                if (current == oData.id) {
                                    var dom = spec.dom;
                                    dom.name.value = '';
                                    dom.join.value = '0';
                                    dom.leave.value = '0';
                                    dom.note.value = '';
                                    dom.prov.value = '0';
                                    dom.city.value = '0';
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
                                alert($CLTMSG['CX0121']);
                            }
                        },
                        'onException': function(){
                            alert($CLTMSG['CX0121']);
                        },
                        'returnType': 'json'
                    });
                },
                cancel: function(){
                
                }
            });
            
        };
        
        spec.build = function(data, temp){
            //location
            if (data.location == undefined) {
                data.provincename = '';
                data.cityname = '';
                if (spec.dom.prov.selectedIndex) {
                    data.provincename = spec.dom.prov.options[spec.dom.prov.selectedIndex].text;
                }
                if (data.city != '0' && data.city != '1000') {
                    data.cityname = spec.dom.city.options[spec.dom.city.selectedIndex].text;
                }
                data.location = '(';
                if (data.provincename != '') {
                    data.location = data.location + data.provincename;
                }
                if (data.cityname != '') {
                    data.location = data.location + '，' + data.cityname;
                }
                if (data.location == '(') {
                    data.location = '';
                }
                else {
                    data.location = data.location + ')';
                }
            }
            //end location
            
            
            //remark
            if (!data.remark) {
                data.remarkString = '';
                data.remark = '';
            }
            else {
                data.remarkString = Core.String.encodeHTML(data.remark);
                data.remark = Core.String.encodeHTML(data.remark).replace(/\"/g, '&quot;');
            }
            //end remark
            
            
            //during
            data.during = ' — ';
            if (data.start != 0) {
                data.during = data.start + $CLTMSG['CX0122'] + data.during;
            }
            if (data.end != 0) {
                if (data.end != '9999') {
                    data.during = data.during + data.end + $CLTMSG['CX0122'];
                }
                else {
                    data.during = data.during + $CLTMSG['CC5501'];
                }
            }
            if (data.during == ' — ') {
                data.during = '';
            }
            //end during
            
            //name
            //对url内链接编码,注意顺序
            temp = temp.replace(/#{encoded_name}/g, encodeURIComponent(data.name));
            data.name = Core.String.encodeHTML(data.name).replace(/\"/g, '&quot;');
            //end name
            
            for (var k in data) {
                var re = new RegExp('#\{' + k + '\}', 'g');
                temp = temp.replace(re, data[k]);
            }
            if (data.remark === "") {
                temp = temp.replace('<li class="infoRemarks"></li>', "");
            }
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
            },
            'type': spec.type
        });
        
        that.edit = spec.edit;
        that.del = spec.del;
        
        editor.set('success', spec.add);
        return that;
    };
})(App);

