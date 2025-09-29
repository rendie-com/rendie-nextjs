'use strict';
Object.assign(Tool, {
    common: {
        a01: function (progress, seller, site, num, siteNum, next, This, t) {
            let oo = {
                progress: progress,
                seller: seller,
                site: site,
                num: num - 1,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t,
                ////////////////////////////////////
                A1: 1, A2: 0, Aarr: []
            }
            this.a02(oo)
        },
        a02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
                "sort_type=1",
                "binding_status=1",
                "page_number=" + oo.A1,
                "page_size=100",
            ]
            let url = "https://seller.shopee.cn/api/v3/shipment/get_first_mile_orders?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取第" + oo.A1 + "页未绑定记录。。。");
            gg.getFetch(url, "json", this.a03, this, oo)
        },
        a03: function (t, oo) {
            if (t.message == "success") {
                oo.A2 = Math.ceil(t.data.page_info.total / t.data.page_info.page_size)
                oo.Aarr = t.data.list
                this.d01(oo);
            }
            else {
                Tool.pre(["出错11", t])
            }
        },
        ///////////////////////////////////////
        b01: function (val) {
            if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {
                val = val;
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        /////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo);
        },
        d02: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ], orders = []
            let url = "https://seller.shopee.cn/api/v3/order/get_images_for_order_list?" + arr.join("&");
            for (let i = 0; i < oo.Aarr.length; i++) {
                orders.push({
                    order_id: oo.Aarr[i].order_id,
                    package_number: oo.Aarr[i].package_number,
                    region_id: oo.Aarr[i].region_id,
                    shop_id: oo.Aarr[i].shop_id
                })
            }
            $("#state").html("正在获取未绑定图片。。。");
            gg.postFetch(url, JSON.stringify({ orders: orders }), this.d03, this, oo)
        },
        d03: function (t1, oo) {
            if (t1.code == 0) {
                this.d04(t1.data, oo)
            }
            else {
                Tool.pre(["出错", t1])
            }
        },
        d04: function (t1, oo) {
            $("#state").html("做成数数库字段图片。。。");
            for (let i = 0; i < oo.Aarr.length; i++) {
                let images = null;
                for (let j = 0; j < t1.length; j++) {
                    if (oo.Aarr[i].order_id == t1[j].order_id) {
                        images = JSON.stringify(t1[j].images);
                        break;
                    }
                }
                oo.Aarr[i].images = images;
            }
            this.d05(oo);
        },
        d05: function (oo) {
            let data = [];
            for (let i = 0; i < oo.Aarr.length; i++) {
                let arrL = [], arrR = [], updateArr = []
                for (let k in oo.Aarr[i]) {
                    arrL.push("@." + k);
                    oo.Aarr[i][k] = this.b01(oo.Aarr[i][k])
                    arrR.push(oo.Aarr[i][k]);
                    if (k != "region_id" && k != "order_id") {
                        updateArr.push("@." + k + "=" + oo.Aarr[i][k]);
                    }
                }
                /////////////////////////////////////////////////////////////////
                let update = "update @.table set " + updateArr.join(",") + "  where  @.region_id=" + oo.Aarr[i].region_id + " and @.order_id='" + oo.Aarr[i].order_id + "'"
                let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
                data.push({
                    action: "sqlite",
                    database: "shopee/订单/发货预报/" + oo.siteNum,
                    sql: "select @.id from @.table where @.region_id=" + oo.Aarr[i].region_id + " and @.order_id='" + oo.Aarr[i].order_id + "'",
                    list: [{
                        action: "sqlite",
                        database: "shopee/订单/发货预报/" + oo.siteNum,
                        sql: update,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/订单/发货预报/" + oo.siteNum,
                        sql: insert,
                    }]
                })
            }
            Tool.ajax.a01(data, this.d06, this, oo);
        },
        d06: function (t, oo) {
            oo.A1++;
            this.a02(oo);
        },
        /////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").html("0%").css("width", "0%");
            $("#" + oo.progress + "2,#url").html('');
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})