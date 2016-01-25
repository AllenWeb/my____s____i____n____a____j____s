/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 * @fileoverview CustomTheme 自定义风格类
 * @author dg.liu | dongguang@sina.staff.com.cn
 * @version 1.0 | 2008-09-08
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/template.js");
$import("sina/utils/io/iframeupload.js");
$import("sina/module/set/custom/uploadview.js");
$import("sina/msg/uploadMSG.js");

var CustomTheme=Core.Class.create();
CustomTheme.prototype = {
	activeModel:"",
	activeType:"",

	/**
	 * 初始化
	 * @param {Element} container   父节点
	 * @param {Object} option       属性的集合
	 * 例：
	 *  {
		 	title: "头图",
			type:"top"
		}
	 */
	initialize: function(container,option){
		this.container=container;
		var id=this.getSelectThemeId();
		if(!id){
			id=config.common.t;
		}
		if(id.split("_")[0]=="13"){
			if(!$E("xuandong")){
					this.container.innerHTML='<div id="xuandong" class="CP_xuanstyle">\
							<div class="xuannotes">\
                            你所使用的炫动模板不能进行自定义风格设置。<br/>如需要使用，请使用其他类型模板。\
                            </div>\
						</div>';
			}else{
				$E("xuandong").style.display="block";
			}
		
			return null;
		}else{
			if($E("xuandong")){
					$E("xuandong").style.display="none";
			}
		}
		
		this.type=option.type;
		this.option=option;
		this.initHtml();
		this.uploadView=new UploadView($E(this.type+"_upload_container"),this.type);
		if(config.common[this.type] && config.common[this.type].length!=0 && config.common[this.type].usepic=="1"){
			this.uploadView.optionView();
			this.selectItem("custom");
		}else{
			this.selectItem("default");
			this.uploadView.upView();
		}
		this.initEvent();
		
	
	},
	/**
	 * 初始化所需的html
	 */
	initHtml:function(){
		var html_tmp='<div id="#{type}_custom_container">\
			<dt><em>更换#{title}</em></dt>\
			<dd id="#{type}_upload_container"><iframe id="postIframe" name="postIframe" style="display:none"></iframe>\
				<ul class="CP_chos">\
					<li><a  id="custom_#{type}" onclick="return false;" href="#"><span>自定义#{title}</span>\
					<b id="custom_select_#{type}"></b></a></li>\
					<li class="CP_choson"><a  id="default_#{type}"  href="#"  onclick="return false;" >默认#{title}</span>\
					<b id="default_select_#{type}"></b></a></li>\
				</ul>\
			</dd></div>';
			 var tmp = new Utils.Template(html_tmp);
			 var data ={};
			 data.title=this.option.title;
			 data.type=this.type;
			 $Debug(data.title);
			 Core.Dom.insertHTML(this.container,tmp.evaluate(data),"BeforeEnd");
			 
			Core.Events.addEvent($E("custom_"+this.type),Core.Function.bind3(this.selectItem,this,["custom"]),"click");
			Core.Events.addEvent($E("default_"+this.type),Core.Function.bind3(this.selectItem,this,["default"]),"click");
			
			//增加鼠标移进后边框变绿，移出后无边框的效果
			var _this=this;
			Core.Events.addEvent($E("custom_"+this.type),Core.Function.bind3(function(){
				$E("custom_"+_this.type).style.border = "2px solid #51BD2F";
			}),"mouseover");
			Core.Events.addEvent($E("default_"+this.type),Core.Function.bind3(function(){
				$E("default_"+_this.type).style.border = "2px solid #51BD2F";
			}),"mouseover");
			
			Core.Events.addEvent($E("custom_"+this.type),Core.Function.bind3(function(){
				if (_this.activeModel != "custom" || _this.activeType!=_this.type) {
					$E("custom_" + _this.type).style.border = "1px solid #DEDEDE";
				}
			}),"mouseout");
			Core.Events.addEvent($E("default_"+this.type),Core.Function.bind3(function(){
				if (_this.activeModel != "default" || _this.activeType!=_this.type) {
					$E("default_" + _this.type).style.border = "1px solid #DEDEDE";
				}
			}),"mouseout");
			
	},
	initEvent:function(){
		Core.Events.addEvent($E(this.type+"_uplaod_but"),Core.Function.bind3(this.uploadImage,this,[this.type]),"click");
		//Core.Events.addEvent($E("custom_"+this.type),Core.Function.bind3(this.selectItem,this,["custom"]),"click");
	
	},
	/**
	 * 点选时打钩
	 * @param {String} mode
	 */
	setSelectImg:function(mode){
		$Debug(mode);
		var select_img=$E(this.type+'_select_img');
		var select_item=$E(mode+"_select_"+this.type);
		if(select_img){
			select_img.parentNode.parentNode.style.border="1px solid #DEDEDE";
			Core.Dom.removeNode(select_img);
			select_img=null;
		}
		select_item.parentNode.style.border = "2px solid #51BD2F";
		select_item.innerHTML = '<img id="' + this.type + '_select_img" class="CP_i CP_i_ok" src="http://sjs.sinajs.cn/common/images/CP_i.gif" align="absmiddle" alt="" title="" />';
	},
	/**
	 * 点击时所执行的所有操作集
	 * @param {String} mode
	 */
	selectItem:function(mode){
		$Debug(mode);
		this.setSelectImg(mode);
		if(mode=="custom"){
			this.uploadView.show();
			
			//this.uploadView.customOption.setBackgroundImage(config.common[this.type].currpic);
			var a_id="";
			$E("custom_"+this.type).style.backgroundImage.replace(/\/(\w*)\)/,function(a,b){a_id=b});
			this.uploadView.customOption.setBackgroundImage(getImgStaticPath(a_id));
			if (this.type == "head") {
				this.uploadView.customOption.setEleHeight($E("head_height").value);
			}
			
			this.activeModel="custom";
			this.activeType=this.type;
			
		}else{
			var t="";
			if(this.type=="head"){
				t="banner";
				this.uploadView.customOption.setEleHeight();
			}else{
				t="bg";
			}
			this.uploadView.customOption.setBackgroundImage("http://simg.sinajs.cn/tpl/"+	this.getSelectThemeId()+"/images/"+t+".jpg");
//			this.uploadView.customOption.setBackgroundImage("none");
//			this.uploadView.customOption.setBackgroundImage("");
			this.uploadView.hidden();	
			
			this.activeModel="default";
			this.activeType=this.type;
		}
		if(config.common[this.type]){
				this.uploadView.optionView();
		}
		
		
		//上传图片的平铺和显示位置的选项如果为空则设为默认值;
		if($E(this.type+"_repeat").value.replace(/\s/g,"")==""){
			$E(this.type+"_repeat").value="none";
		}
		if($E(this.type+"_positionX").value.replace(/\s/g,"")==""){
			$E(this.type+"_positionX").value="left";
		}
		if($E(this.type+"_positionY").value.replace(/\s/g,"")==""){
			$E(this.type+"_positionY").value="top";
		}
	},
	uploadImage:function(type){
		var _this=this;
		var upload=new Utils.Io.iframeUpload("postIframe");
		var form=$E(type+'_form');
		var uid_input=$E(type+'_uid');
		var type_input=$E(type+'_pic_type');
		var action="http://upload.photo.sina.com.cn/interface/pic_upload.php";
		var pic_type=type=="bg"?2:1;
		uid_input.value=scope.$uid;
		type_input.value=pic_type;
		$Debug("pic_type:"+type_input.value);
		$Debug(" uid:"+ uid_input.value);
		this.uploadView.uploadingView();
		this.uploadView.upload=true;
		upload.post(form, action, function(txt){
			var result = eval('(' + txt + ')'),pic_id;
			if(!_this.uploadView.upload)return;
			if(result.code=='A00006'){
				$Debug(txt);
				pic_id=result.data.pics.pic_1.pid;
				_this.pic=pic_id;
				_this.uploadView.succView(pic_id);
				
			}else{
				$Debug(txt);
				var num=result.data.pics.pic_1.ret;
				switch (num) {
					case -11:
					case -9:
						_this.uploadView.errorView("A10105");
						break;
					case -10:
						_this.uploadView.errorView("A10102");
						break;
				}
				
			}
			//_this.resetFileUpload();
		})
	},
	isChanged:function(){
		if(!$E("custom_"+this.type) || !$E(this.type + "_repeat")){
			return false;
		}
		if (config.common[this.type] && config.common[this.type].length != 0) {
			if (this.pic && this.pic!= config.common[this.type].currpic) {
				return true;
			}
			if ($E(this.type + "_repeat").value != config.common[this.type].tiled) {
				return true;
			}
			if ($E(this.type + "_positionX").value != config.common[this.type].align_h) {
				return true;
			}
			if ($E(this.type + "_positionY").value != config.common[this.type].align_v) {
				return true;
			}
			if(this.type=="head" && config.common[this.type].height){
				if($E(this.type+"_height").value!= config.common[this.type].height){
					return true;
				}
			}
			if($E(this.type+"_select_img").parentNode.id=="default_select_"+this.type && config.common[this.type].usepic=="1"){
				return true;
			}
			if($E(this.type+"_select_img").parentNode.id=="custom_select_"+this.type && config.common[this.type].usepic=="3"){
				return true;
			}
		}else{
			if (this.pic) {
				return true;
			}
			if ($E(this.type + "_repeat").value != "default") {
				return true;
			}
			if ($E(this.type + "_positionY").value != scope.cssPositionYConf["default"]) {
				return true;
			}
			if ($E(this.type + "_positionX").value != scope.cssPositionXConf["default"]) {
				return true;
			}
			if($E(this.type+"_height")){
				if($E(this.type+"_height").value!="100"){
					return true;
				}
			}
		}
		return false;
	},
	getParameter:function(){
		var param={};
		
		if(!this.isChanged() && !(config.common[this.type] && config.common[this.type].usepic!=3)){
			param[this.type+"_currpic"]="dpic";
		}else{
			if(this.pic){
				param[this.type+"_currpic"]=this.pic	
			}else{
				if($E(this.type+"_select_img").parentNode.id=="default_select_"+this.type && config.common[this.type].usepic=="1"){
					param[this.type+"_currpic"]="dpic";
				}
				if($E(this.type+"_select_img").parentNode.id=="custom_select_"+this.type && config.common[this.type].usepic=="3"){
					param[this.type+"_currpic"]=config.common[this.type].currpic;
				}
			}
		}
		param[this.type+"_tiled"]=$E(this.type+"_repeat").value;
		param[this.type+"_align_h"]=$E(this.type+"_positionX").value;
		param[this.type+"_align_v"]=$E(this.type+"_positionY").value;
		if($E(this.type+"_height")){
			param[this.type+"_height"]=$E(this.type+"_height").value;
		}
		
		return param;
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
	}
}