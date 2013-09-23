<?php
date_default_timezone_set('Asia/Shanghai');
  if(isset($_FILES["imageNameHere"]) && !empty($_FILES["imageNameHere"])) {
    // time name
    $name= 'images/upload/file/'.date('YmdHis').'.png';
    // Move the file
    move_uploaded_file($_FILES["imageNameHere"]['tmp_name'], '../'.$name);
    // Return name
    echo $name;
  }