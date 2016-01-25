/**
 * @author xs| zhenhua1@staff.sina.com.cn
 *
 * 模拟表单提交，给表单中input元素添加回车提交功能(调用指定函数)
 * -- 因为现在很多表单都是Ajax提交，在input中回车没反应，故添加之。
 * 
 * sample:
		// 回车提交 (如果要给某个特定的input调用不同的函数则为其添加act属性即可实现)
		App.enterSubmit({
			parent : 'divForm',
			action : function(){ alert("enter form!"); }
		});	
 */
$import("sina/sina.js");
$import("sina/core/class/extend.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/app.js");



/**
 * 给表单元素添加回车提交
 */
App.enterSubmit = function(options){

	// 参数扩展
	options = Core.Class.extend({ parent: document},options);
	
	// 父容器
	var _p = $E(options.parent);
	
	// 检测是否按下Enter
	var _checkEnter = function(){
		var _e = Core.Events.getEvent();
		var _k = _e.keyCode;
		var _act = this.getAttribute('act') || options.action || null;
		if(_k === 13 && _act){
			//	执行指定函数/方法
			try {
				if (typeof _act === 'string') {
					eval('('+_act+')();');
				}else if(typeof _act === 'function'){
					_act();
				}
				
			}catch(e){
			}
		}
	};
	
	// 给input对象绑定事件 
	if(_p){
		var els = _p.getElementsByTagName('input');
		for( var i = 0, l = els.length; i < l; i ++ ){
			var cur = els[i];
			var _t = cur.getAttribute('type').toLowerCase();
			if(_t === 'text' || _t === 'password' || _t === 'checkbox'){
				if(cur.getAttribute('passenter') === '1'){
					continue;
				}
				Core.Events.addEvent(cur, _checkEnter.bind2(cur), 'keydown');
			}
		}
		
	}

};