'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        beginDateTime: 0,
        endDateTime: 0,
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 客优云 &gt; 订单管理 &gt; 获取订单信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">说明：</td><td colspan="2">客优云最多只能获取15天内的数据。</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">开始时间：</td><td id="beginDateTime" colspan="2"></td></tr>\
		    <tr><td class="right">结束时间：</td><td id="endDateTime" colspan="2"></td></tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function () {
        this.obj.beginDateTime = Tool.js_date_time2(Tool.gettime(Tool.userDate13(Date.now())) - 60 * 60 * 24 * 14, "-")
        this.obj.endDateTime = Tool.js_date_time2(Tool.gettime(Tool.userDate13(Date.now())) + 60 * 60 * 24 - 1, "-")
        $("#beginDateTime").html(this.obj.beginDateTime + "（15天）")
        $("#endDateTime").html(this.obj.endDateTime)
        this.a04();
    },
    a04: function () {
        let url = "https://api.keyouyun.com/jax/api/order/count/v2/1?orderStatus=&beginDateTime=" + this.obj.beginDateTime + "&endDateTime=" + this.obj.endDateTime + "&orderByStr=create_time&isAsc=false"
        $("#url").html(url);
        gg.getFetch(url, "json", this.a05, this)
    },
    a05: function (t) {
        for (let i = 0; i < t.length; i++) {
            if (t[i].code == "TOTAL_ORDER") {
                this.obj.A2 = Math.ceil(t[i].totalRecord / 10)
                break;
            }
        }
        this.d01()
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
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this);
    },
    d02: function () {
        let url = "https://api.keyouyun.com/jax/api/order/shop-recent-orders/v4"
        let data = {
            "page": this.obj.A1 - 1,
            "size": 10,
            "orderStatus": "",
            "beginDateTime": this.obj.beginDateTime,
            "endDateTime": this.obj.endDateTime,
            "orderByStr": "create_time",
            "isAsc": false
        }
        $("#url").html(url + '【post】');
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        gg.postFetch(url, JSON.stringify(data), this.d03, this)
    },
    d03: function (oo) {
        let orderList = oo.orderList, data = [];
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
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        this.obj.A1++;
        this.d01();
    },
}
fun.a01();