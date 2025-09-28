'use strict';
var fun =
{
    obj:
    {
        A1: 1, A2: Tool.siteArr().length, Aarr: Tool.siteArr(),
        seller: {},
    },
    a01: function () {
        //o.params.jsFile         选择JS文件       
        //o.params.site           站点
        //o.params.return         返回URL  
        let html = Tool.header(o.params.return, "Shopee &gt; 订单 &gt; 发货预报 &gt; 更多 &gt; 开始绑定发货预报") + '\
        <div class="p-2">\
          <table class="table table-hover align-middle mb-0">\
          <tbody>\
		    <tr><td class="w150 right">账号：</td><td id="username" colspan="2"></td></tr>\
		    <tr><td class=" right">获取站点：</td><td colspan="2" id="site"></td></tr>\
		    <tr><td class="right">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		    <tr><td class="right">商品页进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		    <tr><td class="right">订单编号：</td><td id="order_sn" colspan="2"></td></tr>\
		    <tr><td class="right">1688订单号：</td><td id="_1688_orderid" colspan="2"></td></tr>\
		    <tr><td class="right">1688运单号码：</td><td id="_1688_WaybillNumber" colspan="2"></td></tr>\
		    <tr><td class="right">1688物流公司：</td><td id="_1688_logisticsCompany" colspan="2"></td></tr>\
		    <tr><td class="right">1688物流状态：</td><td id="_1688_logisticsStatus" colspan="2"></td></tr>\
		    <tr><td class="right">状态：</td><td id="state" colspan="2"></td></tr>\
          </tbody>\
          </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.login.a01(this.a03, this);
    },
    a03: function (t) {
        this.obj.seller = t;
        this.a04();
    },
    a04: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a05, this, this.d01);
    },
    a05: function () {
        let Aarr = this.obj.Aarr[this.obj.A1 - 1]
        $("#site").html(Aarr[1] + "（" + Aarr[0] + "）")
        let site = Aarr[0], num = parseFloat(Aarr[0].substring(Aarr[0].length - 1))
        if (isNaN(num)) { num = 1; } else { site = Aarr[0].substring(0, Aarr[0].length - 1) }
        Tool.common.a01("B", this.obj.seller, site, num, Aarr[0], this.a06, this);
    },
    a06: function () {
        this.obj.A1++;
        this.a04()
    },
    d01: function () {
        $("#state").html("全部完成。")
    },
}
fun.a01();



