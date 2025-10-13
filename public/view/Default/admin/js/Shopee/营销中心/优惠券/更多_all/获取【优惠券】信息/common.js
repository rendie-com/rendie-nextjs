'use strict';
Object.assign(Tool, {
    voucher_list: {
        a01: function (seller, site, num, progress, endTime, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                endTime: endTime,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0,
                voucher_list: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/营销中心/优惠券/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "offset=" + ((oo.A1 - 1) * 10),//第一页为“0”    第二页为“10”        第三页为：“20”
                "limit=10",
                "promotion_type=0",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/voucher/list/?" + arr.join("&")
            $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
            $("#state").html("正在获取第" + oo.A1 + "页【优惠券】信息。。。");
            gg.getFetch(url, "json", this.a04, this, oo);
        },
        a04: function (t, oo) {
            if (t.code == 0) {
                oo.A2 = Math.ceil(t.data.total_count / 10);
                oo.voucher_list = t.data.voucher_list
                this.d01(oo)
            }
            else {
                Tool.pre(["出错2025/10/7", t])
            }
        },
        ///////////////////////////////////
        b01: function (val, k) {
            if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {
                val = val;
            }
            else if (typeof (val) == "object") {
                val = Tool.rpsql(JSON.stringify(val))
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        b02: function (oo) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in oo) {
                arrL.push("@." + k);
                oo[k] = this.b01(oo[k], k)
                arrR.push(oo[k]);
                if (k != "voucher_id") { updateArr.push("@." + k + "=" + oo[k]); }
            }
            return [arrL, arrR, updateArr]
        },
        /////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo)
        },
        d02: function (oo) {
            let arr = oo.voucher_list;
            if (oo.endTime != 0 && arr[0].end_time < oo.endTime) {
                this.e01(oo);//获取范围
            } else {
                let data = []
                for (let i = 0; i < arr.length; i++) {
                    let arrLRU = this.b02(arr[i]);
                    data.push({
                        action: "sqlite",
                        database: "shopee/营销中心/优惠券/" + oo.siteNum,
                        sql: "select @.voucher_id from @.table where @.voucher_id=" + arr[i].voucher_id,
                        list: [{
                            action: "sqlite",
                            database: "shopee/营销中心/优惠券/" + oo.siteNum,
                            sql: "update @.table set " + arrLRU[2].join(",") + "  where  @.voucher_id=" + arr[i].voucher_id,
                        }],
                        elselist: [{
                            action: "sqlite",
                            database: "shopee/营销中心/优惠券/" + oo.siteNum,
                            sql: "insert into @.table(" + arrLRU[0].join(",") + ")values(" + arrLRU[1].join(",") + ")",
                        }]
                    })
                }
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.d03, this, oo)
            }
        },
        d03: function (t, oo) {
            oo.A1++;
            $("#state").html("正在进入第" + oo.A1 + "页。。。");
            this.a03(null, oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})


