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
                case "标题":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "定价":
                    Aarr = this.b02()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "活动":
                    Aarr = this.b03()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "最低购买量":
                    Aarr = this.b04()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "单位重量":
                    Aarr = this.b05()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "状态":
                    Aarr = this.b06()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "商品异常类型":
                    Aarr = this.b07()
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
                database: "shopee/商品/店铺商品/" + oo.site,
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
            let arr = Tool.shopPro_title, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push(arr[i][2]);
            }
            return Aarr;
        },
        b02: function () {
            let Aarr = [], arr = Tool.shopPro_price
            for (let i = 0; i < arr.length; i++) {
                Aarr.push(arr[i][2]);
            }
            return Aarr
        },
        b03: function () {
            let Aarr = [], arr = Tool.shopPro_activity
            for (let i = 0; i < arr.length; i++) {
                Aarr.push(arr[i][2]);
            }
            return Aarr
        },
        b04: function () {
            let arr = [
                [1, "=1"],
                [2, "=2"],
                [3, "=3"],
                [4, "=4"],
                [5, "=5"],
                [6, "=6"],
                [7, "=7"],
                [8, "=8"],
                [9, "=9"],
                [10, ">=10"],
            ], Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.MinimumOrder" + arr[i][1])
            }
            return Aarr
        },
        b05: function () {
            let arr = Tool.shopPro_unitWeight, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                let where = "";
                if (i != arr.length - 1) { where = ' and @.unitWeight<=' + (arr[i][3]) / 1000; }
                Aarr.push("@.unitWeight>" + (arr[i][2] / 1000) + where)
            }
            return Aarr
        },
        b06: function () {
            let arr = Tool.shopPro_statusArr, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.status=" + arr[i][0])
            }
            return Aarr
        },
        b07: function () {
            let arr = Tool.shopPro_ExceptionTypeArr, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.ExceptionType=" + arr[i][0])
            }
            return Aarr
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
            if (!config["店铺商品"]) { config["店铺商品"] = {}; }
            if (!config["店铺商品"][oo.site]) { config["店铺商品"][oo.site] = {}; }
            config["店铺商品"][oo.site][oo.name] = oo.configSave;
            let data = [{
                action: o.DEFAULT_DB,
                database: "main",
                sql: "update @.config set @.value=" + Tool.rpsql(JSON.stringify(config)) + " where  @.name='" + o.params.template + "'",
            }]
            Tool.ajax.a01(data, this.d03, this, oo);
        },
        d03: function (t, oo) {
            oo.next.apply(oo.This, [oo.t])
        },
    }
})