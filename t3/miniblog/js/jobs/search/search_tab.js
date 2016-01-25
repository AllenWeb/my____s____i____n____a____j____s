/**
 * @author dmfeng
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/jobs.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/array/foreach.js');
$import('sina/core/string/trim.js');
$import("diy/tabs.js");
$import("jobs/user_invite.js");
$import('jobs/request.js');
$import("jobs/search/new_search_head.js");
$import("diy/autocomplate.js");
$import("diy/enter.js");
$import("diy/provinceandcity.js");
(function(){
	var _each = Core.Array.foreach;
	var _addEvent = Core.Events.addEvent;
	var _trim = Core.String.trim;
	//var maxlen = 60;
    $registJob('search_tab_select', function(){        
        var list = [];
        _each($E('invite_user_tab').getElementsByTagName('li'), function(v, i){
            list.push({
                'tab': v
            })
        })
		//list.pop();
        var spec = {
            'data': list,
            lightAction: function(data, index){ //当前点击的tab
                Core.Events.stopEvent();
                data.tab.className = 'cur';
				getHTML( index )				
            },
            darkAction: function(data, index){ //上一个tab
                Core.Events.stopEvent();
                data.tab.className = '';
            }
        }
        App.tabs(spec);
		TabReady['hobby']();
    });
    function getHTML(type){
		App.doRequest({ 'module' : type + 1 }, '/invite/aj_module.php', function(data){
				if( data ){
					$E('invite_user_module').innerHTML =  data.html;
					setTimeout(function(){
						TabReady[typeProxy[type]]();
					},0)
				}
        },function(json){
		},'GET');
    }
	loadHTML = getHTML
 
	var typeProxy = ['hobby','school','work','msn','mail','location']
    var TabReady = {
		hobby : function(){
			initInput(['hobby_input']);
			_addEvent($E('hobby_btn'),function(){
				locationToSearch({
					s_tag : getValue('hobby_input')     
				},true)
			},'click');
			(function(){
			var spec = {};
			spec['input'] = $E('hobby_input')
            spec['ok'] = function(value, text){
                spec['input'].value = text;
                Core.Events.fireEvent($E('hobby_btn'), 'click');
            };
            spec['timer'] = spec['timer'] || 5;
            spec['style'] = spec['style'] || 'width:250px;position:absolute;z-Index:1200;';
            spec['light'] = spec['light'] ||
            function(el){
                el.className = 'cur';
            };
            spec['dark'] = spec['dark'] ||
            function(el){
                el.className = '';
            };
            spec['class'] = spec['class'] || 'layerMedia_menu';
            spec['type'] = spec['type'] || 'ajax';
            spec['data'] = spec['data'] || '/person/aj_tagchooser.php' + '?key=' + spec['input'].value;
            spec['itemStyle'] = 'overflow:hidden;height:20px';
            App.autoComplate(spec);
            })();
			
			
			App.enterSubmit({
                parent: $E('hobby_input').parentNode,
                action: function(){
                    Core.Events.fireEvent($E('hobby_btn'),'click');
                }
            });
		},
        msn: function(){ //_att_user
            //TODO 执行一个job
			initInput(['msn_user','msn_password']);
			App.enterSubmit({
                parent: $E('msn_password').parentNode,
                action: function(){
                    Core.Events.fireEvent($E('msn_invitebtn'),'click');
                }
            });
            var jobs = new Jobs();
            jobs.add('msn_invite'); //执行user_invite中的msn_invite;
            jobs.start();
        },
		mail: function(){
			var jobs = new Jobs();
            jobs.add('mail_invite'); //执行user_invite中的mail_invite;
            jobs.start();
		},
        work: function(){ //同事tab
           var dom = $E('work_name_ipt');
		   App.autoComplate({
				'input'	: dom,
				'ok'	: function(value,text){
					dom.value = text;
				},
				'light'	: function(el){
					el.className = 'bg';
				},
				'dark'	: function(el){
					el.className = '';
				},
				'timer'	: 2,
				'style'	: 'width:220px;position:absolute;z-index:200',
				'class'	: 'co_sl_2',
				'type'	: 'ajax',
				'data'	: '/person/relatecompany.php'
			});
			inputDefValue('work_user_ipt');
			initInput(['work_user_ipt','work_name_ipt']);
			//TODO 公司如何传
			_addEvent($E('work_btn'),function(){			
				Core.Events.stopEvent();
				var search = getValue('work_user_ipt','CF0109');
				var s_work = getValue('work_name_ipt');
				if(!search && !s_work){
					return false;
				}			
				
				locationToSearch({
					search : getValue('work_user_ipt','CF0109'),
					s_work : getValue('work_name_ipt'),
					nickname : 1
				//	realname : 1
				},true)
			},'click')
			App.enterSubmit({
                parent: $E('invite_user_module'),
                action: function(){
					setTimeout(function(){Core.Events.fireEvent($E('work_btn'),'click');},20)
                }
            });
			
        },
        school: function(){ //同学   OK
		   var dom = $E('school_name_ipt');
		   App.autoComplate({
				'input'	: dom,
				'ok'	: function(value,text){
					dom.value = text;
				},
				'light'	: function(el){
					el.className = 'bg';
				},
				'dark'	: function(el){
					el.className = '';
				},
				'timer'	: 2,
				'style'	: 'width:220px;position:absolute;z-index:200',
				'class'	: 'co_sl_2',
				'type'	: 'ajax',
				'data'	: '/person/relateschool.php'
			});
			inputDefValue('school_user_ipt');
			initInput(['school_name_ipt','school_user_ipt']);
			//TODO 学校如何传
			_addEvent($E('school_btn'),function(){
				/**
				 * haidong  组织默认提交
				 */
				Core.Events.stopEvent();
				var search = getValue('school_user_ipt','CF0109');
				var s_school=getValue('school_name_ipt');
				if(!s_school&&!search){
					return false;
				}

				locationToSearch({
					search : search,
					s_school : s_school,
					nickname : 1
				//	realname : 1
				},true)
			},'click')
			App.enterSubmit({
                parent: $E('invite_user_module'),
                action: function(){
                    setTimeout(function(){Core.Events.fireEvent($E('school_btn'),'click')},20);
                }
            });
        },
        realname: function(){
			inputDefValue('realname_name_ipt');
			initInput(['realname_name_ipt']);
						
            function gos(){
                locationToSearch({
					search :  getValue('realname_name_ipt','CF0109'),
					realname : 1
				}) //名字的参数
            }
            
            _addEvent($E('realname_save_btn'), function(){
                saveInfo('realname', gos)
            }, 'click')
            
            _addEvent($E('realname_btn'), function(){
                gos();
            }, 'click')
            
        },
		location: function(){
			inputDefValue('location_ipt');
			initInput(['location_ipt']);
			var prov = $E('location_province');
			var city = $E('location_city');
			new App.ProvinceAndCity(prov, city, (prov.getAttribute('truevalue') || prov.value), (city.getAttribute('truevalue') || city.value));
            function gos(){
                locationToSearch({
					search :  getValue('location_ipt','CF0109'),
					province : $E('location_province').value,
					city : $E('location_city').value
				}) //名字的参数
            }
            
            _addEvent($E('location_save_btn'), function(){
                gos();
            }, 'click')
            
            
        }
    };
    
    function saveInfo(type, cbFun){
        if (type == 'realname') {
            param = {
                'realname': getValue('realname','CF0109'),
                'pub_name': $E('pub_name_option').value
            }
			if (param.realname === '') {
				cbFun();
				return;
			}
		}else {
            param = {
                'Date_Year': $E('birthday_y').value,
                'birthday_m': $E('birthday_m').value,
                'birthday_d': $E('birthday_d').value
            }
        }
        function _err(json){
            //TODO 提示错误
        }
		
        App.doRequest(param, "/person/myinfo_post.php", function(json){
            if (json && json.code == 'A00006') {
                cbFun();
            }
        }, _err);
    };
    
    function locationToSearch(param,bh){
		setTimeout(function(){
			App.searchbycondition( '/search/user.php' , param ,bh);
		},0)
		
    }
	
	function initInput( list ){
		_each(list || [] , function(v,i){
			//Utils.Sinput.limitMaxLen($E( v ), maxlen);
			_addEvent( $E( v ) ,function(){
				$E( v ).style.color = "#333";
			},"focus");
			_addEvent( $E( v ) ,function(){
				$E( v ).style.color = "#999";
			},"blur");
		})
	}
	
	function inputDefValue( id ,value){
		var el    = $E( id );
		var value =  $E( id ).value || $CLTMSG['CF0109'];
		el.setAttribute("defalutvalue",value);
		
		_addEvent( $E( id ) ,function(){
				if ( $E( id ).value == value ) $E( id ).value = ''
			},"focus");
		_addEvent( $E( id ) ,function(){
				if ( $E( id ).value == '' ) $E( id ).value = value;
			},"blur");
	}
	
	function getValue( el , key){
		var val = _trim( $E( el ).value || '' )
		return (val == $CLTMSG[key] || !val) ? '' : encodeURIComponent( val );
	}
   
})();