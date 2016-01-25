<?php

  class get_message_list {

	  public $messages;

	function init_page($arr,$page_num){
	   
		$messages = array();
		$length = $page_num * 20;
		$start = $length-20;
		for($start;$start<$length;$start++){
			$messages[$start] = $arr[$start];
		}
	    return $messages;
	}
   
  }
?>