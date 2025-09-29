'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
    },
    a01: function () {
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 订单 &gt; 更多 &gt; 从客优云和1688获取采购信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="right w150">包裹条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">订单站点：</td><td id="nodeCode" colspan="2"></td></tr>\
		    <tr><td class="right">shopee订单号：</td><td id="ordersn" colspan="2"></td></tr>\
		    <tr><td class="right">1688快递单号：</td><td id="expressInfos" colspan="2"></td></tr>\
		    <tr><td class="right">1688订单信息：</td><td id="_1688_order" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.at("这个功能不要了，不需要了。")
        // let data = [{
        //     action: "fs",
        //     fun: "access_sqlite",
        //     database: "shopee/客优云/包裹管理",
        //     mode: 0,
        //     elselist: [{
        //         action: "fs",
        //         fun: "download_sqlite",
        //         urlArr: ["https://raw.githubusercontent.com/rendie-com/rendie-com/refs/heads/main/sqlite3/shopee/客优云/包裹管理.db"],
        //         database: "shopee/客优云/包裹管理",
        //     }]
        // }]
        // Tool.ajax.a01(data, this.a03, this);
    },
    a03: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select " + Tool.fieldAs("nodeCode,orderInfos,expressInfos") + " FROM @.table" + Tool.limit(1, this.obj.A1, "sqlite"),

        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "select count(1) as Count FROM @.table",
            })
        }
        $("#state").html("正在获取客优云包裹。")
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].Count }
        this.d01(t[0][0])
    },
    ////////////////////////////////////////////
    d01: function (oo) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null, oo);
    },
    d02: function (oo) {
        let orderInfos = JSON.parse(oo.orderInfos)
        let expressInfos = JSON.parse(oo.expressInfos)
        let tempObj = {
            nodeCode: oo.nodeCode.toLowerCase(),
            ordersn: orderInfos[0].ordersn
        }
        $("#nodeCode").html(tempObj.nodeCode)
        $("#ordersn").html(tempObj.ordersn)
        $("#expressInfos").html(oo.expressInfos)
        this.d03(tempObj, expressInfos)
    },
    d03: function (tempObj, expressInfos) {
        let data = [];
        for (let i = 0; i < expressInfos.length; i++) {
            data.push({
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select " + Tool.fieldAs("orderid,total") + " FROM @.table where @.WaybillNumber='" + expressInfos[i].number + "'",
            })
        }
        $("#state").html("正在获取1688买家订单。")
        Tool.ajax.a01(data, this.d04, this, tempObj)
    },
    d04: function (t, tempObj) {
        if (t[0].length == 0) {
            this.d05();
        }
        else {
            let purchaseInfo = JSON.stringify(t[0])
            $("#_1688_order").html(purchaseInfo)
            let updateArr = [
                "@.purchaseInfo=" + Tool.rpsql(purchaseInfo),
                "@.purchaseStatus=3",//3:采购已付款
                "@.purchaseAccount='tb0528449790'",
                "@.purchaseNotes='从客优云同步过来的数据'",
                "@.purchasePostingFee=3"//采购贴单费
            ]
            let data = [{
                action: "sqlite",
                database: "shopee/订单/订单管理/" + tempObj.nodeCode,
                sql: "update @.table set " + updateArr.join(",") + "  where @.order_sn='" + tempObj.ordersn + "'"
            }]
            Tool.ajax.a01(data, this.d05, this)
        }
    },
    d05: function () {
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();