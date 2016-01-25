/**
 * @author haidong|haidong@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/sinput/sinput.js");
$import("sina/core/events/stopEvent.js");
$import("jobs/request.js");
$import("sina/core/dom/replaceNode.js");
$import("diy/mb_dialog.js");
$import("jobs/mod_login.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/function/bind2.js");
$import("diy/enter.js");
$import("diy/flyDialog.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/string/encodeHTML.js");
$import("diy/forbidrefresh_dialog.js");
$import("diy/builder2.js");
$import("diy/toptray_squarepop.js");//顶部导航广场弹出层
$import("diy/dropdownAnimation.js");//顶部导航广场弹出层
$import("diy/PopUpDialog.js");
$import("diy/dom.js");
$import("diy/builder3.js");
$import("jobs/skinTip.js");//顶部导航广场弹出层
$registJob("initSearch", function(){
    Core.Events.addEvent($E('m_keyword'), App.focusblur, 'blur');
    //    Core.Events.addEvent($E('m_keyword'), App.focusblur, 'focus');//将focus事件放入App.autoSelect中，否则写两个会导致不同浏览器执行顺序问题
    App.square_pop();//顶部导航广场弹出层
    App.skin_pop();
    App.search("m_keyword", "m_submit", "m_search", 30, (scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002']);
	
	$E('m_keyword').value = (scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002'];
	
});

/**
 * @param {Object} options
 * maxlen 输入框的长度，默认为30
 * input  输入框
 * form   搜索框form
 */
