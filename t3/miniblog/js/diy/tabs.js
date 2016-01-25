/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import('sina/core/events/addEvent.js');
$import('sina/core/events/fireEvent.js');
(function(proxy){
	/**
	 * 
	 * @param {Object} spec
	 * data : [
	 * 		{'tab':$E('tab1'),'panel':$E('panel1')},
	 * 		{'tab':$E('tab2'),'panel':$E('panel2')},
	 * 		...
	 * ],
	 * lightAction : function(item,index){},
	 * darkAction : function(){},
	 */
	proxy.tabs = function(spec){
		var that = {};
		spec.current = spec.current || 0;
		for(var i = 0, len = spec.data.length; i < len; i += 1){
			Core.Events.addEvent(spec.data[i].tab,(function(k){
				return function(){
					if(spec.current >= 0){
						spec.darkAction(spec.data[spec.current],k);
					}
					spec.current = k;
					spec.lightAction(spec.data[spec.current],k);
				}
			})(i),'click');
			
		}
		that.fire = function(index){
			Core.Events.fireEvent(spec.data[index]['tab'],'click');
		};
		return that;
	};
})(App);
