'use strict';
!function () {
    let path = "admin/js/Shopee/商品/违规或删除/"
    let loginPath = ["admin/js/Shopee/common.js", "admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr([
            path + '../common.js',
            path + '更多/更新数量/common.js',
            path + '更多/更新数量/index.js'
        ]); break;
        case "02": Tool.scriptArr(loginPath.concat([path + '更多/获取【违规或删除】信息.js'])); break;
        case "03": Tool.scriptArr(loginPath.concat([path + '更多/获取【搜索排名降低】的商品.js'])); break;
        default: Tool.scriptArr(["admin/js/Shopee/common.js", path + '../common.js', path + '首页.js']); break;
    }
}();