'use strict';
Object.assign(Tool, {
    configSave: {
        a01: function (progress, name, next, This, t) {
            let oo = {
                progress: progress,
                Aarr: [],
                name: name,//保存用的 
                next: next,
                This: This,
                t: t,
                /////////////////////////////
                configSave: [],//保存用的   
                A1: 1,
                A2: 0,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let Aarr = []
            switch (oo.name) {
                case "包裹状态":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "时间":
                    Aarr = this.b02()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                default: Tool.at("没有开发：" + oo.name); break;
            }
        },
        a03: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.d01, oo);
        },
        a04: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/包裹管理",
                sql: "select count(1) as count from @.table where " + oo.Aarr[oo.A1 - 1],
            }]
            $("#state").html("正在统计数量");
            Tool.ajax.a01(data, this.a05, this, oo);
        },
        a05: function (t, oo) {
            oo.configSave.push(t[0][0].count);
            oo.A1++;
            this.a03(oo);
        },
        //////////////////////////
        b01: function () {
            let arr = [
                "待收货",
                "可打包",
                "待出库",
                "已出库",
                "已入平台仓库",
                "已搁置",
                "申请搁置",
                "已关闭",
                "已完成",
            ], Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.statusName='" + arr[i] + "'");
            }
            return Aarr;
        },
        b02: function () {
            let Aarr = [], arr = [
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
            ];
            for (let i = 0; i < arr.length; i++) {
                Aarr.push(arr[i][0]);
            }
            return Aarr;
        },
        //////////////////////////////////////////////
        d01: function (oo) {
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "select @.value as value FROM @.config where @.name='" + o.params.template + "'",
            }]
            Tool.ajax.a01(data, this.d02, this, oo);
        },
        d02: function (t, oo) {
            let config = { "包裹管理": {} }
            if (t[0][0].value) {
                config = JSON.parse(t[0][0].value);
                if (!config["包裹管理"]) { config["包裹管理"] = {}; }
            }
            config["包裹管理"][oo.name] = oo.configSave;
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "update @.config set @.value=" + Tool.rpsql(JSON.stringify(config)) + " where  @.name='" + o.params.template + "'",
            }]
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            oo.next.apply(oo.This, [oo.t]);
        },
    }
})