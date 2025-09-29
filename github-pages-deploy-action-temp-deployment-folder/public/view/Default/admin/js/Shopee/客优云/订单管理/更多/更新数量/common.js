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
                case "订单状态":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "处理状态":
                    Aarr = this.b02()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "站点":
                    Aarr = this.b03()
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
                database: "shopee/客优云/订单管理",
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
            ], Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.statusDescription='" + arr[i] + "'");
            }
            return Aarr;
        },
        b02: function () {
            let Aarr = [], arr = [
                "未处理",
                "已处理",
                "已申请运单号"
            ];
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.kyyOrderStatusName='" + arr[i] + "'");
            }
            return Aarr;
        },
        b03: function () {
            let Aarr = [], arr = Tool.siteArr()
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.country='" + arr[i][0]+"'");
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
            let config = { "订单管理": {} }
            if (t[0][0].value) {
                config = JSON.parse(t[0][0].value);
                if (!config["订单管理"]) { config["订单管理"] = {}; }
            }
            config["订单管理"][oo.name] = oo.configSave;
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