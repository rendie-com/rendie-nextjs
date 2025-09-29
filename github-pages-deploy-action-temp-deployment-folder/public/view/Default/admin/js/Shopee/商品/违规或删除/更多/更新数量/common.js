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
                case "状态":
                    Aarr = this.b01()
                    oo.Aarr = Aarr; oo.A2 = Aarr.length;
                    this.a03(oo);
                    break;
                case "违规类型":
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
                database: "shopee/商品/违规或删除",
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
        ///////////////////////////////////
        b01: function () {
            let arr = Tool.shopPro_statusArr, Aarr = []
            for (let i = 0; i < arr.length; i++) {
                Aarr.push("@.status=" + arr[i][0])
            }
            return Aarr
        },
        b02: function () {
            let Aarr = []
            for (let i = 0; i < 10; i++) {
                Aarr.push("@.penalty_type=" + i);
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
            if (!config["违规或删除"]) config["违规或删除"] = {};
            config["违规或删除"][oo.name] = oo.configSave;
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
        //////////////////////////////////////////////////////
        e01: function (oo) {
            let data = [{
                action: "sqlite",
                database: "aliexpress",
                sql: "select @.fromid as fromid FROM @.type where @.upid=0 and @.isleaf=0 order by @.sort desc,@.id asc",
            }]
            Tool.ajax.a01(data, this.e02, this, oo);
        },
        e02: function (t, oo) {
            let Aarr = [];
            for (let i = 0; i < t[0].length; i++) {
                Aarr.push("@.type1=" + t[0][i].fromid);
            }
            oo.Aarr = Aarr;
            oo.A2 = Aarr.length;
            this.a03(oo)
        },
    }
})