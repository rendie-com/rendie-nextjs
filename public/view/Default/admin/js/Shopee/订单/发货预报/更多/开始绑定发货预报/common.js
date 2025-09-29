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
            //binding_status=0    表示未绑定
            //binding_status=1    表示绑定失败
            //binding_status=2    表示已删除的绑定或绑定成功
            let where = " where @.binding_status<2";
            let data = [{
                action: "sqlite",
                database: "shopee/订单/发货预报/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("order_id,package_number,sls_tn,order_sn") + " FROM @.table " + where + Tool.limit(1, oo.A1),
                list: [{
                    action: "sqlite",
                    database: "shopee/订单/订单管理/" + oo.siteNum,
                    sql: "select " + Tool.fieldAs("purchaseInfo") + " FROM @.table where @.order_sn='${order_sn}' limit 1",
                }]
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/订单/发货预报/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table " + where,
                })
            }
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = t[1][0].count; }
            oo.Aarr = t[0]
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.d01, this, this.e01, oo);
        },
        //////////////////////////////////////////////////
        b01: function (logisticsStatus) {
            let arr = [
                [0, "无跟踪"],
                [1, "已揽件"],
                [2, "运输中"],
                [3, "物流异常"],
                [4, "派送中"],
                [5, "已签收"],
            ], val = "未知：" + logisticsStatus
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][0] === logisticsStatus) {
                    val = arr[i][1];
                    break;
                }
            }
            return val;
        },
        b02: function (logisticsCompany) {
            let carrier_id = 0;
            switch (logisticsCompany) {
                case "中通快递(ZTO)":
                case "中通快递":
                    carrier_id = 371; break;
                case "申通快递(STO)":
                case "申通快递":
                    carrier_id = 435; break;
                case "圆通速递":
                case "圆通速递(YTO)":
                    carrier_id = 285; break;
                case "韵达快递": carrier_id = 222; break;
                case "极兔速递": carrier_id = 862; break;
            }
            return carrier_id;
        },
        /////////////////////////////////////////////////
        d01: function (oo) {
            let o1 = oo.Aarr[0], orderidArr = [];
            $("#order_sn").html(o1.order_sn)
            let list = JSON.parse(o1.list[0][0].purchaseInfo);
            for (let i = 0; i < list.length; i++) {
                orderidArr.push(list[i].orderid)
            }
            if (orderidArr.length) {
                let data = [{
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: "select " + Tool.fieldAs("orderid,logisticsStatus,WaybillNumber,logisticsCompany") + " FROM @.table where @.orderid in('" + orderidArr.join("','") + "')",
                }]
                Tool.ajax.a01(data, this.d02, this, oo);
            }
            else {
                Tool.at("这个订单还没采购。")
            }
        },
        d02: function (t, oo) {
            let o1 = {}
            for (let i = 0; i < t[0].length; i++) {
                if (t[0][i].WaybillNumber) { o1 = t[0][i]; break; }
            }
            if (o1.orderid) {
                $("#_1688_orderid").html(o1.orderid)
                $("#_1688_WaybillNumber").html(o1.WaybillNumber)
                $("#_1688_logisticsCompany").html(o1.logisticsCompany)
                $("#_1688_logisticsStatus").html(this.b01(o1.logisticsStatus))
                this.d03(o1, oo)
            }
            else {
                $("#state").html("这个还没跟踪")
                oo.A1++;
                this.a02(oo);
            }
        },
        d03: function (o1, oo) {
            let carrier_id = this.b02(o1.logisticsCompany)
            if (carrier_id != 0) {
                this.d04(carrier_id, o1, oo)
            }
            else {
                Tool.at("未知物流：" + o1.logisticsCompany)
            }
        },
        d04: function (carrier_id, o1, oo) {
            oo.Aarr[0].carrier_id = carrier_id;//保存要用
            let data = {
                "fm_tn": o1.WaybillNumber,
                "carrier_id": carrier_id,
                "package_list": [
                    {
                        "order_id": Tool.int(oo.Aarr[0].order_id),
                        "package_number": oo.Aarr[0].package_number,
                        "sls_tn": oo.Aarr[0].sls_tn
                    }
                ],
                "self_deliver": false
            }
            let arr = [
                "SPC_CDS=" + oo.seller.SPC_CDS,
                "SPC_CDS_VER=2",
                "cnsc_shop_id=" + oo.seller[oo.site][oo.num].shopId,
                "cbsc_shop_region=" + oo.site,
            ]
            let url = "https://seller.shopee.cn/api/v3/shipment/bind_first_mile_orders_directly?" + arr.join("&")
            gg.postFetch(url, JSON.stringify(data), this.d05, this, oo)
        },
        d05: function (t, oo) {
            if (t.message == "success") {
                this.d06(oo)
            }
            else {
                Tool.pre(["绑定失败", t])
            }
        },
        d06: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/订单/发货预报/" + oo.siteNum,
                sql: "update @.table set @.shipping_method=2,@.action_status=2,@.binding_status=2,@.submit_time=" + Tool.gettime("") + ",@.fm_tn='" + oo.Aarr[0].fm_tn + "',@.carrier_id=" + oo.Aarr[0].carrier_id + " where  @.order_id='" + oo.Aarr[0].order_id + "' and @.package_number='" + oo.Aarr[0].package_number + "'",
            }]
            Tool.ajax.a01(data, this.d07, this, oo);
        },
        d07: function (t, oo) {
            oo.A2--;
            this.a02(oo);
        },
        ////////////////////////////////////////////
        e01: function (oo) {
            $("#" + oo.progress + "1").html("0%").css("width", "0%");
            $("#" + oo.progress + "2,#order_sn,#_1688_orderid,#_1688_WaybillNumber,#_1688_logisticsCompany,#_1688_logisticsStatus").html('');
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})