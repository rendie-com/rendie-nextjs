'use strict';
!function () {
    let path = "admin/js/Shopee/营销中心/折扣/"
    let commonPath = "admin/js/Shopee/common.js"
    let loginPath = ["admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr(loginPath.concat([
            commonPath,
            path + '更多_all/获取【折扣】信息/common.js',
            path + '更多_all/获取【折扣】信息/index.js'
        ])); break;
        case "02": Tool.scriptArr(loginPath.concat([
            commonPath,
            path + '更多_all/创建【折扣】活动/1.准备商品.js',
            path + '更多_all/创建【折扣】活动/2.做活动.js',
            path + '更多_all/创建【折扣】活动/index.js'
        ])); break;
        case "03": Tool.scriptArr(loginPath.concat([commonPath, path + '状态/删除.js'])); break;
        case "04": Tool.scriptArr(loginPath.concat([commonPath, path + '状态/结束.js'])); break;
        default: Tool.scriptArr([commonPath, path + '../common.js', path + '首页.js']); break;
    }
}();