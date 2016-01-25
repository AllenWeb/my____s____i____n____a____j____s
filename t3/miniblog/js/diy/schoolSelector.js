/**
 * @author chibin
 * 
 * 学校选择器
 * 
 */
$import('diy/provinceandcity.js');
$import('sina/core/string/trim.js');
(function(proxy){
	/*
	 * 省市列表 id:province
	 * 
	 * 快速搜索id:quick_search
	 * 
	 * 学校字母索引 id:word_index
	 * 
	 * 学校列表id:schoolselect
	 * 
	 */
	var template =  '<div class="schSearchLayer">\
                    <div class="sch_form">\
					'+$CLTMSG['CC5801']+'<select id="dom_province"></select>\
					<select id="dom_city"></select>\
					<select id="dom_area" name = "areaDisp" style="display:none"><option value="1000">'+$CLTMSG['CC5802']+'</select>\
					</div>\
                    <div class="sch_letter clearFix" id="dom_letter"></div>\
                    <div class="sch_list clearFix"><div class="sch_listBrd" id="dom_schoolList"></div></div>\
                    <div class="sch_notice1"><img title="" alt="" src="http://timg.sjs.sinajs.cn/t3/style/images/common/transparent.gif" class="tipicon tip4 lf"><span class="lf">'+$CLTMSG['CC5803']+'<a href="javascript:void(0)" id="add_application">'+$CLTMSG['CC5804']+'</a></span></div>\
                    <div class="MIB_btn sch_btn"><a class="btn_normal" href="javascript:void(0)" id="sch_close"><em>'+$CLTMSG['CD0018']+'</em></a></div>';
	/*
	 * 省市HTML #province#
	 * */
	//	var prov_template = '<li><a href="javascript:void(0);" title="#province#" truevalue="#provincevalue#">#province#</a></li>';
	/*
	   字母HTML
	 */
	var code_template = '<li><a href="javascript:void(0);" title="#letter#">#letter#</a></li>';
	/*
	   学校html
	 */
	var school_template = '<li><a href="javascript:void(0);" title="#school#" truevalue="#schoolvalue#">#school#</a></li>';
	
	var school_emptytemplate = '<div style="width: 240px; margin: 55px auto 0pt;" class="commonLayer2">\
							<div class="layerL"><img class="PY_ib PY_ib_1" src="http://timg.sjs.sinajs.cn/t3/style/images/common/PY_ib.gif"></div>\
							<div class="layerR">\
								<p class="txt font_14">'+$CLTMSG['CC5824']+'</p>\
							</div>\
							<div class="clearit"></div>\
						</div>'
	/*
	   请求函数{
	   	param：{
	   		province
	   		school
	   		letter	
	   		}
	   }	
	 */
	var dorequest = function(param,url,cb,ecb){
		var _param = {};
		_param['province'] = param['province']||'';
		_param['school'] = param['school']||'';
		_param['letter'] = param['letter']||'';
		_param['schooltype'] = param['schooltype']||'';
		_param['city'] = param['city']||'';
		_param['area'] = param['area']||'';
		App.doRequest(_param,url,cb,ecb,'get');
	};
	var _addEvent = Core.Events.addEvent;
	var _fireEvent = Core.Events.fireEvent;
	/*
	 * 返回的值为一串学校名称，中间用','分隔。 例如：北京大学,清华大学,北京交通大学
	 */
	var showSchool= function(domlist,spec){
		var pm =(spec.schooltype?spec.schooltype:'#')+
				'_'+(spec.province?spec.province:'#')+
				'_'+(spec.city?spec.city:'#')+
				'_'+(spec.area?spec.area:'#')+
				'_'+(spec.letter?spec.letter:'#');
		var success = function(data,json){
            spec.cacheschool[pm] = data;
            domlist.school.innerHTML = initSchoolString(spec.cacheschool[pm]);
			bindSchoolEvent(domlist,spec)
        }
//		if(!spec.cacheschool[pm.schooltype]){
//			spec.cacheschool[pm.schooltype] = {}
//		}
//		if(!spec.cacheschool[pm.schooltype][pm.province]){
//			spec.cacheschool[pm.schooltype][pm.province] = {}
//		}
		if(!spec.cacheschool[pm]){
			spec.cacheschool[pm] = '';
			dorequest(spec, spec.schUrl, success, function(){});
		}else{
			success(spec.cacheschool[pm])
		}
    };
	/*
	  选择省
	 */
	 var selectProvince= function(domlist,spec){
        spec['province'] = domlist.province.value||'';
//        spec['letter'] = spec.letter||'';
		spec['letter'] = '';
		changeCode(null,domlist);								//省选择后需要重置字母
        selectCity(domlist,spec);
    };
	/*
	  选择市
	 */
	var selectCity = function(domlist,spec){
		spec['city'] = domlist.city.value||'';
//        spec['letter'] = spec.letter||'';
		spec['letter'] = '';
		changeCode(null,domlist);	
		selectArea(domlist,spec)		
//		showSchool(domlist,spec);
//		dorequest(spec, spec['areaUrl'], function(data){
//			domlist.areaLabel.style.display = ''
//			domlist.area.style.display = ''
//			if (data && data.length > 0) {
//			
//			}
//		})
	}
	/*
	  选择地区
	 */
	var selectArea= function(domlist,spec){
		spec['area'] = domlist.area.value||'';
		spec['letter'] = '';
		changeCode(null,domlist);		
//        selectarea(spec);
		showSchool(domlist,spec);
	}
	/*
	  生成字母
	 */
	var initLetterString = function(){
        var buf = new Array();
        for(var i = 65,len = 91;i<len;i++){
            buf.push(code_template.replace(/#letter#/g,String.fromCharCode(i)));
        }
        return '<ul id="letterList">'+buf.join('')+'</ul>'
    };
	/*
	  生成学校
	  <li><a href="javascript:void(0);" title="#school#" truevalue="#schoolvalue#">#school#</a></li>
	 */
	var initSchoolString = function(array){
        var buf = new Array();
		if(array.length>0){
	        for(var i = 0,len = array.length;i<len;i++){
				for(var j in array[i]){
					buf.push(school_template.replace(/#school#/g,array[i][j]).replace(/#schoolvalue#/,j));	
				}
	        }
	        return '<ul>'+buf.join('')+'</ul>'
		}else{
			return school_emptytemplate;
		}
    };
	/*
	  绑定学校选择器中所有事件
	 */
	var bindEvent = function(domList,spec){
		var _p = domList.province;//省
		var _c = domList.city;//市
		var _a = domList.area;//区
		var _l = domList.letter.getElementsByTagName('A');
		var _close = domList.close;
		var _apply = domList.regApply;
		_addEvent(_p,(function(domlist,sp){
			return function(){
				selectProvince(domlist,sp)
			}
		})(domList,spec),'change')
		_addEvent(_c,(function(domlist,sp){
			return function(){
				selectCity(domlist,sp)
			}
		})(domList,spec),'change');
		_addEvent(_a,(function(domlist,sp){
			return function(){
				selectArea(domlist,sp)
			}
		})(domList,spec),'change');
		for(var i = 0,len = _l.length;i<len;i++){
            _addEvent(_l[i],(function(el,sp,ls){
                return function(){
                    selectCode(el,sp,ls)
                }
            })(_l[i],spec,domList),'click')
        };
		_addEvent(_close,function(){
			event_close(spec)
		},'click');
		_addEvent(_apply,function(){
			_fireEvent(_close,'click');	
			spec['reg-form-config'] = {
                zIndex: 1000,
                width: 440
			};
//			spec['province'] = proxy.province;
			App.regApplictaion(spec)
		},'click');
	};
	/*
	  
	 */
	var bindSchoolEvent = function(domList,spec){
		var _p = domList.school.getElementsByTagName('A');
        for(var i = 0,len = _p.length;i<len;i++){
            _addEvent(_p[i],(function(el,sp){
                return function(){
                    selectSchool(el,sp);
                }
            })(_p[i],spec),'click')
        };
	};
	
	var changeCode = function(el,domlist){
		var els = domlist.letter.getElementsByTagName('A');
		for (var i = 0, len = els.length; i < len; i++) {
			els[i].style.cssText = '';
		}
        el&&(el.style.background = 'rgb(204,190,190)');
	}
   
    var selectCode= function(el,spec,domlist){
		changeCode(el,domlist)
        spec['letter'] = el?el.innerHTML:'';
        spec['province'] = spec.province||'';
        showSchool(domlist,spec)
    };
    var selectSchool= function(el,spec){
        spec.school = el.innerHTML||'';
		spec.school_id = el.getAttribute('truevalue');
        var afterSelect = spec['afterSelect']||function(){};
        spec.dialog.close(); 
		afterSelect(spec);
    };  
	var event_close = function(spec){
		if (spec.dialog) {
			spec.dialog.close();
		}
	};
	
		/*
		 * 
		 * @param {Object} spec :{
		 *    province:省市
		 * }
		 * 
		 */
	proxy.schoolSelector = function(spec){			
			var data,that={};
			spec.dialog = new proxy.Dialog.BasicDialog($CLTMSG['CC5102'], template, spec['form-config']);
//			$E('dom_province').innerHTML = initProvString();
			data = {
				'domList': {
					'province': $E('dom_province'),
					'city': $E('dom_city'),
					'area': $E('dom_area'),
					'areaLabel': $E('txt_area'),
					'letter':$E('dom_letter'),
					'close':$E('sch_close'),
					'regApply':$E('add_application'),
					'school':$E('dom_schoolList')
//					'txt_city':$E('txt_city')
				}
			} 
			spec.cacheschool = {},spec.cachearea = {};
			/*
			  大学
			 */
			if (spec.schooltype == 1) {
//				data.domList.txt_city.style.display='none'
				data.domList.city.style.display='none'
				var provinces = $CLTMSG['CX0114'].split(',');
				var provcodes = "34,11,50,35,62,44,45,52,46,13,23,41,42,43,15,32,36,22,21,64,63,14,37,31,51,12,54,65,53,33,61,71,81,82,400,100".split(',');
				var provops = data.domList.province.options;
				for (var i = 0, len = provcodes.length; i < len; i++) {
                    provops[provops.length] = new Option(provinces[i], provcodes[i]);
                }
                data.domList.province.value = spec['province'];
				
			}
			else {
				if (spec.schooltype == 5) {
					new proxy.ProvinceAndCity(data.domList.province, data.domList.city, spec['province'] || '0', spec['city'] || '0',null,'0','',false,{province:true,city:true,area:false});
				}
				else {
					new proxy.ProvinceAndCity(data.domList.province, data.domList.city, spec['province'] || '0', spec['city'] || '0', data.domList.area, spec['area'] || '0', 'areaDisp', true,{province:true,city:true,area:false});
				}
			}
			data.domList.letter.innerHTML = initLetterString();
			bindEvent(data.domList,spec);
			selectProvince(data.domList,spec);
//			showSchool(spec);
//			App.autoComplate({
//		        'input' : $E('search_school'),
//		        'ok'    : function(value,text){
//		            $E('search_school').value = text;
//		        },
//		        'light' : function(el){
//		            el.className = 'bg';
//		        },
//		        'dark'  : function(el){
//		            el.className = '';
//		        },
//		        'timer' : 2,
//		        'style' : 'width:256px;position:absolute;z-index:1001',
//		        'class' : 'co_sl_2',
//		        'type'  : 'ajax',
//		        'data'  : '/person/relateschool.php'
//		    });
			that.dialog=spec.dialog;
			return that;

	};

})(App);

(function(proxy){
	var _addEvent = Core.Events.addEvent;
    var _fireEvent = Core.Events.fireEvent;
	var regTemplate = '<div class="schSearchLayer">\
               <div class="dlLayer2">\
               <p class="p1">'+$CLTMSG['CC5805']+'</p>\
               <p class="p2">'+$CLTMSG['CC5806']+'</p>\
               <div class="p3">\
               <table>\
                  <tbody><tr>\
                    <th><span>'+$CLTMSG['CC5807']+'</span></th>\
                    <td><p id="red_applicationProvCityArea" style="float:right;display:none" class="errorTs error_color">'+$CLTMSG['CC5826']+'</p><select id="school_reg_province" style="width:60px"></select><select style="width:70px" id="school_reg_city"></select><select id="school_reg_area" name = "areaDisp" style="display:none;width:70px"></select></td>\
                  </tr>\
                  <tr>\
                    <th><span>'+$CLTMSG['CC5808']+'</span></th>\
                    <td><input id="applicationSch_txt" type="text" style="width: 145px; float: left; margin-right: 5px;" class="txt" value="'+$CLTMSG['CC5809']+'"><p id="red_applicationSch" style="float: left;display:none" class="errorTs error_color">'+$CLTMSG['CC5809']+'</p></td>\
                  </tr>\
                </tbody></table>\
                </div>\
                </div>\
                <div class="MIB_btn"><a href="javascript:void(0);" id="btn_applicationSch" class="btn_normal"><em>'+$CLTMSG['CC5810']+'</em></a></div>\
               </div>';
	var OKTemplate = '<div class="schSearchLayer">\
               <dl class="dlLayer1">\
                <dt><img align="absmiddle" class="PY_ib PY_ib_3" src="http://timg.sjs.sinajs.cn/miniblog2style/images/common/PY_ib.gif" alt="" title=""><strong class="h2_r">'+$CLTMSG['CC5811']+'</strong></dt>\
                <dd class="dd1">'+$CLTMSG['CC5812']+'</dd>\
                <dd class="dd2">'+$CLTMSG['CC5813']+'</dd>\
                <dd class="dd3">'+$CLTMSG['CC5814']+'</dd>\
                </dl>\
                <div class="MIB_btn"><a href="javascript:void(0);" id="btn_ApplictaionOK" class="btn_normal"><em>'+$CLTMSG['CD0018']+'</em></a></div>\
               </div>';
    var init_provincecity = function(domList,spec){			
			/*
			  大学
			 */
			if (spec.schooltype == 1) {
				domList.city.style.display='none'
				var provinces = $CLTMSG['CX0114'].split(',');
				var provcodes = "34,11,50,35,62,44,45,52,46,13,23,41,42,43,15,32,36,22,21,64,63,14,37,31,51,12,54,65,53,33,61,71,81,82,400,100".split(',');
				var provops = domList.province.options;
				for (var i = 0, len = provcodes.length; i < len; i++) {
                    provops[provops.length] = new Option(provinces[i], provcodes[i]);
                }
                domList.province.value = spec['province'];
				
			}
			else {
				if (spec.schooltype == 5) {
					new proxy.ProvinceAndCity(domList.province, domList.city, spec['province'] || '0', spec['city'] || '0',null,'0','',false);
				}
				else {
					new proxy.ProvinceAndCity(domList.province, domList.city, spec['province'] || '0', spec['city'] || '0', domList.area, spec['area'] || '0', 'areaDisp', true);
				}
			}
			if(spec['name']){
				domList.applicationSch_txt.value = spec['name'];
			}
			//new App.ProvinceAndCity(domlist['province'],domlist['city'],domlist['province'].value||'0',domlist['city'].value||'0',domlist['area'],true)
	}
	var bindEvent = function(domlist,spec){
		var checkProvCityArea = function(value){
			var err = {
				province:'0',
				city:'1000',
				area:'1000'	
			}
			for(var k in err){
				if (value.hasOwnProperty(k)) {
					if (err[k] == value[k] || value[k]=="0") {
						return false;
					}
				}
			}
			return true;
		}
		_addEvent(domlist['applicationSch_txt'],function(){
			domlist['red_applicationSch'].style.display='none';
			if(Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CC5809']){
				domlist['applicationSch_txt'].value = "";
			}
		},'focus');
		
		_addEvent(domlist['province'],function(){
			if (!checkProvCityArea({
				province: domlist['province'].value
			})) {
				domlist['red_applicationProvCityArea'].style.display=''
			}else{
				domlist['red_applicationProvCityArea'].style.display='none'
			}
//			if(Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CC5809']){
//				domlist['applicationSch_txt'].value = "";
//			}
		},'change');
		
		_addEvent(domlist['city'],function(){
			if (!checkProvCityArea({
				city: domlist['city'].value
			})) {
				domlist['red_applicationProvCityArea'].style.display=''
			}else{
				domlist['red_applicationProvCityArea'].style.display='none'
			}
//			if(Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CC5809']){
//				domlist['applicationSch_txt'].value = "";
//			}
		},'change');
		_addEvent(domlist['area'],function(){
			if (!checkProvCityArea({
				area: domlist['area'].value
			})) {
				domlist['red_applicationProvCityArea'].style.display=''
			}else{
				domlist['red_applicationProvCityArea'].style.display='none'
			}
//			if(Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CC5809']){
//				domlist['applicationSch_txt'].value = "";
//			}
		},'change');
		_addEvent(domlist['applicationSch_txt'],function(){
            if(Core.String.trim(domlist['applicationSch_txt'].value)===""){
				domlist['red_applicationSch'].innerHTML = $CLTMSG['CY0147'];
				domlist['red_applicationSch'].style.display='';
				domlist['applicationSch_txt'].value = $CLTMSG['CY0147']
				return false;
            }
			
			//数字
			if(/\d/.test(domlist['applicationSch_txt'].value)){
				domlist['red_applicationSch'].innerHTML = $SYSMSG['M01165'];
				domlist['red_applicationSch'].style.display='';
				return false;
            }
			domlist['red_applicationSch'].innerHTML = '';
			domlist['red_applicationSch'].style.display='none';
        },'blur');
		_addEvent(domlist['btn_applicationSch'],function(){
//		   if(Core.String.trim(domlist['applicationSch_txt'].value)===''||Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CC5809']){
//		   		domlist['applicationSch_txt'].focus();
		   if(Core.String.trim(domlist['applicationSch_txt'].value)===''||Core.String.trim(domlist['applicationSch_txt'].value)===$CLTMSG['CY0147']){
				domlist['red_applicationSch'].innerHTML = $CLTMSG['CY0147'];
				domlist['red_applicationSch'].style.display='';
				return false;
		   }
		   if(/\d/.test(domlist['applicationSch_txt'].value)){
				domlist['red_applicationSch'].innerHTML = $SYSMSG['M01165'];
				domlist['red_applicationSch'].style.display='';
				return false;
            }
           var school = domlist['applicationSch_txt'].value;
		   var prov  = domlist['province'].value;
		   var city = domlist['city'].value;
		   var area = domlist['area'].value;
		   
		   spec['school'] = school;
		   spec['province'] = prov;
		   spec['city'] = city;
		   spec['area'] = area;
		   if(!checkProvCityArea(spec)){
		   		domlist['red_applicationProvCityArea'].style.display=''
				return false;
		   }
		   spec['OK-form-config'] = {
                zIndex: 1000,
                width: 440
           };
		   proxy.regDialog.close();
		   
		   proxy.OKApplictaion(spec)
        },'click');
	};
	var bindOKEvent = function(spec){
		_addEvent($E('btn_ApplictaionOK'),function(){
            proxy.OKDialog.close();
			var afterApply = spec['afterApply']||function(){};
	        afterApply(spec);
	    },'click');
	};
	proxy.regApplictaion = function(spec){
			var data;
			proxy.regDialog = new App.Dialog.BasicDialog($CLTMSG['CC5810'], regTemplate, spec['reg-form-config']);
			data = {
				'domList': {
					'province': $E('school_reg_province'),
					'city': $E('school_reg_city'),
					'area': $E('school_reg_area'),
					'areaLabel': $E('txt_area'),
					'applicationSch_txt':$E('applicationSch_txt'),
					'btn_applicationSch':$E('btn_applicationSch'),
					'btn_ApplictaionOK':$E('btn_ApplictaionOK'),
					'red_applicationSch':$E('red_applicationSch'),
					'red_applicationProvCityArea':$E('red_applicationProvCityArea')
				}
			} 
			bindEvent(data.domList,spec);
			init_provincecity(data.domList, spec);
//			App.autoComplate({
//				'input': $E('applicationSch_txt'),
//				'ok': function(value, text){
//					$E('applicationSch_txt').value = text;
//				},
//				'light': function(el){
//					el.className = 'bg';
//				},
//				'dark': function(el){
//					el.className = '';
//				},
//				'timer': 2,
//				'style': 'width:200px;position:absolute;z-index:1001',
//				'class': 'co_sl_2',
//				'type': 'ajax',
//				'data': '/person/relateschool.php'
//			});
			Utils.Sinput.limitMaxLen($E('applicationSch_txt'), 50);
	};
	proxy.OKApplictaion = function(spec){
//		App.doRequest({
//			'province': spec['province'],
//			'name': spec['school']
//		},'/person/aj_addschool.php',
//		function(){
			proxy.OKDialog = new App.Dialog.BasicDialog($CLTMSG['CC5815'], OKTemplate, spec['OK-form-config']);
			bindOKEvent(spec);
//		},function(json){json.code?App.alert(json.code):App.alert({code:'M00004'})})
    };
})(App);
