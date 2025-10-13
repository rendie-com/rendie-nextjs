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
        $("#tbody").html('\
        <tr><td class="right">活动进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr><td class="right">活动开始时间：</td><td id="timeA" colspan="2"></td></tr>\
        <tr><td class="right">活动结束时间：</td><td id="timeB" colspan="2"></td></tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        if (oo.seller[oo.site][oo.num - 1].isLock) {
            this.a03(oo);
        }
        else {
            Tool.common1.a01(oo.seller, oo.site, oo.num, "D", this.a03, this, oo)
        }
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        oo.next.apply(oo.This, [oo.t]);
    },
}