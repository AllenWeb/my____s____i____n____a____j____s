<?php
     header('Content-Type:text/html;charset=UTF-8');
     include('json.php');
	 include('function.php');
     
	//get the page parameter from URL
    $p=$_GET["page"];
	$keyValue = $_GET["keyword"];
	$message_str = "";
	if($p!=""){
		$total = count($message_list);

		$operation = new get_message_list();
		$message_box = $operation->init_page($message_list,$p);

		$leng = $p * 10;
		$begin = $leng-10;

			
		for($begin;$begin<$leng && $begin<$total;$begin++){
			$message_str =  $message_str.$message_box[$begin]["time"].'|' .$message_box[$begin]["address"].'|'.$message_box[$begin]["name"].'|' .$message_box[$begin]["content"].'|';
		}
			$message_str = $total.'|'.$message_str;
	}else if($keyValue!=""){
	   
		$operation = new get_message_list();
        $message_box = $operation->searchResult($message_list,$keyValue);
		 $total = count($message_box);
		$leng = 10;
		$begin = 0;
		for($begin;$begin<$leng && $begin<$total;$begin++){
			$message_str =  $message_str.$message_box[$begin]["time"].'|' .$message_box[$begin]["address"].'|'.$message_box[$begin]["name"].'|' .$message_box[$begin]["content"].'|';
		}
			$message_str = $total.'|'.$message_str;
	    
	}
	$response = $message_str;
	echo $response;
?>