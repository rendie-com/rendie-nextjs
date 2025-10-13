Object.assign(Tool, {
    common1: {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                siteNum: Tool.siteNum(site, num),
                /////////////////////////////////
                A1: 1, A2: 8,// 要做8种活动的进度。
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/商品/店铺商品/" + oo.siteNum, "shopee/营销中心/优惠券/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.d01, oo);
        },
        a04: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/营销中心/优惠券/" + oo.siteNum,
                sql: "select @.end_time as end_time,@.name FROM @.table where @.name like '【" + oo.A1 + "】%' and @.fe_status<3 order by @.end_time desc limit 1",
            }]
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            let start_time = t[0][0] ? t[0][0].end_time + 1 : 0
            let shopName = oo.seller[oo.site][oo.num - 1].shopName.replace(/\_/g, "");
            let data = null
            switch (oo.A1) {
                case 1:
                    //（1）【店铺优惠券1】：3% Shopee币回扣，最高上限数额1，最低消费15，可使用总数100。（3天一个活动，一个活动做3天）
                    data = Tool.common3.b01(oo.A1, shopName, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 2:
                    //（2）【店铺优惠券2】：折扣金额1，最低消费20，可使用总数100。（3天一个活动，做3天）
                    data = Tool.common3.b05(oo.A1, shopName, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 3:
                    //（3）【新买家优惠券】：折扣金额2，最低消费30，可使用总数100。（3天一个活动，做3天）
                    data = Tool.common3.b06(oo.A1, shopName, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 4:
                    //（4）【回购买家优惠券】：折扣金额3，最低消费50，可使用总数100。（30天一个活动，做3天）
                    data = Tool.common3.b07(oo.A1, shopName, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 5:
                    //（5）【商品优惠券】：折扣金额10，最低消费100，可使用总数100。（3天一个活动，做3天，选100个销量大的商品）
                    Tool.common2.d01(oo.A1, shopName, start_time, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 6:
                    //（6）【关注礼优惠券】：最低消费20，折扣金额2，可使用总数100。（30天一个活动，做30天）
                    Tool.common4.a01(oo.A1, start_time, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo); break;
                case 7:
                    //（7）【非公开优惠券】：折扣金额3，最低消费50，可使用总数100。（30天一个活动，做30天）
                    data = Tool.common3.b04(oo.A1, shopName, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
                case 8:
                    //（8）【直播优惠券】：最低消费25，扣除百分比25%，可使用总数100。
                    data = Tool.common3.b03(oo.A1, start_time);
                    Tool.common2.a01(data, oo.seller, oo.site, oo.num, oo.siteNum, this.a06, this, oo);
                    break;
            }
        },
        a06: function (oo) {
            oo.A1++;
            this.a03(null, oo);
        },
        ///////////////////////////////////////////////////
        d01: function (oo) {
            $("#" + oo.progress + "1").css("width", "0%");
            $("#" + oo.progress + "1,#" + oo.progress + "2").html("");
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})
