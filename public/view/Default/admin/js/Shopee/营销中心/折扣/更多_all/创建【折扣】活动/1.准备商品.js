'use strict';
Object.assign(Tool, {
    common1:
    {
        a01: function (seller, site, num, progress, next, This, t) {
            let oo = {
                seller: seller,
                site: site,
                num: num,
                progress: progress,
                next: next,
                This: This,
                t: t,
                /////////////////////////////////////////////////////
                siteNum: Tool.siteNum(site, num),
                A1: 1, A2: 0, Aarr: [],
                start_time: 0, end_time: 0,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.download_sqlite.a01(["shopee/商品/店铺商品/" + oo.siteNum, "shopee/营销中心/折扣/" + oo.siteNum], this.a03, this, oo);
        },
        a03: function (t, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/营销中心/折扣/" + oo.siteNum,
                sql: "select @.end_time as end_time FROM @.table where @.self_status<3 order by @.end_time desc limit 1",
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            let start_time = t[0][0] ? t[0][0].end_time + 60 * 10 : 0
            if (start_time < Tool.gettime("")) { start_time = Tool.gettime("") + 60 * 10; }//加10分钟
            $("#timeA").html(Tool.js_date_time2(start_time));
            let end_time = start_time + 60 * 60 * 24 * 3;
            $("#timeB").html(Tool.js_date_time2(end_time) + "（3天）")
            if (this.b01(start_time)) {//活动开始时间不能在3天后
                oo.start_time = start_time;
                oo.end_time = end_time;
                this.d01(oo);
            }
            else {
                $("#state").html("还没到做活动的时后。。。");
                this.d05(oo);
            }
        },
        //////////////////////////////////////////
        //活动开始时间不能在2天后
        b01: function (time) {
            let isbool = false, newTime = Tool.gettime("");
            if (time < newTime) {
                time = newTime; isbool = true;
            }
            else if (time < newTime + 60 * 60 * 24 * 2)//2天
            {
                isbool = true;
            }
            return isbool;
        },
        ///////////////////////////////////////////////
        d01: function (oo) {
            //@.status=1            表示【上架商品】
            //@.isDiscount=1        表示能打折
            //为什么是“56”？答：越南站点的最大打扣不能超个50的折扣，而我打折时又多减6，所以就是这个数。
            let where = " where @.status=1 and @.isDiscount=1 and @.newDiscount<56"
            let data = [{
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("fromid,newDiscount") + " from @.table" + where + " order by @._1688_saleNum desc" + Tool.limit(100, oo.A1),
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/商品/店铺商品/" + oo.siteNum,
                    sql: "select count(1) as count from @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].count / 100); }
            oo.Aarr = t[0];
            $("#product").html(JSON.stringify(t[0], null, 2))
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d03, this, this.d05, oo)
        },
        d03: function (oo) {
            Tool.common2.a01(oo.seller, oo.site, oo.num, oo.siteNum, oo.A1, oo.start_time, oo.end_time, oo.Aarr, this.d04, this, oo)
        },
        d04: function (oo) {
            oo.A1++;
            this.d01(oo)
        },
        d05: function (oo) {
            oo.next.apply(oo.This, [oo.t]);
        },
    }
});