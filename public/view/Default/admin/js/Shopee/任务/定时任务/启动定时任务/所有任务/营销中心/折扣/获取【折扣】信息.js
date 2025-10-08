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
            <tr><td class="right">活动进度：</td>' + Tool.htmlProgress('D') + '</tr>\
            <tr><td class="right">获取范围：</td><td colspan="2" id="endTime"></td></tr>\
            <tr><td class="right">折扣页进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
        ');
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.get_discount_list.a01(oo.seller, oo.site, oo.num, ["D", "E"], this.b01(3), this.a03, this, oo)
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        oo.next.apply(oo.This, [oo.t]);
    },
    ///////////////////////////////////////////////////
    b01: function (day) {
        let numDay = Tool.int(day), endTime = 0;
        if (numDay) {
            endTime = Tool.gettime("") - 60 * 60 * 24 * numDay;
            $("#endTime").html("当【已过期】活动结束时间小于【" + Tool.js_date_time2(endTime, "-") + "】，则不再翻页。")
        }
        else {
            $("#endTime").html("获取所有【已过期】活动。")
        }
        return endTime;
    },
}