App.search = function(input, subbtn, form, maxlen, txt, cindex){
    var maxlen = maxlen || 30;
    var textnode = $E(input);
    var subbtn = $E(subbtn);
    var form = $E(form);
    Utils.Sinput.limitMaxLen(textnode, maxlen);
    var auto = new App.autoSelect({
        input: textnode,
        id: textnode.id + "_tip",
        subbtn: subbtn,
        panel: form,
        maxlen: 12 //chibin add
    });
    var urls = {
        0: "/k/",
        1: "/search/user.php?search="
    };
    //gfw start
   
    if (scope.$GFW == 0 && cindex !== undefined) {
        auto.curIndex = cindex;
    }
	//gfw end
    function formget(event){
        var value = Core.String.trim(textnode.value);
        value = Core.String.leftB(value, maxlen);
		if (value == ((scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002'])) {
            return;
        }
        if (value && value != txt) {
            //gfw
			location.href = urls[scope.$GFW == 0 ? auto.curIndex : 1] + encodeURIComponent(encodeURIComponent(value));
//            location.href = urls[auto.curIndex] + encodeURIComponent(encodeURIComponent(value));
//            // location.href = urls[curIndex] + encodeURIComponent(encodeURIComponent(value));
			//gfw
        }
        else {
            textnode.focus();
        }
        Core.Events.stopEvent(event);
    }
    Core.Events.addEvent(subbtn, formget, "click");
    
    App.enterSubmit({
        parent: form,
        action: function(event){
            Core.Events.fireEvent(subbtn, "click");
        }
    });
};

App.autoSelect = function(options){
    this.panel = options.panel;
    this.input = $E(options.input);
    this.maxLen = options.maxlen || 4 * 2;
    this.subbtn = options.subbtn;
    
    this.initHTML(options.id);
    
    this.clip = App.Clip($E(options.id), {
        clipType: '2',
        bottom: '0px',
        endPixel: '200px',
        clipspeed: 4
    });
	
	Core.Events.addEvent(this.input, this.fileElement.bind2(this), "focus");
	
	//gfw start
    scope.$GFW == 0 && Core.Events.addEvent(this.input, this.keydown.bind2(this), "keydown");
    scope.$GFW == 0 && Core.Events.addEvent(this.input, this.fileElement.bind2(this), "keyup");
	//gfw end
	//gfw start
    scope.$GFW == 0 && Core.Events.addEvent(document.body, this.removeElement.bind2(this), "click");
	//gfw end
};

App.autoSelect.prototype = {
    initHTML: function(id){
        var wrap = $E(id);
        var html = '<span>' + $CLTMSG['CD0002'] + '</span><ul id="#{id}_content">' + $CLTMSG['CD0003'] + '</ul>'
        html = html.replace(/#\{id\}/g, id);
        wrap.innerHTML = html;
        
        var _txt = $E('m_keyword').value.replace(/^\s+|\s+$/g, '');
        var _isDef = _txt == '' || _txt == ((scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002']);
        
        App.Dom.getBy(function(el){
            if (el.getAttribute('act') == 'def') {
                el.style.display = _isDef ? '' : 'none';
            }
            if (el.getAttribute('act') == 'isinput') {
                el.style.display = !_isDef ? '' : 'none';
            }
        }, 'span', $E('m_keyword_tip'));
        
        wrap.style.zIndex = 300;
        //		wrap.style.left = this.panel.offsetLeft + 'px';
        wrap.style.left = (Core.Dom.getXY(this.input)[0] - Core.Dom.getXY(wrap.parentNode)[0]) + 'px';
        wrap.style.top = (Core.Dom.getElementsByClass(wrap.parentNode, 'div', 'head_menu')[0].offsetTop + this.panel.offsetTop + this.panel.offsetHeight) + 'px';
        this.wrap = wrap;
        this.searchBlog = $E(id + "_blog");
        this.searchAuthor = $E(id + "_author");
        this.curIndex = 0;
        this.elements = $E(id + '_content').getElementsByTagName("li");
        var othis = this;
        for (var i = 0, els = this.elements, el; i < els.length; i++) {
            var el = els[i]
            el.onclick = Core.Function.bind3(othis.setCurElement, othis, [i, el, "click"]);
            el.onmouseover = Core.Function.bind3(othis.setCurElement, othis, [i, el, "mouseover"]);
            el.onmouseout = Core.Function.bind3(othis.setCurElement, othis, [i, el, "mouseout"]);
        }
    },
    setCurElement: function(index, el, type){
        var event = Core.Events.getEvent();
        this.curIndex = index;
        this.curElement = el;
        this.complete();
        this.curElement = this.elements[this.curIndex];
        if (type == "mouseout") {
            var relatedTarget = event.relatedTarget || event.toElement;
            if (relatedTarget && relatedTarget.nodeType == 1) {
                if (relatedTarget.tagName.toLowerCase() == "li") {
                    this.elements[this.curIndex].className = "";
                }
            }
        }
        if (type == "mouseover") {
            this.setBackGroud(el);
        }
        if (type == "click") {
            Core.Events.fireEvent(this.subbtn, "click");
            Core.Events.stopEvent(event);
            return false;
        }
    },
    setBackGroud: function(el){
        for (var i = 0, len = this.elements.length, els = this.elements; i < len; i++) {
            var cur = els[i];
            if (cur != el) {
                cur.className = "";
            }
            else {
                cur.className = "cur";
            }
        }
    },
    fileElement: function(event){
        if (App.focusblur) {
            App.focusblur();
        }
		//gfw start
		if(scope.$GFW == 1){
			return;
		}
//		// return;
		//gfw end
        var event = Core.Events.getEvent();
        var str = this.input.value;
        str = Core.String.trim(str);
		
		//TODO 01
		//v3需求临时变更，无输入不显示tip
		var _txt = $E('m_keyword').value.replace(/^\s+|\s+$/g, '');
        var _isDef = _txt == '' || _txt == ((scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002']);
		if(_isDef){
			this.wrap.style.display='none';
		}else{
			this.wrap.style.display = '';
			this.clipStart();
		}
//		this.wrap.style.display = "";
        //TODO 01


        if (Core.String.byteLength(str) > this.maxLen) {
            str = Core.String.leftB(str, this.maxLen - 1) + "...";
        }
        this.searchBlog.innerHTML = Core.String.encodeHTML(str);
        this.searchAuthor.innerHTML = Core.String.encodeHTML(str);
        
        
		//有默认文案处理，兼容无tip处理，需求变啊变，没准啥时变回来吧上面TODO 01代码注释就好
        Core.Events.addEvent(this.input, function(){
            var _txt = $E('m_keyword').value.replace(/^\s+|\s+$/g, '');
            var _isDef = _txt == '' || _txt == ((scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002']);
            
            App.Dom.getBy(function(el){
                if (el.getAttribute('act') == 'def') {
                    el.style.display = _isDef ? '' : 'none';
                }
                if (el.getAttribute('act') == 'isinput') {
                    el.style.display = !_isDef ? '' : 'none';
                }
                if (el.getAttribute('act') == 'txt') {
                    el.innerHTML = _txt;
                }
            }, 'span', $E('m_keyword_tip'));
        }, 'keyup');
        
        return this;
    },
    keydown: function(event){
        event = event || window.event;
        
        if (event.keyCode == "38" || event.keyCode == "37") {
            this.curIndex--;
        }
        
        if (event.keyCode == "40" || event.keyCode == "39") {
            this.curIndex++;
        }
        this.curIndex = this.complete();
        
        if (this.curElement == this.elements[this.curIndex]) {
            return true;
        }
        
        if (this.curElement) {
            this.curElement.className = "";
            this.curElement = null;
        }
        this.curElement = this.elements[this.curIndex];
        this.curElement.className = "cur";
        this.url = this.curElement.getAttribute("url");
    },
    clipStart: function(){
        if (this.wrap.style.visibility != 'visible') {
            this.clip.startClip();
        }
    },
    complete: function(){
        if (this.curIndex < 0) {
            this.curIndex = this.elements.length - 1;
        }
        
        if (this.curIndex >= this.elements.length) {
            this.curIndex = 0;
        }
        return this.curIndex;
    },
    removeElement: function(){
        this.wrap.style.visibility = "hidden";
        this.clip.stopClip();
        this.wrap.style.display = "none";
    }
};
(function(){
    var tips = App.builder2({
        'template': '<div class="inter_tip" id="outer" style="position:absolute"><div class="tipcontent" id="inner"></div><div class="tipbt"></div></div>'
    });
    var setTips = function(){
        document.body.appendChild(tips.domList['outer']);
        //tips.domList['outer'].style.position = 'abusolute';
        tips.domList['outer'].style.zIndex = 200;
        var pos = Core.Dom.getXY($E('cancelfollow'));
        tips.domList['outer'].style.left = (pos[0] - 45) + 'px';
        tips.domList['outer'].style.top = (pos[1] - 70) + 'px';
        tips.domList['inner'].innerHTML = $CLTMSG['CY0107'];
    };
    var bindTips = function(){
        if ($E('cancelfollow')) {
            setTips();
            $E('cancelfollow').onmouseover = function(){
                tips.domList['outer'].style.display = '';
            }
            $E('cancelfollow').onmouseout = function(){
                tips.domList['outer'].style.display = 'none';
            }
            tips.domList['outer'].style.display = 'none';
        }
        else {
            tips.domList['outer'].style.display = 'none';
            setTimeout(bindTips, 2000);
        }
    };
    bindTips();
    App.followOper = function(type, uid, el, param, name,conf){
        if (!scope.$uid) {
            //App.ModLogin({func:arguments.callee,param:[type,uid,el,param,name]});
            location.replace("/login.php?url=" + encodeURIComponent(location.href));
            return false;
        }
        if (scope.$cuser_status === 'nofull') {
            App.finishInformation();
            return false;
        }
        if (scope.$uid == "123456") {
            var arg = arguments[0];
            type = arg[0];
            uid = arg[1];
            el = arg[2];
            param = arg[3];
            name = arg[4];
        }
        var delay = 1;
        var url = "";
        var p = $C("div");
        if (type == "add") {
        
            bindTips();
            url = "/attention/aj_addfollow.php";
            if(conf){
		      url += ('?' + App.jsonToQuery(conf));
		    }
            if (scope.isfans) {
                p.className = "MIB_btn_inter lf";
                p.innerHTML = $CLTMSG['CY0105'] + '<span class="MIB_line_sp">|</span><a id="cancelfollow" onclick="App.removeFollow(\'' + uid + '\',this,\'' + name + '\')" href="javascript:void(0);"><em>' + $CLTMSG['CD0005'] + '</em></a>';
            }
            else {
                p.className = "MIB_btn2 lf";
                p.innerHTML = $CLTMSG['CD0004'] + '<span class="MIB_line_sp">|</span><a id="cancelfollow" onclick="App.removeFollow(\'' + uid + '\',this,\'' + name + '\')" href="javascript:void(0);"><em>' + $CLTMSG['CD0005'] + '</em></a>';
            }
            if (scope.$pageid == "profile" && Core.Dom.getElementsByClass(document, "DIV", "roommate").length > 0) {
                Core.Dom.getElementsByClass(document, "DIV", "roommate")[0].style.display = "";
                var rm = Core.Dom.getElementsByClass(document, "DIV", "roommate")[0];
                var a = Core.Dom.getElementsByAttr(rm, "action", "groupselector")[0];
                var b = App.group_selector.person(a);
                (function(k){
                    a.onclick = function(e){
                        App.group_selector.dropBox.moveTo(k).show();
                        Core.Events.stopEvent(e);
                    };
                })(b);
            }
            //更多操作 chibin add 2010-2-9
            if (scope.$pageid == "profile") {
                if (scope.setGroup) {
                    scope.setGroup["show"] = true;
                }
                if (scope.nickname) {
                    scope.nickname["show"] = true;
                }
                if ($E('line')) {
                    $E('line').style.display = '';
                    
                }
                if ($E('setgroup')) {
                    $E('setgroup').style.display = '';
                }
            }
        }
        else {
            url = "/attention/aj_delfollow.php";
            //他人首页添加关注后不刷新即分组
            if (scope.$pageid == "profile" && Core.Dom.getElementsByClass(document, "DIV", "roommate").length > 0) {
                var rm = Core.Dom.getElementsByClass(document, "DIV", "roommate")[0];
                rm.style.display = "none";
                Core.Dom.getElementsByAttr(rm, "action", "groupselector")[0].setAttribute("groupids", "");
                Core.Dom.getElementsByClass(document, "DIV", "downmenu downmenuAttr")[0].style.display = "none";
            }
            //更多操作取消分组后清空已选择的分组,设置备注去掉 chibin add 2010-2-9
            if (scope.$pageid == "profile") {
                if (scope.setGroup) {
                    scope.setGroup["show"] = false;
                    scope.setGroup["gids"] = "";
                }
                if (scope.nickname) {
                    scope.nickname["show"] = false;
                    scope.nickname["remarkName"] = '';//原有的备注名清空
                    if ($E('remark_name')) {
                        $E('remark_name').innerHTML = '';
                    }
                }
                
                if ($E('line')) {
                    $E('line').style.display = 'none';
                    
                }
                if ($E('setgroup')) {
                    $E('setgroup').style.display = 'none';
                }
            }
            //add by chibin 
            p.className = "lf";
            var imgURI = scope.$BASEIMG + "style/images/common/transparent.gif";
            p.innerHTML = '<a href="javascript:void(0);" onclick="App.followOne(\'' + uid + '\',this,\'' + name + '\')"' +
            ' class="btn_add"><img class="SG_icon" ' +
            'src="' +
            imgURI +
            '" title="' +
            $CLTMSG['CD0006'] +
            '"><em>' +
            $CLTMSG['CD0006'] +
            '</em></a>';
            
        }
        function cb(json){
            if (scope.$uid == "123456") {
                location.reload();
            }
            else {
                if (el) {
                    el.ask_following = true;
                }
                setTimeout(function(){
                    while (el.nodeName.toLowerCase(0) != "div") {
                        el = el.parentNode;
                    }
                    Core.Dom.replaceNode(p, el);
                    try {
                        if (type == "add" && scope.$pageid == "profile") {
                            App.grpDialog(scope.setGroup, true);
                        }
                        if (type == 'remove' && scope.$pageid == 'profile') {
                            window.location.reload(true);
                        }
                    } 
                    catch (e) {
                    }
                }, delay);
            }
        }
        function ecb(json){
            if (el) {
                el.ask_following = false;
            }
            //chibin add 加关注，防止刷新
            if (json && json.code == 'MR0050') {
                App.forbidrefresh(function(){
                    param['retcode'] = scope.doorretcode;
                    App.doRequest(param, url, cb, ecb);
                }, '/attention/aj_addfollow.php')
            }
            else {
                App.flyDialog(json, null, null, {
                    ok: function(){
                        if (scope.$uid == "123456") {
                            location.reload();
                        }
                    }
                });
            }
            
        }
        App.doRequest(param, url, cb, ecb);
    };
})();
/**
 * 右侧关注某人
 * @param {Object} uid 被关注人的id
 * @param {Object} el  操作的节点
 */
App.followOne = function(uid, el, name, conf){
    //他人首页添加关注后不刷新即分组
    
    if (el.ask_following) {
        return false;
    }
    //chibin add 防止恶意加关注
    App.followOper("add", uid, el, {
        uid: uid,
        fromuid: scope.$uid
    }, name,conf);
    
};
/**
 * 右侧取消关注某人
 * @param {Object} uid 被关注人的id
 * @param {Object} el  操作的节点
 */
App.removeFollow = (function(){
    var current;
    return function(uid, el, name){
        var pos = Core.Dom.getXY(el);
        var x = pos[0] - ((200 - el.offsetWidth) / 2);
        var y = pos[1] - (el.offsetHeight) - 70;
        var msg = [$CLTMSG["CD0007"], name, "?"].join("");
        App.PopUpConfirm().position(x, y).content(msg).icon(4).yes(function(){
            App.followOper("remove", uid, el, {
                touid: uid,
                fromuid: scope.$uid
            }, name)
        }).no(function(){
            el.isOpened = null
        }).wipe("up", true);
    };
})();
/**
 * 鼠标失去或获得焦点
 * @param {Object} event
 * @param {Object} el
 * @param {Object} txt
 */
App.focusblur = function(){
    var el = Core.Events.getEventTarget();
    var event = Core.Events.getEvent();
    var txt = (scope.$GFW == 0) ? $CLTMSG['WL0001'] : $CLTMSG['WL0002'];
    txt = txt || $CLTMSG["CD0008"];
    if (event.type == 'focus') {
        if (el.value == txt || el.value == $CLTMSG["CD0008"]) {
            el.value = '';
        }
    }
    if (event.type == 'blur') {
        if (el.value == '') {
            el.value = txt;
            if ($E('m_keyword_tip')) {
                $E('m_keyword_tip').style.display = 'none'
            };
                    }
    }
};

