/**
 * @author chibin
 * 活动搜索页
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/events/fireEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/string/trim.js');
$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/search/searchform.js");
$import("diy/htmltojson.js");


$registJob('search_tag', function(){
    var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
    var _spec = {
        search_txt: $E('usertag_search_input'),
        search_btn: $E('usertag_search_btn'),
        url: '/search/usertag.php',
        autocomp: {
            dom: ['usertag_search_input'],
            url: ['/person/aj_blogchooser.php'],
			ok: function(){
				Core.Events.fireEvent($E('usertag_search_btn'),'click')
			}
        },
		'default-text':$CLTMSG['CY0149']
    }
    var searchBox = new App.searchForm(_spec);
   
	_addEvent(_spec['search_txt'], function(){
        if (Core.String.trim(_spec['search_txt'].value) === $CLTMSG['CY0149']) {
            _spec['search_txt'].value = "";
        }
    }, 'focus');
    _addEvent(_spec['search_txt'], function(){
        if (Core.String.trim(_spec['search_txt'].value) === '') {
            _spec['search_txt'].value = $CLTMSG['CY0149'];
        }
    }, 'blur');
});
