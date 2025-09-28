'use strict';
var fun =
{
    a01: function () {
        //o.params.return         返回URL
        //o.params.site           站点
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 营销工具 &gt; 创建【店内秒杀】") + '\
        <div class="p-2">\
            <table class="table table-hover">\
                <tbody>\
                    <tr><td class="w150 right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
                    <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr>\
                    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
                    <tr><td class="right">活动进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
                    <tr><td class="right">活动开始时间：</td><td id="timeA" colspan="2"></td></tr>\
                    <tr><td class="right">活动结束时间：</td><td id="timeB" colspan="2"></td></tr>\
                    <tr><td class="right">商品ID：</td><td id="ids" colspan="2"></td></tr>\
                    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (seller) {
        Tool.createFlashSale.a01(seller, o.params.site, o.params.num, this.a04, this)
    },
    a04: function () {
        $("#state").html("全部完成");
    },
}
fun.a01();