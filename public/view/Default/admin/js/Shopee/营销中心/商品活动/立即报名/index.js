'use strict';
var fun =
{
    a01: function () {
        //o.params.return             返回URL
        //o.params.site               站点
        let html = Tool.header(o.params.return, "Shopee &gt; 营销中心 &gt; 我的活动 &gt; 立即报名") + '\
        <div class="p-2">\
            <table class="table table-hover align-middle">\
                <tbody>\
                    <tr>\
                        <td class="right">说明：</td>\
                        <td colspan="2">\
                            (1)只要报名成功，商品将：不能下架，不能删除，不能改价，部分可以修改，只能等活动结束，才有所有权。<br/>\
                            (2)单次报名活动最多选200个商品，可以通个多次提交报名10000个商品。\
                        </td>\
                    </tr>\
                    <tr><td class="w200 right">站点：</td><td colspan="2">'+ Tool.site(o.params.site) + '</td></tr>\
                    <tr><td class="right">账号：</td><td id="username" colspan="2"></td></tr>\
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
                    <tr><td class="right">修改商品ID：</td><td id="item_id" colspan="2"></td></tr>\
                    <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr>\
                </tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this)
    },
    a03: function (seller) {
        Tool.common1.a01(seller, o.params.site, o.params.num, this.a04, this)
    },
    a04: function () {
        $("#state").html("全部完成");
    },
}
fun.a01();