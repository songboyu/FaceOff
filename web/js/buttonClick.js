
//录像按钮点击事件，创建视频流
$('#createVideo').click(function(){
    document.getElementById('img').style.display='none';

    document.getElementById("canvas").style.display="none";
    document.getElementById("video").style.display="";
    
    document.getElementById('confirm').style.display="none";
    // document.getElementById('drawFace').style.display="none";
    document.getElementById('changeFace').style.display="none";
    document.getElementById('ok').style.display="none";
    document.getElementById('share').style.display="none";
    document.getElementById('charactor').style.display="none";
    document.getElementById("snap").style.display="";

    if (navigator.getUserMedia) 
    {
        navigator.getUserMedia({
            video: {
                mandatory:  {   
                   // width:  {   min:    640 },  
                   // height: {   min:    480 }   
                },
                optional: [
                  //  {   width:  {   min:    650,    max:    800 }},     
                  //  {   facingMode: "right"  }   
                ]
            }
        },
        function(stream)
        {
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            } else {
            
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            video.play();

        }, errBack);
    } else
    {
        console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
        // Display a friendly "sorry" message to the user
    }
});

//截图按钮点击事件
$('#snap').click(function(){
    clearCanvas();

    document.getElementById("nowork").style.display = "none";

    document.getElementById("canvas").style.display="none";
    document.getElementById("video").style.display="none";
    document.getElementById("snap").style.display="none";
    document.getElementById('ok').style.display="none";
    document.getElementById('share').style.display="none";
    document.getElementById('charactor').style.display="none";

    scale = 1;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var imgAsDataURL = canvas.toDataURL('image/jpeg', 1.0);

    $.ajax
    ({
        type: "POST",
        url: "php/upload.php",
        data: {image: imgAsDataURL},
        beforeSend: function (XHR) 
        {   
            cl.show(); // Hidden by default
        },
        success: function (filename)
        {  
           url = SERVER_URL+'/'+filename;
           drawImg(url);
           myfilename = filename;
        }  
    });
    currentImg.src = imgAsDataURL;
});


$('#near').unbind('click').click(function()
{
    //var x=document.getElementById("demo");
    cl5.show();
    if($('#nearPeople'))
        $('#nearPeople').empty();
    if (navigator.geolocation)
    {
        $('#nearPeoplescroller').height(win_height * 0.936);
        $('#nearHeader').height(win_height * 0.06);
        $('#nearPeoplescroller').css('top',win_height * 0.064);
        navigator.geolocation.getCurrentPosition(function (pos){
            lat=pos.coords.latitude;
            lon=pos.coords.longitude;
            query = new Parse.Query(faceRecord);
            query.find().then(function(info) { 
                var file_len = info.length;
                var count = 0;
                for (var i = 0; i < file_len; i++) {
                    if(count > 15) break;
                    var user_lat = info[i].get('lat');
                    var user_lon = info[i].get('lon');
                    var userName = info[i].get('username');
                    var filename = info[i].get('filename');
                    var distance = GetDistance(lat,lon,user_lat,user_lon);
                    if(distance < 200){
                        count ++;
                        var li = $('<li></li>');
                        var hr = $('<a></a>');
                        var img = document.createElement('img');
                        img.src = 'images/withFace/'+filename;
                        img.width = 50;
                        img.height = 80;
                        hr.append(img);
                        var div = $('<div class="u"></div>');
                        div.append($('<p class="username">'
                            +(userName.length == 0 ? '佚名':userName)+'</p>'));
                        div.append('<p  class="ui-li-aside">'+
                        filename.substring(0,4)+'年'+
                        filename.substring(4,6)+'月'+
                        filename.substring(6,8)+'日 '+
                        filename.substring(8,10)+':'+
                        filename.substring(10,12)+'</p>');
                        div.append($('<span>我们相距'+distance+'公里</span>'));
                        hr.append(div);
                        li.append(hr);
                        $('#nearPeople').append(li);
                    }
                }
                $( "#nearPeople" ).listview( "refresh" );
                if(myScroll)
                    myScroll.destroy();
                myScroll = new iScroll('nearPeoplescroller', {
                    scrollbarClass: 'myScrollbar',
                    momentum: false,
                    useTransform: false,
                    onScrollStart:function (){
                        $('.myScrollbarV').css('display','');
                    },
                    onScrollEnd:function (){
                        $('.myScrollbarV').css('display','none');
                    }
                });
                myScroll.refresh();
                cl5.hide();
                $('.myScrollbarV div').css('height',
                    $('#topShowContent').height() * 
                    $('#topShowContent').height() /
                    $('#topShowScroll').height());
                $('.myScrollbarV').css('display','none');
            });
        },function (error){
            cl5.hide();
            console.log(error);
            switch(error.code) 
            {
                case error.PERMISSION_DENIED:
                  $('#nearPeoplescroller').html('<p>没有权限获取位置信息，请查看浏览器设置<p>');
                  break;
                case error.POSITION_UNAVAILABLE:
                  $('#nearPeoplescroller').html('<p>位置信息不可用<p>');
                  break;
                case error.TIMEOUT:
                  $('#nearPeoplescroller').html('<p>获取位置信息超时<p>');
                  break;
                case error.UNKNOWN_ERROR:
                  $('#nearPeoplescroller').html('<p>取位置信息时发生未知错误<p>');
                  break;
            }
        },
        {maximumAge: 10000});
    }
    else{
        cl5.hide();
        $('#nearPeoplescroller').html('<p>浏览器不支持获取位置信息<p>');
    }
});

