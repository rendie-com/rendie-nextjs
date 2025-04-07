'use strict';
var fun =
{
    obj:
    {
        seller: {},
    },
    a01: function () {
        //obj.params.jsFile         选择JS文件       
        //obj.params.return         返回URL  
        //obj.params.partner_id     返回URL  
        let html = Tool.header(obj.params.return, "Shopee &gt; 商家设置 &gt; 合作伙伴管理 &gt; 取消连接") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
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
        ]
        let url = "https://seller.shopee.cn/api/selleraccount/merchant/partner/deauth/?" + arr.join("&")
        $("#url").html('<a href="' + url + '" target="_blank">' + url + '</a>');
        $("#state").html("正在【取消连接】。");
        let data = { "partner_id": Tool.int(obj.params.partner_id) }
        gg.postFetch(url, JSON.stringify(data), this.d01, this)
    },
    ////////////////////////////////////////////////////
    d01: function (t) {
        let data = [{
            action: "sqlite",
            database: "shopee/卖家账户",
            sql: "select " + Tool.fieldAs("app_list") + " FROM @.table where @.isDefault=1 limit 1"
        }];
        Tool.ajax.a01(data, this.d02, this);
    },
    d02: function (t) {
        let app_list = JSON.parse(t[0][0].app_list);
        let shop_list = [];
        for (let i = 0; i < app_list.length; i++) {
            if ("" + app_list[i].partner_id == obj.params.partner_id) {
                shop_list = app_list[i].shop_list[0]; break;
            }
        }
        this.d03(shop_list)
    },
    d03: function (shop_list) {
        let shop_id_list = [];
        for (let i = 0; i < shop_list.length; i++) {
            shop_id_list.push(shop_list[i].shop_id);
        }
        let arr = [
            "SPC_CDS=" + this.obj.seller.SPC_CDS,
            "SPC_CDS_VER=2",
            "cnsc_shop_id=" + this.obj.seller["mx"][0].shopId,
            "cbsc_shop_region=mx",
        ]
        let url = "https://seller.shopee.cn/api/selleraccount/shop/partner/deauth/?" + arr.join("&")
        let data = { "partner_id": Tool.int(obj.params.partner_id), "shop_id_list": shop_id_list }
        gg.postFetch(url, JSON.stringify(data), this.d04, this);
    },
    d04: function (t) {
        $("#state").html("全部完成。");
    },
}
fun.a01();