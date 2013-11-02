
loadFacebook = function(){           //加载脸谱并动态添加到页面
    $('#facebookChoose').empty();
    var col = 3;
    
    if(win_height < win_width){
        col = 7;
        
        $('#header').css('height','6%');
        $('.confirm-button').css('height','7%');
        $('#wrapper').css('height','87%');
    }
    else if(!isMobile.any()){
        $('#header').css('height','3%');
        $('.confirm-button').css('height','3.5%');
        $('#wrapper').css('height','93.5%');
        $('.confirm-button').css('top','96.6%');

    } else{
        $('#header').height(win_height * 0.04);
        $('.confirm-button').height(win_height * 0.06);
        $('#wrapper').height(win_height * 0.9);
        $('.confirm-button').css('top',(win_height * 0.94) +'px');

    }
    for(var i = 0;i < imgs.length;i++){

        var li = $("<li></li>");
        li.height(Math.floor(win_width/col) * 1.3);
        li.width(Math.floor(win_width/col) - 14);
        if(win_height > win_width && !isMobile.any()){
            li.width(Math.floor(win_width/col) - 20);
        }
        var img = $("<img onclick='imgDetail("+i+")'/>");
        img.attr("src", imgs[i].src);
        li.append(img);

        var label = $("<label style='position:relative;'>"+NameList[i]+"</label>");
        var input = $("<input type='checkbox' style='display:none;' value='"
            +i+"' data-iconpos='right'/>");
        label.css('height','50');
        label.append(input);
        li.append(label);
        $('#facebookChoose').append(li);
        
    }

    //点击复选框时触发
    $('input[type=checkbox]').unbind('change').click(function(){
        if(this.checked){
            choosedFBCount++;
        } else
        {
            choosedFBCount--;
        }
        $($('#chooseComplete').children().children()).html(
            '确定('+choosedFBCount+')');
    });


    //点击返回时触发
    $('#backToDrawface').unbind('click').click(function(){
        myScroll.destroy();
    });

    //点击完成按钮时触发
    $('#chooseComplete').unbind('click').click(function(){
        if(choosedFBCount > 0) {
            myScroll.destroy();
            clearFacebook();
            addFaceBook();

            // document.getElementById('next').style.display="none";
            document.getElementById('charactor').style.display="";
            document.getElementById('changeFace').style.display="";
            document.getElementById('music').style.display="";
            document.getElementById('ok').style.display="";
            $.mobile.changePage("#page2","slideright", true, true);
            if(musicOn)
            {
             if(mediaLoaded === false)
             {
                 media.load();
                 mediaLoaded = true;
             }
             media.play(); 
            }
            changeFacebook();
        }
    });

    //点击清除按钮时触发
    $('#clearChoosed').unbind('click').click(function(){

        $("input[type=checkbox]:checked").each(function(){

            this.checked  = false;
            $($(this).prev().children().children()[1]).attr('class','ui-icon ui-icon-checkbox-off ui-icon-shadow');
        });
        choosedFBCount = 0;
        $($('#chooseComplete').children().children()).html(
            '确定(0)');
    });

    //点击图片时触发
    imgDetail = function(value){
        WhoAmI.introduction.Show(value);
    }

    //清空选中的脸谱
    clearFacebook = function(){

        choosedFacebook.splice(0,choosedFacebook.length);

    }

    //添加选中的脸谱
    addFaceBook = function(){
        $("input[type=checkbox]:checked").each(function(){
            choosedFacebook.push(parseInt(this.value));
        });
    }
    
}

//设置滚动区
loaded = function () {
    if(myScroll)
        myScroll.destroy();
    myScroll = new iScroll('wrapper', {
        momentum: false,
        useTransform: true,
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
        }
    });
}