//确认按钮点击事件，发送数请求据
$('#confirm').click(function(){
    completed = false;
    $.ajax({  
        url: API_URL + 'detection/detect?api_key=' + API_KEY + 
            '&api_secret=' + API_SECRET + '&url=' + url +
            '&mode=oneface&attribute=gender,age,race,smiling,glass,pose',  
        cache: false, 
        contentType: false,  
        processData: false,  
        dataType:"json",  
        type: 'POST',  
        beforeSend: function (XHR) 
        {   
            cl.show(); // Hidden by default
        },
        success: function (faces) 
        {  
            cl.hide();
            drawFaces(faces.face);
        }  
  
    });   
});

//返回画板
$('#gotoPage2').click(function(){
    if(!completed && started){
        if($('div.tooltip')){
            setTimeout(function(){
                $('div.tooltip').show();
            },1000);
        }
    }
});

//点击完成事件
$('#ok').click(function(){
    completed = true;
    start = false;
    var imgData = canvas.toDataURL('image/jpeg', 1.0);

    $.ajax
    ({
        type: "POST",
        url: "php/uploadWithFace.php",
        data: {image: imgData,score:score},
        beforeSend: function (XHR) 
        {   
            cl.show(); // Hidden by default
        },
        success: function (filename)
        {  
            cl.hide();
            var lat = -1;
            var lon = -1;
            var g_upScore = new faceRecord();
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(function(pos){
                    lat=pos.coords.latitude;
                    lon=pos.coords.longitude;
                    g_upScore.save({filename:filename,up:0,down:0,score_user:0,lat:lat,lon:lon,username:renrenName});
                },function(error){
                    console.log(error);
                    g_upScore.save({filename:filename,up:0,down:0,score_user:0,lat:lat,lon:lon,username:renrenName});
                },
                {maximumAge: 10000});
            } else{
                g_upScore.save({filename:filename,up:0,down:0,score_user:0,lat:lat,lon:lon,username:renrenName});
            }
            document.getElementById('confirm').style.display="none";
            document.getElementById('changeFace').style.display="none";
            document.getElementById('ok').style.display="none";
            document.getElementById('charactor').style.display="none";
            document.getElementById('share').style.display='';

            jiathis_config={
                summary:"这是我在FaceOff的新作，大家一起来玩FaceOff吧！",
                title:"分享于FaceOff",
                url:SERVER_URL,
                pic:SERVER_URL+'/images/withFace/'+filename,
                hideMore:false
            };
        }  
    });

});

