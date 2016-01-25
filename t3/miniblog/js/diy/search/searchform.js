/**
 * @author chibin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/array/isArray.js');
$import('sina/core/string/trim.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/htmltojson.js");
$import("diy/autocomplate.js");
$import("diy/querytojson.js");
$import("diy/jsontoquery.js");
(function(proxy){
    proxy.searchForm = function(spec){
        var that = {};
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _each = Core.Array.foreach;
        var _isArray = Core.Array.isArray;
        var _timer = null;
        var _spec = {};
        var setdate = function(el, setdf, endDate, desc){
            var box;
            var btn = el;
            var date = [];
            date = btn.value.split('-');
            var pos = Core.Dom.getXY(btn);
            var enddate = (function(){
                if (endDate) {
                    return new Date(Date.UTC(endDate.split('-')[0],(endDate.split('-')[1] - 1),endDate.split('-')[2]));
                }
				else{
					return new Date(parseInt(scope.$severtime) * 1000);
				}
            })();
            if (Core.Dom.getElementsByClass(document, "div", "pc_caldr").length > 0) {
                box = Core.Dom.getElementsByClass(document, "div", "pc_caldr")[0];
                box.innerHTML = "";
                Core.Dom.removeNode(box);
            }
            box = document.createElement('DIV');
            box.style.cssText = 'position:absolute;display:none;z-Index:1000;';
            box.style.left = pos[0] + 'px';
            box.style.top = pos[1] + 20 + 'px';
            box.className = "pc_caldr";
            document.body.appendChild(box);
            new domkey.Date(box, function(y, m, d){
                btn.value = y + '-' + ((parseInt(m) + 1) > 9 ? (parseInt(m) + 1) : '0' + (parseInt(m) + 1)) + '-' + (parseInt(d) > 9 ? d : '0' + d);
                setdf(btn.value);
                hidd();
                return false;
            }, (date[0] ? parseInt(date[0],10) : (new Date()).getFullYear()), //年
 (date[1] ? parseInt(date[1],10) : (new Date()).getMonth() + 1) - 1, //月
 enddate , //点击范围开始
 desc ? Math.ceil(desc / (24 * 60 * 60 * 1000)) : Math.ceil(((new Date()).getTime()) / (24 * 60 * 60 * 1000)),//点击范围长度［天］
 (parseInt(date[2],10) || ((new Date()).getDate())) //选择日期
);
            
            box.style.display = '';
            Core.Events.stopEvent();
            box.onclick = function(){
                Core.Events.stopEvent();
                return false;
            };
            Core.Events.removeEvent(document.body,hidd , 'click');
            var hidd = function(){
                box.style.display = 'none';
                box.innerHTML = "";
                Core.Dom.removeNode(box);
                Core.Events.removeEvent(document.body, hidd, 'click');
            };
            Core.Events.addEvent(document.body, hidd, 'click');
        };
        /*
         * cfg:{
         *    @param form //整个区域id
         *    @param search_txt
         *    @param search_btn
         *    @param dsable //当输入框没东西的时候需要不可选择的
         *    @param province
         *    @param city
         *    @param starttime
         *    @param endtime
         *    @param url
         *    @param defaultValue
         *    @param defaultUrl
         *    @param defaultBtn
         * }
         * */
        that.initForm = function(spec){
            _spec = spec;
            if (_spec.province && _spec.city) {
                new proxy.ProvinceAndCity(_spec.province, _spec.city, _spec.province.getAttribute('truevalue')||0, _spec.city.getAttribute('truevalue')||0);
            }
            if (_spec.starttime) {
                _addEvent(_spec.starttime, function(){
                    _spec.starttime.readOnly = true;
                    setdate(_spec.starttime, function(vl){
                        if (vl && _spec['defaultValue']) {
                            _spec['defaultValue']['starttime'] = vl;
                        }
                    }, _spec.endtime.value, null);
                }, 'click');
            }
            if (_spec.endtime) {
                _addEvent(_spec.endtime, function(){
                    _spec.endtime.readOnly = true;
                    setdate(_spec.endtime, function(vl){
                        if (vl && _spec['defaultValue']) {
                            _spec['defaultValue']['endtime'] = vl;
                        }
                    }, null, _spec.starttime.value == 'yyyy-mm-dd' ? null : (new Date() - new Date(_spec.starttime.value.split('-')[0],_spec.starttime.value.split('-')[1] - 1,_spec.starttime.value.split('-')[2])));
                }, 'click');
            }
            //恢复默认
            if (_spec['defaultBtn']) {
                _addEvent(_spec.defaultBtn, function(){
                    var t = '&keytime=' + new Date().valueOf();
					if (_spec['urlRedirect']) {
					   location.replace(_spec.defaultUrl + encodeURIComponent(_spec['search_txt'].value) + t + '#showsearch');
					}
					else {
						location.replace(_spec.defaultUrl + '?' + 'search=' + encodeURIComponent(_spec['search_txt'].value) + t + '#showsearch');
					}
                    return false;
                }, 'click');
            };
            if (_spec['autocomp']) {
                that.autoComp(_spec);
            };
            _addEvent(_spec.search_btn, function(){
                Core.Events.stopEvent();
                setTimeout(function(){
                    that.search(_spec);
                }, 0)
            }, 'click');
            _addEvent(_spec.search_txt, function(){
                clearTimeout(_timer);
                _timer = setTimeout(function(){
                    that.disable(_spec);
                }, 50)
            }, 'keyup');
            proxy.enterSubmit({
                parent: _spec.search_txt.parentNode,
                action: function(){
                    Core.Events.fireEvent(_spec.search_btn, 'click');
                }
            });
            //			that.setdefault(_spec['defaultValue'])
            that.disable(_spec);
        };
        that.disable = function(spec){
            var _disable = false
            if (_trim(spec['search_txt'].value) !== "" || !_isArray(spec['dsable']) || spec['dsable'].length == 0) {
                _disable = false;
            }
            else {
                _disable = true
            }
            clearTimeout(_timer);
			if (spec['dsable']) {
				_timer = setTimeout(function(){
					_each(spec['dsable'], function(v, i){
						$E(v).disabled = _disable;
					})
				}, 50);
			}
        };
        
        that.search = function(spec){
            var url = spec['url'];
			var redrt= spec['urlRedirect'];
			var defaultTxt = spec['default-text']||$CLTMSG['CC4401'];
			//如果显示
            if (spec.h_mod) {
                var params = proxy.htmlToJson(spec['form']);
            }
            else {
                var params = {};
            }
            if (_trim(spec['search_txt'].value) === '' || _trim(spec['search_txt'].value)===defaultTxt) {
				/*
				 * 为了搜索人在搜索为空的时候，如果学校省市公司和兴趣都为空则不搜索，否则则搜索
				 */
				if(scope.$pageid==='user_search'){
					if(!(params['province']*1||params['s_school']||params['s_tag']||params['s_work'])){
						return false;
					}
				}else{
					spec['search_txt'].focus();
					return false;
				}
            }
            for (var k in params) {
				if (!params[k]) {
					delete params[k];
				}
			}
			if (!redrt) {
				params['search'] = encodeURIComponent(_trim(spec['search_txt'].value));
			}
            var t = ['keytime=' + new Date().valueOf()];
            for (var key in params) {
                //checkbox特殊处理
                if ($E(key) && $E(key).type == 'checkbox') {
                    t.push(key + '=1');
                    continue;
                }
                t.push(key + '=' + encodeURIComponent(params[key]));
            }
            var str = t.join('&');
            if (str) {
				if (redrt) {
					url +=encodeURIComponent(_trim(spec['search_txt'].value));
					url += '&';
				}
				else {
					url += (url.indexOf('?') == -1 ? '?' : '&');
				}
            }
            url = url + str;
            if (spec.h_mod) {
                url += '#showsearch'
			}
			if (App._showPub){
				url += '#showPublish'
			}
            setTimeout(function(){
                location.href=url;
            }, 0)
            return false;
        };
        that.setter = function(name, value){
            _spec[name] = value;
            return;
        };
        that.getter = function(name){
            return _spec[name] || '';
        };
        that.show = function(){
            _spec.h_mod = true
            _spec['form'].style.display = "block";
        };
        that.hidd = function(){
            _spec.h_mod = false;
            _spec['form'].style.display = "none"
        };
        that.autoComp = function(spec){
            _each(spec['autocomp']['dom'], function(v, i){
                var dom = $E(v);
                proxy.autoComplate({
                    'input': dom,
                    'ok': function(value, text){
                        dom.value = text;
                        if (typeof spec['autocomp']['ok'] === 'function') 
                            spec['autocomp']['ok']();
                    },
                    'light': function(el){
                        el.className = spec['autocomp']['light'] || 'cur';
                        
                    },
                    'dark': function(el){
                        el.className = spec['autocomp']['dark'] || '';
                    },
                    'timer': 2,
                    'style': spec['autocomp']['style'] || 'width:' + dom.style.width + 'px;position:absolute;z-index:200',
                    'class': spec['autocomp']['class'] || 'layerMedia_menu',
                    'type': 'ajax',
                    'data': spec['autocomp']['url'][i]
                });
            })
        };
        that.setdefault = function(spec){
            var node = null;
            _spec['defaultValue'] = spec;
            for (var k in _spec) {
                node = $E(k);
                if (node) {
                    switch (node.tagName) {
                        case 'INPUT':
                            switch (node.type) {
                                case 'checkbox':
                                    node.checked = _spec[k];
                                    break;
                                case 'radio':
                                    node.checked = _spec[k];
                                    break;
                                case 'text':
                                    node.value = _spec[k];
                                    break;
                            }
                        case 'SELECT':
                            node.value = _spec[k];
                            break;
                        default:
                            node.value = _spec[k];
                            break;
                    }
                }
            }
        };
        that.initForm(spec);
        return that;
    };
    proxy.delItem = function(){
        var condition = window.location.search.slice(1);
        var json = proxy.queryToJson(condition);
        for (var i = 0; i < arguments.length; i++) {
            delete json[arguments[i]];
        }
        location.href = location.pathname + '?' + proxy.jsonToQuery(json)
    };
    
})(App);
