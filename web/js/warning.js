
showTootip = function(warning,buttonId,buttonText,l,t,divClass){
	var tooltipContent =$('<div></div>');
	var tiptext = $('<span>'+warning+'</span>');
	var hr = $('<a data-role="button" id="'+buttonId+'" data-inline = "true">'+buttonText+'</a>');
	tooltipContent.append(tiptext);
	tooltipContent.append(hr);
	tooltip = 
    $('<div>',{
        'class' : 'tooltip' + divClass,
        append:tooltipContent,
        css : {
            position:'absolute',
            top: (t + 30)
        }
    }).appendTo('body');
	$('div.tooltip').css('left',
    	(l - 
    	$('div.tooltip').width() / 2) + 'px');
	$('div.tooltip').trigger('create');
	return hr;

}

goNext = function(tip,l,t,divClass,face){
	var tooltipContent =$('<div></div>');
	var tiptext = $('<span>'+tip+'</span>');
	var hr1 = $('<a data-role="button" id="toChooseFacebook" data-inline = "true" href="#page10" data-transition="slideup">选脸谱</a>');
	var hr2 = $('<a data-role="button" id="similarFace" data-inline = "true" data-transition="slideup" href="#page11">相似脸</a>');
	tooltipContent.append(tiptext);
	tooltipContent.append($('<span><br/>现在你可选择</span>'));
	tooltipContent.append(hr1);
	tooltipContent.append($('<span><br/>或者查看</span>'));
	tooltipContent.append(hr2);
	tooltip = 
    $('<div>',{
        'class' : 'tooltip' + divClass,
        append:tooltipContent,
        css : {
            position:'absolute',
            top: (t + 30)
        }
    }).appendTo('body').show();
	$('div.tooltip').css('left',
    	(l - 
    	$('div.tooltip').width() / 2) + 'px');
	$('div.tooltip').trigger('create');


            
    //进入选脸谱界面
    hr1.unbind('click').click(function() {
        if($('div.tooltip'))
            $('div.tooltip').css('display','none');
        if(firstChoose){
            firstChoose = false;
            loadFacebook(face);
            setTimeout(loaded, 2000);
        } else {
            setTimeout(loaded, 500);
        }
    	
    });

	hr2.unbind('click').click(function(){
		if($('div.tooltip'))
            $('div.tooltip').css('display','none');
		similarClick();
	});
}