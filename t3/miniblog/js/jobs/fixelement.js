/**
 * @author haidong
 */
$import("sina/sina.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/addHTML.js");
/**
 * 根据参考位置设置元素的对应位置
 * @param {Object} obj
 */

App.fixElement = {
	init:function(wrap){
		var el = $E("mod_login_tip");
		if(!el){
			var errorHTML = '<div class="errorLayer" id="mod_login_tip" style="visibility:hidden">\
				<div class="top"></div>\
			    <div class="mid">\
			    	<div class="close" onclick="App.fixElement.hidden()" id="mod_login_close">x</div>\
			        <div class="conn">\
			        		<p class="bigtxt" id="mod_login_title"></p>\
				            <span class="stxt" id="mod_login_content" style="padding:0px;"></span>\
			        </div>\
			    </div>\
			    <div class="bot"></div>\
			</div>\
			';	
			if(wrap){					
				wrap.innerHTML = 	errorHTML;
			}else{
				Core.Dom.addHTML((document.body),errorHTML);			
			}			
		}
		el = $E("mod_login_tip");
		this.element = el;			
	},
	setHTML:function(title,content,options){
		this.init($E(options.wrap));
		$E("mod_login_title").innerHTML   = title||"";
		if(content){
			$E("mod_login_content").innerHTML = content;
			$E("mod_login_content").style.display = "";	
		}else{
			$E("mod_login_content").style.display = "none";	
		}
		
		this.fixPostion(options||{});
		this.show();
	},
	fixPostion:function(obj){		
		var offsetX = obj.offsetX||0;
		var offsetY = obj.offsetY||0;
		var ref     = $E(obj.ref);
		var target  = this.element;		
		var aPos    = Core.Dom.getXY(ref);	
		target.style.position = "absolute";		
		if(!obj.wrap){
			target.style.left  = (aPos[0] + offsetX) + "px";
			target.style.top   = (aPos[1] + offsetY - target.offsetHeight) + "px";	
		}else{			
			target.style.marginTop   =  (-target.offsetHeight + offsetY) + "px";	
			target.style.marginLeft  =  ( offsetX) + "px";
		}		
		target.style.zIndex = obj.zIndex || 10;
		return target; 
		
	},
	show :function(){
		this.element&& (this.element.style.visibility = "visible");
		if($E('mod_login_title')){
			$E('mod_login_title').className = 'bigtxt';
		}
	},
	hidden:function(){
		this.element = this.element ||$E("mod_login_tip");
		this.element && (this.element.style.visibility = "hidden");
	}
};

