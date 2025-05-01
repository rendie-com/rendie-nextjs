'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.site           站点
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 订单 &gt; 发货预报 &gt; 更多 &gt; 获取包裹图片") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">获取站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        let where = "";
        let data = [{
            action: "sqlite",
            database: "shopee/订单/发货预报/" + obj.params.site,
            sql: "select " + Tool.fieldAs("order_id,package_number,region_id,shop_id") + " FROM @.table " + where +"order by @.arrange_shipment_time desc"+ Tool.limit(10, this.obj.A1),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/订单/发货预报/" + obj.params.site,
                sql: "select count(1) as count FROM @.table " + where,
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) {
            this.obj.A2 = Math.ceil(t[1][0].count / 10);
        }
        this.d01(t[0]);
    },
    ///////////////////////////////////////////////////////
    d01: function (arr) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, null, arr);
    },
    d02: function (t) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[obj.params.site][0].shopId,
            "cbsc_shop_region=" + obj.params.site,
        ]
        let url = "https://seller.shopee.cn/api/v3/order/get_images_for_order_list?" + arr.join("&");
        for (let i = 0; i < t.length; i++) {
            t[i].order_id = Tool.int(t[i].order_id)
        }
        $("#state").html("正在获取第" + this.obj.A1 + "页未绑定图片。。。");
        gg.postFetch(url, JSON.stringify({ orders: t }), this.d03, this)
    },
    d03: function (t) {
        if (t.code == 0) {
            this.d04(t.data)
        }
        else {
            Tool.pre(["出错", t])
        }
    },
    d04: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push({
                action: "sqlite",
                database: "shopee/订单/发货预报/" + obj.params.site,
                sql: "update @.table set @.images=" + Tool.rpsql(JSON.stringify(arr[i].images)) + "  where  @.order_id='" + arr[i].order_id + "' and @.package_number='" + arr[i].package_number + "'",
            })
        }
        Tool.ajax.a01(data, this.d05, this);
    },
    d05: function () {
        this.obj.A1++;
        this.a04();
    },
}
fun.a01();