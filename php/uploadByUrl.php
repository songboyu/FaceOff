<?php 
	date_default_timezone_set('Asia/Shanghai');
	if ( isset($_POST["url"]) && !empty($_POST["url"]) ) {    
    // Init dataURL variable
    $URL = $_POST["url"];  
    $newfname= 'images/upload/renren/'.date('YmdHis').'.png'; //文件PATH
	$file=fopen($URL,'rb');
	
	if($file){			
		$newf=fopen('../'.$newfname,'wb');
		if($newf){				
			while(!feof($file)){					
				fwrite($newf,fread($file,1024*8),1024*8);
			}
		}
		if($file){				
			fclose($file);
		}
		if($newf){				
			fclose($newf);
		}
	}
	echo $newfname;
}