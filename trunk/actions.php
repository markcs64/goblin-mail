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
						if(empty($_POST['allowExt']) || strrpos($_POST['allowExt'],"|".$ext."|") > 0){
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
		if(!isset($_REQUEST["path"]))exit();
		
		$jsonFolderPart = "";
		$jsonFilesPart = "";
		
		$path = $_REQUEST['path'];
		if( file_exists($path) ) {
			$files = scandir($path);
			//natcasesort($files);
			if( count($files) > 2 ) { /* 这2个是 ./ 和 ../ */
				
				foreach( $files as $file ) {
					//排除 ./ & ../
					if($file == "." || $file == "..") continue;
					//拼装目录
					$filePath = $path.$file;
					//目录
					if(is_dir($filePath)){
						$jsonFolderPart .= "'$filePath':{name:'$file'},";
					}else{
						$ext = end(explode(".",$file));
						$fileSize = number_format(fileSize($path.$file) / 1024,1,".","") . "kb";
						$modifyTime = date("Y-m-d H:i:s",filemTime($path.$file));
						$jsonFilesPart .= "'$filePath':{name:'$file',size:$fileSize,ext:'$ext',mTime:'$modifyTime'},";
					}
				}
				
				//** 最后输出  如果有 去掉最后一个,
				echo "{folders:{".rtrim($jsonFolderPart,",")."},files:{".rtrim($jsonFilesPart,",")."}}";
				
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
		$mail->Host       = "smtp.126.com";
		$mail->Username   = "mail_goblin@126.com ";
		$mail->Password   = "hello1234";
		$mail->From       = "mail_goblin@126.com ";
		$mail->FromName   = "ALiUED - Goblin*darkSnow";
		$mail->Subject    = "=?UTF-8?B?" . base64_encode("D6W TEST MAIL - from Goblin v1.0α") . "?=";
		$mail->WordWrap   = 10;
		$mailBody = $_REQUEST['content'];
		//$mailBody = $mail->getFile('contents.php');
		//$mailBody = eregi_replace("[\]",'',$mailBody);
		$mail->MsgHTML($mailBody);
		$mailToArray = explode(';', $_REQUEST['mailTo']);
		foreach( $mailToArray as $mailTo ) {
			$mail->AddAddress($mailTo);
		}
		$mail->IsHTML(true);
		$mail->Send();
		echo "邮件发送成功 -> ".$_REQUEST['mailTo'];
		/*
		if(!$mail->Send()) {
		  echo "Mailer Error: " . $mail->ErrorInfo;
		} else {
		  echo "Message sent!";
		}
		*/
		unset($mail);
		break;
				
	default://默认ACTION
		//echo "<br /> 你想 do What ??";
		break;
}

?>