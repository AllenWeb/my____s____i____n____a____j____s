/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @view image's list like a photo 
 * @App.viewRotateImg(imgDocument,config)
 * @config : {
 	'maxExcursion' : 'the Excursion of image'
 	};
 */
$import("sina/sina.js");
$import("sina/app.js");
(function(proxy){
	var viewRotateImg = function(image,position,excursion){
		var config = {'maxExcursion' : parseInt(position)*parseInt(excursion)};
		if($IE){
			rotateIEImage(image,config);
		}else{
			rotateImage(image,config);
		}
	};
	
	var rotateImage = function(image,config){
		var canvas = document.createElement('CANVAS');
		
		//config
		var maxDegree	= 5;
		var borderColor = 'rgba(255,255,255,1)';
		var borderWidth	= 2;
		var shadowWidth	= 2;
		var maxExcursion= config.maxExcursion;
		var minExcursion= config.minExcursion;
		//end config
		
		//make canvas attributes
		canvas.style.cssText= image.style.cssText;
		canvas.style.width	= image.width + 13 + 'px';
		canvas.style.height	= image.height + 13 + 'px';
		canvas.height		= image.height + 13;
		canvas.width		= image.width + 13;
		canvas.src			= image.src;
		canvas.alt			= image.alt;
		if(image.id != ''){
			canvas.id = image.id;
		}
		if(image.title != ''){
			canvas.title = image.title;
		}
		if(image.getAttribute('onclick') != ''){
			canvas.setAttribute('onclick',image.getAttribute('onclick'));
		}
		//end make canvas
		
		
		//draw image
		var alpha	= (Math.PI*(Math.random()*maxDegree))/180;
		var ctx		= canvas.getContext('2d');
		var w		= image.width;
		var h		= image.height;
		var imgH	= h + borderWidth*2;//(h*Math.cos(alpha) - w*Math.sin(alpha))/Math.cos(2*alpha);
		var imgW	= w + borderWidth*2;//(w*Math.cos(alpha) - h*Math.sin(alpha))/Math.cos(2*alpha);
		var inverse	= (Math.random() > 0.5) ? true : false;
		var dert	= inverse ? Math.sin(alpha)*imgH : (canvas.height - Math.cos(alpha)*imgH); 
		alpha = inverse ? alpha : alpha*(-1);
		if(inverse){
			ctx.translate(dert, 0);
		}else{
			ctx.translate(0, dert);
		}
		
		ctx.rotate(alpha);
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		
		ctx.fillRect(
			shadowWidth, 
			shadowWidth, 
			imgW - shadowWidth, 
			imgH - shadowWidth
		);
		
		/*ctx.strokeRect(
			0, 
			0, 
			imgW - shadowWidth, 
			imgH - shadowWidth
		);*/
		
		ctx.fillStyle = borderColor;
		
		ctx.fillRect(
			0, 
			0, 
			imgW - shadowWidth, 
			imgH - shadowWidth
		);
		ctx.drawImage(
			image, 
			borderWidth, 
			borderWidth, 
			imgW - (borderWidth*2 + shadowWidth), 
			imgH - (borderWidth*2 + shadowWidth)
		);
		//end draw image
		
		//replace the canvas to image
		image.parentNode.insertBefore(canvas,image);
		image.style.display = 'none';
		if(maxExcursion){
			canvas.style.position = 'absolute';
			canvas.style.left =  /*(-1)*(Math.max((maxExcursion*Math.random()),minExcursion))*/ maxExcursion  + "px";
		}
		//end replace the canvas to image
	};
	
	var rotateIEImage = function(image, config){
		var maxDegree	= 5;
		var borderColor = 'rgba(255,255,255,1)';
		var borderWidth	= 2;
		var shadowWidth	= 2;
		var maxExcursion= config.maxExcursion;
		
		var alpha	= (Math.PI*(Math.random()*maxDegree))/180;//角度
		var inverse	= (Math.random() > 0.5) ? 1 : -1;
		var M11		= Math.cos(alpha);
		var M12		= Math.sin(alpha)*inverse*(-1);
		var M21		= Math.sin(alpha)*inverse;
		var M22		= Math.cos(alpha);
		var cssText	= 'border:' 
			+ borderWidth 
			+ 'px solid #fff;FILTER: progid:DXImageTransform.Microsoft.Matrix(M11=' 
			+ M11 
			+ ',M12=' 
			+ M12 
			+ ',M21=' 
			+ M21 
			+ ',M22=' 
			+ M22 
			+ ',SizingMethod=\'auto expand\') progid:DXImageTransform.Microsoft.dropshadow(OffX=' 
			+ shadowWidth 
			+ ', OffY=' 
			+ shadowWidth 
			+ ', Color=\'#44404040\', Positive=\'true\');padding:' 
			+ borderWidth 
			+ 'px;border : ' 
			+ borderWidth 
			+ 'px solid #fff';
		image.style.cssText = cssText;
		if(maxExcursion){
			image.style.position = 'absolute';
			image.style.left =  maxExcursion + "px";
			image.style.MarginTop = (Math.random()*10)
		}
	};
	proxy.viewRotateImg = viewRotateImg;
})(App);