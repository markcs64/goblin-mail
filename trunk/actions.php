<?php
//控制返回器
if(!isset($_REQUEST["action"]))exit();/* action必需 结尾/必需 */
$action = $_REQUEST["action"];

$serverCharCode = "gb2312";
$mailCharSet = "utf-8";

switch(strtoupper($action))
{
	case "FILETREE": //显示留言
		//这个乱码问题可恶 注意htmlentities 也会引起乱码...访问目录又一定要用乱码路径才能找到...切...真麻烦...
		header("Content-Type: text/html; charset=$serverCharCode");
		//没有root会报错
		//fileTree想用json...算了...返回不复杂 省省客户端解析资源也好~~
		$_POST['filePath'] = urldecode($_POST['filePath']);
		if( file_exists($_POST['filePath']) ) {
			$files = scandir($_POST['filePath']);
			//natcasesort($files);
			rsort($files);
			if( count($files) > 2 ) { /* 这2个是 ./ 和 ../ */
				echo "<ul class=\"jQfileTree\" style=\"display: none;\">";
				// 遍历文件夹
				foreach( $files as $file ) {
					if( file_exists($_POST['filePath'] . $file) && $file != '.' && $file != '..' && is_dir($_POST['filePath'] . $file) ) {
						echo "<li class=\"imDir collapsed\" title=\"" . htmlspecialchars($_POST['filePath'] . $file) . "\" rel=\"" . htmlentities($_POST['filePath'] . $file) . "/\"><span class=\"item directory\">" . htmlspecialchars($file) . "</span></li>";
					}
				}
				// 遍历文件
				foreach( $files as $file ) {
					if( file_exists($_POST['filePath'] . $file) && $file != '.' && $file != '..' && !is_dir($_POST['filePath'] . $file) ) {
						$ext = preg_replace('/^.*\./', '', $file);
						//** darksnow ext allow **
						if(empty($_POST['allowExt']) || strrpos(strtolower($_POST['allowExt']),"|".strtolower($ext)."|") > 0){
								$fileSize = fileSize($_POST['filePath'] . $file) / 1024;
								//取小数点1位
								$fileSize = number_format($fileSize,1,".","");
								$editTime = date("Y-m-d H:i:s",filemTime($_POST['filePath'] . $file));
								echo "<li class=\"imFile\" title=\"P : " . htmlspecialchars($_POST['filePath'] . $file) . "\nS : ".$fileSize." kb\nT : ".$editTime."\" path=\"" . htmlspecialchars($_POST['filePath'] . $file) . "\" rel=\"" . htmlentities($_POST['filePath'] . $file) . "\"><span class=\"item file ext_$ext\">" . htmlspecialchars($file) . "</span></li>";
						}
					}
				}
				echo "</ul>";	
			}
		}
		unset($files);
		break;
	case "NEWFILETREE" : /* path必需 结尾/必需 */
		header("Content-Type: text/html; charset=$serverCharCode");
		if(!isset($_REQUEST["path"]))return;
		
		$jsonFolderPart = "";
		$jsonFilesPart = "";
		
		$path = urldecode($_REQUEST['path']);
		
		if( file_exists($path) ) {
			$files = scandir($path);
			//是否从缓存获取
			$cachePath = $path."cache.d6w";
			if(file_exists($cachePath) && (filemTime($cachePath) >= filemTime($path.".")) ){
				echo file_get_contents($cachePath);
				return;
			}
			
			//natcasesort($files);
			if( count($files) > 2 ) { /* 这2个是 ./ 和 ../ */
				foreach( $files as $file ) {
					//排除 ./ & ../
					if($file == "." || $file == "..") continue;
					//拼装目录
					$filePath = $path.$file;
					//目录
					if(is_dir($filePath)){
						if($file != ".svn"){
								$jsonFolderPart .= "'$filePath/':{name:'$file',pathForScript:'".htmlentities($filePath)."/'},\n";
						}
					}else{
						$ext = strtolower(end(explode(".",$file)));
						if(empty($_POST['allowExt']) || strrpos(strtolower($_POST['allowExt']),"|".$ext."|") > 0){
							$fileSize = number_format(fileSize($path.$file) / 1024,1,".","") . "kb";
							$modifyTime = date("Y-m-d H:i:s",filemTime($path.$file));
							$jsonFilesPart .= "'$filePath':{name:'$file',size:'$fileSize',ext:'$ext',mTime:'$modifyTime',pathForScript:'".htmlentities($filePath)."'},\n";
						}
					}
				}
				
				//** 最后输出  如果有 去掉最后一个,\n
				$response = "folders:{\n".rtrim($jsonFolderPart,",\n")."\n},\nfiles:{".rtrim($jsonFilesPart,",\n")."\n}";
				echo "({".$response."})";

				//生成缓存
				$dirCacheFile=fopen($cachePath, "wb");
				fputs($dirCacheFile, "({".$response.",\nfromCache:true})"); 
				fclose($dirCacheFile);unset($dirCacheFile);
			}
		}
		unset($files);
		break;
	case "READFILE" :
		$filePath = iconv("utf-8",$serverCharCode,$_REQUEST["filePath"]); 
		$file = file_get_contents($filePath);
		echo $file;
		unset($file);
		break;
	case "WRITEFILE" :
		$filePath = iconv("utf-8",$serverCharCode,$_REQUEST["filePath"]);
		//$filePath = $_REQUEST["filePath"];
		//$content = utf8_encode($_REQUEST['content']);
		$content = $_REQUEST['content'];
		$file=fopen($filePath, "wb");
		$content="\xEF\xBB\xBF".$content; 
		fputs($file, $content); 
		fclose($file); 
		echo "草稿已经成功保存";
		unset($file);
		break;
	case "DELFILE" :
		$filePath = iconv("utf-8",$serverCharCode,$_REQUEST["filePath"]); 
		unlink($filePath);
		break;
	case "SENDMAIL" :
		include_once('includes/class.phpmailer.php');
		$mail = new PHPMailer();
		$mail->CharSet = "UTF-8";
		//test
		$mail->IsSMTP();
		$mail->SMTPAuth   = true;
		$mail->Host       = "smtp.gmail.com";
		$mail->SMTPSecure = "ssl";
		//记得开启php配置 -> extension=php_openssl.dll
		$mail->Port = 465;
		$mail->Username   = "aliued.goblin@gmail.com";
		$mail->Password   = "hello1234";
		$mail->From       = "aliued.goblin@gmail.com";
		$mail->FromName   = "EDM Goblin";
		/*
		$mail->Host       = "10.0.85.8";
		$mail->From       = "aliued.goblin@gmail.com";
		$mail->FromName   = "EDM Goblin";
		*/
		$mail->Subject    = "=?UTF-8?B?" . base64_encode($_REQUEST['title']) . "?=";
		$mail->WordWrap   = 10;
		
		$mailBody = $_REQUEST['content'];
		//$mailBody = $mail->getFile('contents.php');
		
		//生成临时附件
		$filePath = iconv("utf-8",$serverCharCode,"Files/mailDemo.html");
		$file=fopen($filePath, "w");
		$content = $_REQUEST['content'];
		$ext = strtolower(end(explode(".",$_REQUEST['tplPath'])));
		fputs($file, $mailBody); 
		fclose($file);
		$mail->AddAttachment("Files/mailDemo.html", $_REQUEST['title'].".$ext"); 
		
		//针对于%%track链接的兼容
		$mailBody = preg_replace('/%%track[\s\S\n ]*?{(.*?)}[\s\S\n ]*?%%/','$1',$mailBody);
		
		$mail->MsgHTML($mailBody);
		$mailToArray = explode(';', rtrim($_REQUEST['mailTo'],";"));
		foreach( $mailToArray as $mailTo ) {
			$mail->AddAddress($mailTo);
		}
		$mail->IsHTML(true);
		//$mail->Send();

		if(!$mail->Send()) {
		  echo "Mailer Error: " . $mail->ErrorInfo;
		} else {
		  echo "邮件发送成功 -> ".$_REQUEST['mailTo'];
		}

		unset($mail);
		break;
				
	default://默认ACTION
		//echo "<br /> 你想 do What ??";
		break;
}

?>