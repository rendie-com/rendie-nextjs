'use strict';
Object.assign(Tool, {
    update_product: {
        a01: function (seller, site, num, progress, where, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                where: where,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                products: []
            }
            this.a02(oo);
        },
        a02: function (oo) {
            $("#state").html("正在获取商品信息。。。");
            let arr = [
                "@.ManualReview<>9",//敦煌手动审核状态 <> 9.图片且详情审核通过
                "@.DHAfterReview<>0",//敦煌审核后本地状态 <> 0.正常
                //"@.BeforeReview<>1",//更新前本地状态 <> 1.更新成功
                "@.penalty_type<>0",//更新后违规类型 <> 0.未违规
                "@.ManualReview_1688_status<>1",//手动审核1688状态 <> 1.使用1688属性图
                "@.ManualReview_1688_state<>0",//手动审核后1688商品状态 <> 0.正常
                //"@.ManualReview_1688_video_status<>7",//人工审核1688视频状态 <> 7.审核通过
                "@.editStatus>2",//修改状态 > 2  （	0：未修改 1：第一次修改 2：第二次修改 3：货源不对）
            ]
            $("#where").html(arr.join(" or "))
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select @.proid as proid FROM @.table where @.is" + oo.site + "=1 and (" + arr.join(" or ") + ")" + Tool.limit(12, oo.A1),
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/全球商品",
                    sql: "select count(1) as count FROM @.table where @.is" + oo.site + "=1 and (" + arr.join(" or ") + ")",
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].count / 12); }
            oo.products = t[0]
            this.d01(oo)
        },
        ////////////////////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo)
        },
        d02: function (oo) {
            let data = [], proidArr = [], arr = oo.products
            for (let i = 0; i < arr.length; i++) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select @.fromid as fromid FROM @.table  where @.proid='" + arr[i].proid + "'",
                })
                proidArr.push(arr[i].proid)
            }
            $("#proid").html(proidArr.join(" , "))
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (arr, oo) {
            let data = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].length != 0) {
                    data.push({
                        id: arr[i][0].fromid,
                        unlisted: true
                    })
                }
            }
            this.d04(data, oo)
        },
        d04: function (data, oo) {
            let pArr = [
                "version=3.1.0",
                "source=seller_center",
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/v3/product/update_product/?" + pArr.join("&")
            $("#state").html("正在下架。。。");
            gg.postFetch(url, JSON.stringify(data), this.d05, this, oo)
        },
        d05: function (t, oo) {
            if (t.code == 0 || t.code == 1000100006 || t.code == 1000100007) {
                //t.code == 1000100006  表示全部失败
                //t.code == 1000100007  表示部分成功
                $("#state").html("正在更新下架。。。");
                this.d06(t.data.result, oo)
            }
            else {
                Tool.pre(["出错：", t])
            }
        },
        d06: function (arr, oo) {
            let data = []
            for (let i = 0; i < arr.length; i++) {
                // @.status=-3       表示【-3.问题数据】
                // @.status=-4       表示【-4.下架失败】
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "update @.table set @.status=" + (arr[i].code ? -4 : -3) + " where @.fromId=" + arr[i].id,
                })
            }
            Tool.ajax.a01(data, this.d07, this, oo);
        },
        d07: function (t, oo) {
            $("#state").html("这一页下架完成。。。");
            oo.A1++;
            this.a02(oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})

