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
            path + '订单管理/更多/获取订单信息/common/get_logistics_tracking_history.js',
            path + '订单管理/更多/获取订单信息/common/get_order_fm_code_multi_shop.js',
            path + '订单管理/更多/获取订单信息/common/get_one_order.js',
            path + '订单管理/更多/获取订单信息/common/get_order_income_components.js',
            path + '订单管理/更多/获取订单信息/common/updateOrInsert_orders.js',
            path + '订单管理/更多/获取订单信息/index.js'
        ])); break;
        case "js02": Tool.scriptArr(loginPath.concat([
            'admin/js/1688/common_登录.js',
            path + 'common.js',
            path + '订单管理/订单详情/1688采购信息/1.核对商品.js',
            path + '订单管理/订单详情/1688采购信息/2.加入购物车.js',
            path + '订单管理/订单详情/1688采购信息/4.获取采购信息.js',
            path + '订单管理/订单详情/index.js'
        ])); break;
        case "js03": break;
        case "js04": Tool.scriptArr(loginPath.concat([path + '订单管理/config.js', path + 'common.js', path + '订单管理/状态_更新数量.js'])); break;
        case "js05": Tool.scriptArr(loginPath.concat([path + '订单管理/config.js', path + 'common.js', path + '订单管理/采购状态_更新数量.js'])); break;
        case "js06": Tool.scriptArr(loginPath.concat([path + '订单管理/config.js', path + 'common.js', path + '订单管理/时间_更新数量.js'])); break;
        case "js07": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '发货预报/index.js'])); break;
        case "js08": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '发货预报/更多/获取已绑定的包裹.js'])); break;
        case "js09": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '发货预报/更多/获取未绑定的包裹.js'])); break;
        case "js10": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '发货预报/更多/获取包裹图片.js'])); break;
        case "js11": Tool.scriptArr(loginPath.concat([path + 'common.js', path + '发货预报/更多/开始绑定发货预报.js'])); break;
        default: Tool.scriptArr([
            "admin/js/Shopee/common.js",
            path + '订单管理/config.js',
            path + 'common.js',
            path + '订单管理/index.js']);
    }
}();