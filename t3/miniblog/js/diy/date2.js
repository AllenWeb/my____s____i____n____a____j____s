/**
 * @author haidong@staff.sina.com.cn
 * 日期选择函数 yanghao copy date.js
 */
$import("sina/sina.js");
if(!domkey){
	var domkey = {};
}
domkey.Date2 = function(parentObj,dateFun,year,month,startDate,decDays){
	var _this=this;
	_this.startDate=startDate||new Date();
	_this.decDays=decDays||7;
	var C = function(tagName){
		return document.createElement(tagName);
	};
	var E=function(id){
		return document.getElementById(id);
	};
	var dateNum = function(year,month){
		var length = 0;
		var runFeb = year%400 ? (year%4 ? false : (year%100 ? true : false)) : true;
		switch (parseInt(month)){
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				length = 31;
				break;
			case 3:
			case 5:
			case 8:
			case 10:
				length = 30;
				break;
			case 1:
				if(runFeb){
					length = 29;
				}else{
					length = 28;
				}
		}
		return length;
	};
	this.year = year || (new Date()).getFullYear();
	this.month = month || (new Date()).getMonth();
	this.fun = dateFun || function(){};
	//new Obj
	var oYearandMonth = C("DIV");
	var oMonth = C("SELECT");
	var oYear = C("DIV");
	var oYearInput = C("INPUT");
	var oYearUp = C("INPUT");
	var oYearDown = C("INPUT");
	var oWeek = C("UL");
	this.oDate = C("UL");
	//add Class
	oYearandMonth.className = "selector";
	oMonth.className = "month";
	oYear.className = "year";
	oYearInput.className = "yearval";
	oYearUp.className = "yearbtn";
	oYearDown.className = "yearbtn2";
	oWeek.className = "weeks";
	this.oDate.className = "days";
	//add Type
	oYearUp.type = "button";
	oYearDown.type = "button";
	//operation
	var showDate = function(fun,yearNum,monthNum){
		_this.curYear = yearNum || (new Date().getFullYear());
		_this.curMonth = monthNum || (new Date().getMonth());
		_this.whiteDay = (new Date(_this.curYear,_this.curMonth,1)).getDay();
		_this.length = dateNum(_this.curYear,_this.curMonth);

		_this.setDateInterval(_this.startDate,_this.decDays);
		
	};
	
	for(var i = 0; i < this.monthText.length; i++){
		oMonth.options[oMonth.length] = new Option(this.monthText[i],i);
	}
	for(var i = 0; i < this.weekText.length; i++){
		var oDay = C("LI");
		oDay.innerHTML = this.weekText[i];
		oWeek.appendChild(oDay);
	}
	oYearandMonth.appendChild(oMonth);
	oYearandMonth.appendChild(oYear);
	oYear.appendChild(oYearInput);
	oYear.appendChild(oYearUp);
	oYear.appendChild(oYearDown);
	parentObj.appendChild(oYearandMonth);
	parentObj.appendChild(oWeek);
	parentObj.appendChild(this.oDate);
	//add value
	oMonth.value = this.month;
	oYearInput.value = this.year;
	oMonth.onchange = function(){
		showDate(dateFun,parseInt(oYearInput.value),oMonth.value);
	};
	oYearUp.onclick = function(){
		var newYear = parseInt(oYearInput.value) + 1;
		oYearInput.value = newYear;
		showDate(dateFun,parseInt(oYearInput.value),oMonth.value);
	};
	oYearDown.onclick = function(){
		var newYear = parseInt(oYearInput.value) - 1;
		oYearInput.value = newYear;
		showDate(dateFun,parseInt(oYearInput.value),oMonth.value);
	};
	oYearInput.onfocus = function(){this.blur();};
	showDate(dateFun);
};
domkey.Date2.prototype = {
	monthText : [$CLTMSG['CL0501'],$CLTMSG['CL0502'],$CLTMSG['CL0503'],$CLTMSG['CL0504'],$CLTMSG['CL0505'],$CLTMSG['CL0506'],$CLTMSG['CL0507'],$CLTMSG['CL0508'],$CLTMSG['CL0509'],$CLTMSG['CL0510'],$CLTMSG['CL0511'],$CLTMSG['CL0512']],
	weekText : [$CLTMSG['CL0302'],$CLTMSG['CL0309'],$CLTMSG['CL0310'],$CLTMSG['CL0311'],$CLTMSG['CL0312'],$CLTMSG['CL0313'],$CLTMSG['CL0314']],
	
	setDateInterval:function(startDate,decDays){
		var _this=this;
		var end  = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
		var from = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
		from.setHours(decDays*-24);

		
		_this.oDate.innerHTML = "";
		for(var i = 0; i < _this.whiteDay; i++){
			_this.oDate.appendChild($C("LI"));
		}
		
		for(var i = 0; i < this.length; i++){
			var dLi = $C("LI");
			dLi.id="liCalendar";
			var cur = new Date(_this.curYear,_this.curMonth,i);			
			if(cur.getTime() >= from.getTime() && cur.getTime() < end.getTime()){
				var dA = $C("A");
				dA.href = "#date";
				dA.setAttribute("day",i);
				dA.onclick = function(){
					_this.fun(_this.curYear,_this.curMonth,this.getAttribute("day"));
				};
				dA.innerHTML = "<strong>"+(i+1)+"</strong>";
				dLi.appendChild(dA);	
			}else{					
					dLi.innerHTML = i+1;
					dLi.title     = ""	;				
			}		
			_this.oDate.appendChild(dLi);
		}
	}
};