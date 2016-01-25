/**
 * @author sinadmin
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setXY.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/dom/removeNode.js');
$import('sina/core/string/trim.js');
$import("diy/provinceandcity.js");
$import("diy/check.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/byteLength.js");
/*
 * 
 * 
 *  DIY_box_bg
 */
App.searchdialog = function(specdom,hlt){
	try{
		var defaultvalue = {};
		if (scope.$userSearchStatus) {
			for (var key in scope.$userSearchStatus) {
				defaultvalue[key] = scope.$userSearchStatus[key];
			}
		}else{
			defaultvalue={search:'',
			nickname:'1',
			realname:'1',
			domain:'1',
			desc:'1',
			gender:0,
			province:0,
			city:0,
			comorsch:''}
		}
		//修改bug1836
		defaultvalue['search']=scope.$userSearchStatus?(scope.$userSearchStatus['search']==specdom.value?scope.$userSearchStatus['search']:specdom.value):specdom.value;
		var common = 
		[{'tagName':'IFRAME', 'attributes':{'frameborder':'0','src':'about:blank','class':'','id':'ifm','style':'position: absolute; z-index: 120; left: 100px; top: 100px;'}},
		{'tagName':'DIV', 'attributes':{'class':'alert_box','id':'search_box','style':'position: absolute; z-index: 600; left: 100px; top: 100px;'},'childList':[
			{'tagName':'DIV', 'attributes':{'class':'inputBox'},'childList':[
				{'tagName':'INPUT', 'attributes':{'class':'fm_txt2','id':'search' ,'type':'text'}},
				{'tagName':'A', 'attributes':{'class':'btn_normal font_14','id':'btn_search','href':'javascript:void(0);'},'childList':[
					{'tagName':'EM', 'attributes':{'innerHTML':$CLTMSG['CX0132']}}
				]}
			]},
			{'tagName':'DIV', 'attributes':{'class':'line','id':'range'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0133']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'nickname','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'nickname','innerHTML':$CLTMSG['CX0134']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'realname','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'realname','innerHTML':$CLTMSG['CX0135']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'domain','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'domain','innerHTML':$CLTMSG['CX0136']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'desc','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'desc','innerHTML':$CLTMSG['CX0137']}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1'}
			},
			{'tagName':'DIV', 'attributes':{'class':'sex_area','id':'sex_city'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0138']}},
				{'tagName':'SELECT', 'attributes':{'class':'sex','id':'gender'},'childList':[
					{'tagName': 'OPTION','attributes': {'value': '0','innerHTML': $CLTMSG['CX0139']}},
					{'tagName': 'OPTION','attributes': {'value': '1','innerHTML': $CLTMSG['CX0140']}},
					{'tagName': 'OPTION','attributes': {'value': '2','innerHTML': $CLTMSG['CX0141']}}
				]},
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0142']}},
				{'tagName':'SELECT', 'attributes':{'class':'province','id':'province','truevalue':'0','name':'province'}},
				{'tagName':'SELECT', 'attributes':{'class':'city','id':'city','truevalue':'0','name':'city'}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1'}
			},
			{'tagName':'DIV', 'attributes':{'class':'school_com','style':'display:none','id':'school_com'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0143']}},
				{'tagName':'INPUT', 'attributes':{'class':'text','type':'text','id':'comorsch','value':$CLTMSG['CX0144']}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'custom_btm'},'childList':[
				{'tagName':'A', 'attributes':{'id':'close','href':'javascript:void(0);','innerHTML':$CLTMSG['CX0145']}},
				{'tagName':'A', 'attributes':{'id':'reset','href':'#','innerHTML':$CLTMSG['CX0146']}}
			]}
		]}];
		var set_position = function(dom,tips){
				var pos = Core.Dom.getXY(dom);
				Core.Dom.setXY(tips.box, [pos[0] - 5, pos[1] - 5]);
				Core.Dom.setXY(tips.ifm, [pos[0] - 5, pos[1] - 5]);
			};
			
		var checkName = function(str){
			if (/[0-9\s_><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(str)) {
				return false;
			}
			else {
				return true;
			}
		};
		var limit = function(el,length){
            var snapLength = Core.String.byteLength(el.value);
            if (snapLength > length) {
                el.value = Core.String.leftB(el.value, length);
            }
        };
		var checkmini = App.checkMiniName;
		//初始化数据
		var init = function(el_tips,h){
		
				highlight(el_tips,h)
				el_tips.box.style.display = '';
				el_tips.ifm.style.display = '';
				if (defaultvalue['search']) {
					el_tips.domList['search'].value = Core.String.trim(defaultvalue['search'] == "" ? $CLTMSG['CX0147'] : Core.String.trim(defaultvalue['search']));
				};
				if (scope.$comorschsetting == 1) {
					//if (defaultvalue['comorsch'] && Core.String.trim(defaultvalue['comorsch']) != "") {
						el_tips.domList['school_com'].style.display = "";
					//}
				};
				if (defaultvalue['province']) {
					el_tips.domList['province'].setAttribute('truevalue', defaultvalue['province']);
				}
				if (defaultvalue['city']) {
					el_tips.domList['city'].setAttribute('truevalue', defaultvalue['city']);
				}
				new App.ProvinceAndCity(el_tips.domList['province'], el_tips.domList['city'], (el_tips.domList['province'].getAttribute('truevalue') || el_tips.domList['province'].value), (el_tips.domList['city'].getAttribute('truevalue') || el_tips.domList['city'].value));
				
				for (var k in defaultvalue) {
					//if (scope.$userSearchStatus[k]) {
						switch (el_tips.domList[k].type) {
							case "checkbox"://复选
								el_tips.domList[k].checked = defaultvalue[k] == '1' ? true : false;
								break;
							case "select-one"://单选 
								el_tips.domList[k].value = defaultvalue[k];
								break;
							case "text"://文本
							if (Core.String.trim(defaultvalue[k]) != '') {
								el_tips.domList[k].value = Core.String.trim(defaultvalue[k]);
							}
								break;
						}
					//}
				}
			};
		var highlight = function(el_tips,hlname){
			el_tips.domList['range'].className=el_tips.domList['range'].className.substring(0,el_tips.domList['range'].className.indexOf('DIY_box_bg')>0?el_tips.domList['range'].className.indexOf('DIY_box_bg'):el_tips.domList['range'].className.length);
			
			el_tips.domList['sex_city'].className=el_tips.domList['sex_city'].className.substring(0,el_tips.domList['sex_city'].className.indexOf('DIY_box_bg')>0?el_tips.domList['sex_city'].className.indexOf('DIY_box_bg'):el_tips.domList['sex_city'].className.length);
			el_tips.domList['school_com'].className=el_tips.domList['school_com'].className.substring(0,el_tips.domList['school_com'].className.indexOf('DIY_box_bg')>0?el_tips.domList['school_com'].className.indexOf('DIY_box_bg'):el_tips.domList['school_com'].className.length);
			if(hlname=='nickname'||hlname=='realname'||hlname=='domain'||hlname=='desc') {
				el_tips.domList['range'].className=el_tips.domList['range'].className+" DIY_box_bg";
				return true;
			}
			if(hlname=='gender'||hlname=='province'||hlname=='city') {
				el_tips.domList['sex_city'].className=el_tips.domList['sex_city'].className+" DIY_box_bg";
				return true;
			}
			if(hlname=='comorsch') {
				el_tips.domList['school_com'].className=el_tips.domList['school_com'].className+" DIY_box_bg";
			}	
		}
		if (!scope.tips) {
			scope.tips = new App.Builder(common);
			scope.tips.box = scope.tips.domList['search_box'];
			scope.tips.ifm = scope.tips.domList['ifm'];
			document.body.appendChild(scope.tips.ifm);
			document.body.appendChild(scope.tips.box);
			scope.tips.ifm.style.position = 'absolute' 
			scope.tips.box.style.position = 'absolute';
			scope.tips.ifm.style.zIndex = 600;
			scope.tips.box.style.zIndex = 600;
			scope.tips.ifm.style.height= scope.tips.box.offsetHeight+"px";
			scope.tips.ifm.style.width= scope.tips.box.offsetWidth+"px";
			var tk;
				if (specdom) {
					set_position(specdom,scope.tips);
					tk = setInterval(function(){
						set_position(specdom,scope.tips);
					}, 100);
				};
			init(scope.tips,hlt);
			//设计说不要了。。。555555
//			Core.Events.addEvent(scope.tips.domList['search'], function(){
//				if (Core.String.trim(scope.tips.domList['search'].value) === "请输入姓名/昵称") {
//					scope.tips.domList['search'].value = "";
//				}
//			}, 'focus');
//			Core.Events.addEvent(scope.tips.domList['search'], function(){
//				if (Core.String.trim(scope.tips.domList['search'].value) === "") {
//					scope.tips.domList['search'].value = "请输入姓名/昵称";
//					return false;
//				}
//			}, 'blur');
			Core.Events.addEvent(scope.tips.domList['search'], function(event){
				limit(scope.tips.domList['search'],60);
				if ( event.keyCode == "13") {
		            scope.tips.domList['search'].blur();
		            Core.Events.fireEvent(scope.tips.domList['btn_search'], "click");
       			}
			},"keyup");
			Core.Events.addEvent(scope.tips.domList['close'], function(){
				//clearInterval(tk);
				scope.tips.box.style.display="none";
				scope.tips.ifm.style.display="none";
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['reset'], function(){
				//跳到重置页面
				location.replace('/search/user.php?search='+encodeURIComponent(Core.String.trim(scope.tips.domList['search'].value))+"&nickname="+defaultvalue['nickname']);
				Core.Events.stopEvent();
				return false;
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['nickname'], function(){
				//昵称
				defaultvalue['nickname'] = scope.tips.domList['nickname'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['realname'], function(){
				//姓名
				defaultvalue['realname'] = scope.tips.domList['realname'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['domain'], function(){
				//domain
				defaultvalue['domain'] = scope.tips.domList['domain'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['desc'], function(){
				//简介
				defaultvalue['desc'] = scope.tips.domList['desc'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips.domList['gender'], function(){
				//性别
				defaultvalue['gender'] = scope.tips.domList['gender'].value || scope.tips.domList['gender'].getAttribute('truevalue');
			}, 'change');
			Core.Events.addEvent(scope.tips.domList['province'], function(){
				//省份
				defaultvalue['province'] = scope.tips.domList['province'].value || scope.tips.domList['province'].getAttribute('truevalue');
			}, 'change');
			Core.Events.addEvent(scope.tips.domList['city'], function(){
				//城市
				defaultvalue['city'] = scope.tips.domList['city'].value || scope.tips.domList['city'].getAttribute('truevalue');
			}, 'change');
			Core.Events.addEvent(scope.tips.domList['comorsch'], function(){

				//学校或者公司
				if (Core.String.trim(scope.tips.domList['comorsch'].value) === "") {
					scope.tips.domList['comorsch'].value = $CLTMSG['CX0148'];
					defaultvalue['comorsch'] = '';//1850bug
					return false;
				}
				else {
					defaultvalue['comorsch'] = encodeURIComponent(scope.tips.domList['comorsch'].value);
					return false;
				}
			}, 'blur');
			Core.Events.addEvent(scope.tips.domList['comorsch'], function(event){
				limit(scope.tips.domList['comorsch'],60);
				if ((event.ctrlKey == true && event.keyCode == "13") || (event.altKey == true && event.keyCode == "83")) {
		            scope.tips.domList['search'].blur();
		            Core.Events.fireEvent(scope.tips.domList['btn_search'], "click");
       			}
			},"keyup");
			Core.Events.addEvent(scope.tips.domList['comorsch'], function(){
				//学校或者公司
				if (Core.String.trim(scope.tips.domList['comorsch'].value) === $CLTMSG['CX0148']) {
					scope.tips.domList['comorsch'].value = "";
					return false;
				};
			}, 'focus');
			Core.Events.addEvent(scope.tips.domList['btn_search'], function(){
//				var isvalid=(defaultvalue['nickname']==1?checkmini(scope.tips.domList['search'].value):true)||(defaultvalue['realname']==1?checkName(scope.tips.domList['search'].value):true)||defaultvalue['domain']==1?true:true||defaultvalue['desc']==1?true:true;
//				if(defaultvalue['nickname']==1){
//					isvalid = isvalid||checkmini(scope.tips.domList['search'].value);
//				}
//				if(defaultvalue['realname']==1){
//					isvalid = isvalid||checkName(scope.tips.domList['search'].value);
//				}
//				if(defaultvalue['domain']==1){
//					isvalid = isvalid||true;
//				}
//				if(defaultvalue['desc']==1){
//					isvalid = isvalid||true;
//				}

//				if (isvalid) {
//					defaultvalue['search'] = encodeURIComponent(Core.String.trim(scope.tips.domList['search'].value) == "请输入姓名/昵称"?'':Core.String.trim(scope.tips.domList['search'].value));
					defaultvalue['search'] = encodeURIComponent(Core.String.trim(scope.tips.domList['search'].value));
					if(defaultvalue['comorsch']){defaultvalue['comorsch'] = encodeURIComponent(Core.String.trim(scope.tips.domList['comorsch'].value));}
					clearInterval(tk);
					App.searchbycondition("/search/user.php", defaultvalue);
					return false;
//				}
//				else {
//					App.alert("请输入正确格式的搜索条件！");
//					return false;
//				}
			}, 'click');
		}else{
			init(scope.tips,hlt);
			//highlight(scope.tips,hlt);
		}	
	}catch(e){
		
	};
};
//传入dom，取value否则字符串直接取
App.searchbycondition = function(url,params){
	var count=0;
	for(var key in params){
		if (count === 0) {
			url = url + "?" + key + "=" + (params[key] === "" ? "" : params[key]);
		}
		else {
			url = url + '&' + key + "=" + (params[key] === "" ? "" : params[key]);
		}
		count++;
	}
	location.replace(url);
	Core.Events.stopEvent();
	return false;
};

App.defaultsearch = function(){
	var url = "/search/user.php";
//	var checkName = function(str){
//			if (/[0-9\s_><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(str)) {
//				return false;
//			}
//			else {
//				return true;
//			}
//		};
//	var checkmini = App.checkMiniName;
//	if (Core.String.trim($E("user_search_input").value) !== "请输入姓名/昵称"&&Core.String.trim($E("user_search_input").value) !== "") {
//		if (checkmini($E("user_search_input").value) || checkName($E("user_search_input").value)) {
			var params = scope.$userSearchStatus ||
			{
				search: '',
				nickname: '1',
				realname: '1',
				domain: '1',
				desc: '1',
				gender: '',
				province: '',
				city: '',
				comorsch: ''
			};
			params['search'] = encodeURIComponent($E("user_search_input").value);
			App.searchbycondition(url, params);
			Core.Events.stopEvent();
			return false;
//		}
//		else {
//			App.alert("请输入正确格式的姓名或昵称！");
//			return false;
//		}
//	}
};
//删除搜索条件
App.delSearchItem = function(){
	var count=0;
	var url = "/search/user.php";
	var arr = scope.$userSearchStatus;
	for (var i = 0; i < arguments.length; i++) {
		for(var j in arr){
			if (arguments[i] === j) {
				arr[j]=null;
				break;
			}
		}
	}
	for (var q in arr) {
		if (arr[q]!==null) {
			if (count === 0) {
				url = url + "?" + q + "=" + (arr[q] === "" ? "" : encodeURIComponent(arr[q]));
			}
			else {
				url = url + '&' + q + "=" + (arr[q] === "" ? "" : encodeURIComponent(arr[q]));
			}
			count++
		}
	}
	location.replace(url);
	Core.Events.stopEvent();
	return false;
};
$registJob('search_ctrlenter', function(){
	if(!$E('user_search_input')){
		return;
	}	
	var limit = function(el,length){
            var snapLength = Core.String.byteLength(el.value);
            if (snapLength > length) {
                el.value = Core.String.leftB(el.value, length);
            }
        };
	Core.Events.addEvent($E('user_search_input'), function(event){
		limit($E('user_search_input'),60);
		if ( event.keyCode == "13" ) {
            $E('user_search_input').blur();
            App.defaultsearch();
			}
	}, 'keyup');
});


