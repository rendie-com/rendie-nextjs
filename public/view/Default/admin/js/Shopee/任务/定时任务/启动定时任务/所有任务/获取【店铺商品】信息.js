'use strict';
var task = {
    a01: function (seller, site, num, next, This, t) {
        let oo = {
            seller: seller,
            site: site,
            num: num,
            next: next,
            This: This,
            t: t,
            siteNum: Tool.siteNum(site, num),
        }
        $("#tbody").html('\
        <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
        <tr><td class="right">更新字段：</td><td id="updateFields" colspan="2"></td></tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.get_product_list.a01(oo.seller, oo.site, oo.num, "D", this.a03, this, oo)
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        Tool.apply(oo.t, oo.next, oo.This)
    },
}