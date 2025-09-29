'use strict';
Object.assign(Tool, {
    common2: {
        a01: function (progress, next, This, t) {
            let oo = {
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////
                A1: 1, A2: 0,
                beginDateTime: 0,
                endDateTime: 0,
            }
            this.a02(oo)
        },
        a02: function (oo) {
            oo.beginDateTime = Tool.js_date_time2(Tool.gettime(Tool.userDate13(Date.now())) - 60 * 60 * 24 * 14, "-")
            oo.endDateTime = Tool.js_date_time2(Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 - 1, "-")
            $("#beginDateTime").html(oo.beginDateTime + "（15天）")
            $("#endDateTime").html(oo.endDateTime)
            this.a03(oo);
        },
        a03: function (oo) {
            let url = "https://api.keyouyun.com/jax/api/order/count/v2/1?orderStatus=&beginDateTime=" + oo.beginDateTime + "&endDateTime=" + oo.endDateTime + "&orderByStr=create_time&isAsc=false"
            $("#url").html(url);
            gg.getFetch(url, "json", this.a04, this, oo)
        },
        a04: function (t, oo) {
            for (let i = 0; i < t.length; i++) {
                if (t[i].code == "TOTAL_ORDER") {
                    oo.A2 = Math.ceil(t[i].totalRecord / 10)
                    break;
                }
            }
            this.d01(oo);
        },
        ///////////////////////////////////
        b01: function (val, k) {
            if (k == "createTime" || k == "updateTime" || k == "payTime" || k == "deadlineDay" || k == "cancelDay" || k == "orderCancelDay" || k == "gmtCreate" || k == "gmtModified" || k == "shipByDate") {
                val = Tool.gettime(val);
            }
            else if (k == "country") {
                val = Tool.rpsql(val.toLowerCase());
            }
            else if (typeof (val) == "string") {
                val = Tool.rpsql(val)
            }
            else if (typeof (val) == "number") {

            }
            else if (typeof (val) == "object") {
                val = Tool.rpsql(JSON.stringify(val))
            }
            else if (typeof (val) == "boolean") {
                val = val ? 1 : 0;
            }
            return val;
        },
        ///////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo);
        },
        d02: function (oo) {
            let url = "https://api.keyouyun.com/jax/api/order/shop-recent-orders/v4"
            let data = {
                "page": oo.A1 - 1,
                "size": 10,
                "orderStatus": "",
                "beginDateTime": oo.beginDateTime,
                "endDateTime": oo.endDateTime,
                "orderByStr": "create_time",
                "isAsc": false
            }
            $("#url").html(url + '【post】');
            $("#state").html("正在获取第" + oo.A1 + "页商品。。。");
            gg.postFetch(url, JSON.stringify(data), this.d03, this, oo)
        },
        d03: function (t, oo) {
            let orderList = t.orderList, data = [];
            for (let i = 0; i < orderList.length; i++) {
                let arrL = [], arrR = [], updateArr = []
                for (let k in orderList[i]) {
                    arrL.push("@." + k);
                    orderList[i][k] = this.b01(orderList[i][k], k)
                    arrR.push(orderList[i][k]);
                    if (k != "country" && k != "ordersn") {
                        updateArr.push("@." + k + "=" + orderList[i][k]);
                    }
                }
                /////////////////////////////////////////////////////////////////
                let update = "update @.table set " + updateArr.join(",") + "  where  @.country=" + orderList[i].country + " and @.ordersn=" + orderList[i].ordersn
                let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
                data.push({
                    action: "sqlite",
                    database: "shopee/客优云/订单管理",
                    sql: "select @.id from @.table where @.country=" + orderList[i].country + " and @.ordersn=" + orderList[i].ordersn,
                    list: [{
                        action: "sqlite",
                        database: "shopee/客优云/订单管理",
                        sql: update,
                    }],
                    elselist: [{
                        action: "sqlite",
                        database: "shopee/客优云/订单管理",
                        sql: insert,
                    }]
                })
            }
            Tool.ajax.a01(data, this.d04, this, oo);
        },
        d04: function (t, oo) {
            oo.A1++;
            this.d01(oo);
        },
        //////////////////////
        e01: function (oo) {
            oo.next.apply(oo.This, [oo.t]);
        },
    }
});