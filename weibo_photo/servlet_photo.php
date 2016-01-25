<?php
	header('Content-Type:text/html;charset=UTF-8');
    include('json_photo.php');
    include('function_photo.php');

    $t = $_GET["type"];
	$p = $_GET["page"];

	$pj = new parseJson();
	$list = $json["fields"];

	$messageStr = "";
    
	if($t=="root"){
	   $messageStr = $pj->getRoot($json);
	}else{
	    $array = $pj->findPhoto($t,$list);
	
	    $messageStr = $pj->getJson($p,$array);
	}

   
	echo $messageStr;
   
	$response = $messageStr;
?>