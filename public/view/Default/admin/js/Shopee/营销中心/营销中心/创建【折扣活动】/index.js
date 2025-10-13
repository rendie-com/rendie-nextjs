'use strict';
var fun =
{
    a01: function () {
        //o.params.jsFile         选择JS文件        
        //o.params.site           站点
        //o.params.return         返回URL
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 营销工具 &gt; 创建【折扣活动】(活动一次2天，准备10天的活动)") + '\
        <div class="p-2">\
            <table class="table table-hover">\
                <tbody>\
                    <tr><td class="w150 right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
                    <tr><td class="right">第几个店铺：</td><td colspan="2">'+ o.params.num + '</td></tr>\
                    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
                    <tr><td class="right">时间段进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
                    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
                    <tr><td class="right">活动开始时间：</td><td id="timeA" colspan="2"></td></tr>\
                    <tr><td class="right">活动结束时间：</td><td id="timeB" colspan="2"></td></tr>\
                    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        //说明：一个活动，最多可以添加1000个商品。我每个活动50个商品，不影响速度。
        Tool.html(this.a02, this, html);
    },
    a02: function (t) {
        Tool.login.a01(this.a03, this)
    },
    a03: function (seller) {
        Tool.create_discount.a01(seller, o.params.site, o.params.num, this.a04, this)
    },
    a04: function () {
        $("#state").html("全部完成");
    },
}
fun.a01();