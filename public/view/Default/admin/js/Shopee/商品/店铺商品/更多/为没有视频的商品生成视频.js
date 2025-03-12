'use strict';
var fun =
{
  obj: {
    A1: 1, A2: 0,
    seller: {},
    siteNum: Tool.siteNum(obj.params.site, obj.params.num),
  },
  a01: function () {
    let html = Tool.header(obj.params.return, 'Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多 &gt; 为没有视频的商品生成视频') + '\
    <div class="p-2">\
      <table class="table table-hover align-middle">\
      <tbody>\
        <tr><td class="right w150">说明：</td>\
        <td colspan="2">\
          如果【人工审核1688主视频状态】不是【审核通过】将用这个视频（会清空非【审核通过】的@.video字段内容），<br/>\
          如果【人工审核1688讲解视频状态】不是【审核通过】将用这个视频（会清空非【审核通过】的@.ExplanationVideo字段内容），<br/>\
          如果还是没有视频，那就用图片生成视频，上传用shopee平台。<br/>\
        </td></tr>\
        <tr><td class="right">站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">第几个店铺：</td><td colspan="2">'+ obj.params.num + '</td></tr>\
        <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
        <tr><td class="right">商品编码：</td><td id="proid" colspan="2"></td></tr>\
        <tr><td class="right">准备的图片：</td><td id="pic" colspan="2"></td></tr>\
        <tr><td class="right">生成后的视频：</td><td id="videoUrlA" colspan="2"></td></tr>\
        <tr><td class="right">上传后的视频：</td><td id="videoUrlB" colspan="2"></td></tr>\
        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
      </tbody>\
      </table>\
    </div>'
    Tool.html(this.a02, this, html);
  },
  a02: function () {
    Tool.login.a01(this.a03, this)
  },
  a03: function (t) {
    this.obj.seller = t;
    this.a04();
  },
  a04: function () {
    let where = " where @.ismakevideo=0"
    //let where = " where @.proid='R812905'"
    //let where = ""
    let data = [{
      action: "sqlite",
      database: "shopee/商品/店铺商品/" + this.obj.siteNum,
      sql: "select " + Tool.fieldAs("proid") + " FROM @.table" + where + Tool.limit(1, 1, "sqlite"),
      list: [
        {
          action: "sqlite",
          database: "shopee/商品/全球商品",
          sql: "select " + Tool.fieldAs("proid,ManualReview_1688_video_status,video,ManualReview_1688_ExplanationVideo_status,ExplanationVideo,pic,shopee_8pic") + " FROM @.table where @.proid='${proid}' limit 1",
        }, {
          action: "sqlite",
          database: "shopee/商品/图片/shopee首图",
          sql: "select @." + this.obj.siteNum + "_video as video FROM @.table where @.proid='${proid}'",
        }
      ]
    }]
    if (this.obj.A2 == 0) {
      data.push({
        action: "sqlite",
        database: "shopee/商品/店铺商品/" + this.obj.siteNum,
        sql: "select count(1) as Count FROM @.table" + where,
      })
    }
    Tool.ajax.a01(data, this.a05, this);
  },
  a05: function (t) {
    if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].Count; }
    Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a06, this, null, t[0][0])
  },
  a06: function (t) {
    $("#proid").html(t.proid)
    let oo = t.list[0][0]
    if (oo.ManualReview_1688_video_status == 7) {
      if (oo.video) {
        this.f04(JSON.parse(oo.video), t.proid)
      }
      else {
        Tool.at("【手动审核通过】的【主视频】，还没上传到shopee，请上传后再来。")
      }
    }
    else if (oo.ManualReview_1688_ExplanationVideo_status == 7) {
      if (oo.ExplanationVideo) {
        this.f04(JSON.parse(oo.ExplanationVideo), t.proid)
      }
      else {
        Tool.at("【手动审核通过】的【讲解视频】，还没上传到shopee，请上传后再来。")
      }
    }
    else if (t.list[1][0] && t.list[1][0].video) {
      this.f04(JSON.parse(t.list[1][0].video), t.proid)
    }
    else {
      this.a07(oo)
    }
  },
  a07: function (oo) {
    //能到这里，就说明，都没有审核通过，说明：不应该有上传到shopee的视频。所以要清空【@.video】和【@.ExplanationVideo】字段内容
    if (oo.video || oo.ExplanationVideo) {
      let data = [{
        action: "sqlite",
        database: "shopee/商品/全球商品",
        sql: "update @.table set @.video=null,@.ExplanationVideo=null where @.proid='" + oo.proid + "'"
      }]
      Tool.ajax.a01(data, this.a08, this, oo)
    }
    else {
      this.a08(null, oo)
    }
  },
  a08: function (t, oo) {
    let shopee_8pic = JSON.parse(oo.shopee_8pic)
    let data = [
      {
        action: "sqlite",
        database: "shopee/商品/图片/shopee放大镜图",
        sql: "select @." + this.obj.siteNum + "_watermark as watermark FROM @.table where @.src in('" + shopee_8pic.join("','") + "')",
      }
    ]
    $("#state").html("正在获取水印图。。。")
    let temp = { proid: oo.proid, images: [oo.pic] }
    Tool.ajax.a01(data, this.a09, this, temp);
  },
  a09: function (t, oo) {
    let iserror = false;
    if (t[0].length == 8) {
      for (let i = 0; i < t[0].length; i++) {
        if (t[0][i].watermark) {
          oo.images.push(t[0][i].watermark)
        }
        else {
          iserror = true;
          break;
        }
      }
      if (!iserror) {
        this.a10(oo);
      }
      else {
        Tool.at("必须生成放大镜图水印，才能继续。")
      }
    }
    else {
      $("#state").html("有水印图没找到，程序终止。。。")
    }
  },
  a10: function (oo) {
    let html = ""
    for (let i = 0; i < oo.images.length; i++) {
      oo.images[i] = "https://s-cf-sg.shopeesz.com/file/" + oo.images[i]
      html += '<a href="' + oo.images[i] + '" target="_blank" class="m-2"><img src="' + oo.images[i] + '_tn" class="img-fluid rounded w200"></a>'
    }
    $("#pic").html(html)
    let data = [{
      action: "fs",
      fun: "videoshow",
      images: oo.images
    }]
    $("#state").html("正在生成视频。。。")
    Tool.ajax.a01(data, this.d01, this, oo.proid);
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
  d01: function (t, proid) {
    let videoUrl = t[0].substring(6)
    let oo = {
      proid: proid,
      videoUrl: location.origin + videoUrl
    }
    $("#videoUrlA").html('<video height="400" controls=""><source src="' + videoUrl + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>')
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.onerror = function (e) {
      $("#state").html("上传视频出错了。")
    };
    let This = this;
    video.onloadedmetadata = function () {
      Tool.getFileBlob(videoUrl, This.d02, This, oo)
    };
  },
  d02: function (blob, oo) {
    $("#state").html('图片【blobToArrayBuffer】');
    let This = this;
    Tool.blobToArrayBuffer(blob).then(arrayBuffer => {
      let data = {
        "md5": this.b01(arrayBuffer),
        "file_size": arrayBuffer.byteLength,
        "file_name": oo.proid
      }
      //后面的提交要用
      oo.post = {
        "video_info": {
          "size": data.file_size,
          "md5": data.md5
        },
        "report_data": {
          "cost": 799,
          "sdk_version": "2.3.8",
          "os_type": "Win32",
          "os_version": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          "app_version": "1.0.0"
        }
      }
      This.d03(data, oo);
    });
  },
  d03: function (data, oo) {
    let arr = [
      "SPC_CDS=" + this.obj.seller.SPC_CDS,
      "SPC_CDS_VER=2",
      "cnsc_shop_id=" + this.obj.seller[obj.params.site][Tool.int(obj.params.num) - 1].shopId,
      "cbsc_shop_region=" + obj.params.site
    ]
    let url = "https://seller.shopee.cn/api/upload/v1/initiate_video_upload?" + arr.join("&")
    gg.postFetch(url, JSON.stringify(data), this.e01, this, oo)
  },
  //////////////////////////////////////////////////
  e01: function (t, oo) {
    let url = "https://up-ws-sg.vod.susercontent.com/file/upload"
    oo.post.vid = t.data.vid//后面的提交要用
    let data = [
      { name: "file", value: "（二进制）" + oo.videoUrl },
      { name: "token", value: t.data.cloud_services[0].token },
      { name: "key", value: t.data.vid + ".ori.mp4" },
      { name: "mimeType", value: "video/mp4" }]
    $("#state").html("正在上传视频。。。");
    gg.uploadFile(url, "text", [], data, this.e02, this, oo)
  },
  e02: function (t, oo) {
    $("#state").html("上传视频成功。");
    let videoUrl = "https://down-ws-global.vod.susercontent.com/" + oo.post.vid + ".ori.mp4"
    $("#videoUrlB").html('<video width="600" height="400" src="' + videoUrl + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>')
    oo.post.upload_result = {//后面的提交要用
      "service_id": "wscloud",
      "video_url": "https://down-ws-global.vod.susercontent.com/" + oo.post.vid + ".ori.mp4",
      "extend_id": t
    }
    this.e03(oo);
  },
  e03: function (oo) {
    let arr = [
      "SPC_CDS=" + this.obj.seller.SPC_CDS,
      "SPC_CDS_VER=2",
      "cnsc_shop_id=" + this.obj.seller[obj.params.site][Tool.int(obj.params.num) - 1].shopId,
      "cbsc_shop_region=" + obj.params.site
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
    gg.postFetch(url, JSON.stringify(oo.post), this.e04, this, oo)
  },
  e04: function (t, oo) {
    if (t.message == "success") {
      oo.num = 0;
      this.f01(oo);
    }
    else {
      $("#state").html("出错重试。。。");
      Tool.Time("name", 1000, this.a04, this, oo);
      //Tool.pre(["信息出错", t])
    }
  },
  /////////////////////////////////////
  f01: function (oo) {
    oo.num++;
    if (oo.num > 60 * 3) {
      //3分钟，还没上传成功就刷新
      location.reload();
    }
    else {
      $("#state").html("正在处理视频，已用时【" + oo.num + "秒】。")
      Tool.Time("name", 1000, this.f02, this, oo);
    }
  },
  f02: function (oo) {
    let arr = [
      "SPC_CDS=" + this.obj.seller.SPC_CDS,
      "SPC_CDS_VER=2",
      "cnsc_shop_id=" + this.obj.seller[obj.params.site][Tool.int(obj.params.num) - 1].shopId,
      "cbsc_shop_region=" + obj.params.site
    ]
    let data = {
      "vids": [oo.post.vid],
      "need_preview": true
    }
    let url = "https://seller.shopee.cn/api/upload/v1/get_video_upload_result_batch?" + arr.join("&")
    $("#state").html("查看处理结果。。。");
    gg.postFetch(url, JSON.stringify(data), this.f03, this, oo)
  },
  f03: function (t, oo) {
    if (t.message == "success") {
      if (t.data[0].message == "Success") {
        let shopeeVideo = [{
          "video_id": t.data[0].video_info.video_id,
          "thumb_url": t.data[0].video_info.thumbnail,
          "duration": t.data[0].video_info.duration,
          "version": 2,
          "vid": t.data[0].vid
        }]
        this.f04(shopeeVideo, oo.proid)
      }
      else {
        this.f01(oo)
      }
    }
    else {
      Tool.pre(["获取视频信息出错", t])
    }
  },
  f04: function (shopeeVideo, proid) {
    let data = [{
      action: "sqlite",
      database: "shopee/商品/图片/shopee首图",
      sql: "select @.proid FROM @.table where @.proid='" + proid + "'",
      list: [{
        action: "sqlite",
        database: "shopee/商品/图片/shopee首图",
        sql: "update @.table set @." + this.obj.siteNum + "_video=" + Tool.rpsql(JSON.stringify(shopeeVideo)) + " where @.proid='" + proid + "'",
      }],
      elselist: [{
        action: "sqlite",
        database: "shopee/商品/图片/shopee首图",
        sql: "insert into @.table(@.proid,@." + this.obj.siteNum + "_video)values('" + proid + "'," + Tool.rpsql(JSON.stringify(shopeeVideo)) + ")",
      }]
    }, {
      action: "sqlite",
      database: "shopee/商品/店铺商品/" + this.obj.siteNum,
      sql: "update @.table set @.ismakevideo=1 where @.proid='" + proid + "'"
    }]
    Tool.ajax.a01(data, this.f05, this)
  },
  f05: function (t) {
    $("#proid,#pic,#videoUrlA,#videoUrlB").html("");
    this.obj.A1++;
    this.a04();
  },
}
fun.a01();