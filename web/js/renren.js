var API_Key = '89d943c3c8dc4fd68cfec53f95e0eee3';
var Secret_Key = '79309e4464bf44e79ce6bb6a842bd9c6';

var path = 'https://graph.renren.com/oauth/authorize?';
var requestURL = 'http://api.renren.com/restserver.do?';
var queryParams, query, url, accessToken, md5str, md5Value, uid, aid;
var times = 0;
document.getElementById("friends").style.display="none";
if (window.location.hash.length !== 0)
{
	document.getElementById("renrenConnect").style.display="none";
	document.getElementById("friends").style.display="";
	// document.getElementById("album").style.display="";
	var album = $('<a data-role="button" href="#page5" data-transition="slidedown" data-icon="arrow-r" data-inline="true" data-theme="a">好友照片</a>');
	$("#buttons").append(album);

	var access = window.location.hash.substring(1);
	var start = access.indexOf('=')+1;
	var end = access.indexOf('&');

	accessToken = decodeURI(access.substring(start,end));
	queryParams = 
	[ 
		'access_token='+accessToken,
		'format=JSON',
		'method=friends.getFriends',
		'v=1.0' 
	];
	query = queryParams.join('&');

	md5str = queryParams.join('') + Secret_Key;
  
	md5Value = $.md5(md5str)

	query = query+'&sig='+md5Value;

	$.ajax
	({
		type: "Post",
		url: "php/renren.php",
		data: {data: query},
		dataType: "json",
		success: function(jsonData)
		{
			var pullUpEl, pullUpOffset,
			displayCount = 0;
			var len = jsonData.length;
		    if(win_height < win_width){
		        $('#headlistHeader').css('height','6%');
		        $('#headContent').css('height','94%');
		    }
		    else if(!isMobile.any()){
		        $('#headlistHeader').css('height','3%');

		        $('#headContent').css({'height':'97%','top':'4%'});
		    } else{
		        $('#headlistHeader').height(win_height * 0.04);
		        $('#headContent').height(win_height * 0.96);

		    }
			friends_loaded = function() {
				pullUpEl = document.getElementById('pullUp');	
				pullUpOffset = pullUpEl.offsetHeight;
				var topOffset = $("#headlistHeader").height() - 60;
				myScroll = new iScroll('headContent', {
					useTransition: true,
					topOffset: topOffset,
					onRefresh: function () {
						if (pullUpEl.className.match('loading')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉可以查看更多...';
						}

					},
					onScrollMove: function () {
						scrollMoved = true;
						if (this.y < (this.maxScrollY - 60) && !pullUpEl.className.match('flip')) {
							pullUpEl.className = 'flip';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开即可查看更多...';

						} else if (this.y > (this.maxScrollY - 60) && pullUpEl.className.match('flip')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉可以查看更多...';

						}
						if(this.y < (this.maxScrollY + 40)){
							$("#pullUp").css('display','');
						}
						else {
							$("#pullUp").css('display','none');
						}
						if(displayCount == len){
							pullUpEl.className = 'done';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '已加载全部好友';
						}
					},
					onScrollEnd: function () {
						$("#pullUp").css('display','none');
						if (pullUpEl.className.match('flip')) {
							pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在刷新...';				
							pullUpAction();	
						}

					}
				});
				
			}
			pullUpAction = function(){
				for (var i = 0; i < 15; i++)
				{
					if(displayCount < len)
					{
						var li = $('<li></li>');
						var hr = $('<a></a>');
						var img = document.createElement('img');
						img.src = jsonData[displayCount].headurl;
						img.alt = jsonData[displayCount].id;
						img.title = jsonData[displayCount].name;
						img.width=img.height=80;
						hr.append(img);
						hr.append(jsonData[displayCount].name);
						li.append(hr);
						$('#headlist').append(li);
						displayCount++;
					}
					else{
						pullUpEl.className = 'done';
						pullUpEl.querySelector('.pullUpLabel').innerHTML = '已加载全部好友';
					}
				}
				$("#page3").page();
				$( "#headlist" ).listview( "refresh" );
				myScroll.refresh();
			}

			if(times==0)
			{
				times=1;
				if(!isMobile.any()){
					$("#headScroller").css('display','none');
				}
				for (var i = 0; i < 11; i++)
				{
					if(i < len)
					{
						var li = $('<li></li>');
						li.height(90);
						var hr = $('<a></a>');
						var img = document.createElement('img');
						img.src = jsonData[i].headurl;
						img.alt = jsonData[i].id;
						img.title = jsonData[i].name;
						img.width=img.height=80;
						hr.append(img);
						hr.append(jsonData[i].name);
						li.append(hr);
						$('#headlist').append(li);
						displayCount++;
					}
				}
				$("#page3").page();
				$( "#headlist" ).listview( "refresh" );
				
				$("#friends").unbind('click').click(function(){
					if(isMobile.any())
						setTimeout(friends_loaded,2000);
					else
						setTimeout(function(){
							$("#headScroller").css('display','');
							friends_loaded();
							
						},3000);
				});
				$("#backToFreinds").unbind('click').click(function(){
					setTimeout(function(){
							friends_loaded();
					},1000);
				});
				$("#friendsBackToHome").unbind('click').click(function(){
					myScroll.destroy();
					myScroll = null;
				});
			}
		}
	});
  
}
$('#renrenConnect').click(function() {
	if (window.location.hash.length == 0)
	{
		queryParams = 
		[
			'client_id=' + API_Key,
			'redirect_uri=' + window.location,
			'response_type=token',
			'display=touch',
			'scope=read_user_album+read_user_photo'
		];
		query = queryParams.join('&');
		url = path + query;
		//window.open(url);
		window.location = url;
	}  
});
 
