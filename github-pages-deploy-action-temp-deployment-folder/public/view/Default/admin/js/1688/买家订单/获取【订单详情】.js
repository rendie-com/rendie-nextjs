'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "1688 &gt; 买家订单 &gt; 获取【订单详情】") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
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
        let data = [{
            action: "sqlite",
            database: "1688/买家订单",
            sql: "select " + Tool.fieldAs("orderid") + " FROM @.table order by @.ordertime desc" + Tool.limit(1, this.obj.A1),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select count(1) as count FROM @.table",
            },)
        }
        Tool.ajax.a01(data, this.a04, this)
    },
    a04: function (t) {
        if (this.obj.A2 == 0) {
            this.obj.A2 = t[1][0].count
        }
        this.d01(t[0][0].orderid)
    },
    //////////////////////////////////////
    b01: function (t) {
        let tbody = Tool.StrSlice(t, '<tbody>', '</tbody>')
        let arr = tbody.split("\n        \t\t\t                 </tr>"), nArr = []
        for (let i = 0; i < arr.length - 1; i++) {
            let tempArr = Tool.regSplits(arr[i], '\n        \t         <td>', '</td>');
            nArr.push({
                img: Tool.StrSlice(arr[i], '<img src="', '"'),
                title: Tool.StrSlice(arr[i], 'target="_blank" title="', '"'),
                attr: Tool.StrSlice(arr[i], '<span class="info-item  info-item-last">', '</span>'),
                ItemNumber: Tool.StrSlice(arr[i], '货号：</em><em class="value">', '</em>'),
                snapshot: Tool.Trim(Tool.StrSlice(arr[i], 'href="', '"')),
                price: Tool.Trim(tempArr[0]),
                count: Tool.Trim(Tool.StrSlice(tempArr[1], '<span>', '</span>')),
                PLUS_price: Tool.Trim(tempArr[2]),
                status: Tool.Trim(tempArr[3].split('<br/>')[0]),
            })
        }
        return nArr
    },
    ///////////////////////////////////
    d01: function (orderid) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null, orderid);
    },
    d02: function (orderid) {
        let url = "https://trade.1688.com/order/new_step_order_detail.htm?orderId=" + orderid
        $("#url").html(url);
        gg.getFetch(url, "gbk", this.d03, this)
    },
    d03: function (t) {
        let orderid = Tool.Trim(Tool.StrSlice(t, '订单号：</span>', '</li>'))//支付宝交易号
        let alipay_orderid = Tool.Trim(Tool.StrSlice(t, '支付宝交易号：</span>', '</li>'))//支付宝交易号
        let consignee = Tool.Trim(Tool.StrSlice(t, '<span data-mapping-key="toFullName">', '</span>'))//收货人
        let delivery_address = Tool.Trim(Tool.StrSlice(t, 'data-mapping-key="toArea">', '</span>'))//收货地址
        let delivery_phone = Tool.Trim(Tool.StrSlice(t, '<span data-mapping-key="toMobile">', '</span>'))//收货人手机
        let delivery_telephone = Tool.Trim(Tool.StrSlice(t, '<span data-mapping-key="toPhone">', '</span>'))//收货人电话
        let seller_phone = Tool.Trim(Tool.StrSlice(t, '						 						 							 						 <li><span class="field-name">手机：</span>', '</li>'))//卖家手机
        let seller_telephone = Tool.Trim(Tool.StrSlice(t, '						 <li><span class="field-name">电话：</span>', '</li>'))//卖家电话
        let shopurl = Tool.Trim(Tool.StrSlice(t, ' <a data-tracelog="viewUserCompany" href="', '"'))//卖家店铺地址
        //////////////////////////////////
        let timeArr = Tool.regSplits(t, '<div class="stage-label stage-label-down">', '</div>')//时间数组“等待买家付款-----等待卖家发货-----等待买家确认收货-----交易成功”
        let ordertime = timeArr[0] ? Tool.gettime(timeArr[0]) : 0;//下单时间
        let paytime = timeArr[1] ? Tool.gettime(timeArr[1]) : 0;//付款时间
        let deliveryTime = timeArr[2] ? Tool.gettime(timeArr[2]) : 0;//发货时间
        let successTime = timeArr[3] ? Tool.gettime(timeArr[3]) : 0;//完成时间
        /////////////////////////////
        let logisticsNumber = Tool.StrSlice(t, '物流编号：</dt>\n                                <dd class="info-item-val">', '</dd>')//物流编号
        logisticsNumber = logisticsNumber ? Tool.Trim(logisticsNumber) : "";
        let logisticsCompany = Tool.StrSlice(t, '物流公司：</dt>\n									<dd class="info-item-val">', '</dd>')//物流公司
        logisticsCompany = logisticsCompany ? Tool.Trim(logisticsCompany) : "";
        let WaybillNumber = Tool.StrSlice(t, '运单号码：</dt>\n									<dd class="info-item-val">', '</dd>')//运单号码
        WaybillNumber = WaybillNumber ? Tool.Trim(WaybillNumber) : "";
        let items = this.b01(t);
        ////////////////////////////////
        let updateArr = [
            "@.alipay_orderid=" + Tool.rpsql(alipay_orderid),//支付宝交易号
            "@.consignee=" + Tool.rpsql(consignee),//收货人
            "@.delivery_address=" + Tool.rpsql(delivery_address),//收货地址
            "@.delivery_phone=" + Tool.rpsql(delivery_phone),//收货人手机
            "@.delivery_telephone=" + Tool.rpsql(delivery_telephone),//收货人电话
            "@.seller_phone=" + Tool.rpsql(seller_phone),//卖家手机
            "@.seller_telephone=" + Tool.rpsql(seller_telephone),//卖家电话
            "@.shopurl=" + Tool.rpsql(shopurl),//卖家店铺地址
            "@.logisticsNumber=" + Tool.rpsql(logisticsNumber),//卖家店铺地址
            "@.logisticsCompany=" + Tool.rpsql(logisticsCompany),//物流公司
            "@.WaybillNumber=" + Tool.rpsql(WaybillNumber),//物流公司
            "@.items=" + Tool.rpsql(JSON.stringify(items)),//物流公司
        ]
        if (ordertime != 0) {
            //当没有成交就没有这个。
            updateArr.push("@.ordertime=" + ordertime)//下单时间
            updateArr.push("@.paytime=" + paytime)//付款时间
            updateArr.push("@.deliveryTime=" + deliveryTime)//发货时间
            updateArr.push("@.successTime=" + successTime)//完成时间
        }
        this.d04(updateArr, orderid)
    },
    d04: function (updateArr, orderid) {
        let data = [];
        let update = "update @.table set " + updateArr.join(",") + "  where  @.orderid=" + orderid
        data.push({
            action: "sqlite",
            database: "1688/买家订单",
            sql: "select @.id from @.table where @.orderid=" + orderid,
            list: [{
                action: "sqlite",
                database: "1688/买家订单",
                sql: update,
            }],
        })
        Tool.ajax.a01(data, this.d05, this);
    },
    d05: function (t) {
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();