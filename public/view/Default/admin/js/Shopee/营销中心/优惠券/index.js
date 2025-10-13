'use strict';
!function () {
    let path = "admin/js/Shopee/营销中心/优惠券/"
    let commonPath = "admin/js/Shopee/common.js"
    let loginPath = ["admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr(loginPath.concat([
            commonPath,
            path + '更多_all/获取【优惠券】信息/common.js',
            path + '更多_all/获取【优惠券】信息/index.js'
        ])); break;
        case "02": Tool.scriptArr(loginPath.concat([
            commonPath,
            path + '更多_all/创建【优惠券】/1.创建8种优惠券.js',
            path + '更多_all/创建【优惠券】/2.创建各种优惠券.js',
            path + '更多_all/创建【优惠券】/3.优惠券的提交参数.js',
            path + '更多_all/创建【优惠券】/4.创建【关注礼优惠券】.js',
            path + '更多_all/创建【优惠券】/index.js'
        ])); break;
        case "03": Tool.scriptArr(loginPath.concat([commonPath, path + '状态/删除.js'])); break;
        case "04": Tool.scriptArr(loginPath.concat([commonPath, path + '状态/结束.js'])); break;
        case "05": Tool.scriptArr([commonPath,  path + '查看详情.js']); break;
        default: Tool.scriptArr([commonPath, path + '../common.js', path + '首页.js']); break;
    }
}();