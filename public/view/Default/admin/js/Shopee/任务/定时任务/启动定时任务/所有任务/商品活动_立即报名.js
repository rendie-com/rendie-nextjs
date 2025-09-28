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
            <tr><td class="right">活动类型：</td><td id="campaign_scene" colspan="2"></td></tr>\
            <tr><td class="right">活动进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
            <tr><td class="right">活动名称：</td><td id="name" colspan="2"></td></tr>\
            <tr><td class="right">活动介绍：</td><td id="description" colspan="2" class="p-0"></td></tr>\
            <tr><td class="right">活动时间：</td><td id="time" colspan="2"></td></tr>\
            <tr><td class="right">报名情况：</td><td id="RegistrationStatus" colspan="2"></td></tr>\
            <tr><td class="right">子活动进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
            <tr><td class="right">子活动名称：</td><td id="name2" colspan="2"></td></tr>\
            <tr><td class="right">子活动介绍：</td><td id="description2" colspan="2" class="p-0"></td></tr>\
            <tr><td class="right">子活动活动报名时间：</td><td id="nomination_time" colspan="2"></td></tr>\
            <tr><td class="right">子活动活动进行时间：</td><td id="session_time" colspan="2"></td></tr>\
            <tr><td class="right">修改折扣进度：</td>'+ Tool.htmlProgress('F') + '</tr>\
            <tr><td class="right">修改商品ID：</td><td id="item_id" colspan="2"></td></tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        Tool.common1.a01(oo.seller, oo.site, oo.num, this.a03, this, oo)
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        oo.next.apply(oo.This, [oo.t]);
    },
}