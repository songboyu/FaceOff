$(document).ready(function(){
	$('#settingButton').unbind('click').click(function(){
		setTimeout(settingInit,300);
		if(win_height < win_width){
	        $('.confirm-button').css('height','7%');
	    }
	    else if(!isMobile.any()){
	        $('.confirm-button').css('height','3.5%');
	        $('.confirm-button').css('top','96.6%');

	    } else{
	        $('.confirm-button').height(win_height * 0.06);
	        $('.confirm-button').css('top',(win_height * 0.94) +'px');
	    }
		
	});

	$('#musicOn').unbind('click').click(function(){
		musicOn = true;
	});

	$('#musicOff').unbind('click').click(function(){
		musicOn = false;
	});

	$('#soundOn').unbind('click').click(function(){
		soundOn = true;
	});
	$('#soundOff').unbind('click').click(function(){
		soundOn = false;
	});

	$('#smartRecOn').unbind('click').click(function(){
		smartRec = true;
	});
	$('#smartRecOff').unbind('click').click(function(){
		smartRec = false;
	});
	
	$('#popAnimOn').unbind('click').click(function(){
		popAnim = true;
	});
	$('#popAnimOff').unbind('click').click(function(){
		popAnim = false;
	});

	$('#circle').unbind('click').click(function(){
		playmode = ORDER;
	});
	$('#random').unbind('click').click(function(){
		playmode = RANDOM;
	});

	$('#locationOn').unbind('click').click(function(){
		mylocation = true;
	});
	$('#locationOff').unbind('click').click(function(){
		mylocation = false;
	});

	$('#roamSetting').unbind('click').click(function(){
		if(this.checked){

			if(!renrenId){
				
				$('#roamSetting').click();
				alert('请先登录人人网');
			}
		};
	});
	$('#settingDone').unbind('click').click(function(){
		if(!renrenId){
			
		} else{
			
			query = new Parse.Query(settingRecord);
			query.equalTo('renrenId',renrenId);
			query.find().then(function(settingInfo) {
				
				if(settingInfo.length <= 0){
					if(document.getElementById('roamSetting').checked){
						var setting = new settingRecord();
						setting.save(
						{
							music:musicOn,
							sound:soundOn,
							renrenId:renrenId,
							popAnim:popAnim,
							mylocation:mylocation,
							smartRec:smartRec,
							rotation:playmode,
							roam:true
						});
					}
				} else{
					if(document.getElementById('roamSetting').checked){
						settingInfo[0].save(
						{
							music:musicOn,
							sound:soundOn,
							renrenId:renrenId,
							popAnim:popAnim,
							mylocation:mylocation,
							smartRec:smartRec,
							rotation:playmode,
							roam:true
						});
					} else{
						roam = false;
						settingInfo[0].save(
						{
							roam:false
						});
					}
				}
			});
		}
	});


});

settingInit = function(){
	//初始化音乐选项按钮
	if(musicOn){
		$('#musicOff').attr('checked',false);
		$('#musicOn').attr('checked','checked');
		$($('#musicOn').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#musicOff').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#musicOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		$($('#musicOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
	} else {
		$('#musicOff').attr('checked','checked');
		$('#musicOn').attr('checked',false);
		$($('#musicOn').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#musicOff').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#musicOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#musicOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}


	//初始化音效选项按钮
	if(soundOn){
		$('#soundOff').attr('checked',false);
		$('#soundOn').attr('checked','checked');
		$($('#soundOff').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#soundOn').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#soundOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		$($('#soundOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
	} else {
		$('#soundOff').attr('checked','checked');
		$('#soundOn').attr('checked',false);
		$($('#soundOn').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#soundOff').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#soundOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#soundOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}

	//初始化智能推荐选项按钮
	if(smartRec){
		$('#smartRecOff').attr('checked',false);
		$('#smartRecOn').attr('checked','checked');
		$($('#smartRecOff').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#smartRecOn').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#smartRecOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		$($('#smartRecOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
	} else {
		$('#smartRecOff').attr('checked','checked');
		$('#smartRecOn').attr('checked',false);
		$($('#smartRecOn').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#smartRecOff').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#smartRecOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#smartRecOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}
	//初始化弹窗动画选项按钮
	if(popAnim){
		$('#popAnimOff').attr('checked',false);
		$('#popAnimOn').attr('checked','checked');
		$($('#popAnimOff').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#popAnimOn').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#popAnimOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		$($('#popAnimOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
	} else {
		$('#popAnimOff').attr('checked','checked');
		$('#popAnimOn').attr('checked',false);
		$($('#popAnimOn').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#popAnimOff').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#popAnimOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#popAnimOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}
	//初始化脸谱轮换选项按钮
	if(playmode == ORDER){
		$('#random').attr('checked',false);
		$('#circle').attr('checked','checked');
		$($('#random').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#circle').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#circle').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		$($('#random').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
	} else {
		$('#random').attr('checked','checked');
		$('#circle').attr('checked',false);
		$($('#circle').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#random').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#circle').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#random').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}
	//初始化位置共享选项按钮

	if(mylocation){
		$('#locationOff').attr('checked',false);
		$('#locationOn').attr('checked','checked');
		$($('#locationOff').next()).attr('class','ui-last-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#locationOn').next()).attr('class','ui-first-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#lacationOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#lacationOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
		
	} else {
		$('#lacationOn').attr('checked',false);
		$('#lacationOff').attr('checked','checked');
		$($('#locationOn').next()).attr('class','ui-first-child ui-radio-off ui-btn ui-btn-up-e ui-btn-corner-all ui-fullsize ui-btn-icon-left');
		$($('#locationOff').next()).attr('class','ui-last-child ui-radio-on ui-btn-active ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-e');
		$($('#lacationOn').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-off ui-icon-shadow');
		$($('#lacationOff').next().children().children()[1]).attr('class','ui-icon ui-icon-radio-on ui-icon-shadow');
	}

	if(roam){
		document.getElementById('roamSetting').checked = true;
		$($('#roamLabel').children().children()[1]).attr('class','ui-icon ui-icon-checkbox-on ui-icon-shadow');
	}
}