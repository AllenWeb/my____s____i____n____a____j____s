/**
 * @fileoverview
 *	插入表情功能
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2008-09-17
 */
$import("sina/sina.js");
$import("sina/module/module.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/contains.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/tab/tabs.js");
/**
 * 表情类，负责初始化 TAB 及 DOM 节点，并处理表情的点击插入到文本框功能
 * @example
	Module.InsertSmiles.initDom($E("commentArea"), $E("article_comment_insertSmile"));
 */
Module.InsertSmiles = {
	/**
	 * 初始化插入表情 DOM 节点
	 * @param {Object} _oTextNode 表情 CODE 写入的文本框
	 * @param {Object} _oAttachElement 点击触发表情浮层显示的对象
	 * @param {Function} _AfterInsert 可选参数，插入表情后触发的函数
	 */
	initDom : function (_oTextNode, _oAttachElement, _AfterInsert) {
		if(_oTextNode == null || _oAttachElement == null){
			$Debug("请提供插入表情功能必须的节点", "#F00");
			return false;
		}
		this._inputArea = _oTextNode;
		var getPos = function(){
			if (_oTextNode.createTextRange){
				_oTextNode.caretPos = document.selection.createRange().duplicate();
			}
		};
		var _text = this._inputArea;
		Core.Events.addEvent(_text, getPos, "keyup");
		Core.Events.addEvent(_text, getPos, "focus");
		Core.Events.addEvent(_text, getPos, "select");
		Core.Events.addEvent(_text, getPos, "click");
		Core.Events.addEvent(_oAttachElement, function(){
			this._inputArea = _oTextNode;
			if(_AfterInsert != null && _AfterInsert.constructor == Function){
				this.AfterInsert = _AfterInsert;
			}
			var _event, _eventTarget, _pos;
			if ($E("insert_smiles_cnt") == null) {
				var _cntHTML = '<table class="CP_w" onclick="Core.Events.stopEvent();" style="width:613px;top:0px;left:0px;">\
					<thead><tr>\
					<th><strong>插入表情</strong><cite><a id="insert_smiles_close" href="#" onclick="Module.InsertSmiles.hide(true);Core.Events.stopEvent();return false;" \
						class="CP_w_shut" title="关闭">关闭</a></cite></th>\
					</tr></thead>\
					<tbody><tr><td>\
						<div >\
							<div class="CP_smicnt">\
								<div id="insert_image_type" class="CP_smibar"></div>\
								<div class="CP_smisel">\
									<div id="insert_image_detail" class="CP_smisels"></div>\
								</div>\
							</div>\
						</div>\
					</td></tr></tbody></table>';
				var _smile = $C("div");
				_smile.style.position = "absolute";
				_smile.id = "insert_smiles_cnt";
				_smile.onclick = "Core.Events.stopEvent()";
				
				// 计算浮层显示位置
				_event = Core.Events.getEvent();
				_eventTarget = ($IE) ? _event.srcElement : _event.target;
				_pos = Core.Dom.getXY(_eventTarget.parentNode.parentNode);
				_right= Core.Dom.getStyle(_eventTarget.parentNode.parentNode,'width');
				var left=_event.clientX;
				if(left>document.body.offsetWidth/2){
					left=left-613;
				}
				_smile.style.left = left+ "px";
				//alert(_pos[0]-613+parseInt(_right));
				//alert(_event.clientX-613);
				_smile.style.top = (_pos[1] + _eventTarget.parentNode.parentNode.offsetHeight) + "px";
				
				// 根据数据源，生成列表
				_smile.innerHTML = _cntHTML;
				document.body.appendChild(_smile);
				Core.Events.addEvent(document, Module.InsertSmiles.hide);
			}
			else {
				var _smileDiv = $E("insert_smiles_cnt");
				// 计算浮层显示位置
				_event = Core.Events.getEvent();
				_eventTarget = ($IE) ? _event.srcElement : _event.target;
				_pos = Core.Dom.getXY(_eventTarget.parentNode.parentNode);
				_right= Core.Dom.getStyle(_eventTarget.parentNode.parentNode, 'width');
			
					var left=_event.clientX;
				if(left > document.body.offsetWidth / 2){
					left = left - 613;
				}
				_smileDiv.style.left = left+ "px";
				_smileDiv.style.top = (_pos[1] + _eventTarget.parentNode.parentNode.offsetHeight) + "px";				
				_smileDiv.style.display = "";
				// 修正IE7下display显示的问题 L.Ming
				_smileDiv.style.visibility = "hidden";
				setTimeout(function() {
					Module.InsertSmiles.showDefault();
					_smileDiv.style.visibility = "visible";
				}, 1);
			}
			if (typeof smileConfig == "undefined") {
				Utils.Io.JsLoad.request("http://www.sinaimg.cn/uc/myshow/blog/misc/gif/smileConfig.js", {
					onComplete: function(_data){
						if ($E("insert_smiles_cnt") != null) {
							Module.InsertSmiles.init(_data);
						}
					},
					charset: "gb2312"
				});
			}
			Core.Events.stopEvent();
		}.bind2(this), "click");
	},
	init : function (_data){
	this._data = smileConfig;
		// 默认展开分类 356
		var _default = 367;
		this._data[_default].isFocus = true;
		var vtabs = new Tabs($E("insert_image_type"));
		for(key in this._data){
			var op = {
				className: "CP_smion",
				onabort : Core.Function.bind3(this.hideItems, this, [key]),
				onfocus : Core.Function.bind3(this.showItems, this, [key])
			};
			if (this._data[key].isFocus) {
				op.isFocus = true;
			}
			var _menu = '<img align="absmiddle" alt="" src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + key 
				+ '.gif" width="20" height="20" /><a href="#" onclick="this.blur();return false;">' + this._data[key].name 
				+ '</a><cite>(' + this._data[key].data.length + ')</cite>';
			var _tab = new Tab(_menu, op);
			vtabs.add(_tab);
			if(key == _default){
				this.defaultTab = _tab;
			}
		}
		this.tabs = vtabs;
	},
	createType : function (key) {
		$Debug("create : " + key);
		var _cnt = $C("ul");
		_cnt.className = "CP_chos";
		_cnt.id = "smiles_item_" + key;
		var _list = this._data[key].data;
		if (_list.length > 0) {
			for (var i = 0, len = _list.length; i < len; i++) {
				if (_list[i] == null) {
					continue;
				}
				var _item = $C("li");
				var _link = $C("a");
				_link.onclick = "return false;";
				_link.title = _list[i].name;
				_link.innerHTML = '<span><img src="http://www.sinaimg.cn/uc/myshow/blog/misc/gif/' + _list[i].code + 'T.gif" /></span><em>' + _list[i].name + '</em>';
				Core.Events.addEvent(_link, Core.Function.bind3(this.clickImg, this, [_list[i].code, _list[i].name]));
				_item.appendChild(_link);
				_cnt.appendChild(_item);
			}
		}
		else{
			_cnt.innerHTML = "该分类下暂无表情。";
		}
		$E("insert_image_detail").appendChild(_cnt);
	},
	clickImg : function (_key, _name) {
//		[emoticons=E___7101ZH05SIB]顶~[/emoticons]
		var _comment = this._inputArea;
		var len = _comment.value.length;
		var sSimiles = "[emoticons=" + _key + "]" + _name + "[/emoticons]";
		if ($IE) {
			if (_comment.createTextRange && _comment.caretPos) {
	                var caretPos = _comment.caretPos;
	                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? sSimiles + ' ' : sSimiles;
	                _comment.focus();
	        } else {
	                _comment.value += sSimiles;
	                _comment.focus();
	        }
		}
		else {
            if (_comment.setSelectionRange) {
                var rangeStart = _comment.selectionStart;
                var rangeEnd = _comment.selectionEnd;
                var tempStr1 = _comment.value.substring(0, rangeStart);
                var tempStr2 = _comment.value.substring(rangeEnd);
                _comment.value = tempStr1 + sSimiles + tempStr2;
            }
            else {
				_comment.value += sSimiles;
                $Debug("This version of Mozilla based browser does not support setSelectionRange");
            }
		}
		$E("insert_smiles_cnt").style.display = "none";
		// 插入完表情到文本框后，回调函数
		if(this.AfterInsert){
			this.AfterInsert();
		}
		scope.comment_cursor_pos = null;
	},
	showDefault : function () {
		this.tabs.swapTags(this.defaultTab);
		return;
	},
	showItems : function (key) {
		if($E("smiles_item_" + key) != null){
//			$Debug("show : " + key);
			$E("smiles_item_" + key).style.display = "";
		}
		else{
			this.createType(key);
			if (this.currentTab) {
				this.hideItems(this.currentTab);
			}
		}
		this.currentTab = key;
	},
	hideItems : function (key) {
		if (this.currentTab && $E("smiles_item_" + key) != null) {
			$Debug("hide : " + key);
			$E("smiles_item_" + key).style.display = "none";
		}		
	},
	hide : function (cls) {
		var _event = Core.Events.getEvent(), _eventTarget = ($IE) ? _event.srcElement : _event.target;
		if ($E("insert_smiles_cnt") != null && (Core.Dom.contains($E("insert_smiles_cnt"), _eventTarget) == false || cls == true)) {
			$E("insert_smiles_cnt").style.display = "none";
		}		
	}
};