'use strict';
Object.assign(Tool, {
    common1: {
        a01: function (next, This, t) {
            let oo = {
                next: next,
                This: This,
                t: t,
                ////////////////////
                data: []
            }
            this.a02(oo)
        },
        a02: function (oo) {
            Tool.login.a01(this.a03, this, oo);
        },
        a03: function (t, oo) {
            let data = [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("shopee_site,shopee_order_sn") + " FROM @.table order by @.ordertime desc limit 100",
            }, {
                action: o.DEFAULT_DB,
                database: "shopee/卖家账户",
                sql: "select " + Tool.fieldAs("config") + " FROM @.table limit 1",
            }]
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            let ordersnArr = [], data = [];
            let seller = JSON.parse(t[1][0].config)
            for (let i = 0; i < t[0].length; i++) {
                let arr1 = JSON.parse(t[0][i].shopee_site)
                let arr2 = JSON.parse(t[0][i].shopee_order_sn)
                for (let j = 0; j < arr2.length; j++) {
                    ordersnArr.push(arr2[j])
                    data.push({
                        "ordersn": arr2[j],
                        "shopId": this.b01(seller, arr1[j]),
                        "platform": 10
                    })
                }
            }
            oo.data = data
            this.a05(ordersnArr, oo)
        },
        a05: function (ordersnArr, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/订单管理",
                sql: "select " + Tool.fieldAs("ordersn") + " FROM @.table where ordersn in('" + ordersnArr.join("','") + "')",
            }]
            $("#state").html("正在获取【shopee/客优云/订单管理】");
            Tool.ajax.a01(data, this.a06, this, oo);
        },
        a06: function (t, oo) {
            $("#state").html("正在去重复。。。");
            let ordersnArr = [], data = [];
            for (let i = 0; i < t[0].length; i++) {
                ordersnArr.push(t[0][i].ordersn);
            }
            for (let i = 0; i < oo.data.length; i++) {
                if (ordersnArr.indexOf(oo.data[i].ordersn) == -1) {
                    data.push(oo.data[i]);
                }
            }
            if (data.length == 0) {
                $("#state").html("没有缺失订单。");
                oo.next.apply(oo.This, [oo.t])
            }
            else {
                oo.data = data;
                this.d01(oo);
            }
        },
        ////////////////////////////////////////
        d01: function (oo) {
            let url = "https://api.keyouyun.com/jax/api/order/sync-orders/v3";
            $("#state").html("正在同步缺失订单。");
            gg.postFetch(url, JSON.stringify(oo.data), this.d02, this, oo);
        },
        d02: function (data, oo) {
            oo.data = data;
            this.d03(oo);
        },
        d03: function (oo) {
            $("#state").html("正在等待同步结果。。。");
            Tool.Time("name", 200, this.d04, this, oo)
        },
        d04: function (oo) {
            //[{"parentKey":"sync_order_pro_bars:1f9b1c39-34a1-462d-a4e7-86b5eea1497c","platform":10}]
            let url = "https://api.keyouyun.com/jax/api/progress-bar/v3";
            gg.postFetch(url, JSON.stringify(oo.data), this.d05, this, oo);
        },
        d05: function (t, oo) {
            if (t[0].success == 0) {
                this.d03(oo)
            }
            else {
                $("#state").html("同步成功。");
                oo.next.apply(oo.This, [oo.t]);
            }
        },
        ///////////////////////////////////////////////
        b01: function (seller, site) {
            let shopId = 0, num = Number(site.substring(site.length - 1));
            if (!isNaN(num)) {
                shopId = seller[site.substring(0, site.length - 1)][num - 1].shopId
            }
            else {
                shopId = seller[site][0].shopId
            }
            return shopId;
        },
    }
});