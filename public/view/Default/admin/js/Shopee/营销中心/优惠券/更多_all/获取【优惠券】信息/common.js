'use strict';
Object.assign(Tool, {
    voucher_list: {
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
        /////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo)
        },
        d02: function (oo) {
            let arr = oo.voucher_list, data = [];
            for (let i = 0; i < arr.length; i++) {
                data.push({
                    action: "sqlite",
                    database: "shopee/营销中心/优惠券/" + oo.siteNum,
                    sql: "select @.voucher_id as voucher_id from @.table where @.voucher_id=" + arr[i].voucher_id,
                    list: [{
                        action: "sqlite",
                        database: "shopee/营销中心/优惠券/" + oo.siteNum,
                        sql: "update @.table set @.uptime=" + arr[i].mtime + ",@.fe_status=" + arr[i].fe_status + "  where @.voucher_id=" + arr[i].voucher_id,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/营销中心/优惠券/" + oo.siteNum,
                        sql: "insert into @.table(@.voucher_id,@.name,@.voucher_code,@.start_time,@.end_time,@.discount,@.usage_quantity,@.min_price,@.max_value,@.value,@.addtime,@.uptime,@.fe_display_coin_amount,@.rule,@.fe_status)values(" + arr[i].voucher_id + "," + Tool.rpsql(arr[i].name) + "," + Tool.rpsql(arr[i].voucher_code) + "," + arr[i].start_time + "," + arr[i].end_time + "," + arr[i].discount + "," + arr[i].usage_quantity + "," + arr[i].min_price + "," + arr[i].max_value + "," + arr[i].value + "," + arr[i].ctime + "," + arr[i].mtime + "," + (arr[i].fe_display_coin_amount ? arr[i].fe_display_coin_amount : 0) + "," + Tool.rpsql(JSON.stringify(arr[i].rule)) + "," + arr[i].fe_status + ")",
                    }]
                })
            }
            $("#state").html("正在更新本地商品状态。。。");
            Tool.ajax.a01(data, this.d03, this, oo)
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


