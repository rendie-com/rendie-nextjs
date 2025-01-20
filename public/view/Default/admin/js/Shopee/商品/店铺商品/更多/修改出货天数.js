'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0,
        seller: {},
        day: 0,
    },
    a01: function () {
        //obj.params.return        返回URL
        //obj.params.site          站点
        let html = Tool.header(obj.params.return, "Shopee &gt; 商品列表 &gt; 店铺商品 &gt; 更多 &gt; 修改出货天数") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">修改站点：</td><td colspan="2">'+ Tool.site(obj.params.site) + '</td></tr>\
		    <tr><td class="right">出货天数：</td><td colspan="2">'+ this.b01() + '</td></tr>\
		    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html)
    },
    //////////////////////////////////////////////
    b01: function () {
        let str = '\
        <select onChange="fun.c01($(this),this.options[this.selectedIndex].value)" class="form-select">\
            <option value="">请选择出货天数</option>\
            <option value="2">2天</option>\
            <option value="4">4天</option>\
            <option value="7">7天</option>\
            <option value="10">10天</option>\
        </select>';
        return str;
    },
    ///////////////////////////////
    c01: function (This, day) {
        this.obj.day = day;
        This.attr("disabled", true);
        this.d01()
    },
    ////////////////////////////////////////
    d01: function () {
        $("#state").html("正在初始化。。。");
        Tool.login.a01(this.d02, this)
    },
    d02: function (t) {
        this.obj.seller = t;
        this.d03()
    },
    d03: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/商品/店铺商品/" + obj.params.site,
            sql: "select " + Tool.fieldAs("fromid") + " FROM @.table" + Tool.limit(10, this.obj.A1, "sqlite"),
        }]
        if (this.obj.A2 == 0) {
            data.push({
                action: "sqlite",
                database: "shopee/商品/店铺商品/" + obj.params.site,
                sql: "select count(1) as count FROM @.table",
            })
        }
        Tool.ajax.a01(data, this.d04, this);
    },
    d04: function (t) {
        if (this.obj.A2 == 0) { this.obj.A2 = Math.ceil(t[1][0].count / 10) }
        this.e01(t[0]);
    },
    ////////////////////////////////////////////////////
    e01: function (arr) {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.e02, this, null, arr)
    },
    e02: function (arr) {
        let data = [];
        for (let i = 0; i < arr.length; i++) {
            data.push({
                "id": arr[i].fromid,
                //"category_path": [100009, 100021],
                "pre_order": true,
                "days_to_ship": Tool.int(this.obj.day)
            })
        }
        this.e03(data)
    },
    e03: function (data) {
        let arr = [
            "version=3.1.0",
            "source=attribute_tool",
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller[obj.params.site].shopId,
            "cbsc_shop_region=" + obj.params.site
        ]
        let url = "https://seller.shopee.cn/api/v3/product/update_product/?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在设置第" + this.obj.A1 + "页商品。。。");
        gg.postFetch(url, JSON.stringify(data), this.e04, this);
    },
    e04: function (t) {
        if (t.message == "success" || t.message == "partial success" || t.message == "all failed") {
            this.e05();
        }
        else {
            Tool.pre(["出错", t]);
        }
    },
    e05: function () {
        this.obj.A1++;
        $("#state").html("正在进入第" + this.obj.A1 + "页。。。");
        Tool.Time("name", 0, this.d03, this);
    },
}
fun.a01();
