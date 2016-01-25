/**
 * @author chibin
 * 内容日期筛选层，他人首页用
 */
$import("diy/builder3.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/setStyle.js");
$import("diy/TextareaUtils.js");
$import("diy/enter.js");
App.content_filter = function(spec){
    var html = '<div class="pop_dateSearch" style="top:0px;left:0px">\
				<form dd="filter_form" method="get" action="#action#">\
				<a href="javascript:void(0);" dd="close" class="close"></a>\
    			<dl>\
    			<dt>#title#</dt>\
    			<dd><label>' + $CLTMSG['CC6002'] + '</label><input type="text" name="filter_search" dd="keyword" class="txt wd1" value="#inputText#" def="#defaultText#"><a class="btn_normal btnxs" dd="submit" href="#"><em>' + $CLTMSG['CC1902'] + '</em></a></dd>\
    			<dd><label>' +
    $CLTMSG['CC6003'] +
    '</label><input type="text" dd="starttime" name="starttime" value="#starttime#" class="txt date" def="#defaultStarttime#"><span class="txtpd">' +
    $CLTMSG['CX0163'] +
    '</span><input dd="endtime" name="endtime" type="text" value="#endtime#" def="' +
    $CLTMSG["CC6001"] +
    '" class="txt date"></dd>\
				</dl>\
				#extendHTML#\
				</form></div>';
    
    var that = {}, container, _addevt = Core.Events.addEvent, _getXY = Core.Dom.getXY, _setXY = Core.Dom.setXY, _trim = Core.String.trim, _setStyle = Core.Dom.setStyle;
    _fireevt = Core.Events.fireEvent
    spec = spec ||
    {};
    spec.starttime = spec.starttime || $CLTMSG['CC6001'];
    var t = new Date(scope.$severtime * 1000);
    spec.nowtime = t.getFullYear() + '-' + (+t.getMonth() + 1) + '-' + t.getDate();
    spec.endtime = spec.endtime || spec.nowtime;
    spec['html'] = html.replace(/#action#/, spec['form_action']).replace(/#title#/, spec['title'] || '').replace(/#starttime#/, spec['starttime']).replace(/#endtime#/, spec['endtime']).replace(/#inputText#/, spec['inputText'] || '').replace(/#extendHTML#/, spec['extendHTML'] || '').replace(/#defaultText#/, spec['defaultText'] || '').replace(/#defaultStarttime#/, spec['defaultStarttime'] || '');
    /*
     目前好像不需要这个需要
     */
    var reset = function(spec, data){
        if (data) {
            data['txt'] &&
            (function(){
                spec.dialog.domList.keyword.value = data['txt']
            })();
            data['starttime'] &&
            (function(){
                spec.dialog.domList.starttime.value = data['starttime']
            })();
            data['endtime'] &&
            (function(){
                spec.dialog.domList.starttime.value = data['endtime']
            })();
        }
    };
    var build = function(spec){
        spec['container'] = $C("div");
        _setStyle(spec['container'], "position", "absolute");
        _setStyle(spec['container'], "zIndex", "103")
        spec['dialog'] = App.builder3(spec['html'], spec['container']);
        document.body.appendChild(spec['container']);
    };
    var setpos = function(spec){
        if (spec.txt) {
            var pos = _getXY(spec.txt);
            _setXY(spec['container'], [(+pos[0] - spec.dialog.domList.keyword.offsetLeft), (+pos[1] - spec.dialog.domList.keyword.offsetTop)])
        }
    };
    
    var search = function(spec){
        spec.dialog.domList.keyword.value = _trim(spec.dialog.domList.keyword.value);
        spec.searchFun && spec.searchFun(spec);
        if (spec.dialog.domList.starttime.value == spec.dialog.domList.starttime.getAttribute("def")) {
            spec.dialog.domList.starttime.value = "";
        }
        if (spec.dialog.domList.endtime.value == spec.dialog.domList.endtime.getAttribute("def")) {
            spec.dialog.domList.endtime.value = "";
        }
        if (spec.dialog.domList.keyword.value == spec.dialog.domList.keyword.getAttribute("def")) {
            spec.dialog.domList.keyword.value = "";
        }
        
        spec.dialog.domList.filter_form.submit();
    };
    
    
    var setdate = function(el, setdf, endDate, desc, spec){
        var box, that = {};
        var btn = el;
        var date = [];
        
		date = btn.value.split('-');
        var pos = Core.Dom.getXY(btn);
        var enddate = (function(){
            if (endDate) {
                return new Date(Date.UTC(endDate.split('-')[0], (endDate.split('-')[1] - 1), endDate.split('-')[2]));
            }
            else {
                return new Date(parseInt(scope.$severtime) * 1000);
            }
        })();
        if (Core.Dom.getElementsByClass(document, "div", "pc_caldr").length > 0) {

			box = Core.Dom.getElementsByClass(document, "div", "pc_caldr")[0];
			box.innerHTML = "";
		//            Core.Dom.removeNode(box);
		}
		else {
			box = document.createElement('DIV');
			document.body.appendChild(box);
		}
        box.style.cssText = 'position:absolute;display:none;z-Index:1000;';
        box.style.left = pos[0] + 'px';
        box.style.top = pos[1] + 20 + 'px';
        box.className = "pc_caldr";

        new domkey.Date(box, function(y, m, d){
            btn.value = y + '-' + ((parseInt(m) + 1) > 9 ? (parseInt(m) + 1) : '0' + (parseInt(m) + 1)) + '-' + (parseInt(d) > 9 ? d : '0' + d);
            setdf(btn.value);
            hidd();
            return false;
        }, (date[0] ? parseInt(date[0], 10) : (new Date()).getFullYear()), //年
 (date[1] ? parseInt(date[1], 10) : (new Date()).getMonth() + 1) - 1, //月
 enddate, //点击范围开始
 desc ? Math.ceil(desc / (24 * 60 * 60 * 1000)) : Math.ceil(((new Date()).getTime()) / (24 * 60 * 60 * 1000)),//点击范围长度［天］
 (parseInt(date[2], 10) || ((new Date()).getDate())) //选择日期
);
        box.style.display = '';
        Core.Events.stopEvent();
        box.onclick = function(){
            Core.Events.stopEvent();
            return false;
        };
        Core.Events.removeEvent(document.body, hidd, 'click');
        var hidd = function(){
            if (spec.dialog.domList.starttime.value === "") {
                spec.dialog.domList.starttime.value = $CLTMSG['CC6001'];
            }
			setTimeout(function(){
				box.style.display = 'none';
				box.innerHTML = "";
				Core.Dom.removeNode(box);
				Core.Events.removeEvent(document.body, hidd, 'click');
			},10)
        };
        Core.Events.addEvent(document.body, hidd, 'click');
        that.hidd = hidd;
        return that;
    };
    var close = function(spec){
        try {
            if (spec['container']) {
                spec['container'].style.visibility = "hidden";
            }
            if (typeof spec['dateObject'] === "object") {
                spec['dateObject'].hidd();
            }
            typeof spec.closeFun === "function" && spec.closeFun(spec);
        } 
        catch (e) {
        }
    };
    var show = function(spec, data){
        if (spec['container']) {
            //			reset(spec,data)
            setpos(spec);
            spec['container'].style.visibility = "visible";
            if (spec['inputText']) {
                spec.dialog.domList.keyword.value = spec['inputText'];
            }
            spec.dialog.domList.keyword.focus();
        }
    };
    var blur = function(spec){
        if (_trim(spec.dialog.domList.keyword.value) == "") {
            spec.dialog.domList.keyword.value = spec.dialog.domList.keyword.getAttribute("def");
        }
        Core.Events.stopEvent();
        return false;
    };
    var focus = function(spec){
        if (_trim(spec.dialog.domList.keyword.value) == spec.dialog.domList.keyword.getAttribute("def")) {
            spec.dialog.domList.keyword.value = "";
        }
        try {
            App.TextareaUtils.setCursor(spec.dialog.domList.keyword);
        } 
        catch (e) {
        }
        Core.Events.stopEvent();
        return false;
    };
    
    var addEvent = function(spec){
        _addevt(spec.dialog.domList.submit, function(){
            search(spec)
        }, 'click');
        _addevt(spec.dialog.domList.keyword, function(){
            focus(spec);
        }, 'focus');
        _addevt(spec.dialog.domList.keyword, function(){
            blur(spec);
        }, 'blur');
        if (spec.dialog.domList.starttime) {
            spec.dialog.domList.starttime.readOnly = true;
            _addevt(spec.dialog.domList.starttime, function(){
                if (spec.dialog.domList.starttime.value == $CLTMSG['CC6001']) {
                    spec.dialog.domList.starttime.value = "";
                }
                spec['dateObject'] = setdate(spec.dialog.domList.starttime, function(vl){
                    if (vl) {
                        spec.dialog.domList.starttime.value = vl;
                    }
                }, spec.dialog.domList.endtime.value, null, spec);
            }, 'click');
        };
        if (spec.dialog.domList.endtime) {
            spec.dialog.domList.endtime.readOnly = true;
            _addevt(spec.dialog.domList.endtime, function(){
                if (spec.dialog.domList.starttime.value === "") {
                    spec.dialog.domList.starttime.value = $CLTMSG['CC6001'];
                }
                spec['dateObject'] = setdate(spec.dialog.domList.endtime, function(vl){
                    if (vl) {
                        spec.dialog.domList.endtime.value = vl;
                    }
                }, null, spec.dialog.domList.starttime.value == $CLTMSG['CC6001'] ? null : (new Date() - new Date(spec.dialog.domList.starttime.value.split('-')[0], spec.dialog.domList.starttime.value.split('-')[1] - 1, spec.dialog.domList.starttime.value.split('-')[2])), spec);
            }, 'click');
        };
        if (spec.dialog.domList.close) {
            _addevt(spec.dialog.domList.close, function(){
                close(spec);
            }, 'click')
        };
        //		_addevt(spec.txt, show, 'focus');
        App.enterSubmit({
            parent: spec.dialog.domList.keyword.parentNode,
            action: function(){
                _fireevt(spec.dialog.domList.submit, 'click')
            }
        });
    };
    that.init = function(){
        build(spec);
        if (spec['hidden']) {
            close(spec);
        }
        addEvent(spec);
    };
    that.close = function(){
        close(spec);
    };
    that.show = function(){
        show(spec);
    };
    that.get = function(name){
        return spec[name];
    }
    return that;
}
