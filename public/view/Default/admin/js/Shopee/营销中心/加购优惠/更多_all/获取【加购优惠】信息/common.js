'use strict';
Object.assign(Tool, {
    add_on_deal_list: {
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
                A1: 1, A2: 1,
                add_on_deal_list: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/营销中心/加购优惠/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.e01, oo)
        },
        a04: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "count=50",
                "offset=" + ((oo.A1 - 1) * 50),//第一页为“0”    第二页为“50”        第三页为：“100”
                "status=0",
                "sub_type=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v3/add_on_deal/list/?" + arr.join("&")
            $("#url").html(url);
            $("#state").html("正在获取第" + oo.A1 + "页【加购优惠】信息。。。");
            gg.getFetch(url, "json", this.a05, this, oo);
        },
        a05: function (t, oo) {
            if (t.message == "success") {
                if (t.data.has_more) { oo.A2++; }
                if (t.data.add_on_deal_list) {
                    this.d01(t.data.add_on_deal_list, oo)
                }
                else {
                    $("#state").html("没有【加购优惠】信息。");
                    this.e01(oo)
                }
            }
            else {
                Tool.pre(["出错", t])
            }
        },
        ////////////////////////////////////////////////////       
        b01: function (oo, siteNum) {
            let arrL = [
                "@.add_on_deal_id",
                "@.add_on_deal_name",
                "@.start_time",
                "@.end_time",
                "@.addtime",
                "@.sub_item_limit",
                "@.sub_item_priority",
                "@.sub_type",
                "@.purchase_min_spend",
                "@.per_gift_num",
                "@.source",
                "@.status"
            ], arrR = [
                oo.add_on_deal_id,
                Tool.rpsql(oo.add_on_deal_name),
                oo.start_time,
                oo.end_time,
                oo.create_time,
                oo.sub_item_limit,
                Tool.rpsql(JSON.stringify(oo.sub_item_priority)),
                oo.sub_type,
                oo.purchase_min_spend,
                oo.per_gift_num,
                oo.source,
                oo.status,
            ]
            return {
                action: "sqlite",
                database: "shopee/营销中心/加购优惠/" + siteNum,
                sql: "select @.add_on_deal_id from @.table where @.add_on_deal_id =" + oo.add_on_deal_id,
                list: [{
                    action: "sqlite",
                    database: "shopee/营销中心/加购优惠/" + siteNum,
                    sql: "update @.table set @.status=" + oo.status + " where @.add_on_deal_id=" + oo.add_on_deal_id,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "shopee/营销中心/加购优惠/" + siteNum,
                    sql: "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")",
                }]
            }
        },
        ////////////////////////////////////////////////////
        d01: function (add_on_deal_list, oo) {
            if (oo.endTime != 0 && add_on_deal_list[0].end_time < oo.endTime) {//获取范围
                this.e01(oo);
            } else {
                let data = []
                for (let i = 0; i < add_on_deal_list.length; i++) {
                    data.push(this.b01(add_on_deal_list[i], oo.siteNum))
                }
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.d02, this, oo)
            }
        },
        d02: function (t, oo) {
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