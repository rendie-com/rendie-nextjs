'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
    },
    a01: function () {
        //obj.params.return        返回URL
        //obj.params.site          站点
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多 &gt; 获取【店铺商品】详情信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">获取站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品条进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">更新字段：</td><td id="updateFields" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04()
    },
    a04: function () {
        $("#state").html("正在初始化。。。");
        let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + obj.params.site,
            sql: "select " + Tool.fieldAs("fromid") + " FROM @.table" + Tool.limit(1, this.obj.A1, "sqlite"),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + obj.params.site,
                sql: "select count(1) as total FROM @.table",
            })
        }
        Tool.ajax.a01(data, this.a05, this);
    },
    a05: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = t[1][0].total; }
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d01, this, null, t[0])
    },
    //////////////////////////////////////////////////
    d01: function (t) {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "product_id=" + t[0].fromid,
            "is_draft=false",
            "cnsc_shop_id=" + this.obj.seller[obj.params.site].shopId,
            "cbsc_shop_region=" + obj.params.site
        ]
        let url = "https://seller.shopee.cn/api/v3/product/get_product_info?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取第" + this.obj.A1 + "页商品。。。");
        gg.getFetch(url, "json", this.d02, this);
    },
    d02: function (oo) {
        if (oo.msg == "success") {
            this.d03(oo.data.product_info)
        }
        else {
            Tool.pre(["出错001", oo])
        }
    },
    d03: function (products) {
        $("#updateFields").html("@.MinimumOrder==最小起订量")
        let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + obj.params.site,
            sql: "update @.table set @.MinimumOrder=" + products.min_purchase_limit + " where @.fromid=" + products.id,
        }]
        $("#state").html("正在更新本地商品状态。。。");
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        this.obj.A1++;
        $("#state").html("正在进入第" + this.obj.A1 + "页。。。");
        Tool.Time("name", 0, this.a04, this);
    },
}
fun.a01();