'use strict';
Object.assign(Tool, {
    createFlashSale://创建新的店内秒杀。
    {
        obj: {
            th: {
                size: 10//剩余限额： 10
            },
            cl: {
                size: 5//剩余限额： 5
            },
            ph: {
                size: 50//剩余限额： 50
            },
            vn: {
                size: 10//剩余限额： 10
            },
            mx: {
                size: 50//剩余限额： 50
            },
            co: {
                size: 50//剩余限额： 50
            },
            sg: {
                size: 20//剩余限额： 20
            },
            tw: {
                size: 20//剩余限额： 20
            },
            my: {
                size: 10//剩余限额： 10
            },
            br: {
                size: 20//剩余限额： 20
            }
        },
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
                start_time: Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 * 1,
                end_time: 0,
                D1: 1, D2: 0,
                Darr: [],
                A1: 1//商品翻页用的
            }
            $("#timeA").html(Tool.js_date_time2(oo.start_time));
            oo.end_time = oo.start_time - 1 + 60 * 60 * 24 * 3;//3天(因为每个活动都是从00:0:00到23:59:59)
            $("#timeB").html(Tool.js_date_time2(oo.end_time));
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "start_time=" + oo.start_time,
                "end_time=" + oo.end_time,
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/shop_flash_sale/time_slot/?" + arr.join("&")
            $("#state").html("正在获取秒杀时段的个数。。。");
            gg.getFetch(url, "json", this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (t.code == 0) {
                oo.Darr = t.data
                oo.D2 = t.data.length
                this.a04(oo)
            }
            else {
                $("#state").html("到不了这里。。。");
            }
        },
        a04: function (oo) {
            Tool.x1x2("D", oo.D1, oo.D2, this.a05, this, this.e01, oo);
        },
        a05: function (oo) {
            let Darr = oo.Darr[oo.D1 - 1]
            $("#timeA").html(Tool.js_date_time2(Darr.start_time));
            $("#timeB").html(Tool.js_date_time2(Darr.end_time));
            this.d01(oo);
        },
        ///////////////////////////////////////////////////////////
        d01: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/shop_flash_sale/set/?" + arr.join("&")
            let data = { time_slot_id: oo.Darr[oo.D1 - 1].timeslot_id }
            $("#state").html("正在创建活动。。。");
            gg.postFetch(url, JSON.stringify(data), this.d02, this, oo)
        },
        d02: function (t, oo) {
            /*            
            {
              "code": 0,
              "message": "success",
              "data": {
                "ctime": 0,
                "enabled_item_count": 0,
                "end_time": 1717030799,
                "flash_sale_id": 12662545387520,
                "item_count": 0,
                "mtime": 0,
                "start_time": 1716998400,
                "status": 1,
                "timeslot_id": 5710121598976,
                "type": 1
              }
            }
            */
            if (t.code == 0) {
                $("#state").html("活动创建成功，准备去添加商品。。。");
                oo.Darr[oo.D1 - 1].flash_sale_id = t.data.flash_sale_id
                this.d03(oo)
            }
            else {
                Tool.pre(["活动创建失败", t]);
            }
        },
        d03: function (oo) {
            //@.status=1        表示【上架商品】
            //为什么要“+5”？答：有的库存太小，有的价格太低，这些都不要，所以“+5”，可以把坑位填满。
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid,MinimumOrder,newDiscount") + " FROM @.table where @.status=1 and @.isSeckill=1 and @._1688_maxPrice>1 order by @._1688_saleNum desc" + Tool.limit(this.obj[oo.site].size + 5, oo.A1),
            }]
            $("#state").html("正在获取本地商品。。。");
            Tool.ajax.a01(data, this.d04, this, oo);
        },
        d04: function (t, oo) {
            let arr = t[0]
            $("#ids").html('<textarea rows="30" class="form-control" disabled>' + JSON.stringify(arr, null, 2) + '</textarea>');
            if (arr.length == 0) {
                $("#state").html('数据量不够了，重新选数据。');
                if (oo.A1 == oo.D1) {
                    this.e01(oo)
                }
                else {
                    oo.A1 = 1;
                    this.d03(oo);
                }
            }
            else {
                oo.A1++;
                let search_content = []
                for (let i = 0; i < arr.length; i++) {
                    search_content.push(arr[i].fromid)
                }
                let pArr = [
                    "SPC_CDS=" + oo.seller.SPC_CDS,
                    "SPC_CDS_VER=2",
                    "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                    "cbsc_shop_region=" + oo.site,
                    "cursor=",
                    "limit=100",
                    "is_ads=0",
                    "need_brand=0",
                    "need_item_model=0",
                    "search_type=1",
                    "search_content=" + search_content.join(","),
                ]
                let url = "https://seller.shopee.cn/api/marketing/v4/public/product_selector/?" + pArr.join("&")
                $("#state").html("正在获取远和商品信息。。。");
                oo.fromidArr = arr;
                gg.getFetch(url, "json", this.d05, this, oo)
            }
        },
        d05: function (t, oo) {
            if (t.code == 0) {
                Tool.createFlashSale2.a01(
                    t.data.item_stock_price_infos,
                    oo.fromidArr,
                    this.obj[oo.site].size,
                    oo.Darr[oo.D1 - 1].flash_sale_id,
                    oo.seller,
                    oo.site,
                    oo.num,
                    this.d06,
                    this,
                    oo)//启用
            }
            else {
                $("#state").html("不可能到这里。");
                Tool.pre(t)
            }
        },
        d06: function (oo) {
            oo.D1++
            this.a04(oo);
        },
        //////////////////////////
        e01: function (oo) {
            $("#D1").css("width", "0%");
            $("#D1,#D2").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    }
});