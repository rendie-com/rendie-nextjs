var fun =
{
    a01: function () {
        let html = Tool.header(o.params.return, 'Shopee &gt; 商品 &gt; 平台关联 &gt; 更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w250">【敦煌手动审核状态】进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">【敦煌审核后本地状态】进度：</td>'+ Tool.htmlProgress('B') + '</tr>\
		        <tr><td class="right">【更新后违规类型】进度：</td>'+ Tool.htmlProgress('C') + '</tr>\
		        <tr><td class="right">【人工审核1688视频状态】进度：</td>'+ Tool.htmlProgress('D') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2">...</td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.configSave.a01("A", "敦煌手动审核状态", this.a03, this)
    },
    a03: function () {
        Tool.configSave.a01("B", "敦煌审核后本地状态", this.a04, this)
    },
    a04: function () {
        Tool.configSave.a01("C", "更新后违规类型", this.a05, this)
    },
    a05: function () {
        Tool.configSave.a01("D", "人工审核1688视频状态", this.a06, this)
    },
    a06: function () {
        $("#state").html("全部完成")
    },
}
fun.a01();
