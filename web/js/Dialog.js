
(function ($) {
    //默认参数
    var PARAMS;
    var DEFAULTPARAMS = { 
        Title: "消息", 
        Content: "", 
        Width: 400, 
        Height: 300, 
        URL: "",
        haveConfirm: false, 
        ConfirmFun: new Object, 
        CancelFun: new Object ,
        Anim:false
    };

    var ContentWidth = 0;
    var ContentHeight = 0;

    $.Dialog = {
        //弹出提示框
        Alert: function (params) {
            Show(params, "Alert");
        },
        //弹出引用其他URL框
        Dialog: function (params) { 
            Show(params, "Dialog") 
        },
        //关闭弹出框
        Close: function () {
            $("#DialogLayer,#Dialog").remove();
        }
    };
    //初始化参数
    function Init(params) {
        
        if (params != undefined && params != null) {
            PARAMS = $.extend({},DEFAULTPARAMS, params);
        }
        ContentWidth = PARAMS.Width - 10;
        ContentHeight = PARAMS.Height - 45;
    };
    //显示弹出框
    function Show(params, caller) {
        Init(params);
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();

        //在屏幕中显示的位置（正中间）
        var positionLeft = screenWidth / 2 + $(document).scrollLeft() - 
            (PARAMS.Anim ? 0:PARAMS.Width) / 2;
        var positionTop = screenHeight / 2 + $(document).scrollTop() -
            (PARAMS.Anim ? 0:PARAMS.Height) / 2;

        //定义对话框层
        var dialogLayer = $("<div id='DialogLayer'></div>");
        dialogLayer.width($(window).width());
        dialogLayer.height($(window).height());

        //定义对话框
        var dialog = $("<div id='Dialog'></div>");
        dialog.width(PARAMS.Anim ?0:PARAMS.Width);
        dialog.height(PARAMS.Anim ?0:PARAMS.Height);
        dialog.css('left',positionLeft+'px');
        dialog.css('top',positionTop+'px');

        //定义标题
        var title = $("<div id='Title'></div>");
        title.append("<span>" + PARAMS.Title + "</span>");
        title.append("<span id='Close'>&#10005;</span>");

        //定义内容
        var content = $("<div id='DialogContainer'></div>");
        content.width(PARAMS.Anim ?0:ContentWidth);
        content.height(PARAMS.Anim ?0:ContentHeight);
        if (caller == "Dialog") {
            content.append($("<iframe src='" + PARAMS.URL + "'></iframe>"));
        }
        content.append(PARAMS.Content);

        //添加对话框
        dialog.append(title);
        dialog.append(content);
        dialogLayer.append(dialog);

        $("body").append(dialogLayer);
        SetDialogEvent(caller);
        if(PARAMS.Anim)
        {
            //添加弹框动画
            var w_stop = false;
            var h_stop = false;
            var w_add = PARAMS.Width / 30;
            var h_add = PARAMS.Height / 30;
            var content_w_add = ContentWidth / 30;
            var content_h_add = ContentHeight / 30;
            var opacity = 0;

            var anim_id = setInterval(function(){
                var dWidth = dialog.width();
                var dHeight = dialog.height();
                var cWidth = content.width();
                var cHeight = content.height();
                opacity += 1 / 30;
                opacity = opacity > 1?1:opacity;
                if(dWidth < PARAMS.Width && dWidth + w_add < PARAMS.Width){
                    dWidth += w_add;
                    cWidth += content_w_add;
                } else if(dWidth < PARAMS.Width) {
                    dWidth = PARAMS.Width;
                    cWidth = ContentWidth;
                } else {
                    w_stop = true;
                }
                if(dHeight < PARAMS.Height && dHeight + h_add < PARAMS.Height){
                    dHeight += h_add;
                    cHeight += content_h_add;
                } else if(dHeight < PARAMS.Height) {
                    dHeight = PARAMS.Height;
                    cHeight = ContentHeight;
                } else {
                    h_stop = true;
                }
                dialog.css('opacity',opacity);
                
                dialog.width(dWidth);
                dialog.height(dHeight);
                content.width(cWidth);
                content.height(cHeight);
                dialog.offset({
                    left:positionLeft - dWidth / 2,
                    top:positionTop - dHeight / 2
                });
                if(h_stop && w_stop){

                    clearInterval(anim_id);
                }
            },35);
        }
    }
    //设置弹窗事件
    function SetDialogEvent(caller) {
        $("#Dialog #Close").click(function () { $.Dialog.Close(); });
        $("#Dialog #Title").MyDrag($("#Dialog"));
        $("#DialogLayer").MyClick($("#Dialog"));
    }
})(jQuery);

