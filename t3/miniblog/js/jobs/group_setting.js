/**
 * @author wangliang3@staff.sina.com.cn
 */
//import API
$import("diy/dom.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("diy/TextareaUtils.js");
$import("sina/core/string/decodeHTML.js");
//ajax
$import("sina/utils/io/ajax.js");

$registJob('group_setting', function(){
    var event = Core.Events, dom = App.Dom;
    
    var conf = {
        btn: $E('group_setting_rname'),
		groups: $E('group_sidebar_list'),
        tip_id: 'group_set_rname'
    };
    var domList = {};
	var title = null;
    var handler = {
        check: function(def){
            def = def || false;
			if (def) {
                domList['error'].style.cssText = '';
                domList['error'].innerHTML = $SYSMSG['M14019'];
				return true;
            }
			
            var value = domList['txtinput'].value.replace(/^\s+|\s+$/g, '');
            if (value == '') {
                domList['error'].style.cssText = 'color:red;'
                domList['error'].innerHTML = $SYSMSG['M14014'];
				App.TextareaUtils.setCursor(domList['txtinput']);
                return false;
            }
            if (Core.String.byteLength(value) > 16) {
                domList['error'].style.cssText = 'color:red;'
                domList['error'].innerHTML = $SYSMSG['M14010'];
				App.TextareaUtils.setCursor(domList['txtinput']);
                return false;
            }
            if (value == Core.String.decodeHTML($E(conf.btn.getAttribute('gid')).innerHTML.replace(/^\s+|\s+$/g, ''))) {
				$E(conf.tip_id).style.display = 'none';
				title.style.visibility = 'inherit';			
                return false;
            }
            return true;
            
        },
        save: function(){
            if (!handler.check()) {
                return;
            }
            
            domList['mask'].style.display = '';
			domList['loading'].style.display = '';
			domList['cancel'].style.display = 'none';
            
            var pars = {
                'name': domList['txtinput'].value,
                'gid': conf.btn.getAttribute('gid')
            };
            Utils.Io.Ajax.request('/attention/aj_group_rename.php', {
                'POST': pars,
                'onComplete': function(json){
                    if (json.code == 'A00006') {
                        setTimeout(function(){
							window.location.href=window.location.href;
                        }, 1500);
                    }
                    else {
						setTimeout(function(){
	                        domList['error'].style.cssText = 'color:red;'
	                        domList['error'].innerHTML = $SYSMSG[json.code];
	                   		domList['loading'].style.display = 'none';
							domList['cancel'].style.display = '';
							domList['mask'].style.display = 'none';
							App.TextareaUtils.setCursor(domList['txtinput']);
						}, 1500);
                    }
                    
                },
                'onException': function(){
                
                },
                'returnType': 'json'
            });
        }
    };
    var buildLayer = function(){
        var cont = conf.btn.parentNode;
        for (; !dom.hasClass(cont, 'n_group'); cont = cont.parentNode) 
            ;
        var tips = $C('div');
        tips.setAttribute('id', conf.tip_id);
        tips.style.cssText = 'position:absolute;top:-9px;';
        cont.insertBefore(tips,dom.getByClass('linkL','div',cont)[0]);
        cont.style.cssText = 'position:relative;';
        
        var html = [];
        html.push('<div style="width: 220px;">');
        html.push('	<div act="content" class="tagslayer">');
        html.push('		<div><input type="text" act="txtinput" class="PY_input" /><a act="save" href="javascript:;" class="btn_normal btnxs"><em>' + $CLTMSG['CC1102'] + '</em></a>&nbsp;<img act="loading" src="' + scope.$BASEIMG + 'style/images/common/loading.gif" title="Loading" /><a act="cancel" href="javascript:;"><em>' + $CLTMSG['CC1103'] + '</em></a></div>');
        html.push('		<p class="txt"><span act="error">' + $SYSMSG['M14019'] + '</span></p>');
        html.push('	</div>');
		html.push('	<div act="mask"></div>');
//		html.push('	<div act="mask"><img src="' + scope.$BASEIMG + 'style/images/common/loading.gif" title="Loading" /></div>');
        html.push('</div>');
		
		tips.innerHTML = html.join('');
		dom.getBy(function(el){
			if(el.getAttribute('act')){
				domList[el.getAttribute('act')] = el;
			}
		},'',tips);
		//set default value
		domList['txtinput'].value = Core.String.decodeHTML($E(conf.btn.getAttribute('gid')).innerHTML);
		//
		domList['mask'].style.cssText = 'display:none;position:absolute;top:0;text-align:center;width:100%;padding:22px 0;';
		domList['loading'].style.cssText = 'display:none;vertical-align:middle;';
        //bind event
		event.addEvent(domList['save'], handler.save);
        event.addEvent(domList['cancel'], function(){
			title.style.visibility = 'inherit';
			tips.parentNode.removeChild(tips);
        });
		event.addEvent(domList['txtinput'],function(e){
			if(e.keyCode === 13){
				handler.save();
			}
		},'keypress');
        App.TextareaUtils.setCursor(domList['txtinput']);
    };
    //event bind to page
    if (conf.btn) {
		for(title=conf.btn;!dom.hasClass(title,'tit');title=title.parentNode);
		
        event.addEvent(conf.btn, function(){
            event.stopEvent();
			title.style.visibility = 'hidden';
            var tips = $E(conf.tip_id);
            if (tips) {
                handler.check(true);
                tips.style.display = '';
                App.TextareaUtils.setCursor(domList['txtinput']);
                return;
            }
            buildLayer();
        });
    };
});
