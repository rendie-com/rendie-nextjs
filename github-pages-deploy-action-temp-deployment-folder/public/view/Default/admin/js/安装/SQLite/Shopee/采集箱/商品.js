'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "采集箱-商品-多个站点",
        database: "shopee/采集箱/商品/${sg|tw|th|my|vn|ph|br|mx|co|cl}",
        action: "sqlite",
        sql: [
            "create index itemid ON @.table(@.itemid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "currency",
                type: "varchar(5)",
                default: "",
                des: "货币单位（如：MYR）----当site出错这个可以找回"
            },
            {
                name: "itemid",
                type: "integer",
                default: "0",
                des: "商品ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "title",
                type: "varchar(255)",
                default: "",
                des: "标题"
            },
            {
                name: "image",
                type: "varchar(100)",
                default: "",
                des: "首图"
            },
            {
                name: "shop_location",
                type: "varchar(100)",
                default: "",
                des: "店铺位置（如：中国大陆）"
            },
            {
                name: "price",
                type: "integer",
                default: "0",
                des: "价格"
            },
            {
                name: "addtime",
                type: "integer",
                default: "0",
                des: "添加时间"
            }
        ]
    },
]);