<?php
//控制返回器
if(!isset($_REQUEST["action"]))exit();/* action必需 结尾/必需 */
$action = $_REQUEST["action"];

$serverCharCode = "gb2312";
$mailCharSet = "utf-8";

switch(strtoupper($action))
{
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
/*		
		$mail->SMTPAuth   = true;
		$mail->Host       = "smtp.gmail.com";
		$mail->SMTPSecure = "ssl";

		//记得开启php配置 -> extension=php_openssl.dll
		$mail->Port = 465;

		$mail->Username   = "aliued.goblin@gmail.com";
		$mail->Password   = "hello1234";
		$mail->From       = "aliued.goblin@gmail.com";
*/

		$mail->SMTPAuth   = true;
		$mail->Host       = "smtp.foxmail.com";
		$mail->Username   = "edm_goblin@foxmail.com";
		$mail->Password   = "hello1234";
		$mail->From       = "edm_goblin@foxmail.com";

		
		$mail->FromName   = "{ UED 信使.敬上 }";
		/*
		$mail->Host       = "10.0.85.8";
		$mail->From       = "aliued.goblin@gmail.com";
		$mail->FromName   = "EDM Goblin";
		*/
		$mail->Subject    = "=?UTF-8?B?" . base64_encode($_REQUEST['title']) . "?=";
		//$mail->WordWrap   = 10;
		
		$mailBody = stripcslashes($_REQUEST['content']);	//使用 stripcslashes 防止php中设置"被转义为\"
		//$mailBody = $mail->getFile('contents.php');

		//邮件不能使用<br /> 转换为<br>
		$mailBody = preg_replace('/<br \/>/','<br>',$mailBody);		

		//生成临时附件
		$filePath = iconv("utf-8",$serverCharCode,"Files/mailDemo.html");
		$file=fopen($filePath, "w");
		//$content = chunk_split($_REQUEST['content'],150);
		$ext = strtolower(end(explode(".",$_REQUEST['tplPath'])));
		fputs($file, $mailBody); 
		fclose($file);
		$mail->AddAttachment("Files/mailDemo.html", "测试邮件 - ".$_REQUEST['title'].".$ext"); 

		//针对于%%track链接的兼容 因为附件里面保持原样 所以放到后面来做
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
	
	case "COUNTER" :
		$counterFile = $_REQUEST['counterFile'];
		$id = "d6wCounter";
		$t_now   = time();
		$t_array = getdate($t_now);
		$day     = $t_array['mday'];
		$mon     = $t_array['mon'];
		$year    = $t_array['year'];
		$id_count=$id.'count';
		$id_yet=$id.'yet';
		
		if (file_exists($counterFile)) { 
			$count_info=file($counterFile);
			$c_info = explode(",", $count_info[0]);
			$total_c=$c_info[0];
			$yesterday_c=$c_info[1];
			$today_c=$c_info[2];
			$lastday=$c_info[3];
		} else {
			$total_c="1";
			$yesterday_c="0";
			$today_c="0";
			$lastday="0";
		}
		if ( isset($HTTP_COOKIE_VARS["$id_count"]) ) $your_c = $HTTP_COOKIE_VARS["$id_count"]; 
		if ( !isset($HTTP_COOKIE_VARS["$id_yet"]) || $HTTP_COOKIE_VARS["$id_yet"] != $day) {
			$your_c=1;
			$t_array2 = getdate($t_now-24*3600);
			$day2=$t_array2['mday'];
			$mon2=$t_array2['mon'];
			$year2=$t_array2['year'];
			$today = "$year-$mon-$day";
			$yesterday = "$year2-$mon2-$day2";
			if ($today != $lastday) {
		     		if ($yesterday != $lastday) $yesterday_c = "0";
		      			else $yesterday_c = $today_c;
				$today_c = 0;
				$lastday = $today;
			}
			$total_c++;
			$today_c++;
			
			$total_c     = sprintf("%06d", $total_c);
			$today_c     = sprintf("%06d", $today_c);
			$yesterday_c = sprintf("%06d", $yesterday_c);
			
			setcookie("$id_yet","$day",$t_now+43200);
			$fp=fopen($counterFile,"w");
			fputs($fp, "$total_c,$yesterday_c,$today_c,$lastday");
			fclose($fp);
		}
		if ( empty( $your_c ) ) $your_c = 1;
		setcookie("$id_count",$your_c+1,$t_now+43200);
		$response = "total:$total_c,yesterday:$yesterday_c,today:$today_c,you:$your_c,lastday:$lastday";
		echo "({".$response."})";

	default://默认ACTION
		//echo "<br /> 你想 do What ??";
		break;
}

?>