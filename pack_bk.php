<?
/**
 * 文件合并工具,支持CSS跟JS,CSS启用简单压缩
 * @param $p 文件基础路径
 * @param $f 文件路径
 * @param $t 文件类型,平常可不设置,设置后,可自动识别core.STK这样的命名空间
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
// path
$p = @$_GET['p'];
// filePath
$f = @$_GET['f'];
// fileType
$t = @$_GET['t'];
// autoMode
$a = false;


if($t) {
	if($t == 'js') {
		$f = str_replace(".", "/", $f) . '.js';
	}	
	$a = true;
}
else{
	if(substr($f, -3) == '.js') {
		$t = 'js';
	}
	elseif(substr($f, -4) == '.css') {
		$t = 'css';
	}	
}
if($t == 'js') {
	header('Content-Type:application/x-javascript;Charset=UTF-8');
}
elseif($t == 'css') {
	header('Content-Type:text/css;Charset=UTF-8');
}
else {
	header('Content-Type:text/plain;Charset=UTF-8');
}
expires(12000000);

$basePath = realpath("./{$p}");

$contentList = array();
$loadedFileList = array();
$treeContentList = array();
$treeIndex = 0;

$startTime = microtime(true);

if($basePath == false) {
	if($t == 'js') {echo "alert('路径: {$p} 未找到');\n";}
	else {echo "/*路径: {$p} 未找到'*/\n";}
}


function expires($seconds = 1800)
{
    $time = date('D, d M Y H:i:s', time() + $seconds) . ' GMT';
    header("Expires: $time");
}

function getFileContent($filePath) {
	global $basePath, $t;
	$fileFullPath = "{$basePath}/{$filePath}";
	if(is_file($fileFullPath)) {
		return file($fileFullPath);
	}
	else {
		if($t == 'js') {echo "alert('文件: {$fileFullPath} 未找到');\n";}
		else {echo "/*文件: {$fileFullPath} 未找到'*/\n";}
		die();
	}
}

function findImport($lineContent, $fileType = js) {
	global $a, $t;
	if($fileType == 'js') {
		preg_match('@^\s*\$import\(\s*([\'\"])(.+)\1\s*\)\s*;?\s*$@i', $lineContent, $aMatch);
	}
	else {
		preg_match('@^\s*\@import\s*([\'\"])(.+)\1\s*\s*;?\s*$@i', $lineContent, $aMatch);
	}
	if($aMatch) {
		$matchFile = trim($aMatch[2]);
		if($a) {
			return str_replace(".", "/", $matchFile) . ".{$t}";
		}
		return $matchFile;
	}
	else {
		return '';
	}
}

function outputTree() {
	global $treeContentListm, $startTime, $treeContentList;
	$runTime = number_format(microtime(true) - $startTime, 4);
	echo "/*\nrunTime: {$runTime}\nfileTree:\n";
	echo join($treeContentList, "\n");
	echo "\n*/\n";	
}

function combineFile($filePath) {
	global $loadedFileList, $treeContentList, $treeIndex, $contentList, $t;
	
	$fileContent = getFileContent($filePath);
	$loadedFileList[$filePath] = $filePath;
	
	$treeContentList[] = str_repeat(' | ', $treeIndex) . ' +---- ' . $filePath;
	$treeIndex ++;
	
	foreach($fileContent as $key=>$value) {
		$matchFile = findImport($value, $t);
		if($matchFile != '') {
			if(@$loadedFileList[$matchFile] == null){
				combineFile($matchFile);
				$contentList[] = "\n";
			}
		}
		else {
			$contentList[] = $value;

		}
	}
	$treeIndex --;
}

function parseCSS($cssContent) {
	//去掉注释
	$cssContent = preg_replace('/\/\*[\d\D]+?\*\//i', '', $cssContent);
	//去掉换行符
	$cssContent = preg_replace('/[\n\r]*/i', '', $cssContent);
	//去掉{}内最后一个分号
	$cssContent = preg_replace('/;\s*?}/i', "}\n", $cssContent);
	//去页面内编码格式
	$cssContent = "@charset 'utf-8';\n" . preg_replace('/\@charset ([\'\"]).*?\1;?/i', '', $cssContent);
	
	return $cssContent;
}


combineFile($f);

outputTree();



$outputContent = join($contentList, '');

if($t == 'css') {
	echo parseCSS($outputContent);
}
elseif($t == 'js') {
	echo $outputContent;
}