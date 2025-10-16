'use strict';
Object.assign(Tool, {
    common1:
    {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: {}
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let where = " where @.ismakevideo=0"
            //let where = " where @.proid='R812905'"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("proid") + " FROM @.table" + where + " limit 1",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select " + Tool.fieldAs("proid,ManualReview_1688_video_status,ManualReview_1688_ExplanationVideo_status,pic") + " FROM @.table where @.proid='${proid}' limit 1",

                }, {
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/${proid_100:proid}",
                    sql: "select @." + oo.siteNum + "_video as video FROM @.table where @.proid='${proid}'",
                }, {
                    action: "sqlite",
                    database: "shopee/商品/全球商品/${proid_100:proid}",
                    sql: "select " + Tool.fieldAs("video,ExplanationVideo,shopee_8pic") + " FROM @.table where @.proid='${proid}' limit 1",
                }]
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].count; }
            oo.product = t[0][0];
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.d05, oo);
        },
        a04: function (oo) {
            $("#proid").html(oo.product.proid)
            $("#state").html("正在生成视频。。。")
            Tool.common2.a01(oo.product, oo.siteNum, this.d01, this, oo)
        },
        ////////////////////////////////////////////////
        d01: function (shopeeVideo, oo) {
            if (shopeeVideo.length == 1) {
                $("#state").html("是数组就说明是有视频的，不用上传视频。");
                this.d03(shopeeVideo, oo);
            }
            else {
                $("#state").html("正在上传视频。。。")
                Tool.uploadShopeeVideo.a01(shopeeVideo, oo.seller, oo.site, oo.num, this.d02, this, oo)
            }
        },
        d02: function (t, oo) {
            if (t.iserr) {
                Tool.pre(["上传失败", t]);
            }
            else {
                this.d03(t, oo);
            }
        },
        d03: function (shopeeVideo, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.product.proid, 100),
                sql: "select @.proid FROM @.table where @.proid='" + oo.product.proid + "'",
                list: [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.product.proid, 100),
                    sql: "update @.table set @." + oo.siteNum + "_video=" + Tool.rpsql(JSON.stringify(shopeeVideo)) + " where @.proid='" + oo.product.proid + "'",
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/商品/图片/shopee首图/" + Tool.pronum(oo.product.proid, 100),
                    sql: "insert into @.table(@.proid,@." + oo.siteNum + "_video)values('" + oo.product.proid + "'," + Tool.rpsql(JSON.stringify(shopeeVideo)) + ")",
                }]
            }, {
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "update @.table set @.ismakevideo=1 where @.proid='" + oo.product.proid + "'"
            }, {
                action: "fs",
                fun: "rmdir",
                path: "./public/tmp/",

            }]
            Tool.ajax.a01(data, this.d04, this, oo);
        },
        d04: function (t, oo) {
            oo.A1++;
            this.a02(oo)
        },
        d05: function (oo) {
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})
