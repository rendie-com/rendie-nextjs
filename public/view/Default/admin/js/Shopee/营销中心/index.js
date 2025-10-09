'use strict';
!function () {
    //o.params.jsFile     选择JS文件      
    let path = "admin/js/Shopee/营销中心/"
    let loginPath = ["admin/js/Shopee/common.js", "admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile) {
        case "js01": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【优惠券】/commonB.js',
            path + '营销工具/创建【优惠券】/common.js',
            path + '营销工具/创建【优惠券】/index.js'
        ])); break;
        case "js02": Tool.scriptArr([path + '优惠券/index.js']); break;
        case "js05": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【折扣活动】/common.js',
            path + '营销工具/创建【折扣活动】/index.js'
        ])); break;
        case "js06": Tool.scriptArr([path + '折扣/index.js']); break;
        case "js09": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【店内秒杀】/common1.js',
            path + '营销工具/创建【店内秒杀】/common2.js',
            path + '营销工具/创建【店内秒杀】/index.js'
        ])); break;
        case "js10": Tool.scriptArr([path + '店内秒杀/index.js']); break;
        case "js13": Tool.scriptArr(loginPath.concat([
            path + '营销工具/创建【加购优惠】/common_折扣.js',
            path + '营销工具/创建【加购优惠】/common_赠品.js',
            path + '营销工具/创建【加购优惠】/index.js'
        ])); break;
        case "js14": Tool.scriptArr([path + '加购优惠/index.js']); break;
        case "js17": Tool.scriptArr(loginPath.concat([path + '营销工具/创建【套装优惠】.js'])); break;
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
        case "js24": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '运费促销/index.js'])); break;
        case "js25": Tool.scriptArr(loginPath.concat([path + '营销工具/创建【运费促销】.js'])); break;
        default: Tool.scriptArr([path + 'common.js', 'admin/js/Shopee/common.js', path + '首页.js']);
    }
}();