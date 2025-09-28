var fun =
{

    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 客优云 &gt; 订单管理 &gt; 更多 &gt; 同步缺失订单') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
                <tr><td class="w150 right">说明：</td>\
                <td colspan="2">\
                (1)同步【1688 > 买家订单】前100条对应的shopee订单，在【客优云】没有的订单。<hr/>\
                (2)客优云最多只能获取15天内的数据。<hr/>\
                (3)执行【代打包】操作。（@.kyyOrderStatusName=\'已申请运单号\'）\
                </td></tr>\
                <tr><td class="right">客优云账号：</td><td id="username" colspan="2"></td></tr>\
                <tr><td class="right">获取订单页进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
                <tr><td class="right">开始时间：</td><td id="beginDateTime" colspan="2"></td></tr>\
                <tr><td class="right">结束时间：</td><td id="endDateTime" colspan="2"></td></tr>\
                <tr><td class="right">代打包条进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
                <tr><td class="right">订单号：</td><td id="ordersn" colspan="2"></td></tr>\
                <tr><td class="right">访问地址：</td><td id="url" colspan="2"></td></tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        $("#state").html("1.同步缺失订单")
        Tool.common1.a01(this.a03, this);
    },
    a03: function () {
        Tool.common2.a01("A", this.a04, this);
    },
    a04: function () {
        Tool.common3.a01("B", this.a05, this)
    },
    a05: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();
