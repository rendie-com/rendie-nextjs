'use strict';
Object.assign(Tool, {
    configSave: {
        a01: function (progress, name, site, next, This, t) {
            let oo = {
                progress: progress,
                Aarr: [],
                name: name,//保存用的 
                site: site,//站点
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
                case "时间":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "状态":
                    Aarr = this.b02()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "采购状态":
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
                database: "shopee/订单/订单管理/" + oo.site,
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
            let arr = Tool.timeArr, Aarr = [];
            for (let i = 0; i < arr.length; i++) {
                let where = "";
                switch (arr[i][0]) {
                    case "1": where = "@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24); break;
                    case "2": where = "@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24 * 2); break;
                    case "3": where = "@.auto_cancel_arrange_ship_date>" + Tool.gettime("") + " and @.auto_cancel_arrange_ship_date<" + (Tool.gettime("") + 60 * 60 * 24 * 3); break;
                    case "4": where = "@.auto_cancel_arrange_ship_date>" + Tool.gettime(""); break;
                    case "5": where = "@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 2); break;
                    case "6": where = "@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 3); break;
                    case "7": where = "@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 4); break;
                    case "8": where = "@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 5); break;
                    case "9": where = "@.auto_cancel_3pl_ack_date>" + Tool.gettime("") + " and @.auto_cancel_3pl_ack_date<" + (Tool.gettime("") + 60 * 60 * 24 * 6); break;
                    case "10": where = "@.auto_cancel_3pl_ack_date>" + (Tool.gettime("") + 60 * 60 * 24 * 5); break;
                }
                Aarr.push(where);
            }
            return Aarr;
        },
        b02: function () {
            let Aarr = [], arr = Tool.list_typeArr;
            for (let i = 0; i < arr.length; i++) {
                let where = "";
                switch (arr[i][0]) {
                    case "├9": where = "@.status_ext=9"; break;
                    case "├10": where = "@.status_ext=10"; break;
                    case "└10": where = "@.status_ext=10"; break;
                    case "├2-2-9": where = "@.status=2 and @.status_ext=2 and @.logistics_status=9"; break;
                    case "├1-1-1": where = "@.status=1 and @.status_ext=1 and @.logistics_status=1"; break;
                    case "└2-2-1": where = "@.status=2 and @.status_ext=2 and @.logistics_status=1"; break;
                    default: where = " @.list_type=" + arr[i][0]; break;
                }
                Aarr.push(where);
            }
            return Aarr;
        },
        b03: function () {
            let Aarr = [], arr = Tool.purchaseStatusArr
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.purchaseStatus=" + arr[i][0]);
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
            let config = JSON.parse(t[0][0].value);
            if (!config["订单管理"]) { config["订单管理"] = {}; }
            if (!config["订单管理"][oo.site]) { config["订单管理"][oo.site] = {}; }
            config["订单管理"][oo.site][oo.name] = oo.configSave;
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