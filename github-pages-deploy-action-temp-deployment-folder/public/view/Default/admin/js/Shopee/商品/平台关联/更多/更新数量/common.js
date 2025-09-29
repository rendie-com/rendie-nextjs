'use strict';
Object.assign(Tool, {
    configSave: {
        a01: function (progress, name, next, This, t) {
            let Aarr = this.b01(name);
            let oo = {
                progress: progress,
                Aarr: Aarr,
                name: name,//保存用的 
                next: next,
                This: This,
                t: t,
                /////////////////////////////
                configSave: [],//保存用的   
                A1: 1,
                A2: Aarr.length,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a03, this, this.d01, oo);
        },
        a03: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/商品/全球商品",
                sql: "select count(1) as count from @.table where " + oo.Aarr[oo.A1 - 1],
            }]
            $("#state").html("正在统计数量");
            Tool.ajax.a01(data, this.a04, this, oo);
        },
        a04: function (t, oo) {
            oo.configSave.push(t[0][0].count);
            oo.A1++;
            this.a02(oo);
        },
        //////////////////////////////////////////////
        b01: function (name) {
            let Aarr = []
            switch (name) {
                case "更新后违规类型":
                    for (let i = 0; i < 20; i++) { Aarr.push("@.penalty_type=" + i); }
                    break;
                case "敦煌手动审核状态":
                    for (let i = 0; i < 20; i++) { Aarr.push("@.ManualReview=" + i); }
                    break;
                case "敦煌审核后本地状态":
                    for (let i = 0; i < 5; i++) { Aarr.push("@.DHAfterReview=" + i); }
                    break;
                case "人工审核1688视频状态":
                    for (let i = 0; i < 15; i++) { Aarr.push("@.ManualReview_1688_video_status=" + i); }
                    break;
                default: Tool.at("没有开发：" + name); break;
            }
            return Aarr;
        },
        /////////////////////////////////////////////////
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
            config["关联平台"][oo.name] = oo.configSave;
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