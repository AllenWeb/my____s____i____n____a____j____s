/**
 * @author Pjan | peijian@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/htmltojson.js");
$import("diy/check.js");
$import("jobs/request.js");
$import("diy/enter.js");
$import('diy/querytojson.js');
$import("diy/autocomplate.js");
$import('sina/core/events/fireEvent.js');
$import("sina/utils/sinput/sinput.js");
(function(ns){
    //查找form表单
    ns.findFrom = function(_dom){
        _form = _dom;
        while (_form.nodeName.toLowerCase() !== 'form') {
            if (_form.nodeName === 'body') {
                _form = false;
                break;
            }
            _form = _form.parentNode;
        }
        return _form;
    };
    
    //提交表单
    ns.step3Submit = function(_dom){
        _input = ns.findFrom(_dom).getElementsByTagName('input')[0];
        if (_input.value === _input.getAttribute('clew') || _input.value === '') {
            return;
        }
        _form.submit();
    };
    
    //msn联系人	
    ns.step3MsnSearch = function(_dom){
        var _form = ns.findFrom(_dom);
        var _msn = App.htmlToJson(_form);
        if (!(_msn.user && App.checkEml(_msn.user))) {
            App.alert($CLTMSG['CX0070']);
            return;
        }
        if (_msn.password === '') {
            setTimeout(function(){
				App.alert($CLTMSG['CX0071']);
			},10);
            return;
        }
        
        //提交代码到接口
        App.doRequest(_msn, '/person/aj_msnfriend.php', function(json){
        	if(json === 0){
				//提示没有用户
				$E('msn_error_tip').style.display = '';
				$E('msn_loading').style.display = 'none';
				$E('findfriend').style.display = '';
				return;
			} else{
				//提交表单
				_form.submit();
			}
        }, function(json){
			App.alert(json);
			$E('msn_error_tip').style.display = 'none';
			$E('msn_loading').style.display = 'none';
			$E('findfriend').style.display = '';
        }, 'post');
		//提交过程
		$E('msn_error_tip').style.display = 'none';
		$E('msn_loading').style.display = '';
		$E('findfriend').style.display = 'none';
    };
})(App);

$registJob("msn_submit",function(){
	var _btn = $E('findfriend');
	var msnSearchBtn = function(){
		App.step3MsnSearch(_btn);
	}
	var maxlen = 60;
	var url = null;
	var step =(App.queryToJson(window.location.search.slice(1),true))['t'];
	if(step=='3'){
		//联想公司
		url ='/person/relatecompany.php'
	}else if(step=='4'){
        //联想学校
		url ='/person/relateschool.php';
	}else if(step=='2'){
		url ='/person/aj_tagchooser.php';
	}
	var dom = $E('autoComplate');
	var _find = $E('findpeople');
	Utils.Sinput.limitMaxLen(dom, maxlen);
	Core.Events.addEvent(_btn, msnSearchBtn, 'click');
	if (url&&url != "") {
		App.autoComplate({
			'input': dom,
			'ok': function(value, text){
				dom.value = text;
				Core.Events.fireEvent(_find,'click');
			},
			'light': function(el){
				el.className = 'cur';
			},
			'dark': function(el){
				el.className = '';
			},
			'timer': 2,
			'style': 'width:352px;position:absolute;z-index:200',
			'class': 'layerMedia_menu',
			'type': 'ajax',
			'data': url
		});
	}
	App.enterSubmit({
        parent : App.findFrom(_btn),
        action : msnSearchBtn
    });
});