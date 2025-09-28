'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "店铺商品-多个站点-划分100个文件",//按【proid】划分100个文件
        database: "shopee/商品/店铺商品/${sg|sg2|tw|th|my|vn|vn2|ph|br|mx|mx2|co|cl}/${100}",
        action: "sqlite",
        // run: [
        //     "alter table @.table add @.images varchar(512)",
        //     "alter table @.table add @.std_tier_variation_list text",
        //     "alter table @.table add @.wholesale_list text",
        //     "alter table @.table add @.video_list text",
        //     //"delete from @.table where @.description is null",
        // ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "proid",
            type: "varchar(10)",
            default: "0",
            des: "产品编码(如：R12345)"
        }, {
            name: "promotion",
            type: "text",
            default: "",
            des: "该商品的活动信息"
        }, {
            name: "model_list",
            type: "text",
            default: "",
            des: "价格和价格ID信息----报名活动要用，更新商品要用"
        }, {
            name: "std_tier_variation_list",
            type: "text",
            default: "",
            des: ""
        }, {
            name: "images",
            type: "varchar(512)",
            default: "",
            des: ""
        }, {
            name: "wholesale_list",
            type: "text",
            default: "",
            des: ""
        }, {
            name: "description",
            type: "text",
            default: "",
            des: ""
        }, {
            name: "video_list",
            type: "text",
            default: "",
            des: ""
        }]
    },
]);