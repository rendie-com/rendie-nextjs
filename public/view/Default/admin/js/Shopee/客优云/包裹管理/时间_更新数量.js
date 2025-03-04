var fun =
{
    obj: {
        A1: 1, A2: 0,
        Aarr: [
            ["@.shipByDate>" + Tool.gettime("") + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24), "发货截止剩0-1天"],
            ["@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 1) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 2), "发货截止剩1-2天"],
            ["@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 2) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 5), "发货截止剩2-5天"],
            ["@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 5) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 10), "发货截止剩5-10天"],
            ["@.shipByDate>" + (Tool.gettime("") + 60 * 60 * 24 * 10) + " and @.shipByDate<" + (Tool.gettime("") + 60 * 60 * 24 * 20), "发货截止剩10-20天"],
            ["@.orderCancelDay>" + Tool.gettime("") + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 1), "订单取消剩0-1天"],
            ["@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 1) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 2), "订单取消剩1-2天"],
            ["@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 2) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 5), "订单取消剩2-5天"],
            ["@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 5) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 10), "订单取消剩5-10天"],
            ["@.orderCancelDay>" + (Tool.gettime("") + 60 * 60 * 24 * 10) + " and @.orderCancelDay<" + (Tool.gettime("") + 60 * 60 * 24 * 20), "订单取消剩10-20天"],
        ],
        A2arr: []//保存用的。
    },
    a01: function () {
        this.obj.A2 = this.obj.Aarr.length;
        let html = Tool.header(obj.params.return, 'Shopee &gt; 客优云 &gt; 包裹管理 &gt; 时间_更新数量') + '\
        <div class="p-2">\
            <table class="table table-hover">\
            <tbody>\
		        <tr><td class="right w150">状态进度：</td>'+ Tool.htmlProgress('A') + '</tr>\
		        <tr><td class="right">提示：</td><td id="state" colspan="2"></td></tr></tbody>\
            </table>\
        </div>'
        Tool.html(this.a02, this, html);
    },
    a02: function () {
        Tool.x1x2("A", this.obj.A1, this.obj.A2, this.a03, this, this.a05);
    },
    a03: function () {
        let data = [{
            action: "sqlite",
            database: "shopee/客优云/包裹管理",
            sql: "select count(1) as count FROM @.table where " + this.obj.Aarr[this.obj.A1 - 1][0],
        }]
        $("#state").html("正在统计数量");
        Tool.ajax.a01(data, this.a04, this);
    },
    a04: function (t) {
        this.obj.A2arr.push(t[0][0].count);
        $("#A2").html(this.obj.A1 + '/' + this.obj.A2 + '（完）');
        this.obj.A1++;
        this.a02();
    },
    a05: function () {
        config.time = this.obj.A2arr;
        let data = [{
            action: "fs",
            fun: "writeFile",
            path: "public/" + o.path + "admin/js/Shopee/客优云/包裹管理/config.js",
            data: "let config=" + JSON.stringify(config, null, 2),
        }]
        Tool.ajax.a01(data, this.a06, this);
    },
    a06: function (t) {
        if (t[0] == "写入成功") {
            this.obj.A2 = 0;
            this.obj.A2arr = []
            $("#state").html("全部完成。");
        }
        else { Tool.pre(["出错", t]); }
    },
}
fun.a01();