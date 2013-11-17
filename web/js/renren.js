var API_Key = '89d943c3c8dc4fd68cfec53f95e0eee3';
var Secret_Key = '79309e4464bf44e79ce6bb6a842bd9c6';

var path = 'https://graph.renren.com/oauth/authorize?';
var requestURL = 'http://api.renren.com/restserver.do?';
var queryParams, r_query, url, accessToken, md5str, md5Value, uid, aid;
var times = 0;
document.getElementById("friends").style.display="none";
if (window.location.hash.length !== 0 
	&& window.location.hash.length !== 5
	&& window.location.hash.length !== 6)
{
	document.getElementById("renrenConnect").style.display="none";
	document.getElementById("friends").style.display="";
	var album = $('<a data-role="button" href="#page5" data-transition="slidedown" data-icon="arrow-l" data-inline="true" data-theme="a">好友照片</a>');
	album.insertBefore('#ok');
	var access = window.location.hash.substring(1);
	var start = access.indexOf('=')+1;
	var end = access.indexOf('&');

	accessToken = decodeURI(access.substring(start,end));

	queryParams = 
	[ 
		'access_token='+accessToken,
		'format=JSON',
		'method=users.getInfo',
		'v=1.0' 
	];
	r_query = queryParams.join('&');

	md5str = queryParams.join('') + Secret_Key;
  
	md5Value = $.md5(md5str)

	r_query = r_query+'&sig='+md5Value;

	$.ajax
	({
		type: "Post",
		url: "php/renren.php",
		data: {data: r_query},
		dataType: "json",
		success: function(jsonData)
		{
			renrenId = jsonData[0].uid;

			document.getElementById("userpic").src=jsonData[0].tinyurl;
			document.getElementById("username").innerHTML=jsonData[0].name;
			$('#user').unbind('click').click(function() {
			    $.mobile.changePage("#page3","slidedown", true, true);
			});

			query = new Parse.Query(settingRecord);
			query.equalTo('renrenId',renrenId);
			query.find().then(function(settingInfo){
				if(settingInfo.length >0){
					if(settingInfo[0].get('roam')){
						musicOn = settingInfo[0].get('music');
						soundOn	= settingInfo[0].get('sound');
						popAnim	= settingInfo[0].get('popAnim');
						mylocation = settingInfo[0].get('mylocation');
						smartRec = settingInfo[0].get('smartRec');
						playmode = settingInfo[0].get('rotation');
						roam = true;
					}
				}
			});
		}
	});



	queryParams = 
	[ 
		'access_token='+accessToken,
		'format=JSON',
		'method=friends.getFriends',
		'v=1.0' 
	];
	r_query = queryParams.join('&');

	md5str = queryParams.join('') + Secret_Key;
  
	md5Value = $.md5(md5str)

	r_query = r_query+'&sig='+md5Value;

	$.ajax
	({
		type: "Post",
		url: "php/renren.php",
		data: {data: r_query},
		dataType: "json",
		success: function(jsonData)
		{
			var pullUpEl, pullUpOffset,
			displayCount = 0;
			var len = jsonData.length;
		    if(win_height < win_width){
		        $('#headlistHeader').css('height','6%');
		        $('#headContent').css('height','93%');
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
				myScroll = new iScroll('headContent', {
					useTransition: true,
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
					cl4.show();
					if(isMobile.any())
						setTimeout(function(){
							friends_loaded();
							cl4.hide();
						},2000);
					else
						setTimeout(function(){
							$("#headScroller").css('display','');
							friends_loaded();
							cl4.hide();
						},3000);
				});
				$("#backToFreinds").unbind('click').click(function(){
					cl4.show();
					setTimeout(function(){
							friends_loaded();
							cl4.hide();
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
		r_query = queryParams.join('&');
		url = path + r_query;
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
		r_query = queryParams.join('&');

		md5str = queryParams.join('') + Secret_Key;
	  
		md5Value = $.md5(md5str)

		r_query = r_query+'&sig='+md5Value;

		$.ajax
		({
			type: "Post",
			url: "php/renren.php",
			data: {data: r_query},
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
				if(!isMobile.any()){
					$('#albumsContent').height(win_height - 65);
					$('#albumsContent').css({'position':'absolute'
						,'top':'45px'
						,'width':'99%'});
					$( "#albumslist" ).css({'margin-top':'0px',
						'margin-bottom':'0px'});
					if(myScroll)
						myScroll.destroy();
					setTimeout(function(){
						myScroll = new iScroll('albumsContent', {
					        momentum: false,
					        useTransform: true
					    });
				    },500);
				}
			}
		});
	}
});

$( "#backToAlbums" ).unbind('click').click(function(){
	if(myScroll)
		myScroll.destroy();
	setTimeout(function(){
		myScroll = new iScroll('albumsContent', {
	        momentum: false,
	        useTransform: true
	    });
	},200);
});
$( "#albumslist" ).unbind('click').click(function(data){
	if(myScroll)
		myScroll.destroy();
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
	r_query = queryParams.join('&');

	md5str = queryParams.join('') + Secret_Key;
    
	md5Value = $.md5(md5str)

	r_query = r_query+'&sig='+md5Value;

	$.ajax({
		type: "Post",
		url: "php/renren.php",
		data: {data: r_query},
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
				// img.width = img.height = 200;
				hr.append(img);
				li.append(hr);
				if( win_height < win_width ) {
					$(".photolist li").css('width','14%');
				}
				$('.photolist').append(li);
			}

			var $container = $('#photolistContent');
			$container.imagesLoaded(function(){
				$('#photolistContent').css({
					'position':'absolute',
					'top':'45px',
					'width':'99%'});
				if(!isMobile.any()){
					$('#photolistContent').height(win_height - 50);
					
					if(myScroll)
						myScroll.destroy();
					myScroll = new iScroll('photolistContent', {
				        momentum: false,
				        useTransform: false
				    });
				}
				if(photoMsnry)
					photoMsnry.destroy();
				photoMsnry = new Masonry( document.querySelector('.photolist') );
				
			});
		}
	});
});
  
$('.photolist').unbind('click').click(function(data, handler)
{
	if(myScroll)
		myScroll.destroy();
	if(photoMsnry)
		photoMsnry.destroy();
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
  