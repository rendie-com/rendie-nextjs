'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "1688-买家账户",
        database: "1688/买家账户",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "sort",
            type: "integer",
            default: "0",
            des: "排序"
        }, {
            name: "username",
            type: "varchar(64)",
            default: "",
            des: "账号名--登录时用的（如：pdd54981599994）"
        }, {
            name: "password",
            type: "varchar(64)",
            default: "",
            des: "密码"
        }, {
            name: "cookies",
            type: "text",
            default: "",
            des: "登录用的cookies信息"
        }, {
            name: "phone",
            type: "varchar(11)",
            default: "",
            des: "手机"
        }, {
            name: "note",
            type: "varchar(255)",
            default: "",
            des: "备注"
        }, {
            name: "addtime",
            type: "integer",
            default: "0",
            des: "添加时间"
        }]
    },
]);