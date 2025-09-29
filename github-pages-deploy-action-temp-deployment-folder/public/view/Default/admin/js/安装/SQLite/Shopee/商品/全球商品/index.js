'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "全球商品",
        database: "shopee/商品/全球商品",
        action: "sqlite",
        // run: [
        //     "alter table @.table add @.es_1_name varchar(255)",
        //     "alter table @.table add @.es_2_name varchar(255)",
        //     "alter table @.table add @.es_2_nameLen integer default 0",
        // ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "BeforeReview",
            type: "tinyint",
            default: "0",
            des: "审核前本地状态(0.未更新；1.更新成功；2.类目名称丢失；3.没绑定类目；4.绑定不了；等等)"
        }, {
            name: "discount",
            type: "tinyint",
            default: "0",
            des: "折扣（以后发布商品，就用这个折扣。）"
        }, {
            name: "ManualReview_1688_categoryId1",
            type: "integer",
            default: "0",
            des: "手动审核1688一级商品分类ID（发布到各个站点时要用）"
        }, {
            name: "penalty_type",
            type: "tinyint",
            default: "0",
            des: "更新后违规类型"
        }, {
            name: "ManualReview_1688_status",
            type: "tinyint",
            default: "0",
            des: "手动审核1688状态"
        }, {
            name: "ManualReview_1688_fromid",
            type: "numeric(18,0)",
            default: "0",
            des: "人工审核的来源ID，用来当采购货源。"
        }, {
            name: "ManualReview_1688_unitWeight",
            type: "numeric(8,4)",
            default: "0",
            des: "手动审核1688后单位重量，算shopee运费要用。"
        }, {
            name: "ManualReview_1688_video_status",
            type: "tinyint",
            default: "0",
            des: "1688人工审核视频状态----做活动要排序要用"
        }, {
            name: "ManualReview_1688_ExplanationVideo_status",
            type: "tinyint",
            default: "0",
            des: "1688人工审核讲解视频状态"
        }, {
            name: "DHAfterReview",
            type: "tinyint",
            default: "0",
            des: "敦煌-审核后本地状态(主要是记录更新成功后，被敦煌审核后，出现审核不通过，按原因划分的状态)"

        }, {
            name: "ManualReview_1688_subject",
            type: "varchar(255)",
            default: "",
            des: "标题----发布时就用这个标题"
        }, {
            name: "tw_nameLen",
            type: "integer",
            default: "0",
            des: "发布后台湾语标题长度"
        }, {
            name: "tw_2_nameLen",
            type: "integer",
            default: "0",
            des: "手动审核对后,翻译后，台湾语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "ms_nameLen",
            type: "integer",
            default: "0",
            des: "发布后马来语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "en_nameLen",
            type: "integer",
            default: "0",
            des: "发布后英语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "th_nameLen",
            type: "integer",
            default: "0",
            des: "发布后【泰国】标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "vi_nameLen",
            type: "integer",
            default: "0",
            des: "发布后【越南】标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "pt_nameLen",
            type: "integer",
            default: "0",
            des: "发布后葡萄牙语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "es_nameLen",
            type: "integer",
            default: "0",
            des: "发布后西班牙语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "es_2_nameLen",
            type: "integer",
            default: "0",
            des: "手动审核对后,翻译后，台湾语标题长度----因为shopee要求【商品名称的建议字数为 25~100】"
        }, {
            name: "err",
            type: "varchar(255)",
            default: "",
            des: "出错说明"
        }, {
            name: "ManualReview",
            type: "tinyint",
            default: "0",
            des: "人工审核状态"
        }, {
            name: "proid",
            type: "varchar(10)",
            default: "0 unique",
            des: "产品编码(如：R12345)"
        }, {
            name: "pic",
            type: "varchar(255)",
            default: "",
            des: "首图"
        }, {
            name: "fromID",
            type: "numeric(18,0)",
            default: "0",
            des: "全球商品ID（上传成功返回的数据ID）"
        }, {
            name: "isUp",
            type: "bit",
            default: "0",
            des: "是否已上传到【Shopee全球商品】"
        }, {
            name: "editStatus",
            type: "tinyint",
            default: "0",
            des: "修改状态（0：未修改；1：第一次修改；2：第二次修改；）"
        }, {
            name: "isTH",
            type: "bit",
            default: "0",
            des: "是否发布到【泰国】站点"
        }, {
            name: "isMY",
            type: "bit",
            default: "0",
            des: "是否发布到【马来西亚】站点"
        }, {
            name: "isVN",
            type: "bit",
            default: "0",
            des: "是否发布到【越南】站点"
        }, {
            name: "isPH",
            type: "bit",
            default: "0",
            des: "是否发布到【菲律宾】站点"
        }, {
            name: "isCO",
            type: "bit",
            default: "0",
            des: "是否发布到【哥伦比亚】站点"
        }, {
            name: "isCL",
            type: "bit",
            default: "0",
            des: "是否发布到【智利】站点"
        }, {
            name: "isBR",
            type: "bit",
            default: "0",
            des: "是否发布到【巴西】站点"
        }, {
            name: "isTW",
            type: "bit",
            default: "0",
            des: "是否发布到【台湾】站点"
        }, {
            name: "isSG",
            type: "bit",
            default: "0",
            des: "是否发布到【新加坡】站点"
        }, {
            name: "isMX",
            type: "bit",
            default: "0",
            des: "是否发布到【墨西哥】站点"
        }, {
            name: "isUpImg",
            type: "bit",
            default: "0",
            des: "是否已上传图片到【Shopee平台】，为什么要这个字段？答：上传图片太慢了，用这个会快一点。"
        }, {
            name: "ManualReview_1688_categoryId",
            type: "integer",
            default: "0",
            des: "1688类目ID---绑定类目时要用"
        }, {
            name: "ManualReview_1688_bindShopee_categoryId",
            type: "integer",
            default: "0",
            des: "人工审核后绑定shopee类目ID---查看在类目时要用"
        }, {
            name: "addtime",
            type: "integer",
            default: "0",
            des: "上传时间"
        }, {
            name: "uptime",
            type: "integer",
            default: "0",
            des: "更新时间"
        }, {
            name: "ManualReview_1688_state",
            type: "tinyint",
            default: "0",
            des: "人工审核后状态（当更新时可知道，采购货源状态）"
        }
        ]
    },
]);








//////////////////////////////////

// }, {
//     name: "upUserID",
//     type: "integer",
//     default: "0",
//     des: "上传去哪的用户名的ID"