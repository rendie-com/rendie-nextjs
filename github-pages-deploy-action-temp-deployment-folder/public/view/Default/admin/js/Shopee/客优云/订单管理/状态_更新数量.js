var fun =
{
    obj: {
        A1: 1, A2: 0,
        Aarr: [
            "未付款",
            "待发货",
            "待重新发货",
            "已发货",
            "申请取消",
            "已取消",
            "申请退款",
            "确认收货",
            "已完成",
            "失败",
            "退货运回",
        ],
        A2arr: []//保存用的。
    },
    a01: function () {
        this.obj.A2 = this.obj.Aarr.length;
        let html = Tool.header(obj.params.return, 'Shopee &gt; 客优云 &gt; 订单管理 &gt; 状态_更新数量') + '\
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
            database: "shopee/客优云/订单管理",
            sql: "select count(1) as count FROM @.table where @.statusDescription='" + this.obj.Aarr[this.obj.A1 - 1] + "'",
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
        config.statusDescription = this.obj.A2arr;
        let data = [{
            action: "fs",
            fun: "writeFile",
            path: "public/" + o.path + "admin/js/Shopee/客优云/订单管理/config.js",
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