/**
 * @author xinlin
 */
$import('sina/module/module.js');
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/fixEvent.js');
$import('sina/core/events/stopEvent.js');
$import('sina/core/dom/getLeft.js');
$import('sina/core/dom/getTop.js');
$import('sina/core/system/winSize.js');
$import('sina/core/system/getScrollPos.js');
$import('sina/utils/template.js');
/**
 * 下拉菜单浮动层，用来生成下拉菜单浮动层
 */
Module.FloatMenu = {
	_n:null,
	_init:null,
	_init_:function(){
		if(this._init) return;
		this._n = document.body.appendChild($C('div'));
		this._n.className = 'CP_oper';
		this._n.style['position'] = 'absolute';
		this._n.style['zIndex'] = '1000';
		this._n.id = 'Sina_Module_DrogDownList_Box';
		this._n.innerHTML = '<ul></ul>';
		Core.Events.addEvent(document,function(){
				var e = Core.Events.getEvent();
				if(e.button == 2)return ;
				Module.FloatMenu.hideItem();
		},'click');
		//Core.Events.addEvent(this._n,function(){Core.Events.stopEvent();},'click');
		this._init = true;
	},
	/**
	 * 初始化一个对象，使其带有浮动菜单
	 * @param {Object} tar
	 * @param {Object} data 
	 *					 data = [{label: , action: ?, href: ?}]
	 * @param {Object} pos  对其方式,有两个个选项，[R,B] ，如果R超出，自动切为L，如果B超出，自动切为T,默认为B
	 * @example
	 * var tar = $E('admin');
	 * Module.FloatMenu.init(tar,[
	 * 							{label:'请选择添加的位置'},
	 * 							{label:'我的播客',href:'http://video.sina.com.cn'},
	 * 							{label:'我的应用',href:'#',action:'onclick="window.alert(\'something\')"'}
	 * 						],'R');
	 */
	init:function(tar,data,pos){
		this._init_();
		scope.$floatmenu=this;//在全局变量中记录该Menu，这样可以在外部操作该Menu xinyu@staff.sina.com.cn
		Core.Events.addEvent(tar,function(){Core.Events.stopEvent();Module.FloatMenu.showItem(tar,data,pos)},'click');
	},
	showItem:function(tar,data,pos){
		//build 
		this._n.style['visibility'] = 'hidden';
		this._n.style['display'] = 'block';
		this.buildList(data);
		//fix position
		var x = Core.Dom.getLeft(tar);
		var y = Core.Dom.getTop(tar);
		var w = tar.offsetWidth;
		var h = tar.offsetHeight;

		var n_w = this._n.offsetWidth;
		var n_h = this._n.offsetHeight;

		var dx,dy;
		var m = 2;
		
		var win = Core.System.winSize();
		var scroll = Core.System.getScrollPos();
		// check pos
		if(pos == 'R'){
			dy = y;
			dx = x + w +m;
		}else{
			dx = x;
			dy = y + h + m;
		}
		// check horizontal overflow
		if( (dx + n_w) >= win.w){
			dx = x - n_w - m;
		}
		// check vertical overflow
		if( (dy + n_h) > scroll[0]+win.h){
			dy = y - n_h + h;
		}
		
		this._n.style['top'] = dy + 'px';
		this._n.style['left'] = dx + 'px';
		this._n.style['visibility'] = 'visible';
	},
	hideItem:function(){
		this._n.style['display'] = 'none';
	},
	buildList:function(data){
		this._n.firstChild.innerHTML = '';
		var _tpl_href = new Utils.Template('<li><a href="#{href}" #{action}>#{label}</a></li>');
		var _tpl_label = new Utils.Template('<li><em>#{label}</em></li>');
		var str = '';
		for(var i = 0; i < data.length; i ++){
			if(data[i]['href'] || data[i]['action'])
				str += _tpl_href.evaluate(data[i]);
			else
				str += _tpl_label.evaluate(data[i]);
		}
		this._n.firstChild.innerHTML = str;
	}
};
