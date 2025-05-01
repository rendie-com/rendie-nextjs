'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "采集箱-粉丝-每个站点-100个数据库文件",
        database: "shopee/采集箱/粉丝/${sg|tw|th|my|vn|ph|br|mx|co|cl}/${100}",//按【用户ID】划分100个文件
        action: "sqlite",
        sql: [
            "create index userid ON @.table(@.userid)"
        ],
        table: [
            {
                name: "id",
                type: "integer primary key",
                default: "",
                des: "索引"
            },
            {
                name: "userid",
                type: "integer",
                default: "0 unique",
                des: "用户ID"
            },
            {
                name: "shopid",
                type: "integer",
                default: "0",
                des: "店铺ID"
            },
            {
                name: "follow_count",
                type: "integer",
                default: "0",
                des: "我的关注次数"
            },
            {
                name: "notFollow_count",
                type: "integer",
                default: "0",
                des: "我的取关次数"
            },
            {
                name: "follow_time",
                type: "integer",
                default: "0",
                des: "我的关注时间"
            },
            {
                name: "status",
                type: "tinyint",
                default: "",
                des: "状态（如：1）----还不知道有什么用"
            },
            {
                name: "last_active_time",
                type: "integer",
                default: "0",
                des: "最后登录时间"
            },
            {
                name: "username",
                type: "varchar(100)",
                default: "",
                des: "用户名（如：jianshao.my）"
            },
            {
                name: "shopname",
                type: "varchar(100)",
                default: "",
                des: "店铺名称（如：Skullreaper Digital）"
            },
            {
                name: "portrait",
                type: "varchar(50)",
                default: "",
                des: "头像（如：595170becdb25bccda3e19a3840e6e8d）"
            },
            {
                name: "is_preferred_plus",
                type: "bit",
                default: "0",
                des: ""
            },
            {
                name: "is_official_shop",
                type: "bit",
                default: "0",
                des: ""
            },
            {
                name: "is_shopee_verified",
                type: "bit",
                default: "0",
                des: ""
            },
            {
                name: "is_following",
                type: "bit",
                default: "0",
                des: "是否关注我的用户"
            },
            {
                name: "is_my_following",
                type: "bit",
                default: "0",
                des: "是否我关注的用户"
            },
            {
                name: "is_seller",
                type: "bit",
                default: "0",
                des: ""
            },
        ]
    },
])