<?php
$serverCharCode = "gb2312";
$_REQUEST["path"] = "Files/";
$_POST['allowExt'] = ">>|js|html|htm|css|<<";

header("Content-Type: text/html; charset=$serverCharCode");
		if(!isset($_REQUEST["path"]))exit();
		
		$jsonFolderPart = "";
		$jsonFilesPart = "";
		
		$path = $_REQUEST['path'];
		if( file_exists($path) ) {
			$files = scandir($path);
			
			//�Ƿ�ӻ����ȡ
			$cachePath = $path."cache.d6w";
			if(file_exists($cachePath) && (filemTime($cachePath) >= filemTime($path.".")) ){
				echo file_get_contents($cachePath);
				return;
			}
			
			//natcasesort($files);
			if( count($files) > 2 ) { /* ��2���� ./ �� ../ */
				foreach( $files as $file ) {
					//�ų� ./ & ../
					if($file == "." || $file == "..") continue;
					//ƴװĿ¼
					$filePath = $path.$file;
					//Ŀ¼
					if(is_dir($filePath)){
						if($file != ".svn"){
								$jsonFolderPart .= "'$filePath':{name:'$file'},\n";
						}
					}else{
						$ext = end(explode(".",$file));
						if(empty($_POST['allowExt']) || strrpos($_POST['allowExt'],"|".$ext."|") > 0){
							$fileSize = number_format(fileSize($path.$file) / 1024,1,".","") . "kb";
							$modifyTime = date("Y-m-d H:i:s",filemTime($path.$file));
							$jsonFilesPart .= "'$filePath':{name:'$file',size:$fileSize,ext:'$ext',mTime:'$modifyTime'},\n";
						}
					}
				}
				
				//** ������  ����� ȥ�����һ��,\n
				$response = "folders:{\n".rtrim($jsonFolderPart,",\n")."\n},\nfiles:{".rtrim($jsonFilesPart,",\n")."\n}";
				echo $response;

				//���ɻ���
				$dirCacheFile=fopen($cachePath, "wb");
				fputs($dirCacheFile, $response.",\nfromCache:true"); 
				fclose($dirCacheFile);unset($dirCacheFile);
			}
		}
		unset($files);

?>