'use strict';
Object.assign(Tool, {
    loginKeyouyun:
    {
        obj: {
            urlArr: ["https://erp.keyouyun.com/"]
        },
        a01: function (username, password, cookies, localStorage, dom, next, This, t) {
            let oo = {
                username: username,
                password: password,
                cookies: cookies,
                localStorage: localStorage,
                dom: dom,
                next: next,
                This: This,
                t: t
            }
            this.a02(oo);
        },
        a02: function (oo) {
            oo.dom.html("先删除Cookies");
            gg.delAllCookies(this.obj.urlArr, this.a03, this, oo);
        },
        a03: function (t, oo) {
            if (!oo.cookies) {
                this.a04(oo);//去登入
            }
            else {
                oo.dom.html("用Cookies去登入");
                this.d01(oo);
            }
        },
        a04: function (oo) {
            let url = "https://api.keyouyun.com/auth/login/"
            let data = { "username": oo.username, "password": oo.password }
            oo.dom.html("正在登入");
            gg.postFetch(url, JSON.stringify(data), this.a05, this, oo);
        },
        a05: function (t, oo) {
            if (t.access_token) {
                oo.dom.html("正在登入成功。。。");
                this.a06(oo);
            }
            else {
                oo.dom.html("正在登入失败。。。");
            }
        },
        a06: function (oo) {
            oo.dom.html("已确认“" + oo.username + "”登入，正在获取所有cookies。");
            gg.getAllCookies(this.obj.urlArr, this.a07, this, oo);
        },
        a07: function (cookies, oo) {
            let data = [{
                action: "sqlite",
                database: "shopee/客优云/账户",
                sql: 'update @.table set @.cookies=' + Tool.rpsql(JSON.stringify(cookies)) + ' where @.username=' + Tool.rpsql(oo.username),
            }]
            Tool.ajax.a01(data, this.a08, this, oo);
        },
        a08: function (t, oo) {
            Tool.apply(t, oo.next, oo.This, oo.t);
        },
        //////////////////////////////////////////////////////////////////
        d01: function (oo) {
            oo.dom.html("正在写入【cookies】...");
            gg.setAllCookies(oo.cookies, this.d02, this, oo);
        },
        d02: function (t, oo) {
            oo.dom.html("延时0.5秒,再确认是否登入...");
            Tool.Time("time", 500, this.d03, this, oo);
        },
        d03: function (oo) {
            oo.dom.html("正在确认“" + oo.username + "”是否登入.....");
            let url = "https://api.keyouyun.com/uaa/api/v2/account"
            gg.getFetch(url, "json", this.d04, this, oo);
        },
        d04: function (t, oo) {
            if (t.login == oo.username) {
                oo.dom.html("已确认“" + oo.username + "”登入...");
                this.a08("", oo);
            }
            else if (t.status == 401) {
                oo.dom.html("要从新登入.....");
                this.a04(oo);//去登入
            }
            else {
                Tool.pre(["账号不对", t]);
            }
        }
    }
})