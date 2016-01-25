/**
 * @author wangliang3@staff.sina.com.cn
 */
$import('sina/core/events/stopEvent.js');
$import("sina/core/events/addEvent.js");
$import('diy/dom.js');


$registJob('atme_filter', function(){
    //dom operate
    var event = Core.Events, dom = App.Dom;
    //global pars
    var item = {
        mod: $E('atme_filter')
    };
    //operate 
    var handler = {
        init: function(mod){
            dom.getBy(function(el){
                var attr = el.getAttribute('act');
				if(!attr){return false;}
                item[attr] = el;
                switch (attr) {
                    case 'exp':
                        event.addEvent(el,function(){
                            handler.panel(el);
                        });
                        break;
                    case 'unexp':
                        event.addEvent(el,function(){
                            handler.panel(el);
                        });
                        break;
                    case 'submit':
                        event.addEvent(el,handler.submit);
                        break;
                }
            }, '', mod);
			
			var i=0;
        },
        submit: function(){
            event.stopEvent();
            item['form'].submit();
        },
        panel: function(obj){
			var state = obj.getAttribute('state');
			if(state == 'post'){
				return ;
			}
			event.stopEvent();
			
			var attr = obj.getAttribute('act');
			handler[attr]&&handler[attr]();
        },
        exp: function(){
			dom.setStyle(item['title'], 'display', 'none');

			var el = item['panel'];
            el.style.cssText = '';
            dom.setStyle(el, 'opacity', 0);
            dom.setStyle(el, 'display', '');
            var opa = 0, bas = 10, g = 1.5, time = 100, interval = null;
            var interFunc = function(){
                bas *= g;
                opa += bas;
                if (opa >= 100) {
                    clearInterval(interval);
                    dom.setStyle(el, 'opacity', 100);
                }
                else {
                    dom.setStyle(el, 'opacity', opa / 100);
                }
            };
            interval = setInterval(interFunc, time);
        },
        unexp: function(){
			
			var el = item['panel'];
            var height = el.offsetHeight;
            dom.setStyle(el, 'overflow', 'hidden');
            var time = 35, interval = null, base = 40;
            var interFunc = function(){
                base -= 3;
                height -= base;
                if (height <= 17 || base <= 0) {
                    clearInterval(interval);
                    dom.setStyle(el, 'display', 'none');
                    dom.setStyle(item['title'], 'display', '');
                }
                else {
                    dom.setStyle(el, 'height', height + 'px');
                }
            };
            interval = setInterval(interFunc, time);
        }
    }
    //control init
    item.mod && handler.init(item.mod);
});
