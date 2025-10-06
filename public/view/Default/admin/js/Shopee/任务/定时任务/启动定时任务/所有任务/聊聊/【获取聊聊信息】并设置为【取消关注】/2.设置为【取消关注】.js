'use strict';
Object.assign(Tool, {
    common2: {
        a01: function (progress, siteNum, next, This, t) {
            let oo = {
                progress: progress,
                siteNum: siteNum,
                next: next,
                This: This,
                t: t,
                ////////////////////////////////////////////
                A1: 1, A2: 0,
            }
            this.a02(oo);
        },
        a02: function (oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/聊聊/" + oo.siteNum,
                sql: "select " + Tool.fieldAs("to_fromid") + " FROM @.table" + Tool.limit(10, oo.A1, "sqlite"),
                list: [{
                    action: "sqlite",
                    database: "shopee/采集箱/粉丝/" + oo.siteNum + "/${id_100:to_fromid}",
                    sql: "update @.table set @.isLock=1 where @.isLock=0 and @.userid=${to_fromid}",
                }],
            }]
            if (oo.A2 == 0) {
                data.push({
                    action: "sqlite",
                    database: "shopee/聊聊/" + oo.siteNum,
                    sql: "select count(1) as count FROM @.table",
                })
            }
            $("#state").html("正在更新数据。。。")
            Tool.ajax.a01(data, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (oo.A2 == 0) { oo.A2 = Math.ceil(t[1][0].count / 10); }
            Tool.x1x2(oo.progress, oo.A1, oo.A2, this.a04, this, this.a05, oo);
        },
        a04: function (oo) {
            oo.A1++;
            this.a02(oo);
        },
        a05: function (oo) {
            Tool.apply(oo.t, oo.next, oo.This);
        },
    },
})