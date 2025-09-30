var fun =
{
    obj: {
        A1: 1, A2: Tool.siteArr().length,
        Aarr: Tool.siteArr()
    },
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 商品 &gt; 店铺商品 &gt; 更多_all &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w200">站点进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">【标题】进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">【定价】进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
		        <tr><td class="right">【活动】进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
		        <tr><td class="right">【最低购买量】进度：</td>'+ Tool.htmlProgress('E') + '</tr>\
		        <tr><td class="right">【单位重量】进度：</td>'+ Tool.htmlProgress('F') + '</tr>\
		        <tr><td class="right">【状态】进度：</td>'+ Tool.htmlProgress('G') + '</tr>\
		        <tr><td class="right">【商品异常类型】进度：</td>'+ Tool.htmlProgress('H') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a03, this, this.d01);
    },
    a03: function () {
        Tool.configSave.a01("B", "标题", this.obj.Aarr[this.obj.A1 - 1][0], this.a04, this)
    },
    a04: function () {
        Tool.configSave.a01("C", "定价", this.obj.Aarr[this.obj.A1 - 1][0], this.a05, this)
    },
    a05: function () {
        Tool.configSave.a01("D", "活动", this.obj.Aarr[this.obj.A1 - 1][0], this.a06, this)
    },
    a06: function () {
        Tool.configSave.a01("E", "最低购买量", this.obj.Aarr[this.obj.A1 - 1][0], this.a07, this)
    },
    a07: function () {
        Tool.configSave.a01("F", "单位重量", this.obj.Aarr[this.obj.A1 - 1][0], this.a08, this)
    },
    a08: function () {
        Tool.configSave.a01("G", "状态", this.obj.Aarr[this.obj.A1 - 1][0], this.a09, this)
    },
    a09: function () {
        Tool.configSave.a01("H", "商品异常类型", this.obj.Aarr[this.obj.A1 - 1][0], this.a10, this)
    },
    a10: function () {
        this.obj.A1++;
        this.a02();
    },
    /////////////////////////////
    d01: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();
