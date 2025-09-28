'use strict';
!function () {
    let path = "admin/js/Shopee/聊聊/"
    let loginPath = [
        "admin/js/Shopee/common.js",
        "admin/js/Shopee/common_login.js",
        "admin/js/Shopee/common_登录.js"
    ]
    switch (o.params.jsFile) {
        case "js01": Tool.scriptArr(loginPath.concat([
            path + '获取聊聊信息.js'
        ])); break;
        default: Tool.scriptArr(["admin/js/Shopee/common.js", path + '首页.js']);
    }
}();