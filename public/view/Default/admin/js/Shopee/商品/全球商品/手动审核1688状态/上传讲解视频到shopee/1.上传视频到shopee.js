'use strict';
Object.assign(Tool, {
    uploadShopeeVideo://1.上传视频到shopee
    {
        a01: function (videoSrc, seller, site, num, next, This, t) {
            let oo = {
                videoSrc: videoSrc,
                seller: seller,
                site: site,
                num: num - 1,
                next: next,
                This: This,
                t: t,
                /////////////////////
                post: null,//后面的提交要用
                count: 0,//计数
            }
            this.a02(oo)
        },
        a02: function (oo) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = oo.videoSrc;
            video.onerror = function (e) {
                $("#state").html("上传视频出错了。")
                This.e04({ iserr: true, code: 10, msg: "上传视频出错了。" }, oo)
            };
            let This = this;
            video.onloadedmetadata = function () {
                if (video.duration < 10) {
                    $("#state").html("视频时长小于10秒，上传不了。")
                    This.e04({ iserr: true, code: 8, msg: "视频时长小于10秒，上传不了." }, oo)
                }
                else if (video.duration > 60) {
                    $("#state").html("视频时长大于60秒，上传不了。")
                    This.e04({ iserr: true, code: 9, msg: "视频时长大于60秒，上传不了." }, oo)
                }
                else {
                    Tool.getFileBlob(oo.videoSrc, This.a03, This, oo)
                }
            };
        },
        a03: function (blob, oo) {
            $("#state").html('图片【blobToArrayBuffer】');
            let This = this;
            Tool.blobToArrayBuffer(blob).then(arrayBuffer => {
                let o1 = {
                    "md5": this.b01(arrayBuffer),
                    "file_size": arrayBuffer.byteLength,
                    "file_name": oo.videoSrc.split("/").pop()
                }
                //后面的提交要用
                oo.post = {
                    "video_info": {
                        "size": o1.file_size,
                        "md5": o1.md5
                    },
                    "report_data": {
                        "cost": 799,
                        "sdk_version": "2.3.8",
                        "os_type": "Win32",
                        "os_version": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                        "app_version": "1.0.0"
                    }
                }
                This.a04(o1, oo);
            });
        },
        a04: function (data, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=my"
            ]
            let url = "https://seller.shopee.cn/api/upload/v1/initiate_video_upload?" + arr.join("&")
            gg.postFetch(url, JSON.stringify(data), this.d01, this, oo)
        },
        ////////////////////////////////////////////////////////
        b01: function (e) {
            for (var t = 2097152, n = e.byteLength, r = Math.ceil(n / t), i = new (self_ArrayBuffer), o = 0; o < r; o++) {
                var a = o * t
                    , u = a + t >= n ? n : a + t
                    , c = e.slice(a, u);
                i.append(c)
            }
            return i.end()
        },
        /////////////////////////////////////////////////
        d01: function (t, oo) {
            let url = "https://up-ws-sg.vod.susercontent.com/file/upload"
            oo.post.vid = t.data.vid//后面的提交要用
            let data = [
                { name: "file", value: "（二进制）" + oo.videoSrc },
                { name: "token", value: t.data.cloud_services[0].token },
                { name: "key", value: t.data.vid + ".ori.mp4" },
                { name: "mimeType", value: "video/mp4" }]
            $("#state").html("正在上传视频。。。");
            gg.uploadFile(url, "text", [], data, this.d02, this, oo)
        },
        d02: function (t, oo) {
            $("#state").html("上传视频成功。");
            let src = "https://down-ws-global.vod.susercontent.com/" + oo.post.vid + ".ori.mp4"
            $("#ExplanationVideoB").html('<a href="' + src + '" target="_blank">' + src + '</a>')
            oo.post.upload_result = {//后面的提交要用
                "service_id": "wscloud",
                "video_url": "https://down-ws-global.vod.susercontent.com/" + oo.post.vid + ".ori.mp4",
                "extend_id": t
            }
            this.d03(oo);
        },
        d03: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=my"
            ]
            let url = "https://seller.shopee.cn/api/upload/v1/report_video_upload?" + arr.join("&")
            /*
            原生的：
            {
                "vid":"sg-11110105-6khy2-m1wtyuco5ehz2d",
                "upload_result":{
                    "service_id":"wscloud",
                    "video_url":"https://down-ws-global.vod.susercontent.com/sg-11110105-6khy2-m1wtyuco5ehz2d.ori.mp4",
                    "extend_id":"lmbU3-6PRQsJK6y7mKtwfwIxlSzK"
                },
                "video_info":{"size":9984365,"md5":"b15a5ee413f65abb01b9095fb2cc9012"},
                "report_data":{
                    "cost":1276,
                    "sdk_version":"2.3.8",
                    "os_type":"Win32",
                    "os_version":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                    "app_version":"1.0.0"
                }
            }
            /////////////////////////////////////////////////////////////////////
            我的：
            {
                "vid": "my-11110105-6kgco-m1wu1r20xelj05",
                "upload_result": {
                    "service_id": "wscloud",
                    "video_url": "https://down-ws-global.vod.susercontent.com/my-11110105-6kgco-m1wu1r20xelj05.ori.mp4",
                    "extend_id": {}
                },
                "video_info": {
                    "size": 9984365,
                    "md5": "aa6197d394ed1bf888a15b466e693713"
                },
                "report_data": {
                    "cost": 799,
                    "sdk_version": "2.3.8",
                    "os_type": "Win32",
                    "os_version": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                    "app_version": "1.0.0"
                },
            }
            */
            $("#state").html("杳看处理中。。。");
            gg.postFetch(url, JSON.stringify(oo.post), this.d04, this, oo)
        },
        d04: function (t, oo) {
            if (t.message == "success") {
                oo.count = 0;
                this.e01(oo);
            }
            else {
                Tool.pre(["信息出错", t])
            }
        },
        /////////////////////////////////////
        e01: function (oo) {
            oo.count++;
            $("#state").html("正在处理视频，已用时【" + oo.count + "秒】。")
            Tool.Time("name", 1000, this.e02, this, oo);
        },
        e02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=my"
            ]
            let data = {
                "vids": [oo.post.vid],
                "need_preview": true
            }
            let url = "https://seller.shopee.cn/api/upload/v1/get_video_upload_result_batch?" + arr.join("&")
            $("#state").html("查看处理结果。。。");
            gg.postFetch(url, JSON.stringify(data), this.e03, this, oo)
        },
        e03: function (t, oo) {
            if (t.message == "success") {
                if (t.data[0].message == "Success") {
                    let shopeeVideo = [{
                        "video_id": t.data[0].video_info.video_id,
                        "thumb_url": t.data[0].video_info.thumbnail,
                        "duration": t.data[0].video_info.duration,
                        "version": 2,
                        "vid": t.data[0].vid
                    }]
                    this.e04(shopeeVideo, oo)
                }
                else {
                    this.e01(oo)
                }
            }
            else {
                Tool.pre(["获取视频信息出错", t])
            }
        },
        e04: function (t, oo) {
            Tool.apply(t, oo.next, oo.This, oo.t)
        },
    },
})