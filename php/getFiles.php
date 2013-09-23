<?php   
 function getDirFiles()   
 {   
	if ($handle = opendir('../images/withFace'))
	{   
	    while (($filename  = readdir($handle))!==false)
	    {   
	        if($filename != '.' && $filename != '..')
	        {
	        	$filenames[]=$filename ; 
	        	//echo $filename;
	        }
	    }  
	    
	}   
	closedir($handle);    
 	if($filenames) 
 		return json_encode($filenames);   
 	else 
 		return false;   
 }  
 echo getDirFiles();   
?>  