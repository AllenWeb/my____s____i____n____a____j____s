$import("sina/sina.js");
$import("sina/app.js");

App.timer = new function(){
	this.list = {};
	this.refNum = 0;
	this.clock = null;	
	this.allpause = false;
	this.delay = 25;

	this.add = function(fun){
		if(typeof fun != 'function'){
			throw('The timer needs add a function as a parameters');
		}
		var key = '' 
			+ (new Date()).getTime()
			+ (Math.random())*Math.pow(10,17);
			
		this.list[key] = {'fun' : fun,'pause' : false};
		if(this.refNum <= 0){
			this.start();
		}
		this.refNum ++;
		return key;
	};

	this.remove = function(key){
		if(this.list[key]){
			delete this.list[key];
			this.refNum --;
		}
		if(this.refNum <= 0){
			this.stop();
		}
	};

	this.pause = function(key){
		if(this.list[key]){
			this.list[key]['pause'] = true;
		}
	};
	
	this.play = function(key){
		if(this.list[key]){
			this.list[key]['pause'] = false;
		}
	};

	this.stop = function(){
		clearInterval(this.clock);
		this.clock = null;
	};
	
	this.start = function(){
		var _this = this;
		this.clock = setInterval(
			function(){
				_this.loop.apply(_this)
			},
			this.delay
		);
	};
	
	this.loop = function(){
		for(var k in this.list){
			if(!this.list[k]['pause']){
				this.list[k]['fun']();
			}
		}
	};
};
