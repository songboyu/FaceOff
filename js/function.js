
    $(document).ready(function() { 
        $.mobile.ajaxLinksEnabled = false; 
    }); 
   
    var jiathis_config;
    //添加浏览器运动传感事件
    if (window.DeviceMotionEvent) 
    {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } 
    else
    {
        //alert('浏览器不支持运动传感事件');
    }

    var SHAKE_THRESHOLD = 100;      //最大摇动振幅
    var lastUpdate = 0;
    var times = 0;
    var x, y, z, last_x, last_y, last_z;
    //运动传感事件
    function deviceMotionHandler(eventData) {
      // Grab the acceleration including gravity from the results
      var acceleration = eventData.accelerationIncludingGravity;

      var curTime = new Date().getTime();

      if ((curTime - lastUpdate) > 400) {

          var diffTime = (curTime - lastUpdate);
          lastUpdate = curTime;

          x = acceleration.x;
          y = acceleration.y;
          z = acceleration.z;

          var speed = Math.abs(x+y+z-last_x-last_y-last_z) / diffTime * 10000;

          //document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<br />" + speed;
          
          if (speed > SHAKE_THRESHOLD) 
          {
            //alert("shake!");
            if(times < 1)
                times++;
            else
                times = 0;

            if(times == 1)
            {
                if(window.location.hash=="#page2"&&completed==false){
                    document.getElementById("changeFace").click();
                    //alert('shake');
                }
            }
          }

         
          last_x = x;
          last_y = y;
          last_z = z;
        } 

    }
    //getUserMedia多浏览器支持/////////////////////////////////////////////
    navigator.getUserMedia =   ( navigator.getUserMedia || 
                                navigator.webkitGetUserMedia || 
                                navigator.mozGetUserMedia || 
                                navigator.msGetUserMedia );
    window.URL =    window.URL || 
                    window.webkitURL || 
                    window.mozURL || 
                    window.msURL;
                  
    //getUserMedia返回错误
    var errBack = function(error) {
        console.log("Video capture error: "+ error.name + ": " + error.message); 
    };
    ///////////////////////////////////////////////////////////////////////
    var cl = new CanvasLoader('canvasloader-container');
    cl.setColor('#7d557d'); // default is '#000000'
    cl.setShape('spiral'); // default is 'oval'
    cl.setDiameter(68); // default is 40
    cl.setDensity(78); // default is 40
    cl.setRange(0.9); // default is 1.3
    cl.setFPS(29); // default is 24
    var loaderObj = document.getElementById("canvasLoader");
    loaderObj.style.position = "absolute";
    loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
    loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";


    var canvas = document.getElementById("canvas");
    var video = document.getElementById("video");
    var showImg = document.getElementById("img");
    var ctx = canvas.getContext('2d');
    var image = new Image;
    var handler;
    var random;
    var score;
    
    //读取脸谱图片
    var imgs = [];
    
    
    for(var i = 0; i < NameList.length; i++){
        var img = new Image();
        img.src = 'images/facebook/'+NameList[i]+'.png';
        imgs.push(img);
    }
    //////////////////////////////////////////////////////////////////////
    var reader = new FileReader();  //文件读取
    var currentImg = new Image();   //当前图片
    var cover = new Image();
    cover.src = 'images/cover.png';
    var scale ;     //缩放比例
    var url;        //图片URL  
    var completed = false //是否完成 
    
    if( isMobile.any() ) {
      video.width = document.body.clientWidth*0.94;
      document.getElementById('main').width = document.body.clientWidth;
    }
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
                    var myPhotoSwipe = $(".gallery a").photoSwipe({ enableMouseWheel: true , enableKeyboard: true });
                    // $('.gallery').masonry({
                    //   itemSelector: '.gallery li'
                    // });
                    msnry = new Masonry( container );
                });
            }  
        });
    
    /** 
     * 画圆角方块 
     * @param p 坐标点 
     * @param w 宽度 
     * @param h 高度 
     * @param fill 是否填充 
     * @param stroke 是否画线 
     * @param drawShadow 是否画阴影 
     */  
    function drawRect(p, w, h, fill, stroke, drawShadow) {  
        fill = typeof(fill) == "undefined" ? true : fill;  
        stroke = typeof(stroke) == "undefined" ? true : stroke;  
        drawShadow = typeof(drawShadow) == "undefined" ? true : drawShadow;  
        if (drawShadow) {  
            var offset = 2;  
            var oldStyle = ctx.fillStyle;  
            ctx.fillStyle = "#d0d0d0";  
            drawRect({x: p.x + offset, y: p.y + offset}, w, h, true, false, false);  
            ctx.fillStyle = oldStyle;  
        }  

        var x = p.x,  
            y = p.y,  
            r = 5; // 圆角半径  
        if (w < 2 * r) {  
            r = w / 2;  
        }  
        if (h < 2 * r) {  
            r = h / 2;  
        }  
        ctx.beginPath();  
        ctx.moveTo(x + r, y);  
        ctx.lineTo(x + w - r, y);  
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);  
        ctx.lineTo(x + w, y + h - r);  
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);  
        ctx.lineTo(x + r, y + h);  
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);  
        ctx.lineTo(x, y + r);  
        ctx.quadraticCurveTo(x, y, x + r, y);  
        ctx.closePath();  
        if (stroke) {  
            ctx.stroke();  
        }  
        if (fill) {  
            ctx.fill();  
        }   
    }  
    //js暂停函数   
    function Pause(obj,iMinSecond){    
       if (window.eventList==null) window.eventList=new Array();    
       var ind=-1;    
       for (var i=0;i<window.eventList.length;i++){    
           if (window.eventList[i]==null) {    
             window.eventList[i]=obj;    
             ind=i;    
             break;    
            }    
        }    
       if (ind==-1){    
       ind=window.eventList.length;    
       window.eventList[ind]=obj;    
       }    
      setTimeout("GoOn(" + ind + ")",iMinSecond);    
    }    
    //js继续函数   
    function GoOn(ind){    
      var obj=window.eventList[ind];    
      window.eventList[ind]=null;    
      if (obj.NextStep) obj.NextStep();    
      else obj();    
    }   
    //清空画布
    function clearCanvas() {
        ctx.fillStyle = '#EEE';
    }
    //显示信息
    function showStatus(text) {
        alert(text);
    }
    function drawFaces(faces) {
        media.load();
        media.play(); 

        if (faces.length === 0) 
            showStatus(messages.NO_FACE);
        else 
        {
            document.getElementById('confirm').style.display="none";
            document.getElementById('charactor').style.display="";
            document.getElementById('drawFace').style.display="";
            document.getElementById('changeFace').style.display="";
            document.getElementById('music').style.display="";
           // document.getElementById('sureFace').style.display="";
            document.getElementById('ok').style.display="";
            document.getElementById('share').style.display="none";
           // alert("识别成功");
            for (var i = faces.length - 1; i >= 0; i--) {
                var face = faces[i];
              

                var rgbColor,
                    rgbaColor;

                if (face.attribute.gender.value === 'Male') {
                    rgbColor = '#12BDDC';
                    rgbaColor = 'rgba(18,189,220,0.8)';
                } else {
                    rgbColor = '#C537D8';
                    rgbaColor = 'rgba(197,55,216,0.8)';
                }

                var pointType = ['eye_left', 'eye_right', 'center', 'mouth_left', 'mouth_right'];

                // draw facial pointType
                ctx.fillStyle = rgbColor;
                ctx.font = '20px 微软雅黑体';
                //ctx.font='20px "Reenie Beanie"';
                ctx.fillText('年龄: ' + face.attribute.age.value, 10, currentImg.height/scale+27);
                ctx.fillText('性别: ' + face.attribute.gender.value, 10, currentImg.height/scale+57);
                ctx.fillText('肤色: ' + face.attribute.race.value, 10, currentImg.height/scale+87);

                ctx.fillText('(±' + face.attribute.age.range.toFixed(2) + ')', currentImg.width / scale-100, currentImg.height/scale+27);
                ctx.fillText('(' + face.attribute.gender.confidence.toFixed(2) + '%)', currentImg.width / scale-100, currentImg.height/scale+57);
                ctx.fillText('(' + face.attribute.race.confidence.toFixed(2) + '%)', currentImg.width / scale-100, currentImg.height/scale+87);
                
                var faceInfo = new Face(face.position.width * currentImg.width / scale * 0.01,
                face.position.height * currentImg.height / scale * 0.01,
                face.attribute.age.value,
                face.position.center.x      * currentImg.width / scale * 0.01,
                face.position.center.y      * currentImg.height / scale * 0.01,
                face.position.eye_left.x    * currentImg.width / scale * 0.01,
                face.position.eye_left.y    * currentImg.height / scale * 0.01,
                face.position.eye_right.x   * currentImg.width / scale * 0.01,
                face.position.eye_right.y   * currentImg.height / scale * 0.01,
                face.position.mouth_left.x  * currentImg.width / scale * 0.01,
                face.position.mouth_left.y  * currentImg.height / scale * 0.01,
                face.position.mouth_right.x * currentImg.width / scale * 0.01,
                face.position.mouth_right.y * currentImg.height / scale * 0.01,
                face.position.nose.x * currentImg.width / scale * 0.01,
                face.position.nose.y * currentImg.height / scale * 0.01,
                face.attribute.gender.value,face.attribute.race.value);
                //画出脸部轮廓及五官位置
                $('#drawFace').unbind('click').click(function()
                {
                    ctx.restore();
                    ctx.save();
                    ctx.drawImage(currentImg, 0, 0, currentImg.width / scale , currentImg.height / scale );

                    faceInfo.drawFace(ctx);

                    
                    for (var j = pointType.length - 1; j >= 0; j--) 
                    {
                         ctx.beginPath();
                         ctx.arc(face.position[pointType[j]].x * currentImg.width / scale * 0.01,
                                 face.position[pointType[j]].y * currentImg.height / scale * 0.01,
                                 face.position.width * 0.01 * 10, 0, Math.PI * 2);
                         ctx.fill();
                    }
                });
                //更换脸谱
                $('#changeFace').unbind('click').click(function(){
                    
                    newface.play();

                    ctx.restore();
                    ctx.save();
                    
                    ctx.drawImage(cover,
                        0, //x
                        0, //y
                        currentImg.width / scale, //宽度
                        currentImg.height / scale //高度
                    );
                   // alert(currentImg.width / scale+"    "+(155/286)*(currentImg.width / scale));

                    Pause(this,400);  
                    this.NextStep = function(){
                    
                    ctx.drawImage(currentImg, 0, 0, currentImg.width / scale , currentImg.height / scale );

                    ctx.globalAlpha = 0.5;
                    var angle = Math.asin((face.position.eye_right.y-face.position.eye_left.y)/(face.position.eye_right.x-face.position.eye_left.x));
                    ctx.rotate(angle);
                    random = Math.floor(Math.random() * imgs.length);
                    //设置脸谱位置
                    if(random==0||random==1||random==2||random==5||random==6||random==7){
                    ctx.globalAlpha = 1;
                    ctx.drawImage(imgs[random],
                        face.position.eye_left.x * currentImg.width / scale * 0.01 - ((face.position.eye_right.x - face.position.eye_left.x) *13/6 * currentImg.width / scale * 0.01) * 123/415, //x
                        face.position.eye_left.y * currentImg.height / scale * 0.01 - ((face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 3 + face.position.height/2) * currentImg.height  / scale * 0.01) * 277/570, //y
                        (face.position.eye_right.x - face.position.eye_left.x) *13/6 * currentImg.width / scale * 0.01, //宽度
                        (face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 12*5 + face.position.height/2) * currentImg.height / scale * 0.01//高度
                    );
                    }else if(random==3){
                    ctx.globalAlpha = 1;
                    ctx.drawImage(imgs[random],
                        face.position.eye_left.x * currentImg.width / scale * 0.01 - ((face.position.eye_right.x - face.position.eye_left.x) *16/6 * currentImg.width / scale * 0.01) * 123/415, //x
                        face.position.eye_left.y * currentImg.height / scale * 0.01 - ((face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 3 + face.position.height/2) * currentImg.height  / scale * 0.01) * 277/570, //y
                        (face.position.eye_right.x - face.position.eye_left.x) *15/6 * currentImg.width / scale * 0.01, //宽度
                        (face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 12*5 + face.position.height/2) * currentImg.height / scale * 0.01//高度
                    );
                    }else if(random==4){
                    ctx.globalAlpha = 1;
                    ctx.drawImage(imgs[random],
                        face.position.eye_left.x * currentImg.width / scale * 0.01 - ((face.position.eye_right.x - face.position.eye_left.x) *16/6 * currentImg.width / scale * 0.01) * 123/415, //x
                        face.position.eye_left.y * currentImg.height / scale * 0.01 - ((face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 4 + face.position.height/2) * currentImg.height  / scale * 0.01) * 277/570, //y
                        (face.position.eye_right.x - face.position.eye_left.x) *16/6 * currentImg.width / scale * 0.01, //宽度
                        (face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 12*7 + face.position.height/2) * currentImg.height / scale * 0.01//高度
                    );
                    }else{
                    ctx.drawImage(imgs[random],
                        face.position.eye_left.x * currentImg.width / scale * 0.01 - ((face.position.eye_right.x - face.position.eye_left.x) *13/6 * currentImg.width / scale * 0.01) * 123/415, //x
                        face.position.eye_left.y * currentImg.height / scale * 0.01 - ((face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 3 + face.position.height/2) * currentImg.height  / scale * 0.01) * 277/570, //y
                        (face.position.eye_right.x - face.position.eye_left.x) *13/6 * currentImg.width / scale * 0.01, //宽度
                        (face.position.mouth_left.y - face.position.eye_left.y + face.position.width / 3 + face.position.height/2) * currentImg.height / scale * 0.01//高度
                    );
                    }
                    ctx.globalAlpha = 1;
                    ctx.rotate(0-angle);
                    //设置显示人物名框大小
                    ctx.fillStyle = "#37ACA2";
                    if(random==0){//5个字人名
                        drawRect({x: 1, y: currentImg.height / scale-36}, 105, 35, true, false, false);
                    }else if(random==4||random==16){//4个字人名
                        drawRect({x: 1, y: currentImg.height / scale-36}, 95, 35, true, false, false);
                    }else if(random==1||random==2||random==3||random==5||random==6||random==14||random==17||
                            random==19||random==20||random==27||random==31||random==33||random==34||
                            random==35||random==37||random==38||random==41||random==42){//3个字人名
                        drawRect({x: 1, y: currentImg.height / scale-36}, 80, 35, true, false, false);
                    }else{
                        drawRect({x: 1, y: currentImg.height / scale-36}, 65, 35, true, false, false);
                    }
                    //设置显示人物名
                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = '20px "微软雅黑"';
                    ctx.fillText(NameList[random],9,currentImg.height / scale-8);
                    //设置显示分数框大小
                    ctx.fillStyle = "#E2D004";
                    drawRect({x: currentImg.width / scale-100, y: currentImg.height / scale-37}, 98, 35, true, false, false);
                    //设置显示分数
                    ctx.fillStyle = "#FFFFFF";
                    var a = Math.floor(Math.random() * 10);
                    var b = Math.floor(Math.random() * 1000);
                    score = "9"+a+"."+b;
                    // alert(score);
                    ctx.fillText(score+"分",currentImg.width / scale-97,currentImg.height / scale-8);
                    }
                });

                // //适配脸谱
                // $('#sureFace').unbind('click').click(function()
                // {
                //     canvas1.width = imgs[0].width;
                //     canvas1.height= imgs[0].height;
                //     ctx1.drawImage(imgs[0],0,0,canvas1.width,canvas1.height);

                //     myFaceBook.explode(currentImg,canvas,canvas1,canvas2,ctx,ctx2,faceInfo);
                // });
                    
            }
            
        }
    }
    //在canvas上画出当前图片
    function drawImg(src){
        url = src;
        //currentImg.crossOrigin = '';
        currentImg.src = src;

        clearCanvas();
        currentImg.onload = function() 
        {
            cl.hide();

            document.getElementById("canvas").style.display="";
            document.getElementById("video").style.display="none";

            document.getElementById('confirm').style.display="";
            document.getElementById('snap').style.display="none";
            document.getElementById('drawFace').style.display="none";
            document.getElementById('changeFace').style.display="none";
            document.getElementById('music').style.display="none";
           // document.getElementById('sureFace').style.display="none";
            document.getElementById('ok').style.display="none";
            document.getElementById('share').style.display="none";
            document.getElementById('charactor').style.display="none";

            if(document.body.clientWidth < document.body.clientHeight)
            {
                scale = currentImg.width / (document.body.clientWidth * 0.94);
                canvas.width    = currentImg.width/scale;
                canvas.height   = currentImg.height/scale + currentImg.width/scale/4-10;
                ctx.drawImage(currentImg, 0, 0, currentImg.width/scale, currentImg.height/scale);
                ctx.fillStyle = '#000';
                ctx.fillRect(0, currentImg.height/scale, currentImg.width/scale, currentImg.width/scale/4-10);
            }
            else
            {
                scale = (currentImg.height + currentImg.width/4)/ (document.body.clientHeight * 0.7);
                canvas.width    = currentImg.width/scale;
                canvas.height   = currentImg.height/scale + 112;
                ctx.drawImage(currentImg, 0, 0, currentImg.width/scale, currentImg.height/scale);
                ctx.fillStyle = '#000';
                ctx.fillRect(0, currentImg.height/scale, currentImg.width/scale, 112);
            }
            ctx.save();
        }
        currentImg.onerror = function() 
        {
            clearCanvas();
            
            showStatus(messages.URL_ERROR);
        };
    }
    //上传图片事件
    function uploadFile(){
        document.getElementById('img').style.display='none';

        document.getElementById("canvas").style.display="none";
        document.getElementById('confirm').style.display="none";
        document.getElementById('drawFace').style.display="none";
        document.getElementById('changeFace').style.display="none";
        document.getElementById('music').style.display="none";
       // document.getElementById('sureFace').style.display="none";
        document.getElementById('ok').style.display="none";
        document.getElementById('share').style.display="none";
        document.getElementById('charactor').style.display="none";

        $.mobile.changePage("#page2","slidedown", true, true);
        reader.readAsDataURL(upload.files[0]);
        var fd = new FormData();
        // Append our Canvas image file to the form data
        fd.append("imageNameHere", upload.files[0]);

        // And send it
        $.ajax
        ({
            url: "php/uploadFile.php",
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
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
       
        //清空已选文件
        upload.select();   
        upload.outerHTML=upload.outerHTML; 
    }
    