<?php 
date_default_timezone_set('Asia/Shanghai');
if ( isset($_POST["image"]) && !empty($_POST["image"]) ) {    
    // Init dataURL variable
    $dataURL = $_POST["image"];  
    // Extract base64 data (Get rid from the MIME & Data Type)
    $parts = explode(',', $dataURL);  
    $data = $parts[1];  
    // Decode Base64 data
    $data = base64_decode($data); 
    // time name
    $name= 'images/upload/camera/'.date('YmdHis').'.png'; 
    // Save data as an image
    $fp = fopen('../'.$name, 'w');  
    fwrite($fp, $data);  
    fclose($fp); 
    // Return name
    echo $name;
}