var fun =
{
    obj: {
        A1: 1, A2: Tool.siteArr().length,
        Aarr: Tool.siteArr()
    },
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 订单 &gt; 订单管理 &gt; 更多_all &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w200">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">【时间】进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">【状态】进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
		        <tr><td class="right">【采购状态】进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a03, this, this.a07);
    },
    a03: function () {
        Tool.configSave.a01("B", "时间", this.obj.Aarr[this.obj.A1 - 1][0], this.a04, this);
    },
    a04: function () {
        Tool.configSave.a01("C", "状态", this.obj.Aarr[this.obj.A1 - 1][0], this.a05, this)
    },
    a05: function () {
        Tool.configSave.a01("D", "采购状态", this.obj.Aarr[this.obj.A1 - 1][0], this.a06, this)
    },
    a06: function () {
        this.obj.A1++;
        this.a02();
    },
    a07: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();
