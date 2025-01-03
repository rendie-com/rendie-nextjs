Object.assign(Tool, {
    common5: {
        a01: function (oo) {
            let video = JSON.parse(oo.video)
            return '\
            <tr>\
                <td class="right">设置【人工审核1688主视频状态】：</td>\
                <td>'+ this.b01(oo.ManualReview_1688_video_status, oo.manualreview_1688_fromid) + '</td>\
            </tr>\
            <tr>\
                <td class="right">主视频：</td>\
                <td>'+ (oo.list[2][0] && oo.list[2][0].videoUrl ?
                    '<video width="600" height="500" controls><source src="' + oo.list[2][0].videoUrl + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>\
                     <div class="process-container" style="width:600px">\
                        <div class="process-bg">\
                            <span class="process-point" style="left: -8px;"></span>\
                            <span class="process-line" style="width: 155px; left: 0px;"></span>\
                        </div>\
                        <span class="process-time">00:00/00:22</span>\
                    </div>\
                    <div class="video-cropper-container">\
                        <div class="fragment fragment-left"><span class="fragment-fill"></span></div>\
                        <div class="fragment fragment-right"><span class="fragment-fill"></span></div>\
                        <p class="duration" style="width: 479px; left: 0px;">已选22秒</p>\
                    </div>\
                    <div class="p-2"><b>拖拽以剪辑视频时长于10秒-60秒之间</b></div>'
                    : '') + '</td>\
            </tr>\
            <tr>\
                <td class="right">主视频上传到shopee后：</td>\
                <td>\
                    \
                <textarea rows="10" class="form-control form-control">' + JSON.stringify(video, null, 2) + '</textarea></td>\
            </tr>'
            //<video width="600" height="400" controls><source src="https://down-ws-global.vod.susercontent.com/' + video[0].video_id + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>
        },
        b01: function (ManualReview_1688_video_status, manualreview_1688_fromid) {
            let arr = Tool.ManualReview_1688_video_status, str = ''
            for (let i = 0; i < arr.length; i++) {
                str += '\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="ManualReview_1688_video_status" id="ManualReview_1688_video_status'+ i + '" ' + (arr[i][0] == ManualReview_1688_video_status ? 'disabled checked' : '') + ' onclick="Tool.common5.c01(' + arr[i][0] + ' ,' + manualreview_1688_fromid + ')">\
                    <label class="form-check-label" for="ManualReview_1688_video_status'+ i + '">' + arr[i][1] + '</label>\
                </div>'
            }
            return str
        },
        c01: function (val, manualreview_1688_fromid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.ManualReview_1688_video_status=" + val + " where @.manualreview_1688_fromid=" + manualreview_1688_fromid,
            }, {
                action: "sqlite",
                database: "1688",
                sql: "update @.product set @.ManualReview_video_status=" + val + " where @.ManualReview_1688_fromid=" + manualreview_1688_fromid,
            }]
            Tool.ajax.a01(data, Tool.reload);
        },
    },
    common6: {
        a01: function (oo) {
            let ExplanationVideo = JSON.parse(oo.ExplanationVideo)
            return '\
            <tr>\
                <td class="right">设置【人工审核1688讲解视频状态】：</td>\
                <td>'+ this.b01(oo.ManualReview_1688_ExplanationVideo_status, oo.manualreview_1688_fromid) + '</td>\
            </tr>\
            <tr>\
                <td class="right">讲解视频：</td>\
                <td>'+ (oo.list[2][0] && oo.list[2][0].ExplanationVideo ?
                    '<video width="600" height="500" controls><source src="' + oo.list[2][0].ExplanationVideo + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>\
                    <div class="process-container" style="width:600px">\
                        <div class="process-bg">\
                            <span class="process-point" style="left: -8px;"></span>\
                            <span class="process-line" style="width: 155px; left: 0px;"></span>\
                        </div>\
                        <span class="process-time">00:00/00:22</span>\
                    </div>\
                    <div class="video-cropper-container">\
                        <div class="fragment fragment-left" draggable="true"><span class="fragment-fill"></span></div>\
                        <div class="fragment fragment-right"><span class="fragment-fill"></span></div>\
                        <p class="duration" style="width: 479px; left: 0px;">已选22秒</p>\
                    </div>\
                    <div class="p-2"><b>拖拽以剪辑视频时长于10秒-60秒之间</b></div>' : '') + '</td>\
            </tr>\
            <tr>\
                <td class="right">讲解视频上传到shopee后：</td>\
                <td>\
                    \
                    <textarea rows="10" class="form-control form-control">' + JSON.stringify(ExplanationVideo, null, 2) + '</textarea>\
                </td>\
            </tr>'
            //<video width="600" height="400" controls><source src="https://down-ws-global.vod.susercontent.com/' + ExplanationVideo[0].video_id + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>
        },
        b01: function (ManualReview_1688_ExplanationVideo_status, manualreview_1688_fromid) {
            let arr = Tool.ManualReview_1688_video_status, str = ''
            for (let i = 0; i < arr.length; i++) {
                str += '\
                <div class="form-check form-check-inline">\
                    <input class="form-check-input" type="radio" name="ManualReview_1688_ExplanationVideo_status" id="ManualReview_1688_ExplanationVideo_status'+ i + '" ' + (arr[i][0] == ManualReview_1688_ExplanationVideo_status ? 'disabled checked' : '') + ' onclick="Tool.common6.c01(' + arr[i][0] + ' ,' + manualreview_1688_fromid + ')">\
                    <label class="form-check-label" for="ManualReview_1688_ExplanationVideo_status'+ i + '">' + arr[i][1] + '</label>\
                </div>'
            }
            return str
        },
        c01: function (val, manualreview_1688_fromid) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "update @.table set @.ManualReview_1688_ExplanationVideo_status=" + val + " where @.manualreview_1688_fromid=" + manualreview_1688_fromid,
            }, {
                action: "sqlite",
                database: "1688",
                sql: "update @.product set @.ManualReview_ExplanationVideo_status=" + val + " where @.ManualReview_1688_fromid=" + manualreview_1688_fromid,
            }]
            Tool.ajax.a01(data, Tool.reload);
        },
    }

})

/*
function cropVideo(videoElement, startTime, endTime, callback) {
  // 创建一个隐藏的canvas元素
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = videoElement.videoWidth;
  var height = videoElement.videoHeight;
  canvas.width = width;
  canvas.height = height;
 
  // 当视频加载足够的时候开始截取视频
  videoElement.addEventListener('loadeddata', function() {
    // 设置视频的当前时间到开始时间
    videoElement.currentTime = startTime;
  });
 
  videoElement.addEventListener('seeked', function() {
    // 当视频定位到开始时间后，绘制当前帧到canvas
    ctx.drawImage(videoElement, 0, 0, width, height);
 
    // 创建一个Blob URL
    var blob = canvas.toBlob(function(blob) {
      // 创建一个新的视频标签
      var newVideo = document.createElement('video');
      newVideo.src = URL.createObjectURL(blob);
      newVideo.controls = true;
 
      // 将新视频插入DOM
      document.body.appendChild(newVideo);
 
      // 释放Blob URL
      URL.revokeObjectURL(blob);
 
      // 调用回调函数
      callback(newVideo);
    }, 'video/webm');
  });
}
 
// 使用方法
var video = document.createElement('video');
video.src = 'path/to/your/video.mp4';
video.load(); // 加载视频
 
// 当视频加载完成后，使用cropVideo函数
video.addEventListener('loadeddata', function() {
  cropVideo(video, 10, 20, function(croppedVideo) {
    console.log('Cropped video:', croppedVideo);
  });
});




*/