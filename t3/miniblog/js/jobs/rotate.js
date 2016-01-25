$import("sina/sina.js");
$import("sina/app.js");
//--------------------------------------------------------------------------------------------------
//注册 微博详细页 旋转图片 的job
$registJob("ratateImage",function(){
	if(!$E("imgContainer")){
		return false;
	}
	var defaultWidth = 500;
	var imgID = "imgContainer";
	Core.Events.addEvent("rotateLeft",function(){
		App.rotate.rotateLeft(imgID,90,function(canvas){},defaultWidth);
	},"click");
	Core.Events.addEvent("rotateRight",function(){
		App.rotate.rotateRight(imgID,90,function(canvas){},defaultWidth);
	},"click");
});
//----------------------------------------------------------------------------------------------------
App.rotate = {
	/**
	 *@向右旋转（顺时针）
	 *@param {String}imgID
	 *@param {Number}angle
	 *@param {Function}callback
	 *@param {Number}maxWidth
	 * */
	rotateRight : function(imgID,angle,callback,maxWidth) {
		this._img[imgID] = this._img[imgID]||{};
		this._img[imgID]._right = this._img[imgID]._right||0;
		this._img[imgID]._right++;
		this._rotate(imgID,angle==undefined?90:angle,callback,maxWidth);
	},
	/**
	 *@向左旋转（逆时针）
	 *@param {String}imgID
	 *@param {Number}angle
	 *@param {Function}callback
	 *@param {Number}maxWidth
	 * */
	rotateLeft : function(imgID,angle,callback,maxWidth) {
		this._img[imgID] = this._img[imgID]||{};
		this._img[imgID]._left = this._img[imgID]._left||0;
		this._img[imgID]._left++;
		this._rotate(imgID,angle==undefined?-90:-angle,callback,maxWidth);
	},
	_img:{},
	/**
	 *@see http://code.google.com/p/jquery-rotate/
	 *@param {String}imgID
	 *@param {Number}angle
	 *@param {Function}callback
	 *@param {Number}maxWidth
	 * */
	_rotate:function(imgID,angle,callback,maxWidth) {
		var p = $E(imgID);
		p.angle = ((p.angle==undefined?0:p.angle) + angle) % 360;
		if (p.angle >= 0) {
			var rotation = Math.PI * p.angle / 180;
		} else {
			var rotation = Math.PI * (360+p.angle) / 180;
		}
		var costheta = Math.cos(rotation);
		var sintheta = Math.sin(rotation);
	
		if (document.all && !window.opera) {
			var canvas = document.createElement('img');
			canvas.src = p.src;
			canvas.height = p.height;
			canvas.width = p.width;
			if(!this._img[imgID]._initWidth){//保存初始化高宽
				this._img[imgID]._initWidth = canvas.width;
				this._img[imgID]._initHeight = canvas.height;
			}
			if(canvas.height > maxWidth+8){ // 限制宽度,等比缩放
				canvas._w1 = canvas.width;
				canvas._h1 = canvas.height;
				canvas.height = maxWidth - 4;
				canvas.width = (canvas._w1*canvas.height)/canvas._h1 ;
			}
			canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+costheta+",M12="+(-sintheta)+",M21="+sintheta+",M22="+costheta+",SizingMethod='auto expand')";
			
			var me = this;
			setTimeout(function(){
				//旋转180,360度后恢复原始高宽
				var left = me._img[imgID]._left, right= me._img[imgID]._right;
				if(right%2 ==0 || left%2==0 || Math.abs(right - left)%2 == 0){
					canvas.width = me._img[imgID]._initWidth - 4;
					canvas.height = me._img[imgID]._initHeight - 4;
				}
				
				//保存第一次旋转90后的高宽
				if((left === 1 && !right)||(!left && right===1)){
					me._img[imgID]._width = canvas.width;
					me._img[imgID]._height = canvas.height;
				}
				//左右混合旋转操作出现90、270度时
				if(right > 0 && left > 0 && Math.abs(right - left)%2 != 0){
					canvas.width = me._img[imgID]._width - 4;
					canvas.height = me._img[imgID]._height - 4;
				}
			},0);
		} else {
			var canvas = document.createElement('canvas');	
			if (!p.oImage) {
			    canvas.oImage = p;//firefox下图片未加载时drawImage报错。
			} else {
				//注意，此时的p已经不是img了，而是canvas元素(因为canvas.id = p.id;)
				canvas.oImage = p.oImage;
			}
			canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width) + Math.abs(sintheta*canvas.oImage.height);
			canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height) + Math.abs(sintheta*canvas.oImage.width);
			
			/**
			 * 限制宽度（调整高宽以适应父容器）
			 * 1 + "px" is the key! 
			 * 2 Do't set canvas.width!
			 * 3 canvas.style.height will be adjusted automatically
			 * 4 canvas.clientHeight or canvas.offsetHeight can be used in callback to adjust the parent container's height
			 * */
			if(canvas.width > maxWidth){
				canvas.style.width = maxWidth + "px";
			}
			
			var context = canvas.getContext('2d');
			context.save();
			if (rotation <= Math.PI/2) {
				context.translate(sintheta*canvas.oImage.height,0);
			} else if (rotation <= Math.PI) {
				context.translate(canvas.width,-costheta*canvas.oImage.height);
			} else if (rotation <= 1.5*Math.PI) {
				context.translate(-costheta*canvas.oImage.width,canvas.height);
			} else {
				context.translate(0,-sintheta*canvas.oImage.width);
			}
			context.rotate(rotation);
			try{
				context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
			}catch(e){
				
			}
			
			context.restore();
		}
		canvas.id = p.id;
		canvas.angle = p.angle;
		p.parentNode.replaceChild(canvas, p);
		if(callback && typeof callback === 'function'){
			callback(canvas);
		}
	}
};
