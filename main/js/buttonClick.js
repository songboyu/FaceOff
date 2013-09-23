//录像按钮点击事件，创建视频流
    $('#createVideo').click(function(){
        document.getElementById('img').style.display='none';

        document.getElementById("canvas").style.display="none";
        document.getElementById("video").style.display="";
        
        document.getElementById('confirm').style.display="none";
        document.getElementById('drawFace').style.display="none";
        document.getElementById('changeFace').style.display="none";
       // document.getElementById('sureFace').style.display="none";
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
// //提交URL按钮点击事件
    // $('#urlSubmit').click(function()
    // {
    //     if(document.getElementById("url").value != "")
    //         drawImg(document.getElementById("url").value);
    //     else
    //         alert("请填写URL");
    // });
    //截图按钮点击事件
    $('#snap').click(function(){
        clearCanvas();

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
               url = 'http://soongboyu.eicp.net/'+filename;
               drawImg(url);
            }  
        });
        currentImg.src = imgAsDataURL;
        //document.location.href = imgAsDataURL.replace('image/jpeg', 'image/octet-stream');
        //打开新窗口展示片并保存
        //window.open(imgAsDataURL, "toDataURL() image", "width=600, height=200");
    });
    //确认按钮点击事件，发送数请求据
    $('#confirm').click(function(){
        completed = false;
        $.ajax({  
            url: API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET + '&url=' + url,  
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
    $('#ok').click(function(){
        // media.pause(); 
        completed = true;
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
                //showImg.src= 'http://soongboyu.eicp.net/'+filename;
                
                //showImg.onload = function() 
                //{
                    cl.hide();
                    document.getElementById('confirm').style.display="none";
                    document.getElementById('drawFace').style.display="none";
                    document.getElementById('changeFace').style.display="none";
                   // document.getElementById('sureFace').style.display="none";
                    document.getElementById('ok').style.display="none";
                    document.getElementById('charactor').style.display="none";

                    document.getElementById('share').style.display='';
                    //document.getElementById('img').style.display='';

                    
                    jiathis_config={
                        summary:"啦啦啦啦",
                        title:"songboyu",
                        url:"http://soongboyu.eicp.net",
                        pic:"http://soongboyu.eicp.net/"+filename,
                        hideMore:false
                    };
               // };
            }  
        });

        
    });
    var container = document.querySelector('.gallery');
    var msnry = new Masonry(container);
    $('#imageShow').click(function(){
        msnry.destroy();
        $('.gallery').empty();
        $.ajax
        ({
            type: "GET",
            url: "php/getFiles.php",
            dataType:"json",  
            success: function (filenames)
            { 
                for (var i = 0, len = filenames.length; i < len; i++) 
                {      
                    var li = $('<li class="box"></li>');
                    var hr = $('<a href="images/withFace/'+filenames[i]+'" rel="external"></a>');
                    var img = document.createElement('img');
                    img.src = 'images/withFace/'+filenames[i];
                    hr.append(img);
                    li.append(hr);
                    if( !isMobile.any() ) 
                    {
                        li.css('width','14%');
                    }
                    $('.gallery').append(li);
                    // $('.gallery').masonry('appended',li); 
                }
                $('.gallery').imagesLoaded(function(){
                    
                    // $('.gallery').masonry({
                    //   itemSelector: '.gallery li'
                    // });
                    msnry = new Masonry( container );
                });
                var myPhotoSwipe = $(".gallery a").photoSwipe({ enableMouseWheel: true , enableKeyboard: true });
            }  
        });
    });
    var musicOn = true;
    $('#home').click(function(){
        media.pause();
    });
    $('#drawingBoard').click(function(){
        if(musicOn==true){
            media.play();
        }
    });
    $('#music').click(function(){
        if(musicOn==true){
            media.pause();
            musicOn = false;
        }else{
            media.play();
            musicOn = true;
        }
    });
    $('#charactor').click(function(){
        $('#charactorImage').empty();
        var charactorImage = document.createElement('img');
        var introduction = $('#introduction');
        
        charactorImage.src = "images/charactor/"+NameList[random]+".png";
        introduction.html(introductionList[random]);
        
        $('#charactorImage').append(charactorImage);
    });
    function sortByScore(a,b)
    {
        var start_a = a.indexOf("_")+1;
        var start_b = b.indexOf("_")+1;

        var stop_a = a.lastIndexOf(".");
        var stop_b = b.lastIndexOf(".");

        var score_a = parseFloat(a.substring(start_a,stop_a));
        var score_b = parseFloat(b.substring(start_b,stop_b));
        return score_b - score_a;
    }
    $('#topShow').click(function(){
        $('.gallery').empty();
        $.ajax
        ({
            type: "GET",
            url: "php/getFiles.php",
            dataType:"json",  
            success: function (filenames)
            { 
                $('#faceTop').empty();
                var arr = new Array()
                for (var i = 0, len = filenames.length; i < len; i++) {
                    arr.push(filenames[i]);
                    arr = arr.sort(sortByScore);
                }
                for (var i = 0, len = 10; i < len; i++) {
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
                    $('#faceTop').append(li);
                }
                $( "#faceTop" ).listview( "refresh" );
            }  
        });
    });
    $( "#faceTop" ).click(function(data){
        var topShowImageURL;
        var $target = $(data.target);
        if( $target.is("A") ) 
        {
            topShowImageURL = $target.children()[2].src;
        }
        else if ( $target.is("div") || $target.is("P") ) 
        {
            topShowImageURL = $target.parent().children()[2].src;
        }
        else
            topShowImageURL = data.target.src;

        $.mobile.changePage("#page9","slidedown", true, true);
        var topShowImage = document.getElementById('topShowImage');
        topShowImage.src = topShowImageURL;
  });
  
