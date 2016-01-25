<?php
/**
 * Combines nested Javascript files into a final one and displays it out for releasing.
 * 
 * CHANGELOG
 * 
 * @author    Pjan | peijian@staff.sina.com.cn
 * @version   1.0
 * @copyright (c) 2010 t.sina.com.cn
 * @param	page| current page id |scope.$pageid | conf/page/page2/hello.dev.js
 * @param	pro | product name | scope.$PRODUCT_NAME | miniblog2
 */ 
// echo phpinfo();
header('Content-type: application/x-javascript; charset=UTF-8');

$time_start = microtime(true);

if (!function_exists('version_compare') ||
0 > version_compare(PHP_VERSION, '5.2.0')){
	echo '// PHP版本过低，至少需要PHP-5.2.0或更高版本。';
	die();
}
if ('1' != ini_get('allow_url_fopen')){
	echo '// php.ini中的allow_url_fopen配置需要开启。';
	die();
}
if (!$_GET['page']){
	echo '//参数错误';
	die();
}
if (!$_GET['pro']){
	echo '//参数错误';
	die();
}

//将点转换为斜杠
$product = str_replace(".", "/", $_GET['pro']);
$page = str_replace("/", ".", $_GET['page']);

//全局配置
$BASEDIR = $_SERVER['DOCUMENT_ROOT'].'/t3/' . $product . '/js';
$EXISTLIST = 'core.ini';

//全局变量
$CORELIST = Array();

//打开文件公用方法，返回文件内容，类型为数组
function openFile($dir){
	//print '//'.$dir."\n";
	if(preg_match("/\.js$/", $dir) == "0"){
		$dir = $dir.".js";
	}
	$basedir = $GLOBALS['BASEDIR'];
	if(is_file($basedir.'/'.$dir)){
		$c = file($basedir.'/'.$dir);
		if(count($c) == 0){
                	echo '文件为空';
	                return false;
        	}
	        return $c;
	}else{
		print 'alert("'.'这个文件不存在：'.$basedir.'/'.$dir.'")';
		return false;
	}
}

//获取忽略列表
function getExistList($dir){
	global $CORELIST;
	if(is_file($dir)){
		$f = openFile($dir);
		$CORELIST = $f;
	}
	return;
}

//分析文件路径
function analyseDir($dir){
	global $BASEDIR;
	if(preg_match("/\.js$/", $dir) == "0"){
		$dir = $dir.".js";
	}

//	var_dump($BASEDIR.'/'.$dir);	

	if(is_file($BASEDIR.'/'.$dir)){
		return $dir;
	}	

	$strs = explode('.',$dir);
	$newstrs = array();
	$filename = array();
	foreach($strs as $i=>$k){
		if($i > 0){
			$tmpstr = $newstrs[$i-1];
			array_push($newstrs, $tmpstr.'/'.$k);
		}else{
			$tmpstr = '';
			array_push($newstrs, $k);
		}
		array_push($filename, implode('.', array_slice($strs, $i+1)));
	}
	//print_r($newstrs);
	//print_r($filename);
	foreach($newstrs as $i=>$k){
		$d = $BASEDIR.'/'.$k;
		//print_r($d);
		if(is_dir($d)){
			$f = $d.'/'.$filename[$i];
			//print($f."\n");
			if(is_file($f) && is_readable($f)){
				return $k.'/'.$filename[$i];
			}
		}
	}
	print 'alert("js打包出错！下面文件不存在：'.$dir.'");'."\n";
	return false;
}

//获取import数据
function findImport($str){
	preg_match('/^\s*\$import\s*\([\'\"]([_\.\/a-zA-Z0-9\-]+)[\'\"]\)\s*;?.*$/i', $str, $reg);
	if($reg){
		$reg = str_replace("/", ".", $reg[1]);
		if(preg_match("/\.js$/", $reg) == "0"){
			$reg = $reg.".js";
		}
		return $reg;
	}
	return false;
}

//读取文件
$bindjs = array();
function packFile($dir){
	$newdir = analyseDir($dir);
	if(!$newdir){
		return;
	}
	//print '//'.$newdir."\n";
	$f = openFile($newdir);
	global $CORELIST;
	global $bindjs;
	foreach($f as $i=>$k){
		$newLine = findImport($k);
		//echo $newLine;
		$isHasMethod = 0;
		if($newLine){
			foreach($CORELIST as $y){
				if($y == $newLine){
					$isHasMethod = 1;
					break;
				}
			}
			if($isHasMethod == 0){
				array_push($CORELIST, $newLine);
				// print($newLine);
				//$o = analyseDir($newLine);
				// print($o);
				if($newLine){
					packFile($newLine);
				}else{
					return array_push($CORELIST, '这里打包出错');
				}
			}
		}else{
			array_push($bindjs, $k);
			if($i == (count($f)-1)){
				array_push($bindjs, "\n");
			}
		}
	}
}


getExistList($EXISTLIST);
packFile('conf.'.$page);

$time_end = microtime(true);
print("//执行时间：".($time_end - $time_start)."秒\n");
print(implode("", $bindjs));
?>
