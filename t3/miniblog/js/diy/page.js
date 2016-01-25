$import("sina/sina.js");
$import("sina/app.js");
$import("diy/builder.js");

(function(proxy){
	/**
	 * spec.total
	 * spec.size
	 * spec.fire
	 * spec.outNum
	 */
	var buttonTempLate = [{'tagName':'a','attributes':{'class':'btn_num','id':'outer','href':'javascript:void(0);'},'childList':[
		{'tagName':'em','attributes':{'id':'inner'}}
	]}];
	proxy.page = function(spec){
		var that	= {};
		var total	= spec.total;
		var size	= spec.size;
		var num		= Math.floor(total/size) + (total%size?1:0);
		var outNum	= spec.outNum || 11;
		var current = 0;
		var list	= [];
		var box		= document.createElement('div');
			box.className = 'fanye rt';
			
		var init	= function(){
			num = Math.floor(total/size) + (total%size?1:0);
			list[outNum - 1].domList['inner'].innerHTML = num;
			list[outNum - 1].number = num - 1;
		};
		
		var bind	= function(item){
			Core.Events.addEvent(
				item.domList['outer'],
				function(){go(item.number)},
			'click');
		};
		
		var prev	= new App.Builder(buttonTempLate,box);
			prev.domList['inner'].innerHTML = $CLTMSG['CX0076'];
			Core.Events.addEvent(
				prev.domList['outer'],
				function(){go(current - 1)},
			'click');
		
		for(var i = 0, len = outNum; i < len; i += 1){
			var item = new App.Builder(buttonTempLate,box)
			list.push(item);
			bind(item);
		}
		list[0].domList['inner'].innerHTML = 1;
		list[0].number = 0;
		list[outNum - 1].domList['inner'].innerHTML = num;
		list[outNum - 1].number = num - 1;
		
		var next = new App.Builder(buttonTempLate,box);
			next.domList['inner'].innerHTML = $CLTMSG['CX0077'];
			Core.Events.addEvent(
				next.domList['outer'],
				function(){go(current + 1)},
			'click');
		
		var pointsPrve = document.createElement('SPAN');
			pointsPrve.innerHTML = '...';
			box.insertBefore(pointsPrve,list[1].domList['outer']);
		var pointsNext = document.createElement('SPAN');
			pointsNext.innerHTML = '...';
			box.insertBefore(pointsNext,list[outNum - 1].domList['outer']);
		
		var succedaneum = document.createElement('SPAN');
		
		
		
		var getStart = function(current){
			if(current >= num || current < 0){
				throw 'page size error';
			}
			if(num <= outNum){
				return 1;
			}
			if(current <= outNum/2){
				return 1;
			}
			if(current >= num - 1 - outNum/2){
				return (num - 1 - (outNum - 2));
			}
			return (current - Math.floor(outNum/2) + 1);
		};
		
		var rend = function(start,len){
			if(start > 1){
				pointsPrve.style.display = '';
			}else{
				pointsPrve.style.display = 'none';
			}
			if(start < num - (outNum - 2) - 1){
				pointsNext.style.display = '';
			}else{
				pointsNext.style.display = 'none';
			}
			for(var i = 0; i < len; i += 1){
				list[i+1].domList['inner'].innerHTML = start + i + 1;
				list[i+1].domList['outer'].style.display = '';
				list[i+1].number = start + i;
			}
			for(var i = len; i < outNum -2; i += 1){
				list[i+1].domList['outer'].style.display = 'none';
			}
			list[0].domList['outer'].style.display = '';
			if(num == 1){
				list[outNum - 1].domList['outer'].style.display = 'none';
			}else{
				list[outNum - 1].domList['outer'].style.display = '';
			}
		};
		
		var light = function(current){
			if(current <= 0){
				prev.domList['outer'].style.display = 'none';
			}else{
				prev.domList['outer'].style.display = '';
			}
			
			if(current >= num - 1){
				next.domList['outer'].style.display = 'none';
			}else{
				next.domList['outer'].style.display = '';
			}
			for(var i = 0, len = list.length; i < len; i += 1){
				if(list[i].number == current && list[i].domList['outer'].style.display !== 'none'){
					box.insertBefore(succedaneum,list[i].domList['outer']);
					succedaneum.innerHTML = current + 1;
					list[i].domList['outer'].style.display = 'none';
					return
				}
			}
		};
		
		var go = function(n){
			rend(getStart(n),Math.min(outNum,num) - 2);
			light(n);
			current = n;
			spec.fire(size*n,size);
		};
		that.go = go;
		that.get = function(key){
			if(key == 'box'){
				return box;
			}
		};
		that.set = function(key,value){
			if(key == 'total'){
				total = value;
				init();
			}
		}
		return that;
	}
})(App);