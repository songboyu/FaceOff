<?php
error_reporting(E_ALL & ~(E_STRICT | E_NOTICE));
require_once "HttpClient.class.php";

$params = $_POST['data'];
$url = "http://api.renren.com/restserver.do";
$json = HttpClient::quickPost($url,$params);

header('Content-type: application/json; charset=utf-8');

echo $json;

?>