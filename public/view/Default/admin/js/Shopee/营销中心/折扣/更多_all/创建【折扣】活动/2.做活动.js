'use strict';
Object.assign(Tool, {
    common2:
    {
        a01: function (seller, site, num, siteNum, A1, start_time, end_time, ids, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                siteNum: siteNum,
                A1: A1,
                start_time: start_time,
                end_time: end_time,
                ids: ids,
                next: next,
                This: This,
                t: t,
                //////////////////////
                discount_model_list: [],
                promotion_id: 0,//保存用的
                images: [],//保存用的
                title: "",//保存用的
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let ids = [], arr = oo.ids;
            for (let i = 0; i < arr.length; i++) { ids.push(arr[i].fromid); }
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
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/public/product_selector/?" + pArr.join("&")
            $("#state").html("正在搜索商品。。。");
            gg.getFetch(url, "json", this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t.code == 0) {
                this.a04(t.data.item_stock_price_infos, t.data.item_list, oo)
            }
            else {
                Tool.pre(["出错：", t])
            }
        },
        a04: function (arr1, item_list, oo) {
            let nArr = [], images = []
            for (let i = 0; i < arr1.length; i++) {
                let arr3 = arr1[i].sku_stock_price_list
                for (let j = 0; j < arr3.length; j++) {
                    if (arr3[j].seller_stock_info.normal_stock > this.b02(arr1[i].item_id, item_list))//库存不能低于【最小购买量】
                    {
                        nArr.push({
                            item_id: arr1[i].item_id,
                            model_id: arr3[j].model_id,
                            promotion_price: this.b01(arr1[i].item_id, arr3[j].price_info.input_normal_price, oo.ids),
                            user_item_limit: 0,
                            status: 1
                        })

                    }
                }
                ///////////////////////////////////////
                if (images.length < 5) { images.push(item_list[i].images.split(",")[0]); }//保存用的
            }
            oo.discount_model_list = nArr
            oo.images = images;
            this.d01(oo)
        },
        ///////////////////////////////////////
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
        //库存不能低于【最小购买量】
        b02: function (item_id, arr) {
            let min_purchase_limit = 0;
            for (let i = 0; i < arr.length; i++) {
                if (item_id == arr[i].itemid) {
                    min_purchase_limit = arr[i].min_purchase_limit;
                    break;
                }
            }
            if (min_purchase_limit == 0) { Tool.pre(["库存不能低于【最小购买量】出错", min_purchase_limit]); }
            return min_purchase_limit;
        },
        //////////////////////////////////////////////
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            //思路：先创建活动，后添加商品。
            //为什么？因为，shopee就是这么干的。
            let url = "https://seller.shopee.cn/api/marketing/v4/discount/create_discount/?" + arr.join("&")
            let timeStr = Tool.userDate13(oo.start_time * 1000, "/").substr(5) + " - " + Tool.userDate13(oo.end_time * 1000 + 1000, "/").substr(5)
            let data = {
                "title": "【" + oo.A1 + "】折扣活动 —— " + timeStr,
                "start_time": oo.start_time,
                "end_time": oo.end_time,
                "status": 1
            }
            oo.title = data.title
            $("#state").html("正在创建活动");
            gg.postFetch(url, JSON.stringify(data), this.d02, this, oo)
        },
        d02: function (t, oo) {
            if (t.error == 0) {
                //{"bff_meta":null,"error":0,"error_msg":null,"data":{"promotion_id":688287161391807,"error_list":null}}
                $("#state").html("活动创建成功，正在添加商品");
                oo.promotion_id = t.data.promotion_id
                this.d03(oo)
            }
            else {
                Tool.pre(["出错2025/10/14", t])
            }
        },
        d03: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/discount/update_seller_discount_items/?" + arr.join("&")
            let data = {
                promotion_id: oo.promotion_id,
                discount_model_list: oo.discount_model_list
            }
            $("#discount_model_list").html(JSON.stringify(oo.discount_model_list, null, 2))
            $("#state").html("正在【提交活动】。。。");
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo)
        },
        d04: function (t, oo) {
            if (t.error == 0) {
                //1400101314     表示：iscount model price invalid（折扣型号价格无效）
                //1400101307     表示：some item has participated in promotion(某些项目已参与促销)
                //1400100025     表示：promo_price cannot be more than or equal to item's normal price [促销价格不能大于或等于商品的正常价格]
                this.d05(oo)
            }
            else {
                Tool.pre(["出错2025/10/14：", t]);
            }
        },
        d05: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/营销中心/折扣/" + oo.siteNum,
                sql: "insert into @.table(@.promotion_id,@.self_status,@.start_time,@.end_time,@.images,@.title)values(" + oo.promotion_id + ",1," + oo.start_time + "," + oo.end_time + "," + Tool.rpsql(JSON.stringify(oo.images)) + "," + Tool.rpsql(oo.title) + ")",
            }]
            $("#state").html("更新活动时间成功。")
            Tool.ajax.a01(data, this.d06, this, oo);
        },
        d06: function (t, oo) {
            oo.next.apply(oo.This, [oo.t]);
        },
    }
});