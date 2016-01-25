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
$import('sina/core/string/trim.js');
//$import("sina/utils/sinput/sinput.js");
$import("diy/enter.js");
$import("diy/search/searchform.js");
$import("diy/htmltojson.js");
$registJob('search_people', function(){
    var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
    var _spec = {
        form: $E('highSearchCon'),
        search_txt: $E('user_search_input'),
        search_btn: $E('user_search_btn'),
        dsable: ['nickname', 'domain', 'desc', 'isauth'],
        province: $E('province'),
        city: $E('city'),
		urlRedirect:false,
        url: '/search/user.php',
        defaultBtn: $E('search_reset'),
        h_mod: false,
        autocomp: {
            dom: ['user_search_input','s_school', 's_work', 's_tag'],
            url: ['/person/aj_blogchooser.php?where=user','/person/relateschool.php', '/person/relatecompany.php', '/person/aj_tagchooser.php'],
			ok: function(){
				Core.Events.fireEvent($E('user_search_btn'),'click')
			}
        },
        defaultValue: {
            'nickname': '1',
            'domain': '1',
            'desc': '1',
            'isauth': '1'
        }
    }
    var searchBox = new App.searchForm(_spec);
    //	searchBox.initForm(_spec);
    var showModDialog = function(bh){
        //显示和隐藏高级搜索         
        if (bh) {
            searchBox.show();
        }
        else {
            searchBox.hidd();
        }
//        var imgel = $E('user_search_btn').getElementsByTagName('img')[0];
        //        imgel.src = imgel.src.replace(/jh_ffbtn\d/, bh ? 'jh_ffbtn2' : 'jh_ffbtn1')
        //        $E('isopen').className = bh ? 'jh_search jh_schAdvance left_search' : 'jh_search left_search';
        $E('changeSearchMod').innerHTML = $CLTMSG[bh ? 'CF0115' : 'CF0113'];
        searchBox.setter('h_mod', bh);
    }
    showModDialog(/#showsearch/.test(location.href));
    _addEvent($E('changeSearchMod'), function(){
        Core.Events.stopEvent();
        showModDialog(!searchBox.getter('h_mod'));
    }, 'click');
});