//点击图库按钮事件,显示图库
$("#imageShow").unbind('click').click(function(){
    $('#galleryPullUp').css('display','none');
    $("#galleryBackToHome").unbind('click').click(function(){
        msnry.destroy();
        myScroll.destroy();
        myScroll = null;
    });
    cl3.show();
    if(msnry)
        msnry.destroy();
    $('.gallery').empty();

    query = new Parse.Query(faceRecord);
    query.find().then(function(info) {
        var imgCount = 0;
        var file_len = info.length;
        if(win_height < win_width){
            $('#galleryHead').css('height','6%');
            $('#galleryContent').css({'height':'93%','top':'7%'});

        }
        else if(!isMobile.any()){
            $('#galleryHead').css('height','3%');
            $('#galleryContent').css({'height':'97%','top':'4%'});
        } else{
            $('#galleryHead').height(win_height * 0.05);
            $('#galleryContent').height(win_height * 0.945);
            $('#galleryContent').css('top',win_height * 0.055 +'px');

        }
        gallery_loaded = function(){
            var flip = false;
            myScroll = new iScroll('galleryContent', {
                scrollbarClass: 'myScrollbar',
                useTransition: true,
                onScrollStart: function () {
                    $('.myScrollbarV').css('display','');
                    flip = false;
                    if(imgCount < file_len){
                        $('.galleryPullUpLabel').html('上拉刷新');
                        $('#galleryPullUp').css('display','');
                        this.refresh();
                    } else {
                        $('.galleryPullUpLabel').html('全部加载完成');
                        $('#galleryPullUp').css('display','');
                        this.refresh();
                    }
                },
                onScrollMove: function () {
                    if (this.y < (this.maxScrollY - 60) && flip === false) 
                    {
                        if(imgCount < file_len){
                            flip = true;
                            $('.galleryPullUpLabel').html('松开刷新');
                        }
                    }   else if (this.y > (this.maxScrollY - 60) && flip === true) {
                        flip = false;
                        $('.galleryPullUpLabel').html('上拉刷新');
                    }

                },
                onScrollEnd: function () {
                    $('.myScrollbarV').css('display','none');
                    
                    if (flip == true) {
                        flip = false;
                        if(imgCount < file_len){
                            $('.galleryPullUpLabel').html('正在努力加载中...');
                            galleryPullUpAction();
                            
                        }
                        else{
                            $('#galleryPullUp').css('display','none');
                            this.refresh();
                        }
                    } else {
                        $('#galleryPullUp').css('display','none');
                        this.refresh();
                    }
                }
            });
            
        }
        galleryPullUpAction = function(){
            for (var i = 0, len = isMobile.any() == true ? 6:12; i < len; i++) 
            {
                if(imgCount >= file_len) break;
                var li = $('<li class="box"></li>');
                var up = $('<li class="up"></li>');
                var down = $('<li class="down"></li>');
                var a1 = $('<a class="alink" onclick="javascript:upAdd(this)" title='+info[imgCount].get("up")+' name='+info[imgCount].get("filename")+'>'+info[imgCount].get("up")+'</a>');
                var a2 = $('<a class="alink" onclick="javascript:downAdd(this)" title='+info[imgCount].get("down")+' name='+info[imgCount].get("filename")+'>'+info[imgCount].get("down")+'</a>');

                var hr = $('<a class="imageShow_large" href="images/withFace/'+info[imgCount].get("filename")+'" rel="external"></a>');
                var img = document.createElement('img');
                img.src = 'images/withFace/'+info[imgCount].get("filename");
                hr.append(img);
                li.append(hr);
                up.append(a1);
                down.append(a2);
                li.append(up);
                li.append(down);
                if( win_height > win_width ) 
                {
                    li.css('width','33.3333%');
                    
                }
                $('.gallery').append(li);
                if(up.width() * 0.9 < 90){
                    a1.width(up.width() * 0.9);
                    a2.width(up.width() * 0.9);
                }
                imgCount ++;

            }
            $('.box').css('display','');
            $('#galleryPullUp').css('display','none');
            $('.gallery').imagesLoaded(function(){
                myScroll.refresh();
                msnry = new Masonry( container );
                var myPhotoSwipe = $(".imageShow_large").photoSwipe({ enableMouseWheel: true , enableKeyboard: true });
                
            });
        }
        for (var i = 0, len = 14; i < len; i++) 
        {   
            if(i >= file_len) break;
            var li = $('<li class="box"></li>');
            var up = $('<li class="up"></li>');
            var down = $('<li class="down"></li>');
            var a1 = $('<a class="alink" onclick="javascript:upAdd(this)" title='+info[i].get("up")+' name='+info[i].get("filename")+'>'+info[i].get("up")+'</a>');
            var a2 = $('<a class="alink" onclick="javascript:downAdd(this)" title='+info[i].get("down")+' name='+info[i].get("filename")+'>'+info[i].get("down")+'</a>');

            var hr = $('<a class="imageShow_large" href="images/withFace/'+info[i].get("filename")+'" rel="external"></a>');
            var img = document.createElement('img');
            img.src = 'images/withFace/'+info[i].get("filename");
            hr.append(img);
            li.append(hr);
            up.append(a1);
            down.append(a2);
            li.append(up);
            li.append(down);
            if( win_height > win_width ) 
            {
                li.css('width','33.3333%');
                
            }
            $('.gallery').append(li);
            if(up.width() * 0.9 < 90){
                a1.width(up.width() * 0.9);
                a2.width(up.width() * 0.9);
            }
            imgCount ++;
        }
        if(myScroll){
            myScroll.destroy();
        }
        gallery_loaded();
        $('.gallery').imagesLoaded(function(){
            if(msnry)
                msnry.destroy();
            msnry = new Masonry( container );
            var myPhotoSwipe = $(".imageShow_large").photoSwipe({ enableMouseWheel: true , enableKeyboard: true });
            if(myScroll){
                myScroll.refresh();
                $('.myScrollbarV div').css('height',
                    $('#galleryContent').height() * 
                    $('#galleryContent').height() /
                    $('#galleryScroll').height());
                $('.myScrollbarV').css('display','none');

            }
        });
        cl3.hide();
    });
});
    
