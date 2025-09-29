'use strict';
Object.assign(Tool, {
    common3: {
        a01: function (progress, next, This, t) {
            let oo = {
                progress: progress,
                next: next,
                This: This,
                t: t,
                //////////////////////
                A1: 1, A2: 0, Aarr: []
            }
            this.a02(oo)
        },
        a02: function (oo) {
            //@.kyyOrderStatusName='已申请运单号'         当手动在shopee点出货后，就会有这个。
            //@.statusDescription='已发货'                当填完运单号后，就会有这个。
            //@.statusDescription='待发货'
            let where = " where @.kyyOrderStatusName='已申请运单号'"
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/订单管理",
                sql: "select " + Tool.fieldAs("ordersn,warehouseId,items") + " FROM @.table" + where + " order by @.createTime asc limit 1",
                list: [{
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: "select " + Tool.fieldAs("consignee") + " FROM @.table where @.shopee_order_sn like '%${ordersn}%' limit 1"
                }]
            }]
            ////////////////////////////////////////////////
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/客优云/订单管理",
                    sql: "select count(1) as count FROM @.table" + where,
                })
            }
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].count; }
            oo.Aarr = t[0];
            this.d01(oo)
        },
        /////////////////////////////////////////
        b01: function (t, warehouseId) {
            let items = JSON.parse(t), itemIdList = [], orderStock = [];
            for (let i = 0; i < items.length; i++) {
                itemIdList.push(items[i].itemId);
                orderStock.push({
                    orderItemId: items[i].id,
                    callNo: items[i].variationQuantityPurchased,
                    platform: 10,
                    productSkuCode: items[i].variationSku,
                    isPre: true,
                    warehouseId: warehouseId
                })
            }
            return { itemIdList: itemIdList, orderStock: orderStock }
        },
        b02: function (t) {
            // let r = false
            // if (t[0]) {
            //     if (t[0].consignee.indexOf("盛货代+") != -1) {
            //         r = "1316635097@qq.com"//富盛物流（义乌仓，加我微信)
            //     }
            //     else if (t[0].consignee.indexOf("全驰+") != -1) {
            //         r = "271484474@qq.com"//[推荐] 全驰货运(Quanchi Logistic)（东莞仓，加我微信)
            //     }
            // }
            // return r;
            return "1316635097@qq.com"//富盛物流（义乌仓，加我微信)
        },
        ///////////////////////////////////
        d01: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d02, this, this.e01, oo);
        },
        d02: function (oo) {
            $("#ordersn").html(oo.Aarr[0].ordersn)
            let logisticsProvider = this.b02(oo.Aarr[0].list[0]);
            if (logisticsProvider) {
                this.d03(oo, logisticsProvider);
            }
            else {
                Tool.at("找不到【仓配商】。");
            }
        },
        d03: function (oo, logisticsProvider) {
            let url = "https://api.keyouyun.com/jax/api/package/enable/order/proxy/package/v3"
            let items = this.b01(oo.Aarr[0].items, oo.Aarr[0].warehouseId);
            let data = {
                packageType: "AUTO",
                logisticsProvider: logisticsProvider,
                comment: "",
                ordersn: oo.Aarr[0].ordersn,
                orders: [{ ordersn: oo.Aarr[0].ordersn, expressNumbers: ["0000"] }],
                itemIdList: items.itemIdList,
                skuCodes: [],
                orderStock: items.orderStock,
                logisticsWarehouseId: oo.Aarr[0].warehouseId
            }
            $("#url").html(url + '【post】');
            $("#state").html("正在代打包第" + oo.A1 + "个订单。。。");
            gg.postFetch(url, JSON.stringify(data), this.d04, this, oo);
        },
        d04: function (t, oo) {
            if (JSON.stringify(t.error) == "{}") {
                this.d05(oo);
            }
            else if (t.msgInfo) {
                Tool.pre(["代打包失败。", t.msgInfo]);
            }
            else {
                Tool.pre(["代打包失败。", t]);
            }
        },
        d05: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/订单管理",
                sql: "update @.table set @.kyyOrderStatusName='已处理' where @.ordersn='" + oo.Aarr[0].ordersn + "'",
            }]
            Tool.ajax.a01(data, this.d06, this, oo);
        },
        d06: function (t, oo) {
            oo.A1++;
            oo.Aarr = [];
            this.a02(oo);
        },
        //////////////////////
        e01: function (oo) {
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})
