<?php 
    
	class parseJson {
	    
		public $type;
		public $page;
		public $_array;
        public $json;
		const  num = 15;

		function __construct (){
		    
		}
		//获取相册根目录
		function getRoot($arr){
		    $rootInfo = "";
			$rootInfo = $rootInfo."id-".$arr["id"]."|name-".$arr["name"]."|title-".$arr["title"];
			return $rootInfo;
		}

		//获取指定类型相册的信息
		function getChild($t,$_arr){
			 $childInfo = "";
             for($j=0;$j<count($_arr);$j++){
			   if($_arr[$j]["id"]==$t){
			      $childInfo = $childInfo."id-".$_arr[$j]["id"]."|name-".$_arr[$j]["name"]."|title-".$_arr[$j]["title"];
			   }
			}
			return $childInfo;
		}
		//找到指定类型相册里的图片数组
		//$t:照片类型
		//$_arr:数据源
		function findPhoto($t,$_arr){
		    $type = $t;
			$_array = $_arr;
			$typeList = null;
            for($j=0;$j<count($_array);$j++){
			   if($_array[$j]["id"]==$t){
			      $typeList = $_array[$j]["option"];
			   }
			}
	
			return $typeList;
		}
		//获取要返回的数据
		//$p:页码
		//$arr:数据源
		function getJson($p,$arr){
		    
			$page = $p;
			$json = $arr;
            $length = count($json);
			$data = "";
			$end = $page * self::num;
			$begin = $end - self::num;

			for($i=$begin;$i<$end;$i++){
			    $data = $data."@name-".$json[$i]["name"]."|id-".$json[$i]["id"]."|url-".$json[$i]["url"]."|time-".$json[$i]["time"]."|author-".$json[$i]["author"];
			}
			return $data;
		}
	}
?>