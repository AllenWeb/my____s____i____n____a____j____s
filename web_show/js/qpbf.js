//ȫ�����Żõ�Ƭ
function $(id){
	return document.getElementById(id);
}
var pic_array_qp = new Array('images/pic_1.jpg','images/pic_2.jpg','images/pic_3.jpg','images/pic_4.jpg','images/pic_5.jpg','images/pic_6.jpg');
	
var qt;
var flag=0;
//ȫ���õ�Ƭ�л�
function turn_qp(){
	flag++;
	$("qp_view").src = pic_array_qp[flag-1];
	if(flag==6){
		flag = 0;
	}
	qt=setTimeout("turn_qp()",3000);

}

//ȫ���õ�Ƭֹͣ
function stop_qp(){
	clearTimeout(qt);
}
//��ESC���˳�ȫ������
document.onkeypress=function(e)    
  {   
      var code;     
      if  (!e)     
      {     
          var e=window.event;     
      }     
      if(e.keyCode)     
      {       
          code=e.keyCode;     
      }     
      else if(e.which)     
      {     
          code   =   e.which;     
      }   
      if(code==27)   
      {   
  
         window.history.go(-1);
         return false;   
         //��ֹ�˻س����¼�ð��   
    }  
  }