//点击主页按钮事件
$('#home').unbind('click').click(function(){
    media.pause();
    if($('div.tooltip')){
        $('div.tooltip').css('display','none');
    }
});


$('#drawingBoard').click(function(){
    if(musicOn && started){
        media.play();
    }
});
$('#charactor').click(function(){
    WhoAmI.introduction.Show(index);
});
    
$('#topShow').click(function(){
           
    document.getElementById("radio_faceTop_score").click();
    $("#topBackToHome").unbind('click').click(function(){
        myScroll.destroy();
        myScroll = null;
    });
});

//"评分排行榜"按钮事件
$('#radio_faceTop_score').unbind('click').click(function() {
    $('#faceTop').empty();
    cl2.show();
    $.ajax
    ({
        type: "GET",
        url: "php/getFiles.php",
        dataType:"json",  
        success: function (filenames)
        { 
            $('#topShowContent').height(win_height * 0.936);
            $('#topHeader').height(win_height * 0.06);
            $('#topShowContent').css('top',win_height * 0.064);
            $('#faceTop').empty();
            var arr = new Array();
            for (var i = 0, len = filenames.length; i < len; i++) {
                arr.push(filenames[i]);
            }
            arr = arr.sort(sortByScore);

            for (var i = 0, len = 10; i < len; i++) {
                if(i >= filenames.length) break;
                var li = $('<li></li>');
                var hr = $('<a></a>');
                var img = document.createElement('img');
                var topImg = document.createElement('img');
                topImg.src = 'images/top/'+(i+1)+'.png';
                hr.append(topImg);
                img.src = 'images/withFace/'+arr[i];
                img.width = 50;
                img.height = 80;
                hr.append(img);

                var start = arr[i].indexOf("_")+1;
                var stop = arr[i].lastIndexOf(".");
                var score = parseInt(arr[i].substring(start,stop));
                var div = $('<div class="score">'+arr[i].substring(start,stop)+'</div>');
                hr.append(div);
                hr.append('<p  class="ui-li-aside">'+
                    arr[i].substring(0,4)+'年'+
                    arr[i].substring(4,6)+'月'+
                    arr[i].substring(6,8)+'日 '+
                    arr[i].substring(8,10)+':'+
                    arr[i].substring(10,12)+'</p>');
                li.append(hr);
                if(i==0){
                    li.css("background","rgb(241, 93, 9)");
                    div.css("color","#F0D409");
                }else if(i==1){
                    li.css("background","rgb(153, 211, 183)");
                    div.css("color","#9E9A7F");
                }else if(i==2){
                    li.css("background","rgb(228, 199, 124)");
                    div.css("color","#DA8B16");
                }else{
                    li.css("background","rgb(226, 212, 205)");
                }
                if(win_width < win_height){
                    li.css('width','98%');
                }
                $('#faceTop').append(li);
            }
            $( "#faceTop" ).listview( "refresh" );
            
            setTimeout( function () {
                cl2.hide();
                if(myScroll)
                    myScroll.destroy();
                myScroll = new iScroll('topShowContent', {
                    scrollbarClass: 'myScrollbar',
                    momentum: false,
                    useTransform: true,
                    onScrollStart:function (){
                        $('.myScrollbarV').css('display','');
                    },
                    onScrollEnd:function (){
                        $('.myScrollbarV').css('display','none');
                    }
                });
                myScroll.refresh();
                $('.myScrollbarV div').css('height',
                    $('#topShowContent').height() * 
                    $('#topShowContent').height() /
                    $('#topShowScroll').height());
                $('.myScrollbarV').css('display','none');
            },1000);
        }  
    });
});

