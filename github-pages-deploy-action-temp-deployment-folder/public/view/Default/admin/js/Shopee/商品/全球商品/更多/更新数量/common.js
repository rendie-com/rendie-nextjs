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
                case "更新前本地状态":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "手动审核前1688状态":
                    Aarr = this.b02()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "手动审核后1688状态":
                    Aarr = this.b03()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "修改状态":
                    Aarr = this.b04()
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
                database: "shopee/商品/全球商品",
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
            let arr = Tool.BeforeReview, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.BeforeReview=" + arr[i][0])
            }
            return Aarr
        },
        b02: function () {
            let Aarr = []
            for (let i = 0; i < 10; i++) {
                Aarr.push("@.ManualReview_1688_status=" + i)
            }
            return Aarr
        },
        b03: function () {
            let Aarr = []
            for (let i = 0; i < 15; i++) {
                Aarr.push("@.ManualReview_1688_state=" + i)
            }
            return Aarr
        },
        b04: function () {
            let arr = Tool.GlobalPro_editStatus, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.editStatus=" + arr[i][0])
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
            if (!config["全球商品"]) config["全球商品"] = {};
            config["全球商品"][oo.name] = oo.configSave;
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