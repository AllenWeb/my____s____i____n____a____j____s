
//*********************�γ̱���********************** 
var seacherValue;
var Class = { 
    create: function() { 
        return function() { 
            this.initialize.apply(this, arguments); 
        }; 
    } 
} 
//*********************Jcalendar�࿪ʼ********************** 
var Jcalendar =  Class.create(); 
Jcalendar.prototype = { 
    initialize:function(){ 
        var $ = new Date(); 
        this.drawCalendar($.getFullYear(),$.getMonth() + 1,$.getDate(),seacherValue);
    }, 
    fillArray : function(year,month){ 
        var f = new Date(year, month -1  ,1).getDay(), //������µĵ�һ�������ڼ� 
        dates = new Date(year, month , 0).getDate(),//�ϸ��µĵ�������ǽ���µ����һ�� 
        arr = new Array(35);//����װ�����ڵ����飬�����ԡ�xxxx-xx-xx������ʽ��ʾ 0
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
        var weeks = "��,һ,��,��,��,��,��".split(',');
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
		
        //body.insertBefore(calendar,null);//����������DOM���� 
        calendar.setAttribute('id','jcalendar'); 
        for(var i = 0;i<4;i++){//ѭ�����ɳ���ʱ�䰴ť�� 
            var clone = tt.cloneNode(true);//������createElement�� 
            clone.onclick =  (function(index,seacherValue){ 
                return function(){//�ڱհ�����¼� 
                    ths.redrawCalendar(year,month,date,index,seacherValue);
                } 
            })(i,seacherValue); 
            tts[i] = clone;//��������
			var _month=month;
			var _date=date;
			if(month<10){_month='0'+month}
			if(date<10){_date='0'+date}
            if(i==2) thead.appendChild($.createTextNode(year+"��"+_month+"��"+_date+"��")); 
            thead.appendChild(clone);
        } 
        tts[0].innerHTML = '<img src="images/y_front.jpg"></img>'; 
        tts[1].innerHTML = '<img src="images/m_front.jpg"></img>'; 
        tts[2].innerHTML = '<img src="images/m_next.jpg"></img>'; 
        tts[3].innerHTML = '<img src="images/y_next.jpg"></img>'; 
        tts[0].className = tts[3].className = tts[1].className = tts[2].className ='button'; 
		thead.className = "tit";
		seacher.className = "seacher";//����������
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
               		 return function(){//�ڱհ�����¼� 
                		    ths.seacher(s_text.value); 
               		 } 
           		 })(s_text.value); 
        fragment.appendChild(thead);
		fragment.appendChild(seacher); 
        for(i = 0;i <7;i++){//������ʾ�� 
            var th = a.cloneNode(true); 
            th.innerHTML = "����" + weeks[i]; 
            th.className = 'week'; 
            fragment.appendChild(th); 
        } 
        for(i = 0;i <35;i++){//������ʾ��            
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
                td.innerHTML = html+"��"; 
                td.className = 'day'; 
				kc.className = 'kc';
                td.href = "javascript:void(0)";//Ϊie6׼���� 
                kc.id = arr[i];
                (i%7 == 0 || i%7 == 6)&&(td.className += ' weekend') ;//Ϊ��ĩ��Ӷ�һ����
				(date && html == date)&&(td.className = ' current',kc.className ='current2');//����ÿ���½�����һ�� 	
                ls.onclick = (function(index,value){ 
               		 return function(){//�ڱհ�����¼� 
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
		if(value=="") alert("ע�⣺�������ݲ���Ϊ��");
		else if(!isseacher) alert("��Ǹ��û���ҵ�����������ؿγ̡�");
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
//*********************Jcalendar�����**************s******** 