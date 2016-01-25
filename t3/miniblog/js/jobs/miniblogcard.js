/*
 * @author Pjan
 * 微博名片
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/dom/contains.js");
$import("jobs/searchuser.js");

//懒加载
App.miniblogCard = {
	'card'	: false,
	'show'	:	function(_uid, _dom, _position){
		//console.log(arguments);
		var This = this;
		if(!_uid){
			return;
		}
		var uid = _uid;
		This.click = _dom ? _dom : document.body;
		/*
		 * @title 位置参数，默认右边
		 * @param right|left|top|bottom
		 */
		var position;
		if(typeof _position == "object"){
			position = {};
			position.top	= _position.top?_position.top:false;
			position.left	= _position.left?_position.left:false;
		}else{
			position = _position ? _position : "fuck";	//多么fuck的trick;so fuck;
		}
		
		//初始化名片数据
		function initMiniblogCardDom(_html){
			This.card = $C('div');
			This.card.className = "zUserCard";
			This.card.style["position"] = "absolute";
			This.card.style["display"] = "none";
			setContent(_html);
			document.body.appendChild(This.card);
		}
		function setContent(_html){
			 This.card.innerHTML = _html;
		}
		
		/*
		 * @title 计算名片出现的位置wor
		 */
		function cardPosition(d /*dom元素*/, pos){
			//计算dom的高度
			function getDomSize(d){
				return [d.offsetWidth, d.offsetHeight];
			}
			
			var _pos = [];
			var _offset = 5;
			//给名片位置赋值
			var _domXY = Core.Dom.getXY(d);
			var _domWH = getDomSize(d);
			var _cardWH = getDomSize(This.card);
			switch(pos.toLowerCase()){
				case "left":
					_pos = [_domXY[0] - _cardWH[0] - _offset, _domXY[1]];
					break;
				case "top":
					_pos = [_domXY[0], _domXY[1] - _cardWH[1] - _offset];
					break;
				case "bottom":
					_pos = [_domXY[0], _domXY[1] + _domWH[1] + _offset];
					break;
				case "right":
					_pos = [_domXY[0] + _domWH[0] + _offset, _domXY[1]];
                    break;
				default:
					_pos = [_domXY[0] - 10, _domXY[1] - 10];
					break;
			}
			return _pos;
			//test
		}

		//显示名片
		function displayCard(_html){
			//如果没有名片则初始化一个名片
			if(!This.card){
				initMiniblogCardDom(_html);
			}else{
				setContent(_html);
			}
			if(This.card.style['display'] != ""){
				//提供全局事件
				Core.Events.addEvent(document.body, bodyMouseHandle, "click");
			}
			
			//给名片位置
			This.card.style["display"] = "";
			var _pos;
			if(typeof position == "string"){
				_pos = cardPosition(This.click, position);
			}
			This.card.style["left"]	= (position.left?position.left:_pos[0]) + "px";
			This.card.style["top"]	= (position.top?position.top:_pos[1]) + "px";
		}

		//用于鼠标事件函数
		function bodyMouseHandle(e){
			var _clickTarget = Core.Events.fixEvent(e).target;
			if(Core.Dom.contains(This.click, _clickTarget)){
				return;
			}
			if(!Core.Dom.contains(This.card, _clickTarget)){
				Core.Events.removeEvent(document.body, bodyMouseHandle, "click");
				This.card.style["display"] = "none";
				return;
			}
		}

		function getCardContentHandle(json){
			if(json["code"] != "A00006"){
				//错误消息
				return;
			}
			//显示名片
			displayCard(json.data);
		} 
		//获得名片数据
		Utils.Io.Ajax.request('/pub/aj_getcard.php',{
			'GET'		: {'uid' : _uid},
			'onComplete'	: getCardContentHandle,
			'onException'	: function(){return;},
			returnType	: "json"
		});
	},
	"hide"	: function(){
		this.card.parentNode.removeNode(this.card);
	},
	"del"	: function(){
		this.hide();
	},
	"click"	:	{}  //操他大爷的
};
(function(){
	var checkHeadImage = function(img){
		if(img.getAttribute('imgtype') == 'head'){
			if(img.parentNode.getAttribute('action') == 'card'){
				return true;
			}
		}
		return false;
	};
	/**
	 * 
	 * @param {Object} spec
	 * img : 头像标签
	 */
	App.bindCard = function(spec){
		if(checkHeadImage(spec.img)){
			Core.Events.addEvent(spec.img.parentNode,function(e){
				Core.Events.stopEvent(e);
				var href = spec.img.getAttribute('uid');
				App.miniblogCard.show(href,spec.img);
				return false;
			},'click');
			spec.img.className = "imgBorder_hover";
			//spec.img.setAttribute('imgtype') == '';
		}
	};
	/**
	 * 
	 * @param {Object} spec
	 * box : 容器标签
	 */
	App.bindCards = function(spec){
		spec = spec || {};
		spec.box = spec.box || document.body;
		var imgs = spec.box.getElementsByTagName('IMG');
		for(var i = 0, len = imgs.length; i < len; i += 1){
			App.bindCard({'img':imgs[i]});
		}
	};
})();
$registJob('miniblogCard',function(){
	App.bindCards();
});
