/**
 * @author Maze
 */
//import API
$import("diy/dom.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/string/byteLength.js");
//ajax
$import("sina/utils/io/ajax.js");
//widget
$import("diy/comm/storage.js");
$import("diy/widget/poplayer.js");
$import("diy/builder3.js");

$registJob('named_finishing', function(){
	var _date = new Date();
	
    var conf = {
		get_url: '/person/show_cleanbox.php',
        post_url: '/person/aj_updatenick.php',
		isShow: scope.rename||false,//外部种子
		uid: $CONFIG.$oid,
		stage_id:'named_finishing_'+$CONFIG.$oid+'_'+_date.getYear()+''+(_date.getMonth()+1)+''+_date.getDate()+'_named'
    };
	var stage = App.storage.get(conf.stage_id)||0;
    if(!conf.isShow || stage==1){
		return ;
	}
    //init pars
	var event = Core.Events, dom = App.Dom,popLayer = null;
	//
	var handler = {
		build: function(){
			var panel = new App.PopLayer('', {
	            index: 2000,
	            ismask: true,
	            width: '410px'
	        });
			
			return panel;
		},
		bind: function(html){
			var build = App.builder3(html, popLayer.root, {
                dd: 'id'
            });
			popLayer.items = build.domList;
			
			event.addEvent(popLayer.items['close'],handler.hide);
			event.addEvent(popLayer.items['btn_cancel'],handler.hide);
			event.addEvent(popLayer.items['btn_save'],handler.save);
			
		},
		hide: function(){
			event.stopEvent();
			popLayer.hide();
			App.storage.set(conf.stage_id, '1');
		},
		check: function(items){
			var _value = items['name'].value.replace(/^\s+|\s+$/g, '');
			if(/^\s*$/g.test(_value)){
				//请输入昵称
				items['tip_err'].innerHTML = $SYSMSG['MR0031'];
				return false;
			}			
			var _count = Core.String.byteLength(_value);
			if(_count<4){
				//请输入4个字母以上的昵称
				items['tip_err'].innerHTML = $SYSMSG['MR0032'];
				popLayer.items['tip_err'].style.display='';
				return false;
			}
			if(_count>20){
				//不能超过20个字母或10个汉字
				items['tip_err'].innerHTML = $SYSMSG['MR0033'];
				popLayer.items['tip_err'].style.display='';
				return false;
			}
			if(/^[+\-]?\d+(\.\d+)?$/.test(_value)){
				//昵称不能全是数字
				items['tip_err'].innerHTML = $SYSMSG['MR0035'];
				popLayer.items['tip_err'].style.display='';
				return false;
			}
			if(!(/^[0-9a-zA-Z\u4e00-\u9fa5_-]*$/.test(_value))){
				//支持中英文、数字、“_”或减号
				items['tip_err'].innerHTML = $SYSMSG['MR0037'];
				popLayer.items['tip_err'].style.display='';
				return false;
				
			}
			//没变化
			if(_value == items['name'].getAttribute('def')){
				//请按规则填写新昵称
				items['tip_err'].innerHTML = '请按规则填写新昵称';
				popLayer.items['tip_err'].style.display='';
				return false;
			}
			//TODO add dy check
			//昵称已被他人使用，改一下吧。   MR0036
			
			return true;
		},
		save: function(){
			event.stopEvent();
			if(handler.check(popLayer.items)){
				Utils.Io.Ajax.request(conf.post_url, {
                    'POST': {
						nick: popLayer.items['name'].value
					},
                    'onComplete': function(json){
                        if (json.code == 'A00006') {
							popLayer.hide();
							window.location.reload();
                        }
                        else {
							popLayer.items['tip_err'].style.display='';
                            popLayer.items['tip_err'].innerHTML = $SYSMSG[json.code];
                        }
                    },
                    'onException': function(){
                    },
                    'returnType': 'json'
                });
			}else{
				popLayer.items['tip_err'].style.display='';
			};
		}
	};
	if (!popLayer) {
        popLayer = handler.build();
		//popLayer.domList['input'].value
		Utils.Io.Ajax.request(conf.get_url, {
            'POST': '',
            'onComplete': function(json){
                if (json.code == 'A00006') {
                    handler.bind(json.data);
					popLayer.show();
                }
            },
            'onException': function(){
            },
            'returnType': 'json'
        });
    }else{
		popLayer.show();
	}
    
	
});
