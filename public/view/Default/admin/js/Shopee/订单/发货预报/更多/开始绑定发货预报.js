'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
        siteNum: Tool.siteNum(obj.params.site, obj.params.num),
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.site           站点
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 订单 &gt; 发货预报 &gt; 更多 &gt; 开始绑定发货预报") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">获取站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
            <tr><td class="right">第几个店铺：</td><td colspan="2">'+ obj.params.num + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">订单编号：</td><td id="order_sn" colspan="2"></td></tr>\
		    <tr><td class="right">1688订单号：</td><td id="_1688_orderid" colspan="2"></td></tr>\
		    <tr><td class="right">1688运单号码：</td><td id="_1688_WaybillNumber" colspan="2"></td></tr>\
		    <tr><td class="right">1688物流公司：</td><td id="_1688_logisticsCompany" colspan="2"></td></tr>\
		    <tr><td class="right">1688物流状态：</td><td id="_1688_logisticsStatus" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        //binding_status=0    表示未绑定
        //binding_status=1    表示绑定失败
        let where = " where @.binding_status<2";
        let data = [{
            action: "sqlite",
            database: "shopee/订单/发货预报/" + this.obj.siteNum,
            sql: "select " + Tool.fieldAs("order_id,package_number,sls_tn,order_sn") + " FROM @.table " + where + Tool.limit(1, this.obj.A1),
            list: [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + this.obj.siteNum,
                sql: "select " + Tool.fieldAs("purchaseInfo") + " FROM @.table where @.order_sn='${order_sn}' limit 1",
            }]
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/订单/发货预报/" + this.obj.siteNum,
                sql: "select count(1) as count FROM @.table " + where,
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) {
            this.obj.A2 = t[1][0].count;
        }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0]);
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
            case "中通快递(ZTO)": carrier_id = 371; break;
            case "申通快递(STO)": carrier_id = 435; break;
            case "圆通速递(YTO)": carrier_id = 285; break;
            case "韵达快递": carrier_id = 222; break;
            case "极兔速递": carrier_id = 862; break;
        }
        return carrier_id;
    },
    /////////////////////////////////////////////////
    d01: function (arr) {
        let oo = arr[0], orderidArr = [];
        $("#order_sn").html(oo.order_sn)
        oo.list = JSON.parse(oo.list[0][0].purchaseInfo);
        for (let i = 0; i < oo.list.length; i++) {
            orderidArr.push(oo.list[i].orderid)
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
            alert("xxxxxxxxxxxxxxx")
            //this.a05([[]], t)
        }
    },
    d02: function (t, o2) {
        let o1 = {}
        for (let i = 0; i < t[0].length; i++) {
            if (t[0][i].WaybillNumber) { o1 = t[0][i]; break; }
        }
        if (o1.orderid) {
            $("#_1688_orderid").html(o1.orderid)
            $("#_1688_WaybillNumber").html(o1.WaybillNumber)
            $("#_1688_logisticsCompany").html(o1.logisticsCompany)
            $("#_1688_logisticsStatus").html(this.b01(o1.logisticsStatus))
            this.d03(o1, o2)
        }
        else {
            $("#state").html("这个还没跟踪")
            this.d07()
        }
    },
    d03: function (o1, o2) {
        let carrier_id = this.b02(o1.logisticsCompany)
        if (carrier_id != 0) {
            this.d04(carrier_id, o1, o2)
        }
        else {
            Tool.at("未知物流：" + o1.logisticsCompany)
        }
    },
    d04: function (carrier_id, o1, o2) {
        let data = {
            "fm_tn": o1.WaybillNumber,
            "carrier_id": carrier_id,
            "package_list": [
                {
                    "order_id": Tool.int(o2.order_id),
                    "package_number": o2.package_number,
                    "sls_tn": o2.sls_tn
                }
            ],
            "self_deliver": false
        }
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[obj.params.site][Tool.int(obj.params.num) - 1].shopId,
            "cbsc_shop_region=" + obj.params.site,
        ]
        let url = "https://seller.shopee.cn/api/v3/shipment/bind_first_mile_orders_directly?" + arr.join("&")
        let update = {
            order_id: o2.order_id,
            package_number: o2.package_number,
            carrier_id: carrier_id,
            fm_tn: o1.WaybillNumber,
        }
        gg.postFetch(url, JSON.stringify(data), this.d05, this, update)
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
            database: "shopee/订单/发货预报/" + this.obj.siteNum,
            sql: "update @.table set @.shipping_method=2,@.action_status=2,@.binding_status=2,@.submit_time=" + Tool.gettime("") + ",@.fm_tn='" + oo.fm_tn + "',@.carrier_id=" + oo.carrier_id + " where  @.order_id='" + oo.order_id + "' and @.package_number='" + oo.package_number + "'",
        }]
        this.obj.A2--;
        Tool.ajax.a01(data, this.a04, this);
    },
    d07: function () {
        this.obj.A1++;
        this.a04();
    },
}
fun.a01();



