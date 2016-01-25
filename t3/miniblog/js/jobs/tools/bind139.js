/**
 * @desc 微博工具绑定139首页
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/array/foreach.js');
$import("sina/core/dom/setStyle2.js");
$import('diy/builder2.js');
$import("sina/core/dom/getElementsByClass.js");
$import("diy/dialog.js");
$registJob('initBind139', function(){
    var _addEvent = Core.Events.addEvent;
    var _each = Core.Array.foreach;
    var dom = null, _lay = null;
    
    var showLogin = function(cbFun){
        var _timer = setInterval(function(){
            if (MI && MI.init) {
                clearInterval(_timer);
                MI.init('94c96693cff14d0c59563086fb49bcee', 'http://t.sina.com.cn/plugins/bind139proxy.php');               
                showLoginTop(cbFun);     
            }
        }, 100);
    }
    
    function showLoginTop(cbFun){
        MI.Connect.requireSession(function(r){
            if (r.status == MI.ConnectState.connected) {
                cbFun(r);
            }
        }, function(r){
            _lay.enable();
        }, false)
    }
    
    
    function submit(r){
        createForm();
        //connected,
        _each('token,userid,mi_sig,account'.split(','), function(v, i){
            dom[v].value = r[v] || '';
        })
        //TODO 初始化数据
        setTimeout(function(){
            dom['send_form'].submit();
        }, 0)
    }
    
    //绑定type未1，0解除
    function bind139(type){
        showLogin(function(r){
            submit(r);
            //1绑定 0解除
            dom['bind_type'].value = type;
        }); //跳转到绑定139页
//        App.scrollToTarget(Core.Dom.getElementsByClass(document.body, "div", "MIB_bloga")[0]);
        _lay.disable();
    }
    
    _each(['weib_unbind139', 'weib_bind139'], function(v, i){
        if (!$E(v)) 
            return;
        _addEvent($E(v), function(){
            bind139(i + 1);
        }, 'click')
    })
    
    function createForm(){
        if (dom) 
            return;
        var list = [];
        
        _each('token,userid,mi_sig,bind_type,account'.split(','), function(v, i){
            list.push({
                tag: 'input',
                attr: {
                    name: v,
                    id: v,
                    type: 'input'
                }
            })
        })
        
        var spec = {};
        spec['box'] = document.body;
        spec['template'] = [{
            'tag': 'form',
            'attr': {
                style: '', //'height:1px;overflow:hidden;line-height:1px;',
                method: 'POST',
                id: 'send_form'
            },
            'list': list
        }];
        var test = App.builder2(spec);
        //TODO 跳转到的地址
        test.domList['send_form'].action = 'bind139_judge.php';
        dom = test.domList;
    };
    //显示遮盖层
    (function(){
        var lay = null, layF = null, count = 0;
        
        function $C(tagName, cls, csstxt){
            var el = document.createElement(tagName);
            if (cls) 
                el.className = cls;
            if (csstxt) 
                el.style.cssText = csstxt;
            return el;
        };
        
        function pageWH(){
            function wh(name){
                return Math.max(document.documentElement["client" + name], document.body["scroll" + name], document.documentElement["scroll" + name], document.body["offset" + name], document.documentElement["offset" + name]);
            }
            return [wh('Width'), wh('Height')];
        }
        
        function create(){
            lay = $C('div', '', 'position: absolute; top: 0px; left: 0px; background-color: rgb(0, 0, 0); z-index: 500;');
            if (/MSIE 6.0/ig.test(navigator.appVersion)) 
                lay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe>'
            document.body.appendChild(lay);
            var pwh = pageWH();
            
            Core.Dom.setStyle2(lay, {
                width: pwh[0] + 'px',
                height: pwh[1] + 'px',
                opacity: 0.3
            })
            
            create = function(){
            };
        }
        _lay = {
            disable: function(){ //禁用页面
                create();
                lay.style.display = '';
                count++;
            },
            enable: function(){ //取消禁用
                count--;
                if (count === 0) 
                    lay.style.display = 'none';
            }
        }
    })();
    
	//弹出错误提示和滚动
    (function(){
        var _scroll = function(){
          //  App.scrollToTarget(Core.Dom.getElementsByClass(document.body, "div", "PY_tag")[0]);
        }
        
        if (typeof scope.bind139Error == 'string' && scope.bind139Error) {
            App.alert(scope.bind139Error, {
                ok: _scroll
            });
        }
        else {
            setTimeout(function(){
                _scroll()
            }, 1000);
        }
    })();
    
});
