'use strict';
Object.assign(Tool, {
    create_discount:
    {

        a01: function (seller, site, num, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: Tool.int(num) - 1,
                next: next,
                This: This,
                t: t,
                /////////////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                start_time: 0,
                end_time: 0,
                D1: 1, D2: 0,
                E1: 1, E2: 0, Earr: [],
                discount_model_list: [],
                config: {}
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/商品/店铺商品/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "select @.value as value FROM @.config where @.name='Shopee/营销中心/index.js'",
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            let config = JSON.parse(t[0][0].value)["营销中心"]
            if (!config) config = {}
            if (!config[oo.siteNum]) { config[oo.siteNum] = {} }
            if (!config[oo.siteNum]["折扣活动"]) { config[oo.siteNum]["折扣活动"] = 0 }
            oo.config = config;
            this.a05(oo)
        },
        a05: function (oo) {
            oo.start_time = oo.config[oo.siteNum]["折扣活动"]
            if (!oo.start_time) { oo.start_time = 0 }
            if (oo.start_time < Tool.gettime("")) {
                oo.start_time = Tool.gettime("") + 60 * 60 * 2//初始化 开始时间
            }
            $("#timeA").html(Tool.js_date_time2(oo.start_time))
            const oneDay = 24 * 60 * 60; // 一天的毫秒数
            let day = (Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 * 10) - oo.start_time//计算到活动结束速差多少天。
            oo.D2 = Math.ceil(day / (oneDay * 2))//为什么“*2”？答：因为活动一次2天。
            this.a06(oo)
        },
        a06: function (oo) {
            Tool.x1x2("D", oo.D1, oo.D2, this.a07, this, this.g01, oo);
        },
        a07: function (oo) {
            oo.end_time = oo.start_time - 1 + 60 * 60 * 24 * 2;//2天(因为每个活动都是从00:0:00到23:59:59)
            if (this.b03(oo.start_time)) {
                this.d01(oo);
            }
            else {
                $("#state").html("活动不在3天以内，程序已终止。")
                this.f03(oo);
            }
        },
        //////////////////////////////////////
        b01: function (itemId, price, arr) {
            let val = false;//等于false 说明有问题，没有找到商品ID。
            for (let i = 0; i < arr.length; i++) {
                if (itemId == arr[i].fromid) {
                    val = parseInt(price * (1 - (arr[i].newDiscount - 6) / 100) * 100000)
                    break;
                }
            }
            return val;
        },
        b02: function (item_id, arr) {
            let min_purchase_limit = 0;
            for (let i = 0; i < arr.length; i++) {
                if (item_id == arr[i].itemid) {
                    min_purchase_limit = arr[i].min_purchase_limit;
                    break;
                }
            }
            if (min_purchase_limit == 0) {
                Tool.pre(["出错", min_purchase_limit])
            }
            return min_purchase_limit;
        },
        b03: function (time) {
            let isbool = false, newTime = Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24;//因为每个活动都是从00:0:00到23:59:59
            if (time < newTime) {
                time = newTime; isbool = true;
            }
            else if (time <= newTime + 60 * 60 * 24 * 3)//3天
            {
                isbool = true;
            }
            return isbool;
        },
        ///////////////////////////////////////////////
        d01: function (oo) {
            $("#timeA").html(Tool.js_date_time2(oo.start_time))
            $("#timeB").html(Tool.js_date_time2(oo.end_time) + "（2天）")
            //@.status=1        表示【上架商品】
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select @.fromid as fromid,@.newDiscount as newDiscount from @.table where @.status=1 and @.isDiscount=1 order by @._1688_saleNum desc" + Tool.limit(10, oo.E1),
            }]
            if (oo.E2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count from @.table where @.status=1 and @.isDiscount=1",
                })
            }
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (oo.E2 == 0) { oo.E2 = Math.ceil(t[1][0].count / 10); }
            oo.Earr = t[0];
            Tool.x1x2("E", oo.E1, oo.E2, this.d03, this, this.f01, oo)
        },
        d03: function (oo) {
            $("#state").html("正在搜索商品。。。");
            let ids = [], arr = oo.Earr;
            for (let i = 0; i < arr.length; i++) {
                ids.push(arr[i].fromid)
            }
            let pArr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "offset=0",
                "limit=100",
                "is_ads=0",
                "need_brand=0",
                "need_item_model=0",
                "search_type=1",
                "search_content=" + ids.join(","),
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/public/product_selector/?" + pArr.join("&")
            gg.getFetch(url, "json", this.d04, this, oo)
        },
        d04: function (t, oo) {
            if (t.code == 0) {
                this.d05(t.data.item_stock_price_infos, t.data.item_list, oo)
            }
            else {
                Tool.pre(["出错：", t])
            }
        },
        d05: function (arr1, item_list, oo) {
            let nArr = []
            for (let i = 0; i < arr1.length; i++) {
                let arr3 = arr1[i].sku_stock_price_list
                for (let j = 0; j < arr3.length; j++) {
                    if (arr3[j].seller_stock_info.normal_stock > this.b02(arr1[i].item_id, item_list))//库存不能低于【最小购买量】
                    {
                        nArr.push({
                            item_id: arr1[i].item_id,
                            model_id: arr3[j].model_id,
                            promotion_price: this.b01(arr1[i].item_id, arr3[j].price_info.input_normal_price, oo.Earr),
                            user_item_limit: 0,
                            status: 1
                        })
                    }
                }
            }
            oo.discount_model_list = nArr
            this.e01(oo)
        },
        //////////////////////////////////////////////
        e01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            //思路：先创建活动，后添加商品。
            //为什么？因为，shopee就是这么干的。
            let url = "https://seller.shopee.cn/api/marketing/v4/discount/create_discount/?" + arr.join("&")
            let timeStr = Tool.userDate13(oo.start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(oo.end_time * 1000 + 1000, "/").substr(5)
            let data = {
                "title": "【" + oo.D1 + "-" + oo.E1 + "】打折 —— " + timeStr,
                "start_time": oo.start_time,
                "end_time": oo.end_time,
                "status": 1
            }
            $("#state").html("正在创建活动");
            gg.postFetch(url, JSON.stringify(data), this.e02, this, oo)
        },
        e02: function (t, oo) {
            if (t.error == 0) {
                $("#state").html("活动创建成功，正在添加商品");
                this.e03(t.data.promotion_id, oo)
            }
            else if (t.bff_meta == null) {
                //t={"bff_meta":null,"error":0,"error_msg":null,"data":{"promotion_id":688287161391807,"error_list":null}}
                this.e03(t.data.promotion_id, oo)
            }
            else {
                Tool.pre(["出错001：", t])
            }
        },
        e03: function (promotion_id, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/discount/update_seller_discount_items/?" + arr.join("&")
            let data = {
                promotion_id: promotion_id,
                discount_model_list: oo.discount_model_list
            }
            $("#state").html("正在【提交活动】。。。");
            gg.postFetch(url, JSON.stringify(data), this.e04, this, oo)
        },
        e04: function (t, oo) {
            //{"bff_meta":null,"error":0,"error_msg":null,"data":{"total_count":211,"success_count":211,"failed_item_list":null,"error_list":null}}
            if (t.error == 0 || t.error == 1400101314 || t.error == 1400101307 || t.error == 1400100025) {
                //1400101314     表示：iscount model price invalid（折扣型号价格无效）
                //1400101307     表示：some item has participated in promotion(某些项目已参与促销)
                //1400100025     表示：promo_price cannot be more than or equal to item's normal price [促销价格不能大于或等于商品的正常价格]
                this.e05(oo)
            }
            else if (oo.bff_meta == null) {
                //discount item illega
                this.e05(oo)
            }
            else {
                Tool.pre(["出错002：", t]);
            }
        },
        e05: function (oo) {
            oo.E1++;
            this.d01(oo);
        },
        ////////////////////////////////////////////////
        f01: function (oo) {
            $("#state").html("正在更新活动时间。")
            oo.config[oo.siteNum]["折扣活动"] = oo.end_time + 1;
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "update @.config set @.value=" + Tool.rpsql(JSON.stringify({ "营销中心": oo.config })) + " where  @.name='Shopee/营销中心/index.js'",
            }]
            Tool.ajax.a01(data, this.f02, this, oo);
        },
        f02: function (t, oo) {
            $("#state").html("更新活动时间成功。")
            this.f03(oo)
        },
        f03: function (oo) {
            oo.D1++
            oo.E1 = 1; oo.E2 = 0;
            $("#E1").css("width", "0%"); $("#E1,#E2").html("");
            oo.start_time = oo.end_time + 1//修改开始时间，准备做下一个时段的活动。
            this.a06(oo);
        },
        //////////////////////////
        g01: function (oo) {
            $("#D1").css("width", "0%");
            $("#D1,#D2").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    }
});