$import("sina/core/dom/getXY.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/dom/contains.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("diy/mb_dialog.js");
$import("sina/utils/io/ajax.js");
/**
 * 页面底部通用语言选择
 * @param {Object} el
 */
scope.langList = function(el){
	scope.switchLanguage(el.value);
	/**	
	var pop = $E('langlist');	
	if(pop){
		document.body.appendChild(pop);
		Core.Events.addEvent(document.body,function(event){			
			var target = Core.Events.getEventTarget(event);
			if(!Core.Dom.contains(pop,target)){
				pop.style.display = 'none';
			}
		},'click');
		scope.langList = function(el){
			if(pop.style.display == 'none'){
				var position = Core.Dom.getXY(el);				
				pop.style.left = position[0] + ('v' == '\v' ? -2 : 0)+ 'px';
				pop.style.display = '';	
				pop.style.top = (position[1]- pop.offsetHeight) + 'px';
			}else{
				pop.style.display = 'none';			
			}
			Core.Events.stopEvent();
		};	
		scope.langList(el);
		return scope.langList;
	}
	*/
};

scope.langList1 = function(el){
	scope.switchLanguage(el.value);
}

/**
 * 选择微博语言
 * @param{String}lang
 * */
scope.switchLanguage = function(lang){
	var language = scope.$lang === "zh" ? "zh-cn" : scope.$lang;
	if(language === lang){
		return;
	}
	
	App.confirm($CLTMSG['CD0150'],{
		icon:4,
		width:360,
		ok:function(){
			Utils.Io.Ajax.request("/person/aj_select_lang.php",{
				"onComplete"  : function (oResult){
					if(oResult.code === "A00006"){
						window.location.reload(true);
					}
					if(oResult.code === "M00003"){
						return App.ModLogin(null,$CLTMSG["CD0058"]);
					}
				},
				"onException" : function(e){},
				"returnType"  : "json",
				"POST"        : {
					'uid':scope.$uid,
					'lang':lang
				}
			});
		},
		cancel:function(){
			$E('lang_select').value = language;
		}
	});
};