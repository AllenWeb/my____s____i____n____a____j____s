<?php

  class get_message_list {

	  public $messages;

	function init_page($arr,$page_num){
	   
		$messages = array();
		$length = $page_num * 10;
		$start = $length-10;
		for($start;$start<$length;$start++){
			$messages[$start] = $arr[$start];
		}
	    return $messages;
	}
     /*
	function searchReg($a,$b){
	    if(preg_match($a,$b)){
		   return 1;
		}else {
		   return 0;
		}
	}
	*/
	//返回按关键字查找的结果
	function searchResult($arr,$key){
		$searchArr = array();
	    $lenS = count($arr);
		for($i=0;$i<$lenS;$i++){
		    if(!stristr($arr[$i]["time"],$key)===false){
			   array_push($searchArr,$arr[$i]);
			   continue;
			}else if(!stristr($arr[$i]["address"],$key)===false){
			   array_push($searchArr,$arr[$i]);
			   continue;
			}else if(!stristr($arr[$i]["name"],$key)===false){
			   array_push($searchArr,$arr[$i]);
			   continue;
			}else if(!stristr($arr[$i]["content"],$key)===false){
			   array_push($searchArr,$arr[$i]);			  
			}
		}
	   return $searchArr;
	}
   
  }
?>