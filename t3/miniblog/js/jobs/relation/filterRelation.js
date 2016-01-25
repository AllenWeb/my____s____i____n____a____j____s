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
$import("diy/relation/filterLayer.js");
$import("diy/htmltojson.js");
$import("diy/provinceandcity.js");
$import("diy/curtain.js");
$registJob('filterRelation', function(){
    var _addEvent = Core.Events.addEvent;
    var _trim = Core.String.trim;
    if (!$E('filterLayer')) {
        return false;
    };
    var _spec = {
        form: $E('filterLayer'),
        search_btn: $E('filterButton'),
        province: $E('filterProvince'),
        city: $E('filterCity'),
        url: scope.currentUrl || location.href,
//        defaultBtn: $E('search_reset'),
        clear: $E('filterClear'),
        tag: $E('filterTag'),
        school: $E('filterSch'),
        company: $E('filterCom'),
        sex: document.getElementsByName('sex'),
        Vuser: document.getElementsByName('V'),
        h_mod: /#showsearch/.test(location.href),
        autocomp: {
            dom: ['filterSch', 'filterCom', 'filterTag'],
            url: ['/person/relateschool.php', '/person/relatecompany.php', '/person/aj_tagchooser.php']
        },
        clearData: {
            'province': '0',
            'city': '0',
            'tag': $CLTMSG['CC6102'],
            'school': $CLTMSG['CC6103'],
            'company': $CLTMSG['CC6104'],
            'Vuser': '0',
            'sex': '0'
        },
        clearNode: {
            'province': $E('filterProvince'),
            'city': $E('filterCity'),
            'tag': $E('filterTag'),
            'school': $E('filterSch'),
            'company': $E('filterCom'),
            'Vuser': [$E('Vuser1'), $E('Vuser2'), $E('Vuser0')],
            'sex': [$E('filterMan'), $E('filterWoman'), $E('filterOpen')]
        }
    };
    var list;
    
    var mytag = $E('myTag');
    var myinfo = $E('myInfo');
    var Vshow = $E('Vuser');
    var showF = $E('showFilter');
    var closeF = $E('closeFilter');
    var searchBox = new App.relation.filterLayer(_spec);
    var showModDialog = function(bh){
        //显示和隐藏高级搜索       
        searchBox.setter('h_mod', bh);
        if (bh) {
            if (showF.style.display == "none") {
                return false;
            }
            showF.style.display = "none";
			searchBox.show();
			searchBox.getter('form').style.height=searchBox.getter('form').offsetHeight+'px'
			App.setOpacity(searchBox.getter('form'),0);
            App.opacity(searchBox.getter('form'), {
                first: 0,
                last: 100
            });
        }
        else {
            if (searchBox.getter('form').style.display == "none") {
                return false;
            }
            App.curtain.raise(searchBox.getter('form'), function(){
                searchBox.hidd();
                showF.style.display = "";
            });
        }
    };
    
    
    _addEvent(showF, function(){
        Core.Events.stopEvent();
        showModDialog(!searchBox.getter('h_mod'));
    }, 'click');
    _addEvent(closeF, function(){
        Core.Events.stopEvent();
        showModDialog(!searchBox.getter('h_mod'));
    }, 'click');
    if (mytag) {
        list = mytag.getElementsByTagName('A');
        for (var i = 0; i < list.length; i++) {
            _addEvent(list[i], (function(el, sB){
                return function(){
                    sB.setter('h_mod', true)
                    sB.render('tag', el.innerHTML);
                    setTimeout(function(){
                        sB.search();
                    }, 100);
                    Core.Events.stopEvent();
                    return false;
                }
            })(list[i], searchBox), 'click');
        }
    };
    
    if (myinfo) {
        list = myinfo.getElementsByTagName('A');
        for (var i = 0; i < list.length; i++) {
            _addEvent(list[i], (function(el, sB){
                return function(){
                    sB.setter('h_mod', true)
//                    showModDialog(!sB.getter('h_mod'));
                    sB.render(el.getAttribute('infotype'), el.innerHTML);
                    setTimeout(function(){
                        sB.search();
                    }, 100);
                    Core.Events.stopEvent();
                    return false;
                }
            })(list[i], searchBox), 'click');
        }
    };
    
    if (Vshow) {
        _addEvent(Vshow, (function(el, sB){
            return function(){
                sB.setter('h_mod', true)
//                showModDialog(!sB.getter('h_mod'));
                var it = sB.getter('Vuser');
                for (var i = 0; i < it.length; i++) {
                    if (it[i].value == el.getAttribute('value')) {
                        it[i].checked = true;
                    }
                }
                setTimeout(function(){
                    sB.search();
                }, 100);
                Core.Events.stopEvent();
                return false;
            }
        })(Vshow, searchBox), 'click');
    };
    showModDialog(/#showsearch/.test(location.href));
	searchBox.initForm();
});
