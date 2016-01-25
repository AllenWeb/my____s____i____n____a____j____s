/**
 * @author wangliang3@staff.sina.com.cn
 */
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/removeClassName.js");
$import('sina/core/events/stopEvent.js');
$import("sina/core/events/getEventTarget.js");
$import('diy/dom.js');
$import("diy/TextareaUtils.js");
$import("sina/utils/cookie/cookie.js");
$import("diy/date.js");
$import("diy/dialog.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/contains.js");
$import("sina/core/array/each.js");

$registJob('keyword_filter',function(){
	var items = {
		navPanel : $E('filter_nav_panel'),
		keyPanel : $E('filter_key_panel'),
		advPanel : $E('filter_adv_panel'),
		keyBtn : $E('filter_key_btn'),
		advBtn : $E('filter_adv_btn'),
		hideBtn : $E('filter_adv_hide'),
		advShow : $E('filter_adv_show'),
		keyInput : $E('filter_key_input'),
		advInput : $E('filter_adv_input'),
		keyForm : $E('filter_key_form'),
		advForm : $E('filter_adv_form'),
		stime : $E('filter_adv_stime'),
		etime : $E('filter_adv_etime'),
		dateRange : $E('date_range'),
		filterDate : $E('filter_date')
	};
	//dom operate
	var events = Core.Events,
		cdom = Core.Dom,
		adom = App.Dom;
	
	//action handler
	var handler = {
		init : function(){
			//page init
			items['keyInput']&&events.addEvent(items['keyInput'],handler.searhInputBlur,'blur');
			items['keyInput']&&events.addEvent(items['keyInput'],handler.searhInputFocus,'focus');
			
			items['advInput']&&events.addEvent(items['advInput'],handler.searhInputBlur,'blur');
			items['advInput']&&events.addEvent(items['advInput'],handler.searhInputFocus,'focus');
			
			items['stime']&&events.addEvent(items['stime'],handler.searhInputBlur,'blur');
			items['etime']&&events.addEvent(items['etime'],handler.searhInputBlur,'blur');
			
			//show adv panel 
			items['advShow']&&events.addEvent(items['advShow'],handler.showAdvPanel);
			//show adv panel 
			items['hideBtn']&&events.addEvent(items['hideBtn'],handler.hideAdvPanel);
			//search btn submit
			items['keyBtn']&&events.addEvent(items['keyBtn'],handler.keySubmit);
			items['advBtn']&&events.addEvent(items['advBtn'],handler.advSubmit);
			//bind time control
			items['stime']&&events.addEvent(items['stime'],handler.createSTime);
			items['etime']&&events.addEvent(items['etime'],handler.createETime);
			//init readonly input
			items['etime']&&(items['etime'].readOnly = true);
			items['stime']&&(items['stime'].readOnly = true);
			
			this.selectTimeRange();
		},
		clearAbtnClass : function(){
			adom.getBy(function(el){
				if(adom.hasClass(el,cName)){
					cdom.removeClassName(el,cName);
				}
			},'a',aBtn.parentNode);
		},
		showAdvPanel : function(e){
			events.stopEvent();
			cdom.setStyle(items['keyPanel'],'display','none');
			handler.showPanel(items['advPanel']);
		},
		hideAdvPanel : function(){
			var state = items['hideBtn'].getAttribute('state');
			if(state == 'post'){
				return ;
			}
			events.stopEvent();
			
			handler.hidePanel(items['advPanel']);
			
			var caldrList = Core.Dom.getElementsByClass(document, "div", "pc_caldr");
			if (caldrList.length > 0) {
                box = caldrList[0];
                box.innerHTML = "";
                document.body.removeChild(box);
            }
		},
		keySubmit : function(){
			events.stopEvent();
			if (items['keyInput'].value.replace(/(^[\s]*)|([\s]*$)/g, '') != '') {
			    if(items['keyInput'].value != items['keyInput'].getAttribute('def')){
			        items['keyForm'].submit();
			    }else if(items['filterDate'] && items['filterDate'].value !== ""){
			        items['keyInput'].value = "";
			        items['keyForm'].submit();
			    }
			}else if(items['filterDate'] && items['filterDate'].value !== ""){
			    items['keyInput'].value = "";
		        items['keyForm'].submit();
			}
		},
		advSubmit : function(){
			events.stopEvent();
			if(items['advInput'] && items['advInput'].getAttribute('def') === items['advInput'].value){
			    items['advInput'].value = '';
			}
			if(items['stime'] && items['stime'].getAttribute('def') === items['stime'].value){
			    items['stime'].value = '';
			}
			if(items['etime'] && items['etime'].getAttribute('def') === items['etime'].value){
			    items['etime'].value = '';
			}
			
			if(items['stime'] && items['stime'].value != '' && !handler.compareDate()){
				return;
			}
			items['advForm'].submit();
		},
		searhInputBlur : function(){
			var input = events.getEventTarget();
			var defValue = input.getAttribute('def');
			if(input.value == ''){
				input.value = defValue;
			}
		},
		searhInputFocus : function(){
			var input = events.getEventTarget();
			var defValue = input.getAttribute('def');
			if(input.value == defValue){
				input.value = '';
			}
		},
		showPanel : function(el){
			el.style.cssText = '';
			cdom.setStyle(el, 'opacity', 0);
			cdom.setStyle(el, 'display', '');
			var opa = 0,
				bas = 10,
				g = 1.5,
				time = 100,
				interval = null;
			var interFunc = function(){
				bas *= g;
				opa += bas;
				if (opa >= 100){
					clearInterval(interval);
					cdom.setStyle(el, 'opacity', 100);
				}
				else{
					cdom.setStyle(el, 'opacity', opa / 100);
				}
			};
			interval = setInterval(interFunc, time);
		},
		hidePanel : function(el){
			var height = el.offsetHeight;
			cdom.setStyle(el, 'overflow', 'hidden');
			var	time = 35,
				interval = null,
				base = 40;
			var interFunc = function(){
				base -= 3;
				height -= base;
				if (height <= 17 || base <= 0){
					clearInterval(interval);
					cdom.setStyle(el, 'display', 'none');
					cdom.setStyle(items['keyPanel'],'display','');
				}
				else{
					cdom.setStyle(el, 'height', height+'px');
				}
			};
			interval = setInterval(interFunc, time);
		},
		createTime: function(el, func){
            var events = Core.Events, cdom = Core.Dom, func = func ||function(){return true;};
            
            var box = null;
            var pos = Core.Dom.getXY(el);
            
            if (cdom.getElementsByClass(document, "div", "pc_caldr").length > 0) {
                box = cdom.getElementsByClass(document, "div", "pc_caldr")[0];
                box.innerHTML = "";
                cdom.removeNode(box);
            }
            box = document.createElement('DIV');
            box.style.cssText = 'position:absolute;display:none;z-Index:1000;';
            box.style.left = pos[0] + 'px';
            box.style.top = pos[1] + 20 + 'px';
            box.className = "pc_caldr";
            document.body.appendChild(box);
            //action
            var callBack = function(y, m, d){
                var time = y + '-' + ((parseInt(m) + 1) > 9 ? (parseInt(m) + 1) : '0' + (parseInt(m) + 1)) + '-' + (parseInt(d) > 9 ? d : '0' + d);
				el.value = time;
				hidd();
				func()
                return false;
            };
            var hidd = function(){
                box.style.display = 'none';
                box.innerHTML = '';
                cdom.removeNode(box);
                events.removeEvent(document.body, hidd, 'click');
            };
            //init date pars
            var now = new Date();
            now.setFullYear(now.getFullYear() - 1);
            now.setDate(now.getDate());
            var day = Math.floor(((new Date()-now)) / (1000 * 60 * 60 * 24)) + 1;
            
            var initDate = new Date();
            var defDate = [];
            if (el.value) {
                defDate = el.value.split('-');
            }
            //create calendar
            new domkey.Date(box, callBack, parseInt(defDate[0],10) || (new Date()).getFullYear(),//年
							 (parseInt(defDate[1],10) || (new Date().getMonth() + 1)) - 1,//月
							 new Date(), //点击范围开始
							 day,//点击范围长度［天］
							 (parseInt(defDate[2],10) || ((new Date()).getDate())) //选择日期
							);
            
            box.style.display = '';
            events.stopEvent();
            box.onclick = function(){
                events.stopEvent();
                return false;
            };
            events.addEvent(document.body, hidd, 'click');
        },
		compareDate: function(){
            var sDate = items['stime'].value.replace(/-/g, '/'),
				eDate = items['etime'].value.replace(/-/g, '/');
            sDate = new Date(sDate);
            eDate = eDate == '' ? new Date() : new Date(eDate);
			var tipid = 'adv_filter_err';
			var error = $E(tipid);
			if(sDate > eDate){
				if (!error) {
					error = $C('label');
					error.setAttribute('id', tipid);
					error.setAttribute($IE ? 'className' : 'class', 'errorTs error_color');
					error.style.cssText = 'margin:0 0 0 10px;padding-bottom:2px;';
					error.innerHTML = $CLTMSG['KF0001'];
					items['advBtn'].parentNode.appendChild(error);
				}
			}else if(error){
				error.parentNode.removeChild(error);
			}
            return sDate <= eDate;
        },
		createSTime : function(){
		    var call = function(){
				handler.compareDate();
			};
			handler.createTime(items['stime'],call);
			
		    handler.searhInputFocus();
		},
		createETime : function(){
			var call = function(){
				handler.compareDate();
			};
			handler.createTime(items['etime'],call);
			
			handler.searhInputFocus();
		},
		//选择时间范围下拉框
		selectTimeRange:function(){
		    var addEvent = Core.Events.addEvent,fireEvent = Core.Events.fireEvent,
		    oList = items['dateRange'], oButton , oInput = items['filterDate'];
		    if(oList && (oButton = oList.parentNode) && oInput){
		        var oText = oButton.children[0];
                oList.style.visibility = 'hidden';
                oList.style.position = 'absolute';
                
                
        		addEvent(oButton,function(e){
        		    var oTarget = e.target||e.srcElement,tag = oTarget.tagName.toUpperCase();
        		    if(tag === "SPAN" || tag === "IMG"){
        		        oList.style.visibility = oList.style.visibility === 'hidden' ? 'visible' : 'hidden' ;
        		    }
                },'click');
                
                addEvent(document.body,function(e){
                    var oTarget = e.target||e.srcElement;
                    if(!Core.Dom.contains(oButton,oTarget)){
                        oList.style.visibility = 'hidden' ;
                    }
                },'click',false);
        		
        		var list = oList.getElementsByTagName("a"),len = list.length;
        		for(var i=0;i<len;i++){
        		    (function(item){
        		        addEvent(item,function(){
        		            Core.Array.each(list,function(a){
        		                if(a != item){
        		                    a.className = "";
        		                }
        		            });
        		            item.className = "on";
        		            var date = item.getAttribute('date')||"";
                		    if(date !== 'other'){
                		        oInput.value = date;
                		        oText.innerHTML = item.innerHTML;
                		    }else{
                		        oInput.value = '';
                		        fireEvent('filter_adv_show','click');
                		        setTimeout(function(){
                		            items['stime'] && fireEvent('filter_adv_stime','click');
                		        },200);
                		    }
                		    oList.style.visibility = 'hidden';
        		        },"click");
        		    })(list[i]);
        		}
		    }
		}
	};
	//page init
	handler.init();
});