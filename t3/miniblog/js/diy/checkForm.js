/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/string/trim.js");
$import('sina/core/events/addEvent.js');

(function(proxy){
	var _addEvent	= Core.Events.addEvent;
	var _trim		= Core.String.trim;
	proxy.checkForm	= function(UIfunction){
		var that = {};
		var list = {};
		that.add = function(key,affect,error,check,evType){
			list[key] = proxy.checkItem(key,affect,error,UIfunction,check,evType);
		};
		that.check = function(kList){
			var ret = true;
			if(kList){
				for(var i = 0, len = kList.length; i < len; i += 1){
					if(list[kList[i]]){
						if(!list[kList[i]].check()){
							list[kList[i]].changeUI(false);
							ret = false;
						}
					}
				}
			}else{
				for(var k in list){
					if(!list[k].check()){
						list[k].changeUI(false);
						ret = false;
					}
				}
			}
			return ret;
		};
		that.toggleError = function(keys,errType){
			for(var i = 0, len = keys.length; i < len; i += 1){
				if(list[keys[i]]){
					list[keys[i]].changeUI(errType);
					return true;
				}
			}
			return false;			
		}
		that.showError = function(keys){
			return this.toggleError(keys,false);
		};
		that.hideError = function(keys){
			this.toggleError(keys,true);
		};
		return that;
	};
	proxy.checkItem	= function(key,affect,error,UIfunction,check,evType){
		var that = {};
		if(evType === undefined){
			if(affect.type === 'text' || affect.type === 'password' || affect.tagName === 'TEXTAREA'){
				evType = 'blur';
			}else if(affect.tagName === 'SELECT'){
				evType = 'change';
			}else{
				evType = 'click';
			}
		}
		if(check === undefined){
			check = function(el){
				if(_trim(el.value) === ''){
					return false;
				}else{
					return true;
				}
			}
		}
		that.changeUI = function(noError){
			UIfunction(key,noError,affect,error);
		};
		that.check = function(){
			var noError = check(affect);
			UIfunction(key,noError,affect,error);
			return noError;
		};
		that.getAttr = function(){};
		if(affect.tagName !== 'SELECT' && affect.length){
			for(var i = 0, len = affect.length; i < len ; i += 1){
				_addEvent(affect[i],function(){that.check()},evType);
			}
		}else{
			_addEvent(affect,function(){that.check()},evType);
		}
		return that;
	};
})(App);
//example
//var checkUI = function(key,noError,affect,error){
//	if(error.key && error.key !== key){
//		return false;
//	}else{		
//		if(noError){
//			affect.className = '';
//			error.className = '';
//			error.innerHTML = $SYSMSG[key];
//			error.key = false;
//		}else{
//			affect.className = '';
//			error.className = '';
//			error.innerHTML = $SYSMSG[key];
//			error.key = key;
//		}
//	}
//};
//var checkManage = StkUtil.checkForm(checkUI);
//checkManage.add('M01104',$E('name'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('gend'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('prov'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('city'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('mail'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('qqnm'),$E('name_red'),function(){},'blur');
//checkManage.add('M01104',$E('qqnm'),$E('name_red'),function(){},'blur');