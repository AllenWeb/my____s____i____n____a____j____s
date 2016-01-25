/**
 * @author zhaobo zhaobo@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("diy/imgURL.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertHTML.js");
$import("diy/swfobject.js");
$import("diy/htmltojson.js");
$import("sina/core/dom/next.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("diy/smoothscroll.js");
$import("sina/core/dom/domInsert.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/byteLength.js");

App.bindVote = function(_dom, _key, _value) {
    var _addevent = Core.Events.addEvent;
    var _seeVote = App.seeVote;
    var _node = {};

//    _dom.href = "javascript:void(0);";
//    _dom.target = "";
    _node['mid'] = _dom.parentNode.getAttribute("mid");
    var prevDiv = $E('prev_' + _node['mid']);
    var showDiv = $E("disp_" + _node['mid']);
    _node['shorturl'] = _key;
    _node['mtype'] = _dom.parentNode.getAttribute("type");
    var _previewHTML = function(mid,mtype){
	   try {

		var str = decodeURIComponent(_value['title']);
		if (Core.String.byteLength(str) > 24) {
            str = Core.String.leftB(str, 24 - 1) + "...";
        }

	   	_value['title'] = typeof str === "undefined" ? "" : str;
	   }catch(e){
	   }
	   return '<a type="'+mtype+'" mid="'+mid+'" shorturl_id="' +
		_key +
		'"  href="javascript:void(0);"><img src="' + scope.$BASEIMG+'style/images/common/vote_pic_01.gif"></a>';
	};
    //渲染媒体层。
    var render = function(node, _previewdiv) {
        //从未绑定过
        if (_previewdiv && _previewdiv.getAttribute("mbind") != '1') {
            var inspos = {};

			if(Core.Dom.getElementsByClass(_previewdiv,'div','feed_img').length>0){
				inspos['dom']=Core.Dom.getElementsByClass(_previewdiv,'div','feed_img')[0];
				inspos['pos']='afterEnd';
			}else{
				inspos['dom']=_previewdiv;
                inspos['pos']='afterBegin';
			}
			var feed_img = $C('div');
            feed_img.className = 'vote_img';
            feed_img.innerHTML = _previewHTML(node['mid'],node['mtype']);
            Core.Dom.domInsert(inspos['dom'],feed_img,inspos['pos']);
            /*var cldr = feed_img.childNodes || feed_img.children;
            //预览图片
            cldr[0].src = scope.$BASEIMG+"style/images/common/vote_pic_01.gif";*/
			_previewdiv.setAttribute("mbind",'1');
            var a = feed_img.getElementsByTagName('A')[0];
            _addevent(a,function(){
				node['node']=a;
                getData(node)
            },'click');
        }
    };
    /**
     * 获取url中key为name的值。
     * @param url url字符串。
     * @param name key
     */
    var getParam = function(url, name) {
        var arr = url.match(new RegExp("(\\?|&|/)" + name + "=([^&]*)(&|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    };
    var getData = function(node, defaultOpen) {
        var proxy = '/public/app_proxy.php';
        node["defaultOpen"] = typeof defaultOpen === "undefined" ? false : defaultOpen;
		var sh = defaultOpen ? 1 : 0;
        var param = {
            appcode: '10001',
            type : 'detail',
            poll_id : node.pollId,
			sh : sh
        };
        Utils.Io.Ajax.request(proxy, {
            'POST': param,
            'onComplete': function(json) {
				if (json && json.code ){
					if(json.code == 'A00006') {
						//成功，调用App.seeVote方法。插入dom，并绑定相关事件等操作。
						_seeVote(node, json.data);
					}else if(json.code == "B00004"){
						_seeVote(node, json.error);
					}else if(json.code == "M00004"){
                        _seeVote(node, $SYSMSG['M00004']);
                    }else{
						_seeVote(node, json.error);
					}
                }
                else {
                }
            },
            'onException': function() {

            },
            'returnType': 'json'
        });
    };
    //在完整url中将poll_id的值取出，方便获取投票的数据。
    var pollId = getParam(_value['url'], "poll_id");
	if(!pollId){
		pollId = getParam(_value['url'], "vid");
	}
    var checksame = function(vdiv,shorturl){
		//判断是否已经展开图片或者投票内容
		if(Core.Dom.getElementsByClass(vdiv, "DIV", "lose").length>0){
			return (shorturl == Core.Dom.getElementsByClass(vdiv, "DIV", "lose")[0].getAttribute("short_url")) ;
		}else{
			return false;
		}
	};
    //点击短链接请求接口，返回的数据插入填充区域。
    _node['node'] = _dom;
    _node['pollId'] = pollId;
//    _addevent(_dom, function() {
//        /*if (showDiv && showDiv.style.display !== "none") {
//            return false;
//        }*/
//        if(checksame(showDiv,_node['shorturl'])){
//            return false;
//        }
//        getData(_node);
//    }, 'click');
    if (!(scope.$pageid == "mblog" && _node['mtype'] == '1')) {
        render(_node, prevDiv);
    } else {
        //单条微博页原创需要直接展现
        if (!_value) {
            return false;
        }
        //转发则不用展现，原创需要直接展现，大家一起抢多媒体展现资源，mbind为1是说明你已经抢不到了.
        if ((!_value) || _node['mtype'] != "1" || showDiv.getAttribute("mbind") == '1') {
            return false;
        }
        getData(_node, true);
    }

};
App.seeVote = function(node, voteInfo) {
    var info = voteInfo;
    var _addevent = Core.Events.addEvent;
    var vote = {
        mid : node['mid']
    };
    var getVoteHtml = function(isInner) {
        if(isInner){
            return info;
        }
        return '<div class="MIB_assign lose" short_url="'+node["shorturl"]+'">\
                    <div class="MIB_asarrow_l"></div>\
                    <div class="MIB_assign_t"></div>\
                     <div class="MIB_assign_c MIB_txtbl">' + info + '</div>\
                   <div class="MIB_assign_b"></div>\
                </div>';
    };
    var bindVoteTitle = function(dom) {
        if(!dom) return null;
        var _left = Core.Dom.getElementsByClass(dom, "div", "lf")[0] || false;
        var _right = Core.Dom.getElementsByClass(dom, "div", "rt")[0] || false;
        var lBtns = _left.getElementsByTagName("a") || false;
        var closeBtn = lBtns && lBtns[0];
        var sponsor = lBtns && lBtns[1];
        var viewDetail = _right && _right.getElementsByTagName("a")[0];
        if(!node['defaultOpen'] && closeBtn){
            closeBtn.href = "javascript:void(0);";
            _addevent(closeBtn, function() {
                
                App.closeVote(node['mid']);
            }, "click");
        }
        /*_addevent(sponsor, function() {

            return false;
        }, "click");
        _addevent(viewDetail, function() {
            return false;
        }, "click");*/
    };
    var bindVoteInfo = function(dom) {
        if(!dom) return null;
        var table = dom.getElementsByTagName("table")[0] || false;
	if(table){
		/*var rows = table.rows;
		for (var i = 0, len = rows.length; i < len; i++) {
		    var row = rows[i];
	//            var cells = row.cells;
		    row.onmouseover = function() {
			this.className = "oi_select";
			return false;
		    };
		    row.onmouseout = function() {
			this.className = "";
			return false;
		    };
		    for (var j = 0,len_c = cells.length; j < len_c; j++) {
			var cell = cells[j];
		    }
		}*/
		var submitContainer = Core.Dom.getElementsByClass(dom, "div", "onvote_btn")[0];
		var submitBtn = submitContainer.getElementsByTagName("a")[0];
			submitBtn.target="_blank";

			submitBtn.onclick = function(){
				window.open(this.href);
				return false;
			};
		/*submitBtn.href = "javascript:void(0);";*/
	}
    };
    var _showvdiv = $E("disp_" + vote['mid']);
    var _imagediv = $E("prev_" + vote['mid']);
	var isT = node['mtype'] != "1";
    _showvdiv.innerHTML = getVoteHtml(isT);
    /*var _table;
    if((_table = _showvdiv.getElementsByTagName('TABLE')[0]) && node && node.pollId){
        _addevent(_table,function(){
            window.open("http://vote.t.sina.com.cn/poll?poll_id=" + node.pollId );
        },'click');
    }*/
    _showvdiv.className = _showvdiv.className.replace("blogPicOri", "");
	if(isT){
		var child = _showvdiv.getElementsByTagName("div")[0] || false;
		if(child){
			var _c_className = child.className;
	                child.setAttribute("short_url", node["shorturl"]);
        	        child.className = _c_className + " lose";
		}
	}
    var getChildren = function(dom) {
        if(!dom) return [];
        var children = dom.childNodes;
        var ret = [];
        for (var i = 0,len = children.length; i < len; i++) {
            if (children[i].nodeType === 1)ret.push(children[i]);
        }
        return ret;
    };
    var container = Core.Dom.getElementsByClass(_showvdiv, "div", "onevote")[0];
    var children = getChildren(container);
    if(children.length>0){
        var _titleContainer = children[0];
        var _voteInfoContainer = children[2];
        //var _userInfoContainer = children[3];
        bindVoteTitle(_titleContainer);
        bindVoteInfo(_voteInfoContainer);
    }
    if (_imagediv)_imagediv.style.display = "none";
    _showvdiv.style.display = "";

    if(!node["defaltOpen"]){
        scroller(_showvdiv, 1000, -60, 0, true, true);
    }else{
        _showvdiv.setAttribute("mbind", "1");
    }

};
App.closeVote = function(mid) {
    var _showvdiv = $E("disp_" + mid);
    var _imagediv = $E("prev_"+mid);
    if(_imagediv){
        var _img;
        if(Core.Dom.getElementsByAttr(_imagediv, "class", "imgSmall").length > 0){
            _img = Core.Dom.getElementsByAttr(_imagediv, "class", "imgSmall");
        }
        else{
            _img = Core.Dom.getElementsByAttr(_imagediv, "className", "imgSmall");//可恶的ie6问题
        }
        if(_img.length > 0){
            var _bigimg = _img[0];
            App.shrinkImg(_bigimg);
        }
        _imagediv.style.display="";
    }
    _showvdiv.style.display = "none";
    _showvdiv.innerHTML = "";
    return false;
};
