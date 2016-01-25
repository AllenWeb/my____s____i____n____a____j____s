/**
 * @author chibin
 * 关系中心筛选层
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
(function(proxy, global){
    proxy.filterLayer = function(spec){
        var that = {};
        var _addEvent = Core.Events.addEvent;
        var _trim = Core.String.trim;
        var _each = Core.Array.foreach;
        var _isArray = Core.Array.isArray;
        var _timer = null;
        var _spec = spec ||{};        
        var pandc = global.ProvinceAndCity;
        var iEvt = function(spec){
            if (spec.province && spec.city) {
                new pandc(spec.province, spec.city, spec.province.getAttribute('truevalue') || 0, spec.city.getAttribute('truevalue') || 0);
            }
            if (spec.starttime) {
                _addEvent(spec.starttime, function(){
                    spec.starttime.readOnly = true;
                    setdate(spec.starttime, function(vl){
                        if (vl && spec['defaultValue']) {
                            spec['defaultValue']['starttime'] = vl;
                        }
                    }, spec.endtime.value, null);
                }, 'click');
            }
            if (spec.endtime) {
                _addEvent(spec.endtime, function(){
                    spec.endtime.readOnly = true;
                    setdate(spec.endtime, function(vl){
                        if (vl && spec['defaultValue']) {
                            spec['defaultValue']['endtime'] = vl;
                        }
                    }, null, spec.starttime.value == 'yyyy-mm-dd' ? null : (new Date() - new Date(spec.starttime.value.split('-')[0], spec.starttime.value.split('-')[1] - 1, spec.starttime.value.split('-')[2])));
                }, 'click');
            };
            if (spec['autocomp']) {
                autoComp(spec);
            };
            if (spec['clear']) {
                _addEvent(spec.clear, function(){
                    Core.Events.stopEvent();
                    reset(spec['clearNode'],spec['clearData'])
                }, 'click');
            }
            _addEvent(spec.search_btn, function(){
                Core.Events.stopEvent();
                setTimeout(function(){
                    search(spec);
                }, 0)
            }, 'click');
            _addEvent(spec.search_txt, function(){
                clearTimeout(_timer);
                _timer = setTimeout(function(){
                    that.disable(spec);
                }, 50)
            }, 'keyup');
			_addEvent(spec.tag,(function(el,txt){return function(){focus(el,txt)}})(spec.tag,"填写标签/兴趣爱好"),'focus');
			_addEvent(spec.school,(function(el,txt){return function(){focus(el,txt)}})(spec.school,"输入学校名称"),'focus');
			_addEvent(spec.company,(function(el,txt){return function(){focus(el,txt)}})(spec.company,"输入公司名称"),'focus');
			_addEvent(spec.tag,(function(el,txt){return function(){blur(el,txt)}})(spec.tag,"填写标签/兴趣爱好"),'blur');
			_addEvent(spec.school,(function(el,txt){return function(){blur(el,txt)}})(spec.school,"输入学校名称"),'blur')
			_addEvent(spec.company,(function(el,txt){return function(){blur(el,txt)}})(spec.company,"输入公司名称"),'blur')
        };
		var focus = function(el,txt){
			if(_trim(el.value) == txt){
				el.value = "";
			}
			Core.Events.stopEvent();
			return false;
		};
		var blur = function(el,txt){
			if(_trim(el.value) == ""){
				el.value = txt;
			}
			Core.Events.stopEvent();
			return false;
		};
        var search = function(spec){
            var url = spec['url'];
            //如果显示
            if (spec.h_mod) {
                var params = global.htmlToJson(spec['form']);
            }
            else {
                var params = {};
            }
            for (var k in params) {
                if ((!params[k])||params[k]==='0'||params[k]===(spec['clearData']&&spec['clearData'][k])) {
                    delete params[k];
                }else{
					params[k] = encodeURIComponent(params[k]);
				}
            }
			params['keytime'] = new Date().valueOf()
            url = url + (url.indexOf('?') == -1 ? '?' : '&') + global.jsonToQuery(params);
            if (spec.h_mod) {
                url += '#showsearch'
            }
            
                location.href = url;
            
            return false;
        };
		var autoComp = function(spec){
            _each(spec['autocomp']['dom'], function(v, i){
                var dom = $E(v);
                global.autoComplate({
                    'input': dom,
                    'ok': function(value, text){
                        dom.value = text;
                        if (typeof spec['autocomp']['ok'] === 'function') {
							spec['autocomp']['ok']();
						}
                    },
                    'light': function(el){
                        el.className = spec['autocomp']['light'] || 'cur';
                        
                    },
                    'dark': function(el){
                        el.className = spec['autocomp']['dark'] || '';
                    },
                    'timer': 2,
                    'style': spec['autocomp']['style'] || 'width:' + dom.offsetWidth + 'px;position:absolute;z-index:200',
                    'class': spec['autocomp']['class'] || 'layerMedia_menu',
                    'type': 'ajax',
                    'data': spec['autocomp']['url'][i]
                });
            })
        };
        var reset = function(spec, data){
            for (var i in data) {
                if (!_isArray(spec[i])) {
                    spec[i].value = data[i];
					Core.Events.fireEvent(spec[i],'change');
                }
                else {
                    for (var k = 0; k < spec[i].length; k++) {
                        if (spec[i][k].getAttribute('type').toLowerCase() == "checkbox" || spec[i][k].getAttribute('type').toLowerCase() == "radio") {
                            spec[i][k].value == data[i] ? spec[i][k].checked = true : spec[i][k].checked = false;
                        }
                    }
                }
            }
            
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
        that.initForm = function(){
            iEvt(_spec)
        };
        /*
         搜索
         */
        that.search = function(){
            search(_spec);
        };
        that.setter = function(name, value){
            _spec[name] = value;
            return;
        };
        that.render = function(name, value, callback){
            if (_spec[name].tagName.toUpperCase() == "INPUT") {
                _spec[name].value = value;
                callback && callback(name, value);
            }
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
        that.reset = function(spec, data){
            reset(spec['clearNode'], spec['clearData']);
        };
//        that.initForm(spec);
        return that;
    };    
})(App.relation = {}, App);
