'use strict';
mssql = mssql.concat([
    {
        name: "table",
        des: "全球商品-划分100个文件",//按【proid】划分100个文件
        database: "shopee/商品/全球商品/${100}",
        action: "sqlite",
        // run: [
        //     "ALTER TABLE @.table DROP COLUMN @.pic",
        // ],
        table: [{
            name: "id",
            type: "integer primary key",
            default: "",
            des: "索引"
        }, {
            name: "proid",
            type: "varchar(10)",
            default: "0 unique",
            des: "产品编码(如：R12345)"
        }, {
            name: "tw_name",
            type: "varchar(255)",
            default: "",
            des: "发布后台湾标题"
        }, {
            name: "tw_1_name",
            type: "varchar(255)",
            default: "",
            des: "重新审核对后,翻译前台湾标题"
        }, {
            name: "tw_2_name",
            type: "varchar(255)",
            default: "",
            des: "重新审核对后,翻译后台湾标题"
        }, {
            name: "ms_name",
            type: "varchar(255)",
            default: "",
            des: "发布后马来标题"
        }, {
            name: "en_name",
            type: "varchar(255)",
            default: "",
            des: "发布后英语标题"
        }, {
            name: "th_name",
            type: "varchar(255)",
            default: "",
            des: "发布后【泰国】标题"
        }, {
            name: "vi_name",
            type: "varchar(255)",
            default: "",
            des: "发布后【越南】标题"
        }, {
            name: "pt_name",
            type: "varchar(255)",
            default: "",
            des: "发布后葡萄牙语标题长度"
        }, {
            name: "es_name",
            type: "varchar(255)",
            default: "",
            des: "发布后西班牙语标题长度"
        }, {
            name: "es_1_name",
            type: "varchar(255)",
            default: "",
            des: "重新审核对后,翻译前台湾标题"
        }, {
            name: "es_2_name",
            type: "varchar(255)",
            default: "",
            des: "重新审核对后,翻译后台湾标题"
        }, {
            name: "ManualReview_1688_description",
            type: "text",
            default: "",
            des: "详情----发布时就用这个"
        }, {
            name: "tw_description",
            type: "text",
            default: "",
            des: "翻译成台湾语后的详情"
        }, {
            name: "th_description",
            type: "text",
            default: "",
            des: "翻译成泰国后的详情"
        }, {
            name: "vi_description",
            type: "text",
            default: "",
            des: "翻译成越南后的详情"
        }, {
            name: "ms_description",
            type: "text",
            default: "",
            des: "翻译成马来语后的详情"
        }, {
            name: "en_description",
            type: "text",
            default: "",
            des: "翻译成英语后的详情"
        }, {
            name: "pt_description",
            type: "text",
            default: "",
            des: "翻译成葡萄牙语后的详情"
        }, {
            name: "es_description",
            type: "text",
            default: "",
            des: "翻译成西班牙语后的详情"
        }, {
            name: "shopee_8pic",
            type: "text",
            default: "",
            des: "shopee的9个图片中剩下的8个图片"
        }, {
            name: "video",
            type: "varchar(255)",
            default: "",
            des: "上传后的主视频，是个json格式"
        }, {
            name: "ExplanationVideo",
            type: "varchar(255)",
            default: "",
            des: "上传后的讲解视频，是个json格式"
        }, {
            name: "size_image",
            type: "varchar(255)",
            default: "",
            des: "尺码表图片"
        }]
    },
]);
// }, {
//     name: "type1",
//     type: "integer",
//     default: "0",
//     des: "一级速卖通商品分类ID"
//////////////////////////////////////////////////////
// }, {
//     name: "tw_ads_key",
//     type: "varchar(50)",
//     default: "",
//     des: "马来站点-广告-主推关键词"
// }, {
//     name: "tw_ads_keywords",
//     type: "text",
//     default: "",
//     des: "马来站点-广告-启用的关键词"
// }, {
//     name: "my_ads_key",
//     type: "varchar(50)",
//     default: "",
//     des: "马来站点-广告-主推关键词"
// }, {
//     name: "my_ads_keywords",
//     type: "text",
//     default: "",
//     des: "马来站点-广告-启用的关键词"
// }, {
//     name: "br_ads_key",
//     type: "varchar(50)",
//     default: "",
//     des: "巴西站点-广告-主推关键词"
// }, {
//     name: "br_ads_keywords",
//     type: "text",
//     default: "",
//     des: "巴西站点-广告-启用的关键词"