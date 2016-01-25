/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview CustomTheme 自定义风格视图类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-08
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/module/set/custom/customoption.js");

var UploadView=Core.Class.create();
UploadView.prototype = {
	initialize:function(container,type){
		this.container=container;
		this.type=type;
		this.arr=["tip","upload_form","info","select_optoin","cancel"];
		this.initHtml();
		this.initInfo();
		this.customOption=new CoustomOption(this.type);
		this.initEvent();
		this.upload=true;	
	},
	initHtml:function(){
		var html='<div id="#{type}_all_upload"><div id="#{type}_'+this.arr[0]+'" class="CP_setatus CP_seterr hidden"><em>上传中出错，请重新上传！</em></div>\
		<div id="#{type}_'+this.arr[1]+'" class="CP_setfil hidden">上传图片：\
			<form id="#{type}_form" enctype="multipart/form-data">\
				<input type="hidden" name="app" value="blog">\
				<input type="hidden" name="s" value="json">\
				<input type="hidden" name="exif" value="1">\
				<input type="hidden" id="#{type}_uid" name="uid"/>\
				<input type="hidden" id="#{type}_pic_type" name="pic_type"/>\
		 		<input type="text" onkeydown="return false"  id="#{type}_text" />\
		 		<a href="#" class="CP_a_btn2 CP_a_btnsub">\
		 			<cite>浏览</cite>\
					<input type="file" id="#{type}_file" name="pic1" class="CP_file" size="1" />\
				</a>\
				<a href="#" onclick="return false;"  id="#{type}_uplaod_but"  class="CP_a_btn2">\
					<cite>上传</cite>\
				</a>\
			</form>\
		</div>\
		<p class="CP_setcal" id="#{type}_cancel_up" style="display:none"><a class="CP_a_btn2" href="#"><cite id="#{type}_cancel_up_but">取消上传</cite></a></p>\
		<div id="#{type}_'+this.arr[2]+'" class="CP_setip hidden"></div>\
		<table id="#{type}_'+this.arr[3]+'" class="CP_setpic hidden">\
			<colgroup>\
				<col class="CP_setth1" />\
				<col class="CP_settd1" />\
				<col class="CP_setth2" />\
				<col class="CP_settd2" />\
			</colgroup>\
				<tr>\
					<th rowspan="2">设置图片：</th>\
					<input id="#{type}_pic" type="hidden"/>\
					<td>平铺：<select id="#{type}_repeat">\
						 <option value="none">不平铺</option>\
					     <option selected="true" value="default">平铺</option>\
						 <option value="h">横向</option>\
						 <option value="v">纵向</option>\
					</select></td>\
					<th rowspan="2">对齐：</th>\
					<td>水平方向<select id="#{type}_positionX">\
					 	<option value="left">左</option>\
						<option selected="true" value="center">中</option>\
						<option value="right">右</option>\
					</select></td>\
				</tr>\
				<tr>\
					<td id="#{type}_height_container"></td>\
					<td>垂直方向<select id="#{type}_positionY">>\
						 <option selected="true" value="top">上</option>\
						 <option value="center">中</option>\
						 <option value="bottom">下</option>\
					</select></td>\
				</tr>\
		</table>\
		<div  id="#{type}_'+this.arr[4]+'" class="CP_setcal hidden"><a href="#" class="CP_a_btn2"><cite>取消上传</cite></a></div></div>';
		 var tmp = new Utils.Template(html);
		var data={type:this.type};
		Core.Dom.insertHTML(this.container,tmp.evaluate(data),"BeforeEnd")

	},initInfo:function(){
		var html='<em>上传提示：</em>支持大小不超过600k的jpg、gif、png图片。';
		
		if(this.type=="head"){
			html+='<br/>建议高度为100～300像素之间。';
			$E(this.type+"_height_container").innerHTML='高度：<input value="" id="'+this.type+'_height" type="text" class="CP_setipt" /><span id="head_height_tip">像素(100-300)</span>';
		}
		$E(this.type+"_"+this.arr[2]).innerHTML=html;
		if(this.type=="head"){
			var height;
			if(config.common[this.type] && config.common[this.type].height){
				height=config.common[this.type].height;
			}else{
				height=100;
			}
			$E(this.type+"_height").value=height;
		}
		this.setDefault_bg();
	},
	initEvent:function(){
		var _this=this;
		var type=this.type;
		Core.Events.addEvent($E(type+"_"+"file"),function(){
			$E(_this.type+"_"+"text").value=$E(_this.type+"_"+"file").value;
		},"change");
		Core.Events.addEvent($E(type+"_repeat"),Core.Function.bind2(this.customOption.setReapat,this.customOption),"change");
		Core.Events.addEvent($E(type+"_positionX"),Core.Function.bind2(this.customOption.setPositionX,this.customOption),"change");
		Core.Events.addEvent($E(type+"_positionY"),Core.Function.bind2(this.customOption.setPositionY,this.customOption),"change");
		Core.Events.addEvent($E(type+"_cancel_up_but"),Core.Function.bind2(function(){
			this.upView();
			this.upload=false;
		},this),"click");
		if(type=="head"){
			Core.Events.addEvent($E(type+"_height"),function(e){
				_this.customOption.setHeight(e);
			},"change");
		}
		
	},
	setDefault_bg: function(){
		if(this.type=="bg"){
			$E("default_"+this.type).style.background="url(http://simg.sinajs.cn/tpl/"+this.getSelectThemeId()+"/images/bg.jpg)";
		}else{
			$E("default_"+this.type).style.background="url(http://simg.sinajs.cn/tpl/"+this.getSelectThemeId()+"/images/banner.jpg)";
		}
		
	},
	upView:function(){
		$E(this.type+"_text").value="";
		$E(this.type+"_file").value="";
		$E(this.type+"_"+this.arr[0]).style.display="none";
		$E(this.type+"_"+this.arr[1]).style.display="block";
		$E(this.type+"_"+this.arr[2]).style.display="block";
		$E(this.type+"_"+this.arr[3]).style.display="none";
		$E(this.type+"_"+this.arr[4]).style.display="none";
		$E(this.type+"_cancel_up").style.display="none";
	},
	hidden:function(){
			$E(this.type+"_all_upload").style.display="none";
	},
	show:function(){
			$E(this.type+"_all_upload").style.display="";
	},
	succView:function(pic_id){
		//				scope.imgPath
		$E(this.type+"_"+this.arr[0]).innerHTML='<b>图片上传成功！</b><a href="#" onclick="return false" id="'+this.type+'_reupload">[重新上传]</a>';
		$E("custom_"+this.type).style.background='url('+getImgStaticPath(pic_id)+')';
		Core.Events.addEvent($E(this.type+"_reupload"),Core.Function.bind2(this.upView,this),"click");
		//$Debug(scope.imgPath+pic_id);
		$E(this.type+"_"+this.arr[0]).style.display="block";
		$E(this.type+"_"+this.arr[1]).style.display="none";
		$E(this.type+"_"+this.arr[2]).style.display="none";
		$E(this.type+"_"+this.arr[3]).style.display="block";
		$E(this.type+"_"+this.arr[4]).style.display="none";
		$E(this.type+"_cancel_up").style.display="none";
		$E(this.type+"_file").value="";
		this.customOption.setAll(pic_id);
	
	},uploadingView:function(){
		this.errorView("A22003");
		$E(this.type+"_"+this.arr[1]).style.display="none";
		$E(this.type+"_cancel_up").style.display="block";
	},optionView:function(){
		$E(this.type+"_"+this.arr[0]).innerHTML='<a href="#" class="CP_a_fuc" onclick="return false" id="'+this.type+'_reupload">[<cite>重新上传</cite>]</a>';
		Core.Events.addEvent($E(this.type+"_reupload"),Core.Function.bind2(this.upView,this),"click");
		
		$E("custom_"+this.type).style.background='url('+getImgStaticPath(config.common[this.type].currpic)+')';
		
		$E(this.type+"_repeat").value=config.common[this.type].tiled;
		$E(this.type+"_positionX").value=config.common[this.type].align_h;
		$E(this.type+"_positionY").value=config.common[this.type].align_v;
		$E(this.type+"_"+this.arr[0]).style.display="block";
		$E(this.type+"_"+this.arr[1]).style.display="none";
		$E(this.type+"_"+this.arr[2]).style.display="none";
		$E(this.type+"_"+this.arr[3]).style.display="block";
		$E(this.type+"_"+this.arr[4]).style.display="none";
	},errorView:function(code){
		
		$E(this.type+"_"+this.arr[0]).innerHTML=$SYSMSG[code];
		//$E("custom_"+this.type).style.background='url('+scope.imgPath+pic_id+')'
		$E(this.type+"_"+this.arr[0]).style.display="block";
		$E(this.type+"_"+this.arr[1]).style.display="block";
		$E(this.type+"_"+this.arr[2]).style.display="block";
		$E(this.type+"_"+this.arr[3]).style.display="none";
		$E(this.type+"_"+this.arr[4]).style.display="none";
		$E(this.type+"_cancel_up").style.display="none";
	},
	setCancel:function(){
		if(config.common[this.type].currpic){
			$E("custom_"+this.type).style.background='url('+getImgStaticPath(config.common[this.type].currpic)+')';
			$E(this.type+"_repeat").value=config.common[this.type].tiled;
			$E(this.type+"_positionX").value=config.common[this.type].align_h;
			$E(this.type+"_positionY").value=config.common[this.type].align_v;
			if(this.type=="head"){
				$E(this.type+"_height").value=config.common[this.type].height;
			}	
		}
	},
		getSelectThemeId:function(){
		var theme_id;
		for(name in scope.theme_cnf){
			if(isNaN(parseInt(name))){
				continue;
			}
			if($E("select_"+name+"_img")){
				var arr=$E("select_"+name+"_img").parentNode.id.split("_");
				theme_id=arr[2]+"_"+arr[3];
			}
		}
		return theme_id;
	},hidden_all:function(){
		$E(this.type+"_custom_container").style.display="none";
	}
	,show_all:function(){
		$E(this.type+"_custom_container").style.display="block";
	}
};


