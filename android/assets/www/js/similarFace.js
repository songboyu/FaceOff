    var currentFaceID;//当前faceID
    var mycanvas = document.getElementById("mypic");
    var myctx = mycanvas.getContext("2d");
   
    //对脸库进行模型训练
    train_FaceSet("Faces");
    train_FaceSet("studentFaces");

    var latlng = new google.maps.LatLng(31.813192, 103.996395);//初始位置（中国）
    var myOptions = {
        zoom: 3,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    
    $('#similarFace').click(function(){
        var img = new Image();
        if( isMobile.any() ) {
            mycanvas.width   = document.body.clientWidth/2 - 27;
            mycanvas.height  = currentImg.height/currentImg.width * mycanvas.width;
            $(".compare").css('width','100%');
            $(".compare").css('height','380px');
            $("#map").css('width','100%');
            $("#map").css('height','250px');
        }else{
            $("#addressContent").css('position','absolute');
            $("#addressContent").css('top','62px');
            $("#addressContent").css('left','700px');

            $("#map").css('position','absolute');
            $("#map").css('height','487');
            $("#map").css('top','98px');
            $("#map").css('right','50px');
            $(".compare").css('margin','0 auto 0 50px');

            $("#myshare").css('position','absolute');
            $("#myshare").css('bottom','5px');
            $("#myshare").css('right','50px');
            mycanvas.width   = 285;
            mycanvas.height  = 426;
        }
        //图片加载完成
        img.onload = function () {
            //将图片绘制在mycanvas上
            myctx.drawImage(img, 0, 0, mycanvas.width, mycanvas.height);
        }
        img.src = url;

        similarpic.width  = mycanvas.width;
        similarpic.height = mycanvas.height;
        
        document.getElementById("radio1").click();
    });
    //"用户相似脸"按钮事件
    $('#radio1').unbind('click').click(function() {
        //对人脸集进行模型训练
        train_FaceSet("studentFaces");

        var similarFace_TheMost = document.getElementById("similarFace_TheMost");
        //详细内容见”http://cn.faceplusplus.com/dev/api/recognition/recognitionsearch/“
        searchFaces("studentFaces", currentFaceID).then(
            searchFacesSuceess,
            function (error) {
                // handle error.
                console.log("faceSearch_Bclick error:" + error.responseText);
            });
    });
    //"明星相似脸"按钮事件
    $('#radio2').unbind('click').click(function() {
        //对人脸集进行模型训练
        train_FaceSet("Faces");
        
        var similarFace_TheMost = document.getElementById("similarFace_TheMost");
        //详细内容见”http://cn.faceplusplus.com/dev/api/recognition/recognitionsearch/“
        searchFaces("Faces", currentFaceID).then(
            searchFacesSuceess,
            function (error) {
                // handle error.
                console.log("faceSearch_Bclick error:" + error.responseText);
            });
    });
    
    //确认上传至脸库按钮事件
    $("#addToFaceset").click(function(){
        var faceName = prompt("请填写您的姓名");
        if (!faceName){
            alert("请先填写姓名");
        }
        else {
            // handle completed.
            //if (document.getElementById("allowPosition").checked == true) {

            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(function (position){
                    var lat = position.coords.latitude;//经度
                    var lon = position.coords.longitude;//纬度
                    $.ajax({  
                        url: API_URL + 'detection/detect?api_key=' + API_KEY + 
                                                       '&api_secret=' + API_SECRET + 
                                                       '&url=' + url +
                                                       '&tag=' + myfilename + "|" + faceName + "|" + lat + "|" + lon,  
                        cache: false,  
                        contentType: false,  
                        processData: false,  
                        dataType:"json",  
                        type: 'POST',  
                        beforeSend: function (XHR) 
                        {   
                            cl1.show(); // Hidden by default
                        },
                        success: function (faces) 
                        {  
                            // var json = JSON.parse(result.responseText);
                            //添加到face++人脸集
                            addToFaceSet(faces.face[0].face_id, "studentFaces");
                        }  
                  
                    });  
                    
                },
                function(error)
                {
                    console.log("Got an error, code: " + error.code + " message: "+ error.message);
                },
                {maximumAge: 10000}); // 这里设置超时为10000毫秒，即10秒
            }

        }
    });       
    //设置相似脸
    function faceContainerSet(id, url, name, score) {
        document.getElementById(id).src = url;
        document.getElementById(id).nextElementSibling.innerText = name;
        document.getElementById("similarScore").innerText = "相似度：" + score;
    }
    //搜索相似脸成功
    function searchFacesSuceess(result) {
        document.getElementById("myshare").style.display = "";

        var similarFaces = result.candidate;
        //显示相似脸集合
        for (var i = 0, len = similarFaces.length; i < len; i++) {
            var e = similarFaces[i].tag.split("|", 4);

            if (i == 0) {
                getMyaddress(e[2] + "," + e[3]);
                GetGeolocatorInfo(e[2], e[3], e[1], 12);
                var msg = {
                    summary: "通过相似脸比对，我和<" + e[1] + ">的脸最相似，快一起来玩吧！",
                    pic: SERVER_URL + "/" + e[0]
                };
                faceContainerSet("similarpic", SERVER_URL + "/" + e[0], e[1] , similarFaces[i].similarity.toFixed(2) + "%");

            }
        }
    }
    //将位置信息通过iframe发送给map.js显示在地图上
    function GetGeolocatorInfo(lat, lon, name, zoom) {
        //var geolocator = Windows.Devices.Geolocation.Geolocator();
        //geolocator.getGeopositionAsync().done(function (position) {
        //var lat = position.coordinate.latitude;//纬度
        //var lon = position.coordinate.longitude;//经度

        //var latlon = new google.maps.LatLng(lat, lon)
        var messageObject = {
            name: name,
            command: 'zoomTo',
            latitude: lat,
            longitude: lon,
            zoom: zoom
            //Even more info here.
        };
        //Convert message object to string and send to the map control.
       
            var newCenter;
            var note;
            //If message is to zoom, change the location and zoom level
            if (messageObject.command == "zoomTo") {
                if (messageObject.latitude == null || messageObject.longitude == null) {
                    newCenter = new google.maps.LatLng(31.813192, 103.996395);
                    messageObject.zoom = 3;
                    note = "无位置共享";
                    document.getElementById("addressContent").innerText = note;
                }
                else{
                    //getMyaddress(messageObject.latitude + "," + messageObject.longitude);
                    newCenter = new google.maps.LatLng(messageObject.latitude, messageObject.longitude);
                    note = messageObject.name ;//+" "+ myaddress;
                    //alert(note);
                    
                }
                var newOptions = {
                    zoom: messageObject.zoom,
                    center: newCenter,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("map"), newOptions);
                
                var styleIcon = new StyledIcon(
                    StyledIconTypes.BUBBLE,
                    {
                        color: "5bac89",
                        text: note,
                        fore: "ffffff",
                    }
                );
                var styleMaker = new StyledMarker({
                    styleIcon: styleIcon,
                    position: newCenter,
                    map: map
                });
            }

    }

    //根据结果画出五官位置
    function drawFeatures(faceinfo, myctx) {
        var rgbColor, rgbaColor;
        //如果识别结果为男性则用蓝色
        if (faceinfo.attribute.gender.value === 'Male') {
            rgbColor = '#12BDDC';
            rgbaColor = 'rgba(18,189,220,0.8)';
        }
        //如果识别结果未女性则用淡紫色
        else {
            rgbColor = '#C537D8';
            rgbaColor = 'rgba(197,55,216,0.8)';
        }
        myctx.fillStyle = rgbColor;
        //定义五官类型
        var pointType = ['eye_left', 'eye_right', 'nose', 'mouth_left', 'mouth_right'];
        //依次画出五官位置
        for (var j = pointType.length - 1; j >= 0; j--) {
            myctx.beginPath();
            //五官标识大小为（图片大小 * 0.08）的圆形
            myctx.arc(faceinfo.position[pointType[j]].x * imageWidth * 0.01,
                    faceinfo.position[pointType[j]].y * imageHeight * 0.01,
                    faceinfo.position.width * 0.08, 0, Math.PI * 2);
            myctx.fill();
        }
    }