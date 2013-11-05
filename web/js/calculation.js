
reciprocal = function(x){
	return x > 1? 1 / x : x;
}

//自定义四舍五入
my_round = function(x){
	var tmp = x * 1000;
	tmp = Math.round(tmp);
	return tmp / 1000;
}

//计算下一张脸谱下标
next_index = function(data){
    return playmode === RANDOM ? 
    	Math.floor(Math.random() * choosedFBCount) :
    	( ++data === choosedFBCount ? 0 : data);
}

//计算脸谱分数
//ci为人脸信息,即face对象
calculateScore = function (ci){
	var len_scale = 
        (
            (
            faceInfo.eye_right[0] - faceInfo.eye_left[0]
            ) / 
                Math.abs(Math.cos(faceInfo.angle))
        ) / (
            ci.eye_right.x - 
            ci.eye_left.x
        );
    var height_scale = 
        (
            (
                faceInfo.nose[1] - 
                (faceInfo.eye_left[1] + faceInfo.eye_right[1]) / 2
            ) / 
            Math.abs(Math.cos(faceInfo.angle))
        ) / (
            ci.nose.y - 
            ci.eye_left.y
        );
	var deform_score = reciprocal(height_scale / len_scale);
    deform_score = (1 - deform_score) * 50;
    var match_score = (2 - 
        reciprocal(faceInfo.faceWidth / 
            (ci.length * len_scale)) - 
        reciprocal(faceInfo.faceHeight / 
            (ci.height * height_scale))) * 10;
    var mouth_score = Math.abs(
        (
            ci.mouth.y - ci.nose.y
        ) * 
        height_scale - (
            faceInfo.mouth_left[1] - faceInfo.nose[1]
        ) / Math.cos(faceInfo.angle));
    return my_round(100 - deform_score - match_score - mouth_score);
}

//根据分数排名
sortByScore = function(a,b){
    var start_a = a.indexOf("_")+1;
    var start_b = b.indexOf("_")+1;

    var stop_a = a.lastIndexOf(".");
    var stop_b = b.lastIndexOf(".");

    var score_a = parseFloat(a.substring(start_a,stop_a));
    var score_b = parseFloat(b.substring(start_b,stop_b));
    return score_b - score_a;
}

//根据人气排名
sortByUser = function (a,b){
    var score_a = parseInt(a[0]);
    var score_b = parseInt(b[0]);
    return score_b - score_a;
}

//根据总得分对下标排序
sortByTotalScore = function(a,b){
	return calculateScore(facebookInfo[b]) - calculateScore(facebookInfo[a]);
}


//赞一下
upAdd = function (alink){
    var query = new Parse.Query(faceRecord);
    var upScore = parseInt(alink.innerHTML);
    var my_score_user = upScore + parseInt(alink.parentNode.nextSibling.firstChild.innerHTML);
    alink.innerHTML = upScore+1;
    query.equalTo("filename",alink.name);
    query.find().then(function(info) {
        if(info.length!=0){
            info[0].save({up:upScore+1,score_user:my_score_user+1});
        }
    });
}

//拍一下
downAdd = function (alink){
    var query = new Parse.Query(faceRecord);
    var downScore = parseInt(alink.innerHTML);
    var my_score_user = parseInt(alink.parentNode.previousSibling.firstChild.innerHTML) + downScore;
    alink.innerHTML = downScore-1;

    query.equalTo("filename",alink.name);
    query.find().then(function(info) {
        if(info.length!=0){
            info[0].save({down:downScore-1,score_user:my_score_user-1});
        }
    });
}

//计算提示框位置信息
offset = function (obj) {
	if( !obj ) return {x:0,y:0};
	return {
		x:$(obj).offset().left,
		y:$(obj).offset().top,
		h:$(obj).height(),
		w:$(obj).width()};
};

//初始化推荐信息
recindex_default = function (){
	if(RecedIndex)
	{
		RecedIndex.highScoreRecIndex.splice(0,RecedIndex.highScoreRecIndex.length);
		RecedIndex.smileRecIndex.splice(0,RecedIndex.smileRecIndex.length);
		RecedIndex.raceRecIndex.splice(0,RecedIndex.raceRecIndex.length);
		RecedIndex.ageRecIndex.splice(0,RecedIndex.ageRecIndex.length);
		RecedIndex.genderIndex = -1;
	} else {
		RecedIndex = {
		    highScoreRecIndex:[],
		    smileRecIndex:[],
		    raceRecIndex:[],
		    ageRecIndex:[],
		    genderIndex:-1
		}
	}
}


//判断某一张脸谱是否已被选中
indexChoosed = function(n){
	for(var i = 0;i < RecedIndex.highScoreRecIndex.length;i++){
		if(n == RecedIndex.highScoreRecIndex[i])
			return true;
	}
	for(var i = 0;i < RecedIndex.smileRecIndex.length;i++){
		if(n == RecedIndex.smileRecIndex[i])
			return true;
	}
	for(var i = 0;i < RecedIndex.raceRecIndex.length;i++){
		if(n == RecedIndex.raceRecIndex[i])
			return true;
	}
	for(var i = 0;i < RecedIndex.ageRecIndex.length;i++){
		if(n == RecedIndex.ageRecIndex[i])
			return true;
	}
	if(RecedIndex.genderIndex == n)
		return true;
	return false;
}
