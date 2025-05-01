'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: 0, Aarr: [],
        B1: 1, B2: 4,
        seller: {},
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 商家设置 &gt; 合作伙伴管理 &gt; 获取店铺授权信息") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class="right">app进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">状态进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		    <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
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
        let arr = [
            "SPC_CDS=" + t.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + t["mx"][0].shopId,
            "cbsc_shop_region=mx",
            "page_size=10",
            "page_no=1",
        ]
        let url = "https://seller.shopee.cn/api/selleraccount/merchant/partner/list/?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在获取【app进度】。")
        gg.getFetch(url, "json", this.a04, this);
    },
    a04: function (t) {
        this.obj.Aarr = t.data.app_list;
        this.obj.A2 = t.data.app_list.length;
        this.d01()
    },
    ////////////////////////////////////////////////////////////////////
    d01: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.d02, this, this.f02);
    },
    d02: function () {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "partner_id=" + this.obj.Aarr[this.obj.A1 - 1].partner_id,
            "cnsc_shop_id=" + this.obj.seller["mx"][0].shopId,
            "cbsc_shop_region=mx"
        ]
        let url = 'https://seller.shopee.cn/api/selleraccount/merchant/partner/info/?' + arr.join("&");
        $("#state").html("正在获取【商家授权】。")
        gg.getFetch(url, "json", this.d03, this);
    },
    d03: function (t) {
        this.obj.Aarr[this.obj.A1 - 1].info = t.data;
        this.e01();
    },
    ////////////////////////////////////////////////////////////////////
    e01: function () {
        Tool.x1x2("B", this.obj.B1, this.obj.B2, this.e02, this, this.f01);
    },
    e02: function () {
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "partner_id=" + this.obj.Aarr[this.obj.A1 - 1].partner_id,
            "page_no=1",
            "page_size=50",
            "status=" + (this.obj.B1 - 1),
            "cnsc_shop_id=" + this.obj.seller["mx"][0].shopId,
            "cbsc_shop_region=mx"
        ];
        let url = 'https://seller.shopee.cn/api/selleraccount/merchant/partner/shops/?' + arr.join("&");
        $("#state").html("正在获取【状态进度】。")
        gg.getFetch(url, "json", this.e03, this);
    },
    e03: function (t) {
        if (t.data.shop_list) {
            if (!this.obj.Aarr[this.obj.A1 - 1].shop_list) { this.obj.Aarr[this.obj.A1 - 1].shop_list = []; }
            this.obj.Aarr[this.obj.A1 - 1].shop_list.push(t.data.shop_list);
            this.e04();
        }
        else {
            Tool.at("获取授权信息失败。");
        }
    },
    e04: function (t) {
        this.obj.B1++;
        this.e01();
    },
    //////////////////////////////////////////////////////
    f01: function () {
        this.obj.B1 = 1;
        this.obj.A1++;
        this.d01();
    },
    f02: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/卖家账户",
            sql: "update @.table set @.app_list=" + Tool.rpsql(JSON.stringify(this.obj.Aarr)) + " where @.isDefault=1",
        }]
        Tool.ajax.a01(data, this.f03, this);
    },
    f03: function () {
        $("#state").html("全部完成。");
    },
}
fun.a01();