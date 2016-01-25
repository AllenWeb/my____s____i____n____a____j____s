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
$import("diy/date.js");
$import('sina/core/events/getEvent.js');
/*
 * 
 * 
 *  DIY_box_bg
 */
App.searchdialog_topic = function(specdom,hlt){
	try{
		var defaultvalue = {};
		var oEv = Core.Events.getEvent();
		scope.topictag =  oEv? (oEv.srcElement || oEv.target): null;
		while(scope.topictag && scope.topictag.tagName!="A"){
			scope.topictag = scope.topictag.parentNode;
		}
		
		var defaultdisp = scope.$topicSearchStatus||[];
		if (scope.$topicSearchValue) {
			for (var key in scope.$topicSearchValue) {
				defaultvalue[key] = scope.$topicSearchValue[key];
			}
		}else{
			defaultvalue={filter_search:'',
			filter_ori:'1',
			filter_ret:'1',
			filter_text:'1',
			filter_pic:'1',
			filter_video:'1',
			filter_music:'1',
			filter_userscope:'0',
			nickname:'',
			province:'0',
			city:'0',
			starttime:'',
			endtime: (new Date().getYear()+':'+((new Date().getMonth()+1)>1?(new Date().getMonth()+1):'0'+(new Date().getMonth()+1))+':'+((new Date().getDate())>9?(new Date().getDate()):'0'+(new Date().getDate())))}
		}
		//应该不用同步了吧！！！
		//defaultvalue['search']=scope.$topicSearchValue?(scope.$topicSearchValue['search']==specdom.value?scope.$topicSearchValue['search']:(specdom.value?specdom.value:'')):(specdom?specdom.value:'');
		var common = 
		[{'tagName':'IFRAME', 'attributes':{'frameborder':'0','src':'about:blank','class':'','id':'ifm','style':'display:none;position: absolute; z-index: 120; left: 100px; top: 100px;'}},
		{'tagName':'DIV', 'attributes':{'class':'DIY_box','id':'search_box','style':'position: absolute; z-index: 600; left: 100px; top: 100px;'},'childList':[
			{'tagName': 'DIV','attributes': {'class': 'scope','id':'range','style':'display:none;'},'childList': [
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0149']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_ori','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_ori','innerHTML':$CLTMSG['CX0150']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_ret','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_ret','innerHTML':$CLTMSG['CX0151']}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'range_line','style':'display:none;'}
			},
			{'tagName': 'DIV','attributes': {'class': 'lf types','id':'mtype','style':'display:none;'},'childList': [
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0152']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_text','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_text','innerHTML':$CLTMSG['CX0153']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_pic','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_pic','innerHTML':$CLTMSG['CX0154']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_video','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_video','innerHTML':$CLTMSG['CX0155']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'checkbox','id':'filter_music','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'for':'filter_music','innerHTML':$CLTMSG['CX0156']}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'mtype_line','style':'display:none;'}
			},
			{'tagName':'INPUT', 'attributes':{'class':'','id':'filter_userscope','type':'radio','style':'display:none'}},
			{'tagName':'DIV', 'attributes':{'class':'user_scope','id':'user_range','style':'display:none;'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0157']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'radio','name':'userscope','checked':'true'}},
				{'tagName':'LABEL', 'attributes':{'innerHTML':$CLTMSG['CX0158']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'radio','name':'userscope','checked':'false'}},
				{'tagName':'LABEL', 'attributes':{'innerHTML':$CLTMSG['CX0159']}},
				{'tagName':'INPUT', 'attributes':{'class':'','type':'radio','name':'userscope','checked':'false'}},
				{'tagName':'LABEL', 'attributes':{'innerHTML':$CLTMSG['CX0160']}},
				{'tagName':'INPUT', 'attributes':{'class':'text','type':'text','id':'nickname','value':'','disable':'true'}}
				
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'user_range_line','style':'display:none;'}
			},
			{'tagName':'DIV', 'attributes':{'class':'user_scope','id':'user_dist','style':'display:none;'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0161']}},
				{'tagName':'SELECT', 'attributes':{'class':'province','id':'province','truevalue':'0','name':'province'}},
				{'tagName':'SELECT', 'attributes':{'class':'city','id':'city','truevalue':'0','name':'city'}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'user_dist_line','style':'display:none;'}
			},	
			{'tagName':'DIV', 'attributes':{'class':'user_scope','id':'time_range','style':'display:none;'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0162']}},
				{'tagName':'INPUT', 'attributes':{'class':'text','id':'starttime','type':'text','value':'yyyy-mm-dd','readonly':'true'}},
				{'tagName':'EM', 'attributes':{'class':'to','innerHTML':$CLTMSG['CX0163']}},
				{'tagName':'INPUT', 'attributes':{'class':'text','id':'endtime','type':'text','value':'2010-02-12','readonly':'true'}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'time_range_line','style':'display:none;'}
			},	
			{'tagName':'DIV', 'attributes':{'class':'user_scope','id':'user_search','style':'display:none;'},'childList':[
				{'tagName':'EM', 'attributes':{'class':'','innerHTML':$CLTMSG['CX0164']}},
				{'tagName':'INPUT', 'attributes':{'class':'text','type':'text','id':'filter_search','value':$CLTMSG['CX0165']}}
			]},
			{'tagName':'DIV', 'attributes':{'class':'MIB_linedot1','id':'user_search_line','style':'display:none;'}
			},
			{'tagName':'DIV', 'attributes':{'class':'custom_btm'},'childList':[
				{'tagName':'A', 'attributes':{'id':'btn_search','class':'btn_normal btnxs','href':'#','innerHTML':'<em>'+$CLTMSG['CX0166']+'</em>'}},
				{'tagName':'A', 'attributes':{'id':'close','href':'javascript:void(0);','innerHTML':$CLTMSG['CX0167']}},
				{'tagName':'A', 'attributes':{'id':'reset','href':'#','innerHTML':$CLTMSG['CX0168']}}
			]}
		]}];
		
		var set_position = function(dom,tips){
				var pos = Core.Dom.getXY(dom);
				Core.Dom.setXY(tips.box, [pos[0], pos[1] + dom.offsetHeight]);
				Core.Dom.setXY(tips.ifm, [pos[0], pos[1] + dom.offsetHeight]);
			};
		var limit = function(el,length){
            var snapLength = Core.String.byteLength(el.value);
            if (snapLength > length) {
                el.value = Core.String.leftB(el.value, length);
            }
        };
		var setdisplay = function(el_tips,arrdisp){
			for(var i=0;i<arrdisp.length;i++){
				el_tips.domList[arrdisp[i]]?el_tips.domList[arrdisp[i]].style.display="":null;
				el_tips.domList[arrdisp[i]+'_line']?el_tips.domList[arrdisp[i]+'_line'].style.display="":null;
			}
		};
		var checkmini = App.checkMiniName;
		var setdate = function(el,setdf){
			var box;
			var btn = el;
			var date = [];
		    date = btn.value.split('-');
//	        if (date.length) {
//	            btn.value = date.join('-');
//	        }
//	        else {
//	            btn.value = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate();
//	        }
			 var pos = Core.Dom.getXY(btn);
			if (Core.Dom.getElementsByClass(document, "div", "pc_caldr").length > 0) {
				box=Core.Dom.getElementsByClass(document, "div", "pc_caldr")[0];
				box.innerHTML="";
				Core.Dom.removeNode(box);
			}
				box = document.createElement('DIV');
				box.style.cssText = 'position:absolute;display:none;z-Index:1000;';
		        box.style.left = pos[0] + 'px';
		        box.style.top = pos[1] + 20 + 'px';
	        	box.className = "pc_caldr";
				document.body.appendChild(box);
				new domkey.Date(box, function(y, m, d){
				btn.value=y+'-'+((parseInt(m)+1)>9?(parseInt(m)+1):'0'+(parseInt(m)+1))+'-'+(parseInt(d)>9?d:'0'+d);
				setdf(btn.value);
				hidd();
	           	return false;
	        	}, (date[0] ? parseInt(date[0]) : (new Date()).getFullYear()), //年
				 (date[1] ? parseInt(date[1]) : (new Date()).getMonth() + 1) - 1, //月
				 (new Date(parseInt(scope.$severtime) * 1000)), //点击范围开始
				 Math.ceil(((new Date()).getTime()) / (24 * 60 * 60 * 1000)),//点击范围长度［天］
				 (parseInt(date[2]) || ((new Date()).getDate())) //选择日期
				);
			      
	        box.style.display = '';
	        Core.Events.stopEvent();
	        box.onclick = function(){
	            Core.Events.stopEvent();
	            return false;
	        };
	        
	        //Core.Events.removeEvent(document.body,hidd , 'click');
	        var hidd = function(){
	            box.style.display = 'none';
				box.innerHTML="";
				Core.Dom.removeNode(box);
				Core.Events.removeEvent(document.body,hidd , 'click');
	        };
	        Core.Events.addEvent(document.body,hidd , 'click');
		};
		//初始化数据
		var init = function(el_tips,h){
				highlight(el_tips,h);
				el_tips.box.style.display = '';
				el_tips.ifm.style.display = 'none';
				if (defaultvalue['filter_search']) {
					el_tips.domList['filter_search'].value = Core.String.trim(defaultvalue['filter_search']) == "" ? $CLTMSG['CX0169'] : Core.String.trim(defaultvalue['filter_search']);
				};
//				if (scope.$comorschsetting == 1) {
//					//if (defaultvalue['comorsch'] && Core.String.trim(defaultvalue['comorsch']) != "") {
//						el_tips.domList['school_com'].style.display = "";
//					//}
//				};
				if (defaultvalue['province']) {
					el_tips.domList['province'].setAttribute('truevalue', defaultvalue['province']);
					el_tips.domList['province'].setAttribute('value', defaultvalue['province']);
					if(defaultvalue['city']==0){
						defaultvalue['city'] = 1000;
					}
				}
				if (defaultvalue['city']) {
					el_tips.domList['city'].setAttribute('truevalue', defaultvalue['city']);
					el_tips.domList['city'].setAttribute('value', defaultvalue['city']);
				};
				if(scope.tips_topic.domList['starttime']){
					scope.tips_topic.domList['starttime'].readOnly=true;
				};
				if(scope.tips_topic.domList['endtime']){
					scope.tips_topic.domList['endtime'].readOnly=true;
				};
				if(scope.tips_topic.domList['nickname']){
					scope.tips_topic.domList['nickname'].disabled=true;
				};
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
							case "radio"://单选框  只有关注的在用
								el_tips.domList['user_range'].getElementsByTagName('INPUT')[defaultvalue[k]].checked = true;
								if (defaultvalue[k] == 2) {
									el_tips.domList['nickname'].disabled = false;
								}
							break;
						}
					//}
				}
			};
		var highlight = function(el_tips,hlname){
//			el_tips.domList['range'].className=el_tips.domList['range'].className.substring(0,el_tips.domList['range'].className.indexOf('DIY_box_bg')>0?el_tips.domList['range'].className.indexOf('DIY_box_bg'):el_tips.domList['range'].className.length);
//			el_tips.domList['sex_city'].className=el_tips.domList['sex_city'].className.substring(0,el_tips.domList['sex_city'].className.indexOf('DIY_box_bg')>0?el_tips.domList['sex_city'].className.indexOf('DIY_box_bg'):el_tips.domList['sex_city'].className.length);
//			el_tips.domList['school_com'].className=el_tips.domList['school_com'].className.substring(0,el_tips.domList['school_com'].className.indexOf('DIY_box_bg')>0?el_tips.domList['school_com'].className.indexOf('DIY_box_bg'):el_tips.domList['school_com'].className.length);
			el_tips.domList['range'].className = el_tips.domList['range'].className.replace(/ DIY_box_bg/,'');
			el_tips.domList['mtype'].className = el_tips.domList['mtype'].className.replace(/ DIY_box_bg/,'');
			el_tips.domList['user_dist'].className = el_tips.domList['user_dist'].className.replace(/ DIY_box_bg/,'');
			el_tips.domList['user_range'].className = el_tips.domList['user_range'].className.replace(/ DIY_box_bg/,'');
			el_tips.domList['time_range'].className = el_tips.domList['time_range'].className.replace(/ DIY_box_bg/,'');
			el_tips.domList['user_search'].className = el_tips.domList['user_search'].className.replace(/ DIY_box_bg/,'');
			if(hlname===''){return false;}
			el_tips.domList[hlname].className=el_tips.domList[hlname].className+" DIY_box_bg";
//			if(hlname=='filter_ori'||hlname=='filter_ret') {
//				el_tips.domList['range'].className=el_tips.domList['range'].className+" DIY_box_bg";
//				return true;
//			}
//			if(hlname=='filter_text'||hlname=='filter_pic'||hlname=='filter_video'||hlname=='filter_music') {
//				el_tips.domList['mtype'].className=el_tips.domList['mtype'].className+" DIY_box_bg";
//				return true;
//			}
//			if(hlname=='filter_userscope'||hlname=='nickname') {
//				el_tips.domList['user_range'].className=el_tips.domList['user_range'].className+" DIY_box_bg";
//				return true;
//			}
//			if(hlname=='province'||hlname=='city') {
//				el_tips.domList['user_dist'].className=el_tips.domList['user_dist'].className+" DIY_box_bg";
//				return true;
//			}
//			if(hlname=='starttime'||hlname=='endtime') {
//				el_tips.domList['time_range'].className=el_tips.domList['time_range'].className+" DIY_box_bg";
//				return true;
//			}	
//			if(hlname=='filter_search') {
//				el_tips.domList['user_search'].className=el_tips.domList['user_search'].className+" DIY_box_bg";
//				return true;
//			}	
		};
		var checkdate = function(sttime,edtime){
			  if(!sttime || !edtime){
			  	//没有此东西就不校验了
				return true;
			  }
			  if(sttime==='yyyy-mm-dd'){
			  	//默认不校验
				return true;
			  }
			  sttime=sttime.replace(/-/g,"/");  
			  edtime=edtime.replace(/-/g,"/");  
			  if(Date.parse(sttime)-Date.parse(edtime)>0){
			   return false;  
 			}  else{
				return true;
			}
		};
		var checknick = function(){
			if(defaultvalue['filter_userscope']==2){
				if(Core.String.trim(scope.tips_topic.domList['nickname'].value)==""||Core.String.trim(scope.tips_topic.domList['nickname'].value)==$CLTMSG['CX0170']){
					App.alert($CLTMSG['CX0170']);
					return false;
				}else{
					return true;
				}
			}else{
					return true;
				}
		}
		
		if (!scope.tips_topic) {
			scope.tips_topic = new App.Builder(common);
			scope.tips_topic.box = scope.tips_topic.domList['search_box'];
			scope.tips_topic.ifm = scope.tips_topic.domList['ifm'];
			setdisplay(scope.tips_topic,defaultdisp);
			document.body.appendChild(scope.tips_topic.ifm);
			document.body.appendChild(scope.tips_topic.box);
			
			scope.tips_topic.ifm.style.position = 'absolute';
			scope.tips_topic.box.style.position = 'absolute';
			scope.tips_topic.ifm.style.zIndex = 600;
			scope.tips_topic.box.style.zIndex = 600;
			scope.tips_topic.ifm.style.height= (scope.tips_topic.box.offsetHeight) +"px";
			scope.tips_topic.ifm.style.width= (scope.tips_topic.box.offsetWidth)+"px";
			var tk;
				if (specdom) {
					set_position(specdom,scope.tips_topic);
					tk = setInterval(function(){
						set_position(specdom,scope.tips_topic);
					}, 100);
				};
			
			init(scope.tips_topic,hlt);
			//绑定时间
			Core.Events.addEvent(scope.tips_topic.domList['starttime'], function(){
				scope.tips_topic.domList['starttime'].readOnly=true;
				setdate(scope.tips_topic.domList['starttime'],function(vl){
					if (vl) {
						defaultvalue['starttime'] = vl;
					}
				});
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['starttime'], function(){
				scope.tips_topic.domList['starttime'].style.color = "#333333";
			}, 'focus');
			Core.Events.addEvent(scope.tips_topic.domList['starttime'], function(){
				scope.tips_topic.domList['starttime'].style.color = "#999999";
			}, 'blur');
			Core.Events.addEvent(scope.tips_topic.domList['endtime'], function(){
				scope.tips_topic.domList['endtime'].readOnly=true;
				setdate(scope.tips_topic.domList['endtime'],function(vl){
					if (vl) {
						defaultvalue['endtime'] = vl;
					}
				});
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['endtime'], function(){
				scope.tips_topic.domList['endtime'].style.color = "#333333";
			}, 'focus');
			Core.Events.addEvent(scope.tips_topic.domList['endtime'], function(){
				scope.tips_topic.domList['endtime'].style.color = "#999999";
			}, 'blur');
			
			//关键字
			Core.Events.addEvent(scope.tips_topic.domList['filter_search'], function(){
				scope.tips_topic.domList['filter_search'].style.color = "#333333";
				if (Core.String.trim(scope.tips_topic.domList['filter_search'].value) === $CLTMSG['CX0165']) {
					scope.tips_topic.domList['filter_search'].value = "";
				}
			}, 'focus');
			Core.Events.addEvent(scope.tips_topic.domList['filter_search'], function(){
				scope.tips_topic.domList['filter_search'].style.color = "#999999";
				if (Core.String.trim(scope.tips_topic.domList['filter_search'].value) === "") {
					scope.tips_topic.domList['filter_search'].value = $CLTMSG['CX0165'];
					return false;
				}
			}, 'blur');
			Core.Events.addEvent(scope.tips_topic.domList['filter_search'], function(event){
				limit(scope.tips_topic.domList['filter_search'],60);
				if (event.keyCode == "13") {
		            scope.tips_topic.domList['filter_search'].blur();
		            Core.Events.fireEvent(scope.tips_topic.domList['btn_search'], "click");
       			}
			},"keyup");
			Core.Events.addEvent(scope.tips_topic.domList['close'], function(){
				//clearInterval(tk);
				scope.tips_topic.box.style.display="none";
				scope.tips_topic.ifm.style.display="none";
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['reset'], function(){
				//跳到重置页面
				//location.replace(scope.globalurl+'filter_search='+encodeURIComponent(Core.String.trim(scope.tips_topic.domList['filter_search'].value))+"&filter_ori=1&filter_ret=1&filter_text=1&filter_pic=1&filter_video=1&filter_music=1&filter_userscope=0");
				location.replace(scope.defaulturl);
				Core.Events.stopEvent();
				return false;
			}, 'click');
			
			Core.Events.addEvent(scope.tips_topic.domList['filter_ori'], function(){
				//原创
				defaultvalue['filter_ori'] = scope.tips_topic.domList['filter_ori'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['filter_ret'], function(){
				//转发
				defaultvalue['filter_ret'] = scope.tips_topic.domList['filter_ret'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['filter_text'], function(){
				//纯文字
				defaultvalue['filter_text'] = scope.tips_topic.domList['filter_text'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['filter_pic'], function(){
				//含图片
				defaultvalue['filter_pic'] = scope.tips_topic.domList['filter_pic'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['filter_video'], function(){
				//含视频 
				defaultvalue['filter_video'] = scope.tips_topic.domList['filter_video'].checked ? 1 : 0;
			}, 'click');
			Core.Events.addEvent(scope.tips_topic.domList['filter_music'], function(){
				//含音乐
				defaultvalue['filter_music'] = scope.tips_topic.domList['filter_music'].checked ? 1 : 0;
			}, 'click');
			for(var i = 0;i<scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT').length - 1;i++){
				Core.Events.addEvent(scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT')[i], (function(el,index){
				//用户范围
				return function(){
					defaultvalue['filter_userscope'] = index;
					if(index==2){
						scope.tips_topic.domList['nickname'].disabled = false;	
						scope.tips_topic.domList['nickname'].value = Core.String.trim(defaultvalue['nickname'])==""?$CLTMSG['CX0170']:Core.String.trim(defaultvalue['nickname']);
					}else{
						scope.tips_topic.domList['nickname'].disabled = true;
						scope.tips_topic.domList['nickname'].value = "";
						defaultvalue['nickname']="";
					}
					scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT')[0].checked = false;
					scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT')[1].checked = false;
					scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT')[2].checked = false;
					el.checked = true;
				};
				})(scope.tips_topic.domList['user_range'].getElementsByTagName('INPUT')[i],i), 'click');
			}
			Core.Events.addEvent(scope.tips_topic.domList['province'], function(){
				//省份
				defaultvalue['province'] = scope.tips_topic.domList['province'].value || scope.tips_topic.domList['province'].getAttribute('truevalue');
			}, 'change');
			Core.Events.addEvent(scope.tips_topic.domList['city'], function(){
				//城市
				defaultvalue['city'] = scope.tips_topic.domList['city'].value || scope.tips_topic.domList['city'].getAttribute('truevalue');
			}, 'change');
			Core.Events.addEvent(scope.tips_topic.domList['nickname'], function(){
				//昵称
				scope.tips_topic.domList['nickname'].style.color = "#999999";
				if (Core.String.trim(scope.tips_topic.domList['nickname'].value) === "") {
					scope.tips_topic.domList['nickname'].value = $CLTMSG['CX0170'];
					defaultvalue['nickname']="";
					return false;
				}
				else {
					defaultvalue['nickname'] = scope.tips_topic.domList['nickname'].value;
					return false;
				}
			}, 'blur');
			Core.Events.addEvent(scope.tips_topic.domList['nickname'], function(){
				//昵称
				scope.tips_topic.domList['nickname'].style.color = "#333333";
				if (Core.String.trim(scope.tips_topic.domList['nickname'].value) === $CLTMSG['CX0170']) {
					scope.tips_topic.domList['nickname'].value = "";
					return false;
				};
			}, 'focus');
			Core.Events.addEvent(scope.tips_topic.domList['nickname'], function(){
				//昵称
				limit(scope.tips_topic.domList['nickname'],20);
			}, 'keyup');
			Core.Events.addEvent(scope.tips_topic.domList['btn_search'], function(){
//				var isvalid=(defaultvalue['nickname']==1?checkmini(scope.tips_topic.domList['search'].value):true)||(defaultvalue['realname']==1?checkName(scope.tips_topic.domList['search'].value):true)||defaultvalue['domain']==1?true:true||defaultvalue['desc']==1?true:true;
//				if(defaultvalue['nickname']==1){
//					isvalid = isvalid||checkmini(scope.tips_topic.domList['search'].value);
//				}
//				if(defaultvalue['realname']==1){
//					isvalid = isvalid||checkName(scope.tips_topic.domList['search'].value);
//				}
//				if(defaultvalue['domain']==1){
//					isvalid = isvalid||true;
//				}
//				if(defaultvalue['desc']==1){
//					isvalid = isvalid||true;
//				}
//				if (isvalid) {
//					defaultvalue['search'] = encodeURIComponent(Core.String.trim(scope.tips_topic.domList['search'].value) == "请输入姓名/昵称"?'':Core.String.trim(scope.tips_topic.domList['search'].value));
				
					if(!checkdate(defaultvalue['starttime'],defaultvalue['endtime'])){
						App.alert($CLTMSG['CX0171']);
						return false;
					}
					if(!checknick()){
						return false;
					}
					defaultvalue['filter_search'] = encodeURIComponent(Core.String.trim(scope.tips_topic.domList['filter_search'].value)==$CLTMSG['CX0165']?scope.tips_topic.domList['filter_search'].value="":Core.String.trim(scope.tips_topic.domList['filter_search'].value));
					defaultvalue['nickname'] = encodeURIComponent(Core.String.trim(scope.tips_topic.domList['nickname'].value)==$CLTMSG['CX0170']?'':Core.String.trim(scope.tips_topic.domList['nickname'].value));
					clearInterval(tk);
					var url = scope.globalurl;
					App.searchbycondition_topic(url, defaultvalue);
					return false;
//				}
//				else {
//					App.alert("请输入正确格式的搜索条件！");
//					return false;
//				}
			}, 'click');
		}else{
			init(scope.tips_topic,hlt);
			//highlight(scope.tips_topic,hlt);
		}	
		
		//点击外面直接关闭层
		var hidd_close = function(e){
			var oEvent = Core.Events.getEvent();
			var oTarget = oEvent? (oEvent.srcElement || oEvent.target): null;
			while(oTarget && oTarget != document.body){
				if(oTarget==scope.tips_topic.box || oTarget == scope.topictag){
					return true;
				}
				oTarget=oTarget.parentNode;
			}
			if (scope.tips_topic) {
				scope.tips_topic.box.style.display = "none";
				scope.tips_topic.ifm.style.display = "none";
			}
			Core.Events.removeEvent(document.body,hidd_close , 'click');
		}
		Core.Events.addEvent(document.body, hidd_close, 'click');
	}catch(e){
		
	};
};
//传入dom，取value否则字符串直接取
App.searchbycondition_topic = function(url,params){
	var count=0;
	for(var key in params){
		if (count === 0) {
			url = url + key + "=" + (params[key] === "" ? "" : params[key]);
			
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

//App.defaultsearch_topic = function(){
//	var url = "/k/";
////	var checkName = function(str){
////			if (/[0-9\s_><,\[\]\{\}\?\/\+=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\uff00-\uffff]+/.test(str)) {
////				return false;
////			}
////			else {
////				return true;
////			}
////		};
////	var checkmini = App.checkMiniName;
////	if (Core.String.trim($E("user_search_input").value) !== "请输入姓名/昵称"&&Core.String.trim($E("user_search_input").value) !== "") {
////		if (checkmini($E("user_search_input").value) || checkName($E("user_search_input").value)) {
//			var params = scope.$userSearchStatus ||
//			{
//				search: '',
//				nickname: '0',
//				realname: '0',
//				domain: '0',
//				desc: '0',
//				gender: '',
//				province: '',
//				city: '',
//				comorsch: ''
//			};
//			params['search'] = encodeURIComponent($E("user_search_input").value);
//			App.searchbycondition_topic(url, params);
//			Core.Events.stopEvent();
//			return false;
////		}
////		else {
////			App.alert("请输入正确格式的姓名或昵称！");
////			return false;
////		}
////	}
//};
//删除搜索条件
App.delSearchItem_topic = function(){
	var count=0;
	var url = scope.globalurl;
	var arr = scope.$topicSearchValue;
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
				url = url + q + "=" + (arr[q] === "" ? "" : encodeURIComponent(arr[q]));
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
//$registJob('topic_filter', function(){	
////	var limit = function(el,length){
////            var snapLength = Core.String.byteLength(el.value);
////            if (snapLength > length) {
////                el.value = Core.String.leftB(el.value, length);
////            }
////        };
//	Core.Events.addEvent($E('hot_keyword_top'), function(event){
//         scope.globalurl ='/k/'+encodeURIComponent($E('hot_keyword_top').value)+'&';
//	}, 'blur');
//});



