/**
 * @author feng.dimu dimu@staff.sina.com.cn
 * 应用广场应用详细页lightbox
 */

$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");
$import('sina/core/events/addEvent.js');
$import('sina/core/events/removeEvent.js');
$import('sina/core/system/getScrollPos.js');
$import('sina/core/system/pageSize.js');
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/array/foreach.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/function/bind3.js");
(function(proxy){
	
	var setStyle = Core.Dom.setStyle2;
	var each = Core.Array.foreach;
	var addEvent = Core.Events.addEvent;

	var PhotoLightBox = function(conf){
		var conf = conf || {};
		this._scn = conf["scn"] || 'on';
		this._w = 796;
		this._h = 478;		
		var _this = this;
		var _timer = null;
		this._s = function(){
			clearTimeout(_timer)
			_timer = setTimeout(function(){
				_this._scroll();
			},100)
		}
		this._createBox();
		if (conf.photoList ) this.showPhoto( conf.photoList,conf.index );
	
	}
	PhotoLightBox.pload = function(img,w,h){
		if( img.width > w  ) setStyle( img,{"width": w+ 'px'} ); //478
		if( img.height > h  ) setStyle( img,{"height":h + 'px'} ); //796
	}
	
	PhotoLightBox.prototype = {
		_createBox : function(){
			var common = [{'tagName':'DIV', 'attributes':{'class':'cover','id':'vlpb_lay','title':$CLTMSG['CF0105']},'childList':[]},
					{'tagName':'DIV', 'attributes':{'class':'popdiv','id':'vlpb_con'},'childList':[
						{'tagName':'DIV', 'attributes':{},'childList':[
							{'tagName':'UL', 'attributes':{'class':'popscream','id':'vlpb_scream'},'childList':[]}
						]},
						{'tagName':'UL', 'attributes':{'class':'popcontrol','id':'vlpb_ctl'},'childList':[]},
						{'tagName':'A', 'attributes':{'id':'vlpb_close','href':'#nogo','class':'popclose','title':$CLTMSG['CF0105']},'childList':[]}
					
				]}
			];
			var domBuilder = new App.Builder(common, document.body);
			this._lay = domBuilder.domList['vlpb_lay'];
			this._box = domBuilder.domList['vlpb_con'];
			this._control = domBuilder.domList['vlpb_ctl'];
			this._pscream = domBuilder.domList['vlpb_scream'];
			this._pclose  = domBuilder.domList['vlpb_close'];
//			this._pclose.innerHTML = '关闭';
			setStyle( this._lay,{"display":'none'} );
			setStyle( this._box,{"display":'none'} );
		},
		_createPhoto : function(photoList){
			var sHTML = [],cHTML = [],_this = this;
			each(photoList,function(v,i){
				i++;
				sHTML.push('<li style="display:none;"><span><img onload="App.PhotoLightBox.pload(this,'+ _this._w+',' + _this._h+');" src="'+v.middlePicUrl+'" /></span></li>')
				cHTML.push('<li><img width="40" height="40"  src="'+v.picUrl+'" /></li>')
			});
			this._control.innerHTML = cHTML.join('');
			this._pscream.innerHTML = sHTML.join('');
		},
		_bindEvent : function(){
			var list = this._control.getElementsByTagName('li');
			var _this = this;
			each(list,function(v,i){
				addEvent(v,function(){
					_this._showImage(i);
				},'click');
			});
			addEvent( this._pclose ,function(){
					_this.hide();
				},'click');
			addEvent( this._lay ,function(){
					_this.hide();
				},'click');
				
			list = null;			
		},
		_showImage: function(i){
			var _cl = this._control.getElementsByTagName('li');
			var _sl = this._pscream.getElementsByTagName('li');			
			if( this._lastIndex != -1 ){
				 _cl[this._lastIndex].className = ''
				setStyle( _sl[this._lastIndex],{"display":'none'} );
			}			
			this._lastIndex = i ;			
			_cl[i].className = this._scn;
			setStyle( _sl[i],{"display":'block'} );			
		},
		show : function(index){
			if ( ! this._lay || !this._box ) return;
			var psize = Core.System.pageSize();
			this._ph = psize[1];
			setStyle( this._lay,{"display":'block',"z-index":999,"width" :psize[0] + 'px',"height" : psize[1] + 'px' } );	
			setStyle( this._box,{"display":'block',"z-index":1000} );
		//	addEvent(window,this._s,"scroll");
			this._showImage( index || 0 )
			this._s();	
		},
		hide : function(){
			this._lay && setStyle( this._lay,{"display":'none'} );	
			this._box && setStyle( this._box,{"display":'none'} );
			Core.Events.removeEvent(window,this._s,"scroll");
		},
		destory : function(){
			if ( ! this._lay || !this._box ) return;
			this.hide();
			Core.Dom.removeNode( this._lay )
			Core.Dom.removeNode( this._box )
			this._lay = null;
			this._box = null;
			this._control = null;
			this._pscream = null;
		},
		_scroll : function(){
			var _t = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
			var h = this._box.clientHeight + 20;
			_t = _t + h > this._ph ? this._ph - h : _t;
			setStyle( this._box,{"top":_t  + 'px'} );
		},
		showPhoto : function(pList,index){
			if ( !pList || pList.length ==0 ) return;
			this._lastIndex = -1;
			this._createPhoto(pList);	
			this._bindEvent();
			this.show(index);
		}
	}
	
	proxy.PhotoLightBox = PhotoLightBox;
		
})(App);
