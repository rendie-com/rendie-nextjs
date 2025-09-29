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
            //获取绑定记录。
            let end_time = Tool.gettime(Tool.userDate13(Date.now())) + (60 * 60 * 24 * 1) - 1;
            $("#end_time").html(Tool.js_date_time2(end_time) + "(90天)")
            let create_time = end_time - (60 * 60 * 24 * 90) + 1;
            $("#create_time").html(Tool.js_date_time2(create_time))
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
                "create_time=" + create_time,
                "end_time=" + end_time,
                "is_only_contain_alarm=false",
                "page_number=" + oo.A1,
                "page_size=100",
            ]
            let url = "https://seller.shopee.cn/api/v3/shipment/get_first_mile_operation_result_list?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取第" + oo.A1 + "页绑定记录。。。");
            gg.getFetch(url, "json", this.a05, this, oo)
        },
        a05: function (t, oo) {
            if (t.message == "success") {
                oo.A2 = Math.ceil(t.data.page_info.total / t.data.page_info.page_size)
                oo.Aarr = t.data.list
                this.d01(oo);
            }
            else {
                Tool.pre(["出错11", oo])
            }
        },
        ////////////////////////////////////////
        b01: function (val, k) {
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
            let data = [];
            for (let i = 0; i < oo.Aarr.length; i++) {
                let arrL = [], arrR = [], updateArr = []
                for (let k in oo.Aarr[i]) {
                    arrL.push("@." + k);
                     oo.Aarr[i][k] = this.b01(oo.Aarr[i][k], k)
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
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            oo.A1++;
            this.a02(oo);
        },
        /////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").html("0%").css("width", "0%");
            $("#" + oo.progress + "2,#url,#create_time,#end_time").html('');
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})