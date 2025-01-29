'use strict';
!function () {
    //obj.params.jsFile     选择JS文件  
    let path = "admin/js/Shopee/订单/"
    let loginPath = [
        "admin/js/Shopee/common.js",
        "admin/js/Shopee/common_login.js",
        "admin/js/Shopee/common_登录.js"
    ]
    switch (obj.params.jsFile) {
        case "js01": Tool.scriptArr(loginPath.concat([
            path + '获取订单信息/common/get_logistics_tracking_history.js',
            path + '获取订单信息/common/get_order_fm_code_multi_shop.js',
            path + '获取订单信息/common/get_one_order.js',
            path + '获取订单信息/common/get_order_income_components.js',
            path + '获取订单信息/common/updateOrInsert_orders.js',
            path + '获取订单信息/index.js'
        ])); break;
        case "js02": Tool.scriptArr(loginPath.concat([
            path + 'common.js',
            path + '订单详情/index.js'
        ])); break;
        case "js03": Tool.scriptArr(loginPath.concat([path + '更多/从客优云和1688获取采购信息.js'])); break;
        case "js04": Tool.scriptArr(loginPath.concat([path + 'config.js', path + '状态_更新数量.js'])); break;
        case "js05": Tool.scriptArr(loginPath.concat([path + 'config.js', path + 'common.js', path + '采购状态_更新数量.js'])); break;
        default: Tool.scriptArr(["admin/js/Shopee/common.js", path + 'config.js', path + 'common.js', path + '首页.js']);
    }
}();