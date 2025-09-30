'use strict';
Object.assign(Tool, {
    common3:
    {
        a01: function (videoUrl, shopId, siteNum, proid, next, This, t) {
            ClipboardJS.copy(videoUrl);//复制
            let oo = {
                videoUrl: videoUrl,
                shopId: shopId,
                siteNum: siteNum,
                proid: proid,
                next: next,
                This: This,
                t: t,
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let url = "https://seller.shopee.cn/portal/mtsku/new?cnsc_shop_id=" + oo.shopId
            $("#state").html('首页 - 全球商品 - 新增商品】...<a href="' + url + '" target="_blank">' + url + '</a>');
            gg.tabs_remove_create_indexOf(2, url, ['>商品视频</div>'], false, this.a03, this, oo)
        },
        a03: function (t, oo) {
            //点上传视频按扭
            hid.mouseClick.a01(720, 380, 2, 1, this.a04, this, oo);//鼠标右单击
        },
        a04: function (oo) {
            //按下【ctrl+v】
            //1     表示【Ctrl】
            //25    表示【v】
            hid.click.a01([3, 1, 0, 0, 25, 0, 0, 0, 0], 1, this.a06, this, oo);
        },
        a06: function (oo) {
            //按下【Enter】
            hid.click.a01([3, 0, 0, 0, 40, 0, 0, 0, 0], 1, this.d01, this, oo);
        },
        ///////////////////////////////////////////
        d01: function (oo) {
            $("#state").html('正在执行注入操作...');
            let htmlArr = [{
                url: "seller.shopee.cn/api/upload/v1/get_video_upload_result_batch",
                postData: 'need_preview',
                content: 'video_id'
            }]
            gg.tabs_executeScript_devtools_indexOf(2, ["jquery"], '$(".eds-button--primary").click();', htmlArr, true, this.d03, this, oo)
        },
        d03: function (t, oo) {
            $("#state").html("上传视频成功。");
            let videoUrl = "https://down-ws-global.vod.susercontent.com/" + t[0].data[0].vid + ".ori.mp4"
            $("#videoUrlB").html('<video height="400" src="' + videoUrl + '" type="video/mp4">您的浏览器不支持 HTML5 video 标签。</video>')
            oo.shopeeVideo = [{
                "video_id": t[0].data[0].video_info.video_id,
                "thumb_url": t[0].data[0].video_info.thumbnail,
                "duration": t[0].data[0].video_info.duration,
                "version": 2,
                "vid": t[0].data[0].vid
            }]
            this.d04(oo);
        },
        d04: function (oo) {
            let data = [{
                action: "fs",
                fun: "rmdir",
                path: "./public/tmp/",

            }]
            Tool.ajax.a01(data, this.d05, this, oo);
        },
        d05: function (t, oo) {
            if (t[0] == "目录删除成功") {
                this.d06(oo)
            }
            else {
                Tool.pre(["有错误", t])
            }
        },
        d06: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.proid, 100),
                sql: "select @.proid FROM @.table where @.proid='" + oo.proid + "'",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.proid, 100),
                    sql: "update @.table set @." + oo.siteNum + "_video=" + Tool.rpsql(JSON.stringify(oo.shopeeVideo)) + " where @.proid='" + oo.proid + "'",
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.proid, 100),
                    sql: "insert into @.table(@.proid,@." + oo.siteNum + "_video)values('" + oo.proid + "'," + Tool.rpsql(JSON.stringify(oo.shopeeVideo)) + ")",
                }]
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.ismakevideo=1 where @.proid='" + oo.proid + "'"
            }]
            Tool.ajax.a01(data, this.d07, this, oo);
        },
        d07: function (t, oo) {
            $("#proid,#pic,#videoUrlA,#videoUrlB").html("");
            Tool.apply(null, oo.next, oo.This);
        },
    }
})