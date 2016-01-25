/**
 * @author Administrator
 */
//import API
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEventTarget.js");
$import('diy/dom.js');
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getXY.js");
//import comm function
$import("diy/date.js");
$import("diy/provinceandcity.js");

App.Widget = (function(){
    return {
        tipMsg: function(type, obj, msg, conf){
            type = /[0-9]/.test(type) ? type : 0;
            conf = conf ||
            {};
            conf['isnumber'] = conf['isnumber'] || false;
            conf['istip'] = conf['istip'] || true;
            
            var tag = 'div', cName = 'act_tip';
            var style = {
                0: 'background-color:#fcc;border:1px solid #f00;',
                1: 'background-color:transparent;',
                2: 'background-color:#f4ffd4;border:1px solid #a5c760;'
            };
            
            switch (obj.tagName.toLowerCase()) {
                case 'input':
                    if (conf['isnumber']) {
                        style[0] = style[0] + 'ime-mode: disabled;';
                        style[1] = style[1] + 'ime-mode: disabled;';
                        style[2] = style[2] + 'ime-mode: disabled;';
                    }
                    else {
                        style[0] = style[0] + 'ime-mode: active;';
                        style[1] = style[1] + 'ime-mode: active;';
                        style[2] = style[2] + 'ime-mode: active;';
                    }
                    obj.style.cssText = style[type];
                    break;
                case 'select':
                    if (type == 0) {
                        obj.style.cssText = style[type];
                    }
                    else {
                        obj.removeAttribute('style');
                    }
                    break;
                    
            }
            
            var td = Core.Dom.getElementsByClass(obj.parentNode.parentNode, 'td', 'td2')[0];
            var tipDiv = Core.Dom.getElementsByClass(td, tag, cName)[0];
            if (tipDiv) {
                td.removeChild(tipDiv);
            }
            
            var nTip = $C(tag);
            App.Dom.addClass(nTip, cName);
            var html = '';
            switch (type) {
                case 0:
                    html += '<div class="co_kc" style="position:absolute;"><div class="co_k_t"></div><div class="co_k_m"><div class="co_conn"><p>';
                    html += msg;
                    html += '</p></div></div><div class="co_k_b"></div></div>';
                    break;
                case 1:
                    html += '<div class="co_kd" style="position:absolute;">';
                    html += msg;
                    html += '</div>';
                    break;
                case 2:
                    html += '<table style="width:180px;position:absolute;" class="cudTs"><tbody><tr><td class="topL"></td><td></td><td class="topR"></td></tr><tr><td></td><td class="tdCon">';
                    html += msg;
                    html += '</td><td></td></tr><tr><td class="botL"></td><td></td><td class="botR"></td></tr></tbody></table>';
                    break;
            }
            nTip.innerHTML = conf.istip ? html : '';
            td.appendChild(nTip);
            return;
        },
        removeTipMsg: function(obj){
            var tag = 'div', cName = 'act_tip';
            var td = Core.Dom.getElementsByClass(obj.parentNode.parentNode, 'td', 'td2')[0];
            var tipDiv = Core.Dom.getElementsByClass(td, tag, cName);
            if (tipDiv[0]) {
                td.removeChild(tipDiv[0]);
            }
            
        },
        normalInput: function(obj, msg, conf){
            //tip,err,warn
            var isOk = false;
            //pars init
            conf = conf ||
            {};
            conf['event'] = conf['event'] || '';
            conf['tip'] = conf['tip'] || true;
            conf['symble'] = conf['symble'] || false;
            conf['maxlen'] = conf['maxlen'] || 200;
            
            msg = msg ||
            {};
            msg['tip'] = msg['tip'] || '';
            msg['err'] = msg['err'] || '';
            msg['empty'] = msg['empty'] || '';
            
            var value = obj.value;
            if (conf.event == 'focus' && conf.tip) {
                this.tipMsg(2, obj, msg.tip);
            }
            else {
                if (App.Validate.isEmpty(value)) {
                    this.tipMsg(0, obj, msg.empty);
                }
                else 
                    if (conf.symble && (/[!@#\$%\^&\*]+/).test(value)) {
                        this.tipMsg(0, obj, msg.err);
                    }
                    else 
                        if (Core.String.byteLength(value) > conf.maxlen) {
                            value = Core.String.leftB(value, conf.maxlen);
                            obj.value = value;
                        }
                        else {
                            this.tipMsg(1, obj, '');
                            isOk = true;
                        }
                
            }
            return isOk;
        },
        createTime: function(el, func){
            var events = Core.Events, cdom = Core.Dom, func = func ||
            function(){
                return true;
            };
            
            var box = null;
            var ifm = null;
            var pos = Core.Dom.getXY(el);
            
            if (cdom.getElementsByClass(document, "div", "pc_caldr").length > 0) {
                box = cdom.getElementsByClass(document, "div", "pc_caldr")[0];
                box.innerHTML = "";
                cdom.removeNode(box);
            }
            box = document.createElement('DIV');
            ifm = document.createElement('IFRAME');
            box.style.cssText = 'position:absolute;display:none;z-Index:1000;';
            ifm.style.cssText = 'border:0;position:absolute;display:none;z-Index:800;';
            box.style.left = pos[0] + 'px';
            ifm.style.left = pos[0] + 'px';
            box.style.top = pos[1] + 20 + 'px';
            ifm.style.top = pos[1] + 20 + 'px';
            box.className = "pc_caldr";
            document.body.appendChild(box);
            document.body.appendChild(ifm);
            //action
            var callBack = function(y, m, d){
                var time = y + '-' + ((parseInt(m) + 1) > 9 ? (parseInt(m) + 1) : '0' + (parseInt(m) + 1)) + '-' + (parseInt(d) > 9 ? d : '0' + d);
                if (func(time)) {
                    hidd();
                }
                return false;
            };
            var hidd = function(){
                box.style.display = 'none';
                box.innerHTML = '';
                cdom.removeNode(box);
                ifm.style.display = 'none';
                cdom.removeNode(ifm);
                events.removeEvent(document.body, hidd, 'click');
            };
            //init date pars
            var now = new Date();
            now.setFullYear(now.getFullYear() + 1);
            now.setDate(now.getDate() - 1);
            var day = Math.floor((now - (new Date())) / (1000 * 60 * 60 * 24)) + 1;
            
            var initDate = new Date();
            var defDate = [];
            if (el.value) {
                defDate = el.value.split('-');
                initDate = new Date(defDate.join(','));
            }
            //create calendar
            new domkey.Date(box, callBack, parseInt(defDate[0],10) || (new Date()).getFullYear(),//年
							 (parseInt(defDate[1],10) || (new Date().getMonth() + 1)) - 1,//月
							 now, //点击范围开始
							 day,//点击范围长度［天］
							 (parseInt(defDate[2],10) || ((new Date()).getDate())) //选择日期
							);
            
            box.style.display = '';
            ifm.style.height = box.offsetHeight + 'px'
            ifm.style.width = box.offsetWidth + 'px'
            ifm.style.display = '';
            events.stopEvent();
            box.onclick = function(){
                events.stopEvent();
                return false;
            };
            events.addEvent(document.body, hidd, 'click');
        },
        areaRelation: function(prov, city){
            return new App.ProvinceAndCity(prov, city, (prov.getAttribute('truevalue') || prov.value), (city.getAttribute('truevalue') || city.value));
        },
        buildParsStr: function(container, pars){
			pars = pars || {};
            var dom = App.Dom;
            dom.getBy(function(el){
                if (el.getAttribute('name')) {
                    switch (el.tagName.toLowerCase()) {
                        case 'input':
                            if (el.getAttribute('type') == 'text' || el.getAttribute('type') == 'hidden') {
                                pars[el.getAttribute('name')] = el.value;
                            }
                            if (el.getAttribute('type') == 'checkbox') {
                                pars[el.getAttribute('name')] = el.checked ? 1 : 0;
                            }
                            if (el.getAttribute('type') == 'radio' && el.checked) {
                                pars[el.getAttribute('name')] = el.value;
                            }
                            break;
                        case 'textarea':
                            pars[el.getAttribute('name')] = el.value;
                            break;
                        case 'select':
                            pars[el.getAttribute('name')] = el.options[el.selectedIndex].value;
                            break;
                    }
                }
            }, '', container);
            return pars;
        },
        checkBoxLink: function(source, items){
            var events = Core.Events, slen = source.length, ilen = items.length;
            var handler = {
                init: function(){
                    var isAll = handler.checkItemsState();
                    if (isAll) {
                        handler.selectedSource(source, isAll);
                    }
                    for (var i = 0; i < slen; i++) {
                        events.addEvent(source[i], handler.clickSource);
                    }
                    for (var i = 0; i < ilen; i++) {
                        events.addEvent(items[i], handler.clickItem);
                    }
                },
                clickSource: function(){
                    var obj = events.getEventTarget();
                    var isCheck = obj.checked;
                    handler.selectedBox(source, isCheck);
                    handler.selectedBox(items, isCheck);
                },
                clickItem: function(){
                    var obj = events.getEventTarget();
                    var isAll = obj.checked ? handler.checkItemsState() : false;
                    handler.selectedBox(source, isAll);
                },
                selectedBox: function(data, isSelect){
                    for (var i = 0, len = data.length; i < len; i++) {
                        data[i].checked = isSelect;
                    }
                },
                checkItemsState: function(){
                    for (var i = 0; i < ilen; i++) {
                        if (items[i].checked == false) {
                            return false;
                        }
                    }
                    return true;
                }
            };
            //control init
            handler.init();
        }
    }
})();
