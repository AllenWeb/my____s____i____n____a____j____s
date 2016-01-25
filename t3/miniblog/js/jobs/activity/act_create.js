/**
 * @author wangliang3@staff.sina.com.cn
 */
//import API
$import("diy/dom.js");
$import("diy/dialog.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/sinput/sinput.js");
//ajax
$import("sina/utils/io/ajax.js");
//import comm function
$import("jobs/activity/validate.js");
$import("jobs/activity/widget.js");
$import("diy/TextareaUtils.js");
$import("diy/getTextAreaHeight.js");
$import("diy/imgURL.js");

$registJob('actCreate', function(){
    var events = Core.Events, cdom = Core.Dom;
    var config = {
        postUrl: '/event/aj_create.php'
    };
    var items = {
        'panel': $E('activity_create'),
        'title': $E('activity_title'),
        'class': $E('activity_class'),
        'img': $E('activity_img'),
		'imgname': $E('activity_img_file'),
        'imgbtn': $E('activity_img_btn'),
        'imgid': $E('activity_img_id'),
        'imgform': $E('activity_img_form'),
        'prov': $E('activity_prov'),
        'area': $E('activity_area'),
        'tprov': $E('activity_touch_prov'),
        'tcity': $E('activity_touch_city'),
        'summary': $E('activity_summary'),
        'pradio': $E('activity_price_radio'),
        'price': $E('activity_price'),
        'tarea': $E('activity_touch_area'),
        'tdetail': $E('activity_touch_detail'),
        'free': $E('activity_price_free'),
        'tel': $E('activity_touch_tel'),
        'apply': $E('activity_apply'),
        'cinfo': $E('activity_create_info'),
        'appinfo': $E('activity_apply_info'),
        'stime': $E('activity_stime_hide'),
        'stimer': $E('activity_time_start'),
        'stimerh': $E('activity_time_start_h'),
        'stimerm': $E('activity_time_start_m'),
        'etime': $E('activity_etime_hide'),
        'etimer': $E('activity_time_end'),
        'etimerh': $E('activity_time_end_h'),
        'etimerm': $E('activity_time_end_m'),
        'submit': $E('activity_submit'),
        'cancel': $E('activity_cancel')
    };
    var handler = {
        pageInit: function(){
            if (items['apply'].checked) {
                App.Dom.setStyle(items['appinfo'], 'display', '');
            }
            items['stime'].value = handler.bindTimeStr(items['stimer'], items['stimerh'], items['stimerm']);
            items['etime'].value = handler.bindTimeStr(items['etimer'], items['etimerh'], items['etimerm']);
        },
        checkTitle: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请输入200个字符以内的标题，保存后无法修改',
                empty: '请输入标题',
                err: ''
            };
            return App.Widget.normalInput(items['title'], msg, {
                event: event
            });
        },
        checkSelected: function(obj, msg, conf){
            var isOk = false;
            if (App.Validate.isSelected(obj)) {
                App.Widget.tipMsg(1, obj, '', conf);
                isOk = true;
            }
            else {
                App.Widget.tipMsg(0, obj, msg);
            }
            return isOk;
        },
        checkClassSelected: function(){
            return handler.checkSelected(items['class'], '请选择分类');
        },
        checkArea: function(prov){
            var isOk = false;
            if (App.Validate.isSelected(prov)) {
                isOk = true;
                App.Widget.tipMsg(1, prov, '');
            }
            else {
                App.Widget.tipMsg(0, prov, '请选择并填写详细地点');
            }
            return isOk;
        },
        checkAreaSelected: function(){
            var bl = handler.checkSelected(items['prov'], '', {
                istip: false
            });
            App.TextareaUtils.setCursor(items['area']);
            return bl;
        },
        checkTAreaSelected: function(){
            return handler.checkArea(items['tprov']);
        },
        checkActivityArea: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请选择并填写详细地点',
                empty: '请选择并填写详细地点'
            };
            var tbl = false;
            if (event) {
                tbl = App.Widget.normalInput(items['area'], msg, {
                    event: event
                }) &&
                handler.checkSelected(items['prov'], msg.tip, {
                    istip: false
                });
            }
            else {
                tbl = handler.checkSelected(items['prov'], msg.tip, {
                    istip: false
                }) &&
                App.Widget.normalInput(items['area'], msg, {
                    event: event
                });
            }
            return tbl;
        },
        checkTouchArea: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请输入地址，以便我们邮寄相关资料',
                empty: '请输入你的地址',
                err: ''
            };
            return App.Widget.normalInput(items['tarea'], msg, {
                event: event
            });
        },
        checkActivityVenue: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请输入2000个字符以内简介，保存后无法修改',
                empty: '请填写活动简介',
                err: ''
            };
            return App.Widget.normalInput(items['summary'], msg, {
                event: event,
                maxlen: 2000
            });
        },
        checkTouchDetail: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请介绍3个曾组织过的活动，最好附上关于活动的有效链接',
                empty: '请填写活动介绍',
                err: '请填写活动介绍'
            };
            return App.Widget.normalInput(items['tdetail'], msg, {
                event: event,
                maxlen: 2000
            });
        },
        checkPrice: function(){
            var event = events.getEvent().type;
            var obj = items['price'];
            var isOk = false;
            if (items['free'].checked) {
                return true;
            }
            else 
                if (event == 'focus') {
                    App.Widget.tipMsg(2, obj, '请确定活动费用', {
                        isnumber: true,
                        tip: false
                    });
                }
                else 
                    if (App.Validate.isEmpty(obj.value)) {
                        App.Widget.tipMsg(0, obj, '请确定活动费用', {
                            isnumber: true
                        });
                    }
                    else {
                        App.Widget.tipMsg(1, obj, '', {
                            isnumber: false
                        });
                        //						if (event.keyCode!=46 && event.keyCode!=45 && (event.keyCode<48 ||	 event.keyCode>57)) 
                        //						{
                        //							event.returnValue = false
                        //						}
                        isOk = true;
                    }
            return isOk;
        },
        imgUpload: function(){
            var filename = items['img'].value;
			
            if (!/\.(gif|jpg|png|jpeg)$/i.test(filename)) {
                App.alert($SYSMSG['M07004']);
                return false;
            }
            scope.addImgSuccess = function(cfg){
                if (cfg['ret'] == '1') {
                    items['imgid'].value = cfg['pid'];
                    $E('activity_pre_img').setAttribute('src', App.imgURL(cfg['pid'], 'thumbnail'));
                    $E('activity_pre_panel').style.display = ''
                }
                else {
                    App.alert('上传失败，请重新上传');
                }
            };
            items['imgform'].submit();
        },
        checkTouchTel: function(){
            var event = events.getEvent().type;
            var msg = {
                tip: '请输入电话，以便我们跟你联系',
                empty: '请输入你的电话',
                err: '请输入你的电话'
            };
            return App.Widget.normalInput(items['tel'], msg, {
                event: event
            });
        },
        clickFreeRadio: function(){
            App.Widget.removeTipMsg(items['free']);
            items['price'].disabled = true;
            items['price'].value = '';
            items['price'].style.cssText = 'background-color:transparent;';
        },
        clickPriceRadio: function(){
            var obj = items['price'];
            obj.disabled = false;
            App.TextareaUtils.setCursor(obj);
        },
        bindTimeStr: function(input, h, m){
            var dateStr = input.value + ' ' + h.options[h.selectedIndex].value + ':' + m.options[m.selectedIndex].value + ':00';
            return dateStr;
        },
        refreshHideTime: function(){
            items['stime'].value = handler.bindTimeStr(items['stimer'], items['stimerh'], items['stimerm']);
            items['etime'].value = handler.bindTimeStr(items['etimer'], items['etimerh'], items['etimerm']);
            handler.compareDate();
        },
        bindStartTime: function(){
            items['stimer'].readOnly = true;
            var compareTime = function(date){
                items['stimer'].value = date;
                handler.refreshHideTime();
                handler.compareDate();
                return true;
            };
            App.Widget.createTime(items['stimer'], compareTime);
        },
        bindEndTime: function(){
            items['etimer'].readOnly = true;
            var compareTime = function(date){
                items['etimer'].value = date;
                handler.refreshHideTime();
                handler.compareDate();
                return true;
            };
            App.Widget.createTime(items['etimer'], compareTime);
            
        },
        compareDate: function(){
            var sDate = items['stime'].value.replace(/-/g, '/'), eDate = items['etime'].value.replace(/-/g, '/');
            sDate = new Date(sDate);
            eDate = new Date(eDate);
            
            var isOk = sDate < eDate && eDate > (new Date());
            
            if (isOk) {
                App.Widget.tipMsg(1, items['stime'], '');
            }
            else {
                App.Widget.tipMsg(0, items['stime'], '请选择正确的活动时间');
            }
            return isOk;
        },
        clickApplyOption: function(){
            var obj = items['apply'], info = items['appinfo'];
            if (obj.checked) {
                App.Dom.setStyle(info, 'display', '');
            }
            else {
                App.Dom.setStyle(info, 'display', 'none');
            }
        },
        bulidPostPars: function(){
            var pars = {};
            pars = App.Widget.buildParsStr(items['cinfo'], pars);
            if (items['apply'].checked) {
                pars = App.Widget.buildParsStr(items['appinfo'], pars);
            }
            return pars;
        },
        checkTopArea: function(){
            return handler.checkSelected(items['prov'], '请选择并填写详细地点');
        },
        checkBotArea: function(){
            return handler.checkSelected(items['tprov'], '请选择并填写详细地点');
        },
        postValidate: function(){
            var funs = ['checkTitle', 'checkClassSelected', 'compareDate', 'checkTopArea', 'checkActivityArea', 'checkPrice', 'checkActivityVenue'];
            var funs1 = ['checkTouchTel', 'checkBotArea', 'checkTouchArea', 'checkTouchDetail'];
            var isOk = true;
            for (var i = 0, len = funs.length; i < len; i++) {
                isOk = handler[funs[i]]() && isOk;
            }
            if (items['apply'].checked) {
                for (var i = 0, len = funs1.length; i < len; i++) {
                    isOk = handler[funs1[i]]() && isOk;
                }
            }
            
            return isOk;
        },
        refreshTipScroll: function(){
            var errTip = App.Dom.getByClass('co_kc', 'div', items['panel'])[0];
            if (errTip) {
                document.documentElement.scrollTop = App.Dom.getXY(errTip).y - 100;
            }
        },
        submit: function(){
            events.stopEvent();
            var obj = events.getEventTarget();
            if (obj.tagName.toLowerCase() == 'em') {
                obj = obj.parentNode;
            }
            if (!handler.postValidate()) {
                handler.refreshTipScroll();
                return;
            }
						
            var pars = handler.bulidPostPars();
            Utils.Io.Ajax.request(config.postUrl, {
                'POST': pars,
                'onComplete': function(json){
                    if (json.code == 'A00006') {
						
						var filename = '';
						if(items['img'].value != ''){
							filename = items['img'].value.match(/[^\/|\\]*$/)[0];
							var imgName = filename.slice(0, -4);
				            if (imgName.length > 10) {
				                imgName = imgName.slice(0, 10) + '...'
				            }
							filename = imgName + filename.slice(-4);
						}
						
						url = filename == '' ? json.url : json.url + '&pname=' + filename;
                        window.location.replace(url);
                    }
                    else 
                        if (json.code == 'M05008') {
                            var check = {
                                'title': 'title',
                                'address': 'area',
                                'desc': 'summary'
                            };
                            var filter = json.filter;
                            for (var i = 0, len = filter.length; i < len; i++) {
                                App.Widget.tipMsg(0, items[check[filter[i]]], $SYSMSG[json.code]);
                            }
                            handler.refreshTipScroll();
                        }
                        else {
                            App.alert($SYSMSG[json.code]);
                        }
                },
                'onException': function(){
                    //callBack.error();
                },
                'returnType': 'json'
            });
            
			events.addEvent(obj, function(){
                events.stopEvent();
            });
            events.removeEvent(obj, handler.submit, 'click');
            
        },
        cancel: function(){
            events.stopEvent();
            window.history.back();
        }
    };
    
    
    //bind events
    events.addEvent(items['title'], handler.checkTitle, 'focus');
    events.addEvent(items['title'], handler.checkTitle, 'blur');
    
    events.addEvent(items['area'], handler.checkActivityArea, 'focus');
    events.addEvent(items['area'], handler.checkActivityArea, 'blur');
    
    events.addEvent(items['tarea'], handler.checkTouchArea, 'focus');
    events.addEvent(items['tarea'], handler.checkTouchArea, 'blur');
    
    events.addEvent(items['summary'], handler.checkActivityVenue, 'focus');
    events.addEvent(items['summary'], handler.checkActivityVenue, 'blur');
    
    events.addEvent(items['tdetail'], handler.checkTouchDetail, 'focus');
    events.addEvent(items['tdetail'], handler.checkTouchDetail, 'blur');
    
    events.addEvent(items['tel'], handler.checkTouchTel, 'focus');
    events.addEvent(items['tel'], handler.checkTouchTel, 'blur');
    
    events.addEvent(items['price'], handler.checkPrice, 'focus');
    events.addEvent(items['price'], handler.checkPrice, 'blur');
    //    events.addEvent(items['price'], handler.checkPrice, 'keypress');//解决ie6小数点问题
    events.addEvent(items['price'], App.Validate.limitInputNumber, 'keypress');
    
    
    events.addEvent(items['img'], handler.imgUpload, 'change');
    
    events.addEvent(items['class'], handler.checkClassSelected, 'change');
    events.addEvent(items['prov'], handler.checkAreaSelected, 'change');
    events.addEvent(items['tprov'], handler.checkTAreaSelected, 'change');
    //date refresh
    events.addEvent(items['stimerh'], handler.refreshHideTime, 'change');
    events.addEvent(items['stimerm'], handler.refreshHideTime, 'change');
    events.addEvent(items['etimerh'], handler.refreshHideTime, 'change');
    events.addEvent(items['etimerm'], handler.refreshHideTime, 'change');
    
    events.addEvent(items['free'], handler.clickFreeRadio);
    events.addEvent(items['pradio'], handler.clickPriceRadio);
    events.addEvent(items['apply'], handler.clickApplyOption);
    events.addEvent(items['stimer'], handler.bindStartTime);
    events.addEvent(items['etimer'], handler.bindEndTime);
    events.addEvent(items['submit'], handler.submit);
    events.addEvent(items['cancel'], handler.cancel);
    Utils.Sinput.limitMaxLen(items['title'], 200);
    Utils.Sinput.limitMaxLen(items['summary'], 2000);
    Utils.Sinput.limitMaxLen(items['area'], 80);
    App.autoHeightTextArea(items['summary']);
    //module init
    App.Widget.areaRelation(items['tprov'], items['tcity']);
    //page init
    handler.pageInit();
    
});
