/**
 * @author chibin
 * 内容日期筛选
 */
$import("diy/content_searchDialog.js");
$import("diy/querytojson.js");
$registJob('content_filter', function(){
    _addevt = Core.Events.addEvent;
    _removeevt = Core.Events.removeEvent;
    _stopevt = Core.Events.stopEvent;
    _getTarget = Core.Events.getEventTarget;
	var param = App.queryToJson(window.location.search.slice(1));
	var spec = (function(){
		switch (scope.$pageid) {
            case 'mymblog':
                return {
                    txt: $E('filter_key_input'),
                    hidden: true,
                    form_action:'/mymblog.php',
                    inputText: param['filter_search']?decodeURIComponent(param['filter_search']):$CLTMSG['CC6005'],
					defaultText:$CLTMSG['CC6005'],
					defaultStarttime:$CLTMSG['CC6001'],
                    title: $CLTMSG['CC6005'],
                    starttime: param['starttime']?decodeURIComponent(param['starttime']):'',
                    endtime: param['endtime']?param['endtime']:'',
					extendHTML : '<input type="hidden" value="0" dd="adv_search" name="filter_adv_search" /><input type="hidden" value="'+(param['page']?param['page']:'1')+'" name="page" />',
                    closeFun: function(){
                        try {
                            _stopevt();
                            _removeevt(document.body, close, 'click');
                        } 
                        catch (e) {
                        }
                    },
					searchFun: function(spec){
						if(spec){
							if(!(spec.dialog.domList.starttime.value==$CLTMSG['CC6001'] && spec.dialog.domList.endtime.value == filter.get("nowtime"))){
								spec.dialog.domList.adv_search.value="1";	
							}
						}
					}
                }
                break;
            case 'profile':
                return {
                    txt: $E('filter_key_input'),
                    hidden: true,
                    form_action: '/profile.php' ,
                    inputText: param['filter_search']?decodeURIComponent(param['filter_search']):$CLTMSG['CC6004'].replace(/#sex#/,scope.sex),
					defaultText:$CLTMSG['CC6004'].replace(/#sex#/,scope.sex),
					defaultStarttime:$CLTMSG['CC6001'],
                    title: $CLTMSG['CC6004'].replace(/#sex#/,scope.sex),
                    starttime:param['starttime']?decodeURIComponent(param['starttime']):'',
                    endtime: param['endtime']?param['endtime']:'',
					extendHTML : '<input type="hidden" value="0" dd="adv_search" name="filter_adv_search" /><input type="hidden" value="'+(scope.$oid||scope.$uid)+'" name="uid"/><input type="hidden" value="'+(param['page']?param['page']:'1')+'" name="page"/>',
                    closeFun: function(){
                        try {
                            _stopevt();
                            _removeevt(document.body, close, 'click');
                        } 
                        catch (e) {
                        }
                    },
					searchFun: function(spec){
						if(spec){
							if(!(spec.dialog.domList.starttime.value==$CLTMSG['CC6001'] && spec.dialog.domList.endtime.value == filter.get("nowtime"))){
								spec.dialog.domList.adv_search.value="1";	
							}
						}
					}
                }
                break;
        }
    })();
	/*	参数说明
	  	txt: 鼠标点击的输入框
	  	hidden：默认展开时为true
	  	form-action 搜索层表单提交的URL
	  	inputText: 搜索层中打开后显示的默认文字
	  	defaultText：搜索层中打开的focus和blur的显示隐藏的文字
	  	defaultStarttime:搜索层中默认的起始时间文案
	  	title:标题
	  	starttime:起始时间起
	  	endtime：起始时间止
	  	extendHTML:扩展HTML，用于提交表单中带有的HIDDEN的参数
	 	closeFun：关闭的时候需要回调的方法
	 	searchFun:表单提交之前执行的方法
	 	——————————————————————————————————————————————————————————
	 	App.content_filter暴露了四个方法
	 	1、init 用于初始化层
	 	2、show 用于显示层
	 	3、close 用于关闭层
	 	4、get  用于扩展获取数据
	 */
    var filter = new App.content_filter(spec);
    filter.init();
    var close = function(){
        var tag = _getTarget();
        while (tag && tag != document.body) {
            if (tag == filter.get('container') || tag == $E('filter_key_input')) {
                return true;
            }
            tag = tag.parentNode;
        }
        filter.close();
        return false;
    };
    _addevt($E('filter_key_input'), function(){
        _addevt(document.body, close, 'click');
        filter.show({inputText:$E('filter_key_input').value});
        _stopevt();
        return false;
    }, 'focus');
});
