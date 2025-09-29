'use strict';
Object.assign(Tool, {
    login:
    {
        a01: function (next, This, t) {
            let oo = {
                next: next,
                This: This,
                t: t
            }
            gg.isRD(this.a02, this, oo);
        },
        a02: function (t, oo) {
            $("#state").html("正在获得配置参数");
            let data = [{
                action: "sqlite",
                database: "1688/买家账户",
                sql: "select " + Tool.fieldAs("username,password,cookies") + " FROM @.table order by @.sort asc limit 1",
            }]
            Tool.ajax.a01(data, this.a03, this, oo)
        },
        a03: function (t, oo) {
            oo.username = t[0][0].username
            $("#username").html(oo.username);
            Tool.login1688.a01(t[0][0].username, t[0][0].password, t[0][0].cookies, $("#state"), this.a04, this, oo)
        },
        a04: function (isTab, oo) {
            Tool.apply(isTab, oo.next, oo.This, oo.t);
        },
    },
})