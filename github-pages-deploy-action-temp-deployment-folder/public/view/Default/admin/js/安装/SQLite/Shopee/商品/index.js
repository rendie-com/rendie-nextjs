'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "禁限商品",
        database: "shopee/商品/违规或删除",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "site",
            type: "varchar(3)",
            default: "",
            des: "站点---主要记录是来至哪个站点（如：my,br等）"
        }, {
            name: "productId",
            type: "integer",
            default: "0",
            des: "商品ID"
        }, {
            name: "name",
            type: "varchar(255)",
            default: "",
            des: "商品名称"
        }, {
            name: "proid",
            type: "varchar(10)",
            default: "",
            des: "商品编码"
        }, {
            name: "pic",
            type: "varchar(50)",
            default: "",
            des: "图片"
        }, {
            name: "status",
            type: "tinyint",
            default: "0",
            des: "商品状态"
        }, {
            name: "penalty_type",
            type: "tinyint",
            default: "0",
            des: "违规类型"
        }, {
            name: "description",
            type: "varchar(255)",
            default: "",
            des: " 违规原因 "
        }, {
            name: "myExperience",
            type: "varchar(255)",
            default: "",
            des: " 我的心得，主要是记录Shopee禁我商品，我的看法。 "
        }, {
            name: "explanation",
            type: "text",
            default: "",
            des: "建议"
        }, {
            name: "banned_time",
            type: "integer",
            default: "0",
            des: "违规时间"
        }, {
            name: "addtime",
            type: "integer",
            default: "0",
            des: "添加时间"
        }, {
            name: "uptime",
            type: "integer",
            default: "0",
            des: "修改时间"
        }]
    },
]);