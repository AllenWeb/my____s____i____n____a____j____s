/**
 * @fileoverview 微博广场标签
 * @author yuwei@staff.sina.com.cn
 */
$import("jobs/base.js");
$import("diy/opacity.js");
$import("sina/core/dom/getElementsByClass.js");
$import("diy/enter.js");
$import("jobs/tag.js");

$registJob('square_tag', function(){
    $callJob("set_tag");
    var _addEvent = Core.Events.addEvent;
    
    //自动截取搜索标签的前14个字符显示
    if ($E("raw_tag")) {
        var pNode = $E("raw_tag").parentNode;
        var add_searched_tag = pNode.getElementsByTagName("A")[0];
        pNode.style.display = "";
        if (Core.String.byteLength($E("raw_tag").innerHTML) > 14) {
            $E("raw_tag").innerHTML = Core.String.leftB($E("raw_tag").innerHTML, 14) + "...";
        }
    }
    //大于10个隐藏添加入口
    if (scope.arrTags.length >= 10) {
        if ($E("insert_tag")) {
            $E("insert_tag").style.display = "none";
            $E("insert_tag").nextSibling.style.display = "none";
        }
        if ($E("add_tag_btn")) {
            $E("add_tag_btn").parentNode.style.display = "none";
        }
        if (add_searched_tag) {
            add_searched_tag.style.display = "none";
        }
    }
    else {
        if ($E("add_tag_btn")) {
            $E("add_tag_btn").parentNode.style.display = "";
        }
    }
    
    //搜索标签用户---------------------------------------------------------------------	
    function autoSuggestTags(spec, url){
        spec['ok'] = function(value, text){
            spec['input'].value = text;
//            if (spec['select'] && typeof spec['select'] == "function") {
//                spec['select'](value, text);
//            }
        };
        spec['timer'] =5;
        spec['style'] = spec['style'] || 'width:' + spec['input'].clientWidth + 'px;position:absolute;z-Index:1200;';
        spec['light'] = spec['light'] ||
        function(el){
            el.className = 'cur';
        };
        spec['dark'] = spec['dark'] ||
        function(el){
            el.className = '';
        };
        spec['class'] = spec['class'] || 'layerMedia_menu';
        spec['type'] = spec['type'] || 'ajax';
        spec['data'] = spec['data'] || url + '?key=' + spec['input'].value;
        spec['itemStyle'] = 'overflow:hidden;height:20px';
        return App.autoComplate(spec);
    };
    
    var oInput = $E("tag_search"), oUserBtn = $E("search_button");
    //自动联想输入提示功能
    if (oInput) {
        var ac = autoSuggestTags({
            "input": oInput
        }, "http://t.sina.com.cn/person/aj_tagchooser.php");
        var initValue = oInput.value;
        //回车亦提交
        App.enterSubmit({
            parent: oInput.parentNode,
            action: function(){
                //延时以便于提交enter选中的自动完成组件值
                setTimeout(function(){
                    Core.Events.fireEvent(oUserBtn, "click");
                }, 200);
            }
        });
    }
    function search(event){
        var value = Core.String.leftB(Core.String.trim(oInput.value), 30);
        if (value && value != $CLTMSG['CY0149']) {
            location.href = "http://t.sina.com.cn/pub/tags/" + encodeURIComponent(encodeURIComponent(value));
        }
        else {
            oInput.focus();
        }
        Core.Events.stopEvent(event);
    }
    _addEvent(oUserBtn, search, "click");
    
    _addEvent(oInput, function(){
        if (oInput.value === initValue) {
            oInput.value = "";
        }
    }, "focus");
    _addEvent(oInput, function(){
        if (Core.String.trim(oInput.value).length === 0) {
            oInput.value = initValue;
        }
    }, "blur");
    
    
    
    /**
     * 重载添加tag函数
     * @param{String}tagName 标签名称
     * @param{Boolean}recommendedTag　是否是推荐标签
     * */
    scope.addTag = function(tagName, recommendedTag){
        var event = Core.Events.getEvent();
        var srcElement = (event && event.srcElement) || (event && event.target);
        var target = scope._srcElement || srcElement;
        if (scope._on_submiting) {
            return;
        }
        tagName = this._beforeAddTag(tagName);
        //点击推荐标签时提醒
        if (scope.$oid === scope.$uid && scope.arrTags.length >= 10) {
            return App.alert($CLTMSG['CX0012'], {
                icon: 2,
                width: 380,
                height: 120
            });
        }
        var sUrl = "http://t.sina.com.cn/person/aj_addusertag.php";
        var oData = {
            "tag": tagName
        };
        
        var tags = tagName.split(";"), newTags = [];
        var cssText = "background-color:yellow;font-weight:bold;"
        for (var i = 0, len = tags.length; i < len; i++) {
            if (Core.Array.findit(scope.arrTags, tags[i]) != -1) {
                //高亮显示已经添加的tag标签
                var a_list = $E("tag_list").getElementsByTagName("A");
                for (var k = 0, length = a_list.length; k < length; k++) {
                    if (a_list[k].innerHTML == tags[i]) {
                        if (scope._tag_region) {
                            scope._tag_region.style.display = "none";
                        }
                        (function(index){
                            var a_tag = a_list[index];
                            a_tag.focus();
                            a_tag.blur();
                            a_tag.parentNode.parentNode.style.cssText = cssText;
                            setTimeout(function(){
                                a_tag.parentNode.parentNode.style.cssText = "";
                            }, 777);
                        })(k);
                    }
                }
            }
            else {
                newTags.push(tags[i]);
            }
        }
        if (newTags.length === 0) {
            return;
        }
        oData = {
            tag: newTags.join(";")
        };
        
        scope._on_submiting = true;
        App.doRequest(oData, sUrl, function(data, result){
            if (result.data) {
                var tagid, tag, tagNums, id;
                for (var j = 0, length = result.data.length; j < length; j++) {
                    tagid = result.data[j].tagid, id = (new Date()).getTime() + tagid;
                    tag = result.data[j].tag;
                    tagNums = result.data[j].tagNums;
                    tagNums = typeof tagNums === "number" ? tagNums : 0;
                    var newTagURL = "/pub/tags/" + encodeURIComponent(tag);
                    var html = '<div id="' + id + '" onmouseout="this.className=\'line\';" onmouseover="this.className=\'line cur\';" class="line">\
			            <div class="topName"><a href="' +
                    newTagURL +
                    '">' +
                    tag +
                    '</a><em class="tipNums">(' +
                    tagNums +
                    ')</em></div>\
			            <div class="add"><a href="javascript:void(0);" tagid="' +
                    tagid +
                    '" onclick="scope.deleteTag(this)">' +
                    $CLTMSG['CX0013'] +
                    '</a></div>\
			        </div>';
                    var tag_list = $E("tag_list");
                    Core.Dom.insertHTML(tag_list, html, "AfterBegin");
                    if (scope.arrTags.length == 0) {
                        $E("mytags").style.display = "";
                        tag_list.style.display = "";
                    }
                    
                    (function colorAnimation(){
                        if (!target) {
                            return;
                        }
                        if (target.className === "add_btn") {//点击"我也要添加标签"
                            var oTip = $C("DIV");
                            oTip.className = "add_status";
                            oTip.innerHTML = $CLTMSG['CX0014'];
                            target.parentNode.appendChild(oTip);
                            target.parentNode.removeChild(target);
                        }
                        else 
                            if (target.className === "add_tag_btn") {//点击"我要添加标签"
                                if (!scope._oTip) {
                                    var oTip = $C("DIV");
                                    oTip.className = "add_status";
                                    var imgURI = scope.$BASEIMG + "style/images/common/transparent.gif";
                                    oTip.innerHTML = '<img class="tipicon tip3" src="' + imgURI + '">' + $CLTMSG['CX0015'];
                                    target.parentNode.appendChild(oTip);
                                    scope._oTip = oTip;
                                }
                                else {
                                    scope._oTip.style.display = "";
                                }
                                target.style.display = "none";
                                setTimeout(function(){
                                    scope._oTip.style.display = "none";
                                    target.style.display = "";
                                    if (scope.arrTags.length >= 10) {
                                        target.parentNode.style.display = "none";
                                    }
                                }, 2000);
                            }
                            else {
                                var anchor = $E(id).getElementsByTagName("A")[0];
                                anchor.focus();
                                anchor.blur();
                            }
                    })();
                    
                    //添加推荐标签
                    if (typeof recommendedTag === "boolean" && srcElement) {
                        srcElement.title = srcElement.innerHTML = $CLTMSG['CX0016'];
                        srcElement.onclick = null;
                        srcElement.style.cursor = "default";
                    }
                    //
                    
                    if (scope._tag_region) {
                        scope._tag_region.style.display = "none";
                    }
                    
                    if (scope.arrTags.length === 0) {
                        scope._afterTagsAdded(newTags);
                    }
                    scope.arrTags.unshift(tag);
                    if (scope.arrTags.length >= 10) {
                        if ($E("insert_tag")) {
                            $E("insert_tag").style.display = "none";
                            $E("insert_tag").nextSibling.style.display = "none";
                        }
                        if ($E("add_tag_btn") && target.className !== "add_tag_btn") {
                            $E("add_tag_btn").parentNode.style.display = "none";
                        }
                        if (add_searched_tag) {
                            add_searched_tag.style.display = "none";
                        }
                    }
                    scope._on_submiting = false;
                }
            }
        }, function(result){
            if (result && result.code) {
                if (scope._error) {
                    scope._error.innerHTML = '<span style="color:red;font:bold;">' + $SYSMSG[result.code] + '</span>';
                }
                if (target && target.className === "add_btn") {//点击"我也要添加标签"
                    App.alert($SYSMSG[result.code], {
                        icon: 2,
                        width: 370,
                        height: 120
                    });
                }
            }
            else {
                if (scope._error) {
                    scope._error.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0017'] + '</span>';
                }
                if (target && target.className === "add_btn") {//点击"我也要添加标签"
                    App.alert($CLTMSG['CX0018'], {
                        icon: 2,
                        width: 370,
                        height: 120
                    });
                }
            }
            scope._on_submiting = false;
        });
    };
    //因为转码的关系，所有需要进行一次反转，怕和其他地方函数调用冲突，故多建一函数出来
    scope.addTag2 = function(tagName, recommendedTag){
        tagName = decodeURIComponent(tagName)
        var valid = false;
        if (!(/^(,|;|\uFF0C|\uFF1B|\u3001|\s|\w|[\u4E00-\u9FA5\uFF00-\uFFFF])*$/.test(Core.String.trim(tagName)))) {
            //可以输入中英文、数字(空格和,;，；、视为分隔符)。
            App.alert($CLTMSG['CX0020'], {
                icon: 2
            });
            valid = false;
            return valid;
        }
        else {
            valid = true;
        }
        var event = Core.Events.getEvent();
        var srcElement = (event && event.srcElement) || (event && event.target);
        var target = scope._srcElement || srcElement;
        if (scope._on_submiting) {
            return;
        }
        tagName = this._beforeAddTag(tagName);
        //点击推荐标签时提醒
        if (scope.$oid === scope.$uid && scope.arrTags.length >= 10) {
            return App.alert($CLTMSG['CX0012'], {
                icon: 2,
                width: 380,
                height: 120
            });
        }
        var sUrl = "http://t.sina.com.cn/person/aj_addusertag.php";
        var oData = {
            "tag": tagName
        };
        
        var tags = tagName.split(";"), newTags = [];
        var cssText = "background-color:yellow;font-weight:bold;"
        for (var i = 0, len = tags.length; i < len; i++) {
            if (Core.Array.findit(scope.arrTags, tags[i]) != -1) {
                //高亮显示已经添加的tag标签
                var a_list = $E("tag_list").getElementsByTagName("A");
                for (var k = 0, length = a_list.length; k < length; k++) {
                    if (a_list[k].innerHTML == tags[i]) {
                        if (scope._tag_region) {
                            scope._tag_region.style.display = "none";
                        }
                        (function(index){
                            var a_tag = a_list[index];
                            a_tag.focus();
                            a_tag.blur();
                            a_tag.parentNode.parentNode.style.cssText = cssText;
                            setTimeout(function(){
                                a_tag.parentNode.parentNode.style.cssText = "";
                            }, 777);
                        })(k);
                    }
                }
            }
            else {
                newTags.push(tags[i]);
            }
        }
        if (newTags.length === 0) {
            return;
        }
        oData = {
            tag: newTags.join(";")
        };
        
        scope._on_submiting = true;
        App.doRequest(oData, sUrl, function(data, result){
            if (result.data) {
                var tagid, tag, tagNums, id;
                for (var j = 0, length = result.data.length; j < length; j++) {
                    tagid = result.data[j].tagid, id = (new Date()).getTime() + tagid;
                    tag = result.data[j].tag;
                    tagNums = result.data[j].tagNums;
                    tagNums = typeof tagNums === "number" ? tagNums : 0;
                    var newTagURL = "/pub/tags/" + encodeURIComponent(tag);
                    var html = '<div id="' + id + '" onmouseout="this.className=\'line\';" onmouseover="this.className=\'line cur\';" class="line">\
			            <div class="topName"><a href="' +
                    newTagURL +
                    '">' +
                    tag +
                    '</a><em class="tipNums">(' +
                    tagNums +
                    ')</em></div>\
			            <div class="add"><a href="javascript:void(0);" tagid="' +
                    tagid +
                    '" onclick="scope.deleteTag(this)">' +
                    $CLTMSG['CX0013'] +
                    '</a></div>\
			        </div>';
                    var tag_list = $E("tag_list");
                    Core.Dom.insertHTML(tag_list, html, "AfterBegin");
                    if (scope.arrTags.length == 0) {
                        $E("mytags").style.display = "";
                        tag_list.style.display = "";
                    }
                    
                    (function colorAnimation(){
                        if (!target) {
                            return;
                        }
                        if (target.className === "add_btn") {//点击"我也要添加标签"
                            var oTip = $C("DIV");
                            oTip.className = "add_status";
                            oTip.innerHTML = $CLTMSG['CX0014'];
                            target.parentNode.appendChild(oTip);
                            target.parentNode.removeChild(target);
                        }
                        else 
                            if (target.className === "add_tag_btn") {//点击"我要添加标签"
                                if (!scope._oTip) {
                                    var oTip = $C("DIV");
                                    oTip.className = "add_status";
                                    var imgURI = scope.$BASEIMG + "style/images/common/transparent.gif";
                                    oTip.innerHTML = '<img class="tipicon tip3" src="' + imgURI + '">' + $CLTMSG['CX0015'];
                                    target.parentNode.appendChild(oTip);
                                    scope._oTip = oTip;
                                }
                                else {
                                    scope._oTip.style.display = "";
                                }
                                target.style.display = "none";
                                setTimeout(function(){
                                    scope._oTip.style.display = "none";
                                    target.style.display = "";
                                    if (scope.arrTags.length >= 10) {
                                        target.parentNode.style.display = "none";
                                    }
                                }, 2000);
                            }
                            else {
                                var anchor = $E(id).getElementsByTagName("A")[0];
                                anchor.focus();
                                anchor.blur();
                            }
                    })();
                    
                    //添加推荐标签
                    if (typeof recommendedTag === "boolean" && srcElement) {
                        srcElement.title = srcElement.innerHTML = $CLTMSG['CX0016'];
                        srcElement.onclick = null;
                        srcElement.style.cursor = "default";
                    }
                    //
                    
                    if (scope._tag_region) {
                        scope._tag_region.style.display = "none";
                    }
                    
                    if (scope.arrTags.length === 0) {
                        scope._afterTagsAdded(newTags);
                    }
                    scope.arrTags.unshift(tag);
                    if (scope.arrTags.length >= 10) {
                        if ($E("insert_tag")) {
                            $E("insert_tag").style.display = "none";
                            $E("insert_tag").nextSibling.style.display = "none";
                        }
                        if ($E("add_tag_btn") && target.className !== "add_tag_btn") {
                            $E("add_tag_btn").parentNode.style.display = "none";
                        }
                        if (add_searched_tag) {
                            add_searched_tag.style.display = "none";
                        }
                    }
                    scope._on_submiting = false;
                }
            }
        }, function(result){
            if (result && result.code) {
                if (scope._error) {
                    scope._error.innerHTML = '<span style="color:red;font:bold;">' + $SYSMSG[result.code] + '</span>';
                }
                if (target && target.className === "add_btn") {//点击"我也要添加标签"
                    App.alert($SYSMSG[result.code], {
                        icon: 2,
                        width: 370,
                        height: 120
                    });
                }
            }
            else {
                if (scope._error) {
                    scope._error.innerHTML = '<span style="color:red;font:bold;">' + $CLTMSG['CX0017'] + '</span>';
                }
                if (target && target.className === "add_btn") {//点击"我也要添加标签"
                    App.alert($CLTMSG['CX0018'], {
                        icon: 2,
                        width: 370,
                        height: 120
                    });
                }
            }
            scope._on_submiting = false;
        });
    };
    
    //名称上也显示名片功能----------------------------------------------------
    (function(){
        var domList = document.getElementsByTagName('A');
        for (var i = 0, len = domList.length; i < len; i += 1) {
            if (domList[i].getAttribute('linktype') == 'card') {
                Core.Events.addEvent(domList[i], (function(dom){
                    return function(e){
                        Core.Events.stopEvent(e);
                        var href = dom.getAttribute('uid');
                        var position = Core.Dom.getXY(dom.parentNode.parentNode);
                        App.miniblogCard.show(href, dom.parentNode.parentNode, {
                            'left': position[0],
                            'top': position[1]
                        });
                    };
                })(domList[i]), 'click');
            }
        }
    })();
    
    /**
     * 异步加载标推荐标签和我的标签的标签数量
     * @param{String}id :tag container's id
     * */
    function getTagNum(id){
        if ($E(id)) {
            var tag_list = $E(id).childNodes, tag_map = {}, tags = [], a_tag;
            for (var i = 0, len = tag_list.length; i < len; i++) {
                if (tag_list[i].nodeType !== 3) {
                    a_tag = tag_list[i].getElementsByTagName("A")[0];
                    tag_map[encodeURIComponent(a_tag.innerHTML)] = a_tag;
                    tags.push(encodeURIComponent(a_tag.innerHTML));
                }
            }
            var oData = {
                "tag": tags.join(",")
            }
            var sUrl = "http://t.sina.com.cn/pub/aj_tagnum.php";
            App.doRequest(oData, sUrl, function(data, result){
                if (result.code === "A00006") {
                    for (var key in tag_map) {
                        tag_map[key].parentNode.getElementsByTagName("EM")[0].innerHTML = result.data[key] ? "(" + result.data[key] + ")" : "(0)";
                    }
                }
            }, function(result){
                //error
            });
        }
    };
    getTagNum("recommended_tags");
    getTagNum("tag_list");
    
    var getHotTips = function(id, api){
        try {
            var el, d, l, getter = [], elms = {};
            if (!(el = $E(id))) {
                return
            }
            d = Core.Dom.getElementsByClass(el, "div", "topName");
            l = d.length;
            l &&
            (function(){
                for (var i = 0; i < l; i++) {
                    (function(div){
                        var t = {};
                        t.a = div.getElementsByTagName("a")[0];
                        t.em = div.getElementsByTagName("em")[0];
                        if (t.a && t.em) {
                            t.set = (function(em){
                                return function(num){
                                    em.innerHTML = "(" + num + ")";
                                }
                            })(t.em);
                            var v = t.a.innerHTML;
                            elms[v] = t;
                            getter.push(v);
                        }
                    })(d[i]);
                }
                App.doRequest({
                    "tags": getter.join(",")
                }, api, function(data, result){
                    if (result.code === "A00006" && result.tags) {
                        for (key in result.tags) {
                            elms[key].set(result.tags[key]);
                        }
                    }
                }, function(result){
                });
            })();
        } 
        catch (e) {
        }
    };
    getHotTips("_hottip_", "/pub/aj_hottags.php");
});
