/**
 * @author xingmin
 * 名片卡弹出通用组件
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/dom/opacity.js');
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/removeNode.js");
$import("jobs/miniblog_follow.js");
$import("diy/jsontoquery.js");

$registJob('userCard', function(){
	//名片卡公共配置, 这里把名片卡的大小和url都作为公共配置。
	//未来这些数据可能需要作为独立配置，放在下面的CardProfile_x中。
	//那样的话，需要修改代码中相应属性的的Common["xxxx"]为Profile["xxxx"]。
	var Common = {
		"card"				: "userCard",
		"iframe"			: "bIframe",
		"userCardContent"	: "user_card_content",						//名片卡内容区域id，其中内容向后台ajax索取
		"requestUrl"		: "/person/aj_getcard.php",					//获得名片卡内容的ajax url
		"cardWidth"			: 287,										//名片卡宽度(px)
		"cardHeight"		: 205,										//名片卡高度(px)	当【箭头】在名片卡的中间或偏下位置时，
																		//需要设定下面CardProfil中的setInitHeight。高度若不定的话，会悲剧。
		"cardContentWidth"	: 275,										//名片卡内容区域宽度(px)
		"cardContentHeight"	: 192,										//名片卡内容区域高度(px)
		"delay"				: 1000,										//关注成功后，名片卡停留时间（ms）
		"directions"		: ["up","down","left","right"],				//store the usercard's relative directions, userless but for enuming
		"types"				: ["midd","clockwise","counterclockwise"]	//store the usercard's types, userless but for enuming
	};

	//各自区域名片卡的独立配置
	//存储拥有名片卡功能的页面的配置信息
	//如html的id名，class名，名片卡大小，箭头方向等
	var CardProfile_1 = {
		"userBox"		: "interest_person",						//名片卡弹出功能所在的区域的id ***
		"userListTag"	: "DT",										//名片卡弹出功能绑定元素的标签名，一般为DT，LI
		"userListClass"	: null,										//名片卡弹出功能绑定元素的className ***
		"awayDistance"	: 10,										//名片卡距头像的距离(px)
		"direction"		: "left",									//名片卡的相对位置
		"type"			: "counterclockwise"						//名片卡上箭头的相对位置，相对居中位置顺时针或逆时针
	};

	//可以定义另一个需要名片卡功能的区域的配置，使用createInit创造初始化函数
	//var CardProfile_2 = {...};

	//cache the user's info for foward hover
	var cardCache = {};

	var createInit = function(Profile){
		//store this function's temp variables
		var v = {
			"userBox": null,
			"userList": null,
			"userCard": null,
			"userCardContent":null,
			"bIframe": null
		};

		//show the usercard
		//[direction]	means the direction of userCard relative to the user head img
		//				表示名片卡相对于头像的方向：上下左右
		//[type]		means the position of arrow relative to the middle position, clockwise or counterclockwise
		//				表示名片卡上的箭头相对于中间位置是逆时针偏移还是顺时针偏移
		var showUserCard = function(uid, el, direction, type){
			//console.info(el);
			if(!el){ return; }
			v.userCardContent = v.userCardContent || $E(Common["userCardContent"]);

			//show the card, and the v.userCard.width is available
			v.userCard.style.display = "";
			v.bIframe.style.display = "";
			v.userCardContent.innerHTML = "";

			//calculate the card's position
			if(el && el.getElementsByTagName("IMG").length >= 1){
				el = el.getElementsByTagName("IMG")[0];
			}
			var pos = Core.Dom.getXY(el),
				cardTop,
				cardLeft, 
				arrowPos = "layerArrow_null", 
				setPosition = true,			//填充内容后向上展开，需要修正style.top
				defaultHeight = 51,
				cssHeight = "line-height:"+defaultHeight+"px;height:"+defaultHeight+"px;";
			//insert the waiting content
			//scope.$BASEIMG + "style/images/common/loading.gif";
			//v.userCardContent.innerHTML = "<p style='text-align:center;"+cssHeight+"'>"+$CLTMSG["XM0003"]+"</p>";
			v.userCardContent.innerHTML = '<div class="ldcontent" style="padding-top:16px;width:'+(Common.cardContentWidth-40)+
										  'px;">\n<p>'+$CLTMSG["XM0003"]+'</p>\n</div>';
               	
			switch(direction){
				case "up":
					cardLeft = (pos[0] - (v.userCard.offsetWidth - el.offsetWidth) / 2) + (type == 'midd' ? 0 : (type == "clockwise" ? 112 : -112 ));
					cardTop = pos[1] - v.userCard.offsetHeight - Profile.awayDistance;
					if(type === "clockwise"){
						arrowPos = "layerArrow layerArrow_d";
					}
					break;
				case "down":
					cardLeft = (pos[0] - (v.userCard.offsetWidth - el.offsetWidth) / 2) + (type == 'midd' ? 0 : (type == "clockwise" ? -112 : 112 ));
					cardTop = pos[1] + el.offsetHeight + Profile.awayDistance;
					if(type === "counterclockwise"){
						arrowPos = "layerArrow layerArrow";
					}
					setPosition = false;
					break;
				case "left":
					cardLeft = pos[0] - v.userCard.offsetWidth - Profile.awayDistance;
					cardTop = (pos[1] - (Common.cardHeight - el.offsetHeight) / 2) + (type == 'midd' ? 0 : (type == "clockwise" ? -72 : 72 ));
					if(type === "counterclockwise"){
						arrowPos = "layerArrow layerArrow_r";
						setPosition = false;
					}
					break;
				case "right":
					cardLeft = pos[0] + el.offsetWidth + Profile.awayDistance;
					cardTop = (pos[1] - (Common.cardHeight - el.offsetHeight) / 2) + (type == 'midd' ? 0 : (type == "clockwise" ? 72 : -72 ));
					if(type === "clockwise"){
						arrowPos = "layerArrow layerArrow_l";
						setPosition = false;
					}
					break;
			}
			//console.info(cardTop + " " + cardLeft);
			v.userCard.style.top = v.bIframe.style.top = cardTop + "px";
			v.userCard.style.left = v.bIframe.style.left = cardLeft + "px";
			//insert the arrow
			var tempDiv = v.userCardContent.parentNode.getElementsByTagName("div")[0];
			if(v.userCardContent.parentNode.innerHTML.indexOf("layerArrow") === -1){
				Core.Dom.insertHTML(v.userCardContent, "<div class='"+ arrowPos +"'></div>", "BeforeBegin");
			}
			else{
				arrowPos && ( tempDiv.className = arrowPos );
				tempDiv = null;
			}

			//check if cached the data
			var cacheId = Profile["userBox"]+"_"+uid;
			if(cardCache[cacheId] && cardCache[cacheId].length > 20){
				//console.info("cache aimed!");
				v.userCardContent.innerHTML = cardCache[cacheId];
				v.bIframe.style.width = v.userCard.offsetWidth + 'px';
				v.bIframe.style.height = v.userCard.offsetHeight + 'px';
			}
			else{
				Utils.Io.Ajax.request(Common["requestUrl"], {
					'GET': {
						'uid': uid,
						'rnd': Math.random()
					},
					'onComplete': function(json){
						//console.info("json:" + json.data);
						if (json.code === 'A00006') {
							//json.data应包含类似下面的onclick事件
							//App.userCardFollow('uid',this);return false;
							json.data = json.data.replace("App.followadd","App.userCardFollow");
							v.userCardContent.innerHTML = cardCache[cacheId] = json.data;  //insert and cache the data
							v.bIframe.style.width = v.userCard.offsetWidth + 'px';
							v.bIframe.style.height = v.userCard.offsetHeight + 'px';

							//当箭头在名片卡中间或中间偏下时，载入内容时向上展开，修正名片卡的style.top
							if(setPosition){
								v.userCard.style.top = v.bIframe.style.top = cardTop - v.userCardContent.offsetHeight + defaultHeight + "px";
							}
						}
						else {
							App.alert($SYSMSG[json['code']]);
						}
					},
					'onException': function(){
					},
					'returnType': 'json'
				});
			}
			//当箭头在名片卡中间或中间偏下时，载入内容时向上展开，修正名片卡的style.top
			if(setPosition){
				v.userCard.style.top = v.bIframe.style.top = cardTop - v.userCardContent.offsetHeight + defaultHeight + "px";
			}
		};

		//private close
		var closeUserCard = function(){
			//unlock for mouseout event
			App.setUserCardLocked(v.userCard, "false");

			v.userCard && ( v.userCard.style.display = "none" );
			v.bIframe && ( v.bIframe.style.display = "none" );
			v.userCardContent && ( v.userCardContent.innerHTML = "" );
		};

		var createPopLay = function(){
			if($E("userCard") && $E("bIframe")){
				v.userCard = $E("userCard");
				v.bIframe = $E("bIframe");
				return;
			}
			v.userCard = $C("DIV");
			v.bIframe = $C("IFRAME");
			v.userCard.id = "userCard";
			v.bIframe.id = "bIframe";
			v.userCard.className = "PopLayer";
			v.userCard.style.width = Common.cardWidth + "px";
			v.userCard.style.zIndex = "1000";
			v.bIframe.style.zIndex = "800";
			v.bIframe.style.height = "0px";
			v.bIframe.style.position = "absolute";
			Core.Dom.opacity(v.bIframe,0);
			
			v.userCard.innerHTML = '<table class="mBlogLayer">\
					<tbody>\
					<tr>\
						<td class="top_l"></td>\
						<td class="top_c"></td>\
						<td class="top_r"></td>\
					</tr>\
					<tr>\
						<td class="mid_l"></td>\
						<td class="mid_c">\
							<div class="layerBox">\
								<div style="width:'+ Common.cardContentWidth +'px;" class="layerBoxCon1">\
									<div class="name_card">\
										<div id="user_card_content">\
										</div>\
									</div>\
								</div>\
							</div></td>\
						<td class="mid_r"></td>\
					</tr>\
					<tr>\
						<td class="bottom_l"></td>\
						<td class="bottom_c"></td>\
						<td class="bottom_r"></td>\
					</tr>\
				</tbody>\
			</table>';
		};

		//获得需要注册的元素列表
		var getRegList = function(){
			v.userBox = $E(Profile["userBox"]);
			if(v.userBox){
				if(Profile["userListClass"]){
					return Core.Dom.byClz(v.userBox, Profile["userListTag"], Profile["userListClass"]);
				}
				else{
					return v.userBox.getElementsByTagName(Profile["userListTag"]);
				}
			}
		};

		var regHover = function(lists, ext){
			var direction = Profile["direction"] || "left";
			var type = Profile["type"] || "counterclockwise";
			v.userCard.index = null;

			for(var i = 0, len = lists.length; i < len; i += 1){
				if(lists[i].getAttribute("reg_hover") === "true")
					continue;
				(function(n){
					var uid = App.getUid_forUserCard(lists[n], Profile["userBox"]);
					hover({
						'act' : lists[n],
						'ext' : ext,
						'fun' : function(b){
							if(b){
								if(v.userCard.index === null){
									showUserCard(uid, this, direction, type);
									v.userCard.index = n;
								}
							}else{
								if(v.userCard.getAttribute("locked") !== "true"){
									closeUserCard();
									v.userCard.index = null;
								}
							}
						}
					});
					lists[n].setAttribute("reg_hover","true");
				})(i);
			}
		};

		var startCreate = function(){
			return function(){
				//console.info("start creating");
				//start creating
				if($E(Profile["userBox"])){
					v.userList = getRegList();
					if(v.userList.length > 0){
						//create poplay div and iframe
						createPopLay();
						//register hover event
						regHover(v.userList, [v.userCard]);

						v.userCard && document.body.appendChild(v.userCard);
						v.bIframe && document.body.appendChild(v.bIframe);
						v.userCardContent = $E(Common["userCardContent"]);
						closeUserCard();
					}
				}
				return function(){/*do nothing.*/};
			};
		};
		
		//具体的执行函数
		return startCreate();
	};

	App.userCardFollow = function(uid, el, callback, conf){
		//lock the userCard for mouseout event
		App.setUserCardLocked(null, "true");

		var url =  "/attention/aj_addfollow.php";
		var motion = $IE ? "" : "fade";

		if(conf){
			url += ('?' + App.jsonToQuery(conf));
		}

		App.followOperation({uid:uid,fromuid:scope.$uid},url,function(){
			var newDom = document.createElement("a");
			newDom.className = "btn_add concernBtn_Yet";
			newDom.style.paddingLeft = "5px";
			newDom.innerHTML = "<span class=\"add_yet\"></span>"+$CLTMSG["CC2510"];
			Core.Dom.insertAfter(newDom,el);
			Core.Dom.removeNode(el);
			if(typeof(callback) == "function"){
				callback();
			}

			App.delayCloseUserCard && App.delayCloseUserCard(motion, function(){
				App.card_follow && App.card_follow(uid);
			});
		},el,"",function(){
			App.closeUserCard && App.closeUserCard();
		});
	};

	//get uid from the hover element
	//传入area参数表示不同区域，从而定义不同的获取uid的方式
	App.getUid_forUserCard = function(el, area){
		area = area || "interest_person";
		if(area === "interest_person"){
			return el.getElementsByTagName("IMG")[0].getAttribute("uid");
		}
		else if(App.getElementsByAttribute){
			return App.getElementsByAttribute(el,"*","uid");
		}
		else{
			return "";
		}
	};

	//lock the userCard for mouseout event
	App.setUserCardLocked = function(el, value){
		value = value || "true";
		el = el || $E(Common["card"]),
		el.setAttribute("locked",value);
	};

	//public close
	//hide the usercard, clear userCard's innerHTML
	App.closeUserCard = function(){
		App.setUserCardLocked($E(Common["card"]),"false");

		var userCard = $E(Common["card"]),
			bIframe = $E(Common["iframe"]),
			userCardContent = $E(Common["userCardContent"]);
		userCard && ( userCard.style.display = "none" );
		bIframe && ( bIframe.style.display = "none" );
		userCardContent && ( userCardContent.innerHTML = "" );

		//you can ctrl+F5 to find index's meaning
		$E(Common["card"]).index = null;
	};

	//delay close the userCard
	App.delayCloseUserCard = function(motion, callback){
		var delayFunc;
		if(motion === "fade"){
			delayFunc = function(){
				if(App.opacity && $E(Common["card"])){
					App.opacity($E(Common["card"]), {
						'first': 100,
						'last': 0,
						'time': 1.5
					},function(){
						App.closeUserCard();
						if(callback && typeof callback === "function"){
							callback.call();
						}
						Core.Dom.opacity($E(Common["card"]),100);
					});
				}
			};
		}
		else{
			delayFunc = function(){
				App.closeUserCard();
				if(callback && typeof callback === "function"){
					callback.call();
				}
			};
		}
		setTimeout(delayFunc,Common.delay);
	};

	//统一操作鼠标进出的函数，引用自medal.js
	var hover = function(spec){
		var delay = spec.delay || 100;
		var isover = spec.isover || false;
		var act = spec.act;
		var ext = spec.ext || [];
		var timer = null;
		var showAct = function(e) {
			isover && spec['fun'].apply(spec.act,[isover]);
		};
		var hiddAct = function(e) {
			(!isover) && spec['fun'].apply(spec.act,[isover]);
		};
		var hoverAct = function(e) {
			isover = true;
			timer && clearTimeout(timer);
			timer = setTimeout(function(){showAct(e);},delay);
		};
		var msoutAct = function(e) {
			isover = false;
			timer && clearTimeout(timer);
			timer = setTimeout(function(){hiddAct(e);},delay);
		};
		Core.Events.addEvent(act, hoverAct, 'mouseover');
		Core.Events.addEvent(act, msoutAct, 'mouseout');
		for(var i = 0, len = ext.length; i < len; i += 1) {
			Core.Events.addEvent(ext[i], hoverAct, 'mouseover');
			Core.Events.addEvent(ext[i], msoutAct, 'mouseout');
		};
	};

	//userCard poping init function, key function
	//定义了一个公共函数，在你希望的位置调用App.userCardInit(); 可以实现名片卡功能
	App.userCardInit = createInit(CardProfile_1);

	//您可以定义新的init函数，用于其他区域的名片卡初始化
	//App.userCardInit2 = createInit(CardProfile_2);

	//for test
	//App.userCardInit();
});