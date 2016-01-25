/**
 * @author feng.dimu dimu@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/array/foreach.js");
$import("diy/viewLightPhotoBox.js");
(function(){
	var addEvent = Core.Events.addEvent;
	var each = Core.Array.foreach;
	
	var Gallery = function(){
		this._lock = false;
		this.init();
	};
	Gallery.prototype = {
		init : function(){
			this._con = $E('gallery_con');
			this.list = this._con.getElementsByTagName('li');
			this._bindClick();
		},
		_bindClick : function(){
			var This = this;
			each(this.list,function(v,i){
				addEvent(v,function(){
					This._showLightBox(i);
				},'click')	
			})
		},
		_showLightBox : function(index){
			if ( !this._lightBox)  this._lightBox = new App.PhotoLightBox();
			this._lightBox.showPhoto( scope.appPhotoList , index );
		}
	};
	$registJob('imageGallery', function(){
    	new Gallery();
	});
})();