$( "#headlist" ).unbind('click').click(function(data){
	if(scrollMoved){
		scrollMoved = false;
	} else {

		myScroll.destroy();
		var $target = $(data.target);
		if( $target.is("A") ) 
		{
			uid = $target.children()[0].alt;
		}
		else
			uid = data.target.alt;


		$.mobile.changePage("#page4","slidedown", true, true);
		queryParams = 
		[ 
			'access_token='+accessToken,
			'format=JSON',
			'method=photos.getAlbums',
			'uid='+uid,
			'v=1.0'
		];
		query = queryParams.join('&');

		md5str = queryParams.join('') + Secret_Key;
	  
		md5Value = $.md5(md5str)

		query = query+'&sig='+md5Value;

		$.ajax
		({
			type: "Post",
			url: "php/renren.php",
			data: {data: query},
			dataType:"JSON",
			success: function (jsonData){
				$('#albumslist').empty();
				for (var i = 0, len = jsonData.length; i < len; i++){
					if(jsonData[i].visible == 99){
						var li = $('<li></li>');
						var hr = $('<a></a>');
						var img = document.createElement('img');
						img.src = jsonData[i].url;
						img.alt = jsonData[i].aid;
						img.title = jsonData[i].name;
						img.width=img.height=80;
						hr.append(img);
						hr.append('<h3>'+jsonData[i].name+'('+jsonData[i].size+'张)'+'</h3>');
						hr.append('<p>'+jsonData[i].update_time+'</p>');
						// hr.append('<p>'+jsonData[i].visible+'</p>');
						li.append(hr);
						$('#albumslist').append(li);
					}
				}
				$("#page4").page();
				$( "#albumslist" ).listview( "refresh" );
			}
		});
	}
});

$( "#albumslist" ).unbind('click').click(function(data){
	var $target = $(data.target);
	if( $target.is("A") )
	{
		aid = $target.children()[0].alt;
	}
	else if ( $target.is("H3") || $target.is("P") ) 
	{
		aid = $target.parent().children()[0].alt;
	}
	else
		aid = data.target.alt;

	$.mobile.changePage("#page5","slidedown", true, true);

	queryParams = 
	[ 
		'access_token='+accessToken,
		'aid='+aid,
		'format=JSON',
		'method=photos.get',
		'uid='+uid,
		'v=1.0'
    ];
	query = queryParams.join('&');

	md5str = queryParams.join('') + Secret_Key;
    
	md5Value = $.md5(md5str)

	query = query+'&sig='+md5Value;

	$.ajax({
		type: "Post",
		url: "php/renren.php",
		data: {data: query},
		dataType:"JSON",
		success: function (jsonData){
			$('.photolist').empty();
			for (var i = 0, len = jsonData.length; i < len; i++)
			{
				var li = $('<li></li>');
				var hr = $('<a></a>');
				var img = document.createElement('img');
				img.src = jsonData[i].url_large;
				img.alt = jsonData[i].url_large;
				img.title = jsonData[i].caption;
				// img.width = img.height = 200;
				hr.append(img);
				li.append(hr);
				if( !isMobile.any() ) {
					$(".photolist li").css('width','14%');
				}
				$('.photolist').append(li);
			}
			var $container = $('#photolistContent');
			$container.imagesLoaded(function(){
				$container.masonry({
					itemSelector: '.photolist li'
				});
			});
		}
	});
});
  
$('.photolist').unbind('click').click(function(data, handler)
{
	if (data.target !== this){
		$.mobile.changePage("#page2","slidedown", true, true);
		$.ajax({
			type: "POST",
			url: "php/uploadByUrl.php",
			data: { url: data.target.alt},
			success: function (imageURL){
				imageURL = 'http://xiangt920.eicp.net/'+imageURL;
				drawImg(imageURL);
			}
		});
	}
});
  