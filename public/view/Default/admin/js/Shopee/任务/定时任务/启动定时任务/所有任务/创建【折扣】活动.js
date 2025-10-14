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
        <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
        <tr><td class="right">活动开始时间：</td><td id="timeA" colspan="2"></td></tr>\
        <tr><td class="right">活动结束时间：</td><td id="timeB" colspan="2"></td></tr>\
        <tr><td class="right">活动说明：</td><td colspan="2">\
            （1）3天一个活动。<hr/>\
            （2）活动时间可以重叠，但同一时间商品不能重复。<hr/>\
            （3）每个商品都有自己的折扣。（即：指定折扣）<hr/>\
            （4）在指定折扣且包邮门槛下，利润达到10%的商品。（就是“能打折”的商品）<hr/>\
            （5）设置折扣为： 指定折扣 - 6。（例如：指定折扣50，那现在是44。为什么要减6？答：报名商品活动时shopee要求的。）<hr/>\
        </td></tr>\
        <tr><td class="right">准备商品：</td><td colspan="2"><textarea rows="10" class="form-control" disabled="" id="product" ></textarea></td></tr>\
        <tr><td class="right">提交商品：</td><td colspan="2"><textarea rows="10" class="form-control" disabled="" id="discount_model_list" ></textarea></td></tr>');
        this.a02(oo);
    },
    a02: function (oo) {
        if (oo.seller[oo.site][oo.num - 1].isLock) {
            this.a03(oo);
        }
        else {
            Tool.common1.a01(oo.seller, oo.site, oo.num, 'D', this.a03, this, oo);
        }
    },
    a03: function (oo) {
        $("#D1").css("width", "0%");
        $("#D1,#D2").html("");
        oo.next.apply(oo.This, [oo.t]);
    },
}