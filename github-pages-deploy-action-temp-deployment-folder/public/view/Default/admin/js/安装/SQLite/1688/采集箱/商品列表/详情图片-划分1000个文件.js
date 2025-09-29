'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "1688商品-详情图片",
        database: "1688/采集箱/商品列表/详情图片/${1000}",
        action: "sqlite",
        sql: [
            "create index hash ON @.table(@.hash)",
            "create unique index src ON @.table(@.src)"
        ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "fromid",
            type: "numeric(18,0)",
            default: "0",
            des: "详情ID（打开详情要用的ID，如：2744026324）"
        }, {
            name: "hash",
            type: "varchar(64)",
            default: "",
            des: "计算hash值"
        }, {
            name: "src",
            type: "varchar(255)",
            default: "",
            des: "详情页的所有信息"
        }, {
            name: "width",
            type: "integer",
            default: "0",
            des: "添加时间"
        }, {
            name: "height",
            type: "integer",
            default: "0",
            des: "添加时间"
        }, {
            name: "size",
            type: "integer",
            default: "0",
            des: "添加时间"
        }, {
            name: "addtime",
            type: "integer",
            default: "0",
            des: "添加时间"
        }]
    },
]);