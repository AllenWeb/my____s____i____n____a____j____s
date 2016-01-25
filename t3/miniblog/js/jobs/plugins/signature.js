/**
 * @desc 微博工具签名档设置
 * @author dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import("sina/core/dom/getElementsByClass.js");
$import('sina/core/array/foreach.js');
$import("diy/copy.js");
$import("diy/dialog.js");
(function(){
    var element = {}; //要用到dom缓存
    var baseUrl = '', baseTemplate = '';
    var url = scope.$domain + scope.$uid + '?s=6uyXnP';
    
    var _template = {
        'use_01': '[url=' + url + '][img]%baseurl%[/img][/url]',
        'use_02': '<a href="' + url + '" target="_blank"><img border="0" src="%baseurl%"/></a>',
        'use_03': '%baseurl%',
        'use_04': ''
    }
    
    function changeUI(type){
		if( !$E('copy_text_title') ) return;
		
        if (type == 'use_04') { //复制dom
            $E('copy_text_title').style.display = 'none'
            $E('copy_text_con').style.display = 'none'
            $E('copy_dom_title').style.display = ''
            $E('copy_dom_con').style.display = ''
        }
        else {
            $E('copy_dom_title').style.display = 'none'
            $E('copy_dom_con').style.display = 'none'
            $E('copy_text_title').style.display = ''
            $E('copy_text_con').style.display = ''
            
        }
    }
    //修改用途
    function changeUseType(type){
        var type = type || 'use_01';
        baseTemplate = _template[type];
    }
    
    //修改模板
    function changTemplate(type){
        var type = type || '1'; 
		//http://service.t.sina.com.cn/widget/qmd/用户UID/加密串/皮肤样式编号.png
		baseUrl = 'http://service.t.sina.com.cn/widget/qmd/' + scope.$uid + '/'+ scope.$checkKey+'/' + type + '.png';
        //http://service.weibo.com/widget/signature/%E8%93%AC%E8%8E%B1%E9%98%81/1/signature.png
        //baseUrl = 'http://service.t.sina.com.cn/widget/signature/' + scope.$uname + '/' + type + '/signature.png';
        $E('view_img').src = baseUrl + '?rnd=' + (new Date().valueOf());
    }
    
    //设置复制的内容
    function setCopyText(){
        element.textarea.value = ''
        var str = baseTemplate.replace(/%baseurl%/, baseUrl);
        element.textarea.value = str;
        
    }
    
    //绑定事件
    $registJob('set_signature', function(){
        element.textarea = $E('html_code');
		
		$E('view_img').parentNode.href = url;
        
//		(function(){
//			var i = 0;		
//			Core.Events.addEvent(element.textarea, function(){
//            	i%2 == 0 && element.textarea.select();
//				i++;
//        }, 'click')			
//		})();
        
        
        //用途的绑定
        Core.Array.foreach(['use_01', 'use_02', 'use_03', 'use_04'], function(v, i){			
			if( !$E(v) ) return;
            //绑定click事件 			
            Core.Events.addEvent($E(v), function(){
                changeUI(v);
                changeUseType(v);
                setCopyText();
            }, 'click');
        });
        
        
        
        //模板选择绑定
        var list = $E('template_skins').getElementsByTagName('a');
        var lastSkin = null;
        Core.Array.foreach(list, function(v, i){
            if (i == 0) lastSkin = v
            Core.Events.addEvent(v, function(){
                lastSkin.className = '';
                lastSkin = v;
                lastSkin.className = 'on';
                changTemplate(i + 1);
                setCopyText();
                Core.Events.stopEvent();
            }, 'click');
        })
        list = null;
        
        $E('use_01').checked = true;
        changeUseType('use_01');
        changeUI('use_01')
        changTemplate();
        setCopyText();
        
        
        function showMsg(key){
            var kt = App.alert($CLTMSG[key], {
                icon: 3
            });
            var ktv = setTimeout(function(){
                try {
                    kt && (kt.close());
                } 
                catch (e) {
                }
            }, 2000);
            kt.onClose = function(){
                clearTimeout(ktv);
                ktv = null;
            };
        }
        
        Core.Events.addEvent($E("copyhtml"), function(){
            Core.Events.stopEvent();
            if (App.copyText(element.textarea.value || "")) {
                showMsg('CF0118');
            }
            else {
                App.alert($CLTMSG["CD0016"],{ok:function(){
					element.textarea.select();
				}});
            };
                    }, "click");
        
        $E("copy_dom_btn") && Core.Events.addEvent($E("copy_dom_btn"), function(){
            Core.Events.stopEvent();
            
            setTimeout(function(){
                var sel = function(){
                    try {
						var oid = $E("preview_con").getElementsByTagName('a')[0]
						var range = document.body.createTextRange();
						range.moveToElementText(oid);
						range.select();
                    } 
                    catch (e) {
						try {
							window.getSelection().selectAllChildren($E("preview_con"));
						}catch(e){return;};
                    };
                                    }
				sel();					
                
                try {
                    document.execCommand("Copy");
                } 
                catch (e) {
                    App.alert( $CLTMSG['CF0501'], {
                        ok: function(){
                        	sel();
                        }
                    });
                    //TODO 不能复制
                    return;
                }
                
                showMsg('CF0118');
           }, 0);

        }, "click");
       
    });
    
})();
