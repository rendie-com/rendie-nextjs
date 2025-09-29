'use strict';
var fun =
{
    obj: {
        A1: 1, A2: 0,
        seller: [],
    },
    a01: function () {
        let html = Tool.header(o.params.return, "Shopee &gt; 商品 &gt; 全球商品 &gt; 更新前本地状态_更新商品") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle mb-0">\
                <tbody>\
                <tr><td class="w170 right">账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">更新条件：</td><td id="where" colspan="2"></td></tr>\
                <tr><td class="right">商品进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr>\
                    <td class="right">成本定价：</td>\
                    <td colspan="2">\
                        <b>全球商品价格 = 1688商品最高的那一个原价（统一的价格）</b><hr/> \
                        注：<br/>\
                        （1）如果【全球商品】价格那里显示的是“USD”，也没关系，实际是当做“人民币”来结算的。<br/>\
                        （2）实际定价在“发布到各个站点”时再定价。\
                    </td></tr>\
                <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
               </tbody>\
               <tbody id="tbody"></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (seller) {
        this.obj.seller = seller;
        this.a04();
    },
    a04: function () {
        //获取商品信息（返回shopee信息和1688信息）
        Tool.common1.a01(this.obj.A2, this.obj.seller, this.a05, this);
    },
    a05: function (obj) {
        //2.拼装提交对象
        obj.shopee.A1 = this.obj.A1;
        Tool.common2.a01(obj, this.obj.seller, this.a06, this);
    },
    a06: function (obj) {
        //给post增加几个属性【name】【unitweight】【images】【descriptionArr】
        Tool.common3.a01(obj, this.obj.seller, this.a07, this);
    },
    a07: function (obj) {
        Tool.common4.a01(obj, this.obj.seller, this.a08, this);
    },
    a08: function (obj) {
        Tool.common5.a01(obj, this.obj.seller, this.a09, this);
    },
    a09: function () {
        this.a04();
    },
}
fun.a01();