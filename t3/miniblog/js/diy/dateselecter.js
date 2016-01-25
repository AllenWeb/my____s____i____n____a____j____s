/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/app.js");
$import("sina/core/events/addEvent.js");

(function(proxy){
	var dateNum = function(y,m){
		var isLeap = function(y){
			return y%400?(y%100?(y%4?0:1):0):1;
		};
		if(!(y*m)){return 0;}
		var d = 31;
		switch(m){
			case 4:
			case 6:
			case 9:
			case 11:
				d = 30;
				break;
			case 2:
				d = isLeap(y) ? 29 : 28;
				break;
		}
		return d;
	};
	var operItem = function(dom,n){
		var ov = parseFloat(dom.value) || 0;
		while(dom.options.length > 1){
			dom.remove(1);
		}
		dom.remove(0);
		dom.options[0] = new Option("",0);
		for(var i = 1; i <=n; i++){
			dom.options[dom.options.length] = new Option(i,i);
		}
		dom.value = Math.min(ov,n);
	};
	App.selecter = function(year,month,date,value){
		var sel = function(){
			//parseInt("08")===0;兼容IE
			operItem(date,dateNum(parseInt(year.value),parseFloat(month.options[month.selectedIndex].text)));
		};
		Core.Events.addEvent(year, sel, 'change');
		Core.Events.addEvent(month, sel, 'change');
		sel();
		date.value = value || "0";
	};
})(App);