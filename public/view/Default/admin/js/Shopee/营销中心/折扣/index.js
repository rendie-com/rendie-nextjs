'use strict';
!function () {
    let path = "admin/js/Shopee/营销中心/折扣/"
    let commonPath = "admin/js/Shopee/common.js"
    let loginPath = ["admin/js/Shopee/common_login.js", "admin/js/Shopee/common_登录.js"]
    switch (o.params.jsFile2) {
        case "01": Tool.scriptArr(loginPath.concat([commonPath, path + '更多_all/获取【折扣】信息/common.js', path + '更多_all/获取【折扣】信息/index.js'])); break;
        case "js08": Tool.scriptArr(loginPath.concat([path + '折扣/状态_删除.js'])); break;
        case "js18": Tool.scriptArr(loginPath.concat([path + '折扣/状态_结束.js'])); break;
        default: Tool.scriptArr([commonPath, path + '../common.js', path + '首页.js']); break;
    }
}();