<?php 
    
	class parseJson {
	    
		public $type;
		public $page;
		public $_array;
        public $json;
		const  num = 15;

		function __construct (){
		    
		}
		//��ȡ����Ŀ¼
		function getRoot($arr){
		    $rootInfo = "";
			$rootInfo = $rootInfo."id-".$arr["id"]."|name-".$arr["name"]."|title-".$arr["title"];
			return $rootInfo;
		}

		//��ȡָ������������Ϣ
		function getChild($t,$_arr){
			 $childInfo = "";
             for($j=0;$j<count($_arr);$j++){
			   if($_arr[$j]["id"]==$t){
			      $childInfo = $childInfo."id-".$_arr[$j]["id"]."|name-".$_arr[$j]["name"]."|title-".$_arr[$j]["title"];
			   }
			}
			return $childInfo;
		}
		//�ҵ�ָ������������ͼƬ����
		//$t:��Ƭ����
		//$_arr:����Դ
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
		//��ȡҪ���ص�����
		//$p:ҳ��
		//$arr:����Դ
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