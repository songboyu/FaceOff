
loadFacebook = function(face){           //加载脸谱并动态添加到页面
    recindex_default();
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
    //添加带星星的脸谱选项
    faceBookWithStar = function(index,reasonId){
        var li = $("<li></li>");
            li.height(Math.floor(win_width/col) * 1.3 + 40);
            li.width(Math.floor(win_width/col) - 14);
            if(win_height > win_width && !isMobile.any()){
                li.width(Math.floor(win_width/col) - 20);
            }
            var img = $("<img onclick='imgDetail("+index+")'/>");
            img.height(li.height() - 40);
            img.attr("src", imgs[index].src);
            li.append(img);
            var label = $("<label style='position:relative;'>"+NameList[index]+"</label>");
            var input = $("<input type='checkbox' style='display:none;' value='"
                +index+"' data-iconpos='right'/>");
            label.css('height','50');
            label.append(input);
            li.append(label);
            var RecIndex = $('<div class="rec_text_star" id = "'+reasonId+'"></div>');
            RecIndex.width(li.width());
            RecIndex.height(25);

            var headText = $('<div class="rec_text"><strong>推荐指数:</strong></div>');
            headText.width(80);
            RecIndex.append(headText);

            var starBox = $('<div class = "starBox"></div>');
            starBox.width(li.width() - headText.width());

            var recScore = $('<div class="recIndex"></div>');
            recScore.width(calculateScore(facebookInfo[index]));
            
            var recStar = $('<div class="recIndexStar"></div>');
            if(li.width() < 180){
                recScore.width(recScore.width() * 0.8);
                recStar.width(80);
            }
            starBox.append(recScore);
            recStar.appendTo(starBox);
            RecIndex.append(starBox);
            RecIndex.attr('clicked',false);
            RecIndex.mouseenter(function(e){
                $(this).attr('clicked','true');
                var realOffset = offset(this);
                var tooltip = 
                $('<div>',{
                    'class' : 'recReason',
                    html : '<span>推荐理由：'+
                        RecReason[parseInt($(this).attr('id'))]+
                        '</span>',
                    css : {
                        position:'absolute',
                        top: (realOffset.y + realOffset.h + 10)
                    }
                }).appendTo('body').show();
                $('div.recReason').css('left',
                    (realOffset.x + realOffset.w / 2 - 
                    $('div.recReason').width() / 2) + 'px');
            }).mouseleave(function(){
                $(this).attr('clicked','false');
                $("div.recReason").remove();
            });
            RecIndex.unbind('click').click(function(e){
                if($(this).attr('clicked') === 'false'){
                    $(this).attr('clicked','true');
                    var realOffset = offset(this);
                    var tooltipId = new Date().getTime().toString();
                    var tooltip = 
                    $('<div>',{
                        'class' : 'recReason',
                        'id' : tooltipId,
                        html : '<span>推荐理由：'+
                            RecReason[parseInt($(this).attr('id'))]+
                            '</span>',
                        css : {
                            position:'absolute',
                            top: (realOffset.y + realOffset.h + 10)
                        }
                    }).appendTo('body').show();
                    $('#'+tooltipId).css('left',
                        (realOffset.x + realOffset.w / 2 - 
                        $('#'+tooltipId).width() / 2) + 'px');
                    var _this = this;
                    setTimeout(function(){
                        $(_this).attr('clicked','false');
                        $("#"+tooltipId).remove();
                        
                    },3000);
                }
            });

            li.append(RecIndex);
            return li;
    }

    //添加不带星星的脸谱选项
    faceBookWithNoStar = function(index){
        var li = $("<li></li>");
        li.height(Math.floor(win_width/col) * 1.3);
        li.width(Math.floor(win_width/col) - 14);
        if(win_height > win_width && !isMobile.any()){
            li.width(Math.floor(win_width/col) - 20);
        }
        var img = $("<img onclick='imgDetail("+index+")'/>");
        img.attr("src", imgs[index].src);
        li.append(img);

        var label = $("<label style='position:relative;'>"+NameList[index]+"</label>");
        var input = $("<input type='checkbox' style='display:none;' value='"
            +index+"' data-iconpos='right'/>");
        label.css('height','50');
        label.append(input);
        li.append(label);
        return li;
    }

    //高分推荐
    highScoreRec = function(list){
        facebookInfoIndex = facebookInfoIndex.sort(sortByTotalScore);
        for(var i = 0;i < 3;i++){
            RecedIndex.highScoreRecIndex.push(facebookInfoIndex[i]);
            list.append(faceBookWithStar(facebookInfoIndex[i],i));
        }
        return list;
    }

    //微笑推荐
    smileRec = function(list){
        var smileValue = Number(face.attribute.smiling.value);
        if(smileValue > 88){
            if(!indexChoosed(16)){
                RecedIndex.smileRecIndex.push(16);
                list.append(faceBookWithStar(16,3));
            }
        } else if(smileValue > 30){
            if(!indexChoosed(15)){
                RecedIndex.smileRecIndex.push(15);
                list.append(faceBookWithStar(15,4));
            }
        }
        return list;
    }

    //年龄推荐
    ageRec = function(list){
        var age = Number(face.attribute.age.value);
        if(age > 60){
            if(indexChoosed(11)){
                ;
            }
            else{
                RecedIndex.ageRecIndex.push(11);
                list.append(faceBookWithStar(11,5));
            }
        } else if(age < 10){
            if(indexChoosed(5)){
                
            }
            else{
                RecedIndex.ageRecIndex.push(5);
                list.append(faceBookWithStar(5,6));
            }
            if(indexChoosed(25)){

            } else{
                RecedIndex.ageRecIndex.push(25);
                list.append(faceBookWithStar(25,7));
            }
            if(indexChoosed(30)){

            } else{
                RecedIndex.ageRecIndex.push(30);
                list.append(faceBookWithStar(30,8));
            }
        }
        return list;
    }

    //肤色推荐
    raceRec = function(list){
        var race = face.attribute.race.value;
        if(race == 'White'){
            if(indexChoosed(0)){
                ;
            }
            else{
                RecedIndex.raceRecIndex.push(0);
                list.append(faceBookWithStar(0,9));
            }
        } else if(race == 'Black'){
            if(indexChoosed(13)){
                ;
            }
            else{
                RecedIndex.raceRecIndex.push(13);
                list.append(faceBookWithStar(13,10));
            }
        } else{
            if(!indexChoosed(21)){
                RecedIndex.raceRecIndex.push(21);
                list.append(faceBookWithStar(21,11));
            }
        }
        return list;
    }

    //性别推荐
    genderRec = function(list){
        var gender = face.attribute.gender.value;
        if(gender == 'Female'){
            if(!indexChoosed(39)){
                RecedIndex.genderIndex = 39;
                list.append(faceBookWithStar(39,12));
            }
        } else{
            if(!indexChoosed(7)){
                RecedIndex.genderIndex = 7;
                list.append(faceBookWithStar(7,13));
            }
        }
        return list;
    }

    //其他脸谱
    remain = function(list){
        for(var i = 0 ;i < NameList.length;i++){
            if(!indexChoosed(i)){
                list.append(faceBookWithNoStar(i));
            }
            
        }
        return list;
    }

    $('#scroller').empty();
    choosedFBCount = 0;
    $($('#chooseComplete').children().children()).html(
        '确定(0)');
    
    if(smartRec){
        
        var divGroup = $('<div data-role="collapsible-set" class="collGroup"></div>');
        divGroup.css('width','99%');

        var sec1 = $('<div data-role="collapsible" class="sec"'+
            'data-collapsed="false" data-theme="a"></div>');
        var h3_1 = $('<h3>高分推荐</h3>');
        h3_1.unbind('click').click(function(){
            setTimeout(loaded, 100);
        });
        var list1 = $('<ul class = "facebookChoose"></ul>');
        sec1.append(h3_1);
        list1 = highScoreRec(list1);
        sec1.append(list1);
        divGroup.append(sec1);

        var sec2 = $('<div data-role="collapsible" class="sec" data-theme="b"></div>');
        var h3_2 = $('<h3>其它推荐</h3>');
        h3_2.unbind('click').click(function(){
            setTimeout(loaded, 100);
        });
        sec2.append(h3_2);
        var list2 = $('<ul class = "facebookChoose"></ul>');
        list2 = smileRec(list2);
        list2 = ageRec(list2);
        list2 = raceRec(list2);
        list2 = genderRec(list2);
        sec2.append(list2);
        divGroup.append(sec2);

        var sec3 = $('<div data-role="collapsible" id="sec3" class="sec" data-theme="e"></div>');
        var h3_3 = $('<h3>更多</h3>');
        h3_3.unbind('click').click(function(){
            setTimeout(loaded, 100);
        });
        sec3.append(h3_3);
        var list3 = $('<ul class = "facebookChoose"></ul>');
        list3 = remain(list3);

        sec3.append(list3);
        divGroup.append(sec3);
        
        var sec4 = $('<div data-role="collapsible" id="endSec" data-theme="e"></div>');
        var h3_4 = $('<h3></h3>');
        h3_4.unbind('click').click(function(){
            setTimeout(loaded, 100);
        });
        sec4.append(h3_4);
        divGroup.append(sec4);

        $('#scroller').append(divGroup);
        $('#scroller').trigger('create');
    } else {
        $('#scroller').append('<ul id="facebookChoose" '+
            'class = "facebookChoose"></ul>');
        for(var i = 0;i < imgs.length;i++){
            $('#facebookChoose').append(faceBookWithNoStar(i));
            $('#facebookChoose').trigger('create');
            
        }
    }
    //点击复选框时触发
    $('input[type=checkbox]').unbind('click').click(function(){
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
        if(myScroll)
            myScroll.destroy();
        if($('div.tooltip')){
            $('div.tooltip').show();
        }
    });

    //点击完成按钮时触发
    $('#chooseComplete').unbind('click').click(function(){
        if(choosedFBCount > 0) {
            if(myScroll)
                myScroll.destroy();
            clearFacebook();
            addFaceBook();
            document.getElementById('charactor').style.display="";
            document.getElementById('changeFace').style.display="";
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

            started = true;
            changeFacebook();
        }
    });

    //点击清除按钮时触发
    $('#clearChoosed').unbind('click').click(function(){

        $("#page10 input[type=checkbox]:checked").each(function(){

            this.checked  = false;
            $($(this).prev().children().children()[1]).attr('class','ui-icon ui-icon-checkbox-off ui-icon-shadow');
        });
        choosedFBCount = 0;
        $($('#chooseComplete').children().children()).html(
            '确定(0)');
    });

    //点击全选按钮时触发
    $('#chooseAll').unbind('click').click(function(){

        $("#page10 input[type=checkbox]").each(function(){

            this.checked  = true;
            $($(this).prev().children().children()[1]).attr('class','ui-icon ui-icon-checkbox-on ui-icon-shadow');
        });
        choosedFBCount = $("#page10 input[type=checkbox]").length;
        $($('#chooseComplete').children().children()).html(
            '确定('+choosedFBCount+')');
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

