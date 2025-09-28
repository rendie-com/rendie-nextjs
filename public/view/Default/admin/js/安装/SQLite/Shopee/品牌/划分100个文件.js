'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "划分100个文件",//按【brand_id】划分100个文件
        database: "shopee/品牌/${100}",
        action: "sqlite",
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "brand_id",
            type: "integer",
            default: "0 unique",
            des: "品牌ID"
        }, {
            name: "category_ids",
            type: "text",
            default: "",
            des: "品牌有哪些分类ID"
        }]
    },
]);