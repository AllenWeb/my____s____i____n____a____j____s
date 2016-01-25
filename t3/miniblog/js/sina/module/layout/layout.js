/*
 * Copyright (c) 2008, Sina Inc. All rights reserved. 
 */
/** 
 * @fileoverview 页面组件位置的拖动保存
 * 在原有版本基础上提供通过配置进行初始化
 * *********************  注意模块的内容 ******************
 * 		模块体中少用position定位，position定位在firefox下严重影
 * 		响拖动性能，在insertBefore的时候会出现卡的现象，这个在IE6下
 * 		没有问题，应为IE6的position定位渲染存在问题
 */
/**
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/module/module.js");
$import("sina/core/dom/previous.js");
$import("sina/core/dom/next.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/array/findit.js");
$import("sina/module/layout/component.js");
$import("sina/module/layout/forbiddenList.js");
$import("sina/core/dom/trimNode.js");
$import("sina/module/interface/interface_component.js");


/**
 * 拖动管理
 * ************************配置信息************************
 * 每一列 列容器 需要 id  <div id="column_x"></div>  x从0开始计数
 * 每一列中，如果该列模块可以全部移走，则需要一个占位节点
 * 每一个 模块必须带 id  <div id="module_id"></div>  id 为模块的真实id
 */

Sina.pkg('Module.Layout');

