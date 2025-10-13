'use strict';
!function () {
    let path = "admin/js/Shopee/营销中心/营销中心/"
    let commonPath = "admin/js/Shopee/common.js"
    let loginPath = ["admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "js13": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【加购优惠】/common_折扣.js',
            path + '营销工具/创建【加购优惠】/common_赠品.js',
            path + '营销工具/创建【加购优惠】/index.js'
        ])); break;
        case "js09": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【店内秒杀】/common1.js',
            path + '营销工具/创建【店内秒杀】/common2.js',
            path + '营销工具/创建【店内秒杀】/index.js'
        ])); break;
        case "js05": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【折扣活动】/common.js',
            path + '营销工具/创建【折扣活动】/index.js'
        ])); break;

        case "js17": Tool.scriptArr(loginPath.concat([path + '营销工具/创建【套装优惠】.js'])); break;
        case "js25": Tool.scriptArr(loginPath.concat([path + '营销工具/创建【运费促销】.js'])); break;
        case "js20": Tool.scriptArr(loginPath.concat([
            path + '商品活动/立即报名/common1.js',
            path + '商品活动/立即报名/common2-3.js',
            path + '商品活动/立即报名/common4.js',
            path + '商品活动/立即报名/common5.js',
            path + '商品活动/立即报名/common6-7.js',
            path + '商品活动/立即报名/index.js'
        ])); break;
        case "js21": Tool.scriptArr(loginPath.concat([
            path + '商品活动/立即报名/common2-3.js',
            path + '商品活动/立即报名/common4.js',
            path + '商品活动/立即报名/common5.js',
            path + '商品活动/撤销报名.js'
        ])); break;
        case "js23": Tool.scriptArr(loginPath.concat([
            path + '商品活动/立即报名/common2-3.js',
            path + '商品活动/立即报名/common4.js',
            path + '商品活动/立即报名/common5.js',
            path + '商品活动/删除【尚未提交】商品.js'
        ])); break;
        default: Tool.scriptArr([commonPath, path + '../common.js', path + '首页.js']); break;
    }
}();