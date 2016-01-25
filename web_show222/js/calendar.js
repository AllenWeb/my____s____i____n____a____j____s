
//*********************课程表部分********************** 
var seacherValue;
var Class = { 
    create: function() { 
        return function() { 
            this.initialize.apply(this, arguments); 
        }; 
    } 
} 
//*********************Jcalendar类开始********************** 
var Jcalendar =  Class.create(); 
Jcalendar.prototype = { 
    initialize:function(){ 
        var $ = new Date(); 
        this.drawCalendar($.getFullYear(),$.getMonth() + 1,$.getDate(),seacherValue);
    }, 
    fillArray : function(year,month){ 
        var f = new Date(year, month -1  ,1).getDay(), //求出当月的第一天是星期几 
        dates = new Date(year, month , 0).getDate(),//上个月的第零天就是今个月的最后一天 
        arr = new Array(35);//用来装载日期的数组，日期以‘xxxx-xx-xx’的形式表示 0
        for(var i = 0; i < dates ; i ++ ,f ++){ 
            arr[f] = year +'-'+ month +'-'+ (i+1) ; 
        } 
        return arr;
    }, 
    drawCalendar : function(year,month,date,value){ 
		value=seacherValue;
        var $ = document,$$ = 'createElement', 
        _calendar = $.getElementById("jcalendar"); 
        if(_calendar) _calendar.parentNode.removeChild(_calendar);
		var content3 = $.getElementById("content3");		
        var weeks = "日,一,二,三,四,五,六".split(',');
        var calendar = $[$$]('div'),	
        a =  $[$$]('a'),		
        tt =  $[$$]("tt"),	
        thead = $[$$]('span'),
		seacher = $[$$]('span'),
        fragment = $.createDocumentFragment(),    	
		arr = this.fillArray(year,month),
        tts = [],
        ths = this;
		content3.appendChild(calendar); 		
		
        //body.insertBefore(calendar,null);//把日历加入DOM树中 
        calendar.setAttribute('id','jcalendar'); 
        for(var i = 0;i<4;i++){//循环生成出个时间按钮。 
            var clone = tt.cloneNode(true);//比重新createElement快 
            clone.onclick =  (function(index,seacherValue){ 
                return function(){//在闭包里绑定事件 
                    ths.redrawCalendar(year,month,date,index,seacherValue);
                } 
            })(i,seacherValue); 
            tts[i] = clone;//保存引用
			var _month=month;
			var _date=date;
			if(month<10){_month='0'+month}
			if(date<10){_date='0'+date}
            if(i==2) thead.appendChild($.createTextNode(year+"年"+_month+"月"+_date+"日")); 
            thead.appendChild(clone);
        } 
        tts[0].innerHTML = '<img src="images/y_front.jpg"></img>'; 
        tts[1].innerHTML = '<img src="images/m_front.jpg"></img>'; 
        tts[2].innerHTML = '<img src="images/m_next.jpg"></img>'; 
        tts[3].innerHTML = '<img src="images/y_next.jpg"></img>'; 
        tts[0].className = tts[3].className = tts[1].className = tts[2].className ='button'; 
		thead.className = "tit";
		seacher.className = "seacher";//创建搜索栏
		s_text = $[$$]('input');
		s_text.setAttribute('id','s_value');
		s_text.setAttribute('type','text'); 
		s_text.setAttribute('size',28);
		s_button = $[$$]('input');
		s_button.setAttribute('id','s_button');
		s_button.setAttribute('type','button'); 
		s_button.className = ' s_button'
		seacher.appendChild(s_text);
		seacher.appendChild(s_button);
		s_button.onclick = (function(value){ 
               		 return function(){//在闭包里绑定事件 
                		    ths.seacher(s_text.value); 
               		 } 
           		 })(s_text.value); 
        fragment.appendChild(thead);
		fragment.appendChild(seacher); 
        for(i = 0;i <7;i++){//星期显示区 
            var th = a.cloneNode(true); 
            th.innerHTML = "星期" + weeks[i]; 
            th.className = 'week'; 
            fragment.appendChild(th); 
        } 
        for(i = 0;i <35;i++){//日期显示区            
			var ls =  $[$$]('div');
			var td = a.cloneNode(true);
			var kc =  $[$$]('div');
			ls.className = 'ls';
			ls.appendChild(td);
			ls.appendChild(kc);	
            if(arr[i] == undefined ){
				td.className = 'null_day'; 
				kc.className = 'null_kc';
                fragment.appendChild(ls);
            }else{ 
                var html = arr[i].split('-')[2]; 
                td.innerHTML = html+"日"; 
                td.className = 'day'; 
				kc.className = 'kc';
                td.href = "javascript:void(0)";//为ie6准备的 
                kc.id = arr[i];
                (i%7 == 0 || i%7 == 6)&&(td.className += ' weekend') ;//为周末添加多一个类
				(date && html == date)&&(td.className = ' current',kc.className ='current2');//高亮每个月今天这一天 	
                ls.onclick = (function(index,value){ 
               		 return function(){//在闭包里绑定事件 
                		    ths.rethead(year,month,date,index,value); 				

		
               		 } 
           		 })(html,seacherValue); 
				fragment.appendChild(ls);
            } 
        } 
        calendar.appendChild(fragment);
		for(i=0;i<json.fields.length;i++){
			var _id = json.fields[i].time;
			var a = document.getElementById(_id);
			if(a){
				for(j=0;j<json.fields[i].lesson.length;j++){
					a.innerHTML+='<p class="lesson">'+json.fields[i].lesson

[j].les+'</p>';
				}				
			}
		}
		var reg = new RegExp(".{0,}"+value+".{0,}","i");
		var jcalendar = document.getElementById("jcalendar");
		var _p = jcalendar.getElementsByTagName('p');
		for(i=0;i<_p.length;i++){
			if(reg.test(_p[i].innerHTML)&&seacherValue!=""){
				_p[i].className="s_lesson";
			}else{
				_p[i].className="lesson";
			}		
		}
    }, 
	seacher : function(value){		
		var isseacher = false;
		var reg = new RegExp(".{0,}"+value+".{0,}","i");
		var jcalendar = document.getElementById("jcalendar");
		var _p = jcalendar.getElementsByTagName('p');
		for(i=0;i<_p.length;i++){
			if(reg.test(_p[i].innerHTML)&&value!=""){
				_p[i].className="s_lesson";
				isseacher = true;
				seacherValue=value;
			}else{
				_p[i].className="lesson";
			}		
		}
		if(value=="") alert("注意：搜索数据不能为空");
		else if(!isseacher) alert("抱歉，没有找到你搜索的相关课程。");
	},
  	rethead : function(year,month,date,index,value){		
		date=index;
		this.drawCalendar(year,month,date,value);
	},
    redrawCalendar : function(year,month,date,index,value){ 
        switch(index){ 
            case 0 ://preyear 
                year--; 
               break; 
            case 1://premonth 
                month--; 
                (month < 1) &&(year--,month = 12)  ; 
                break; 
            case 2://nextmonth 
                month++;                 
                (month > 12)&&(year++,month = 1) ; 
                break; 
            case 3://nextyear 
                year++; 
                break; 
        }
        this.drawCalendar(year,month,date,value);
    }
} 
//*********************Jcalendar类结束**************s******** 