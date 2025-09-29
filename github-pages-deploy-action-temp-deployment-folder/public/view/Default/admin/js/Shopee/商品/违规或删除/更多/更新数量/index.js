var fun =
{
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 商品 &gt; 违规或删除 &gt; 更多 &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w150">【状态】进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">【违规类型】进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2">...</td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.configSave.a01("A", "状态", this.a03, this)
    },
    a03: function () {
        Tool.configSave.a01("B", "违规类型", this.a04, this)
    },
    a04: function () {      
        $("#state").html("全部完成")
    },
}
fun.a01();
