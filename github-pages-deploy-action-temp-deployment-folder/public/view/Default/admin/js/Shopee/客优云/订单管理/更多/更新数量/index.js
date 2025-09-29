var fun =
{

    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 客优云 &gt; 订单管理 &gt; 更多 &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w200">【订单状态】进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">【处理状态】进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">【站点】进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.configSave.a01("A", "订单状态", this.a03, this);
    },
    a03: function () {
        Tool.configSave.a01("B", "处理状态", this.a04, this);
    },
    a04: function () {
        Tool.configSave.a01("C", "站点", this.a05, this)
    },
    a05: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();
