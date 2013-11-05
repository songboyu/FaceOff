<?php 
date_default_timezone_set('Asia/Shanghai');
if ( isset($_POST["image"]) && !empty($_POST["image"]) ) {   
    $dataURL = $_POST["image"];  
    $score = $_POST["score"];  
    $parts = explode(',', $dataURL);  
    $data = $parts[1];  
    $data = base64_decode($data); 
    $name= date('YmdHis').'_'.$score.'.png'; 
    $fp = fopen('../images/withFace/'.$name, 'w');  
    fwrite($fp, $data);  
    fclose($fp); 
    echo $name;
}