//拖动层
(function ($) {
    $.fn.extend({
        MyDrag: function (objMoved) {
            return this.each(function () {
                //鼠标按下时的位置
                var mouseDownPosiX;
                var mouseDownPosiY;
                //移动的对象的初始位置
                var objPosiX;
                var objPosiY;
                //移动的对象
                var obj = $(objMoved) == undefined ? $(this) : $(objMoved);
                //是否处于移动状态
                var status = false;

                //鼠标移动时计算移动的位置
                var tempX;
                var tempY;

                $(this).mousedown(function (e) {
                    status = true;
                    mouseDownPosiX = e.pageX;
                    mouseDownPosiY = e.pageY;

                    objPosiX = obj.css("left").replace("px", "");
                    objPosiY = obj.css("top").replace("px", "");
                }).mouseup(function () {
                    status = false;
                });
                $("body").mousemove(function (e) {
                    if (status) {
                        tempX = parseInt(e.pageX) - parseInt(mouseDownPosiX) + parseInt(objPosiX);
                        tempY = parseInt(e.pageY) - parseInt(mouseDownPosiY) + parseInt(objPosiY);
                        obj.css({ "left": tempX + "px", "top": tempY + "px" });
                    }
                }).mouseup(function () {
                    status = false;
                }).mouseleave(function () {
                    status = false;
                });
            });
        },
        MyClick: function (dialog){
            //鼠标按下时的位置
            var mouseDownPosiX;
            var mouseDownPosiY;
            //鼠标离开时的位置
            var mouseUpPosiX;
            var mouseUpPosiY;

            var close = false;

            $(this).mousedown(function (e) {
                mouseDownPosiX = e.pageX;
                mouseDownPosiY = e.pageY;
                if(mouseDownPosiX < dialog.offset().left ||
                    mouseDownPosiX > dialog.offset().left + dialog.width() ||
                    mouseDownPosiY < dialog.offset().top ||
                    mouseDownPosiY > dialog.offset().top + dialog.height()){
                    close = true;
                } else {
                    close = false;
                }

            }).mouseup(function (e){
                mouseUpPosiX = e.pageX;
                mouseUpPosiY = e.pageY;
                if(close){
                    if(mouseUpPosiX != mouseDownPosiX ||
                        mouseUpPosiY != mouseDownPosiY){
                        close = false;
                    } else {
                        close = true;
                    }
                }

                if(close){
                    $.Dialog.Close();
                }
            });
        }
    })
})(jQuery);

(function (){
    WhoAmI.introduction = {
        Show: function(value){
            showIntroduction(value);
        }
    };
    showIntroduction = function(value){
        var dialogWidth = $(document).width() * 0.9;
        var dialogHeight = $(document).height() * 0.8;
        if(dialogWidth > dialogHeight){
            dialogWidth = $(document).height() * 0.8;
            dialogHeight = $(document).height() * 0.9;
        }
        //自定义弹出层内容
        var content = $("<div></div>");
        var charactorImage = $("<div><div>");
        var introduction = $('<div></div>');
        var chImg = $("<img/>");
        chImg.attr('src',"images/charactor/"+NameList[value]+".png");
        chImg.width(isMobile.any()? dialogWidth - 20:0);
        introduction.html("<p>"+introductionList[value]+"</p>");
        charactorImage.append(chImg);
        content.append(charactorImage);
        content.append(introduction);
        introduction.css('display',isMobile.any()?'':'none');
        //弹出人物介绍层并遮罩底层
        $.Dialog.Alert({ 
            Width: dialogWidth,   //弹出层宽度
            Height: dialogHeight, //弹出层高度
            Title: "人物介绍",    //弹出层标题
            Content:  content ,       //弹出层内容
            Anim:!isMobile.any()  //设置是否有动画
        });
        if(!isMobile.any()){
            //设置滚动
            $('#DialogContainer').css('overflow-y','auto');
            $('#DialogContainer').css('overflow-x','hidden');

            //设置弹框内容动画
            var w_add = (dialogWidth - 20) / 30;
            var h_add = (dialogHeight - 20) / 30;
            var imgWidth = 0;
            var w_stop = false;
            var anim_id = setInterval(function(){
                if(imgWidth < dialogWidth - 20 && imgWidth + w_add< dialogWidth - 20){
                    imgWidth += w_add;
                } else if(imgWidth < dialogWidth - 20 ){
                    imgWidth = dialogWidth - 20;
                } else {
                    w_stop = true;
                }
                chImg.width(imgWidth);
                if(w_stop){
                    introduction.css('display','');
                    clearInterval(anim_id);
                }
            },35);
        }
    }
})();

function WhoAmI(){};