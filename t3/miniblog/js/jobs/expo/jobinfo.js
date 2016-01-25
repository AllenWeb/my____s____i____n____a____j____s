/**
 * @author chibin
 *
 * 认证身份
 */
$import("sina/utils/io/ajax.js");
$import("diy/htmltojson.js");
$import("jobs/expo/expo_option.js");
$import("sina/core/dom/next.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/prompttip.js");
$registJob('jobinfo', function(){
    var element = {
        parkDom: $E('service_area'), //园区
        jobDom: $E('job_type'), //职位
        workDom: $E('job'), //工作
        areaDom: $E('area'), //片区
        venueDom: $E('venue'),//场馆
        parkCode: $E('service_area').getAttribute('truevalue') || $E('service_area').value,
        jobCode: $E('job_type').getAttribute('truevalue') || $E('job_type').value,
        workCode: $E('job').getAttribute('truevalue') || $E('job').value,
        areaCode: $E('area').getAttribute('truevalue') || $E('area').value,
        venueCode: $E('venue').getAttribute('truevalue') || $E('venue').value,
        url: '/aj_volunteer.php',
        nextUrl: scope.nexturl,
        nextStep: $E('nextStep'),
        errInfoCls: 'tdCon',
        errInfoTag: 'TD',
        errMsg: {
            'park': '请选择园区',
            'job': '请选择职位类别',
            'work': '请选择职位分工',
            'area': '请选择片区',
            'venue': '请选择场馆'
        }
    }
    var _next = Core.Dom.next;
    var _getElByCls = Core.Dom.getElementsByClass;
    new App.ExpoVolunteerJob(element['parkDom'], element['jobDom'], element['workDom'], element['areaDom'], element['venueDom'], element['parkCode'], element['jobCode'], element['workCode'], element['areaCode'], element['venueCode']);
    var cb = function(){
		try {
			if (element['nextUrl'] && element['nextUrl'] !== '') {
				window.location.href = element['nextUrl'];
			}
			App.promptTip($SYSMSG['A00006']);
		}catch(e){
			
		}
    }
    var ecb = function(json){
        //if (json.code == '') {
        App.alert({
			code: json.code
		});
        // }
    }
    var _clear = function(key){
        var dom;
		if (key) {
			for (var i = 0; i < key.length; i++) {
				dom = _next(element[key[i] + 'Dom'], 'cudTs3')||_next(element[key[i] + 'Dom'], 'cudTs4');
				if (dom) {
					dom.className='cudTs3';
					dom.style.display = 'none';
				}
			} 
			return false;
		}
		for(var k in element['errMsg']){
			dom = _next(element[k+'Dom'],'cudTs3');
			if(dom) dom.style.display='none'; 
		}
	}
    var req = function(){
        var param = App.htmlToJson(document, ['SELECT']);
        Utils.Io.Ajax.request(element['url'], {
            'POST': param,
            'onComplete': function(json){
                if (json && json.code == 'A00006') {
                    cb();
                }
                else {
                    ecb(json);
                }
            },
            'onException': function(){
                      window.location.reload();
            },
            'returnType': 'json'
        });
    };
	var checkYes = function(dom){
		if (dom.value != '0' && dom.style.display != 'none') {
			var table = _next(dom, 'cudTs3')||_next(dom, 'cudTs4');
			table.className = 'cudTs4'
			table.style.display='';
			var errinfo = _getElByCls(table, element['errInfoTag'], element['errInfoCls'])[0];
			errinfo.innerHTML = '';
		}else{
			var table = _next(dom, 'cudTs3')||_next(dom, 'cudTs4');
            table.className = 'cudTs3'
            table.style.display='none';
            var errinfo = _getElByCls(table, element['errInfoTag'], element['errInfoCls'])[0];
            errinfo.innerHTML = '';
		}
	}
    var check = function(dom, type){
		if (_next(dom, 'cudTs3')) {
			if (dom.value == '0' && dom.style.display != 'none') {
				var table = _next(dom, 'cudTs3');
				table.style.display = '';
				var errinfo = _getElByCls(table, element['errInfoTag'], element['errInfoCls'])[0];
				errinfo.innerHTML = element['errMsg'][type];
				return false;
			}
			else {
				var table = _next(dom, 'cudTs3');
				table.style.display = 'none';
				var errinfo = _getElByCls(table, element['errInfoTag'], element['errInfoCls'])[0];
				errinfo.innerHTML = '';
				return true;
			}
		}else{
			return true;
		}
    };
	
		Core.Events.addEvent(element['parkDom'], function(){
			_clear(['park','job','work','area','venue']);
			checkYes(element['parkDom']);
		}, 'change');
		Core.Events.addEvent(element['jobDom'], function(){
            _clear(['job','work']);
            checkYes(element['jobDom']);
        }, 'change');
		Core.Events.addEvent(element['workDom'], function(){
            _clear(['work']);
            checkYes(element['workDom']);
        }, 'change');
		Core.Events.addEvent(element['areaDom'], function(){
            _clear(['area','venue']);
            checkYes(element['areaDom']);
        }, 'change');
		Core.Events.addEvent(element['venueDom'], function(){
            _clear(['venue']);
            checkYes(element['venueDom']);
        }, 'change');
	
    Core.Events.addEvent(element['nextStep'], function(){
		_clear();
        for (var k in element['errMsg']) {
		    if(!check(element[k+'Dom'],k)){
				return false;
			}
		}
        req();
    }, 'click');
    return false;
    
});
