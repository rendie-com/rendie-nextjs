'use strict';
var task = {
    a01: function (seller, site, num, next, This, t) {
        let oo = {
            seller: seller,
            site: site,
            num: num,
            next: next,
            This: This,
            t: t
        }
        $("#tbody").html('<tr><td class="right">优惠券页进度：</td>' + Tool.htmlProgress('D') + '</tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.voucher_list.a01(oo.seller, oo.site, oo.num, "D", this.a03, this, oo)
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        oo.next.apply(oo.This, [oo.t]);
    },
}