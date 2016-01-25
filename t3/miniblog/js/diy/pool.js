/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 简单的实现工具池的管理
 * @params cf,建立一个要存储的元素的函数；此函数应该不接受参数
 * @params cfg，配置参数
 		{max[number]	:"尺中元素的最大值，超过了就把池里最老的删除"}
 		{df[function]	:"判断一个元素是否是空闲的方法；此函数接受一个函数，是池内的一个元素;如果空闲返回true，否则返回false;"}
		{gf[function]	:"根据录入条件判定是否为所要对象的方法；此函数接受两个参数，第一个是池子内一个元素，第二个是在获取某个元素时所要输入的key;如果符合条件返回true，否则返回false;"}
		{defData[array]	:"池子里原始的数据"}
 * @对外方法几何：
 		getAvailItem	: 得到一个可以使用的元素。
 		getEmptyItem	: 得到一个空元素，并且该元素已经注册到池子内。
 		getItemByKey	: 得到一个元素根据已经注册的元素于key的对应方法。
 		getAllItem		: 得到池子里的所有元素，返回的是个数组。
 		delItem			: 删除池子里相同的这个元素。
 		delItemByKey	: 根据一个key来删除池子里的一个元素。
 		addItem			: 添加一个元素。
 		putInItems		: 添加一堆元素。
 		
 * @希望这个方法能帮助我们解决一个内存泄露的问题。
 		
 */
$import("sina/sina.js");
$import("sina/app.js");

(function(proxy){
	proxy.pool = function(cf,cfg){
		this.cf  = cf;
		this.max = cfg.max || 0;
		this.df  = cfg.df || function(){return false;};
		this.gf  = cfg.gf || function(){return false;};
		this.po  = [];//存储池子
		if(typeof cfg.defData == "array"){
			if(this.max && this.max > defData.length){
				for(var i = 0, len = defData.length; i < len; i++){
					this.po.push(defData[i]);
				}
			}
		}
	};
	(function(_p){
		_p.init = function(){};
		_p.disp = function(){};
		_p.getAvailItem = function(key){
			for(var i = 0, len = this.po.length; i < len; i++){
				if(df(this.po[i])){
					return this.po[i];
				}
			}
			return this.getEmptyItem();
		};
		_p.getEmptyItem = function(){
			var ne = cf();
			this.po.push(ne);
			if(this.max && this.po.length > max){
				this.po.shift();
			}
			return ne;
		};
		_p.getItemByKey = function(key){
			for(var i = 0, len = this.po.length; i < len; i++){
				if(gf(this.po[i],key)){
					return this.po[i];
				}
			}
			return false;
		};
		_p.getAllItem = function(){
			return this.po;
		};
		_p.addItem = function(item){
			this.po.push(item);
			if(this.max && this.po.length > max){
				this.po.splice(0,1);
			}
		};
		_p.putInItems = function(items){
			for(var i = 0, len = items.length; i < len; i++){
				this.po.push(items[i]);
			}
			if(this.max && this.po.length > max){
				this.po.splice(0,this.po.length - max);
			}
		};
		_p.delItem = function(item){
			for(var i = 0, len = this.po.length; i < len; i++){
				if(this.po[i] == item){
					return this.po.splice(i,1);
				}
			}
			return false;
		};
		_p.delItemByKey = function(key){
			for(var i = 0, len = this.po.length; i < len; i++){
				if(gf(this.po[i],key)){
					return this.po.splice(i,1);
				}
			}
		};
	})(proxy.pool);
})(App);