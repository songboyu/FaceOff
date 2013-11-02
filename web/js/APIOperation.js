
    // var API_URL = "http://api.cn.faceplusplus.com/v2";//API地址
    // var API_KEY = "d5e369fa35d0bd86d033afd171e2e08a";//API key
    // var API_SECRET = "SBouWCQsrQTGITBDgCa0slvr_ak1a61K";//API secert


    //在face++脸集中搜索相似脸
    function searchFaces(faceset_name, currentFaceID) {
        return $.ajax({
            type: "GET",
            url: API_URL
                + "/recognition/search?api_key=" + API_KEY
                + "&api_secret=" + API_SECRET
                + "&key_face_id=" + currentFaceID
                + "&faceset_name=" + faceset_name
                + "&count=1"

        })
    }
    //上传图片到face++进行识别
    function uploadImgToAPI(file, fileName, name, lat, lon) {
        var formdata = new FormData();
        formdata.append("api_key", API_KEY);
        formdata.append("api_secret", API_SECRET);
        formdata.append("img", file);
        formdata.append("tag", fileName + "|" + name + "|" + lat + "|" + lon);
        //详细内容见”http://cn.faceplusplus.com/dev/api/detection/detectiondetect/“
        return $.ajax({
            type: "POST",
            dataType: "json",
            url: API_URL + "/detection/detect",
            data: formdata
        });
    }
    //添加脸到face++人脸集
    function addToFaceSet(faceID, faceset_name) {
        //详细内容见”http://cn.faceplusplus.com/dev/api/faceset/facesetadd_face/“
        $.ajax({
            type: "GET",
            url: API_URL
                + "/faceset/add_face?api_key=" + API_KEY
                + "&api_secret=" + API_SECRET
                + "&faceset_name=" + faceset_name
                + "&face_id=" + faceID,
            success: function(result) {
                // handle completed.
                // 当批量上传时，需要注释掉这句
                //Windows.UI.Popups.MessageDialog("恭喜您，三分钟内图片将上传至用户脸库").showAsync();
                alert("恭喜您，一分钟内图片将上传至用户脸库");
                cl1.hide();
                console.log("addToFaceSet success:" + result.responseText);
            }
        });
    }
    //对face++人脸集进行模型训练（时间较长，异步函数）
    function train_FaceSet(faceset_name) {
        //详细内容见”http://cn.faceplusplus.com/dev/api/train/trainsearch/“
        return $.ajax({
            type: "GET",
            url: API_URL
                + "/train/search?api_key=d5e369fa35d0bd86d033afd171e2e08a"
                + "&api_secret=SBouWCQsrQTGITBDgCa0slvr_ak1a61K"
                + "&faceset_name=" + faceset_name
        });
    }
    //建立face++人脸集
    function createFaceSet(faceset_name) {
        //详细内容见”http://cn.faceplusplus.com/dev/api/faceset/facesetcreate/“
        $.ajax({
            type: "GET",
            url: API_URL
                + "/faceset/create?api_key=d5e369fa35d0bd86d033afd171e2e08a"
                + "&api_secret=SBouWCQsrQTGITBDgCa0slvr_ak1a61K"
                + "&faceset_name=" + faceset_name

        });
    }