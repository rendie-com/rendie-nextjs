'use strict';
//说明：
//“o”为iframe父节点传下来的全局变量。
//注：但我为了省事没这么干。
var o = {
    path: "view/Default/",
    pre: "rd_",
    cacheFolder: "",
    DEFAULT_DB: Tool.getStorage("DEFAULT_DB"),
    params: Tool.getParams(location.href)
}, fun = {
    a01: function () {
        if (!frameElement) {
            top.location.href = "/view/Default/admin/html/404.html";
        } else if (!o.DEFAULT_DB) {
            this.a02()
        } else {
            this.d01();
        }
    },
    a02: function () {
        let data = [{
            action: "process",
            fun: "env",
            name: "NEXTJS_CONFIG_DEFAULT_DB"
        }]
        Tool.ajax.a01(data, this.a03, this);
    },
    a03: function (t) {
        o.DEFAULT_DB = t[0];
        window.localStorage.setItem("DEFAULT_DB", t[0]);
        this.d01()
    },
    ///////////////////////////////////
    d01: function () {
        Tool.scriptArr(["admin/js/" + o.params.template]);
    },
}
$(function () { fun.a01(); });