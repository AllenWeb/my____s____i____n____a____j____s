/**
 * @author xy xinyu@staff.sina.com.cn
 * @fileoverview 日历组件
 */
$import("sina/sina.js");
$import("sina/jobs.js");
$import("sina/interface.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/removeEvent.js");
$import("sina/utils/template.js");
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/core/events/stopEvent.js");

App.calendar = function(){
};

App.calendar.prototype = {
    init: function(cnt, date, year, type, url){
        //判断是否已经初始化，初始化一次后就不再初始化------
        if (arguments.callee.done) {
            return;
        }
        arguments.callee.done = true;
        //------------------------------------------
        
        //初始化局部变量--------------------------------------------
        this._variable.date = date;//传入的时间
        this._variable.year = this._variable.date.split("-")[0] || "2009";
        this._variable.type = type || "day";//类型：day,week,month
        if (this._variable.date != "") 
            this._variable.month = this._variable.date.split("-")[1];
        else {
            var d = new Date();
            this._variable.month = d.getMonth() + 1;
        }
        
        this._variable.selectedMonth = this._variable.month;
        
        this._variable.selectedDate = this._variable.date;//用户点击后选择的时间，初始时和传入的时间一样
        this._variable.selectedYear = this._variable.year;//用户点击后选择的年份，目前为2009固定
        this._variable.selectedType = this._variable.type;//用户点击后选择的类型
        this._variable.url = url;//基础url
        this._variable.daysNumber = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31];//每月的基础天数，2月的润天另算
        //--------------------------------------------------------
        cnt.innerHTML = '<div class="cld">\
						<div class="cld_top">\
				    	<div class="cld_tab">\
						<ul id="topul"><li><a href="javascript:;">日</a></li><li><a href="javascript:;">周</a></li><li><a href="javascript:;">月</a></li></ul>\
						</div>\
						</div>\
						<div class="cld_mid" id="middlecnt"><div id="showday" class="cld_cont" style="display:none;"></div><div id="showweek" class="cld_cont" style="display:none;"></div><div id="showmonth" class="cld_cont" style="display:none;"></div>\
						<div class="cld_txt" id="cld_txt" style="display:none;">\
						<div class="cld_txtTop"></div>\
						<div class="cld_txtMid" id="cld_content">\
						'+$CLTMSG['CL0301']+'\
						</div>\
						<div class="cld_txtBot"></div>\
						</div>\
						</div>\
						<div class="cld_bottom"></div>\
						</div>';
        $Debug("this._variable.type=" + this._variable.type);
        this.getTop();
        if (this._variable.date != "") 
            this.getTips();
    },
    _variable: {},//存储局部变量
    show: function(cnt, date, year, type, url){
        this.init(cnt, date, year, type, url);
    },
    getTop: function(){//第一次生成日、周、月
        var type = this._variable.type;
        var tops = $E('topul').childNodes;
        var middles = $E('middlecnt').childNodes;
        for (var i = 0; i < tops.length; i++) 
            Core.Events.addEvent(tops[i], this.changeTop.bind2(this), 'click');
        switch (type) {
            case "day":
                tops[0].className = "cur";
                tops[0].innerHTML = "<strong>"+$CLTMSG['CL0302']+"</strong>";
                middles[0].style.display = "";
                this.getDay();
                break;
            case "week":
                tops[1].className = "cur";
                tops[1].innerHTML = "<strong>"+$CLTMSG['CL0303']+"</strong>";
                middles[1].style.display = "";
                this.getWeek();
                break;
            case "month":
                tops[2].className = "cur";
                tops[2].innerHTML = "<strong>"+$CLTMSG['CL0304']+"</strong>";
                middles[2].style.display = "";
                this.getMonth();
                break;
            default:
                tops[0].className = "cur";
                tops[0].innerHTML = "<strong>"+$CLTMSG['CL0302']+"</strong>";
                middles[0].style.display = "";
                this.getDay();
        };
            },
    getDay: function(){
        this._variable.selectedType = "day";
        if (arguments.callee.day) {
		
		}
		else {
			$E('showday').innerHTML = '<div class="cld_yearmonth2">\
        	<div class="cld_pre"><a href="javascript:;" title="'+$CLTMSG['CL0305']+'" id="prev1"></a></div>\
        	<div class="cld_ymTxt"><span class="cld_year" id="cld_year1">'+$CLTMSG['CL0307']+'</span><span class="cld_month" id="cld_month1">'+$CLTMSG['CL0308']+'</span></div>\
			<div class="cld_next"><a href="javascript:;" title="'+$CLTMSG['CL0306']+'" id="next1"></a></div>\
        	</div>\
		<div class="cld_week">\
			<span>'+$CLTMSG['CL0309']+'</span>\
            <span>'+$CLTMSG['CL0310']+'</span>\
            <span>'+$CLTMSG['CL0311']+'</span>\
            <span>'+$CLTMSG['CL0312']+'</span>\
            <span>'+$CLTMSG['CL0313']+'</span>\
            <span class="cld_weekend">'+$CLTMSG['CL0314']+'</span>\
			<span class="cld_weekend">'+$CLTMSG['CL0302']+'</span>\
            <div class="clear"></div>\
        </div>\
        <div class="cld_table">\
        <div class="cld_dayList" id="daylist"></div>\
		</div>';
		Core.Events.addEvent($E('prev1'), this.previousFunc.bind2(this), 'click');
		Core.Events.addEvent($E('next1'), this.nextFunc.bind2(this), 'click');
		arguments.callee.day=true;
		}
		
        $E('cld_year1').innerHTML = this._variable.selectedYear + $CLTMSG['CL0315'];
        $E('cld_month1').innerHTML = this._variable.selectedMonth + $CLTMSG["CL0304"];
        
        this.getDayList();
    },
    getDayList: function(){
    
//        this._variable.selectedMonth = parseInt($E('cld_month1').innerHTML);
        $Debug("this._variable.selectedMonth=" + this._variable.selectedMonth);
        $E('daylist').innerHTML = "";
        var position = this.getPosition(this._variable.selectedYear, this._variable.selectedMonth, 1);
        position = position == 0 ? 7 : position;
        $Debug("position=" + position);
        
        if (this.isLeapYear(this._variable.selectedYear)) 
            this._variable.daysNumber[2] = 29;
        
        $Debug("this._variable.selectedMonth=" + this._variable.selectedMonth);
        var tempd = position + this._variable.daysNumber[this._variable.selectedMonth];
        $Debug("tempd=" + tempd);
        var rows = Math.ceil(tempd / 7);
        $Debug("rows=" + rows);
        var divs = [];
        var toWhichDiv = 0;
        
        for (var i = 0; i < rows; i++) {
            divs[i] = $C('div');
            divs[i].className = "cld_line";
            $E('daylist').appendChild(divs[i]);
        }
        var count = 0;
        for (var j = position - 1; j > 0; j--, count++) {
            var sp = $C('span');
            sp.innerHTML = this._variable.daysNumber[this._variable.selectedMonth - 1] - j + 1;
            divs[Math.floor(count / 7)].appendChild(sp);
            
        }
        if (this._variable.type == "day" && this._variable.selectedMonth == this._variable.month) {
            var current = parseInt(this._variable.date.split('-')[2]);
        }
        for (var j = 1; j <= this._variable.daysNumber[this._variable.selectedMonth]; j++, count++) {
            var sp = $C('span');
            sp.innerHTML = '<a href="#">' + j + '</a>';
            if (current && current == j) 
                sp.className = "cur";
            sp.setAttribute("value", this._variable.selectedYear + "-" + this._variable.selectedMonth + "-" + j);
            Core.Events.addEvent(sp, this.clickFunc.bind2(this), 'click');
            divs[Math.floor(count / 7)].appendChild(sp);
            
        }
        var lastposition = this.getPosition(this._variable.selectedYear, this._variable.selectedMonth, this._variable.daysNumber[this._variable.selectedMonth]);
        lastposition = lastposition == 0 ? 7 : lastposition;
        $Debug("lastpositio=" + lastposition);
        if (lastposition != 0) {//当最后一天不是周日时
            for (var j = 1; j <= 7 - lastposition; j++) {
                var sp = $C('span');
                sp.innerHTML = j;
                divs[Math.floor(count / 7)].appendChild(sp);
                count++;
            }
        }
        
        
    },
    getWeek: function(day){
        $Debug("getweek");
        this._variable.selectedType = "week";
         if (arguments.callee.week) {
		 
		 }
		 else {
		 	$E('showweek').innerHTML = '<div class="cld_yearmonth2">\
        	<div class="cld_pre"><a href="javascript:;" title="'+$CLTMSG['CL0305']+'" id="prev2"></a></div>\
        	<div class="cld_ymTxt"><span class="cld_year" id="cld_year2">'+$CLTMSG['CL0307']+'</span><span class="cld_month" id="cld_month2">'+$CLTMSG['CL0308']+'</span></div>\
			<div class="cld_next"><a href="javascript:;" title="'+$CLTMSG['CL0306']+'" id="next2"></a></div>\
        	</div>\
			<div class="cld_week">\
			<span>'+$CLTMSG['CL0309']+'</span>\
            <span>'+$CLTMSG['CL0310']+'</span>\
            <span>'+$CLTMSG['CL0311']+'</span>\
            <span>'+$CLTMSG['CL0312']+'</span>\
            <span>'+$CLTMSG['CL0313']+'</span>\
            <span class="cld_weekend">'+$CLTMSG['CL0314']+'</span>\
			<span class="cld_weekend">'+$CLTMSG['CL0302']+'</span>\
            <div class="clear"></div>\
        </div>\
        <div class="cld_table">\
        <div class="cld_weekList" id="weeklist"></div>\
		</div>';
		Core.Events.addEvent($E('prev2'), this.previousFunc.bind2(this), 'click');
		Core.Events.addEvent($E('next2'), this.nextFunc.bind2(this), 'click');
		 arguments.callee.day=true;
		}
		 
		
        $E('cld_year2').innerHTML = this._variable.selectedYear + $CLTMSG['CL0315'];
        $E('cld_month2').innerHTML = this._variable.selectedMonth + $CLTMSG['CL0304'];
        this.getWeekList();
    },
    getWeekList: function(){
    
//        this._variable.selectedMonth = parseInt($E('cld_month2').innerHTML);
        $Debug("this._variable.selectedMonth=" + this._variable.selectedMonth);
        $E('weeklist').innerHTML = "";
        var position = this.getPosition(this._variable.selectedYear, this._variable.selectedMonth, 1);
        position = position == 0 ? 7 : position;
        $Debug("position=" + position);
        
        if (this.isLeapYear(this._variable.selectedYear)) 
            this._variable.daysNumber[2] = 29;
        
        $Debug("this._variable.selectedMonth=" + this._variable.selectedMonth);
        var tempd = position + this._variable.daysNumber[this._variable.selectedMonth];
        $Debug("tempd=" + tempd);
        var rows = Math.ceil(tempd / 7);
        $Debug("rows=" + rows);
        var divs = [];
        var anchor = [];
        var toWhichDiv = 0;
        
        for (var i = 0; i < rows; i++) {
            divs[i] = $C('div');
            divs[i].className = "cld_line";
            anchor[i] = $C('a');
            anchor[i].href = "#";
            anchor[i].onclick = "return false;";
            divs[i].appendChild(anchor[i]);
            $E('weeklist').appendChild(divs[i]);
        }
        var count = 0;
        for (var j = position - 1; j > 0; j--, count++) {
            var sp = $C('span');
            sp.innerHTML = this._variable.daysNumber[this._variable.selectedMonth - 1] - j + 1;
            if (this._variable.selectedMonth == 1) 
                sp.setAttribute("value", (parseInt(this._variable.selectedYear) - 1) + "-12-" + (this._variable.daysNumber[this._variable.selectedMonth - 1] - j + 1));
            else 
                sp.setAttribute("value", this._variable.selectedYear + "-" + (parseInt(this._variable.selectedMonth) - 1) + "-" + (this._variable.daysNumber[this._variable.selectedMonth - 1] - j + 1));
            Core.Events.addEvent(sp, this.clickFunc.bind2(this), 'click');
            anchor[Math.floor(count / 7)].appendChild(sp);
            
        }
        
        if (this._variable.type == "week" && this._variable.selectedMonth == this._variable.month) {
            var current2 = parseInt(this._variable.date.split('-')[2]);
        }
        for (var j = 1; j <= this._variable.daysNumber[this._variable.selectedMonth]; j++, count++) {
            var sp = $C('span');
            sp.innerHTML = j;
            if (current2 && current2 == j) 
                divs[Math.floor(count / 7)].className = "cld_line cld_weekclick";
            sp.setAttribute("value", this._variable.selectedYear + "-" + this._variable.selectedMonth + "-" + j);
            Core.Events.addEvent(sp, this.clickFunc.bind2(this), 'click');
            anchor[Math.floor(count / 7)].appendChild(sp);
            
        }
        var lastposition = this.getPosition(this._variable.selectedYear, this._variable.selectedMonth, this._variable.daysNumber[this._variable.selectedMonth]);
        lastposition = lastposition == 0 ? 7 : lastposition;
        $Debug("lastpositio=" + lastposition);
        if (lastposition != 0) {//当最后一天不是周日时
            for (var j = 1; j <= 7 - lastposition; j++) {
                var sp = $C('span');
                sp.innerHTML = j;
                if (this._variable.selectedMonth == 12) 
                    sp.setAttribute("value", (parseInt(this._variable.selectedYear) + 1) + "-1-" + j);
                else 
                    sp.setAttribute("value", this._variable.selectedYear + "-" + (parseInt(this._variable.selectedMonth) + 1) + "-" + j);
                Core.Events.addEvent(sp, this.clickFunc.bind2(this), 'click');
                anchor[Math.floor(count / 7)].appendChild(sp);
                count++;
            }
        }
        
        
    },
    getMonth: function(){
        //		$Debug("enter getmonth");
        this._variable.selectedType = "month";
        //判断是否已经初始化，初始化一次后就不再初始化------
        if (arguments.callee.month) {
            
        }else{
			 $E('showmonth').innerHTML = '<div class="cld_yearmonth2">\
							        	<div class="cld_pre"><a href="javascript:;" title="'+$CLTMSG['CL0316']+'" id="prev3"></a></div>\
							        	<div class="cld_ymTxt"><span class="cld_year" id="cld_year3">'+$CLTMSG['CL0315']+'</span></div>\
										<div class="cld_next"><a href="javascript:;" title="'+$CLTMSG['CL0317']+'" id="next3"></a></div>\
						        	</div>\
									<div class="cld_table">\
           								<div class="cld_monthList" id="monthlist">\
						             </div>\
						           <div class="clear"></div>\
						         </div>';
		 Core.Events.addEvent($E('prev3'), this.previousFunc.bind2(this), 'click');
		 Core.Events.addEvent($E('next3'), this.nextFunc.bind2(this), 'click');
		 arguments.callee.day=true;
		}
        
        //------------------------------------------

        if (this._variable.type == "month") 
            var month = this._variable.month;

       
		$Debug("this._variable.selectedYear="+this._variable.selectedYear);
		
		 $E('cld_year3').innerHTML=parseInt(this._variable.selectedYear)+$CLTMSG['CL0315'];
        var monthlist = $E('monthlist');
		monthlist.innerHTML="";
        //填写12个月-------------------------
        for (var i = 1; i < 13; i++) {
            var sp = $C("span");
            if (month && month == i) {
                sp.className = "cur";
            }
            sp.setAttribute("value", this._variable.selectedYear + "-" + i);
            var a = $C('a');
            sp.appendChild(a);
            a.innerHTML = i + $CLTMSG['CL0304'];
            a.href = "#"
            Core.Events.addEvent(a, this.clickFunc.bind2(this), 'click');
            monthlist.appendChild(sp);
        }
        //-----------------------------------
    
    },
    changeTop: function(){//更换选择日、周、月
        var clickedObj = "";
        var e = Core.Events.fixEvent(Core.Events.getEvent());
        if (e.target.tagName == "A" || e.target.tagName == "STRONG") 
            clickedObj = e.target.parentNode;
        else 
            if (e.target.tagName == "LI") 
                clickedObj = e.target;
        var tops = $E('topul').childNodes;
        var middles = $E('middlecnt').childNodes;
        for (var i = 0; i < tops.length; i++) {
            if (tops[i] == clickedObj) {
                middles[i].style.display = "";
            }
            else {
                middles[i].style.display = "none";
            }
        }
        
        for (var i = 0; i < tops.length; i++) {
        
            if (tops[i] == clickedObj) {
                middles[i].style.display = "";
                switch (i) {
                    case 0:
                        tops[0].className = "cur";
                        tops[0].innerHTML = "<strong>"+$CLTMSG['CL0302']+"</strong>";
                        tops[1].className = "";
                        tops[1].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0303']+'</a>';
                        tops[2].className = "";
                        tops[2].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0304']+'</a>';
                        this.getDay();
                        break;
                    case 1:
                        tops[1].className = "cur";
                        tops[1].innerHTML = "<strong>"+$CLTMSG['CL0303']+"</strong>";
                        tops[0].className = "";
                        tops[0].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0302']+'</a>';
                        tops[2].className = "";
                        tops[2].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0304']+'</a>';
                        this.getWeek();
                        break;
                    case 2:
                        tops[2].className = "cur";
                        tops[2].innerHTML = "<strong>"+$CLTMSG['CL0304']+"</strong>";
                        tops[1].className = "";
                        tops[1].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0303']+'</a>';
                        tops[0].className = "";
                        tops[0].innerHTML = '<a href="javascript:;">'+$CLTMSG['CL0302']+'</a>';
                        this.getMonth();
                        break;
                        
                };
                            }
            
            
        }
        
    },
    clickFunc: function(){
        var clickedObj = "";
        var e = Core.Events.fixEvent(Core.Events.getEvent());
        if (e.target.tagName == "SPAN") 
            clickedObj = e.target;
        else 
            if (e.target.tagName == "A" && e.target.parentNode.tagName == "SPAN") 
                clickedObj = e.target.parentNode;
        if (this._variable.selectedType == "day") {
        
            var dayrows = $E('daylist').childNodes;
            for (var i = 0; i < dayrows.length; i++) {
                var days = dayrows[i].childNodes;
                for (var j = 0; j < days.length; j++) 
                    days[j].className = "";
            }
            clickedObj.className = "cur";
        }
        else 
            if (this._variable.selectedType == "week") {
            
                var dayrows = $E('weeklist').childNodes;
                for (var i = 0; i < dayrows.length; i++) {
                    var days = dayrows[i].childNodes[0].childNodes;
                    for (var j = 0; j < days.length; j++) 
                        days[j].parentNode.parentNode.className = "cld_line";
                }
                clickedObj.parentNode.parentNode.className = "cld_line cld_weekclick";
            }
            else {
                var months = $E('monthlist').childNodes;
                for (var i = 0; i < months.length; i++) 
                    months[i].className = "";
                clickedObj.className = "cur";
            }
        this._variable.type = this._variable.selectedType;
        this._variable.selectedDate = clickedObj.getAttribute("value");//得到当前选择的date类型及数据
        this._variable.selectedMonth = this._variable.selectedDate.split('-')[1];
        this._variable.month = this._variable.selectedMonth;
        
        if (this._variable.selectedDate.split('-').length == 3) {
            this._variable.date = this._variable.selectedDate;
        }
        $Debug(123);
        //		$Debug(this._variable.url+";"+this._variable.selectedType+";"+this._variable.selectedDate);
        var str = this._variable.url + "&dtype=" + this._variable.selectedType + "&time=" + this._variable.selectedDate;
        window.location.href = str;
        $Debug(window.location.href);
        $Debug("this._variable.selectedType=" + this._variable.selectedType);
    },
    isLeapYear: function(date){
    
        date = parseInt(date);
        if (date % 4 == 0) {
            if (date % 100 != 0) {
                return true;
            }
            else {
                if (date % 400 == 0) 
                    return true;
                else 
                    return false;
            }
        }
        return false;
    },
    getPosition: function(year, month, day){//得到每月一号是星期几，2009年1月1号为星期4
        var date = new Date(year, month - 1, day);
        return date.getDay();
    },
    getTips: function(){
        $E('cld_txt').style.display = "";
        var str = $CLTMSG['CL0301'];
		var tmplate;
        if (this._variable.type == "day") {
            var tmp = this._variable.date.split("-");
			tmplate = new Utils.Template($CLTMSG['CL0318']);
           // str = '你看到的是：<br />' + tmp[0] + "年" + tmp[1] + "月" + tmp[2] + "日" + '<br />发布的微博<a href="' + $E('calendarurl').value + '">取消时间限制</a>';
		   str = tmplate.evaluate({year:tmp[0],month:tmp[1],day:tmp[2],urlhref:$E('calendarurl').value});
        }
        else 
            if (this._variable.type == "month") {
                var tmp = this._variable.date.split("-");
				tmplate = new Utils.Template($CLTMSG['CL0319']);
                //str = '你看到的是：<br />' + tmp[0] + "年" + tmp[1] + "月" + '<br />发布的微博<a href="' + $E('calendarurl').value + '">取消时间限制</a>';
				 str = tmplate.evaluate({year:tmp[0],month:tmp[1],day:tmp[2],urlhref:$E('calendarurl').value});
            }
            else {
				var tmp = this.getWeekStr(this._variable.date);
				tmplate = new Utils.Template($CLTMSG['CL0320']);
                //str = '你看到的是：<br />' + this.getWeekStr(this._variable.date) + '<br />发布的微博<a href="' + $E('calendarurl').value + '">取消时间限制</a>';
				str = tmplate.evaluate({time:tmp,urlhref:$E('calendarurl').value});
            }
        $E('cld_content').innerHTML = str;
    },
    getWeekStr: function(str){
        $Debug("str=" + str);
        var t = str.split("-");
        var tmpstr = "";
        var d = new Date(t[0], parseInt(t[1]) - 1, t[2]);
        var position = d.getDay();
        position = position == 0 ? 7 : position;
        $Debug("position=" + position);
        var seq = d.getDate();
        $Debug("seq=" + seq);
        if (seq <= 7) {
            if (this.getPosition(t[0], t[1], 1) == 1) {
                tmpstr += t[0] + $CLTMSG['CL0315'] + t[1] + $CLTMSG['CL0321'] + t[0] + $CLTMSG['CL0315'] + t[1] + $CLTMSG['CL0322'];
            }
            else {
                tmpstr += parseInt(t[1]) == 1 ? (parseInt(t[0]) - 1) : t[0];
                tmpstr += $CLTMSG['CL0315'];
                tmpstr += parseInt(t[1]) == 1 ? 12 : (parseInt(t[1]) - 1);
                tmpstr += $CLTMSG["CL0304"];
                tmpstr += this._variable.daysNumber[parseInt(t[1]) == 1 ? 12 : parseInt(t[1]) - 1] - position + 2;
                tmpstr += $CLTMSG["CL0323"];
                tmpstr += t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) + 7 - position) + $CLTMSG["CL0302"];
            }
        }
        else 
            if (seq <= (this._variable.daysNumber[parseInt(t[1])] - 7)) {
                //			$Debug("2");
                tmpstr += t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) - position + 1) + $CLTMSG["CL0323"] + t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) + 7 - position) + $CLTMSG["CL0302"];
            }
            else {
                if (position != 7) {
                    //$Debug("<<<<<<<<<,");
                    tmpstr += t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) - position + 1) + $CLTMSG["CL0323"];
                    tmpstr += parseInt(t[1]) == 12 ? 2010 : 2009;
                    tmpstr += $CLTMSG["CL0315"];
                    tmpstr += parseInt(t[1]) == 12 ? 1 : (parseInt(t[1]) + 1);
                    tmpstr += $CLTMSG["CL0304"];
                    tmpstr += (position - 1 == 0) ? 6 : (position - 1);
                    tmpstr += $CLTMSG["CL0302"]
                }
                else {
                    //$Debug(">>>>>>>>>>>>");
                    tmpstr += t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) - position + 1) + $CLTMSG["CL0323"] + t[0] + $CLTMSG["CL0315"] + t[1] + $CLTMSG["CL0304"] + (parseInt(t[2]) + 7 - position) + $CLTMSG["CL0302"];
                }
            }
        
        
        return tmpstr;
    },
	previousFunc:function(){
		$Debug("pre");
//		$Debug(parseInt($E('cld_year').innerHTML));
		if(this._variable.selectedType=="month"){
			//$E('cld_year3').innerHTML=(parseInt($E('cld_year3').innerHTML)-1)+"年";
			//$Debug(parseInt($E('cld_year3').innerHTML));
			this._variable.selectedYear=parseInt(this._variable.selectedYear)-1;
			this.getMonth();
		}else if(this._variable.selectedType=="week"){
			if(this._variable.selectedMonth=="1"){
				this._variable.selectedMonth=12;
				this._variable.selectedYear=parseInt(this._variable.selectedYear)-1;
			}else{
				
				this._variable.selectedMonth=parseInt(this._variable.selectedMonth)-1;
			}
			this.getWeek();
		}else{
			if(this._variable.selectedMonth=="1"){
				this._variable.selectedMonth=12;
				this._variable.selectedYear=parseInt(this._variable.selectedYear)-1;
			}else{
				
				this._variable.selectedMonth=parseInt(this._variable.selectedMonth)-1;
			}
			this.getDay();
		}
		Core.Events.stopEvent();
	},
	nextFunc:function(){
		$Debug("next");
//		$Debug(parseInt($E('cld_year3').innerHTML));
		if(this._variable.selectedType=="month"){
			//$E('cld_year3').innerHTML=(parseInt($E('cld_year3').innerHTML)+1)+"年";
			//$Debug(parseInt($E('cld_year3').innerHTML));
			this._variable.selectedYear=parseInt(this._variable.selectedYear)+1;
			this.getMonth();
		}else if(this._variable.selectedType=="week"){
			if(this._variable.selectedMonth=="12"){
				this._variable.selectedMonth=1;
				this._variable.selectedYear=parseInt(this._variable.selectedYear)+1;
			}else{
				
				this._variable.selectedMonth=parseInt(this._variable.selectedMonth)+1;
			}
			this.getWeek();
		}else{
			if(this._variable.selectedMonth=="12"){
				this._variable.selectedMonth=1;
				this._variable.selectedYear=parseInt(this._variable.selectedYear)+1;
			}else{
				
				this._variable.selectedMonth=parseInt(this._variable.selectedMonth)+1;
			}
			this.getDay();
		}
		Core.Events.stopEvent();
	}
    
};


$registJob('calendar', function(){
    var calendar = new App.calendar();
    var date, type, year, url;
    var originalDay = $E('orignalDate').value;//"day|2009-06-06";//得到页面上传入的初始的天或月，包括类型
    if (originalDay != "|") {
//        originalDay = originalDay.replace(/20(08|10)\S*$/, function(a, b){
//            return (b == "08") ? '2009-01-01' : '2009-12-31';
//        });//取消了时间限制
        date = originalDay.match(/\|(\S+)/)[1];//2009-06-20
        type = originalDay.match(/(\w+)\|/)[1]; //day,week,month
        year = originalDay.match(/\|(\d+)/)[1]; //2009
    }
    else {
        date = "";
        type = "";
        year = "2009";
    }
    
    
    url = $E('calendarurl').value; //"http://app.pengyou.sina.com.cn/record/?act=myrecord&type=4&sendfrom=0";
    calendar.show($E('calendarcnt'), date, year, type, url);
});
