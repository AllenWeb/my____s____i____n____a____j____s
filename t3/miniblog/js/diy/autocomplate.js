/*
 *autocomplate Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import('sina/core/string/trim.js');
$import("sina/utils/io/ajax.js");

(function(proxy){
	$C = function(tagName){
		return document.createElement(tagName);
	}
	var adEvent	= Core.Events.addEvent;
	var spEvent	= Core.Events.stopEvent;
	var rmEvent	= Core.Events.removeEvent;
	var position= Core.Dom.getXY;
	
	/*
	 * spec.text	用于页面的innerHTML
#	 * spec.value	本身对象保留的值
	 * spec.ele		对应的dom对象
	 * spec.focus	鼠标划过时执行的函数（参数为对象本身）
	 * spec.blur	鼠标划出时执行的函数（参数为对象本身）
	 * spec.ok		鼠标点击时执行的函数（参数为对象本身）
	 * 
	 * that.set		可以设置{text,value,ele,focus,blur,ok,html}
	 * that.get		可以得到{text,value,ele,focus,blur,ok,html}
	 */
	var makeItem = function(spec){
		if(spec === undefined){
			throw 'the dropDown item need parameters';
		}
		spec.text	= spec.text	|| spec.value;
		spec.ele	= spec.ele	|| $C('LI');
		spec.focus	= spec.focus|| function(){};
		spec.blur	= spec.blur	|| function(){};
		spec.ok		= spec.ok	|| function(){};
		spec.tnode	= document.createTextNode('');
		
		spec.ele.appendChild(spec.tnode);
		spec.ele.setAttribute("unselectable","on");
		if(spec.itemStyle){
			spec.ele.style.cssText = spec.itemStyle;
		}
		adEvent(spec.ele,function(){spec.focus(that);},'mouseover');
		adEvent(spec.ele,function(){spec.blur(that);},'mouseout');
		adEvent(spec.ele,function(){spEvent();spec.ok(that);},'click');
		adEvent(spec.ele,spEvent,'mousedown');
		
		var that = {};		
		that.set = function(key,value){
			if ((key == 'focus' || key == 'ok') && typeof value != 'function'){
				throw 'dropDown item need function as parameters'
			}
			spec[key] = value;
			if (key == 'text'){
				//spec.tnode.nodeValue = value;
				spec.ele.innerHTML =value;
			}
			if (key == 'HTML'){
				spec.ele.innerHTML =value;
			}
			return that;
		};
		that.get = function(key){
			return spec[key]
		}
		return that;
	};
	/*
	 * spec.light
	 * spec.dark
	 * spec.select
	 * spec.hotKey
	 * spec.isempty
	 
	 * that.show
	 * that.hidd
	 * that.dark
	 * that.light
	 * that.data
	 * that.pushData
	 * that.get
	 * that.set
	 */
	var dropDown = function(spec){
		var that = {};
		if(spec === undefined){
			spec = {};
		}
		spec.items = [];
		spec.count = 0;
		spec.current = -1;
		spec.key = {
			'ENTER'	: 13,
			'ESC'	: 27,
			'UP'	: 38,
			'DOWN'	: 40,
			'LEFT'	: 37,
			'RIGHT'	: 39,
			'BACK'	: 8,
			'TABLE'	: 9
		};
		spec.box = $C('DIV');
		spec.shell = $C('UL');
		spec.showing = false;
		spec.box.appendChild(spec.shell);
		document.body.appendChild(spec.box);
		
		var light	= function(item){
			item = item || spec.items[spec.current];
			spec.light(item.get('ele'));
		};
		var dark	= function(item){
			item = item || spec.items[spec.current];
			if(item){
				spec.dark(item.get('ele'));
			}
		};
		
		spec.newItem = function(){
			var item = makeItem({
				'ok'	: spec.select,
				'focus'	: function(item){
					if(spec.items[spec.current]){
						dark();
					}
					spec.current = item.index;
					light();
				},
				'itemStyle': spec.itemStyle
			});
			spec.shell.appendChild(item.get('ele'));
			return item;
		};
		spec.getItem = function(k){
			if(!spec.items[k]){
				spec.items[k] = spec.newItem();
				spec.items[k].index = k;
			}
			return spec.items[k];
		};
		
		spec.up		= function(){
			if(spec.current >= spec.count || spec.current <= 0){
				dark(spec.items[0]);
				spec.current = spec.count - 1;
			}else{
				dark();
				spec.current -= 1;
			}
			light();
		};
		
		spec.down	= function(){
			if(spec.current >= spec.count - 1 || spec.current < 0){
				dark(spec.items[spec.count - 1]);
				spec.current = 0;
			}else{
				dark();
				spec.current += 1;
			}
			light();
		};
		
		spec.open	= function(){
			spec.box.style.display = '';
			adEvent(document.documentElement,spec.hotKey,'keydown');
			spec.showing = true;
		};
		
		spec.close	= function(){
			spec.box.style.display = 'none';
			if($E("_iframe4select_")){
				$E("_iframe4select_").style.display = 'none';
			}
			rmEvent(document.documentElement,spec.hotKey,'keydown');
			spec.showing = false;
		};
		
		spec.hotKey = function(e){
			var ev = window.event || e;
			var code = ev.keyCode;
			if(code == spec.key['UP']){
				spec.up();
				spEvent();
				return false;
			}else if(code == spec.key['DOWN']){
				spec.down();
				spEvent();
				return false;
			}else if(code == spec.key['ESC']){
				spec.close();
				spEvent();
				return false;
			}			
		}
		
		that.show	= function(el){
			spec.open();
			return that;
		}
		
		that.hidd	= function(el){
			spec.close();
			if(spec.current !== -1){
				dark();
			}
			spec.current = -1;
			return that;
		}
		
		that.light	= function(index){
			light(spec.items[index]);
			return that;
		};
		
		that.dark	= function(index){
			dark(spec.items[index]);
			return that;
		};
		
		that.data = function(param){
			for(var i = 0, len = param.length; i < len; i += 1){
				spec.getItem(i).
					set('text',param[i]['text']).
					set('value',param[i]['value']).
					get('ele').style.display = '';
			}
			for(var i = param.length, len = spec.items.length; i < len; i += 1){
				spec.getItem(i).get('ele').style.display = 'none';
			}
			spec.count = param.length;
			dark();
			spec.current = -1;
			return that;
		};
		
		that.pushData = function(param){
			for(var i = 0, len = param.length; i< len; i += 1){
				spec.getItem(spec.count + i).
					set('text',param[i]['text']).
					set('value',param[i]['value']);
			}
			spec.count += param.length;
			return that;
		};
		
		that.set = function(key,value){
			if(key === 'position'){
				spec.box.style.left	= value[0] + 'px';
				spec.box.style.top	= value[1] + 'px';
			}
			return that;
		};
		
		that.get = function(key){
			if(key === 'current'){
				return spec.items[spec.current];
			}
			if(key === 'index'){
				return spec.current;
			}
			return spec[key];
		}
		return that;
	};
	
	/**
		spec.style	: 样式。
		spec.className	: class。
		spec.info	: 内容。
		
		that.show	: 显示
		that.hidd	: 隐藏
		that.set	: 设置属性项{data}
		that.get	: 设置属性项{data}
	 */
	var infoTips = function(spec){
		var that = {};
		spec.box = document.createElement('DIV');
		spec.box.innerHTML = spec.info;
		if(spec.style){
			spec.box.style.cssText = spec.style;
		}
		if(spec.className){
			spec.box.className = spec.className;
		}
		spec.box.style.position = 'absolute';
		spec.box.style.display = 'none';
		document.body.appendChild(spec.box);
		that.show = function(){
			spec.box.style.display = '';
		};
		that.hidd = function(){
			spec.box.style.display = 'none';
		};
		that.set = function(key,value){
			if(key === 'position'){
				spec.box.style.left	= value[0] + 'px';
				spec.box.style.top	= value[1] + 'px';
			}
			return that;
		};
		that.get = function(key){
			return spec[key];
		};
		return that;
	};
	
	/*
		spec.type	: 数据源的方式。
		spec.data	: 数据源。
		spec.search	: 搜索用的方法。
		
		that.result	: 返回搜索结果的函数
		that.set	: 设置属性项{data}
	*/
	var searchInfo = function(spec){
		var that = {};
		var defaultSearch = function(key,cb){
			if(spec.data.length === 0 || !key){
				setTimeout(function(){cb([])},0);
			}else{
				var res = [];
				for(var i = 0, len = spec.data.length; i < len; i += 1){
					if(spec.data[i].value.indexOf(key) != -1){
						res[res.length] = spec.data[i];
					}
				}
				setTimeout(function(){cb(res)},0);
			}
		};
		ajax	= function(key,cb){
			Utils.Io.Ajax.request(spec.data,{
				'GET' : {'key':key},
				'onComplete' : function(json){
					if (json.code === 'A00006'){
						//add by chibin 增加返回结果的扩展
						if(typeof spec.search === 'function'){
							json.data = spec.search(json.data);
						}
						cb(json.data);
					}
				},
				'returnType' : 'json'
			});
		};
		jsonp	= function(){};
		if(spec.type === 'ajax'){
			defaultSearch = ajax;
		}else if(spec.type === 'jsonp'){
			defaultSearch = jsonp;
		}else{
			if(typeof spec.search === 'function'){
				defaultSearch = spec.search;
			}
		}
		
		that.result = function(key,cb){
			defaultSearch(key,cb);
		};
		
		that.set = function(key,value){
			spec[key] = value;
			return that;
		};
		return that;
	};
	
	
	/*
#		spec.input	: 操作的元素。
		spec.ok		: 选择后的操作。
		spec.timer	: 延时的时间。
		spec.style	: 修改样式的方法。
		spec.type	: 数据源的方式。
		spec.data	: 数据源。
		spec.light	: 点亮某一项。
		spec.dark	: 变暗某一项。
		spec.itemStyle: 每个元素的样式。
		spec.emptyInfo: 没有操作时的提示信息。
		spec.emptyStyle:信息提示的样式。
		spec.emptyClass:信息提示的class。
		spec.search	: 搜索函数。
		spec.formatKey : 搜索前对输入框内容的加工。
		spec.noBlur	: 选择后不移除焦点。
		that.get	: 的到一个属性。
		that.set	: 设置一个属性。
	*/
	proxy.autoComplate = function(spec){
		if(!spec.input){throw 'the autoComplate need an input as an parameter';}
		var timeHandle = null;
		var search	= searchInfo({
			'type'	: spec.type,
			'data'	: spec.data,
			'search': spec.search
		});
		var dropper	= dropDown({
			'select': function(item){
				spec.ok(item.get('value'),item.get('text'));
				spec.input.blur();
			},
			'itemStyle' : spec['itemStyle'],
			'light' : spec.light,
			'dark'	: spec.dark
		});
		if(spec['emptyInfo']){
			var infobox = infoTips({
				'info' : spec.emptyInfo,
				'style': spec.emptyStyle,
				'className': spec.emptyClass
			});
		}
		dropper.get('box').className = spec['class'];
		dropper.get('box').style.cssText = spec['style'];
		dropper.hidd();
		
		//为ie6做的挡select的东西。
		if ('v' == '\v') {
			var frame = $C('IFRAME');
			frame.id = "_iframe4select_"
			frame.style.zIndex = 50;
			frame.style.display = 'none';
			frame.style.position = 'absolute';
			document.body.appendChild(frame);
		}
		
		var cache = {};
		spec.formatKey = spec.formatKey || function(v){return v;};
		var getData = function(key,cb){
			key = spec.formatKey(key);
			if(!cache[key]){
				search.result(key,function(data){
					if(data.length === 0){
						if(key.indexOf(spec.emptkey) !== -1){
							spec.emptykey = key;
						}
					}
					cb(data);
					cache[key] = data;
				});
			}else{
				setTimeout(function(){cb(cache[key])},0);
			}
		};
		adEvent(spec.input,function(e){
			var ev = window.event || e;
			if(ev.keyCode === 13){
				if(dropper.get('current')){
					spec.ok(dropper.get('current').get('value'),dropper.get('current').get('text'));
					spEvent(ev);//目的是使TextArea中回车选中不换行
				}
				if(!spec.noBlur){
					spec.input.blur();
				}
			}
			
		},'keypress');
		
		var start	= function(){
			timeHandle = setInterval(loop,100*spec.timer);
			spec.searching = '';
			spec.emptykey  = '';
			//为提示做的小调整
			var dis	= position(spec.input);
			dis[1]	+= spec.input.offsetHeight;
			if(infobox){
				infobox.set('position',dis).show();
			}
		};
		
		var end	= function(){
			clearInterval(timeHandle);
			dropper.hidd();
			spec.searching = '';
			spec.emptykey  = '';
			if('v' == '\v'){
				frame.style.display = 'none';
			}
			if(infobox){
				infobox.hidd();
			}
		};
		
		var callback = function(data){
			dropper.data(data);
			if(data.length){
				if(!dropper.get('showing')){
					dropper.show();
				}
				if('v' == '\v'){
					frame.style.width = dropper.get('box').offsetWidth + 'px';
					frame.style.height = dropper.get('box').offsetHeight + 'px';
					var dis	= position(dropper.get('box'));
					frame.style.top = dis[1] + 'px';
					frame.style.left = dis[0] + 'px';
					frame.style.display = '';
				}
			}else{
				dropper.hidd();
				if('v' == '\v'){
					frame.style.display = 'none';
				}
			}
		};
		
		var loop	= function(){
			if(spec.input.value === spec.searching){
				return false;
			}
			if(spec.input.value.indexOf(spec.emptykey) !== -1 && spec.emptykey !== ''){
				return false;
			}
			spec.searching = spec.input.value;
			var dis	= position(spec.input);
			dis[1]	+= spec.input.offsetHeight;
			dropper.set('position',dis);
			if(spec.input.value === ''){
				setTimeout(function(){callback([])},0);
				if(infobox){
					infobox.set('position',dis).show();
				}
			}else{
				getData(spec.input.value, callback);
				if(infobox){
					infobox.hidd();
				}
			}
		};
		adEvent(spec.input,start,'focus');
		adEvent(spec.input,end,'blur');
		
		spec.searching	= '';
		spec.emptykey	= '';
		var that = {};
		that.get = function(key){
			if(key === 'index'){
				return dropper.get('index');
			}
			return spec[key];
		};
		that.set = function(key,value){
			if(key === 'data'){
				search.set('data',value);
				cache = {};
			}
		};
		that.end = function(){
			end();
			return that;
		};
		return that;
	};
})(App);
