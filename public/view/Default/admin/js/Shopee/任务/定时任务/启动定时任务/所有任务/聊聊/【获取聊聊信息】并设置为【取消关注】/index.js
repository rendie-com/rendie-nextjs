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
            /////////////////////////////////////////////
            siteNum: Tool.siteNum(site, num),
        }
        $("#tbody").html('\
        <tr class="table-light"><td colspan="3"><b>获取聊聊信息</b></td></tr>\
        <tr><td class="right">聊聊进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr class="table-light"><td colspan="3"><b>设置为【取消关注】</b></td></tr>\
        <tr><td class="right">设置进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
        ')
        this.a02(oo);
    },
    a02: function (oo) {
        //获取聊聊信息
        Tool.common1.a01("D", oo.seller, this.a03, this, oo)
    },
    a03: function (oo) {
        Tool.common2.a01("E", oo.siteNum, this.a04, this, oo)
    },
    a04: function (oo) {
        oo.next.apply(oo.This, [oo.t])
    },
}