Module.Layout.Layout = {
	/**
	 * @param {Array} cnf 模块配置信息  [[1,2,3],[4,5,6]]
	 * @param {Object} forbidCol 列禁止移动信息 {0:false,1:true,2:false} 表示第二列是forbidColumn
	 */
	getInstance : function(cid){
		return $E("module_" + cid);
	},
	/**
	 * 取得某一列的引用
	 * @param {Object} cid 列id
	 */
	getColumn : function(cid){
		return $E("column_" + cid);
	},
	initComp : function(list, column_id){
		for(var i=0,len=list.length;i<len;i++){
			var cid = list[i];
			var Ins = this.getInstance(cid);
			if(!Ins){
				$Debug("组件 ："+cid+"初始化失败！！！");
				continue;
			}
			Ins.column = column_id;
			if(!this.isFobiden(cid)){
				Ins.comp = new Module.Layout.Component(Ins, cid);		
			}else{
				this.getInstance(cid).fobid = true;
				$Debug(cid + " is forbiden!");
			}
		}
	},
	isFobiden : function(cid){
		return Core.Array.findit(Module.Layout.forbiddenList, cid) > -1;
	},
	init : function(cnf, forbidCol){
		this.cnf = cnf;
		this.forbidCol = forbidCol;
		for(var i=0,len=cnf.length;i<len;i++){
			var node = this.getColumn(i);
			var forbid = forbidCol[i] || false;
			//node.setAttribute("forbid", forbid);
			node.forbid = forbid;
			if(!forbid){
				Core.Dom.trimNode(node);
				this.initComp(cnf[i], i);	
			}
		}
		for (var i = 0, len = cnf.length; i < len; i++) {
			this.setColumnBorder(i);
		}
	},
	move : function(ins, l, t){
		if(l > ins._e){
//			$Debug("move East");
			this.moveEast(ins, t);
		}
		if(l < ins._w){
//			$Debug("move West");
			this.moveWest(ins, t);
		}
		if(t > ins._s){
//			$Debug("move South");
			this.moveSouth(ins);
		}
		if(t < ins._n){
//			$Debug("move North");
			this.moveNorth(ins);
		}
	},
	moveSouth : function(ins){
		var next = this.getNextComp(ins);
		ins.parentNode.insertBefore(next, ins);
		this.resignBorder(ins);
	},
	moveNorth : function(ins){
		var prev = this.getPrevComp(ins);
		Core.Dom.insertAfter(prev, $E("__replace_box"));
		this.resignBorder(ins);
	},
	moveEast : function(ins, t){
		var targetId = this.getColumn(ins.column)._r;
		var targetColumn = this.getColumn(targetId);	
		ins.column = targetId;
		this.insertToColumn(ins, targetColumn, t);
		this.resignBorder(ins);
	},
	moveWest : function(ins, t){
		var targetId = this.getColumn(ins.column)._l;
		var targetColumn = this.getColumn(targetId);
		ins.column = targetId;
		this.insertToColumn(ins, targetColumn, t);
		this.resignBorder(ins);
	},
	insertToColumn : function(ins, targetColumn, t){
		targetColumn.appendChild(ins);
		targetColumn.appendChild($E("__replace_box"));
	},
	resignBorder : function(Ins) {
		var column = this.getColumn(Ins.column);
		Ins._w = column._w;
		Ins._e = column._e;
		var prevComp = this.getPrevComp(Ins);
		var nextComp = this.getNextComp(Ins);
		Ins._n = prevComp ? Core.Dom.getTop(prevComp) + parseInt(prevComp.clientHeight) / 2 : -Infinity;
		Ins._s = nextComp ? Core.Dom.getTop(nextComp) + parseInt(nextComp.clientHeight) / 2 - parseInt(Ins.clientHeight) : Infinity;
		Ins.resignPosition();
//		$Debug([Ins._n, Ins._e, Ins._s, Ins._w]);
//		Ins.n.innerHTML = "\
//		<li>left : "+ Ins.style.left+ "\
//		<li>top : "+ Ins.style.top+ "\
//		<li>column : "+ Ins.column+ "\
//		<li>左 : "+ Ins._w+ "\
//		<li>右 : "+ Ins._e+ "\
//		<li>上 : "+ Ins._n+ "\
//		<li>下 : "+ Ins._s+ "\
//		";
	},
	resignPosition : function() {
		this.style.left = $getLeft(this) + "px";
    	this.style.top = $getTop(this) + "px";
	},
	getPrevComp : function(ins) {
		if(comp = Core.Dom.previous(ins, "component")){
			if(!comp.fobid){
				return comp;
			}else{
				return this.getPrevComp(comp);
			}
		}
		return null;
	},
	getNextComp : function(ins) {
		if(comp = Core.Dom.next(ins, "component")){
			if(!comp.fobid){
				return comp;
			}else{
				return this.getNextComp(comp);
			}
		}
		return null;
	},
	setColumnBorder : function(cid){
		var col = this.getColumn(cid);
		var l = this.getLeftColumn(cid);
		var left_col = this.getColumn(l);
		col._l = l;
		col._w = l == null ? -Infinity : Core.Dom.getLeft(left_col) + left_col.offsetWidth/2;
		var r = this.getRightColumn(cid);
		var right_col = this.getColumn(r);
		col._r = r;
		col._e = r == null ? Infinity : Core.Dom.getLeft(right_col) + right_col.offsetWidth/2 - col.offsetWidth;
//		$Debug([cid, col._l, col._r],"red", "white");
//		$Debug([cid, col._w, col._e],"white", "red");
	},
	getLeftColumn : function(i){
		i--;
		while(col = this.getColumn(i)){
			if(!col.forbid){
				return i;
				break;
			}
			i--;
		}
		return null;
	},
	getRightColumn : function(i){
		i++;
		while(col = this.getColumn(i)){
			$Debug(col.id, "red", "white");
			if(i >= this.cnf.length){
				return null;
			}
			if(!col.forbid){
				return i;
				break;
			}
			i++;
		}
		return null;
	},
	notModified : function(data){
		return data.join("|") == this.cnf.join("|");
	},
	save: function(){
		var data = this.getMods();
		if(this.notModified(data)){
			$Debug("not modified! save cancel!");
			return;
		}else{
			this.cnf = data;
		}
		scope.Inter_component.request({
			GET : {
				uid: scope.$uid,
				productid:scope.p_key,
				module : data.join("|")
			},
			onSuccess: function(result){
				$Debug("成功啦");
				//windowDialog.alert("保存成功");
			},
			onError : function (result) {
				showError(result.code);
			},
			onFail : function () {
			}
		});
	},
	getMods:function(){
		var res = [];
		for(var i=0;i<this.cnf.length ; i++){
			res[i] = [];
			var column = this.getColumn(i);
			var mods = Core.Dom.getChildrenByClass(column, "component");
			for(var j=0;j<mods.length;j++){
				res[i].push(mods[j].id.replace("module_",""));
			}
			var col = this.getColumn(i);
			if(res[i].length == 0){
				if(Core.Dom.getElementsByClass(col, "div", "column3empty") == 0){
					//无空列显示
					var emptySig = $C("div");
					emptySig.className = "column3empty";
					emptySig.innerHTML = "您可将模块放置在此!";
					col.appendChild(emptySig);
				}
			}else{
				var emptySig = Core.Dom.getElementsByClass(col, "div", "column3empty")[0];
				Core.Dom.removeNode(emptySig);
			}
			res[i] = res[i].join(",");
		}
		for(var j = 0; j < res.length; j ++){
//			$Debug(">>> " + res[j], "white", "blue");
			config.component["c" + (j + 1)] = res[j].split(",");
		}
		return res;
	}
};

