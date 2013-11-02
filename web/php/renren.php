<?php
error_reporting(E_ALL & ~(E_STRICT | E_NOTICE));
require_once "HttpClient.class.php";
// 生成API签名sig，sig人人API的一个参数
// function gensig($params,$secret_key)
// {
// 	ksort($params);
// 	reset($params);
// 	$str = "";
// 	foreach($params as $key=>$value)
// 	{
// 		$str .= "$key=$value";
// 	}
// 	return md5($str.$secret_key);;
// }

// $SecretKey = '79309e4464bf44e79ce6bb6a842bd9c6';
// $access_token = $_POST['atoken'];
// $params = array(
// 	"method"=>"friends.getFriends",
// 	"v"=>"1.0",
// 	"access_token"=>$access_token,
// 	"format"=>"json"
// 	);
// $params['sig'] = gensig($params,$SecretKey);
$params = $_POST['data'];
$url = "http://api.renren.com/restserver.do";
$json = HttpClient::quickPost($url,$params);

header('Content-type: application/json; charset=utf-8');

echo $json;

?>