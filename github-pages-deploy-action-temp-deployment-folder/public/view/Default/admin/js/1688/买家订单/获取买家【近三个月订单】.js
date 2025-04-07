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
        let html = Tool.header(obj.params.return, "1688 &gt; 买家订单 &gt; 获取买家【近三个月订单】") + '\
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
        let url = "https://trade.1688.com/order/buyer_order_list.htm?spm=a360q.8274423.0.0.47164c9anZ0dmv&scene_type=&source=&purchase_company_name=null&product_name=&start_date=&end_date=&seller_login_id=&trade_status=&trade_type_search=&biz_type_search=&order_id_search=&is_his=&is_hidden_canceled_offer=&apt=&related_code=&order_settle_flag=&company_name=&keywords=&receiver_tel=&receiver_name=&buyer_name=&down_stream_order_id=&batch_number=&total_fee=&page=" + this.obj.A1 + "&page_size=10"
        $("#url").html(url);
        gg.getFetch(url, "gbk", this.a04, this)
    },
    a04: function (t) {
        if (this.obj.A2 == 0) {
            let A2 = Tool.StrSlice(t, '<span class="pages-total">', '</span>')
            this.obj.A2 = Tool.int(A2)
        }
        this.d01(t)
    },
    /////////////////////////////////////
    b01: function (val, k) {
        if (typeof (val) == "string") {
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
    d01: function (t) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null, t);
    },
    d02: function (t) {
        let liArr = Tool.StrSplits(t, 'data-is-plus-order="false">', '</li>');
        let arr = [];
        for (let i = 0; i < liArr.length; i++) {
            let shippingFee = Tool.StrSlice(liArr[i], '<div class="fare" title="运费', '">')
            let total = Tool.StrSlice(liArr[i], '<div class="total" data-role="buyer" title="', '"')
            let original = Tool.StrSlice(liArr[i], 'class="sum-payment-original text-lesser" title="', '"')
            let status = Tool.StrSlice(liArr[i], '<td class="s7">', '</div>').split(">")[1]
            arr.push({
                orderid: Tool.StrSlice(liArr[i], ' <order-comment data-orderid="', '"'),//订单号
                ordertime: Tool.gettime(Tool.StrSlice(liArr[i], '<span class="date">', '</span>')),//下单时间
                corp: Tool.StrSlice(liArr[i], '<a class="bannerCorp" data-copytitle="', '"'),//公司
                seller_login_id: Tool.StrSlice(liArr[i], 'class="bannerMember" data-copytitle="', '"'),//卖家ID
                buyer_login_id: Tool.StrSlice(liArr[i], '<span class="text-aux">', '</span>'),//买家ID
                shippingFee: shippingFee ? shippingFee : 0,//运费
                total: total,//实际付款
                original: original ? original : total,//合计后原价
                status: status,//合计后原价
            })
        }
        this.d03(arr)
    },
    d03: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            let arrL = [], arrR = [], updateArr = []
            for (let k in arr[i]) {
                arrL.push("@." + k);
                arr[i][k] = this.b01(arr[i][k], k)
                arrR.push(arr[i][k]);
                if (k != "orderid") {
                    updateArr.push("@." + k + "=" + arr[i][k]);
                }
            }
            /////////////////////////////////////////////////////////////////
            let update = "update @.table set " + updateArr.join(",") + "  where  @.orderid=" + arr[i].orderid
            let insert = "insert into @.table(" + arrL.join(",") + ")values(" + arrR.join(",") + ")";
            data.push({
                action: "sqlite",
                database: "1688/买家订单",
                sql: "select @.id from @.table where @.orderid=" + arr[i].orderid,
                list: [{
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: update,
                }],
                elselist: [{
                    action: "sqlite",
                    database: "1688/买家订单",
                    sql: insert,
                }]
            })
        }
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        this.obj.A1++;
        this.a03();
    },
}
fun.a01();