//"人气排行榜"按钮事件
$('#radio_faceTop_user').unbind('click').click(function() {
    cl2.show();
    $('#faceTop').empty();
    var query = new Parse.Query(faceRecord);
    query.descending("score_user");
    query.limit(10);
    query.find().then(function(info) {
        for (var i = 0, len = 10; i < len; i++) {
            if(i >= info.length) break;
            var li = $('<li></li>');
            var hr = $('<a></a>');
            var img = document.createElement('img');
            var topImg = document.createElement('img');
            topImg.src = 'images/top/'+(i+1)+'.png';
            hr.append(topImg);
            img.src = 'images/withFace/'+info[i].get("filename");
            img.width = 50;
            img.height = 80;
            hr.append(img);
            var div = $('<div class="score_user">'+info[i].get("score_user")+'分</div>');
            hr.append(div);
            hr.append('<p  class="ui-li-aside">( '+info[i].get("up")+'个赞，'+info[i].get("down")+'个拍 )</p>');
            li.append(hr);
            if(i==0){
                li.css("background","rgb(241, 93, 9)");
                div.css("color","#F0D409");
            }else if(i==1){
                li.css("background","rgb(153, 211, 183)");
                div.css("color","#9E9A7F");
            }else if(i==2){
                li.css("background","rgb(228, 199, 124)");
                div.css("color","#DA8B16");
            }else{
                li.css("background","rgb(226, 212, 205)");
            }
            $('#faceTop').append(li);
        }
        cl2.hide();
        $('#topShowContent').height(win_height * 0.936);
        $('#topHeader').height(win_height * 0.06);
        $('#topShowContent').css('top',win_height * 0.064);
        
        $( "#faceTop" ).listview( "refresh" );
        if(myScroll)
            myScroll.destroy();
        myScroll = new iScroll('topShowContent', {
            scrollbarClass: 'myScrollbar',
            momentum: false,
            useTransform: true,
            onScrollStart:function (){
                $('.myScrollbarV').css('display','');
            },
            onScrollEnd:function (){
                $('.myScrollbarV').css('display','none');
            }
        });
        
        myScroll.refresh();
        $('.myScrollbarV div').css('height',
            $('#topShowContent').height() * 
            $('#topShowContent').height() /
            $('#topShowScroll').height());
        $('.myScrollbarV').css('display','none');
    });
    
});

$( "#faceTop" ).unbind('click').click(function(data){
    var topShowImageURL;
    var $target = $(data.target);
    if( $target.is("A") ) {
        topShowImageURL = $target.children()[2].src;
    }
    else if ( $target.is("div") || $target.is("P"))  {
        topShowImageURL = $target.parent().children()[2].src;
    }
    else if($target.next().is("img")) {
        topShowImageURL = $target.parent().children()[2].src;
    }
    else {
        topShowImageURL = data.target.src;
    }
    $.mobile.changePage("#page9","slidedown", true, true);
    var topShowImage = document.getElementById('topShowImage');
    topShowImage.src = topShowImageURL;
});

$( "#nearPeople" ).unbind('click').click(function(data){
    console.log(data);
    var topShowImageURL;
    var $target = $(data.target);

    
    if( $target.is("A") ) {
        topShowImageURL = $target.children()[0].src;
    }
    else if ( $target.is("div"))  {
        topShowImageURL = $target.prev().attr('src');
    }
    else if($target.is("span") || $target.is("p")) {
        topShowImageURL = $($target.parent()).prev().attr('src');
    }
    else {
        topShowImageURL = data.target.src;
    }
    var topShowImage = document.getElementById('nearPeopleImage');
    topShowImage.src = topShowImageURL;
    $.mobile.changePage("#page14","slidedown", true, true);
    
});

$('#user').unbind('click').click(function() {
    $('#renrenConnect').click();
});
