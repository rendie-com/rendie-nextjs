Object.assign(Tool, {
    common2: {
        a01: function (data, seller, site, num, siteNum, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t,
            }
            this.a02(data, oo);
        },
        a02: function (o1, oo) {
            if (o1) {
                oo.insert = o1.insert;
                let pArr = [
                    "SPC_CDS=" + oo.seller.SPC_CDS,
                    "SPC_CDS_VER=2",
                    "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                    "cbsc_shop_region=" + oo.site
                ]
                let url = "https://seller.shopee.cn/api/marketing/v3/voucher/?" + pArr.join("&");
                gg.postFetch(url, JSON.stringify(o1.data), this.a03, this, oo)
            }
            else {
                $("#state").html("还没有到【创建优惠券】的时候。");
                this.a05(null, oo);
            }
        },
        a03: function (t, oo) {
            if (t.code == 0) {
                $("#state").html("添加优惠券-创建成功。");
                this.a04(t.data.voucher_id, oo)
            }
            // else if (t.message == "please create a new shop welcome voucher after the existing one is expired" || t.message == "please create a new second order voucher after the existing one is expired") {
            //     //请在现有优惠券过期后，创建一个新的商店欢迎券（要过期后创建新的）
            //     this.g02("", oo)
            // }
            // else if (t.message == "voucher prefix already exist") {
            //     //请在现有的第二张订单凭证过期后创建新的第二个订单凭证
            //     this.g02("", oo)
            // }
            // else if (t.message == "price check failed") {
            //     //被冻结就会这样子。
            //     this.a05("", oo)
            // }
            // else if (t.message == "campaign overlap") {
            //     //时间重复了，就会这样子
            //     this.g02("", oo)
            // }
            // else if (t.message == "ERROR_PARAM") {
            //     //参数错误，我还不知道什么原因。            
            //     this.g02("", oo)
            // }
            else {
                Tool.pre(["出错2025/10/10：", t]);
                //this.g01(oo)
            }
        },
        a04: function (voucher_id, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/营销中心/优惠券/" + oo.siteNum,
                sql: oo.insert.replace("${voucher_id}", voucher_id),
            }]
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            $("#state").html("本地活动添加成功。")
            Tool.apply(oo.t, oo.next, oo.This);
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //（5）【商品优惠券】：折扣金额10，最低消费100，可使用总数100。（3天一个活动，做3天，选100个销量大的商品）
        d01: function (A1, shopName, start_time, seller, site, num, siteNum, next, This, t) {
            let oo = {
                A1: A1,
                shopName: shopName,
                start_time: start_time,
                /////////////////////////////////////
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t,
            }
            this.d02(oo)
        },
        d02: function (oo) {
            //@.status=1        表示【上架商品】
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select @.fromid as itemid from @.table where @.status=1 order by @._1688_saleNum desc limit 100",
            }]
            $("#state").html("正在获取本地商品。。。");
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            let data = Tool.common3.b08(oo.A1, oo.shopName, oo.start_time, t[0]);
            this.a02(data, oo);
        },
    }
})