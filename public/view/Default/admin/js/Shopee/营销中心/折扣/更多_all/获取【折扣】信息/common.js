'use strict';
Object.assign(Tool, {
    get_discount_list: {
        a01: function (seller, site, num, progressArr, endTime, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progressArr: progressArr,
                endTime: endTime,
                next: next,
                This: This,
                t: t,
                //////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 3,//1:接下来的活动；2:进行中的活动；3:已过期；
                B1: 1, B2: 0,
                discount_list: [],
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/营销中心/折扣/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            Tool.x1x2(oo.progressArr[0], oo.A1, oo.A2, this.a04, this, this.e01, oo)
        },
        a04: function (oo) {
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num - 1].shopId,
                "cbsc_shop_region=" + oo.site
            ]
            let url = "https://seller.shopee.cn/api/marketing/v4/discount/get_discount_list/?" + arr.join("&")
            $("#url").html(url + '[post]');
            $("#state").html("正在获取第" + oo.B1 + "页【折扣】信息。。。");
            let data = {
                "need_count": true,
                "need_image": true,
                "offset": + ((oo.B1 - 1) * 10),//第一页为“0”    第二页为“10”        第三页为：“20”
                "limit": 10,
                "schedule_status": oo.A1,
                "primary_key": "DiscountList"
            }
            gg.postFetch(url, JSON.stringify(data), this.a05, this, oo);
        },
        a05: function (t, oo) {
            if (t.error == 0) {
                oo.B2 = Math.ceil(t.data.total_count / 10);
                oo.discount_list = t.data.discount_list
                this.d01(oo)
            }
            else {
                Tool.pre(["出错", oo])
            }
        },
        //////////////////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progressArr[1], oo.B1, oo.B2, this.d02, this, this.d04, oo)
        },
        d02: function (oo) {
            //说明：discount_list[i].status  这个没什么用。
            let discount_list = oo.discount_list
            if (oo.endTime != 0 && discount_list[0].end_time < oo.endTime) {
                this.d04(oo);//获取范围
            } else {
                let data = []
                for (let i = 0; i < discount_list.length; i++) {
                    let ins2 = discount_list[i].promotion_id + "," + Tool.rpsql(discount_list[i].title) + "," + oo.A1 + "," + discount_list[i].start_time + "," + discount_list[i].end_time + "," + Tool.gettime("") + "," + Tool.rpsql(JSON.stringify(discount_list[i].images)) + "," + discount_list[i].total_product
                    data.push({
                        action: "sqlite",
                        database: "shopee/营销中心/折扣/" + oo.siteNum,
                        sql: "select @.promotion_id as promotion_id from @.table where @.promotion_id=" + discount_list[i].promotion_id,
                        list: [{
                            action: "sqlite",
                            database: "shopee/营销中心/折扣/" + oo.siteNum,
                            sql: "update @.table set @.status=" + oo.A1 + ",@.images=" + Tool.rpsql(JSON.stringify(discount_list[i].images)) + "  where @.promotion_id=" + discount_list[i].promotion_id,
                        }],
                        elselist: [{
                            action: "sqlite",
                            database: "shopee/营销中心/折扣/" + oo.siteNum,
                            sql: "insert into @.table(@.promotion_id,@.title,@.status,@.start_time,@.end_time,@.addtime,@.images,@.total_product)values(" + ins2 + ")",
                        }]
                    })
                }
                $("#state").html("正在更新本地商品状态。。。");
                Tool.ajax.a01(data, this.d03, this, oo)
            }
        },
        d03: function (t, oo) {
            oo.B1++;
            oo.discount_list = []
            $("#state").html("正在进入第" + oo.B1 + "页。。。");
            this.a04(oo);
        },
        d04: function (oo) {
            oo.B1 = 1; oo.B2 = 0;
            $("#" + oo.progressArr[1] + "1").css("width", "0%");
            $("#" + oo.progressArr[1] + "1,#" + oo.progressArr[1] + "2").html("");
            oo.A1++;
            this.a03(null, oo);
        },
        //////////////////////////////
        e01: function (oo) {
            $("#" + oo.progressArr[0] + "1").css("width", "0%");
            $("#" + oo.progressArr[0] + "1,#" + oo.progressArr[0] + "2").html("");
            Tool.apply(oo.t, oo.next, oo.This);
        },
    }
})