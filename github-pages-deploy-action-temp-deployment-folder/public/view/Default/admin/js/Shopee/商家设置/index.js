'use strict';
!function () {
    //obj.params.jsFile         选择JS文件
    let path = "admin/js/Shopee/商家设置/"
    let loginPath = [
        "admin/js/Shopee/common.js",
        "admin/js/Shopee/common_login.js",
        "admin/js/Shopee/common_登录.js"
    ]
    let loginUrl = "admin/js/Shopee/common_登录.js";
    switch (obj.params.jsFile) {
        case "js01": Tool.scriptArr([path + '卖家账户/修改.js']); break;
        case "js02": Tool.scriptArr([path + '卖家账户/更多/index.js']); break;
        case "js03": Tool.scriptArr([path + 'common.js', path + '合作伙伴管理/index.js']); break;
        case "js04": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '合作伙伴管理/取消连接.js'])); break;
        case "js05": Tool.scriptArr([
            'admin/js/安装/PostgreSQL/默认表.js',
            "admin/js/安装/DynamoDB/Shopee/卖家账户.js",
            "admin/js/Shopee/任务/定时任务/更多/把【sqlite】数据库该表同步到新的数据库.js"
        ]); break;
        case "js06": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '合作伙伴管理/获取店铺授权信息.js'])); break;
        case "js07": Tool.scriptArr([path + 'common.js', path + '合作伙伴管理/授权管理.js']); break;
        default: Tool.scriptArr([loginUrl, path + 'common.js', path + '卖家账户/index.js']); break;
    }
}();

//case "js03": Tool.scriptArr(['admin/js/Shopee/通用/把一个db文件拆分成多个db文件.js']); break;
//case "js04": Tool.scriptArr([path + '卖家账户/更多/common.js', path + '卖家账户/更多/修复商品数量.js']); break;
//case "js06": Tool.scriptArr([path + '卖家账户/更多/common.js,', path + '卖家账户/更多/更新商品-用软件上传视频.js']); break;
//case "js08": Tool.scriptArr([path + '卖家账户/更多/common.js,', path + '卖家账户/更多/删除【有品牌】的商品.js']); break;
//case "js12": Tool.scriptArr([path + '卖家账户/更多/common.js,', path + '卖家账户/更多/删除【马来西亚】店铺中的商品.js']); break;
//case "js18": Tool.scriptArr([path + '卖家账户/更多/common.js,', path + '卖家账户/更多/【删除】非正常的商品.js']); break;
//case "js20": Tool.scriptArr([path + '卖家账户/更多/common.js,', path + '卖家账户/更多/删除10个【马来西亚】店铺中【不活跃】的商品.js']); break;
