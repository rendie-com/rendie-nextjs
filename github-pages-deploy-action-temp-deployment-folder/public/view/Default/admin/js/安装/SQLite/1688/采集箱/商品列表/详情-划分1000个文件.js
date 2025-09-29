'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "1688商品表-详情页展示",
        database: "1688/采集箱/商品列表/详情/${1000}",
        action: "sqlite",
        sql: [
            "create unique index prodes_fromid ON @.table(@.fromid)"
        ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "fromid",
            type: "numeric(18,0)",
            default: "0 unique",
            des: "详情ID（打开详情要用的ID，如：2744026324）"
        }, {
            name: "isHash",
            type: "bit",
            default: "0",
            des: "是否创建Hash值"
        }, {
            name: "des",
            type: "text",
            default: "",
            des: "详情页的内容"
        }, {
            name: "attr",
            type: "text",
            default: "",
            des: "属性"
        }, {
            name: "sku",
            type: "text",
            default: "",
            des: "商品价格相联信息（如：名称，折扣，价格，图片，库存）"
        }, {
            name: "attrPic",
            type: "text",
            default: "",
            des: "属性图"
        }, {
            name: "pic",
            type: "text",
            default: "",
            des: "放大镜图"
        }, {
            name: "attrPic_shopee",
            type: "text",
            default: "",
            des: "属性图-上传到shopee后"
        }, {
            name: "pic_shopee",
            type: "text",
            default: "",
            des: "放大镜图-上传到shopee后"
        }, {
            name: "desPic_shopee",
            type: "text",
            default: "",
            des: "详情图-上传到shopee后"
        }, {
            name: "videoUrl",
            type: "varchar(255)",
            default: "",
            des: "镜大镜那里的视频地址"
        }, {
            name: "ExplanationVideo",
            type: "varchar(255)",
            default: "",
            des: "讲解视频地址"
        }, {
            name: "uptime",
            type: "integer",
            default: "0",
            des: "更新时间"
        }, {
            name: "addtime",
            type: "integer",
            default: "0",
            des: "添加时间"
        }]
    },
]);